"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const registeredSuccess = searchParams.get("registered") === "true";
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      setLoading(true);
      
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      // Redirect to dashboard on success
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-neumorphic p-8 max-w-md w-full border border-gray-700/50">
      <h1 className="text-2xl font-bold text-center mb-6 text-white">
        <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Login to Agrikul</span>
      </h1>
      
      {registeredSuccess && (
        <div className="bg-green-900/30 text-green-400 p-3 rounded-md mb-4 border border-green-500/30">
          Your account has been created successfully. Please log in.
        </div>
      )}
      
      {error && (
        <div className="bg-red-900/30 text-red-400 p-3 rounded-md mb-4 border border-red-500/30">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700/50 border border-gray-600 px-3 py-2 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none focus:ring-green-400"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700/50 border border-gray-600 px-3 py-2 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none focus:ring-green-400"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-green-400 focus:ring-green-400 focus:ring-offset-gray-800"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-green-400 hover:text-green-300">
                Forgot your password?
              </Link>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-md bg-gradient-to-r from-green-500 to-blue-600 px-4 py-2 text-white hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-300">
        Don't have an account?{" "}
        <Link href="/auth/register" className="font-medium text-green-400 hover:text-green-300">
          Create one
        </Link>
      </div>
    </div>
  );
} 