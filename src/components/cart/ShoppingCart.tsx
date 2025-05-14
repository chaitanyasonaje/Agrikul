"use client";

import { useState } from "react";
import { useCart, CartItem } from "./CartContext";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Minus, Plus, CreditCard, ArrowRight } from "lucide-react";

export default function ShoppingCart({ onClose }: { onClose: () => void }) {
  const { items, removeItem, updateQuantity, totalItems, totalAmount } = useCart();
  
  if (items.length === 0) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />
        <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-hidden bg-dark-800 shadow-xl transition-transform duration-300 transform translate-x-0">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-gray-700 p-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <ShoppingBag className="mr-2" size={20} />
                Your Cart
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 bg-dark-700 rounded-full flex items-center justify-center">
                <ShoppingBag size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white">Your cart is empty</h3>
              <p className="text-gray-400 text-center">Browse our marketplace to find fresh farm products</p>
              <Link 
                href="/marketplace" 
                className="px-4 py-2 bg-gradient-to-r from-cyan-glow to-magenta-glow text-white rounded hover:shadow-glow transition-all duration-300"
                onClick={onClose}
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-hidden bg-dark-800 shadow-xl transition-transform duration-300 transform translate-x-0">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-700 p-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <ShoppingBag className="mr-2" size={20} />
              Your Cart ({totalItems} items)
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemCard 
                  key={item.productId} 
                  item={item} 
                  onRemove={() => removeItem(item.productId)} 
                  onUpdateQuantity={(qty) => updateQuantity(item.productId, qty)}
                />
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-700 p-4 bg-dark-700">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-white pt-2 border-t border-gray-600">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Link 
                href="/checkout" 
                className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-cyan-glow to-magenta-glow p-3 text-white rounded-md hover:shadow-glow transition-all duration-300"
                onClick={onClose}
              >
                <CreditCard size={18} />
                Proceed to Checkout
                <ArrowRight size={16} />
              </Link>
              <button 
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 bg-dark-800 p-3 text-white border border-gray-600 rounded-md hover:bg-dark-700 transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItemCard({ 
  item, 
  onRemove,
  onUpdateQuantity
}: { 
  item: CartItem; 
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}) {
  return (
    <div className="flex gap-4 p-3 bg-dark-700 rounded-lg">
      <div className="h-20 w-20 flex-shrink-0 rounded-md bg-dark-600 flex items-center justify-center overflow-hidden">
        {item.image ? (
          <Image src={item.image} alt={item.name} width={80} height={80} className="object-cover" />
        ) : (
          <div className="text-gray-500 text-xs text-center">No Image</div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-white truncate">{item.name}</h3>
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500">
            <X size={16} />
          </button>
        </div>
        
        <p className="text-xs text-gray-400 mt-1">From: {item.farmerName}</p>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center border border-gray-600 rounded-md">
            <button 
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="p-1 text-gray-400 hover:text-white disabled:opacity-50"
            >
              <Minus size={14} />
            </button>
            <span className="px-2 text-sm text-white">{item.quantity}</span>
            <button 
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="p-1 text-gray-400 hover:text-white"
            >
              <Plus size={14} />
            </button>
          </div>
          
          <div className="text-sm font-medium text-cyan-glow">
            ${(item.price.amount * item.quantity).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
} 