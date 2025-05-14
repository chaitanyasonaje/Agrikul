"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import WeatherDisplay from "@/components/weather/WeatherDisplay";

export default function WeatherPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [location, setLocation] = useState("Delhi, India");
  const [coordinates, setCoordinates] = useState({ lat: 28.6139, lon: 77.2090 });
  const [searchQuery, setSearchQuery] = useState("");
  
  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/auth/login?callbackUrl=/dashboard/weather");
    return null;
  }
  
  // Handle loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // In a real app, you would use a geocoding API to get coordinates
    // For now, just update the location string
    setLocation(searchQuery);
    setSearchQuery("");
    
    // Mock coordinates for different locations
    const locationMap: Record<string, { lat: number; lon: number }> = {
      "delhi": { lat: 28.6139, lon: 77.2090 },
      "mumbai": { lat: 19.0760, lon: 72.8777 },
      "bangalore": { lat: 12.9716, lon: 77.5946 },
      "new york": { lat: 40.7128, lon: -74.0060 },
      "london": { lat: 51.5074, lon: -0.1278 },
      "tokyo": { lat: 35.6762, lon: 139.6503 },
    };
    
    const lowercaseQuery = searchQuery.toLowerCase();
    let foundLocation = false;
    
    Object.keys(locationMap).forEach((key) => {
      if (lowercaseQuery.includes(key)) {
        setCoordinates(locationMap[key]);
        foundLocation = true;
      }
    });
    
    // Default to Delhi if no match found
    if (!foundLocation) {
      setCoordinates({ lat: 28.6139, lon: 77.2090 });
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">
        <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Weather Updates</span>
      </h1>
      
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location..."
            className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-md hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Search
          </button>
        </form>
        <p className="text-sm text-gray-400 mt-2">
          Currently showing weather for: {location}
        </p>
      </div>
      
      <WeatherDisplay
        lat={coordinates.lat}
        lon={coordinates.lon}
        location={location}
      />
      
      <div className="mt-8 bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-neumorphic p-6 border border-gray-700/50">
        <h2 className="text-xl font-semibold mb-4 text-white">
          <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Crop Calendar</span>
        </h2>
        <p className="text-gray-300 mb-4">
          Based on current weather patterns and your location, here are the recommended crops for this season:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-600 bg-gray-700/50 rounded-md p-4">
            <h3 className="font-medium mb-2 text-white">Spring Season</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Wheat</li>
              <li>Barley</li>
              <li>Peas</li>
              <li>Spinach</li>
              <li>Carrots</li>
            </ul>
          </div>
          
          <div className="border border-gray-600 bg-gray-700/50 rounded-md p-4">
            <h3 className="font-medium mb-2 text-white">Summer Season</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Rice</li>
              <li>Corn</li>
              <li>Soybeans</li>
              <li>Tomatoes</li>
              <li>Peppers</li>
            </ul>
          </div>
          
          <div className="border border-gray-600 bg-gray-700/50 rounded-md p-4">
            <h3 className="font-medium mb-2 text-white">Winter Season</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Mustard</li>
              <li>Chickpeas</li>
              <li>Lentils</li>
              <li>Potatoes</li>
              <li>Onions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 