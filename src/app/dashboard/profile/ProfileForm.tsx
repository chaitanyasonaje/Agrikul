"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function ProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    location: {
      address: user.location?.address || "",
      city: user.location?.city || "",
      state: user.location?.state || "",
      postalCode: user.location?.postalCode || "",
    },
    bio: user.bio || "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update profile");
      }
      
      setSuccess("Profile updated successfully!");
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
        <div className="bg-red-900/30 border border-red-700/50 text-red-400 px-4 py-3 rounded-lg relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/30 border border-green-700/50 text-green-400 px-4 py-3 rounded-lg relative" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-dark-800 border border-gray-700 rounded-md shadow-neuro focus:outline-none focus:ring-cyan-glow focus:border-cyan-glow text-white"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-dark-900 border border-gray-700 rounded-md shadow-neuro focus:outline-none focus:ring-cyan-glow focus:border-cyan-glow text-gray-400"
            disabled // Email cannot be changed
          />
          <p className="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-dark-800 border border-gray-700 rounded-md shadow-neuro focus:outline-none focus:ring-cyan-glow focus:border-cyan-glow text-white"
          />
        </div>
        
        <div>
          <label htmlFor="location.address" className="block text-sm font-medium text-gray-300 mb-1">
            Address
          </label>
          <input
            type="text"
            id="location.address"
            name="location.address"
            value={formData.location.address}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-dark-800 border border-gray-700 rounded-md shadow-neuro focus:outline-none focus:ring-cyan-glow focus:border-cyan-glow text-white"
          />
        </div>
        
        <div>
          <label htmlFor="location.city" className="block text-sm font-medium text-gray-300 mb-1">
            City
          </label>
          <input
            type="text"
            id="location.city"
            name="location.city"
            value={formData.location.city}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-dark-800 border border-gray-700 rounded-md shadow-neuro focus:outline-none focus:ring-cyan-glow focus:border-cyan-glow text-white"
          />
        </div>
        
        <div>
          <label htmlFor="location.state" className="block text-sm font-medium text-gray-300 mb-1">
            State
          </label>
          <input
            type="text"
            id="location.state"
            name="location.state"
            value={formData.location.state}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-dark-800 border border-gray-700 rounded-md shadow-neuro focus:outline-none focus:ring-cyan-glow focus:border-cyan-glow text-white"
          />
        </div>
        
        <div>
          <label htmlFor="location.postalCode" className="block text-sm font-medium text-gray-300 mb-1">
            Postal Code
          </label>
          <input
            type="text"
            id="location.postalCode"
            name="location.postalCode"
            value={formData.location.postalCode}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-dark-800 border border-gray-700 rounded-md shadow-neuro focus:outline-none focus:ring-cyan-glow focus:border-cyan-glow text-white"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
          Bio / About
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 bg-dark-800 border border-gray-700 rounded-md shadow-neuro focus:outline-none focus:ring-cyan-glow focus:border-cyan-glow text-white"
          placeholder="Tell others about yourself or your business..."
        ></textarea>
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="gradient"
          size="md"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
} 