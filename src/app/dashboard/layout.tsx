"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Handle client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle loading state
  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <LoadingSpinner size="lg" variant="gradient" />
      </div>
    );
  }
  
  // Ensure user is authenticated
  if (status !== "authenticated") {
    // This shouldn't happen as we redirect in the page, but just in case
    return null;
  }
  
  const isFarmer = session.user.userType === "farmer";
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    ...(isFarmer
      ? [
          { name: "My Products", href: "/dashboard/products", icon: "🌾" },
          { name: "Orders", href: "/dashboard/orders", icon: "📦" },
          { name: "Crop Recommendations", href: "/dashboard/crop-recommendations", icon: "🌱" },
        ]
      : [
          { name: "Marketplace", href: "/marketplace", icon: "🛒" },
          { name: "My Orders", href: "/dashboard/orders", icon: "📦" },
          { name: "Saved Farmers", href: "/dashboard/saved-farmers", icon: "⭐" },
        ]),
    { name: "Messages", href: "/dashboard/messages", icon: "💬" },
    { name: "Weather Updates", href: "/dashboard/weather", icon: "🌤️" },
    { name: "Market Prices", href: "/dashboard/market-prices", icon: "📈" },
    { name: "AI Chatbot", href: "/dashboard/chatbot", icon: "🤖" },
    { name: "Payments", href: "/dashboard/payments", icon: "💰" },
    { name: "Profile", href: "/dashboard/profile", icon: "👤" },
    { name: "Settings", href: "/dashboard/settings", icon: "⚙️" },
  ];
  
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Mobile navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-dark-800 backdrop-blur-md shadow-neuro">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-white hover:text-cyan-glow transition-colors duration-300"
            aria-label="Toggle sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Link href="/" className="relative z-10">
            <h1 className="text-xl font-bold text-white hover:scale-105 transition-transform duration-300">
              <span className="gradient-text">Agrikul</span>
            </h1>
          </Link>
          <button
            onClick={() => signOut()}
            className="p-2 rounded-md text-white hover:text-cyan-glow transition-colors duration-300"
            aria-label="Sign out"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-800 shadow-neuro transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-center border-b border-dark-900">
            <Link href="/" className="relative z-10">
              <h1 className="text-2xl font-bold text-white hover:scale-105 transition-transform duration-300">
                <span className="gradient-text">Agrikul</span>
              </h1>
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                      isActive
                        ? "neuro-button shadow-glow text-cyan-glow"
                        : "text-gray-300 hover:text-white hover:bg-dark-900/50"
                    }`}
                  >
                    <span className={`mr-3 text-xl ${isActive ? 'animate-pulse' : ''}`}>{item.icon}</span>
                    {item.name}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse"></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="p-4 border-t border-dark-900 backdrop-blur-sm bg-dark-800/80">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full neuro-card flex items-center justify-center text-white font-bold bg-dark-800">
                {session.user.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{session.user.name}</p>
                <p className="text-xs text-gray-400">{session.user.email}</p>
              </div>
            </div>
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="mt-4 w-full"
              size="sm"
            >
              Sign out
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="lg:pl-64">
        <main className="py-10">
          <div className="max-w-7xl mx-auto lg:px-8 lg:pt-0 px-4 pt-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 