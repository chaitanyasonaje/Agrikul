"use client";

import { useState, useEffect } from "react";
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

export function MarketPricesDisplay() {
  const [marketPrices, setMarketPrices] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  
  useEffect(() => {
    async function fetchMarketPrices() {
      try {
        setLoading(true);
        const response = await fetch('/api/market-prices');
        
        if (!response.ok) {
          throw new Error('Failed to fetch market prices');
        }
        
        // Check if we're using mock data or real API data
        const source = response.headers.get('X-Data-Source') || 'unknown';
        setDataSource(source);
        
        const data = await response.json();
        setMarketPrices(data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching market prices:', err);
        setError(err.message || 'An error occurred while fetching market prices');
        setLoading(false);
      }
    }
    
    fetchMarketPrices();
  }, []);
  
  if (loading) {
    return (
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-glow"></div>
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-6 mb-6 bg-red-900/30 border border-red-500/30">
        <h2 className="text-xl font-semibold mb-4 text-white">
          <span className="gradient-text">Error Loading Market Data</span>
        </h2>
        <p className="text-red-400 mb-2">{error}</p>
        <p className="text-sm text-gray-400">
          Please try refreshing the page or try again later.
        </p>
      </Card>
    );
  }
  
  if (!marketPrices || marketPrices.length === 0) {
    return (
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">
          <span className="gradient-text">Market Prices</span>
        </h2>
        <p className="text-gray-400">No market price data available at this time.</p>
      </Card>
    );
  }
  
  return (
    <>
      {dataSource.includes('mock') && (
        <div className="mb-4 px-4 py-2 bg-yellow-900/30 border border-yellow-500/30 rounded-md">
          <p className="text-yellow-400 text-sm">
            <span className="font-bold">Note:</span> Currently displaying sample data. Real-time API data will be shown when available.
          </p>
        </div>
      )}
      
      {marketPrices.map((category, index) => (
        <Card key={index} className="p-6 mb-6">
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
                    Trend
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Market
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {product.trend === 'up' ? (
                        <span className="text-green-400">↑ Rising</span>
                      ) : product.trend === 'down' ? (
                        <span className="text-red-400">↓ Falling</span>
                      ) : (
                        <span className="text-gray-400">→ Stable</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {product.market || '-'} 
                      {product.lastUpdated && (
                        <span className="block text-xs text-gray-400">
                          Updated: {product.lastUpdated}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </>
  );
} 