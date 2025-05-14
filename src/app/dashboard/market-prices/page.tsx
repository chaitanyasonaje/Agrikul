import { Metadata } from "next";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import MarketPriceChart from "./MarketPriceChart";
import Card from "@/components/ui/Card";
import DashboardTitle from "@/components/DashboardTitle";
import { MarketPricesDisplay } from "./MarketPricesDisplay";

export const metadata: Metadata = {
  title: "Market Prices - Agrikul",
  description: "Track current market prices for agricultural products",
};

export default async function MarketPricesPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/market-prices");
  }
  
  await dbConnect();
  
  return (
    <div>
      <DashboardTitle 
        title="Market Prices"
        highlightPart="Prices"
        icon="📈"
      />
      
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">
          <span className="gradient-text">Price Overview</span>
        </h2>
        <p className="text-gray-300 mb-6">
          Current market prices for agricultural products across different categories.
          Prices are updated daily based on major agricultural markets.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
            <h3 className="text-lg font-medium mb-3 text-white">Price Trends (Last 7 Days)</h3>
            <MarketPriceChart />
          </div>
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
            <h3 className="text-lg font-medium mb-3 text-white">Commodity Search</h3>
            <div className="bg-dark-900/50 p-4 rounded-lg border border-gray-700/50">
              <p className="text-gray-300 mb-4">
                Use our real-time API to search for current commodity prices across India.
              </p>
              <div className="text-center">
                <a 
                  href="/dashboard/market-prices/search" 
                  className="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-glow to-magenta-glow text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Advanced Search
                </a>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <MarketPricesDisplay />
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">
          <span className="gradient-text">Market Insights</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-dark-900/50 p-4 rounded-lg border border-gray-700/50">
            <h3 className="text-lg font-medium mb-2 text-white">Market Trends</h3>
            <p className="text-gray-300 text-sm mb-4">
              Vegetable prices have risen by 3.5% on average over the past week, primarily due to seasonal changes and reduced supply from northern regions.
            </p>
            <div className="text-cyan-400 text-sm">Last updated: Today</div>
          </div>
          
          <div className="bg-dark-900/50 p-4 rounded-lg border border-gray-700/50">
            <h3 className="text-lg font-medium mb-2 text-white">Price Forecasts</h3>
            <p className="text-gray-300 text-sm mb-4">
              Analysts expect rice prices to stabilize in the coming weeks as new harvests reach the markets, potentially leading to a 5-8% decrease by next month.
            </p>
            <div className="text-cyan-400 text-sm">Source: Agricultural Analysis Board</div>
          </div>
          
          <div className="bg-dark-900/50 p-4 rounded-lg border border-gray-700/50">
            <h3 className="text-lg font-medium mb-2 text-white">Market News</h3>
            <p className="text-gray-300 text-sm mb-4">
              Government introduces new policies to support farmers during the upcoming season, including price guarantees for essential crops and subsidies for transportation.
            </p>
            <div className="text-cyan-400 text-sm">Published: Yesterday</div>
          </div>
        </div>
      </Card>
    </div>
  );
} 