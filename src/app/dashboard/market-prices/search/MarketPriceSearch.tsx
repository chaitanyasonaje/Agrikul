"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/ui/Card";

interface Product {
  name: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  priceHistory: number[];
  market?: string;
  state?: string;
  district?: string;
  lastUpdated?: string;
}

interface CategoryData {
  category: string;
  products: Product[];
}

export default function MarketPriceSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('commodity') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CategoryData[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm && !category) {
      setError("Please enter a search term or select a category");
      return;
    }
    
    setIsSearching(true);
    setError(null);
    
    try {
      // Build the query string
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('commodity', searchTerm);
      if (category) queryParams.append('category', category);
      
      // Update URL to reflect search
      router.push(`/dashboard/market-prices/search?${queryParams.toString()}`);
      
      // Fetch results
      const response = await fetch(`/api/market-prices?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch market prices");
      }
      
      const data = await response.json();
      setSearchResults(data);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || "An error occurred while searching for market prices");
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleClear = () => {
    setSearchTerm('');
    setCategory('');
    setSearchResults([]);
    setError(null);
    router.push('/dashboard/market-prices/search');
  };
  
  const categories = [
    { value: "", label: "All Categories" },
    { value: "Grains", label: "Grains & Cereals" },
    { value: "Vegetables", label: "Vegetables" },
    { value: "Fruits", label: "Fruits" },
    { value: "Dairy & Poultry", label: "Dairy & Poultry" },
    { value: "Oils & Oilseeds", label: "Oils & Oilseeds" },
    { value: "Other Products", label: "Other Products" }
  ];
  
  return (
    <div className="space-y-6">
      <div className="bg-dark-900/50 p-6 rounded-lg border border-gray-700/50">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <label htmlFor="commodity" className="block text-sm font-medium text-gray-400 mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="commodity"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. Rice, Tomatoes, Apples"
                className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-glow/50"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {error && (
            <div className="text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-2 bg-gradient-to-r from-cyan-glow to-magenta-glow text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70"
            >
              {isSearching ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              ) : "Search"}
            </button>
          </div>
        </form>
      </div>
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-white">
            Search Results
          </h3>
          
          {searchResults.map((category, index) => (
            <Card key={index} className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">
                <span className="gradient-text">{category.category}</span>
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Current Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Change
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Market
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {category.products.map((product, productIndex) => (
                      <tr key={productIndex} className="hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          ₹{product.price.toFixed(2)} / {product.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`${product.trend === 'up' ? 'text-green-400' : product.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                            {product.trend === 'up' ? '+' : product.trend === 'down' ? '-' : ''}
                            {product.changePercent}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {product.market || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {product.district && product.state ? 
                            `${product.district}, ${product.state}` : 
                            (product.state || '-')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* No Results */}
      {searchTerm && searchResults.length === 0 && !isSearching && !error && (
        <div className="bg-dark-900/50 p-6 rounded-lg border border-gray-700/50 text-center">
          <p className="text-gray-400 mb-2">No results found for "{searchTerm}"</p>
          <p className="text-sm text-gray-500">
            Try using different keywords or browse by category
          </p>
        </div>
      )}
    </div>
  );
} 