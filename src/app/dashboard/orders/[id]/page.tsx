import { Metadata } from "next";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Order Details - Agrikul",
  description: "View order details and status",
};

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/orders");
  }
  
  await dbConnect();
  
  // In Next.js 15, params is a Promise that needs to be awaited
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;
  
  // Fetch the order with populated references
  const order = await Order.findById(id)
    .populate('buyer', 'name email')
    .populate('farmer', 'name email')
    .populate('items.product', 'name category')
    .lean();
  
  if (!order) {
    notFound();
  }
  
  // Check if the user has permission to view this order
  const isFarmer = session.user.userType === "farmer";
  const hasPermission = 
    (isFarmer && order.farmer._id.toString() === session.user.id) || 
    (!isFarmer && order.buyer._id.toString() === session.user.id);
  
  if (!hasPermission) {
    redirect("/dashboard/orders");
  }
  
  // Format date for display
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Status color mapping
  const statusColors = {
    pending: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-yellow-100 text-yellow-800',
    delivered: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
  };
  
  // Payment status color mapping
  const paymentStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    refunded: 'bg-purple-100 text-purple-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <Link
          href="/dashboard/orders"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Back to Orders
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Order #{order.orderNumber}</h2>
              <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
              <div className="flex items-center mb-2">
                <span className="mr-2 text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-gray-600">Payment:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors]}`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Buyer Information</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-800"><strong>Name:</strong> {order.buyer.name}</p>
                <p className="text-gray-800"><strong>Email:</strong> {order.buyer.email}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Seller Information</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-800"><strong>Name:</strong> {order.farmer.name}</p>
                <p className="text-gray-800"><strong>Email:</strong> {order.farmer.email}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Shipping Information</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-800"><strong>Address:</strong> {order.shipping.address}</p>
              <p className="text-gray-800"><strong>Contact Name:</strong> {order.shipping.contactName}</p>
              <p className="text-gray-800"><strong>Contact Phone:</strong> {order.shipping.contactPhone}</p>
              {order.shipping.instructions && (
                <p className="text-gray-800"><strong>Instructions:</strong> {order.shipping.instructions}</p>
              )}
              {order.estimatedDelivery && (
                <p className="text-gray-800">
                  <strong>Estimated Delivery:</strong> {formatDate(order.estimatedDelivery)}
                </p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Order Items</h3>
            <div className="bg-gray-50 rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        {item.product && (
                          <div className="text-xs text-gray-500">
                            {item.product.category}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.price.amount.toFixed(2)} {item.price.currency}/{item.price.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.subtotal.toFixed(2)} {order.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                      Total
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                      {order.totalAmount.toFixed(2)} {order.currency}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          {order.notes && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Order Notes</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-800">{order.notes}</p>
              </div>
            </div>
          )}
          
          {isFarmer && order.status !== 'delivered' && order.status !== 'canceled' && (
            <div className="flex justify-end space-x-4">
              <Link
                href={`/dashboard/orders/${order._id}/update`}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Update Order Status
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 