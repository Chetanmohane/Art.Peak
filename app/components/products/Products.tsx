"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Minus,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Loader2,
  Tag,
  Layers,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useSession } from "next-auth/react";
import { useTheme } from "../../context/ThemeContext";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  images?: string[];
  bulkPricing?: { qty: number; price: number }[];
  sizes?: { size: string; price: number }[];
  minQuantity?: number;
  inStock?: boolean;
}

function ProductCard({
  product,
  onCustomize,
  index,
}: {
  product: Product;
  onCustomize: (product: Product) => void;
  index: number;
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images =
    product.images && Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image || "/placeholder.png"];

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

  const hasBulk = product.bulkPricing && product.bulkPricing.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* ── Image Section ── */}
      <div className={`relative aspect-square overflow-hidden shrink-0 ${isLight ? "bg-[#f8fafc]" : "bg-black/20"}`}>
        <Image
          src={images[currentImageIndex]}
          alt={product.name}
          fill
          className={`object-contain transition-transform duration-700 p-2 ${
            product.inStock === false 
              ? "opacity-90 group-hover:scale-100" 
              : "group-hover:scale-105"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority={index < 4}
          unoptimized={images[currentImageIndex]?.startsWith('data:')}
        />

        {/* Dark gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[70%]">
          {product.category.split(",").map((cat, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-orange-600/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
              <Tag size={10} className="text-white" />
              <span className="text-[10px] text-white font-bold uppercase tracking-widest whitespace-nowrap">
                {cat.trim()}
              </span>
            </div>
          ))}
        </div>

        {/* Bulk badge */}
        {((product.minQuantity || 1) > 1) && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-600/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-lg">
            <Layers size={10} className="text-white" />
            <span className="text-[10px] text-white font-black uppercase tracking-tighter">Bulk Only ({product.minQuantity}+)</span>
          </div>
        )}
        {hasBulk && !((product.minQuantity || 1) > 1) && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-600/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Layers size={10} className="text-white" />
            <span className="text-[10px] text-white font-bold">Bulk</span>
          </div>
        )}
        {product.inStock === false && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="bg-white/95 dark:bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-red-500/20 flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
               <span className="text-red-500 dark:text-red-400 font-bold tracking-widest uppercase text-[9px] whitespace-nowrap">Out of Stock</span>
            </div>
          </div>
        )}

        {/* Image navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            >
              <ChevronRight size={14} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`rounded-full transition-all duration-300 ${
                    idx === currentImageIndex
                      ? "bg-orange-500 w-4 h-2"
                      : "bg-white/50 w-2 h-2"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Content Section ── */}
      <div className="flex flex-col flex-grow p-5 gap-4">
        {/* Stars + Name */}
        <div>
          <div className="flex items-center gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className="fill-orange-400 text-orange-400"
              />
            ))}
            <span
              className="text-xs ml-1.5 font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              5.0
            </span>
          </div>
          <h3
            className="text-base font-bold leading-snug line-clamp-2"
            style={{ color: "var(--text-primary)" }}
          >
            {product.name}
          </h3>

          {/* Sizes Display */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500/90 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Available Sizes
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((s, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-black px-2.5 py-1 rounded-lg border shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-default hover:border-orange-500/50"
                    style={{ 
                      backgroundColor: isLight ? "#ffffff" : "rgba(255,255,255,0.03)", 
                      borderColor: "var(--border-strong)",
                      color: "var(--text-primary)" 
                    }}
                  >
                    {s.size}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bulk Pricing Table */}
        {hasBulk && (
          <div
            className="rounded-xl p-3 border"
            style={{
              backgroundColor: "rgba(234,88,12,0.06)",
              borderColor: "rgba(234,88,12,0.2)",
            }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-2 flex items-center gap-1">
              <Layers size={10} />
              Bulk Pricing
            </p>
            <div className="space-y-1.5">
              {product.bulkPricing!.map((tier, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-xs"
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    {tier.qty}+ pcs
                  </span>
                  <span className="font-bold text-orange-400">
                    ₹{tier.price}/pc
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <p
              className="text-[10px] font-medium uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Starting at
            </p>
            <p
              className="text-2xl font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              ₹{product.price}
            </p>
          </div>

          {product.inStock === false ? (
            <button
              disabled
              className="flex items-center gap-2 bg-zinc-400 hover:bg-zinc-400 cursor-not-allowed px-4 py-2.5 rounded-xl text-white font-semibold text-sm whitespace-nowrap"
              style={{ backgroundColor: "var(--border-strong)", color: "var(--text-muted)" }}
            >
              Out of Stock
            </button>
          ) : (
            <button
              onClick={() => onCustomize(product)}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 active:scale-95 px-4 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-orange-600/20 whitespace-nowrap"
            >
              <Sparkles size={14} />
              Customize
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Products({ initialProducts, forcedCategory }: { initialProducts?: Product[], forcedCategory?: string }) {
  const { addToCart, totalPrice } = useCart();
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [activeCategory, setActiveCategory] = useState(forcedCategory || "All");
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(
    null
  );
  const [customText, setCustomText] = useState("");
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customQty, setCustomQty] = useState(1);
  
  // Set initial quantity based on product's minQuantity
  useEffect(() => {
    if (customizingProduct) {
      setCustomQty(customizingProduct.minQuantity || 1);
    }
  }, [customizingProduct]);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (customizingProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [customizingProduct]);

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

  const categories = [
    "All",
    ...Array.from(
      new Set(
        products.flatMap((p) => p.category.split(",").map((c) => c.trim()))
      )
    ),
  ].filter((cat) => cat !== "Gifts For Her" && cat !== "Gifts For Him");

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) =>
          p.category
            .split(",")
            .map((c) => c.trim())
            .includes(activeCategory)
        );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayed = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgUrl = reader.result as string;
        if (file.size > 1024 * 1024) { // > 1MB
          const img = new window.Image();
          img.src = imgUrl;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;
            if (width > height) {
              if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
            } else {
              if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, width, height);
            setCustomImage(canvas.toDataURL("image/jpeg", 0.6));
          };
        } else {
          setCustomImage(imgUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    if (status !== "authenticated") {
      window.dispatchEvent(new Event("open-auth-modal"));
      return;
    }
    if (customizingProduct) {
      addToCart(customizingProduct, customText, customImage, customQty, selectedSize);
      setCustomizingProduct(null);
      setCustomText("");
      setCustomImage(null);
      setCustomQty(1);
      setSelectedSize(null);
      window.dispatchEvent(new Event("open-cart-modal"));
    }
  };

  /* ── Bulk/Size price calc ── */
  const getBulkPrice = (product: Product | null, qty: number, selectedSizeName: string | null) => {
    if (!product) return 0;
    
    // 1. Get Base Price (Priority to Size Price if selected)
    let basePrice = product.price;
    if (selectedSizeName && product.sizes && Array.isArray(product.sizes)) {
      const sizeObj = product.sizes.find(s => s.size === selectedSizeName);
      if (sizeObj) basePrice = sizeObj.price;
    }

    // 2. Check for Bulk Discounts
    if (!product.bulkPricing || !Array.isArray(product.bulkPricing) || product.bulkPricing.length === 0) {
      return basePrice;
    }
    
    const applicableBulk = [...product.bulkPricing]
      .filter((t) => qty >= t.qty)
      .sort((a, b) => b.qty - a.qty);
      
    // If bulk is applied, we usually override the base (or we could calculate a % discount).
    // For now, let's assume bulk tiers are absolute prices.
    return applicableBulk[0]?.price ?? basePrice;
  };

  return (
    <section
      id="products"
      className="py-12 min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ── Section Header ── */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
              <Sparkles size={14} />
              Handcrafted with Love
            </p>
            <h2
              className="text-4xl sm:text-5xl font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">
                Products
              </span>
            </h2>
            <p
              className="mt-3 text-base max-w-md"
              style={{ color: "var(--text-secondary)" }}
            >
              Premium laser-engraved &amp; customised gifts for every occasion.
            </p>
          </div>

          {/* Product count badge - Clickable return to home products */}
          {!loading && products.length > 0 && (
            <Link
              href="/#products"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border self-start sm:self-auto transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 group cursor-pointer"
              style={{
                borderColor: "var(--border-strong)",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              <ShoppingCart
                size={16}
                className="text-orange-500 group-hover:rotate-12 transition-transform"
              />
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {products.length} Products
              </span>
            </Link>
          )}
        </div>

        {/* ── Quick Circular Filters ── */}
        {!loading && !forcedCategory && (
          <div className="flex flex-wrap justify-center gap-6 sm:gap-16 mb-12">
            {/* Gifts For Her */}
            <Link 
              href="/gifts-for-her"
              className={`flex flex-col items-center gap-2 sm:gap-3 cursor-pointer group transition-opacity duration-300 ${activeCategory === "Gifts For Her" ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
            >
              <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border-[3px] sm:border-4 overflow-hidden bg-white dark:bg-zinc-800 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl ${activeCategory === "Gifts For Her" ? "border-pink-500 shadow-pink-500/30" : "border-zinc-200 dark:border-zinc-700"}`}>
                <Image src="/gifts-for-her-new.png" alt="Gifts For Her" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-sm sm:text-lg font-black flex items-center gap-1.5 tracking-tight" style={{ color: "var(--text-primary)" }}>
                Gifts For Her! <span className="text-base sm:text-lg">💗</span>
              </h3>
            </Link>

            {/* Gifts For Him */}
            <Link 
              href="/gifts-for-him"
              className={`flex flex-col items-center gap-2 sm:gap-3 cursor-pointer group transition-opacity duration-300 ${activeCategory === "Gifts For Him" ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
            >
              <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border-[3px] sm:border-4 overflow-hidden bg-white dark:bg-zinc-800 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl ${activeCategory === "Gifts For Him" ? "border-blue-500 shadow-blue-500/30" : "border-zinc-200 dark:border-zinc-700"}`}>
                <Image src="/gifts-for-him-new.png" alt="Gifts For Him" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-sm sm:text-lg font-black flex items-center gap-1.5 tracking-tight" style={{ color: "var(--text-primary)" }}>
                Gifts For Him! <span className="text-base sm:text-lg">💙</span>
              </h3>
            </Link>
          </div>
        )}

        {/* ── Category Filter Tabs ── */}
        {!loading && categories.length > 1 && !forcedCategory && (
          <div className="flex gap-3 sm:gap-4 flex-wrap mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-widest border transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white border-transparent shadow-[0_8px_20px_-6px_rgba(234,88,12,0.6)] scale-105"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-orange-500/50 hover:shadow-lg hover:-translate-y-1"
                }`}
                style={
                  activeCategory !== cat
                    ? {
                        backgroundColor: "var(--bg-card)",
                        color: "var(--text-secondary)",
                      }
                    : {}
                }
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ── Product Grid ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            <p
              className="font-medium text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Loading masterpieces…
            </p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-28">
            <p style={{ color: "var(--text-muted)" }} className="text-lg">
              No products found. Stay tuned!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayed.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onCustomize={setCustomizingProduct}
                  index={idx}
                />
              ))}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-3">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    document.getElementById("products")?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 text-white hover:bg-orange-600 hover:border-orange-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/10 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        document.getElementById("products")?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-12 h-12 rounded-xl font-bold text-sm transition-all border ${
                        currentPage === page
                          ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20"
                          : "border-white/10 text-zinc-400 hover:border-orange-500/50 hover:text-white"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    document.getElementById("products")?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 text-white hover:bg-orange-600 hover:border-orange-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/10 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Customization Modal ── */}
        <AnimatePresence>
          {customizingProduct && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCustomizingProduct(null)}
                className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1000]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 24 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-full max-w-lg max-h-[92vh] overflow-y-auto border p-6 rounded-3xl shadow-2xl z-[1010] hide-scrollbar"
                style={{ 
                  backgroundColor: "var(--bg-drawer)", 
                  borderColor: "var(--border-strong)"
                }}
              >
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <h3 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>
                      Customize Your Order
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                      Tell us exactly what you want engraved
                    </p>
                  </div>
                  <button
                    onClick={() => setCustomizingProduct(null)}
                    className="transition p-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Product Preview */}
                <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl border"
                  style={{ 
                    backgroundColor: "var(--bg-tertiary)", 
                    borderColor: "var(--border)"
                  }}
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border"
                    style={{ borderColor: "var(--border-strong)" }}
                  >
                    <Image
                      src={customizingProduct.image}
                      alt={customizingProduct.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm leading-tight line-clamp-2" style={{ color: "var(--text-primary)" }}>
                      {customizingProduct.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs px-2 py-0.5 bg-orange-600/20 text-orange-400 rounded-full font-medium">
                        {customizingProduct.category}
                      </span>
                      <span className="text-orange-400 font-bold text-sm">
                        ₹{customizingProduct.price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Custom Text */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                      Custom Text{" "}
                      <span className="font-normal" style={{ color: "var(--text-muted)" }}>
                        (Name / Message / Quote)
                      </span>
                    </label>
                    <textarea
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="e.g. Rahul Sharma, Happy Birthday Mummy, Om Namah Shivay..."
                      className="w-full border focus:border-orange-500 rounded-xl p-4 placeholder-zinc-500 outline-none transition resize-none h-24 text-sm"
                      style={{ 
                        backgroundColor: "var(--bg-input)", 
                        borderColor: "var(--border-strong)",
                        color: "var(--text-primary)"
                      }}
                    />
                  </div>

                  {/* Size Selection */}
                  {customizingProduct.sizes && customizingProduct.sizes.length > 0 && (
                    <div className="mt-2">
                       <label className="block text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
                        Select Size <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {customizingProduct.sizes.map((sObj: any) => (
                           <button
                            key={sObj.size}
                            type="button"
                            onClick={() => setSelectedSize(sObj.size)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 flex flex-col items-center gap-0.5 ${
                              selectedSize === sObj.size
                                ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20"
                                : "bg-black/40 border-white/10 text-zinc-400 hover:border-orange-500/50"
                            }`}
                          >
                            <span>{sObj.size}</span>
                            <span className={`text-[9px] ${selectedSize === sObj.size ? "text-orange-200" : "text-zinc-500"}`}>₹{sObj.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                      Upload Photo / Logo{" "}
                      <span className="font-normal" style={{ color: "var(--text-muted)" }}>
                        (Optional)
                      </span>
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed hover:border-orange-500/50 hover:bg-orange-500/5 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all group"
                      style={{ 
                        borderColor: "var(--border-strong)",
                        backgroundColor: "var(--bg-input)"
                      }}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      {customImage ? (
                        <div className="relative w-full h-28 rounded-lg overflow-hidden">
                          <Image
                            src={customImage}
                            alt="Upload preview"
                            fill
                            className="object-contain"
                            unoptimized
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCustomImage(null);
                            }}
                            className="absolute top-1 right-1 bg-black/70 hover:bg-red-600/80 text-white rounded-full p-1 transition"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-11 h-11 rounded-full bg-orange-500/10 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                            <Upload className="text-orange-500" size={18} />
                          </div>
                          <p className="text-sm transition" style={{ color: "var(--text-secondary)" }}>
                            Click to upload image
                          </p>
                          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                            JPG, PNG, WEBP supported
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bulk Price Reference Table */}
                  {customizingProduct.bulkPricing && customizingProduct.bulkPricing.length > 0 && (
                    <div className="rounded-xl p-3 border" style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border)" }}>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
                        <Tag size={10} className="text-orange-500"/> Volume Discounts
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {[...(customizingProduct.bulkPricing || [])].sort((a,b) => a.qty - b.qty).map((tier, tidx) => (
                          <div key={tidx} className={`p-2 rounded-lg border flex flex-col items-center justify-center transition-all ${customQty >= tier.qty ? "bg-orange-600/10 border-orange-500/30 ring-1 ring-orange-500/20" : "border-transparent"}`}
                            style={customQty < tier.qty ? { backgroundColor: "var(--bg-input)" } : {}}>
                            <span className={`text-[10px] font-bold ${customQty >= tier.qty ? "text-orange-400" : ""}`} style={customQty < tier.qty ? { color: "var(--text-muted)" } : {}}>{tier.qty}+ Pcs</span>
                            <span className={`text-xs font-black ${customQty >= tier.qty ? "text-orange-500" : ""}`} style={customQty < tier.qty ? { color: "var(--text-secondary)" } : {}}>₹{tier.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-semibold mb-3 flex items-center justify-between" style={{ color: "var(--text-secondary)" }}>
                      <span>Quantity</span>
                      {(customizingProduct.minQuantity || 1) > 1 && (
                        <span className="text-[10px] font-black text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full border border-red-400/20">
                          Min. Order: {customizingProduct.minQuantity} Pcs
                        </span>
                      )}
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-xl overflow-hidden" 
                        style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-strong)" }}>
                        <button
                          onClick={() =>
                            setCustomQty((prev) => Math.max(customizingProduct.minQuantity || 1, prev - 1))
                          }
                          className="px-4 py-3 transition"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={customQty}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            const minVal = customizingProduct.minQuantity || 1;
                            if (!isNaN(val)) {
                              setCustomQty(Math.max(minVal, val));
                            }
                          }}
                          className="w-14 text-center font-bold bg-transparent outline-none border-none hide-number-spinners"
                          style={{ color: "var(--text-primary)" }}
                        />
                        <button
                          onClick={() => setCustomQty((prev) => prev + 1)}
                          className="px-4 py-3 transition"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Total breakdown */}
                      <div className="flex-1 border rounded-xl px-4 py-3 relative overflow-hidden group"
                        style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border)" }}>
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--text-muted)" }}>Price Details</p>
                          {customizingProduct.bulkPricing?.find(t => customQty >= t.qty) && (
                            <span className="text-[9px] animate-pulse bg-emerald-500/20 text-emerald-600 px-1.5 py-0.5 rounded font-black tracking-tighter uppercase">
                              Applied
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span style={{ color: "var(--text-muted)" }}>Unit Price:</span>
                            <span className={`font-bold ${getBulkPrice(customizingProduct, customQty, selectedSize) < customizingProduct.price ? "text-emerald-600" : ""}`}
                              style={getBulkPrice(customizingProduct, customQty, selectedSize) >= customizingProduct.price ? { color: "var(--text-primary)" } : {}}>
                              ₹{getBulkPrice(customizingProduct, customQty, selectedSize)}
                              {getBulkPrice(customizingProduct, customQty, selectedSize) < customizingProduct.price && 
                                <span className="text-[10px] line-through ml-1.5 opacity-50" style={{ color: "var(--text-muted)" }}>₹{customizingProduct.price}</span>
                              }
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center pt-1 border-t" style={{ borderColor: "var(--border)" }}>
                            <span className="font-bold" style={{ color: "var(--text-secondary)" }}>Total:</span>
                            <span className="text-orange-600 font-black text-xl">
                              ₹{getBulkPrice(customizingProduct, customQty, selectedSize) * customQty}
                            </span>
                          </div>
                        </div>

                        {/* Visual background flourish */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-600/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-orange-600/10 transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    onClick={handleAddToCart}
                    disabled={customizingProduct.sizes && customizingProduct.sizes.length > 0 && !selectedSize}
                    className="w-full mt-2 bg-orange-600 hover:bg-orange-500 active:scale-95 py-4 rounded-xl text-white font-black text-base shadow-lg shadow-orange-900/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={18} />
                    {customizingProduct.sizes && customizingProduct.sizes.length > 0 && !selectedSize ? "Please Select Size" : "Add to Cart"}
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