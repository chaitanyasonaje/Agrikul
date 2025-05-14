"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
}

export default function SecurityPrivacyForm({ user }: { user: User }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    dataSharing: true,
    marketingConsent: true,
    activityTracking: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to save settings
      
      setSuccess("Security settings updated successfully!");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update security settings");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-dark-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-md" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-dark-900/50 border border-cyan-glow/50 text-cyan-glow px-4 py-3 rounded-md" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-white mb-4">Password</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-900/50 shadow-neuro-inset rounded-md border-dark-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-900/50 shadow-neuro-inset rounded-md border-dark-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-900/50 shadow-neuro-inset rounded-md border-dark-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-dark-700">
          <h3 className="text-sm font-medium text-white mb-4">Two-Factor Authentication</h3>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="twoFactorEnabled"
                name="twoFactorEnabled"
                type="checkbox"
                checked={formData.twoFactorEnabled}
                onChange={handleChange}
                className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="twoFactorEnabled" className="font-medium text-white">Enable Two-Factor Authentication</label>
              <p className="text-gray-400">Add an extra layer of security to your account by requiring a verification code</p>
            </div>
          </div>
          {formData.twoFactorEnabled && (
            <button
              type="button"
              className="mt-4 px-4 py-2 text-xs bg-dark-900/50 text-white rounded-md hover:bg-dark-900 transition"
            >
              Set up Two-Factor Authentication
            </button>
          )}
        </div>
        
        <div className="pt-6 border-t border-dark-700">
          <h3 className="text-sm font-medium text-white mb-4">Privacy Settings</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="dataSharing"
                  name="dataSharing"
                  type="checkbox"
                  checked={formData.dataSharing}
                  onChange={handleChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="dataSharing" className="font-medium text-white">Data Sharing</label>
                <p className="text-gray-400">Allow sharing of your usage data to improve platform services</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="marketingConsent"
                  name="marketingConsent"
                  type="checkbox"
                  checked={formData.marketingConsent}
                  onChange={handleChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="marketingConsent" className="font-medium text-white">Marketing Communications</label>
                <p className="text-gray-400">Receive marketing communications about products and services</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="activityTracking"
                  name="activityTracking"
                  type="checkbox"
                  checked={formData.activityTracking}
                  onChange={handleChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="activityTracking" className="font-medium text-white">Activity Tracking</label>
                <p className="text-gray-400">Allow tracking of your activities on the platform for personalized experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-dark-700">
        <div className="flex justify-between">
          <button
            type="button"
            className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition"
          >
            Delete Account
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-gradient-text text-white rounded-md hover:shadow-glow-blue transition neuro-button ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </form>
  );
} 