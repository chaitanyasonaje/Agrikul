import { Metadata } from "next";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Card from "@/components/ui/Card";
import DashboardTitle from "@/components/DashboardTitle";
import EmptyState from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "My Orders - Agrikul",
  description: "View and manage your orders",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/orders");
  }
  
  await dbConnect();
  
  // In Next.js 15, searchParams is a Promise that needs to be awaited
  const params = await Promise.resolve(searchParams);
  const pageParam = params.page || '1';
  const page = parseInt(typeof pageParam === 'string' ? pageParam : '1');
  const limit = 10;
  const skip = (page - 1) * limit;
  
  const isFarmer = session.user.userType === "farmer";
  
  // Query based on user type
  const queryField = isFarmer ? "farmer" : "buyer";
  
  // Get user's orders with pagination
  const orders = await Order.find({ [queryField]: session.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate(isFarmer ? 'buyer' : 'farmer', 'name email')
    .lean();
  
  // Get total count for pagination
  const totalCount = await Order.countDocuments({ [queryField]: session.user.id });
  const totalPages = Math.ceil(totalCount / limit);
  
  // Status color mapping
  const statusColors = {
    pending: 'bg-status-info/20 text-status-info',
    processing: 'bg-status-warning/20 text-status-warning',
    shipped: 'bg-status-heart/20 text-status-heart',
    delivered: 'bg-status-success/20 text-status-success',
    canceled: 'bg-status-danger/20 text-status-danger',
  };
  
  // Payment status color mapping
  const paymentStatusColors = {
    pending: 'bg-status-warning/20 text-status-warning',
    paid: 'bg-status-success/20 text-status-success',
    refunded: 'bg-status-heart/20 text-status-heart',
    failed: 'bg-status-danger/20 text-status-danger',
  };
  
  return (
    <div>
      <DashboardTitle 
        title={isFarmer ? "Customer Orders" : "My Orders"}
        highlightPart="Orders"
        icon="📦"
      />
      
      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description={isFarmer 
            ? "You haven't received any orders yet." 
            : "You haven't placed any orders yet."
          }
          icon="📦"
          actionLabel={!isFarmer ? "Browse Products" : undefined}
          actionHref={!isFarmer ? "/marketplace" : undefined}
        />
      ) : (
        <>
          <Card className="overflow-hidden p-0" hoverEffect={false}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-dark-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Order
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {isFarmer ? "Customer" : "Seller"}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Payment
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {orders.map((order: any) => (
                    <tr key={order._id} className="hover:bg-dark-900/30 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {order.orderNumber}
                        </div>
                        <div className="text-xs text-gray-400">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {isFarmer ? order.buyer.name : order.farmer.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {isFarmer ? order.buyer.email : order.farmer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {order.totalAmount.toFixed(2)} {order.currency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status as keyof typeof statusColors]}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors]}`}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/dashboard/orders/${order._id}`}
                          className="text-cyan-glow hover:text-white transition-colors"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                {page > 1 && (
                  <Link
                    href={`/dashboard/orders?page=${page - 1}`}
                    className="px-3 py-1 rounded-md neuro-button flex items-center justify-center hover:shadow-glow transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </Link>
                )}
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/dashboard/orders?page=${pageNum}`}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      pageNum === page
                        ? 'gradient-text font-bold neuro-button shadow-glow'
                        : 'text-white neuro-button hover:shadow-glow'
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}
                
                {page < totalPages && (
                  <Link
                    href={`/dashboard/orders?page=${page + 1}`}
                    className="px-3 py-1 rounded-md neuro-button flex items-center justify-center hover:shadow-glow transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                )}
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
} 