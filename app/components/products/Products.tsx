"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Plus, Minus, Trash2, ShoppingCart, Star, ChevronLeft, ChevronRight, Upload, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useSession } from "next-auth/react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  images?: string[];
  bulkPricing?: { qty: number; price: number }[];
}

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading ] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [customText, setCustomText] = useState("");
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customQty, setCustomQty] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error("Failed to fetch products", e);
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
             <p className="text-zinc-500 font-medium">Loading masterpieces...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">No products found. Stay tuned!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {(showAll ? products : products.slice(0, 4)).map((product) => (
                <ProductCard key={product.id} product={product} onCustomize={setCustomizingProduct} />
              ))}
            </div>

            {/* SEE MORE BUTTON */}
            {products.length > 4 && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="group relative px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold text-base shadow-xl shadow-orange-900/20 transition-all active:scale-95 flex items-center gap-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  {showAll ? (
                    <>
                      Show Less <ChevronLeft className="rotate-90 group-hover:-translate-y-1 transition-transform" size={20} />
                    </>
                  ) : (
                    <>
                      See More Products <ChevronRight className="rotate-90 group-hover:translate-y-1 transition-transform" size={20} />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

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
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-full max-w-lg max-h-[90vh] overflow-y-auto bg-zinc-900 border border-white/10 p-5 sm:p-6 rounded-3xl shadow-2xl z-[110] hide-scrollbar"
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

      </div>
    </section>
  );
}