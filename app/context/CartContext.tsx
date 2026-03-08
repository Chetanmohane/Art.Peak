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
  sizes?: { size: string; price: number }[];
}

export interface CartItem {
  id: string; // Unique ID for the cart item
  product: Product;
  qty: number;
  customText?: string;
  customImage?: string | null;
  selectedSize?: string | null;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, customText?: string, customImage?: string | null, qty?: number, selectedSize?: string | null) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
  originalTotal: number;
  discountAmount: number;
  totalItems: number;
  discountOffer: { 
    code: string; 
    discountPercent: number; 
    minQuantity?: number; 
    minAmount?: number;
    error?: string;
  } | null;
  applyDiscount: (code: string) => Promise<boolean>;
  removeDiscount: () => void;
}


const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [discountOffer, setDiscountOffer] = useState<{ 
    code: string; 
    discountPercent: number;
    minQuantity?: number;
    minAmount?: number;
    error?: string;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("artpeak_cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed.filter(item => item && item.product && item.id));
        }
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("artpeak_cart", JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart. It might exceed the 5MB localStorage limit.", e);
        // Alert the user if space is full or clear out old items 
        alert("Warning: Cart is too large to save. Try removing some large images.");
      }
    }
  }, [cart, isLoaded]);

  const addToCart = (product: Product, customText?: string, customImage?: string | null, qty: number = 1, selectedSize: string | null = null) => {
    const existing = cart.find(
      (item) => 
        item?.product?.id === product.id && 
        item?.customText === customText && 
        item?.customImage === customImage &&
        item?.selectedSize === selectedSize
    );

    if (existing) {
      setCart(cart.map((item) =>
        item.id === existing.id ? { ...item, qty: item.qty + qty } : item
      ));
    } else {
      const newItemId = `${product.id}-${Date.now()}`;
      setCart([...cart, { id: newItemId, product, qty, customText, customImage, selectedSize }]);
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

  const clearCart = () => {
    setCart([]);
  };

  const originalTotal = cart.reduce((total, item) => {
    if (!item.product) return total;
    let currentPrice = item.product.price;
    
    // 1. Check if a size is selected and if it has a custom price
    if (item.selectedSize && item.product.sizes && Array.isArray(item.product.sizes)) {
      const sizeObj = item.product.sizes.find(s => s.size === item.selectedSize);
      if (sizeObj) {
        currentPrice = sizeObj.price;
      }
    }
    
    // 2. Apply Bulk Pricing if applicable
    if (item.product.bulkPricing && Array.isArray(item.product.bulkPricing) && item.product.bulkPricing.length > 0) {
      const applicableTier = [...item.product.bulkPricing]
        .sort((a, b) => b.qty - a.qty)
        .find(tier => item.qty >= tier.qty);
      if (applicableTier) {
        currentPrice = applicableTier.price;
      }
    }
    
    return total + (currentPrice || 0) * item.qty;
  }, 0);

  const totalItems = cart.reduce((total, item) => total + (item.qty || 0), 0);

  // Validate discount whenever cart, totalItems, or originalTotal changes
  useEffect(() => {
    if (discountOffer) {
      if (discountOffer.minQuantity && totalItems < discountOffer.minQuantity) {
        setDiscountOffer(prev => prev ? { ...prev, error: `Minimum ${discountOffer.minQuantity} items required for this offer.` } : null);
      } else if (discountOffer.minAmount && originalTotal < discountOffer.minAmount) {
        setDiscountOffer(prev => prev ? { ...prev, error: `Minimum order value ₹${discountOffer.minAmount} required for this offer.` } : null);
      } else if (discountOffer.error) {
        setDiscountOffer(prev => prev ? { ...prev, error: undefined } : null);
      }
    }
  }, [totalItems, originalTotal]);

  const discountAmount = (discountOffer && !discountOffer.error) ? (originalTotal * discountOffer.discountPercent) / 100 : 0;
  const totalPrice = originalTotal - discountAmount;

  const applyDiscount = async (code: string) => {
    try {
      const res = await fetch("/api/offers");
      const offers = await res.json();
      const offer = offers.find((o: any) => o.code.toUpperCase() === code.toUpperCase() && o.isActive);
      
      if (offer) {
        if (offer.minQuantity && totalItems < offer.minQuantity) {
          return false;
        }
        if (offer.minAmount && originalTotal < offer.minAmount) {
          return false;
        }

        setDiscountOffer({ 
          code: offer.code, 
          discountPercent: offer.discountPercent,
          minQuantity: offer.minQuantity,
          minAmount: offer.minAmount
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const removeDiscount = () => {
    setDiscountOffer(null);
  };

  return (
    <CartContext.Provider
      value={{ 
        cart, addToCart, increaseQty, decreaseQty, updateQty, removeItem, clearCart, 
        totalPrice, originalTotal, discountAmount, totalItems, 
        discountOffer, applyDiscount, removeDiscount 
      }}
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
