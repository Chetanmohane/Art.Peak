"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, ShoppingCart, Plus, Minus, Trash2, ShoppingBag, Search, Sun, Moon, ArrowLeft, ShieldCheck, CreditCard, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import Image from "next/image";
import { searchContent, type SearchItem } from "../data/searchData";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import AuthModal from "./AuthModal";
import { User as UserIcon } from "lucide-react";


const navLinks = [
  { name: "Home", href: "/#home" },
  { name: "Products", href: "/#products" },
  { name: "Services", href: "/#services" },
  { name: "About", href: "/#about" },
  { name: "Contact", href: "/#contact" },
];

const sectionColors: Record<string, string> = {
  Page: "bg-blue-500/20 text-blue-400",
  Product: "bg-orange-500/20 text-orange-400",
  Service: "bg-green-500/20 text-green-400",
};

export default function Navbar() {
  const { cart, totalItems, totalPrice, originalTotal, discountAmount, discountOffer, applyDiscount, removeDiscount, increaseQty, decreaseQty, updateQty, removeItem, clearCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  
  const isLight = theme === "light";

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/admin/check")
        .then((res) => res.json())
        .then((data) => setIsAdmin(data.isAdmin))
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [status]);

  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [activeOffers, setActiveOffers] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [highlighted, setHighlighted] = useState(0);
  const [active, setActive] = useState("Home");

  const [scrolled, setScrolled] = useState(false);
  const [logo, setLogo] = useState("/images/logo/logo.png");
  const [paying, setPaying] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "address" | "method" | "qr" | "upi" | "upi_id" | "success">("cart");
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "upi" | "upi_id" | null>(null);
  const [enteredUpiId, setEnteredUpiId] = useState("");
  const [upiRequestSent, setUpiRequestSent] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    name: "", phone: "", email: "", address: "", city: "", state: "", pincode: ""
  });
  const [utr, setUtr] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [dynamicQrCode, setDynamicQrCode] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const shippingCost = (() => {
    if (!shippingDetails.state) return 0;
    const s = shippingDetails.state.toLowerCase().trim();
    return (s.includes("maharashtra") || s === "mh" || s === "maharastra") ? 50 : 100;
  })();
  
  const finalAmountToPay = checkoutStep === "cart" ? totalPrice : totalPrice + shippingCost;

  // Poll for Cashfree Order Status
  useEffect(() => {
    if ((!upiRequestSent && checkoutStep !== "qr") || !currentOrderId) return;

    
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/status?orderId=${currentOrderId}`);
        if (res.ok) {
           const data = await res.json();
           if (data.status === "processing" || data.status === "success" || data.status === "completed") {
              setCheckoutStep("success");
              setTimeout(() => {
                setCartOpen(false);
                clearCart();
                window.location.href = "/profile?tab=orders";
              }, 1500);
           }
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [upiRequestSent, currentOrderId]);

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

  // Listen for events from other components (e.g. Products)
  useEffect(() => {
    const openAuth = () => setAuthOpen(true);
    const openCart = () => setCartOpen(true);
    window.addEventListener('open-auth-modal', openAuth);
    window.addEventListener('open-cart-modal', openCart);
    return () => {
      window.removeEventListener('open-auth-modal', openAuth);
      window.removeEventListener('open-cart-modal', openCart);
    };
  }, []);
  useEffect(() => {
    if (!cartOpen) {
      setTimeout(() => {
        setCheckoutStep("cart");
        setPaymentMethod(null);
        setUtr("");
        setShippingDetails({ name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" });
      }, 300);
    } else {
      fetch("/api/offers")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setActiveOffers(data.filter((o: any) => o.isActive));
          }
        })
        .catch(console.error);
    }
  }, [cartOpen]);

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

  const handleQrOrder = async () => {
    const utrRegex = /^\d{12}$/;
    if (!utrRegex.test(utr.trim())) {
      alert("Invalid UTR ID. Please enter a valid 12-digit UTR number.");
      return;
    }
    setPaying(true);
    try {
      const res = await fetch("/api/orders/qr-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: JSON.stringify(cart),
          totalAmount: finalAmountToPay,
          transactionId: utr,
          shipping: shippingDetails
        }),
      });
      if (res.ok) {
        setCheckoutStep("success");
        setCartOpen(false);
        clearCart();
        window.location.href = "/profile?tab=orders";
      } else {
        alert(await res.text());
      }
    } catch (err) {
      console.error(err);
      alert("Failed to record order.");
    } finally {
      setPaying(false);
    }
  };

  const isAddressValid = () => {
    return shippingDetails.name.trim() !== "" && 
           shippingDetails.phone.trim() !== "" && 
           shippingDetails.address.trim() !== "" && 
           shippingDetails.city.trim() !== "" && 
           shippingDetails.state.trim() !== "" && 
           shippingDetails.pincode.trim() !== "";
  };
  
  if (pathname?.startsWith("/admin")) return null;

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
            <h1 className="text-xl sm:text-2xl font-bold text-orange-500 tracking-tight">ArtPeak.Shop</h1>
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

            {/* Admin Panel Button */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-orange-600/10 text-orange-600 border border-orange-600/20 hover:bg-orange-600 hover:text-white transition-all duration-300 font-bold text-xs group/admin"
              >
                <ShieldCheck size={14} className="group-hover/admin:scale-110 transition-transform" />
                Admin Panel
              </Link>
            )}

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
              
              {/* Admin Link Mobile */}
              {session && (session.user as any)?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 text-lg font-bold text-orange-500 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20"
                >
                  <ShieldCheck size={20} />
                  Admin Dashboard
                </Link>
              )}
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

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {/* Helper for calculating item price in render */}
                {(() => {
                  const getItemPrice = (item: any) => {
                    if (!item?.product) return 0;
                    let price = item.product.price || 0;
                    if (item.product.bulkPricing && Array.isArray(item.product.bulkPricing)) {
                      const tier = [...item.product.bulkPricing]
                        .sort((a,b) => b.qty - a.qty)
                        .find(t => item.qty >= t.qty);
                      if (tier) price = tier.price;
                    }
                    return price * (item.qty || 1);
                  };
                  return null;
                })()}
                
                <AnimatePresence mode="wait">
                  {checkoutStep === "cart" && (
                    <motion.div key="cart" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                          <ShoppingBag className="w-20 h-20" style={{ color: isLight ? "#e4e4e7" : "#27272a" }} />
                          <p className="text-lg font-medium" style={{ color: isLight ? "#71717a" : "#a1a1aa" }}>Your cart is empty</p>
                          <button onClick={() => setCartOpen(false)} className="mt-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition">Browse Products</button>
                        </div>
                      ) : (
                        cart.map((item) => (
                          <div key={item.id} className="flex gap-4 rounded-2xl p-4 border" style={{ backgroundColor: isLight ? "#fafafa" : "#18181b", borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)" }}>
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800">
                               {item?.product?.image ? (
                                 <Image src={item.product.image} alt={item.product.name} fill className="object-cover" unoptimized />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-[10px] text-zinc-500">No Image</div>
                               )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <p className="font-semibold text-xs truncate" style={{ color: isLight ? "#18181b" : "#ffffff" }}>{item?.product?.name || 'Unknown Product'}</p>
                                <p className="text-orange-500 text-[10px] mt-0.5 uppercase tracking-wider">{item?.product?.category || ''}</p>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex flex-col gap-2 flex-1">
                                  <div className="flex items-center gap-2">
                                     <button onClick={() => decreaseQty(item.id)} className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${isLight ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}><Minus size={12} /></button>
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
                                       className={`w-10 text-center font-bold text-xs bg-transparent outline-none border-none hide-number-spinners ${isLight ? "text-zinc-900" : "text-white"}`}
                                     />
                                     <button onClick={() => increaseQty(item.id)} className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${isLight ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}><Plus size={12} /></button>
                                  </div>
                                  
                                  {/* Customization Details */}
                                  {(item.customText || item.customImage) && (
                                    <div className={`mt-1 p-2 rounded-xl border flex gap-3 items-center ${isLight ? "bg-white border-zinc-100" : "bg-black/20 border-white/5"}`}>
                                      {item.customImage && (
                                        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                          <Image src={item.customImage} alt="Custom" fill className="object-cover" unoptimized />
                                        </div>
                                      )}
                                      {item.customText && (
                                        <p className="text-[10px] text-zinc-500 italic truncate max-w-[120px]">
                                          "{item.customText}"
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <button onClick={() => removeItem(item.id)} className="text-zinc-500 hover:text-red-500 transition p-2"><Trash2 size={14} /></button>
                              </div>
                            </div>
                            <div className="text-right flex flex-col justify-center shrink-0">
                               <p className="font-bold text-sm text-orange-500">
                                 ₹{(() => {
                                   if (!item?.product) return "0";
                                   let price = item.product.price || 0;
                                   if (item.product.bulkPricing && Array.isArray(item.product.bulkPricing)) {
                                     const tier = [...item.product.bulkPricing]
                                       .sort((a,b) => b.qty - a.qty)
                                       .find(t => item.qty >= t.qty);
                                     if (tier) price = tier.price;
                                   }
                                   return (price * (item.qty || 1)).toLocaleString();
                                 })()}
                               </p>
                            </div>
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}

                  {checkoutStep === "address" && (
                    <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="py-2">
                      {/* Header */}
                      <button onClick={() => setCheckoutStep("cart")} className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-orange-400 mb-5 transition group">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center bg-zinc-800 group-hover:bg-orange-500/20 transition"><ArrowLeft size={12}/></span>
                        Back to Cart
                      </button>

                      {/* Step Pill */}
                      <div className="flex items-center gap-2 mb-5">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white text-[11px] font-black flex items-center justify-center shadow-lg shadow-orange-500/30">1</span>
                          <span className="text-[11px] font-black text-orange-400 uppercase tracking-widest">Address</span>
                        </div>
                        <div className="flex-1 h-[2px] bg-gradient-to-r from-orange-500/30 to-zinc-700/30 rounded-full" />
                        <div className="flex items-center gap-2 opacity-35">
                          <span className="w-7 h-7 rounded-full border-2 border-zinc-600 text-zinc-400 text-[11px] font-black flex items-center justify-center">2</span>
                          <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Payment</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-black mb-0.5" style={{ color: isLight ? "#111827" : "#f4f4f5" }}>Shipping Details</h3>
                      <p className="text-xs font-medium text-zinc-400 mb-5">Enter your delivery address to continue.</p>

                      <div className="space-y-3">
                        {/* Name */}
                        <div className={`rounded-xl border-2 overflow-hidden transition-colors focus-within:border-orange-500 ${isLight ? "bg-white border-zinc-200" : "bg-zinc-800/80 border-zinc-700"}`}>
                          <label className="block text-[10px] font-black uppercase tracking-widest px-4 pt-3 pb-0.5 text-orange-400">Full Name <span className="text-red-400">*</span></label>
                          <input
                            required
                            value={shippingDetails.name}
                            onChange={e => setShippingDetails({...shippingDetails, name: e.target.value})}
                            className={`w-full px-4 pb-3 pt-1 text-sm font-semibold bg-transparent outline-none ${isLight ? "text-zinc-900 placeholder:text-zinc-400" : "text-white placeholder:text-zinc-500"}`}
                            placeholder="e.g. Rahul Sharma"
                          />
                        </div>

                        {/* Phone */}
                        <div className={`rounded-xl border-2 overflow-hidden transition-colors focus-within:border-orange-500 ${isLight ? "bg-white border-zinc-200" : "bg-zinc-800/80 border-zinc-700"}`}>
                          <label className="block text-[10px] font-black uppercase tracking-widest px-4 pt-3 pb-0.5 text-orange-400">Phone Number <span className="text-red-400">*</span></label>
                          <input
                            required
                            type="tel"
                            value={shippingDetails.phone}
                            onChange={e => setShippingDetails({...shippingDetails, phone: e.target.value})}
                            className={`w-full px-4 pb-3 pt-1 text-sm font-semibold bg-transparent outline-none ${isLight ? "text-zinc-900 placeholder:text-zinc-400" : "text-white placeholder:text-zinc-500"}`}
                            placeholder="e.g. 9876543210"
                          />
                        </div>

                        {/* Email */}
                        <div className={`rounded-xl border-2 overflow-hidden transition-colors focus-within:border-orange-500 ${isLight ? "bg-white border-zinc-200" : "bg-zinc-800/80 border-zinc-700"}`}>
                          <label className="block text-[10px] font-black uppercase tracking-widest px-4 pt-3 pb-0.5 text-orange-400">Email <span className="text-[9px] normal-case tracking-normal font-medium text-zinc-400">(optional)</span></label>
                          <input
                            type="email"
                            value={shippingDetails.email}
                            onChange={e => setShippingDetails({...shippingDetails, email: e.target.value})}
                            className={`w-full px-4 pb-3 pt-1 text-sm font-semibold bg-transparent outline-none ${isLight ? "text-zinc-900 placeholder:text-zinc-400" : "text-white placeholder:text-zinc-500"}`}
                            placeholder="e.g. rahul@email.com"
                          />
                        </div>

                        {/* Address */}
                        <div className={`rounded-xl border-2 overflow-hidden transition-colors focus-within:border-orange-500 ${isLight ? "bg-white border-zinc-200" : "bg-zinc-800/80 border-zinc-700"}`}>
                          <label className="block text-[10px] font-black uppercase tracking-widest px-4 pt-3 pb-0.5 text-orange-400">Street Address <span className="text-red-400">*</span></label>
                          <textarea
                            required
                            rows={2}
                            value={shippingDetails.address}
                            onChange={e => setShippingDetails({...shippingDetails, address: e.target.value})}
                            className={`w-full px-4 pb-3 pt-1 text-sm font-semibold bg-transparent outline-none resize-none ${isLight ? "text-zinc-900 placeholder:text-zinc-400" : "text-white placeholder:text-zinc-500"}`}
                            placeholder="Flat / House No., Street, Area..."
                          />
                        </div>

                        {/* City + State + Pincode */}
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: "City", key: "city", placeholder: "Mumbai" },
                            { label: "State", key: "state", placeholder: "MH" },
                            { label: "Pincode", key: "pincode", placeholder: "400001" },
                          ].map(({ label, key, placeholder }) => (
                            <div key={key} className={`rounded-xl border-2 overflow-hidden transition-colors focus-within:border-orange-500 ${isLight ? "bg-white border-zinc-200" : "bg-zinc-800/80 border-zinc-700"}`}>
                              <label className="block text-[9px] font-black uppercase tracking-widest px-3 pt-3 pb-0.5 text-orange-400">{label} <span className="text-red-400">*</span></label>
                              <input
                                required
                                value={(shippingDetails as Record<string, string>)[key]}
                                onChange={e => setShippingDetails({...shippingDetails, [key]: e.target.value})}
                                className={`w-full px-3 pb-3 pt-1 text-sm font-semibold bg-transparent outline-none ${isLight ? "text-zinc-900 placeholder:text-zinc-400" : "text-white placeholder:text-zinc-500"}`}
                                placeholder={placeholder}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="text-[9px] font-medium text-zinc-500 mt-4 ml-1"><span className="text-red-400">*</span> Required fields</p>
                    </motion.div>
                  )}




                  {checkoutStep === "method" && (
                    <motion.div key="method" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="py-2 space-y-6">
                      <button onClick={() => setCheckoutStep("address")} className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-orange-400 mb-2 transition group">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center bg-zinc-800 group-hover:bg-orange-500/20 transition"><ArrowLeft size={12}/></span>
                        Back to Address
                      </button>

                      <div className="flex items-center gap-2 mb-5">
                          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white text-[11px] font-black flex items-center justify-center shadow-lg shadow-emerald-500/30">✓</span>
                          <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">Address</span>
                          <div className="flex-1 h-[2px] bg-orange-500 rounded-full" />
                          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white text-[11px] font-black flex items-center justify-center shadow-lg shadow-orange-500/30">2</span>
                          <span className="text-[11px] font-black text-orange-400 uppercase tracking-widest font-black">Payment</span>
                      </div>

                      <h3 className="text-xl font-black mb-1" style={{ color: isLight ? "#111827" : "#f4f4f5" }}>Choose Payment</h3>
                      <p className="text-xs font-medium text-zinc-400 mb-6">Select your preferred payment method.</p>

                      <div className="grid gap-4">
                        <div
                          className={`flex items-center gap-4 p-5 rounded-3xl border-2 border-orange-500 bg-orange-500/5 transition-all group`}
                        >
                          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                            <CreditCard size={24} />
                          </div>
                          <div className="text-left">
                            <p className="font-black text-sm uppercase tracking-tight" style={{ color: isLight ? "#18181b" : "#ffffff" }}>Cashfree Checkout</p>
                            <p className="text-[10px] text-zinc-400 mt-0.5 font-bold uppercase tracking-wider">UPI / Card / NetBanking / Wallet</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}



                  {checkoutStep === "success" && (
                    <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                       <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}>
                             <ShieldCheck size={48} />
                          </motion.div>
                       </div>
                       <h3 className="text-2xl font-bold">Order Recorded!</h3>
                       <div className="flex gap-4 mt-2">
                         <button onClick={() => setCartOpen(false)} className="px-6 py-3 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold rounded-2xl transition">Continue Shopping</button>
                         <button onClick={() => { setCartOpen(false); window.location.href = '/profile?tab=orders'; }} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition shadow-lg shadow-emerald-900/20">View Orders</button>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && checkoutStep !== "success" && (
                <div className="px-6 py-5 border-t space-y-4" style={{ backgroundColor: isLight ? "#fafafa" : "#09090b", borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)" }}>
                  <div className="space-y-2">
                    {/* Promo Code Input */}
                    {checkoutStep === "cart" && (
                      <div className="mb-4">
                        {!discountOffer ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={promoInput}
                              onChange={(e) => {
                                setPromoInput(e.target.value.toUpperCase());
                                setPromoError("");
                              }}
                              placeholder="Have a promo code?"
                              className={`flex-1 px-3 py-2 text-sm rounded-xl outline-none border transition-colors ${
                                isLight 
                                  ? "bg-white border-zinc-200 focus:border-orange-400 text-zinc-900" 
                                  : "bg-zinc-800/80 border-zinc-700 focus:border-orange-500 text-white"
                              }`}
                            />
                            <button
                              onClick={async () => {
                                if (!promoInput) return;
                                const matched = activeOffers.find(o => o.code.toUpperCase() === promoInput.toUpperCase());
                                if (matched) {
                                  if (matched.minQuantity && totalItems < matched.minQuantity) {
                                    setPromoError(`Need ${matched.minQuantity} items to use this code.`);
                                    return;
                                  }
                                  if (matched.minAmount && originalTotal < matched.minAmount) {
                                    setPromoError(`Min. order ₹${matched.minAmount} required.`);
                                    return;
                                  }
                                }
                                const success = await applyDiscount(promoInput);
                                if (success) {
                                  setPromoSuccess(true);
                                  setPromoError("");
                                  setTimeout(() => setPromoSuccess(false), 3000);
                                } else {
                                  setPromoError("Invalid or expired code.");
                                }
                              }}
                              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shrink-0"
                            >
                              Apply
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                             <div className={`flex items-center justify-between p-3 rounded-xl border ${isLight ? "bg-orange-50 border-orange-200" : "bg-orange-500/10 border-orange-500/30"}`}>
                                <div className="flex items-center gap-2">
                                  <Tag size={16} className="text-orange-500" />
                                  <div className="text-sm font-bold" style={{ color: isLight ? "#18181b" : "#ffffff" }}>
                                    {discountOffer.code} <span className="text-orange-500 ml-1">(-{discountOffer.discountPercent}%)</span>
                                  </div>
                                </div>
                                <button onClick={removeDiscount} className="text-zinc-400 hover:text-red-500 transition">
                                  <Trash2 size={16} />
                                </button>
                             </div>
                             {discountOffer?.error && (
                               <p className="text-red-500 text-[10px] ml-1 font-bold animate-pulse">
                                 ⚠️ {discountOffer.error}
                               </p>
                             )}
                             {(discountOffer?.minQuantity || discountOffer?.minAmount) && !discountOffer.error && (
                               <div className="flex gap-2 items-center text-[9px] font-black uppercase tracking-widest text-emerald-500 mt-1 ml-1 opacity-80">
                                 <ShieldCheck size={10}/> Requirement Met:
                                 {discountOffer.minQuantity && <span>{discountOffer.minQuantity} Qty</span>}
                                 {discountOffer.minAmount && <span>₹{discountOffer.minAmount} Total</span>}
                                </div>
                             )}
                          </div>
                        )}
                        {promoError && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-semibold">{promoError}</p>}
                        {promoSuccess && <p className="text-emerald-500 text-[10px] mt-1.5 ml-1 font-semibold">Promo code applied successfully!</p>}
                        
                        {/* Live Requirement Hint while typing */}
                        {!discountOffer && promoInput.length >= 3 && !promoError && (() => {
                          const matchedOffer = activeOffers.find(o => o.code.toUpperCase().includes(promoInput.toUpperCase()));
                          if (matchedOffer && (matchedOffer.minQuantity > 0 || matchedOffer.minAmount > 0)) {
                            const metQty = totalItems >= matchedOffer.minQuantity;
                            const metAmt = originalTotal >= matchedOffer.minAmount;
                            return (
                              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className={`mt-3 p-3 rounded-xl border flex flex-col gap-2 ${isLight ? "bg-orange-50/50 border-orange-200" : "bg-orange-500/5 border-orange-500/20"}`}>
                                <div className="flex items-center justify-between">
                                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-orange-500 flex items-center gap-1.5"><Tag size={10}/> Unlock {matchedOffer.discountPercent}% Off:</p>
                                  <span className="text-[9px] font-black bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded uppercase">{matchedOffer.code}</span>
                                </div>
                                <div className="space-y-1.5">
                                  {matchedOffer.minQuantity > 0 && (
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                      <span className={isLight ? "text-zinc-500" : "text-zinc-400"}>Add {matchedOffer.minQuantity} Items:</span>
                                      <span className={metQty ? "text-emerald-500" : "text-orange-400"}>{totalItems} / {matchedOffer.minQuantity} {metQty && "✓"}</span>
                                    </div>
                                  )}
                                  {matchedOffer.minAmount > 0 && (
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                      <span className={isLight ? "text-zinc-500" : "text-zinc-400"}>Order Above ₹{matchedOffer.minAmount}:</span>
                                      <span className={metAmt ? "text-emerald-500" : "text-orange-400"}>₹{originalTotal} / ₹{matchedOffer.minAmount} {metAmt && "✓"}</span>
                                    </div>
                                  )}
                                </div>
                                {(!metQty || !metAmt) && (
                                  <p className="text-[9px] italic text-zinc-500 font-medium">Add more items to unlock this discount! ✨</p>
                                )}
                              </motion.div>
                            )
                          }
                          return null;
                        })()}
                      </div>
                    )}

                    <div className="flex justify-between text-sm" style={{ color: isLight ? "#52525b" : "#a1a1aa" }}>
                      <span>Subtotal ({totalItems} items)</span>
                      <span>₹{originalTotal ? originalTotal.toLocaleString() : "0"}</span>
                    </div>

                    {discountOffer && discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-orange-500 font-semibold font-medium">
                        <span>Discount ({discountOffer.code})</span>
                        <span>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    {checkoutStep !== "cart" && shippingDetails.state && (
                      <div className="flex justify-between text-sm font-semibold" style={{ color: isLight ? "#52525b" : "#a1a1aa" }}>
                        <span>Shipping ({shippingDetails.state})</span>
                        <span>+₹{shippingCost}</span>
                      </div>
                    )}

                    <div className="flex justify-between font-bold text-lg pt-2 border-t" style={{ color: isLight ? "#18181b" : "#ffffff", borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)" }}>
                      <span>Total</span>
                      <span className="text-orange-600">₹{finalAmountToPay ? finalAmountToPay.toLocaleString() : "0"}</span>
                    </div>
                  </div>
                  
                  {checkoutStep === "cart" && (
                    <button 
                      onClick={() => {
                        console.log("Proceed to Address - Status:", status);
                        if (status === "authenticated") {
                          setCheckoutStep("address");
                        } else {
                          setAuthOpen(true);
                        }
                      }} 
                      className="w-full bg-orange-600 hover:bg-orange-500 py-4 rounded-2xl text-white font-bold text-base shadow-xl shadow-orange-600/20 transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                    >
                       Proceed to Address <ArrowLeft className="rotate-180" size={18} />
                    </button>
                  )}

                  {checkoutStep === "address" && (
                    <button 
                      onClick={() => {
                        setCheckoutStep("method");
                        setPaymentMethod("upi_id");
                      }} 
                      disabled={!isAddressValid()}
                      className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 py-4 rounded-2xl text-white font-bold text-base shadow-xl shadow-orange-600/20 transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                    >
                       Continue to Payment <ArrowLeft className="rotate-180" size={18} />
                    </button>
                  )}

                  {checkoutStep === "method" && paymentMethod === "upi_id" && (
                     <button 
                        onClick={async () => {
                           setPaying(true);
                           try {
                              const res = await fetch("/api/cashfree", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                    amount: finalAmountToPay,
                                    customer_phone: shippingDetails.phone || "9999999999",
                                    customer_email: shippingDetails.email || "test@example.com",
                                    items: JSON.stringify(cart),
                                    shipping: shippingDetails
                                    })
                              });
                              const data = await res.json();
                              if (res.ok && data.success && data.paymentSessionId) {
                                    setCurrentOrderId(data.orderId);
                                    // @ts-ignore
                                    const { load } = await import('@cashfreepayments/cashfree-js');
                                    const cashfree = await load({ mode: data.environment === "PRODUCTION" ? "production" : "sandbox" });
                                    cashfree.checkout({ paymentSessionId: data.paymentSessionId, redirectTarget: "_self" });
                              } else {
                                    alert(`Payment Error: ${data.error || "Failed to initialize payment"}`);
                                    setPaying(false);
                              }
                           } catch (e) {
                              alert("Something went wrong initializing Cashfree Checkout.");
                              setPaying(false);
                           }
                        }} 
                        disabled={paying} 
                        className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 py-4 rounded-2xl text-white font-bold text-base shadow-xl shadow-orange-600/20 transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                     >
                        {paying ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span> : "Pay Securely with Cashfree"}
                     </button>
                  )}

                  {checkoutStep === "qr" && (
                    <button 
                      onClick={handleQrOrder}
                      disabled={paying || utr.length < 12}
                      className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 py-4 rounded-2xl text-white font-bold text-base shadow-xl shadow-orange-600/20 transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                    >
                      {paying ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span> : "Verify & Complete Order"}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
