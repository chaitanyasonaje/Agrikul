import { Metadata } from "next";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { notFound } from "next/navigation";
import OrderStatusForm from "./OrderStatusForm";

export const metadata: Metadata = {
  title: "Update Order Status - Agrikul",
  description: "Update the status of an order",
};

export default async function UpdateOrderStatusPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/orders");
  }
  
  // Only farmers can update order status
  if (session.user.userType !== "farmer") {
    redirect("/dashboard/orders");
  }
  
  await dbConnect();
  
  // In Next.js 15, params is a Promise that needs to be awaited
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;
  
  // Fetch the order
  const order = await Order.findById(id)
    .populate('buyer', 'name email')
    .lean();
  
  if (!order) {
    notFound();
  }
  
  // Check if the farmer owns this order
  if (order.farmer.toString() !== session.user.id) {
    redirect("/dashboard/orders");
  }
  
  // Prevent updates to delivered or canceled orders
  if (order.status === "delivered" || order.status === "canceled") {
    redirect(`/dashboard/orders/${id}`);
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Update Order Status</h1>
        <Link
          href={`/dashboard/orders/${id}`}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Back to Order
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Order #{order.orderNumber}</h2>
            <p className="text-gray-600">Customer: {order.buyer.name}</p>
            <p className="text-gray-600">Current Status: <span className="font-medium">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></p>
          </div>
          
          <OrderStatusForm orderId={id} currentStatus={order.status} />
        </div>
      </div>
    </div>
  );
} 