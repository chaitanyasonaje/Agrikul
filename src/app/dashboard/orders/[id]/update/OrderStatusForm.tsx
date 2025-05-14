"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "canceled";

export default function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get available next statuses based on current status
  const getAvailableStatuses = (): OrderStatus[] => {
    switch (currentStatus) {
      case "pending":
        return ["processing", "canceled"];
      case "processing":
        return ["shipped", "canceled"];
      case "shipped":
        return ["delivered", "canceled"];
      default:
        return [];
    }
  };
  
  const availableStatuses = getAvailableStatuses();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          estimatedDelivery: status === "shipped" ? estimatedDelivery : undefined,
          notes: notes.trim() || undefined,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update order status");
      }
      
      // Refresh the page and redirect to order details
      router.refresh();
      router.push(`/dashboard/orders/${orderId}`);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Update Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          required
        >
          <option value={currentStatus}>
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} (Current)
          </option>
          {availableStatuses.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      {status === "shipped" && (
        <div>
          <label htmlFor="estimatedDelivery" className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Delivery Date
          </label>
          <input
            type="datetime-local"
            id="estimatedDelivery"
            value={estimatedDelivery}
            onChange={(e) => setEstimatedDelivery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Please provide an estimated delivery date for the customer.
          </p>
        </div>
      )}
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Status Update Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="Add any notes about this status update..."
        ></textarea>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Status"}
        </button>
      </div>
    </form>
  );
} 