"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
}

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed?: string;
  scopes: string[];
}

export default function ApiAccessForm({ user }: { user: User }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [newKeyData, setNewKeyData] = useState({
    name: "",
    scopes: ["read:market", "read:weather"] as string[],
  });
  
  // Mock API keys - in a real application these would come from the API
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "key_1",
      name: "Market Data Access",
      prefix: "ag_mk_",
      createdAt: "2023-06-10T12:30:00Z",
      lastUsed: "2023-11-15T08:45:12Z",
      scopes: ["read:market", "read:weather"],
    },
    {
      id: "key_2",
      name: "Weather API Integration",
      prefix: "ag_wt_",
      createdAt: "2023-09-22T15:10:00Z",
      scopes: ["read:weather"],
    },
  ]);
  
  const availableScopes = [
    { id: "read:market", name: "Read Market Data", description: "Access to market prices and trends" },
    { id: "read:weather", name: "Read Weather Data", description: "Access to weather forecasts and historical data" },
    { id: "read:products", name: "Read Products", description: "Access to product catalog and inventory" },
    { id: "write:products", name: "Write Products", description: "Create and update products" },
    { id: "read:orders", name: "Read Orders", description: "Access to order history and status" },
    { id: "write:orders", name: "Write Orders", description: "Create and update orders" },
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      const scopeId = name.replace("scope-", "");
      if (checked) {
        setNewKeyData(prev => ({
          ...prev,
          scopes: [...prev.scopes, scopeId],
        }));
      } else {
        setNewKeyData(prev => ({
          ...prev,
          scopes: prev.scopes.filter(scope => scope !== scopeId),
        }));
      }
    } else {
      setNewKeyData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to create a new API key
      
      // Mock creating a new API key
      const newKey = `ag_key_${Math.random().toString(36).substring(2, 15)}`;
      const prefix = newKey.substring(0, 10);
      
      const newApiKey: ApiKey = {
        id: `key_${Date.now()}`,
        name: newKeyData.name,
        prefix: `${prefix}...`,
        createdAt: new Date().toISOString(),
        scopes: newKeyData.scopes,
      };
      
      setApiKeys(prev => [...prev, newApiKey]);
      setShowApiKey(newKey);
      setIsCreatingKey(false);
      setSuccess("API key generated successfully. Please copy it now as it won't be shown again.");
      
      // Reset form
      setNewKeyData({
        name: "",
        scopes: ["read:market", "read:weather"],
      });
      
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to generate API key");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteKey = async (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
  };
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-dark-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-md" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && showApiKey && (
        <div className="bg-dark-900/50 border border-cyan-glow/50 text-cyan-glow px-4 py-3 rounded-md" role="alert">
          <p className="mb-2">{success}</p>
          <div className="flex items-center">
            <code className="bg-dark-900 px-3 py-2 rounded text-white font-mono text-sm break-all">{showApiKey}</code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(showApiKey);
                setSuccess("API key copied to clipboard!");
              }}
              className="ml-2 text-xs bg-dark-900/50 hover:bg-dark-900 px-2 py-1 rounded text-white"
            >
              Copy
            </button>
          </div>
        </div>
      )}
      
      {success && !showApiKey && (
        <div className="bg-dark-900/50 border border-cyan-glow/50 text-cyan-glow px-4 py-3 rounded-md" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-white">Your API Keys</h3>
          <button
            type="button"
            onClick={() => setIsCreatingKey(true)}
            className="px-3 py-1 text-sm bg-gradient-text text-white rounded-md hover:shadow-glow-blue transition neuro-button"
          >
            Generate New Key
          </button>
        </div>
        
        {apiKeys.length === 0 ? (
          <div className="text-gray-400 text-sm p-4 bg-dark-900/30 rounded-md">
            You don't have any API keys yet. Generate one to integrate with our API.
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((key) => (
              <div key={key.id} className="border border-dark-700 rounded-md p-4 bg-dark-900/30">
                <div className="flex justify-between mb-2">
                  <h4 className="text-white font-medium">{key.name}</h4>
                  <button
                    type="button"
                    onClick={() => handleDeleteKey(key.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Revoke
                  </button>
                </div>
                
                <div className="flex items-center mb-3">
                  <code className="bg-dark-900 px-2 py-1 rounded text-gray-400 font-mono text-xs">{key.prefix}•••••••••••••</code>
                  <span className="ml-2 text-xs text-gray-400">
                    Created: {new Date(key.createdAt).toLocaleDateString()}
                  </span>
                  {key.lastUsed && (
                    <span className="ml-2 text-xs text-gray-400">
                      Last used: {new Date(key.lastUsed).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {key.scopes.map((scope) => (
                    <span
                      key={scope}
                      className="px-2 py-1 text-xs bg-dark-700 text-cyan-glow rounded"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {isCreatingKey && (
        <div className="pt-6 border-t border-dark-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-white">Generate New API Key</h3>
            <button
              type="button"
              onClick={() => setIsCreatingKey(false)}
              className="text-sm text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          
          <form onSubmit={handleGenerateKey} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Key Name (for your reference)
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newKeyData.name}
                onChange={handleChange}
                placeholder="My API Key"
                className="w-full px-3 py-2 bg-dark-900/50 shadow-neuro-inset rounded-md border-dark-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Permissions
              </label>
              <div className="space-y-3 p-4 bg-dark-900/30 rounded-md">
                {availableScopes.map((scope) => (
                  <div key={scope.id} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={`scope-${scope.id}`}
                        name={`scope-${scope.id}`}
                        type="checkbox"
                        checked={newKeyData.scopes.includes(scope.id)}
                        onChange={handleChange}
                        className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={`scope-${scope.id}`} className="font-medium text-white">{scope.name}</label>
                      <p className="text-gray-400">{scope.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-dark-900/50 border border-yellow-500/20 text-yellow-300 px-4 py-3 rounded-md text-sm">
              <p>Important: API keys provide full access to your account with the selected permissions. Keep them secure and never share them publicly.</p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className={`px-4 py-2 bg-gradient-text text-white rounded-md hover:shadow-glow-blue transition neuro-button ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Generating..." : "Generate API Key"}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="pt-6 border-t border-dark-700">
        <h3 className="text-sm font-medium text-white mb-4">API Documentation</h3>
        <div className="bg-dark-900/30 p-4 rounded-md">
          <p className="text-gray-400 mb-3">
            Integrate with our API to access market prices, weather data, and manage your products programmatically.
          </p>
          <a 
            href="#" 
            className="text-cyan-glow hover:text-cyan-glow/80 transition inline-flex items-center"
          >
            <span>View API Documentation</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
} 