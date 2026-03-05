"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Plus, Minus, Trash2, ShoppingCart, Star, ChevronLeft, ChevronRight, Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useSession } from "next-auth/react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  images?: string[];
  bulkPricing?: { qty: number; price: number }[];
}

// ✅ Product-matched High-Quality Images from Unsplash
const productData: Product[] = [
  { 
    id: 1, 
    name: "Custom Wooden Keychain", 
    price: 200, 
    // Wooden keychain / wood craft
    image: "/images/keychain.jpg", 
    images: [
      "/images/keychain.jpg",
      "https://images.unsplash.com/photo-1611077544795-c94e0c4f1c3b?q=80&w=800&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1605342790938-23223011400a?q=80&w=800&auto=format&fit=crop"
    ],
    category: "Wood",
    bulkPricing: [
      { qty: 500, price: 20 },
      { qty: 100, price: 30 },
      { qty: 1, price: 200 }
    ]
  },
  { 
    id: 2, 
    name: "Metal Business Card", 
    price: 999, 
    // Sleek metal / steel business card
    image: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?q=80&w=800&auto=format&fit=crop", 
    images: [
      "https://images.unsplash.com/photo-1572021335469-31706a17aaef?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop"
    ],
    category: "Metal",
    bulkPricing: [
      { qty: 500, price: 50 },
      { qty: 100, price: 150 },
      { qty: 1, price: 999 }
    ]
  },
  { 
    id: 3, 
    name: "Glass Trophy Engraving", 
    price: 2499, 
    // Glass trophy / crystal award
    image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=800&auto=format&fit=crop", 
    images: [
      "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622037022824-0c71d511ef3c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506544777-64cfbea77c88?q=80&w=800&auto=format&fit=crop"
    ],
    category: "Glass",
    bulkPricing: [
      { qty: 50, price: 500 },
      { qty: 10, price: 1500 },
      { qty: 1, price: 2499 }
    ]
  },
  { 
    id: 4, 
    name: "Acrylic LED Logo", 
    price: 3999, 
    // Glowing neon / LED acrylic sign
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop", 
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563203369-26f2e8a5b285?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=800&auto=format&fit=crop"
    ],
    category: "Acrylic",
    bulkPricing: [
      { qty: 50, price: 1000 },
      { qty: 10, price: 2500 },
      { qty: 1, price: 3999 }
    ]
  },
];

