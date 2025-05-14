"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
}

export default function NotificationsForm({ user }: { user: User }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Email notifications
    orderUpdates: true,
    paymentUpdates: true,
    productUpdates: true,
    marketUpdates: false,
    promotionalEmails: false,
    
    // Push notifications
    instantMessages: true,
    orderStatusChanges: true,
    priceAlerts: true,
    weatherAlerts: true,
    systemUpdates: false,
    
    // SMS notifications
    criticalAlerts: true,
    securityAlerts: true,
    deliveryUpdates: false,
    
    // Notification frequency
    emailFrequency: "daily",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      
      setSuccess("Notification preferences updated successfully!");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update notification preferences");
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
          <h3 className="text-sm font-medium text-white mb-4">Email Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="orderUpdates"
                  name="orderUpdates"
                  type="checkbox"
                  checked={formData.orderUpdates}
                  onChange={handleChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="orderUpdates" className="font-medium text-white">Order Updates</label>
                <p className="text-gray-400">Receive email notifications about your orders</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="paymentUpdates"
                  name="paymentUpdates"
                  type="checkbox"
                  checked={formData.paymentUpdates}
                  onChange={handleChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="paymentUpdates" className="font-medium text-white">Payment Updates</label>
                <p className="text-gray-400">Receive email notifications about payments and transactions</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="productUpdates"
                  name="productUpdates"
                  type="checkbox"
                  checked={formData.productUpdates}
                  onChange={handleChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="productUpdates" className="font-medium text-white">Product Updates</label>
                <p className="text-gray-400">Receive email notifications about product changes and updates</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="marketUpdates"
                  name="marketUpdates"
                  type="checkbox"
                  checked={formData.marketUpdates}
                  onChange={handleChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="marketUpdates" className="font-medium text-white">Market Updates</label>
                <p className="text-gray-400">Receive email notifications about market trends and price changes</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="promotionalEmails"
                  name="promotionalEmails"
                  type="checkbox"
                  checked={formData.promotionalEmails}
                  onChange={handleChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="promotionalEmails" className="font-medium text-white">Promotional Emails</label>
                <p className="text-gray-400">Receive special offers, promotions and marketing communications</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-dark-700">
          <h3 className="text-sm font-medium text-white mb-4">Push Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="instantMessages"
                  name="instantMessages"
                  type="checkbox"
                  checked={formData.instantMessages}
                  onChange={handleChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="instantMessages" className="font-medium text-white">Instant Messages</label>
                <p className="text-gray-400">Receive push notifications for new messages</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="orderStatusChanges"
                  name="orderStatusChanges"
                  type="checkbox"
                  checked={formData.orderStatusChanges}
                  onChange={handleChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="orderStatusChanges" className="font-medium text-white">Order Status Changes</label>
                <p className="text-gray-400">Receive push notifications when your order status changes</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="priceAlerts"
                  name="priceAlerts"
                  type="checkbox"
                  checked={formData.priceAlerts}
                  onChange={handleChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="priceAlerts" className="font-medium text-white">Price Alerts</label>
                <p className="text-gray-400">Receive push notifications for price changes on watched items</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="weatherAlerts"
                  name="weatherAlerts"
                  type="checkbox"
                  checked={formData.weatherAlerts}
                  onChange={handleChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="weatherAlerts" className="font-medium text-white">Weather Alerts</label>
                <p className="text-gray-400">Receive push notifications for important weather updates</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-dark-700">
          <h3 className="text-sm font-medium text-white mb-4">SMS Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="criticalAlerts"
                  name="criticalAlerts"
                  type="checkbox"
                  checked={formData.criticalAlerts}
                  onChange={handleChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="criticalAlerts" className="font-medium text-white">Critical Alerts</label>
                <p className="text-gray-400">Receive SMS notifications for critical account alerts (charges may apply)</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="securityAlerts"
                  name="securityAlerts"
                  type="checkbox"
                  checked={formData.securityAlerts}
                  onChange={handleChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="securityAlerts" className="font-medium text-white">Security Alerts</label>
                <p className="text-gray-400">Receive SMS notifications for security-related events (charges may apply)</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="deliveryUpdates"
                  name="deliveryUpdates"
                  type="checkbox"
                  checked={formData.deliveryUpdates}
                  onChange={handleChange}
                  className="h-4 w-4 bg-dark-900 border-dark-700 text-cyan-glow focus:ring-cyan-glow/50 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="deliveryUpdates" className="font-medium text-white">Delivery Updates</label>
                <p className="text-gray-400">Receive SMS notifications about order delivery (charges may apply)</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-dark-700">
          <h3 className="text-sm font-medium text-white mb-4">Notification Frequency</h3>
          <div>
            <label htmlFor="emailFrequency" className="block text-sm font-medium text-gray-300 mb-2">
              Email Digest Frequency
            </label>
            <select
              id="emailFrequency"
              name="emailFrequency"
              value={formData.emailFrequency}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-900/50 shadow-neuro-inset rounded-md border-dark-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow"
            >
              <option value="immediate">Immediate - Send each email separately</option>
              <option value="daily">Daily - Send a daily digest</option>
              <option value="weekly">Weekly - Send a weekly digest</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-6">
        <button
          type="submit"
          className={`px-4 py-2 bg-gradient-text text-white rounded-md hover:shadow-glow-blue transition neuro-button ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </form>
  );
} 