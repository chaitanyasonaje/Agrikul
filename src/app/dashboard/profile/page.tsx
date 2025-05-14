import { Metadata } from "next";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import ProfileForm from "./ProfileForm";
import Card from "@/components/ui/Card";
import DashboardTitle from "@/components/DashboardTitle";

export const metadata: Metadata = {
  title: "Profile - Agrikul",
  description: "Manage your profile and account settings",
};

export default async function ProfilePage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/profile");
  }
  
  await dbConnect();
  
  // Fetch full user data from MongoDB
  const user = await User.findById(session.user.id).lean();
  
  if (!user) {
    redirect("/auth/login");
  }
  
  const isFarmer = user.userType === "farmer";
  
  return (
    <div>
      <DashboardTitle 
        title="My Profile"
        highlightPart="Profile"
        icon="👤"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              <span className="gradient-text">Personal Information</span>
            </h2>
            <ProfileForm user={user} />
          </Card>
          
          {/* Farm/Business Details - Only for farmers */}
          {isFarmer && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">
                <span className="gradient-text">Farm Details</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Farm Name</h3>
                  <p className="text-white">{user.farm?.name || "Not specified"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Farm Size</h3>
                  <p className="text-white">{user.farm?.size ? `${user.farm.size} ${user.farm.sizeUnit}` : "Not specified"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Primary Crops</h3>
                  <p className="text-white">
                    {user.farm?.primaryCrops?.length > 0
                      ? user.farm.primaryCrops.join(", ")
                      : "Not specified"}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Farming Methods</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user.farm?.farmingMethods?.map((method, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-700/50"
                      >
                        {method}
                      </span>
                    ))}
                    {!user.farm?.farmingMethods?.length && <p className="text-gray-400">Not specified</p>}
                  </div>
                </div>
                
                <div className="pt-4">
                  <Link
                    href="/dashboard/profile/farm"
                    className="text-cyan-glow hover:text-blue-glow font-medium text-sm transition-colors duration-300"
                  >
                    Edit Farm Details →
                  </Link>
                </div>
              </div>
            </Card>
          )}
          
          {/* Buyer Preferences - Only for buyers */}
          {!isFarmer && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">
                <span className="gradient-text">Purchase Preferences</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Preferred Product Categories</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user.preferences?.categories?.map((category, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-700/50"
                      >
                        {category}
                      </span>
                    ))}
                    {!user.preferences?.categories?.length && <p className="text-gray-400">Not specified</p>}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Quality Preferences</h3>
                  <p className="text-white">
                    {user.preferences?.qualityPreference || "Not specified"}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Purchase Volume</h3>
                  <p className="text-white">
                    {user.preferences?.purchaseVolume || "Not specified"}
                  </p>
                </div>
                
                <div className="pt-4">
                  <Link
                    href="/dashboard/profile/preferences"
                    className="text-cyan-glow hover:text-blue-glow font-medium text-sm transition-colors duration-300"
                  >
                    Edit Preferences →
                  </Link>
                </div>
              </div>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card className="p-6">
            <div className="text-center">
              <div className="h-24 w-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold neuro-card">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-xl font-semibold text-white">{user.name}</h2>
              <p className="text-gray-300 mb-2">{isFarmer ? "Farmer" : "Buyer"}</p>
              <p className="text-sm text-gray-400">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Profile Completion</span>
                <span className="text-sm font-medium text-white">75%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-cyan-glow to-magenta-glow h-2.5 rounded-full" style={{ width: "75%" }}></div>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Complete your profile to improve visibility and build trust with other users.
              </p>
            </div>
          </Card>
          
          {/* Quick Links */}
          <Card className="p-6">
            <h3 className="font-medium mb-4 text-white">
              <span className="gradient-text">Account Settings</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard/settings" className="text-gray-300 hover:text-cyan-glow text-sm flex items-center transition-colors duration-300">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  General Settings
                </Link>
              </li>
              <li>
                <Link href="/dashboard/settings/security" className="text-gray-300 hover:text-cyan-glow text-sm flex items-center transition-colors duration-300">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  Security & Privacy
                </Link>
              </li>
              <li>
                <Link href="/dashboard/settings/notifications" className="text-gray-300 hover:text-cyan-glow text-sm flex items-center transition-colors duration-300">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                  Notifications
                </Link>
              </li>
              <li>
                <Link href="/dashboard/settings/payment" className="text-gray-300 hover:text-cyan-glow text-sm flex items-center transition-colors duration-300">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                  Payment Methods
                </Link>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
} 