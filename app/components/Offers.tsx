"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Tag, Clock, Sparkles, ChevronLeft, ChevronRight, ArrowRight, Gift, Percent, Star } from "lucide-react";
import Link from "next/link";

interface Offer {
  id: number;
  festival: string;
  title: string;
  subtitle: string;
  discount: string;
  code: string;
  validTill: string;
  emoji: string;
  gradient: string;
  accentColor: string;
  badge: string;
}

// ✅ Easy to update: add/edit/remove offers from here
const offers: Offer[] = [
  {
    id: 1,
    festival: "Holi Special",
    title: "Colorful Custom Gifts",
    subtitle: "Gift your loved ones personalized laser-engraved keepsakes this Holi season",
    discount: "25% OFF",
    code: "HOLI25",
    validTill: "March 15, 2026",
    emoji: "🎨",
    gradient: "linear-gradient(135deg, #ff6b6b 0%, #f06292 50%, #ce93d8 100%)",
    accentColor: "#f06292",
    badge: "Limited Time",
  },
  {
    id: 2,
    festival: "Bulk Order Deal",
    title: "Order 50+ Units & Save More",
    subtitle: "Perfect for corporate gifting, events & businesses — the more you order, the more you save",
    discount: "30% OFF",
    code: "BULK30",
    validTill: "Ongoing",
    emoji: "📦",
    gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
    accentColor: "#f97316",
    badge: "Best Value",
  },
  {
    id: 3,
    festival: "New Customer Offer",
    title: "First Order Discount",
    subtitle: "New to Art.Peak? Place your first order and enjoy an exclusive welcome discount",
    discount: "15% OFF",
    code: "WELCOME15",
    validTill: "Always Available",
    emoji: "🌟",
    gradient: "linear-gradient(135deg, #4ade80 0%, #22d3ee 50%, #818cf8 100%)",
    accentColor: "#4ade80",
    badge: "Welcome",
  },
  {
    id: 4,
    festival: "Summer Sale",
    title: "Hot Summer Deals on Gifting",
    subtitle: "Beat the summer heat with cool deals on personalized products for every occasion",
    discount: "20% OFF",
    code: "SUMMER20",
    validTill: "June 30, 2026",
    emoji: "☀️",
    gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
    accentColor: "#fbbf24",
    badge: "Seasonal",
  },
];

export default function Offers() {
  const [current, setCurrent] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ d: "00", h: "00", m: "00", s: "00" });

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer towards end of month
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) return;
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({
        d: String(d).padStart(2, "0"),
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const prev = () => setCurrent((prev) => (prev - 1 + offers.length) % offers.length);
  const next = () => setCurrent((prev) => (prev + 1) % offers.length);

  const offer = offers[current];

  return (
    <section id="offers" className="py-20 relative overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px] opacity-20" style={{ background: offer.accentColor }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[120px] opacity-20" style={{ background: offer.accentColor }} />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest mb-5"
          >
            <Gift size={13} /> Exclusive Offers
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Festival <span className="text-orange-500">Deals</span> & Special <span className="text-orange-500">Offers</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Grab the best deals on laser-engraved gifts for every festival and occasion.
          </motion.p>
        </div>

        {/* Main Offer Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="rounded-[2.5rem] overflow-hidden shadow-2xl relative"
              style={{ background: offer.gradient }}
            >
              {/* Noise overlay for texture */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
              }} />

              <div className="relative z-10 p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
                {/* Left: Offer Info */}
                <div>
                  {/* Festival Badge */}
                  <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest">
                    <Star size={11} fill="white" /> {offer.badge}
                  </div>

                  <div className="text-6xl mb-4">{offer.emoji}</div>

                  <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">{offer.festival}</p>
                  <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">{offer.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-6">{offer.subtitle}</p>

                  {/* Discount Badge */}
                  <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 mb-6">
                    <Percent size={18} className="text-white" />
                    <span className="text-3xl font-black text-white">{offer.discount}</span>
                  </div>

                  {/* Coupon Code */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5">
                      <Tag size={14} className="text-white/70" />
                      <span className="font-black text-white tracking-widest text-sm">{offer.code}</span>
                    </div>
                    <button
                      onClick={() => copyCode(offer.code)}
                      className="px-4 py-2.5 rounded-xl bg-white text-sm font-black transition-all duration-300 hover:scale-105 active:scale-95"
                      style={{ color: offer.accentColor }}
                    >
                      {copied === offer.code ? "✅ Copied!" : "Copy Code"}
                    </button>
                  </div>
                </div>

                {/* Right: Timer + CTA */}
                <div className="flex flex-col gap-6 items-start md:items-center">
                  {/* Countdown Timer */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 w-full max-w-xs">
                    <div className="flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-wider mb-4">
                      <Clock size={13} />
                      Offer Ends In
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { val: timeLeft.d, label: "Days" },
                        { val: timeLeft.h, label: "Hrs" },
                        { val: timeLeft.m, label: "Min" },
                        { val: timeLeft.s, label: "Sec" },
                      ].map(({ val, label }) => (
                        <div key={label} className="bg-white/10 rounded-xl py-3">
                          <p className="text-2xl font-black text-white tabular-nums">{val}</p>
                          <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider mt-1">{label}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-white/50 text-[11px] text-center mt-3 font-medium">Valid till: {offer.validTill}</p>
                  </div>

                  {/* CTA Button */}
                  <Link href="/#products" className="w-full max-w-xs">
                    <button className="w-full py-4 rounded-2xl bg-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl group"
                      style={{ color: offer.accentColor }}
                    >
                      <Sparkles size={16} />
                      Shop Now
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>

                  {/* Dots Navigation */}
                  <div className="flex gap-2 mx-auto">
                    {offers.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-white" : "w-2 bg-white/30"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrow Controls */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/50 transition z-20"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/50 transition z-20"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Below Cards: Offer Thumbnails */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {offers.map((o, i) => (
            <button
              key={o.id}
              onClick={() => setCurrent(i)}
              className={`rounded-2xl p-4 text-left border-2 transition-all duration-300 ${
                i === current ? "border-orange-500 scale-[1.02] shadow-lg shadow-orange-500/20" : "border-transparent opacity-60 hover:opacity-80"
              }`}
              style={{ background: o.gradient }}
            >
              <div className="text-2xl mb-2">{o.emoji}</div>
              <p className="text-white text-xs font-black truncate">{o.festival}</p>
              <p className="text-white/70 text-[10px] mt-0.5 font-bold">{o.discount}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
