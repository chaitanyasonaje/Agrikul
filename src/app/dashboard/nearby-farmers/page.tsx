import { Metadata } from "next";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import DashboardTitle from "@/components/DashboardTitle";
import Card from "@/components/ui/Card";
import { MapPin, Users, Leaf, CropIcon, Navigation, Star, MessageSquare } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import NearbyFarmersList from "@/components/dashboard/NearbyFarmersList";

export const metadata: Metadata = {
  title: "Nearby Farmers - Agrikul",
  description: "Discover farmers near your location and connect with them directly",
};

export default async function NearbyFarmersPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/nearby-farmers");
  }
  
  await dbConnect();
  
  // Fetch current user to get their location
  const currentUser = await User.findById(session.user.id)
    .select("name email userType location")
    .lean();
  
  // Fetch nearby farmers (within 50km) using geospatial query
  const nearbyFarmers = await User.find({
    userType: "farmer",
    _id: { $ne: session.user.id }, // Exclude current user
    "location.coordinates": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: currentUser.location?.coordinates || [0, 0]
        },
        $maxDistance: 50000 // 50km in meters
      }
    }
  })
    .select("name location ratings profileImage crops farmType bio")
    .limit(10)
    .lean();
  
  // Get recommended farmers based on crops they grow
  // This would normally use a more complex recommendation algorithm
  const recommendedFarmers = await User.find({
    userType: "farmer",
    _id: { $ne: session.user.id },
    // If current user is a farmer, find farmers with similar crop types
    // If buyer, find farmers with high ratings
    ...(currentUser.userType === "farmer" 
      ? { crops: { $in: currentUser.crops || [] } }
      : { "ratings.average": { $gte: 4 } })
  })
    .select("name location ratings profileImage crops farmType bio")
    .limit(5)
    .lean();
  
  return (
    <div className="animate-fadeIn">
      <DashboardTitle 
        title="Nearby Farmers" 
        subtitle="Connect with farmers in your area" 
        highlightPart="Nearby"
        icon={<MapPin className="text-cyan-glow" />}
      />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Location Card */}
        <Card className="p-6 hover:shadow-glow">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-glow to-magenta-glow flex items-center justify-center text-white shadow-glow mr-3">
              <Navigation size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Your Location</h2>
              <p className="text-gray-400 text-sm">{currentUser.location?.address || "Location not set"}</p>
            </div>
          </div>
          
          {!currentUser.location?.coordinates && (
            <div className="neuro-inset p-4 rounded-lg text-yellow-400 text-sm flex items-center">
              <MapPin size={16} className="mr-2 flex-shrink-0" />
              <p>Please update your location in profile settings to find farmers nearby</p>
            </div>
          )}
        </Card>
        
        {/* Farmers Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nearby Farmers */}
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-700 bg-dark-900 shadow-neuro-inset">
              <div className="flex items-center">
                <Users size={18} className="text-cyan-glow mr-2" />
                <h2 className="font-semibold text-white">
                  <span className="gradient-text">Farmers Near You</span>
                </h2>
              </div>
            </div>
            
            <div className="p-4">
              {nearbyFarmers.length > 0 ? (
                <NearbyFarmersList farmers={nearbyFarmers} currentUserId={session.user.id} />
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <MapPin size={48} className="mx-auto mb-4 text-gray-500" />
                  <p className="mb-2">No farmers found in your area</p>
                  <p className="text-sm text-gray-500">Try expanding your search radius or updating your location</p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Recommended Farmers */}
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-700 bg-dark-900 shadow-neuro-inset">
              <div className="flex items-center">
                <Leaf size={18} className="text-cyan-glow mr-2" />
                <h2 className="font-semibold text-white">
                  <span className="gradient-text">Recommended for You</span>
                </h2>
              </div>
            </div>
            
            <div className="p-4">
              {recommendedFarmers.length > 0 ? (
                <NearbyFarmersList farmers={recommendedFarmers} currentUserId={session.user.id} />
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Star size={48} className="mx-auto mb-4 text-gray-500" />
                  <p className="mb-2">No recommendations available</p>
                  <p className="text-sm text-gray-500">We'll provide recommendations as you use the platform more</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 