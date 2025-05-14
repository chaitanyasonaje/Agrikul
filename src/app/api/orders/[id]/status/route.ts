import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    // Check authentication
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Only farmers can update order status
    if (session.user.userType !== "farmer") {
      return NextResponse.json(
        { success: false, message: "Only farmers can update order status" },
        { status: 403 }
      );
    }
    
    await dbConnect();
    
    // Resolve params (for Next.js 15)
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    // Get the order
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }
    
    // Check if this farmer owns the order
    if (order.farmer.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "You don't have permission to update this order" },
        { status: 403 }
      );
    }
    
    // Parse request body
    const data = await req.json();
    const { status, estimatedDelivery, notes } = data;
    
    // Validate status
    const validStatuses = ["pending", "processing", "shipped", "delivered", "canceled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }
    
    // Validate status transition
    const validTransitions = {
      pending: ["processing", "canceled"],
      processing: ["shipped", "canceled"],
      shipped: ["delivered", "canceled"],
      delivered: [],
      canceled: [],
    };
    
    if (!validTransitions[order.status as keyof typeof validTransitions].includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Cannot transition from ${order.status} to ${status}` 
        },
        { status: 400 }
      );
    }
    
    // If status is shipped, estimatedDelivery is required
    if (status === "shipped" && !estimatedDelivery) {
      return NextResponse.json(
        { success: false, message: "Estimated delivery date is required for shipped orders" },
        { status: 400 }
      );
    }
    
    // Update the order
    order.status = status;
    
    if (status === "shipped" && estimatedDelivery) {
      order.estimatedDelivery = new Date(estimatedDelivery);
    }
    
    if (status === "delivered") {
      order.deliveredAt = new Date();
    }
    
    if (notes) {
      // Append to existing notes or create new ones
      if (order.notes) {
        order.notes = `${order.notes}\n\n${new Date().toISOString()} - Status updated to ${status}:\n${notes}`;
      } else {
        order.notes = `${new Date().toISOString()} - Status updated to ${status}:\n${notes}`;
      }
    }
    
    await order.save();
    
    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      order: {
        _id: order._id,
        status: order.status,
        estimatedDelivery: order.estimatedDelivery,
        deliveredAt: order.deliveredAt,
      },
    });
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update order status" },
      { status: 500 }
    );
  }
} 