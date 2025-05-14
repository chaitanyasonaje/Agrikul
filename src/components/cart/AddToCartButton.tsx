"use client";

import { useState } from "react";
import { useCart, CartItem } from "./CartContext";
import Button from "@/components/ui/Button";
import { Plus, Minus, ShoppingCart, Check } from "lucide-react";

interface ProductProps {
  id: string;
  name: string;
  price: {
    amount: number;
    currency: string;
    unit: string;
  };
  image?: string;
  farmerId: string;
  farmerName: string;
  minQuantity: number;
  availableQuantity: number;
}

export default function AddToCartButton({ product }: { product: ProductProps }) {
  const { addItem, getItemCount } = useCart();
  const [quantity, setQuantity] = useState(product.minQuantity);
  const [isAdded, setIsAdded] = useState(false);
  
  // Get current quantity in cart
  const cartQuantity = getItemCount(product.id);
  
  // Decrease quantity (but not below minimum)
  const decreaseQuantity = () => {
    if (quantity > product.minQuantity) {
      setQuantity(quantity - 1);
    }
  };
  
  // Increase quantity (but not above available)
  const increaseQuantity = () => {
    if (quantity < product.availableQuantity) {
      setQuantity(quantity + 1);
    }
  };
  
  // Add to cart
  const handleAddToCart = () => {
    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
    };
    
    addItem(cartItem);
    setIsAdded(true);
    
    // Reset the added state after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-300">Quantity</div>
        <div className="flex items-center">
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= product.minQuantity}
            className="w-8 h-8 rounded-full neuro-button flex items-center justify-center text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          
          <div className="w-16 h-10 mx-2 neuro-inset rounded-lg flex items-center justify-center text-white font-medium">
            {quantity}
          </div>
          
          <button
            onClick={increaseQuantity}
            disabled={quantity >= product.availableQuantity}
            className="w-8 h-8 rounded-full neuro-button flex items-center justify-center text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <Button
          onClick={handleAddToCart}
          className="w-full py-3 flex items-center justify-center gap-2 transition-all duration-300 group"
          variant="primary"
          disabled={isAdded}
        >
          {isAdded ? (
            <>
              <Check className="h-5 w-5 text-white animate-bounceIn" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200" />
              <span>Add to Cart</span>
            </>
          )}
        </Button>
        
        {cartQuantity > 0 && !isAdded && (
          <p className="text-center text-sm text-green-400">
            Already in cart: {cartQuantity} {cartQuantity === 1 ? 'item' : 'items'}
          </p>
        )}
        
        {product.availableQuantity <= 5 && (
          <p className="text-center text-sm text-yellow-400">
            Only {product.availableQuantity} left in stock
          </p>
        )}
      </div>
    </div>
  );
} 