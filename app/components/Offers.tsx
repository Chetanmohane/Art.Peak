"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Tag, Clock, ChevronLeft, ChevronRight, ArrowRight, Gift, Sparkles, Copy, Check } from "lucide-react";
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
  bg: string;       // card background gradient
  glow: string;     // glow color
  textAccent: string;
}

const offers: Offer[] = [
  {
    id: 1,
    festival: "Holi Special 🎨",
    title: "Rang Barse, Gifts Barse",
    subtitle: "Give the gift of personalisation this Holi — laser-engraved keepsakes that last a lifetime.",
    discount: "25% OFF",
    code: "HOLI25",
    validTill: "15 March 2026",
    emoji: "🎨",
    bg: "linear-gradient(135deg, #1a0a0a 0%, #2d1212 40%, #1a0a0a 100%)",
    glow: "#f43f5e",
    textAccent: "#fb7185",
  },
  {
    id: 2,
    festival: "Bulk Orders 📦",
    title: "More You Order, More You Save",
    subtitle: "Corporate gifting, events & custom merchandise — up to 30% off on bulk orders of 50+ units.",
    discount: "30% OFF",
    code: "BULK30",
    validTill: "Ongoing",
    emoji: "📦",
    bg: "linear-gradient(135deg, #0d0d0a 0%, #1c1a08 40%, #0d0d0a 100%)",
    glow: "#f97316",
    textAccent: "#fb923c",
  },
  {
    id: 3,
    festival: "Welcome Offer 🌟",
    title: "Your First Order, Our Best Price",
    subtitle: "New to Art.Peak? We welcome you with an exclusive first-order discount. No strings attached.",
    discount: "15% OFF",
    code: "WELCOME15",
    validTill: "Always Active",
    emoji: "🌟",
    bg: "linear-gradient(135deg, #03100a 0%, #071a10 40%, #03100a 100%)",
    glow: "#34d399",
    textAccent: "#6ee7b7",
  },
  {
    id: 4,
    festival: "Summer Sale ☀️",
    title: "Sizzling Deals This Summer",
    subtitle: "Beat the heat with cool savings on all engraved products — gifting was never this affordable.",
    discount: "20% OFF",
    code: "SUMMER20",
    validTill: "30 June 2026",
    emoji: "☀️",
    bg: "linear-gradient(135deg, #0a0a00 0%, #1a1500 40%, #0a0a00 100%)",
    glow: "#fbbf24",
    textAccent: "#fde68a",
  },
];

