"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, ShoppingCart, Plus, Minus, Trash2, ShoppingBag, Search, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import Image from "next/image";
import { searchContent, type SearchItem } from "../data/searchData";
import { useSession } from "next-auth/react";
import AuthModal from "./AuthModal";
import { User as UserIcon } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Products", href: "#products" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const sectionColors: Record<string, string> = {
  Page: "bg-blue-500/20 text-blue-400",
  Product: "bg-orange-500/20 text-orange-400",
  Service: "bg-green-500/20 text-green-400",
};

export default function Navbar() {
  const { cart, totalItems, totalPrice, increaseQty, decreaseQty, updateQty, removeItem } = useCart();
  const { theme, toggleTheme } = useTheme();
  
  // Guard the component early rendering sync (it prevents hydration mismatches)
  const isLight = theme === "light";

  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [highlighted, setHighlighted] = useState(0);
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [logo, setLogo] = useState("/images/logo/logo.png");
  const [paying, setPaying] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = document.querySelectorAll("section");
      sections.forEach((sec) => {
        const top = window.scrollY;
        const offset = sec.offsetTop - 120;
        const height = sec.clientHeight;
        const id = sec.getAttribute("id");
        if (top >= offset && top < offset + height && id) {
          setActive(id.charAt(0).toUpperCase() + id.slice(1));
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setCartOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const r = searchContent(query);
    setResults(r);
    setHighlighted(0);
  }, [query]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 80);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [searchOpen]);

  // Listen for 'open-auth-modal' events from other components (e.g. Products)
  useEffect(() => {
    const openAuth = () => setAuthOpen(true);
    window.addEventListener('open-auth-modal', openAuth);
    return () => window.removeEventListener('open-auth-modal', openAuth);
  }, []);

  const navigateTo = useCallback((href: string) => {
    setSearchOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSearchKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
      } else if (e.key === "Enter" && results[highlighted]) {
        navigateTo(results[highlighted].href);
      }
    },
    [results, highlighted, navigateTo]
  );

  const handlePayment = async () => {
    if (totalPrice <= 0) return;
    if (!session) {
      setAuthOpen(true);
      return;
    }
    setPaying(true);
    try {
      const res = await fetch("/api/paytm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });
      const data = await res.json();
      if (data.error) {
        alert("Payment Error: " + data.error);
        setPaying(false);
        return;
      }
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `https://securegw-stage.paytm.in/theia/processTransaction?ORDER_ID=${data.paytmParams.ORDER_ID}`;
      Object.entries({ ...data.paytmParams, CHECKSUMHASH: data.checksum }).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setPaying(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${
          scrolled ? "backdrop-blur-lg shadow-lg" : "shadow-none"
        }`}
        style={{
          // Use completely (isLight ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 0, 0)') values with matching alpha (preventing iOS/Safari black interpolation smudges)
          backgroundColor: scrolled ? (isLight ? "rgba(255, 255, 255, 0.95)" : "rgba(0, 0, 0, 0.85)") : (isLight ? "rgba(255, 255, 255, 0)" : "rgba(0, 0, 0, 0)"),
          borderBottom: scrolled ? (isLight ? "1px solid rgba(0, 0, 0, 0.08)" : "1px solid rgba(255, 255, 255, 0.08)") : (isLight ? "1px solid rgba(0, 0, 0, 0)" : "1px solid rgba(255, 255, 255, 0)"),
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {logo && <Image src={logo} alt="logo" width={48} height={48} className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white object-cover shadow-sm" unoptimized />}
            <h1 className="text-xl sm:text-2xl font-bold text-orange-500 tracking-tight">Art.Peak</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => {
              const isActive = active === link.name;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative transition font-medium"
                  style={{
                    color: isActive ? "#f97316" : (isLight ? (scrolled ? "#18181b" : "#3f3f46") : "#ffffff"),
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#fb923c";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = isLight ? (scrolled ? "#18181b" : "#3f3f46") : "#ffffff";
                  }}
                >
                  {link.name}
                  {isActive && (
                    <motion.span layoutId="underline" className="absolute left-0 -bottom-1 w-full h-[2px] bg-orange-500" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm group"
              style={{
                backgroundColor: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)",
                color: isLight ? "#52525b" : "#a1a1aa",
                border: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Search size={15} className="group-hover:text-orange-400 transition" />
              <span>Search...</span>
              <span
                className="text-[11px] px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
                  color: isLight ? "#71717a" : "#71717a",
                }}
              >
                ⌘K
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative flex items-center justify-center p-2.5 rounded-full transition-all duration-300 group cursor-pointer"
              style={{
                backgroundColor: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)",
                border: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.1)",
              }}
              title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              <AnimatePresence mode="wait">
                {isLight ? (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-5 h-5 text-zinc-700 group-hover:text-orange-500 transition-colors" />
                  </motion.div>
                ) : (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-colors" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Auth/Profile Icon */}
            {session ? (
              <Link
                href="/profile"
                className="relative flex items-center justify-center p-2.5 rounded-full transition-all duration-300 group cursor-pointer"
                style={{
                  backgroundColor: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)",
                  border: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.1)",
                }}
                title="My Profile"
              >
                <UserIcon className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
              </Link>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-full text-white text-sm font-semibold transition"
              >
                Log In
              </button>
            )}

            {/* Cart Icon */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center p-2.5 rounded-full transition-all duration-300 group cursor-pointer"
              style={{
                backgroundColor: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)",
                border: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <ShoppingCart className="text-orange-500 w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white shadow-sm shadow-orange-500 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </motion.span>
              )}
            </button>
          </div>

          {/* Mobile Icons */}
          <div className="md:hidden flex items-center gap-2 sm:gap-3">
            <button onClick={() => setSearchOpen(true)} className="hover:text-orange-400 transition" style={{ color: isLight ? "#52525b" : "#a1a1aa" }}>
              <Search size={20} />
            </button>
            <button onClick={toggleTheme} className="hover:text-orange-400 transition" aria-label="Toggle Theme">
              {isLight ? <Moon size={20} className="text-zinc-700" /> : <Sun size={20} className="text-orange-400" />}
            </button>
            
            {session ? (
              <Link href="/profile" className="hover:text-orange-400 transition text-orange-500">
                <UserIcon size={22} />
              </Link>
            ) : (
              <button onClick={() => setAuthOpen(true)} className="text-xs font-bold text-orange-500 uppercase">
                Login
              </button>
            )}

            <button onClick={() => setCartOpen(true)} className="relative">
              <ShoppingCart className="text-orange-500 w-5 h-5 sm:w-6 sm:h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
            {open ? (
              <X size={26} onClick={() => setOpen(false)} style={{ color: isLight ? (scrolled ? "#18181b" : "#3f3f46") : "#ffffff" }} />
            ) : (
              <Menu size={26} onClick={() => setOpen(true)} style={{ color: isLight ? (scrolled ? "#18181b" : "#3f3f46") : "#ffffff" }} />
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="md:hidden backdrop-blur-md px-6 py-6 space-y-6"
              style={{
                backgroundColor: isLight ? "rgba(255, 255, 255, 0.98)" : "rgba(0, 0, 0, 0.95)",
                borderBottom: isLight ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-lg font-medium transition"
                  style={{
                    color: active === link.name ? "#f97316" : (isLight ? "#18181b" : "#ffffff"),
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/* ===== SEARCH MODAL ===== */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 backdrop-blur-sm z-[80]"
              style={{ backgroundColor: isLight ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.7)" }}
            />
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.96 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="fixed top-[10vh] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[90] px-4"
            >
              <div
                className="rounded-2xl shadow-2xl overflow-hidden"
                style={{
                  backgroundColor: isLight ? "#ffffff" : "#18181b",
                  border: isLight ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)",
                  boxShadow: isLight ? "0 25px 50px -12px rgba(0,0,0,0.15)" : "0 25px 50px -12px rgba(0,0,0,0.6)",
                }}
              >
                {/* Input Row */}
                <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)" }}>
                  <Search size={20} className="text-orange-500 flex-shrink-0" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleSearchKey}
                    placeholder="Search products, services, pages..."
                    className="flex-1 bg-(isLight ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 0, 0)') text-lg outline-none"
                    style={{ color: isLight ? "#18181b" : "#ffffff" }}
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="transition" style={{ color: isLight ? "#a1a1aa" : "#71717a" }}>
                      <X size={18} />
                    </button>
                  )}
                  <kbd className="hidden sm:block text-xs border px-2 py-1 rounded-md" style={{ color: isLight ? "#71717a" : "#71717a", borderColor: isLight ? "#e4e4e7" : "#3f3f46" }}>
                    Esc
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {query === "" && (
                    <div className="px-5 py-8 text-center">
                      <Search size={36} className="mx-auto mb-3" style={{ color: isLight ? "#d4d4d8" : "#3f3f46" }} />
                      <p className="text-sm" style={{ color: isLight ? "#a1a1aa" : "#71717a" }}>
                        Type to search products, services & more...
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {["Wood", "Metal", "Glass", "Acrylic", "Logo", "CNC"].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setQuery(tag.toLowerCase())}
                            className="text-xs px-3 py-1.5 rounded-full transition border"
                            style={{
                              backgroundColor: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.05)",
                              borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)",
                              color: isLight ? "#52525b" : "#a1a1aa",
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {query !== "" && results.length === 0 && (
                    <div className="px-5 py-10 text-center">
                      <p style={{ color: isLight ? "#a1a1aa" : "#71717a" }}>
                        No results for <span style={{ color: isLight ? "#18181b" : "#ffffff" }}>&quot;{query}&quot;</span>
                      </p>
                    </div>
                  )}

                  {results.length > 0 && (
                    <div className="p-2">
                      {results.map((item, i) => (
                        <button
                          key={item.id}
                          onClick={() => navigateTo(item.href)}
                          onMouseEnter={() => setHighlighted(i)}
                          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-150 border"
                          style={{
                            backgroundColor: highlighted === i ? "rgba(249,115,22,0.1)" : "rgba(255,255,255,0)",
                            borderColor: highlighted === i ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0)",
                          }}
                        >
                          <span className="text-2xl w-9 flex-shrink-0 text-center">{item.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate" style={{ color: isLight ? "#18181b" : "#ffffff" }}>
                              {item.title}
                            </p>
                            <p className="text-xs mt-0.5 truncate" style={{ color: isLight ? "#71717a" : "#a1a1aa" }}>
                              {item.description}
                            </p>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                              sectionColors[item.sectionLabel] ?? "bg-white/10 text-zinc-400"
                            }`}
                          >
                            {item.sectionLabel}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== CART DRAWER ===== */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 backdrop-blur-sm z-[60]"
              style={{ backgroundColor: isLight ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.6)" }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[420px] border-l z-[70] flex flex-col shadow-2xl"
              style={{
                backgroundColor: isLight ? "#ffffff" : "#09090b",
                borderColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
              }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)" }}>
                <div className="flex items-center gap-3">
                  <ShoppingCart className="text-orange-500 w-6 h-6" />
                  <h2 className="text-xl font-bold" style={{ color: isLight ? "#18181b" : "#ffffff" }}>
                    Your Cart
                    {totalItems > 0 && (
                      <span className="ml-2 text-sm text-orange-500 font-normal">
                        ({totalItems} {totalItems === 1 ? "item" : "items"})
                      </span>
                    )}
                  </h2>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 rounded-full transition"
                  style={{ color: isLight ? "#71717a" : "#a1a1aa", backgroundColor: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.05)" }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <ShoppingBag className="w-20 h-20" style={{ color: isLight ? "#e4e4e7" : "#27272a" }} />
                    <p className="text-lg font-medium" style={{ color: isLight ? "#71717a" : "#a1a1aa" }}>
                      Your cart is empty
                    </p>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="mt-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <>
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        className="flex gap-4 rounded-2xl p-4 border"
                        style={{
                          backgroundColor: isLight ? "#fafafa" : "#18181b",
                          borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)",
                        }}
                      >
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <Image src={item.product.image} alt={item.product.name} fill className="object-cover" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: isLight ? "#18181b" : "#ffffff" }}>
                            {item.product.name}
                          </p>
                          <p className="text-orange-500 text-xs mt-0.5 uppercase tracking-wider">{item.product.category}</p>

                          {/* Customization Details */}
                          {(item.customText || item.customImage) && (
                            <div className="mt-1.5 flex flex-col gap-1.5">
                              {item.customText && (
                                <p className="text-[11px] px-1.5 py-0.5 rounded-md inline-flex w-fit max-w-full truncate" style={{ backgroundColor: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)", color: isLight ? "#52525b" : "#a1a1aa" }}>
                                  &quot;{item.customText}&quot;
                                </p>
                              )}
                              {item.customImage && (
                                <div className="w-8 h-8 relative rounded-md overflow-hidden border" style={{ borderColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" }}>
                                  <Image src={item.customImage} alt="Custom" fill className="object-cover" unoptimized />
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-orange-600 font-bold">
                              ₹{(
                                (item.product.bulkPricing 
                                  ? (item.product.bulkPricing.find(t => item.qty >= t.qty)?.price || item.product.price) 
                                  : item.product.price
                                ) * item.qty
                              ).toLocaleString()}
                            </p>
                            {item.product.bulkPricing && item.product.bulkPricing.find(t => item.qty >= t.qty) && (
                              <span className="text-[10px] text-green-600 font-bold bg-green-500/10 px-1.5 py-0.5 rounded">Bulk Applied</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => decreaseQty(item.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center transition"
                              style={{ backgroundColor: isLight ? "#e4e4e7" : "#27272a", color: isLight ? "#52525b" : "#d4d4d8" }}
                            >
                              <Minus size={14} />
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
                              className="font-bold text-sm w-10 text-center bg-transparent outline-none border-none hide-number-spinners"
                              style={{ color: isLight ? "#18181b" : "#ffffff" }}
                            />
                            <button
                              onClick={() => increaseQty(item.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center transition"
                              style={{ backgroundColor: isLight ? "#e4e4e7" : "#27272a", color: isLight ? "#52525b" : "#d4d4d8" }}
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="ml-auto p-1.5 hover:text-red-500 transition"
                              style={{ color: isLight ? "#a1a1aa" : "#71717a" }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div
                  className="px-6 py-5 border-t space-y-4"
                  style={{ backgroundColor: isLight ? "#fafafa" : "#09090b", borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)" }}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm" style={{ color: isLight ? "#52525b" : "#a1a1aa" }}>
                      <span>Subtotal ({totalItems} items)</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm" style={{ color: isLight ? "#52525b" : "#a1a1aa" }}>
                      <span>Shipping</span>
                      <span className="text-green-500 font-medium">FREE</span>
                    </div>
                    <div
                      className="flex justify-between font-bold text-lg pt-2 border-t"
                      style={{ color: isLight ? "#18181b" : "#ffffff", borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)" }}
                    >
                      <span>Total</span>
                      <span className="text-orange-600">₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={handlePayment}
                    disabled={paying}
                    className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-60 disabled:cursor-not-allowed py-4 rounded-2xl text-white font-bold text-base shadow-xl shadow-orange-600/20 transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                  >
                    {paying ? "Processing..." : <><ShoppingBag size={18} /> Pay ₹{totalPrice.toLocaleString()}</>}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
