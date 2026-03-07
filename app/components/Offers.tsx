"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Tag, Clock, ChevronLeft, ChevronRight, ArrowRight, Gift, Sparkles, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";

interface Offer {
  id: number;
  festival: string;
  title: string;
  subtitle: string;
  discount: string;
  code: string;
  validTill: string;
  emoji: string;
  glow: string;
  darkBg: string;
  lightBg: string;
  darkTextAccent: string;
  lightTextAccent: string;
}

const offers: Offer[] = [
  {
    id: 1,
    festival: "Holi Special",
    title: "Rang Barse, Gifts Barse",
    subtitle: "Give the gift of personalisation this Holi — laser-engraved keepsakes that last a lifetime.",
    discount: "25% OFF",
    code: "HOLI25",
    validTill: "15 March 2026",
    emoji: "🎨",
    glow: "#f43f5e",
    darkBg: "linear-gradient(135deg, #1a0a0e 0%, #2d1020 40%, #1a0a0e 100%)",
    lightBg: "linear-gradient(135deg, #fff1f5 0%, #ffe4ed 50%, #ffd6e8 100%)",
    darkTextAccent: "#fb7185",
    lightTextAccent: "#e11d48",
  },
  {
    id: 2,
    festival: "Bulk Orders",
    title: "More You Order, More You Save",
    subtitle: "Corporate gifting, events & custom merchandise — up to 30% off on bulk orders of 50+ units.",
    discount: "30% OFF",
    code: "BULK30",
    validTill: "Ongoing",
    emoji: "📦",
    glow: "#f97316",
    darkBg: "linear-gradient(135deg, #120900 0%, #251500 40%, #120900 100%)",
    lightBg: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)",
    darkTextAccent: "#fb923c",
    lightTextAccent: "#c2410c",
  },
  {
    id: 3,
    festival: "Welcome Gift",
    title: "Your First Order, Our Best Price",
    subtitle: "New to Art.Peak? We welcome you with an exclusive first-order discount. No strings attached.",
    discount: "15% OFF",
    code: "WELCOME15",
    validTill: "Always Active",
    emoji: "🌟",
    glow: "#10b981",
    darkBg: "linear-gradient(135deg, #021208 0%, #061f0f 40%, #021208 100%)",
    lightBg: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)",
    darkTextAccent: "#34d399",
    lightTextAccent: "#065f46",
  },
  {
    id: 4,
    festival: "Summer Sale",
    title: "Sizzling Deals This Summer",
    subtitle: "Beat the heat with cool savings on all engraved products — gifting was never this affordable.",
    discount: "20% OFF",
    code: "SUMMER20",
    validTill: "30 June 2026",
    emoji: "☀️",
    glow: "#f59e0b",
    darkBg: "linear-gradient(135deg, #0a0800 0%, #1c1400 40%, #0a0800 100%)",
    lightBg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)",
    darkTextAccent: "#fbbf24",
    lightTextAccent: "#92400e",
  },
];

