import { Metadata } from "next";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DashboardTitle from "@/components/DashboardTitle";
import EmptyState from "@/components/EmptyState";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export const metadata: Metadata = {
  title: "My Products - Agrikul",
  description: "Manage your product listings",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/products");
  }
  
  // Only farmers can view this page
  if (session.user.userType !== "farmer") {
    redirect("/dashboard");
  }
  
  await dbConnect();
  
  // In Next.js 15, searchParams is a Promise that needs to be awaited
  const params = await Promise.resolve(searchParams);
  const pageParam = params.page || '1';
  const page = parseInt(typeof pageParam === 'string' ? pageParam : '1');
  const limit = 10;
  const skip = (page - 1) * limit;
  
  // Get farmer's products with pagination
  const products = await Product.find({ farmer: session.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  
  // Get total count for pagination
  const totalCount = await Product.countDocuments({ farmer: session.user.id });
  const totalPages = Math.ceil(totalCount / limit);
  
  return (
    <div>
      <DashboardTitle 
        title="My Products"
        highlightPart="Products"
        icon="🌾"
        actions={
          <Button
            href="/dashboard/products/add"
            variant="gradient"
            size="md"
          >
            Add New Product
          </Button>
        }
      />
      
      {products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="You haven't added any products to your inventory yet."
          icon="🌾"
          actionLabel="Add Your First Product"
          actionHref="/dashboard/products/add"
        />
      ) : (
        <>
          <Card className="overflow-hidden p-0" hoverEffect={false}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-dark-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Added
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {products.map((product: any) => (
                    <tr key={product._id} className="hover:bg-dark-900/30 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-dark-800 rounded-md flex items-center justify-center text-gray-400 text-xs shadow-neuro">
                            {product.images && product.images.length > 0 ? "IMG" : "No IMG"}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{product.name}</div>
                            <div className="text-sm text-gray-400">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {product.price.amount.toFixed(2)} {product.price.currency}/{product.price.unit}
                        </div>
                        <div className="text-xs text-gray-400">
                          {product.price.negotiable ? "Negotiable" : "Fixed"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {product.quantity.available} {product.quantity.unit}
                        </div>
                        <div className="text-xs text-gray-400">
                          Min: {product.quantity.minimum} {product.quantity.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${product.status === 'available' ? 'bg-status-success/20 text-status-success' : 
                          product.status === 'low-stock' ? 'bg-status-warning/20 text-status-warning' :
                          product.status === 'sold-out' ? 'bg-status-danger/20 text-status-danger' : 'bg-gray-700/30 text-gray-300'}`}
                        >
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1).replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/dashboard/products/edit/${product._id}`}
                          className="text-cyan-glow hover:text-white transition-colors mr-4"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/marketplace/product/${product._id}`}
                          className="text-magenta-glow hover:text-white transition-colors"
                        >
                          View
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
                    href={`/dashboard/products?page=${page - 1}`}
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
                    href={`/dashboard/products?page=${pageNum}`}
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
                    href={`/dashboard/products?page=${page + 1}`}
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