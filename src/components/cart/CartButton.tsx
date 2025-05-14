"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import ShoppingCart from "./ShoppingCart";

export default function CartButton() {
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative p-2 text-gray-300 hover:text-cyan-glow transition-colors"
        aria-label="Open shopping cart"
      >
        <ShoppingBag size={20} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-cyan-glow to-magenta-glow text-xs text-white">
            {totalItems}
          </span>
        )}
      </button>
      
      {isCartOpen && <ShoppingCart onClose={() => setIsCartOpen(false)} />}
    </>
  );
} 