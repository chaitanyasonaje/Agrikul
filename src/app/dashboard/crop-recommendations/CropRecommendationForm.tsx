"use client";

import { useState } from "react";

type CropInfo = {
  name: string;
  suitability: string;
  notes: string;
};

type RecommendationData = {
  soil_type: string;
  crops: CropInfo[];
};

export default function CropRecommendationForm({
  recommendations,
}: {
  recommendations: RecommendationData[];
}) {
  const [soilType, setSoilType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [results, setResults] = useState<CropInfo[]>([]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Find recommendations for selected soil type
      const result = recommendations.find(rec => rec.soil_type === soilType);
      if (result) {
        setResults(result.crops);
      } else {
        setResults([]);
      }
      
      setLoading(false);
      setShowResults(true);
    }, 1000);
  };
  
  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case "high": return "bg-green-900 text-green-400";
      case "medium": return "bg-yellow-900 text-yellow-400";
      case "low": return "bg-red-900 text-red-400";
      default: return "bg-gray-800 text-gray-400";
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="soilType" className="block text-sm font-medium text-gray-300 mb-1">
              Soil Type
            </label>
            <select
              id="soilType"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2 neuro-input bg-dark-800 text-white border-0 focus:outline-none focus:ring-2 focus:ring-cyan-glow"
              required
            >
              <option value="">Select Soil Type</option>
              <option value="clay">Clay Soil</option>
              <option value="sandy">Sandy Soil</option>
              <option value="loamy">Loam Soil</option>
              <option value="silty">Silty Soil</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
              Farm Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 neuro-input bg-dark-800 text-white border-0 focus:outline-none focus:ring-2 focus:ring-cyan-glow"
              placeholder="City, State"
              required
            />
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            className={`px-4 py-2 neuro-button bg-gradient-to-r from-cyan-glow to-magenta-glow text-white rounded-md hover:shadow-glow transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Get Recommendations"}
          </button>
        </div>
      </form>
      
      {showResults && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 text-white">
            Recommended Crops for {soilType.charAt(0).toUpperCase() + soilType.slice(1)} Soil
          </h3>
          
          {results.length === 0 ? (
            <p className="text-gray-400">No recommendations found for this soil type.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((crop, index) => (
                <div key={index} className="neuro-card p-4 hover:shadow-glow transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-white">{crop.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSuitabilityColor(crop.suitability)}`}>
                      {crop.suitability.charAt(0).toUpperCase() + crop.suitability.slice(1)} Suitability
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{crop.notes}</p>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 p-4 neuro-inset bg-dark-800 border-t border-cyan-glow/20 rounded-md">
            <h4 className="text-cyan-glow font-medium mb-2">Next Steps:</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-1.5 rounded-full bg-cyan-glow mr-2"></span>
                <span>Consider your local climate conditions and water availability</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-1.5 rounded-full bg-cyan-glow mr-2"></span>
                <span>Analyze market demand and price trends for these crops</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-1.5 rounded-full bg-cyan-glow mr-2"></span>
                <span>Check with local agricultural extension for specific variety recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-1.5 rounded-full bg-cyan-glow mr-2"></span>
                <span>Consider crop rotation strategies to maintain soil health</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 