"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Types
interface ProductFormData {
  name: string;
  description: string;
  category: string;
  subCategory?: string;
  images: string[];
  price: {
    amount: number;
    currency: string;
    unit: string;
    negotiable: boolean;
  };
  quantity: {
    available: number;
    unit: string;
    minimum: number;
  };
  quality: {
    grade?: string;
    certification?: string[];
    organic: boolean;
  };
  harvest: {
    date?: string;
    season?: string;
  };
  location: {
    address: string;
    coordinates?: [number, number];
  };
}

interface ProductFormProps {
  initialData?: ProductFormData;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Default empty form data
  const defaultFormData: ProductFormData = {
    name: "",
    description: "",
    category: "",
    subCategory: "",
    images: [],
    price: {
      amount: 0,
      currency: "USD",
      unit: "kg",
      negotiable: true,
    },
    quantity: {
      available: 0,
      unit: "kg",
      minimum: 1,
    },
    quality: {
      grade: "",
      certification: [],
      organic: false,
    },
    harvest: {
      date: "",
      season: "",
    },
    location: {
      address: "",
    },
  };
  
  const [formData, setFormData] = useState<ProductFormData>(initialData || defaultFormData);
  
  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ProductFormData],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ProductFormData],
          [child]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }
  };
  
  const handleCertificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const certifications = prev.quality.certification || [];
      
      if (checked) {
        return {
          ...prev,
          quality: {
            ...prev.quality,
            certification: [...certifications, value],
          },
        };
      } else {
        return {
          ...prev,
          quality: {
            ...prev.quality,
            certification: certifications.filter((cert) => cert !== value),
          },
        };
      }
    });
  };
  
  // Mock image upload function (to be replaced with actual upload)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setImageUploadError("");
    
    // Simulate upload delay
    setTimeout(() => {
      // In a real implementation, you would upload to a storage service
      // and get back URLs to the uploaded images
      const mockImageUrls = Array.from(files).map(
        (_, index) => `https://example.com/mock-image-${Date.now()}-${index}.jpg`
      );
      
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...mockImageUrls],
      }));
      
      setUploading(false);
    }, 1500);
  };
  
  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!formData.name || !formData.description || !formData.category) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (formData.price.amount <= 0) {
      setError("Price must be greater than 0");
      return;
    }
    
    if (formData.quantity.available <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    
    try {
      setLoading(true);
      
      const endpoint = isEdit ? `/api/products/${initialData?._id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      
      // Redirect to products page on success
      router.push("/dashboard/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };
  
  const categories = [
    "Grains & Cereals",
    "Fruits",
    "Vegetables",
    "Dairy",
    "Livestock",
    "Poultry",
    "Seeds",
    "Nuts",
    "Spices",
    "Organic Products",
    "Other",
  ];
  
  const certifications = [
    "USDA Organic",
    "Non-GMO",
    "Fair Trade",
    "Rainforest Alliance",
    "Global GAP",
    "Certified Humane",
    "ISO 22000",
  ];
  
  const measurementUnits = {
    weight: ["kg", "ton", "lb", "g"],
    volume: ["liter", "gallon", "ml"],
    quantity: ["piece", "dozen", "crate", "box", "bag"],
  };
  
  const currencies = ["USD", "EUR", "GBP", "INR", "CAD", "AUD"];
  
  const seasons = ["Spring", "Summer", "Fall", "Winter"];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Product" : "Add New Product"}</h1>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Product Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Sub-category (Optional)
              </label>
              <input
                id="subCategory"
                name="subCategory"
                type="text"
                value={formData.subCategory || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500"
              />
            </div>
          </div>
        </div>
        
        {/* Price & Quantity */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Price & Quantity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="price.amount" className="block text-sm font-medium text-gray-700 mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                id="price.amount"
                name="price.amount"
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.price.amount}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="price.currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="price.currency"
                name="price.currency"
                value={formData.price.currency}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="price.unit" className="block text-sm font-medium text-gray-700 mb-1">
                Per Unit
              </label>
              <select
                id="price.unit"
                name="price.unit"
                value={formData.price.unit}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500"
              >
                {[...measurementUnits.weight, ...measurementUnits.volume, ...measurementUnits.quantity].map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              id="price.negotiable"
              name="price.negotiable"
              type="checkbox"
              checked={formData.price.negotiable}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="price.negotiable" className="ml-2 block text-sm text-gray-700">
              Price is negotiable
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="quantity.available" className="block text-sm font-medium text-gray-700 mb-1">
                Available Quantity <span className="text-red-500">*</span>
              </label>
              <input
                id="quantity.available"
                name="quantity.available"
                type="number"
                min="0"
                required
                value={formData.quantity.available}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="quantity.unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit of Measure
              </label>
              <select
                id="quantity.unit"
                name="quantity.unit"
                value={formData.quantity.unit}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500"
              >
                {[...measurementUnits.weight, ...measurementUnits.volume, ...measurementUnits.quantity].map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="quantity.minimum" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Order
              </label>
              <input
                id="quantity.minimum"
                name="quantity.minimum"
                type="number"
                min="1"
                value={formData.quantity.minimum}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500"
              />
            </div>
          </div>
        </div>
        
        {/* Quality & Certification */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Quality & Certification</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quality.grade" className="block text-sm font-medium text-gray-700 mb-1">
                Quality Grade
              </label>
              <input
                id="quality.grade"
                name="quality.grade"
                type="text"
                value={formData.quality.grade || ""}
                onChange={handleChange}
                placeholder="e.g., A, Premium, Standard"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="quality.organic"
                name="quality.organic"
                type="checkbox"
                checked={formData.quality.organic}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="quality.organic" className="ml-2 block text-sm text-gray-700">
                This product is organic
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certifications
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {certifications.map((cert) => (
                <div key={cert} className="flex items-center">
                  <input
                    id={`cert-${cert}`}
                    type="checkbox"
                    value={cert}
                    checked={formData.quality.certification?.includes(cert) || false}
                    onChange={handleCertificationChange}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor={`cert-${cert}`} className="ml-2 block text-sm text-gray-700">
                    {cert}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Harvest Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Harvest Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="harvest.date" className="block text-sm font-medium text-gray-700 mb-1">
                Harvest Date
              </label>
              <input
                id="harvest.date"
                name="harvest.date"
                type="date"
                value={formData.harvest.date || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="harvest.season" className="block text-sm font-medium text-gray-700 mb-1">
                Harvest Season
              </label>
              <select
                id="harvest.season"
                name="harvest.season"
                value={formData.harvest.season || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500"
              >
                <option value="">Select Season</option>
                {seasons.map((season) => (
                  <option key={season} value={season}>
                    {season}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Location */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Location</h2>
          
          <div>
            <label htmlFor="location.address" className="block text-sm font-medium text-gray-700 mb-1">
              Address/Location <span className="text-red-500">*</span>
            </label>
            <textarea
              id="location.address"
              name="location.address"
              required
              value={formData.location.address}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500"
            />
          </div>
        </div>
        
        {/* Image Upload */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Product Images</h2>
          
          <div className="border-dashed border-2 border-gray-300 rounded-md p-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Upload Images (up to 5)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading || formData.images.length >= 5}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100"
              />
              <p className="text-xs text-gray-500">
                {formData.images.length === 0
                  ? "No images uploaded yet. Upload up to 5 images."
                  : `${formData.images.length} images uploaded (max 5).`}
              </p>
              {imageUploadError && (
                <p className="text-xs text-red-500">{imageUploadError}</p>
              )}
              {uploading && (
                <div className="flex items-center mt-2">
                  <div className="animate-spin h-4 w-4 border-2 border-green-500 rounded-full border-t-transparent mr-2"></div>
                  <p className="text-sm text-gray-600">Uploading...</p>
                </div>
              )}
            </div>
            
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="h-24 bg-gray-200 rounded flex items-center justify-center">
                      <div className="text-xs text-gray-500">Image {index + 1}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              (loading || uploading) ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
} 