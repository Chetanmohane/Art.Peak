"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  images?: string[];
  bulkPricing?: { qty: number; price: number }[];
}

export interface CartItem {
  id: string; // Unique ID for the cart item
  product: Product;
  qty: number;
  customText?: string;
  customImage?: string | null;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, customText?: string, customImage?: string | null, qty?: number) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("artpeak_cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("artpeak_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product: Product, customText?: string, customImage?: string | null, qty: number = 1) => {
    const existing = cart.find(
      (item) => 
        item.product.id === product.id && 
        item.customText === customText && 
        item.customImage === customImage
    );

    if (existing) {
      setCart(cart.map((item) =>
        item.id === existing.id ? { ...item, qty: item.qty + qty } : item
      ));
    } else {
      const newItemId = `${product.id}-${Date.now()}`;
      setCart([...cart, { id: newItemId, product, qty, customText, customImage }]);
    }
  };

  const increaseQty = (id: string) => {
    setCart(cart.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    ));
  };

  const decreaseQty = (id: string) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setCart(cart.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const removeItem = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((total, item) => {
    let currentPrice = item.product.price;
    
    // Check for bulk pricing
    if (item.product.bulkPricing && item.product.bulkPricing.length > 0) {
      // Assuming bulkPricing array is sorted descending by qty
      const applicableTier = item.product.bulkPricing.find(tier => item.qty >= tier.qty);
      if (applicableTier) {
        currentPrice = applicableTier.price;
      }
    }
    
    return total + currentPrice * item.qty;
  }, 0);

  const totalItems = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increaseQty, decreaseQty, updateQty, removeItem, totalPrice, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
