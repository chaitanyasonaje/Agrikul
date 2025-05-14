import { Metadata } from "next";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import PaymentForm from "./PaymentForm";
import TransactionsList from "./TransactionsList";

export const metadata: Metadata = {
  title: "Payments - Agrikul",
  description: "Manage payments and view transaction history",
};

export default async function PaymentsPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/payments");
  }
  
  await dbConnect();
  
  // Fetch user data with wallet balance
  const user = await User.findById(session.user.id)
    .select("name email userType wallet")
    .lean();
  
  if (!user) {
    redirect("/auth/login");
  }
  
  // Fetch recent transactions
  const transactions = await Transaction.find({
    $or: [
      { sender: session.user.id },
      { recipient: session.user.id }
    ]
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("sender", "name userType")
    .populate("recipient", "name userType")
    .lean();
  
  // Default wallet if it doesn't exist
  const wallet = user.wallet || { balance: 0, currency: "INR" };
  
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 gradient-text">Payments & Transactions</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Wallet Balance */}
          <div className="neuro-card bg-dark-800 rounded-lg p-4 sm:p-6 relative overflow-hidden">
            {/* Gradient accent line */}
            <div className="h-1 w-full bg-gradient-text absolute top-0 left-0"></div>
            
            {/* Blurred gradient orb */}
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-cyan-glow/5 filter blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-0 text-white">Wallet Balance</h2>
                <span className="text-xl sm:text-2xl font-bold text-cyan-glow">₹{wallet.balance.toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-dark-900/50 neuro-card-inset rounded-lg p-3 sm:p-4 text-center">
                  <span className="block text-sm text-gray-400 mb-1">Available for withdrawal</span>
                  <span className="text-base sm:text-lg font-medium text-white">₹{Math.max(0, wallet.balance - 100).toFixed(2)}</span>
                </div>
                <div className="bg-dark-900/50 neuro-card-inset rounded-lg p-3 sm:p-4 text-center">
                  <span className="block text-sm text-gray-400 mb-1">Pending clearance</span>
                  <span className="text-base sm:text-lg font-medium text-white">₹0.00</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Options */}
          <div className="neuro-card bg-dark-800 rounded-lg p-4 sm:p-6 relative overflow-hidden">
            {/* Gradient accent line */}
            <div className="h-1 w-full bg-gradient-text absolute top-0 left-0"></div>
            
            <div className="relative z-10">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white">Add Funds</h2>
              <PaymentForm userId={session.user.id} />
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="neuro-card bg-dark-800 rounded-lg p-4 sm:p-6 relative overflow-hidden">
            {/* Gradient accent line */}
            <div className="h-1 w-full bg-gradient-text absolute top-0 left-0"></div>
            
            <div className="relative z-10">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white">Recent Transactions</h2>
              <TransactionsList 
                transactions={transactions} 
                currentUserId={session.user.id}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <div className="neuro-card bg-dark-800 rounded-lg p-4 sm:p-6 relative overflow-hidden">
            {/* Gradient accent line */}
            <div className="h-1 w-full bg-gradient-text absolute top-0 left-0"></div>
            
            <div className="relative z-10">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full py-2 px-4 bg-gradient-text text-white rounded-md hover:shadow-glow-blue transition neuro-button">
                  Add Funds
                </button>
                <button className="w-full py-2 px-4 bg-dark-900/50 text-white rounded-md hover:shadow-glow-blue transition neuro-button">
                  Withdraw Funds
                </button>
                <button className="w-full py-2 px-4 border border-dark-700 text-white rounded-md hover:bg-dark-700/20 transition">
                  View All Transactions
                </button>
              </div>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="neuro-card bg-dark-800 rounded-lg p-4 sm:p-6 relative overflow-hidden">
            {/* Gradient accent line */}
            <div className="h-1 w-full bg-gradient-text absolute top-0 left-0"></div>
            
            <div className="relative z-10">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Saved Payment Methods</h2>
              <div className="space-y-3">
                <div className="border border-dark-700 rounded-md p-3 flex items-center bg-dark-900/30">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 bg-dark-700 rounded-md flex items-center justify-center text-cyan-glow mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base text-white">•••• •••• •••• 4242</p>
                    <p className="text-xs text-gray-400">Expires 12/25</p>
                  </div>
                </div>
                <div className="border border-dark-700 rounded-md p-3 flex items-center bg-dark-900/30">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 bg-dark-700 rounded-md flex items-center justify-center text-magenta-glow mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base text-white">UPI: user@okbank</p>
                    <p className="text-xs text-gray-400">Default payment method</p>
                  </div>
                </div>
                <button className="w-full mt-2 text-sm text-cyan-glow hover:text-cyan-glow/80">
                  + Add New Payment Method
                </button>
              </div>
            </div>
          </div>
          
          {/* Fee Information */}
          <div className="neuro-card bg-dark-800 rounded-lg p-4 sm:p-6 relative overflow-hidden">
            {/* Gradient accent line */}
            <div className="h-1 w-full bg-gradient-text absolute top-0 left-0"></div>
            
            <div className="relative z-10">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Fee Information</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Platform fee</span>
                  <span className="text-white">2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment processing</span>
                  <span className="text-white">1.5% + ₹3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Withdrawal fee</span>
                  <span className="text-white">₹25 per transaction</span>
                </div>
                <div className="border-t border-dark-700 pt-2 mt-2">
                  <a href="#" className="text-cyan-glow hover:text-cyan-glow/80 text-xs">
                    View complete fee structure
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 