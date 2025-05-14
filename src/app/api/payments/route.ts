import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  await dbConnect();
  
  try {
    const body = await req.json();
    const { items, farmerId, shippingInfo } = body;
    
    if (!items || !items.length || !farmerId || !shippingInfo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Fetch product details to calculate accurate prices and verify availability
    const productIds = items.map((item: any) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    
    let totalAmount = 0;
    const lineItems = [];
    const orderItems = [];
    
    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.productId);
      
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 });
      }
      
      if (product.quantity.available < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient quantity available for ${product.name}` 
        }, { status: 400 });
      }
      
      const subtotal = product.price.amount * item.quantity;
      totalAmount += subtotal;
      
      // Create Stripe line item
      lineItems.push({
        price_data: {
          currency: product.price.currency.toLowerCase(),
          product_data: {
            name: product.name,
            description: `${item.quantity} ${product.quantity.unit} of ${product.name}`,
          },
          unit_amount: Math.round(product.price.amount * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      });
      
      // Create order item
      orderItems.push({
        product: product._id,
        name: product.name,
        price: {
          amount: product.price.amount,
          currency: product.price.currency,
          unit: product.price.unit,
        },
        quantity: item.quantity,
        subtotal,
      });
    }
    
    // Create a new pending order in the database
    const order = await Order.create({
      buyer: session.user.id,
      farmer: farmerId,
      items: orderItems,
      totalAmount,
      currency: "USD", // Default currency
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: "stripe",
      shipping: {
        address: shippingInfo.address,
        contactName: shippingInfo.contactName,
        contactPhone: shippingInfo.contactPhone,
        instructions: shippingInfo.instructions,
      },
    });
    
    // Create a Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        orderId: order._id.toString(),
        buyerId: session.user.id,
        farmerId,
      },
      description: `Order #${order.orderNumber}`,
    });
    
    // Update order with payment intent ID
    await Order.findByIdAndUpdate(order._id, {
      paymentId: paymentIntent.id,
    });
    
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
      orderNumber: order.orderNumber,
    });
    
  } catch (error: any) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Payment processing failed", details: error.message },
      { status: 500 }
    );
  }
}

// Webhook to handle Stripe events
export async function PUT(req: NextRequest) {
  const signature = req.headers.get("stripe-signature") as string;
  
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }
  
  let event;
  const body = await req.text();
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }
  
  await dbConnect();
  
  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Update order status
      await Order.findOneAndUpdate(
        { paymentId: paymentIntent.id },
        {
          paymentStatus: "paid",
          status: "processing",
        }
      );
      
      // Update product quantities
      const order = await Order.findOne({ paymentId: paymentIntent.id });
      if (order) {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { "quantity.available": -item.quantity },
          });
        }
      }
      
      break;
      
    case "payment_intent.payment_failed":
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Update order status
      await Order.findOneAndUpdate(
        { paymentId: failedPaymentIntent.id },
        {
          paymentStatus: "failed",
        }
      );
      
      break;
  }
  
  return NextResponse.json({ received: true });
} 