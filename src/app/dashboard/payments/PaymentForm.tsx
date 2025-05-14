"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PaymentFormProps {
  userId: string;
}

export default function PaymentForm({ userId }: PaymentFormProps) {
  const router = useRouter();
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    
    setIsProcessing(true);
    setError("");
    
    try {
      // In a real implementation, this would call an API to process the payment
      // For now, we'll just simulate a successful payment
      
      // Wait for 2 seconds to simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create transaction in database
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          paymentMethod,
          transactionType: "deposit",
          userId,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to process payment");
      }
      
      setSuccess(true);
      setAmount("");
      
      // Refresh the page to show the updated balance after a delay
      setTimeout(() => {
        router.refresh();
        setSuccess(false);
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-600">
          Payment processed successfully! Your balance will update shortly.
        </div>
      )}
      
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount (₹)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          min="1"
          step="1"
          required
        />
      </div>
      
      <div>
        <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 mb-1">
          Payment Method
        </label>
        <select
          id="payment-method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="upi">UPI</option>
          <option value="card">Credit/Debit Card</option>
          <option value="netbanking">Net Banking</option>
          <option value="wallet">E-Wallet</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setAmount("100")}
          className="py-2 px-4 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition"
        >
          ₹100
        </button>
        <button
          type="button"
          onClick={() => setAmount("500")}
          className="py-2 px-4 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition"
        >
          ₹500
        </button>
        <button
          type="button"
          onClick={() => setAmount("1000")}
          className="py-2 px-4 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition"
        >
          ₹1,000
        </button>
      </div>
      
      <button
        type="submit"
        disabled={isProcessing}
        className={`w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition ${
          isProcessing ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {isProcessing ? "Processing..." : "Add Funds"}
      </button>
      
      <p className="text-xs text-gray-500 mt-2">
        By proceeding, you agree to our terms and conditions. All payments are secured with 256-bit encryption.
      </p>
    </form>
  );
} 