function ProductCard({ product, onCustomize }: { product: Product, onCustomize: (product: Product) => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-500 group border flex flex-col" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}>
      <div className="relative h-64 overflow-hidden group/slider shrink-0">
        <Image
          src={images[currentImageIndex]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          unoptimized={true}
        />
        
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity">
              <ChevronRight size={16} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <div key={idx} className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-orange-500' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-orange-400 font-bold uppercase tracking-widest">
          {product.category}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className="fill-orange-500 text-orange-500" />
            ))}
          </div>
          <h3 className="text-lg font-semibold truncate" style={{ color: "var(--text-primary)" }}>{product.name}</h3>
          
          {product.bulkPricing && product.bulkPricing.length > 0 && (
            <div className="mt-3 bg-black/20 rounded-lg p-3 border border-white/5">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Bulk Pricing</p>
              <div className="space-y-1.5">
                {product.bulkPricing.map((tier, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">{tier.qty}{tier.qty === 1 ? ' pc' : '+ pcs'}</span>
                    <span className="text-orange-400 font-medium">₹{tier.price}/pc</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-between items-center">
           <span className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>₹{product.price}</span>
           <button
            onClick={() => onCustomize(product)}
            className="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg text-white transition-colors font-semibold text-sm"
          >
            Customize
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const { cart, addToCart, increaseQty, decreaseQty, updateQty, removeItem, totalPrice } = useCart();
  const { data: session } = useSession();
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [customText, setCustomText] = useState("");
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customQty, setCustomQty] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    if (customizingProduct) {
      addToCart(customizingProduct, customText, customImage, customQty);
      setCustomizingProduct(null);
      setCustomText("");
      setCustomImage(null);
      setCustomQty(1);
    }
  };

  // 🔥 PAYTM PAYMENT FUNCTION
  const handlePayment = async () => {
    if (totalPrice <= 0) {
      alert("Cart is empty");
      return;
    }
    if (!session) {
      window.dispatchEvent(new Event('open-auth-modal'));
      return;
    }
    alert(`Redirecting to Paytm for ₹${totalPrice}...`);
    // Payment Logic Implementation Here...
  };

  return (
    <section id="products" className="py-20 min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-4xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Our <span className="text-orange-500">Masterpieces</span>
            </h2>
            <p className="mt-2" style={{ color: "var(--text-secondary)" }}>Premium laser-engraved products for every occasion.</p>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {productData.map((product) => (
            <ProductCard key={product.id} product={product} onCustomize={setCustomizingProduct} />
          ))}
        </div>

        {/* CUSTOMIZATION MODAL */}
        <AnimatePresence>
          {customizingProduct && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCustomizingProduct(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-zinc-900 border border-white/10 p-6 rounded-3xl shadow-2xl z-[110]"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">Customize Order</h3>
                  <button onClick={() => setCustomizingProduct(null)} className="text-gray-400 hover:text-white transition">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mb-6 p-4 bg-black/40 rounded-2xl border border-white/5">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <Image src={customizingProduct.image} alt={customizingProduct.name} fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{customizingProduct.name}</h4>
                    <p className="text-orange-500 font-bold">₹{customizingProduct.price}</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Custom Text (e.g. Name, Message)</label>
                    <textarea
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="Enter the text to engrave/print..."
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors resize-none h-24"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Upload Custom Logo/Image (Optional)</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/5 transition-all text-center group"
                    >
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                      {customImage ? (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden">
                          <Image src={customImage} alt="Custom upload" fill className="object-contain" unoptimized />
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="text-orange-500" size={20} />
                          </div>
                          <p className="text-sm border rounded-full px-4 py-1.5 border-white/10 text-gray-400 group-hover:text-white transition-colors">
                            Click to upload image
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-black/50 border border-white/10 rounded-xl px-2 py-1 flex-shrink-0">
                        <button 
                          onClick={() => setCustomQty(prev => Math.max(1, prev - 1))}
                          className="p-3 text-gray-400 hover:text-white transition"
                        >
                          <Minus size={18} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={customQty}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) setCustomQty(val);
                          }}
                          onBlur={(e) => {
                            if (e.target.value === "" || parseInt(e.target.value) <= 0) {
                              setCustomQty(1);
                            }
                          }}
                          className="text-white w-12 text-center text-lg font-bold bg-transparent outline-none border-none hide-number-spinners"
                        />
                        <button 
                          onClick={() => setCustomQty(prev => prev + 1)}
                          className="p-3 text-gray-400 hover:text-white transition"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <div className="text-orange-500 flex flex-col items-end">
                        <span className="font-bold text-lg">
                          Total: ₹{
                            (customizingProduct.bulkPricing 
                              ? (customizingProduct.bulkPricing.find(t => customQty >= t.qty)?.price || customizingProduct.price) 
                              : customizingProduct.price
                            ) * customQty
                          }
                        </span>
                        {customizingProduct.bulkPricing && customizingProduct.bulkPricing.find(t => customQty >= t.qty) && (
                           <span className="text-xs text-green-400 font-medium bg-green-400/10 px-2 py-0.5 rounded">Bulk Discount Applied</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full mt-4 bg-orange-600 hover:bg-orange-500 py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-orange-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Plus size={20} /> Add to Cart
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* CART DRAWER / SECTION */}
        {cart.length > 0 && (
          <div className="mt-20 bg-zinc-900 border border-orange-500/20 p-8 rounded-3xl shadow-2xl max-w-3xl mx-auto relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
            
            <h3 className="text-white text-2xl font-bold mb-8 flex items-center gap-3">
              <ShoppingCart size={28} className="text-orange-500" /> 
              Shopping Cart
            </h3>

            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                       <Image src={item.product.image} alt={item.product.name} fill className="object-cover" unoptimized={true} />
                    </div>
                    <div>
                      <p className="text-white font-medium text-lg">{item.product.name}</p>
                      <p className="text-orange-500 font-bold flex items-center gap-2">
                        ₹
                        {item.product.bulkPricing 
                          ? (item.product.bulkPricing.find(t => item.qty >= t.qty)?.price || item.product.price) 
                          : item.product.price} 
                        <span className="text-gray-500 font-normal text-sm ml-1">x {item.qty}</span>
                        {item.product.bulkPricing && item.product.bulkPricing.find(t => item.qty >= t.qty) && (
                          <span className="text-xs text-green-400 font-medium bg-green-400/10 px-2 py-0.5 rounded ml-1">Bulk Price</span>
                        )}
                      </p>
                      
                      {item.customText && (
                        <p className="text-gray-300 text-sm mt-1.5 bg-black/40 px-2.5 py-1 rounded inline-block max-w-[200px] truncate">
                          &quot;{item.customText}&quot;
                        </p>
                      )}
                      {item.customImage && (
                        <div className="mt-2 w-10 h-10 relative rounded-md overflow-hidden border border-white/10">
                          <Image src={item.customImage} alt="Custom" fill className="object-cover" unoptimized />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-zinc-800 rounded-xl px-2 py-1">
                      <button onClick={() => decreaseQty(item.id)} className="p-2 text-gray-400 hover:text-white transition">
                        <Minus size={18} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) updateQty(item.id, val);
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "" || parseInt(e.target.value) <= 0) {
                            updateQty(item.id, 1);
                          }
                        }}
                        className="text-white w-10 text-center font-bold bg-transparent outline-none border-none hide-number-spinners"
                      />
                      <button onClick={() => increaseQty(item.id)} className="p-2 text-gray-400 hover:text-white transition">
                        <Plus size={18} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-3 text-zinc-500 hover:text-red-500 transition">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-8">
                <span className="text-gray-400 text-xl">Grand Total</span>
                <span className="text-white text-4xl font-black italic">₹{totalPrice}</span>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 py-5 rounded-2xl text-white font-black text-xl shadow-xl shadow-orange-900/20 transition-all active:scale-95 uppercase tracking-widest"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}