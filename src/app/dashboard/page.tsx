import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatusIndicator from "@/components/ui/StatusIndicator";
import DashboardTitle from "@/components/DashboardTitle";

export const metadata: Metadata = {
  title: "Dashboard - Agrikul",
  description: "Agrikul User Dashboard",
};

export default async function DashboardPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }
  
  const { user } = session;
  const isFarmer = user.userType === "farmer";
  
  // Mock data for visualization
  const farmerStats = [
    { type: "success", label: "Active Products", value: "12" },
    { type: "info", label: "Total Orders", value: "28" },
    { type: "heart", label: "Buyer Rating", value: "4.8", unit: "/5" },
    { type: "spo2", label: "Completion Rate", value: "97", unit: "%" }
  ];
  
  const buyerStats = [
    { type: "success", label: "Orders Placed", value: "16" },
    { type: "info", label: "Saved Farmers", value: "8" },
    { type: "heart", label: "Satisfaction", value: "4.9", unit: "/5" },
    { type: "spo2", label: "Orders Completed", value: "14" }
  ];
  
  const stats = isFarmer ? farmerStats : buyerStats;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <DashboardTitle 
        title={`Welcome, ${user.name}!`}
        highlightPart={user.name}
        subtitle={`You are logged in as a ${isFarmer ? "Farmer" : "Buyer"}.`}
        icon="👋"
      />
      
      {/* Stats Section */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4 text-white">Your <span className="gradient-text">Analytics</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatusIndicator 
              key={stat.label}
              type={stat.type as any}
              label={stat.label}
              value={stat.value}
              unit={stat.unit}
              className="neuro-card"
            />
          ))}
        </div>
      </div>
      
      {/* Quick Actions */}
      <h2 className="text-xl font-bold mb-4 text-white">Quick <span className="gradient-text">Actions</span></h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {isFarmer ? (
          <>
            <Card glowColor="cyan" className="h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-3">My Products</h3>
              <p className="text-gray-400 mb-4 flex-1">Manage your product listings and inventory.</p>
              <Button href="/dashboard/products" variant="gradient" className="w-full">
                View Products
              </Button>
            </Card>
            
            <Card glowColor="magenta" className="h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-3">Orders</h3>
              <p className="text-gray-400 mb-4 flex-1">View and manage orders from buyers.</p>
              <Button href="/dashboard/orders" variant="primary" className="w-full">
                View Orders
              </Button>
            </Card>
            
            <Card glowColor="blue" className="h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-3">Crop Recommendations</h3>
              <p className="text-gray-400 mb-4 flex-1">Get soil-based crop recommendations for optimal yield.</p>
              <Button href="/dashboard/crop-recommendations" variant="primary" className="w-full">
                Get Recommendations
              </Button>
            </Card>
          </>
        ) : (
          <>
            <Card glowColor="cyan" className="h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-3">Marketplace</h3>
              <p className="text-gray-400 mb-4 flex-1">Browse products from farmers and make purchases.</p>
              <Button href="/marketplace" variant="gradient" className="w-full">
                Browse Products
              </Button>
            </Card>
            
            <Card glowColor="magenta" className="h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-3">My Orders</h3>
              <p className="text-gray-400 mb-4 flex-1">View and track your orders.</p>
              <Button href="/dashboard/orders" variant="primary" className="w-full">
                View Orders
              </Button>
            </Card>
            
            <Card glowColor="blue" className="h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-3">Saved Farmers</h3>
              <p className="text-gray-400 mb-4 flex-1">View your favorite farmers and their products.</p>
              <Button href="/dashboard/saved-farmers" variant="primary" className="w-full">
                View Saved Farmers
              </Button>
            </Card>
          </>
        )}
      </div>
      
      {/* Additional Tools */}
      <h2 className="text-xl font-bold mb-4 text-white">Essential <span className="gradient-text">Tools</span></h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="h-full flex flex-col">
          <h3 className="text-lg font-semibold mb-3">Messages</h3>
          <p className="text-gray-400 mb-4 flex-1">View and send messages to your contacts.</p>
          <Button href="/dashboard/messages" variant="outline" className="w-full">
            Open Messages
          </Button>
        </Card>
        
        <Card className="h-full flex flex-col">
          <h3 className="text-lg font-semibold mb-3">Weather Updates</h3>
          <p className="text-gray-400 mb-4 flex-1">Get real-time weather updates for your area.</p>
          <Button href="/dashboard/weather" variant="outline" className="w-full">
            Check Weather
          </Button>
        </Card>
        
        <Card className="h-full flex flex-col">
          <h3 className="text-lg font-semibold mb-3">AI Chatbot</h3>
          <p className="text-gray-400 mb-4 flex-1">Get intelligent assistance for your agricultural needs.</p>
          <Button href="/dashboard/chatbot" variant="outline" className="w-full">
            Chat Now
          </Button>
        </Card>
      </div>
    </div>
  );
} 