"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
  language?: string;
  timezone?: string;
  dateFormat?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
}

export default function GeneralSettingsForm({ user }: { user: User }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    language: user.language || "en",
    timezone: user.timezone || "UTC",
    dateFormat: user.dateFormat || "MM/DD/YYYY",
    notifications: {
      email: user.notifications?.email !== false,
      push: user.notifications?.push !== false,
      sms: user.notifications?.sms || false,
    },
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked,
      },
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to save settings
      // const response = await fetch("/api/user/settings", {
      //   method: "PATCH",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.message || "Failed to update settings");
      // }
      
      setSuccess("Settings updated successfully!");
      router.refresh(); // Refresh the page to show updated data
    } catch (err: any) {
      setError(err.message);
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
          <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
            Language
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-dark-900/50 shadow-neuro-inset rounded-md border-dark-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="bn">Bengali</option>
            <option value="te">Telugu</option>
            <option value="mr">Marathi</option>
            <option value="ta">Tamil</option>
            <option value="ur">Urdu</option>
            <option value="gu">Gujarati</option>
            <option value="kn">Kannada</option>
            <option value="ml">Malayalam</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-2">
            Timezone
          </label>
          <select
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-dark-900/50 shadow-neuro-inset rounded-md border-dark-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow"
          >
            <option value="Asia/Kolkata">(GMT+5:30) India Standard Time</option>
            <option value="UTC">(GMT+0:00) Coordinated Universal Time</option>
            <option value="Asia/Dubai">(GMT+4:00) Gulf Standard Time</option>
            <option value="Asia/Singapore">(GMT+8:00) Singapore Time</option>
            <option value="Europe/London">(GMT+0:00) Greenwich Mean Time</option>
            <option value="America/New_York">(GMT-5:00) Eastern Time</option>
            <option value="America/Los_Angeles">(GMT-8:00) Pacific Time</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-300 mb-2">
            Date Format
          </label>
          <select
            id="dateFormat"
            name="dateFormat"
            value={formData.dateFormat}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-dark-900/50 shadow-neuro-inset rounded-md border-dark-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-4">Email Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="email"
                  name="email"
                  type="checkbox"
                  checked={formData.notifications.email}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="email" className="font-medium text-white">Email Notifications</label>
                <p className="text-gray-400">Receive email notifications about orders, products, and market updates</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="push"
                  name="push"
                  type="checkbox"
                  checked={formData.notifications.push}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="push" className="font-medium text-white">Push Notifications</label>
                <p className="text-gray-400">Receive push notifications in your browser</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="sms"
                  name="sms"
                  type="checkbox"
                  checked={formData.notifications.sms}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="sms" className="font-medium text-white">SMS Notifications</label>
                <p className="text-gray-400">Receive text messages for important updates (charges may apply)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
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
    </form>
  );
} 