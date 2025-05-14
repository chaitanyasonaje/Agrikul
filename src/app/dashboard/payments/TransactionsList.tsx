"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, ArrowDownLeft, AlertCircle } from "lucide-react";

interface Transaction {
  _id: string;
  sender: {
    _id: string;
    name: string;
    userType: string;
  };
  recipient: {
    _id: string;
    name: string;
    userType: string;
  };
  amount: number;
  currency: string;
  transactionType: "deposit" | "withdrawal" | "transfer" | "payment" | "refund";
  status: "pending" | "completed" | "failed" | "cancelled";
  description: string;
  reference: string;
  createdAt: string;
}

interface TransactionsListProps {
  transactions: Transaction[];
  currentUserId: string;
}

export default function TransactionsList({ transactions, currentUserId }: TransactionsListProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No transactions found</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getTransactionIcon = (transaction: Transaction) => {
    const isIncoming = transaction.recipient._id === currentUserId;
    
    // Handle special transaction types
    if (transaction.transactionType === "deposit") {
      return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
    } else if (transaction.transactionType === "withdrawal") {
      return <ArrowUpRight className="h-5 w-5 text-orange-500" />;
    }
    
    // For payments and transfers
    return isIncoming 
      ? <ArrowDownLeft className="h-5 w-5 text-green-500" />
      : <ArrowUpRight className="h-5 w-5 text-orange-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "cancelled":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getTransactionTitle = (transaction: Transaction) => {
    const isIncoming = transaction.recipient._id === currentUserId;
    
    switch (transaction.transactionType) {
      case "deposit":
        return "Wallet Deposit";
      case "withdrawal":
        return "Wallet Withdrawal";
      case "payment":
        return isIncoming ? "Payment Received" : "Payment Sent";
      case "transfer":
        return isIncoming ? "Transfer Received" : "Transfer Sent";
      case "refund":
        return "Refund";
      default:
        return "Transaction";
    }
  };

  const getCounterpartyName = (transaction: Transaction) => {
    const isIncoming = transaction.recipient._id === currentUserId;
    return isIncoming ? transaction.sender.name : transaction.recipient.name;
  };

  return (
    <div className="space-y-1">
      {transactions.map((transaction) => {
        const isIncoming = transaction.recipient._id === currentUserId;
        
        return (
          <div 
            key={transaction._id} 
            className="p-3 rounded-md hover:bg-gray-50 cursor-pointer transition"
            onClick={() => setSelectedTransaction(transaction)}
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                {getTransactionIcon(transaction)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getTransactionTitle(transaction)}
                  </p>
                  <p className={`text-sm font-semibold ${isIncoming ? "text-green-600" : "text-gray-900"}`}>
                    {isIncoming ? "+" : "-"} {transaction.amount.toFixed(2)} {transaction.currency}
                  </p>
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center">
                    <p className="text-xs text-gray-500 truncate">
                      {getCounterpartyName(transaction)}
                    </p>
                    <span className="mx-1 text-gray-300">•</span>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                  
                  <span 
                    className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(transaction.status)}`}
                  >
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            {transaction.description && (
              <p className="text-xs text-gray-500 mt-1 ml-13 pl-13">
                {transaction.description}
              </p>
            )}
          </div>
        );
      })}
      
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Transaction Details</h3>
              <button 
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Reference:</span>
                <span className="font-medium">{selectedTransaction.reference}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium">{selectedTransaction.transactionType}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">From:</span>
                <span className="font-medium">{selectedTransaction.sender.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">To:</span>
                <span className="font-medium">{selectedTransaction.recipient.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">{selectedTransaction.amount.toFixed(2)} {selectedTransaction.currency}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(selectedTransaction.status)}`}>
                  {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium">
                  {new Date(selectedTransaction.createdAt).toLocaleString()}
                </span>
              </div>
              
              {selectedTransaction.description && (
                <div>
                  <span className="text-gray-500">Description:</span>
                  <p className="mt-1 text-sm">{selectedTransaction.description}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="px-4 py-2 bg-gray-100 rounded-md text-gray-800 hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 