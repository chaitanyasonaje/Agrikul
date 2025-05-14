import { Metadata } from "next";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import SettingsSidebar from "../SettingsSidebar";
import SecurityPrivacyForm from "./SecurityPrivacyForm";

export const metadata: Metadata = {
  title: "Security & Privacy - Agrikul",
  description: "Manage your account security and privacy settings",
};

export default async function SecurityPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/settings/security");
  }
  
  await dbConnect();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 gradient-text">Account Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <SettingsSidebar activePage="security" />
        </div>
        
        <div className="md:col-span-3">
          <div className="neuro-card p-6 bg-dark-800 rounded-lg relative overflow-hidden">
            {/* Gradient accent line */}
            <div className="h-1 w-full bg-gradient-text absolute top-0 left-0"></div>
            
            {/* Blurred gradient orb */}
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-cyan-glow/5 filter blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-xl font-semibold mb-6 text-white">Security & Privacy</h2>
              
              <SecurityPrivacyForm user={session.user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 