export default function Offers() {
  const [current, setCurrent] = useState(0);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState({ d: "00", h: "00", m: "00", s: "00" });

  // Auto-slide every 6s
  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % offers.length), 6000);
    return () => clearInterval(t);
  }, []);

  // Live countdown to end of month
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const ms = end.getTime() - now.getTime();
      setTime({
        d: String(Math.floor(ms / 86400000)).padStart(2, "0"),
        h: String(Math.floor((ms % 86400000) / 3600000)).padStart(2, "0"),
        m: String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0"),
        s: String(Math.floor((ms % 60000) / 1000)).padStart(2, "0"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(offers[current].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const offer = offers[current];

  return (
    <section
      id="offers"
      className="relative py-24 overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}
    >
      {/* ── Ambient Glow (follows active offer colour) ── */}
      <motion.div
        key={offer.id + "-glow"}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${offer.glow}18 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* ── Section Label ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/8 text-orange-400 text-[11px] font-black uppercase tracking-[0.18em] mb-5">
            <Gift size={12} /> Festival Offers
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
            Exclusive <span className="text-orange-500">Deals</span> &amp; <span className="text-orange-500">Discounts</span>
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Limited-time offers curated for every festival &amp; occasion. Grab them before they expire!
          </p>
        </motion.div>

        {/* ── Main Card ── */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -16 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="rounded-[2rem] overflow-hidden relative"
              style={{
                background: offer.bg,
                boxShadow: `0 0 80px ${offer.glow}22, 0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)`,
              }}
            >
              {/* Inner border glow */}
              <div
                className="absolute inset-[1px] rounded-[calc(2rem-1px)] pointer-events-none"
                style={{ boxShadow: `inset 0 0 60px ${offer.glow}12` }}
              />

              {/* Dot grid texture */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />

              <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-0">
                {/* ── LEFT PANEL ── */}
                <div className="p-10 md:p-14">
                  {/* Festival tag */}
                  <div
                    className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] mb-6 px-3 py-1 rounded-full"
                    style={{ background: `${offer.glow}22`, color: offer.textAccent }}
                  >
                    <Sparkles size={11} /> {offer.festival}
                  </div>

                  {/* Headline */}
                  <h3 className="text-3xl md:text-4xl font-black text-white leading-[1.15] mb-4 max-w-lg">
                    {offer.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-10 max-w-md" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {offer.subtitle}
                  </p>

                  {/* Discount pill + coupon row */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Big Discount Badge */}
                    <div
                      className="flex items-center gap-3 rounded-2xl px-6 py-4"
                      style={{
                        background: `linear-gradient(135deg, ${offer.glow}33, ${offer.glow}15)`,
                        border: `1px solid ${offer.glow}40`,
                      }}
                    >
                      <span className="text-4xl font-black text-white tracking-tight">
                        {offer.discount}
                      </span>
                    </div>

                    {/* Coupon code */}
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center gap-3 rounded-xl px-5 py-3.5 border"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          borderColor: "rgba(255,255,255,0.12)",
                        }}
                      >
                        <Tag size={14} style={{ color: offer.textAccent }} />
                        <span className="font-black text-white tracking-[0.18em] text-sm">
                          {offer.code}
                        </span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={copyCode}
                        className="flex items-center gap-2 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-widest transition-all duration-300"
                        style={{
                          background: copied ? `${offer.glow}30` : "rgba(255,255,255,0.1)",
                          color: copied ? offer.textAccent : "white",
                          border: `1px solid ${copied ? offer.glow + "60" : "rgba(255,255,255,0.12)"}`,
                        }}
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? "Copied!" : "Copy"}
                      </motion.button>
                    </div>
                  </div>

                  {/* Shop now */}
                  <div className="mt-10">
                    <Link href="/#products">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-white group transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${offer.glow}, ${offer.glow}aa)`,
                          boxShadow: `0 8px 30px ${offer.glow}44`,
                        }}
                      >
                        <Sparkles size={15} />
                        Shop Now &amp; Redeem
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </Link>
                  </div>
                </div>

                {/* ── RIGHT PANEL — Countdown ── */}
                <div
                  className="flex flex-col items-center justify-center gap-6 px-10 py-12 md:min-w-[260px] border-l"
                  style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.3)" }}
                >
                  <div className="text-center">
                    <div
                      className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                      style={{ color: offer.textAccent }}
                    >
                      <Clock size={12} /> Offer Expires In
                    </div>

                    {/* Timer Digits */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { v: time.d, l: "Days" },
                        { v: time.h, l: "Hrs" },
                        { v: time.m, l: "Min" },
                        { v: time.s, l: "Sec" },
                      ].map(({ v, l }) => (
                        <div key={l} className="flex flex-col items-center">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center mb-2 relative overflow-hidden"
                            style={{
                              background: `${offer.glow}18`,
                              border: `1px solid ${offer.glow}30`,
                              boxShadow: `inset 0 0 20px ${offer.glow}10`,
                            }}
                          >
                            <AnimatePresence mode="wait">
                              <motion.span
                                key={v}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 10, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-2xl font-black text-white tabular-nums"
                              >
                                {v}
                              </motion.span>
                            </AnimatePresence>
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {l}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="mt-5 text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Valid till: <span style={{ color: "rgba(255,255,255,0.55)" }}>{offer.validTill}</span>
                    </p>
                  </div>

                  {/* Dots nav */}
                  <div className="flex gap-2 mt-2">
                    {offers.map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => setCurrent(i)}
                        animate={{ width: i === current ? 28 : 8 }}
                        className="h-2 rounded-full transition-colors duration-300"
                        style={{ background: i === current ? offer.glow : "rgba(255,255,255,0.2)" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrow Controls */}
          <button
            onClick={() => setCurrent((p) => (p - 1 + offers.length) % offers.length)}
            className="absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 z-20 shadow-xl hidden md:flex"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrent((p) => (p + 1) % offers.length)}
            className="absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 z-20 shadow-xl hidden md:flex"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* ── Offer Thumbnails ── */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {offers.map((o, i) => (
            <motion.button
              key={o.id}
              onClick={() => setCurrent(i)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative rounded-2xl p-4 text-left overflow-hidden transition-all duration-300"
              style={{
                background: i === current ? `${o.glow}22` : "rgba(255,255,255,0.03)",
                border: `1px solid ${i === current ? o.glow + "60" : "rgba(255,255,255,0.07)"}`,
                boxShadow: i === current ? `0 8px 24px ${o.glow}22` : "none",
              }}
            >
              {i === current && (
                <motion.div
                  layoutId="thumb-active"
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: `${o.glow}10` }}
                />
              )}
              <div className="text-2xl mb-2">{o.emoji}</div>
              <p className="text-white text-xs font-bold leading-tight truncate">{o.festival.replace(/\s*\S+$/, "")}</p>
              <p className="text-[11px] font-black mt-1" style={{ color: o.textAccent }}>{o.discount}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
