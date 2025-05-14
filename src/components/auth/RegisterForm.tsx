"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type UserType = "farmer" | "buyer";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUserType = (searchParams.get("type") as UserType) || "buyer";
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: initialUserType,
    phone: "",
    address: "",
    companyName: "",
    farmSize: "",
    farmType: [] as string[],
    crops: [] as string[],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, arrayName: "farmType" | "crops") => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, [arrayName]: [...prev[arrayName], value] };
      } else {
        return { ...prev, [arrayName]: prev[arrayName].filter((item) => item !== value) };
      }
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    try {
      setLoading(true);
      
      // Mock location coordinates for now - would be replaced with actual geocoding
      const coordinates = [77.2090, 28.6139]; // Sample coordinates (Delhi)
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType: formData.userType,
          phone: formData.phone,
          location: {
            address: formData.address,
            coordinates: coordinates,
          },
          companyName: formData.companyName,
          farmSize: formData.userType === "farmer" ? Number(formData.farmSize) : undefined,
          farmType: formData.userType === "farmer" ? formData.farmType : undefined,
          crops: formData.userType === "farmer" ? formData.crops : undefined,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      
      // Redirect to login page with success message
      router.push("/auth/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-neumorphic p-8 max-w-md w-full border border-gray-700/50">
      <h1 className="text-2xl font-bold text-center mb-6 text-white">
        <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Create an Account</span>
      </h1>
      <div className="flex justify-center mb-6">
        <div className="flex rounded-md overflow-hidden border border-gray-600">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, userType: "farmer" }))}
            className={`px-4 py-2 ${
              formData.userType === "farmer"
                ? "bg-gradient-to-r from-green-500 to-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Farmer
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, userType: "buyer" }))}
            className={`px-4 py-2 ${
              formData.userType === "buyer"
                ? "bg-gradient-to-r from-green-500 to-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Buyer
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900/30 text-red-400 p-3 rounded-md mb-4 border border-red-500/30">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Basic Information */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700/50 border border-gray-600 px-3 py-2 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none focus:ring-green-400"
            />
          </div>
          
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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700/50 border border-gray-600 px-3 py-2 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none focus:ring-green-400"
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-300">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="mt-1 block w-full rounded-md bg-gray-700/50 border border-gray-600 px-3 py-2 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none focus:ring-green-400"
            />
          </div>
          
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-300">
              {formData.userType === "farmer" ? "Farm Name" : "Company Name"} (Optional)
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700/50 border border-gray-600 px-3 py-2 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none focus:ring-green-400"
            />
          </div>
          
          {/* Farmer-specific fields */}
          {formData.userType === "farmer" && (
            <>
              <div>
                <label htmlFor="farmSize" className="block text-sm font-medium text-gray-300">
                  Farm Size (acres)
                </label>
                <input
                  id="farmSize"
                  name="farmSize"
                  type="number"
                  min="0"
                  value={formData.farmSize}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-700/50 border border-gray-600 px-3 py-2 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none focus:ring-green-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Farm Type
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {["Organic", "Conventional", "Hydroponic", "Greenhouse"].map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        id={`farmType-${type}`}
                        name={`farmType-${type}`}
                        type="checkbox"
                        value={type}
                        checked={formData.farmType.includes(type)}
                        onChange={(e) => handleCheckboxChange(e, "farmType")}
                        className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-green-400 focus:ring-green-400 focus:ring-offset-gray-800"
                      />
                      <label htmlFor={`farmType-${type}`} className="ml-2 text-sm text-gray-300">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Crops
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {["Wheat", "Rice", "Corn", "Soybeans", "Vegetables", "Fruits"].map((crop) => (
                    <div key={crop} className="flex items-center">
                      <input
                        id={`crops-${crop}`}
                        name={`crops-${crop}`}
                        type="checkbox"
                        value={crop}
                        checked={formData.crops.includes(crop)}
                        onChange={(e) => handleCheckboxChange(e, "crops")}
                        className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-green-400 focus:ring-green-400 focus:ring-offset-gray-800"
                      />
                      <label htmlFor={`crops-${crop}`} className="ml-2 text-sm text-gray-300">
                        {crop}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {/* Password fields */}
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
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700/50 border border-gray-600 px-3 py-2 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none focus:ring-green-400"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-md bg-gradient-to-r from-green-500 to-blue-600 px-4 py-2 text-white hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-300">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-green-400 hover:text-green-300">
          Log in
        </Link>
      </div>
    </div>
  );
} 