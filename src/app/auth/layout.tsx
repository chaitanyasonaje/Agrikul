"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);
  
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 bg-grid-pattern">
      <div className="flex min-h-screen flex-col">
        <header className="bg-gray-800/70 backdrop-blur-sm shadow-lg border-b border-gray-700/50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white">
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Agrikul</span>
            </Link>
          </div>
        </header>
        
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        
        <footer className="bg-gray-800/70 backdrop-blur-sm border-t border-gray-700/50 py-4">
          <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Agrikul. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
} 