import { Metadata } from "next";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Card from "@/components/ui/Card";
import DashboardTitle from "@/components/DashboardTitle";
import MarketPriceSearch from "./MarketPriceSearch";

export const metadata: Metadata = {
  title: "Search Market Prices - Agrikul",
  description: "Search for specific agricultural product prices across different markets",
};

export default async function MarketPriceSearchPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/market-prices/search");
  }
  
  await dbConnect();
  
  return (
    <div>
      <DashboardTitle 
        title="Search Market Prices"
        highlightPart="Search"
        icon="🔍"
      />
      
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">
          <span className="gradient-text">Product Search</span>
        </h2>
        <p className="text-gray-300 mb-6">
          Search for specific agricultural products to get current market prices across different markets in India.
        </p>
        
        <MarketPriceSearch />
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            <span className="gradient-text">Popular Searches</span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-dark-900/50 rounded-lg border border-gray-700/50 hover:border-cyan-glow/50 transition-colors cursor-pointer">
              <h3 className="text-white font-medium">Rice</h3>
              <p className="text-sm text-gray-400">All varieties</p>
            </div>
            <div className="p-3 bg-dark-900/50 rounded-lg border border-gray-700/50 hover:border-cyan-glow/50 transition-colors cursor-pointer">
              <h3 className="text-white font-medium">Tomatoes</h3>
              <p className="text-sm text-gray-400">Seasonal vegetables</p>
            </div>
            <div className="p-3 bg-dark-900/50 rounded-lg border border-gray-700/50 hover:border-cyan-glow/50 transition-colors cursor-pointer">
              <h3 className="text-white font-medium">Apples</h3>
              <p className="text-sm text-gray-400">Himalayan varieties</p>
            </div>
            <div className="p-3 bg-dark-900/50 rounded-lg border border-gray-700/50 hover:border-cyan-glow/50 transition-colors cursor-pointer">
              <h3 className="text-white font-medium">Wheat</h3>
              <p className="text-sm text-gray-400">All varieties</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            <span className="gradient-text">Search By Category</span>
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <a 
              href="/dashboard/market-prices?category=Grains" 
              className="p-3 bg-dark-900/50 rounded-lg border border-gray-700/50 hover:border-cyan-glow/50 transition-colors block"
            >
              <h3 className="text-white font-medium">Grains & Cereals</h3>
              <p className="text-sm text-gray-400">Rice, Wheat, Corn, Millets, etc.</p>
            </a>
            <a 
              href="/dashboard/market-prices?category=Vegetables" 
              className="p-3 bg-dark-900/50 rounded-lg border border-gray-700/50 hover:border-cyan-glow/50 transition-colors block"
            >
              <h3 className="text-white font-medium">Vegetables</h3>
              <p className="text-sm text-gray-400">Tomatoes, Potatoes, Onions, Cauliflower, etc.</p>
            </a>
            <a 
              href="/dashboard/market-prices?category=Fruits" 
              className="p-3 bg-dark-900/50 rounded-lg border border-gray-700/50 hover:border-cyan-glow/50 transition-colors block"
            >
              <h3 className="text-white font-medium">Fruits</h3>
              <p className="text-sm text-gray-400">Apples, Bananas, Oranges, Mangoes, etc.</p>
            </a>
          </div>
        </Card>
      </div>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">
          <span className="gradient-text">About Market Price Data</span>
        </h2>
        <div className="text-gray-300 space-y-4">
          <p>
            Our market price data is sourced from the Agricultural Marketing Information Network (AGMARKNET) and is updated daily.
            The data includes prices from major agricultural markets across India.
          </p>
          <p>
            Price trends are calculated based on 7-day moving averages, and price forecasts are generated using historical data and seasonal patterns.
          </p>
          <p>
            For any queries about market price data, please contact our support team.
          </p>
        </div>
      </Card>
    </div>
  );
} 