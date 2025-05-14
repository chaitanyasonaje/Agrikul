import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { getServerSession } from "@/lib/auth";
import ThemeToggle from "./ThemeToggle";
import Card from "@/components/ui/Card";
import CartButton from "@/components/cart/CartButton";

export const metadata: Metadata = {
  title: "Marketplace - Agrikul",
  description: "Browse agricultural products from farmers",
};

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  await dbConnect();
  
  // Extract filter parameters from searchParams
  // Next.js 15 requires awaiting searchParams properties
  const params = await searchParams;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const query = typeof params.q === 'string' ? params.q : undefined;
  const page = parseInt(typeof params.page === 'string' ? params.page : '1');
  const limit = 12;
  
  // Build the query object
  const queryObj: any = { status: 'available' };
  if (category) queryObj.category = category;
  if (query) queryObj.$text = { $search: query };
  
  // Fetch products based on filters
  const skip = (page - 1) * limit;
  const products = await Product.find(queryObj)
    .populate({
      path: 'farmer',
      select: 'name location.address ratings',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  
  // Get total count for pagination
  const totalCount = await Product.countDocuments(queryObj);
  const totalPages = Math.ceil(totalCount / limit);
  
  // Get categories for filter
  const categories = await Product.distinct('category');
  
  // Check if user is logged in to show appropriate UI elements
  const session = await getServerSession();
  const isLoggedIn = !!session;
  
  return (
    <div className="bg-dark-900 min-h-screen transition-colors duration-300">
      <header className="bg-dark-800 text-white shadow-neuro transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:scale-105 transition-transform duration-200">
            <span className="gradient-text">Agrikul</span>
          </Link>
          <div className="space-x-6">
            <Link href="/" className="text-gray-300 hover:text-cyan-glow transition-colors duration-200">Home</Link>
            <Link href="/marketplace" className="text-cyan-glow border-b-2 border-cyan-glow transition-colors duration-200">Marketplace</Link>
            <Link href="/about" className="text-gray-300 hover:text-cyan-glow transition-colors duration-200">About</Link>
            <Link href="/contact" className="text-gray-300 hover:text-cyan-glow transition-colors duration-200">Contact</Link>
          </div>
          <div className="space-x-4 flex items-center">
            {/* Theme toggle button */}
            <ThemeToggle />
            
            {/* Cart button */}
            <CartButton />
            
            {isLoggedIn ? (
              <Link href="/dashboard" className="px-4 py-2 rounded neuro-button text-cyan-glow hover:shadow-glow transition-all duration-300">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="px-4 py-2 rounded neuro-button text-cyan-glow hover:shadow-glow transition-all duration-300">
                  Login
                </Link>
                <Link href="/auth/register" className="px-4 py-2 rounded bg-gradient-to-r from-cyan-glow to-magenta-glow text-white hover:shadow-glow transition-all duration-300">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 animate-fadeIn">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar filters */}
          <Card className="w-full md:w-64 p-4 hover:shadow-glow transition-shadow duration-300">
            <h2 className="text-lg font-semibold mb-4 text-white">
              <span className="gradient-text">Filters</span>
            </h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-gray-300">Categories</h3>
              <div className="space-y-2">
                <Link 
                  href="/marketplace" 
                  className={`block px-2 py-1 rounded transition-colors duration-200 ${!category ? 'bg-green-900/30 text-green-400 border border-green-700/50' : 'hover:bg-dark-800 text-gray-300'}`}
                >
                  All Categories
                </Link>
                
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/marketplace?category=${cat}`}
                    className={`block px-2 py-1 rounded transition-colors duration-200 ${category === cat ? 'bg-green-900/30 text-green-400 border border-green-700/50' : 'hover:bg-dark-800 text-gray-300'}`}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-gray-300">Price Range</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 p-2 border rounded bg-dark-800 border-gray-700 text-white focus:ring-2 focus:ring-cyan-glow transition-all duration-200"
                />
                <span className="text-gray-300">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 p-2 border rounded bg-dark-800 border-gray-700 text-white focus:ring-2 focus:ring-cyan-glow transition-all duration-200"
                />
              </div>
              <button className="w-full mt-2 bg-gradient-to-r from-cyan-glow to-magenta-glow text-white py-2 rounded hover:shadow-glow transition-all duration-300">
                Apply
              </button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 text-gray-300">Quality</h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="rounded bg-dark-800 border-gray-700 text-cyan-glow focus:ring-cyan-glow transition-colors duration-200" />
                  <span className="ml-2 text-gray-300">Organic</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="rounded bg-dark-800 border-gray-700 text-cyan-glow focus:ring-cyan-glow transition-colors duration-200" />
                  <span className="ml-2 text-gray-300">Certified</span>
                </label>
              </div>
            </div>
          </Card>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white animate-fadeIn">
                <span className="gradient-text">Agricultural Products</span>
              </h1>
              
              <div className="flex">
                <form action="/marketplace" method="GET">
                  <div className="flex">
                    <input
                      type="text"
                      name="q"
                      placeholder="Search products..."
                      defaultValue={query}
                      className="p-2 border border-r-0 rounded-l-md focus:outline-none focus:border-cyan-glow bg-dark-800 border-gray-700 text-white transition-colors duration-200"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-cyan-glow to-magenta-glow text-white p-2 rounded-r-md hover:shadow-glow transition-all duration-300"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {products.length === 0 ? (
              <Card className="p-6 text-center py-12 animate-fadeIn">
                <h2 className="text-2xl font-medium text-gray-300">No products found</h2>
                <p className="mt-2 text-gray-400">
                  Try adjusting your filters or search query
                </p>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product: any, index: number) => (
                    <Card
                      key={product._id} 
                      className="overflow-hidden hover:shadow-glow hover:scale-[1.02] transition-all duration-300 animate-fadeIn" 
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="h-48 bg-dark-800 relative">
                        {product.images && product.images.length > 0 ? (
                          <div className="h-full w-full relative">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">Product Image</div>
                          </div>
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            No Image Available
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-green-900/50 text-green-400 px-2 py-1 rounded-full text-xs border border-green-700/50">
                          {product.quality.organic ? 'Organic' : 'Conventional'}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h2 className="text-lg font-semibold text-white">
                            <Link href={`/marketplace/product/${product._id}`} className="hover:text-cyan-glow transition-colors duration-200">
                              {product.name}
                            </Link>
                          </h2>
                          <div className="flex items-center text-yellow-500">
                            <span className="text-sm mr-1">★</span>
                            <span className="text-sm font-medium text-gray-300">
                              {product.ratings.average.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 text-sm mt-1">
                          {product.description.substring(0, 80)}
                          {product.description.length > 80 ? '...' : ''}
                        </p>
                        
                        <div className="mt-3 flex justify-between items-center">
                          <div>
                            <p className="text-lg font-bold text-cyan-glow">
                              ${product.price.amount.toFixed(2)}/{product.price.unit}
                            </p>
                            <p className="text-xs text-gray-400">
                              {product.quantity.available} {product.quantity.unit} available
                            </p>
                          </div>
                          
                          <Link
                            href={`/marketplace/product/${product._id}`}
                            className="px-3 py-1 bg-gradient-to-r from-cyan-glow to-magenta-glow text-white rounded hover:shadow-glow transition-all duration-300 transform hover:translate-y-[-2px]"
                          >
                            View Details
                          </Link>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400 flex justify-between items-center">
                          <div>From: {product.farmer.name}</div>
                          <div>{product.farmer.location?.address?.city || "Location unavailable"}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 space-x-2">
                    {page > 1 && (
                      <Link
                        href={`/marketplace?page=${page - 1}${category ? `&category=${category}` : ''}${query ? `&q=${query}` : ''}`}
                        className="px-3 py-1 rounded bg-dark-800 text-gray-300 hover:text-cyan-glow border border-gray-700 transition-colors duration-300"
                      >
                        Previous
                      </Link>
                    )}
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show current page and surrounding pages
                      const pageNum = Math.min(
                        Math.max(page - 2, 1) + i,
                        totalPages
                      );
                      return (
                        <Link
                          key={pageNum}
                          href={`/marketplace?page=${pageNum}${category ? `&category=${category}` : ''}${query ? `&q=${query}` : ''}`}
                          className={`px-3 py-1 rounded transition-colors duration-300 ${
                            pageNum === page
                              ? 'bg-gradient-to-r from-cyan-glow to-magenta-glow text-white'
                              : 'bg-dark-800 text-gray-300 hover:text-cyan-glow border border-gray-700'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                    
                    {page < totalPages && (
                      <Link
                        href={`/marketplace?page=${page + 1}${category ? `&category=${category}` : ''}${query ? `&q=${query}` : ''}`}
                        className="px-3 py-1 rounded bg-dark-800 text-gray-300 hover:text-cyan-glow border border-gray-700 transition-colors duration-300"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-dark-800 mt-12 py-8 shadow-neuro">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Agrikul Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 