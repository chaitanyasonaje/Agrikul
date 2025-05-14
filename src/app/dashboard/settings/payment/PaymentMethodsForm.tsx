"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
}

interface PaymentMethod {
  id: string;
  type: "card" | "upi" | "bank";
  isDefault: boolean;
  lastFour?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cardBrand?: string;
  upiId?: string;
  bankName?: string;
  accountNumber?: string;
}

export default function PaymentMethodsForm({ user }: { user: User }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormType, setAddFormType] = useState<"card" | "upi" | "bank">("card");
  
  // Mock payment methods - in a real application these would come from the API
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_1",
      type: "card",
      isDefault: true,
      lastFour: "4242",
      expiryMonth: "12",
      expiryYear: "25",
      cardBrand: "visa",
    },
    {
      id: "pm_2",
      type: "upi",
      isDefault: false,
      upiId: "user@okbank",
    },
  ]);
  
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    // Card details
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
    cardName: "",
    
    // UPI details
    upiId: "",
    
    // Bank details
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPaymentMethod(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };
  
  const handleDelete = (id: string) => {
    setPaymentMethods(prev => 
      prev.filter(method => method.id !== id)
    );
  };
  
  const handleAddNew = (type: "card" | "upi" | "bank") => {
    setAddFormType(type);
    setShowAddForm(true);
    setNewPaymentMethod({
      cardNumber: "",
      cardExpiry: "",
      cardCVC: "",
      cardName: "",
      upiId: "",
      accountName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to save the new payment method
      
      // Mock adding a new payment method
      const newId = `pm_${Date.now()}`;
      let newMethod: PaymentMethod;
      
      if (addFormType === "card") {
        newMethod = {
          id: newId,
          type: "card",
          isDefault: false,
          lastFour: newPaymentMethod.cardNumber.slice(-4),
          expiryMonth: newPaymentMethod.cardExpiry.split("/")[0],
          expiryYear: newPaymentMethod.cardExpiry.split("/")[1],
          cardBrand: "visa",
        };
      } else if (addFormType === "upi") {
        newMethod = {
          id: newId,
          type: "upi",
          isDefault: false,
          upiId: newPaymentMethod.upiId,
        };
      } else {
        newMethod = {
          id: newId,
          type: "bank",
          isDefault: false,
          bankName: newPaymentMethod.bankName,
          accountNumber: newPaymentMethod.accountNumber.slice(-4),
        };
      }
      
      setPaymentMethods(prev => [...prev, newMethod]);
      setShowAddForm(false);
      setSuccess("Payment method added successfully!");
      
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to add payment method");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderCardIcon = (brand?: string) => {
    return (
      <div className="h-8 w-8 sm:h-10 sm:w-10 bg-dark-700 rounded-md flex items-center justify-center text-cyan-glow mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </div>
    );
  };
  
  const renderUpiIcon = () => {
    return (
      <div className="h-8 w-8 sm:h-10 sm:w-10 bg-dark-700 rounded-md flex items-center justify-center text-magenta-glow mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    );
  };
  
  const renderBankIcon = () => {
    return (
      <div className="h-8 w-8 sm:h-10 sm:w-10 bg-dark-700 rounded-md flex items-center justify-center text-cyan-glow mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
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
      
      <div>
        <h3 className="text-sm font-medium text-white mb-4">Your Payment Methods</h3>
        
        {paymentMethods.length === 0 ? (
          <div className="text-gray-400 text-sm p-4 bg-dark-900/30 rounded-md">
            You don't have any payment methods yet. Add one below.
          </div>
        ) : (
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="border border-dark-700 rounded-md p-3 flex items-center bg-dark-900/30">
                {method.type === "card" && renderCardIcon(method.cardBrand)}
                {method.type === "upi" && renderUpiIcon()}
                {method.type === "bank" && renderBankIcon()}
                
                <div className="flex-grow">
                  {method.type === "card" && (
                    <>
                      <p className="font-medium text-sm sm:text-base text-white">•••• •••• •••• {method.lastFour}</p>
                      <p className="text-xs text-gray-400">Expires {method.expiryMonth}/{method.expiryYear}</p>
                    </>
                  )}
                  
                  {method.type === "upi" && (
                    <>
                      <p className="font-medium text-sm sm:text-base text-white">UPI: {method.upiId}</p>
                      <p className="text-xs text-gray-400">Instant payment</p>
                    </>
                  )}
                  
                  {method.type === "bank" && (
                    <>
                      <p className="font-medium text-sm sm:text-base text-white">{method.bankName} •••• {method.accountNumber}</p>
                      <p className="text-xs text-gray-400">Direct bank transfer</p>
                    </>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {!method.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(method.id)}
                      className="text-xs text-cyan-glow hover:text-cyan-glow/80 bg-dark-900/50 px-2 py-1 rounded"
                    >
                      Set Default
                    </button>
                  )}
                  
                  {method.isDefault && (
                    <span className="text-xs text-cyan-glow bg-dark-900/50 px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => handleDelete(method.id)}
                    className="text-xs text-red-400 hover:text-red-300 bg-dark-900/50 px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {!showAddForm ? (
        <div className="pt-4 border-t border-dark-700">
          <h3 className="text-sm font-medium text-white mb-4">Add Payment Method</h3>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleAddNew("card")}
              className="px-4 py-2 bg-dark-900/50 text-white rounded-md hover:bg-dark-900 transition neuro-button flex items-center"
            >
              <span className="mr-2">💳</span> Add Credit Card
            </button>
            <button
              type="button"
              onClick={() => handleAddNew("upi")}
              className="px-4 py-2 bg-dark-900/50 text-white rounded-md hover:bg-dark-900 transition neuro-button flex items-center"
            >
              <span className="mr-2">📱</span> Add UPI
            </button>
            <button
              type="button"
              onClick={() => handleAddNew("bank")}
              className="px-4 py-2 bg-dark-900/50 text-white rounded-md hover:bg-dark-900 transition neuro-button flex items-center"
            >
              <span className="mr-2">🏦</span> Add Bank Account
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-4 border-t border-dark-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-white">
              {addFormType === "card" && "Add Credit Card"}
              {addFormType === "upi" && "Add UPI ID"}
              {addFormType === "bank" && "Add Bank Account"}
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-sm text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {addFormType === "card" && (
              <>
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-300 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={newPaymentMethod.cardName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-900/50 shadow-neuro-inset rounded-md border-dark-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={newPaymentMethod.cardNumber}
                    onChange={handleChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full px-3 py-2 bg-dark-900/50 shadow-neuro-inset rounded-md border-dark-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="cardExpiry"
                      name="cardExpiry"
                      value={newPaymentMethod.cardExpiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 bg-dark-900/50 shadow-neuro-inset rounded-md border-dark-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cardCVC" className="block text-sm font-medium text-gray-300 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      id="cardCVC"
                      name="cardCVC"
                      value={newPaymentMethod.cardCVC}
                      onChange={handleChange}
                      placeholder="XXX"
                      className="w-full px-3 py-2 bg-dark-900/50 shadow-neuro-inset rounded-md border-dark-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow"
                      required
                    />
                  </div>
                </div>
              </>
            )}
            
            {addFormType === "upi" && (
              <div>
                <label htmlFor="upiId" className="block text-sm font-medium text-gray-300 mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  id="upiId"
                  name="upiId"
                  value={newPaymentMethod.upiId}
                  onChange={handleChange}
                  placeholder="username@bank"
                  className="w-full px-3 py-2 bg-dark-900/50 shadow-neuro-inset rounded-md border-dark-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow"
                  required
                />
              </div>
            )}
            
            {addFormType === "bank" && (
              <>
                <div>
                  <label htmlFor="accountName" className="block text-sm font-medium text-gray-300 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    id="accountName"
                    name="accountName"
                    value={newPaymentMethod.accountName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-900/50 shadow-neuro-inset rounded-md border-dark-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-300 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={newPaymentMethod.accountNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-900/50 shadow-neuro-inset rounded-md border-dark-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-300 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    id="ifscCode"
                    name="ifscCode"
                    value={newPaymentMethod.ifscCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-900/50 shadow-neuro-inset rounded-md border-dark-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-300 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={newPaymentMethod.bankName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-900/50 shadow-neuro-inset rounded-md border-dark-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow"
                    required
                  />
                </div>
              </>
            )}
            
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className={`px-4 py-2 bg-gradient-text text-white rounded-md hover:shadow-glow-blue transition neuro-button ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Payment Method"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 