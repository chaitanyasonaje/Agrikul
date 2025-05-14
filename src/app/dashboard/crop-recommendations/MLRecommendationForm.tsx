"use client";

import { useState } from "react";

interface CropPrediction {
  predicted_crop: string;
  confidence: number | null;
}

export default function MLRecommendationForm() {
  const [formData, setFormData] = useState({
    N: 90, // Default values based on typical ranges
    P: 42,
    K: 43,
    temperature: 20.87,
    humidity: 82,
    ph: 6.5,
    rainfall: 200
  });
  
  const [prediction, setPrediction] = useState<CropPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle empty input case or non-numeric input
    const parsedValue = value === '' ? 0 : parseFloat(value);
    
    // Only update if it's a valid number
    if (!isNaN(parsedValue)) {
      setFormData(prev => ({
        ...prev,
        [name]: parsedValue
      }));
    }
  };
  
  // Mock prediction data based on input values
  const getMockPrediction = (data: typeof formData): CropPrediction => {
    // Simple logic to determine crop based on input parameters
    // In a real app, this would be done by the ML model
    if (data.ph < 5.5) {
      return { predicted_crop: "blueberries", confidence: 0.89 };
    } else if (data.ph > 7.5) {
      return { predicted_crop: "barley", confidence: 0.82 };
    } else if (data.rainfall > 250) {
      return { predicted_crop: "rice", confidence: 0.94 };
    } else if (data.N > 100 && data.P > 50 && data.K > 50) {
      return { predicted_crop: "corn", confidence: 0.87 };
    } else if (data.temperature > 25) {
      return { predicted_crop: "cotton", confidence: 0.76 };
    } else {
      return { predicted_crop: "wheat", confidence: 0.83 };
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use the mock prediction instead of fetching from API
      const mockResult = getMockPrediction(formData);
      setPrediction(mockResult);
      
      // Keep the API code commented out for future use when the API is available
      /*
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get prediction from API');
      }
      
      const data = await response.json();
      setPrediction(data);
      */
    } catch (err) {
      console.error('Error predicting crop:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Get CSS class for confidence level
  const getConfidenceClass = (confidence: number | null) => {
    if (confidence === null) return "bg-gray-800 text-gray-400";
    
    if (confidence >= 0.8) return "bg-green-900 text-green-400";
    if (confidence >= 0.6) return "bg-yellow-900 text-yellow-400";
    return "bg-red-900 text-red-400";
  };
  
  // Get description based on confidence level
  const getConfidenceText = (confidence: number | null) => {
    if (confidence === null) return "Unknown";
    
    if (confidence >= 0.8) return "High Confidence";
    if (confidence >= 0.6) return "Medium Confidence";
    return "Low Confidence";
  };
  
  // Format confidence as percentage
  const formatConfidence = (confidence: number | null) => {
    if (confidence === null) return "N/A";
    return `${(confidence * 100).toFixed(1)}%`;
  };
  
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-white">AI-Powered Crop Recommendation</h3>
        <p className="text-gray-400">
          Our machine learning model will analyze your soil and environmental parameters to recommend 
          the most suitable crop for your farm.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="N" className="block text-sm font-medium text-gray-300 mb-1">
              Nitrogen (N) - kg/ha
            </label>
            <input
              type="number"
              id="N"
              name="N"
              value={formData.N.toString()}
              onChange={handleChange}
              className="w-full px-3 py-2 neuro-input bg-dark-800 text-white border-0 focus:outline-none focus:ring-2 focus:ring-cyan-glow"
              required
              step="any"
              min="0"
            />
          </div>
          
          <div>
            <label htmlFor="P" className="block text-sm font-medium text-gray-300 mb-1">
              Phosphorus (P) - kg/ha
            </label>
            <input
              type="number"
              id="P"
              name="P"
              value={formData.P.toString()}
              onChange={handleChange}
              className="w-full px-3 py-2 neuro-input bg-dark-800 text-white border-0 focus:outline-none focus:ring-2 focus:ring-cyan-glow"
              required
              step="any"
              min="0"
            />
          </div>
          
          <div>
            <label htmlFor="K" className="block text-sm font-medium text-gray-300 mb-1">
              Potassium (K) - kg/ha
            </label>
            <input
              type="number"
              id="K"
              name="K"
              value={formData.K.toString()}
              onChange={handleChange}
              className="w-full px-3 py-2 neuro-input bg-dark-800 text-white border-0 focus:outline-none focus:ring-2 focus:ring-cyan-glow"
              required
              step="any"
              min="0"
            />
          </div>
          
          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-gray-300 mb-1">
              Temperature (°C)
            </label>
            <input
              type="number"
              id="temperature"
              name="temperature"
              value={formData.temperature.toString()}
              onChange={handleChange}
              className="w-full px-3 py-2 neuro-input bg-dark-800 text-white border-0 focus:outline-none focus:ring-2 focus:ring-cyan-glow"
              required
              step="any"
              min="0"
              max="50"
            />
          </div>
          
          <div>
            <label htmlFor="humidity" className="block text-sm font-medium text-gray-300 mb-1">
              Humidity (%)
            </label>
            <input
              type="number"
              id="humidity"
              name="humidity"
              value={formData.humidity.toString()}
              onChange={handleChange}
              className="w-full px-3 py-2 neuro-input bg-dark-800 text-white border-0 focus:outline-none focus:ring-2 focus:ring-cyan-glow"
              required
              step="any"
              min="0"
              max="100"
            />
          </div>
          
          <div>
            <label htmlFor="ph" className="block text-sm font-medium text-gray-300 mb-1">
              pH Value
            </label>
            <input
              type="number"
              id="ph"
              name="ph"
              value={formData.ph.toString()}
              onChange={handleChange}
              className="w-full px-3 py-2 neuro-input bg-dark-800 text-white border-0 focus:outline-none focus:ring-2 focus:ring-cyan-glow"
              required
              step="0.1"
              min="0"
              max="14"
            />
          </div>
          
          <div>
            <label htmlFor="rainfall" className="block text-sm font-medium text-gray-300 mb-1">
              Rainfall (mm)
            </label>
            <input
              type="number"
              id="rainfall"
              name="rainfall"
              value={formData.rainfall.toString()}
              onChange={handleChange}
              className="w-full px-3 py-2 neuro-input bg-dark-800 text-white border-0 focus:outline-none focus:ring-2 focus:ring-cyan-glow"
              required
              step="any"
              min="0"
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
            {loading ? "Analyzing..." : "Predict Best Crop"}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-6 p-4 neuro-inset bg-dark-800 border border-red-900 rounded-md">
          <p className="text-red-400">{error}</p>
          <p className="text-sm text-gray-400 mt-1">
            Using simulated data for demonstration purposes.
          </p>
        </div>
      )}
      
      {prediction && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 text-white">AI Recommendation Result</h3>
          
          <div className="neuro-card border-0 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-2xl font-bold gradient-text capitalize">{prediction.predicted_crop}</h4>
                <p className="text-gray-400">Recommended crop for your parameters</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceClass(prediction.confidence)}`}>
                {getConfidenceText(prediction.confidence)} ({formatConfidence(prediction.confidence)})
              </div>
            </div>
            
            <div className="mt-4 p-4 neuro-inset bg-dark-800 rounded-md">
              <h5 className="text-md font-medium mb-2 text-cyan-glow">Growing Information</h5>
              <p className="text-gray-400 text-sm mb-3">
                Here's some general information about growing {prediction.predicted_crop}:
              </p>
              <ul className="text-gray-400 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-1.5 rounded-full bg-cyan-glow mr-2"></span>
                  <span>Optimal growing season depends on your climate zone</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-1.5 rounded-full bg-cyan-glow mr-2"></span>
                  <span>Maintain soil moisture and monitor for pests regularly</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-1.5 rounded-full bg-cyan-glow mr-2"></span>
                  <span>Consider companion planting to improve yields</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 