export default function Offers() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [current, setCurrent] = useState(0);
  const [copied, setCopied] = useState(false);
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState({ d: "00", h: "00", m: "00", s: "00" });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide — pauses on hover/interaction
  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => setCurrent((p) => (p + 1) % offers.length), 6000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused]);

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

  const goTo = (i: number) => { setCurrent(i); setPaused(true); };
  const prev = () => { setCurrent((p) => (p - 1 + offers.length) % offers.length); setPaused(true); };
  const next = () => { setCurrent((p) => (p + 1) % offers.length); setPaused(true); };

  const offer = offers[current];
  const bg = isLight ? offer.lightBg : offer.darkBg;
  const accent = isLight ? offer.lightTextAccent : offer.darkTextAccent;

  return (
    <section
      id="offers"
      className="relative py-24 overflow-hidden"
      style={{ background: isLight ? "var(--bg-secondary, #f8fafc)" : "var(--bg-secondary, #09090b)" }}
    >
      {/* ── Ambient Glow ── */}
      <motion.div
        key={offer.id + "-glow"}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${offer.glow}${isLight ? "18" : "12"} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* ── Section Label ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-14"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.18em] mb-5"
            style={{
              background: `${offer.glow}15`,
              border: `1px solid ${offer.glow}40`,
              color: accent,
            }}
          >
            <Gift size={12} /> Festival Offers
          </span>
          <h2
            className="text-4xl md:text-5xl font-black tracking-tight"
            style={{ color: isLight ? "#18181b" : "#ffffff" }}
          >
            Exclusive{" "}
            <span style={{ color: offer.glow }}>Deals</span>{" "}
            &amp;{" "}
            <span style={{ color: offer.glow }}>Discounts</span>
          </h2>
          <p
            className="mt-4 max-w-lg text-sm leading-relaxed"
            style={{ color: isLight ? "#52525b" : "rgba(255,255,255,0.55)" }}
          >
            Limited-time offers curated for every festival &amp; occasion. Grab them before they expire!
          </p>

          {/* Pause indicator */}
          {paused && (
            <motion.button
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setPaused(false)}
              className="mt-4 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-all"
              style={{
                color: accent,
                borderColor: `${offer.glow}40`,
                background: `${offer.glow}10`,
              }}
            >
              ▶ Resume Auto-Slide
            </motion.button>
          )}
        </motion.div>

        {/* ── Main Card ── */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -16 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="rounded-[2rem] overflow-hidden relative"
              style={{
                background: bg,
                boxShadow: isLight
                  ? `0 4px 40px ${offer.glow}25, 0 12px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)`
                  : `0 0 80px ${offer.glow}18, 0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)`,
                border: isLight ? `1px solid ${offer.glow}30` : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Dot grid (light: faint, dark: faint white) */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, ${isLight ? offer.glow + "25" : "rgba(255,255,255,0.06)"} 1px, transparent 1px)`,
                  backgroundSize: "28px 28px",
                }}
              />

              <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-0">
                {/* ── LEFT PANEL ── */}
                <div className="p-10 md:p-14">
                  {/* Festival tag */}
                  <div
                    className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] mb-6 px-3 py-1 rounded-full"
                    style={{ background: `${offer.glow}20`, color: accent }}
                  >
                    <Sparkles size={11} /> {offer.festival}
                  </div>

                  <h3
                    className="text-3xl md:text-4xl font-black leading-[1.15] mb-4 max-w-lg"
                    style={{ color: isLight ? "#18181b" : "#ffffff" }}
                  >
                    {offer.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-10 max-w-md"
                    style={{ color: isLight ? "#52525b" : "rgba(255,255,255,0.55)" }}
                  >
                    {offer.subtitle}
                  </p>

                  {/* Discount + Coupon row */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Big Discount Badge */}
                    <div
                      className="flex items-center gap-3 rounded-2xl px-6 py-4"
                      style={{
                        background: `linear-gradient(135deg, ${offer.glow}${isLight ? "22" : "33"}, ${offer.glow}10)`,
                        border: `1px solid ${offer.glow}${isLight ? "40" : "35"}`,
                      }}
                    >
                      <span
                        className="text-4xl font-black tracking-tight"
                        style={{ color: isLight ? offer.glow : "#ffffff" }}
                      >
                        {offer.discount}
                      </span>
                    </div>

                    {/* Coupon Code */}
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center gap-3 rounded-xl px-5 py-3.5"
                        style={{
                          background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
                          border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`,
                        }}
                      >
                        <Tag size={14} style={{ color: accent }} />
                        <span
                          className="font-black tracking-[0.18em] text-sm"
                          style={{ color: isLight ? "#18181b" : "#ffffff" }}
                        >
                          {offer.code}
                        </span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={copyCode}
                        className="flex items-center gap-2 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-widest transition-all duration-300"
                        style={{
                          background: copied
                            ? `${offer.glow}25`
                            : isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)",
                          color: copied ? offer.glow : (isLight ? "#18181b" : "white"),
                          border: `1px solid ${copied ? offer.glow + "60" : (isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)")}`,
                        }}
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? "Copied!" : "Copy"}
                      </motion.button>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-10">
                    <Link href="/#products">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-white group transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${offer.glow}, ${offer.glow}bb)`,
                          boxShadow: `0 8px 30px ${offer.glow}40`,
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
                  className="flex flex-col items-center justify-center gap-6 px-10 py-12 md:min-w-[260px]"
                  style={{
                    borderLeft: `1px solid ${isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.05)"}`,
                    background: isLight ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.3)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {/* Timer */}
                  <div className="text-center w-full">
                    <div
                      className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                      style={{ color: accent }}
                    >
                      <Clock size={12} /> Offer Expires In
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { v: time.d, l: "Days" },
                        { v: time.h, l: "Hrs" },
                        { v: time.m, l: "Min" },
                        { v: time.s, l: "Sec" },
                      ].map(({ v, l }) => (
                        <div key={l} className="flex flex-col items-center">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center mb-2 overflow-hidden"
                            style={{
                              background: `${offer.glow}${isLight ? "15" : "18"}`,
                              border: `1px solid ${offer.glow}${isLight ? "35" : "30"}`,
                            }}
                          >
                            <AnimatePresence mode="wait">
                              <motion.span
                                key={v}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 10, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-2xl font-black tabular-nums"
                                style={{ color: isLight ? "#18181b" : "#ffffff" }}
                              >
                                {v}
                              </motion.span>
                            </AnimatePresence>
                          </div>
                          <span
                            className="text-[9px] font-black uppercase tracking-widest"
                            style={{ color: isLight ? "#71717a" : "rgba(255,255,255,0.35)" }}
                          >
                            {l}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p
                      className="mt-5 text-[11px]"
                      style={{ color: isLight ? "#a1a1aa" : "rgba(255,255,255,0.3)" }}
                    >
                      Valid till:{" "}
                      <span style={{ color: isLight ? "#52525b" : "rgba(255,255,255,0.55)" }}>
                        {offer.validTill}
                      </span>
                    </p>
                  </div>

                  {/* Dots */}
                  <div className="flex gap-2">
                    {offers.map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => goTo(i)}
                        animate={{ width: i === current ? 28 : 8 }}
                        className="h-2 rounded-full transition-colors duration-300"
                        style={{
                          background: i === current
                            ? offer.glow
                            : isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrow Buttons */}
          <button
            onClick={prev}
            className="absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full hidden md:flex items-center justify-center transition-all hover:scale-110 z-20 shadow-xl"
            style={{
              background: isLight ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.07)",
              border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`,
              color: isLight ? "#18181b" : "white",
              backdropFilter: "blur(12px)",
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full hidden md:flex items-center justify-center transition-all hover:scale-110 z-20 shadow-xl"
            style={{
              background: isLight ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.07)",
              border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`,
              color: isLight ? "#18181b" : "white",
              backdropFilter: "blur(12px)",
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* ── Thumbnail Chips ── */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {offers.map((o, i) => (
            <motion.button
              key={o.id}
              onClick={() => goTo(i)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative rounded-2xl p-4 text-left overflow-hidden transition-all duration-300"
              style={{
                background: i === current
                  ? (isLight ? `${o.glow}15` : `${o.glow}18`)
                  : (isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)"),
                border: `1px solid ${i === current ? o.glow + "50" : (isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)")}`,
                boxShadow: i === current ? `0 6px 20px ${o.glow}20` : "none",
              }}
            >
              <div className="text-2xl mb-2">{o.emoji}</div>
              <p
                className="text-xs font-bold leading-tight truncate"
                style={{ color: isLight ? "#18181b" : "#ffffff" }}
              >
                {o.festival}
              </p>
              <p
                className="text-[11px] font-black mt-1"
                style={{ color: i === current ? (isLight ? o.lightTextAccent : o.darkTextAccent) : (isLight ? "#71717a" : "rgba(255,255,255,0.4)") }}
              >
                {o.discount}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
