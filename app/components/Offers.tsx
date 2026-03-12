"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Tag, Clock, ChevronLeft, ChevronRight, ArrowRight, Gift, Sparkles, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";

interface Offer {
  id: string; // Changed from number to string as Prisma uses CUID string id
  festival: string;
  title: string;
  subtitle: string;
  discountPercent: number; // Changed to match schema
  code: string;
  validTill: string;
  emoji: string;
  glow: string;
  darkBg: string;
  lightBg: string;
  darkTextAccent: string;
  lightTextAccent: string;
  isActive: boolean;
}

export default function Offers({ initialOffers }: { initialOffers?: Offer[] }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [offers, setOffers] = useState<Offer[]>(initialOffers || []);
  const [current, setCurrent] = useState(0);
  const [copied, setCopied] = useState(false);
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState({ d: "00", h: "00", m: "00", s: "00" });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/offers")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setOffers(data.filter((o: Offer) => o.isActive));
        }
      })
      .catch(console.error);
  }, []);

  // Auto-slide — pauses on hover/interaction
  useEffect(() => {
    if (paused || offers.length === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => setCurrent((p) => (p + 1) % offers.length), 6000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused, offers.length]);

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
    if (offers.length === 0) return;
    navigator.clipboard.writeText(offers[current].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const goTo = (i: number) => { setCurrent(i); setPaused(true); };
  const prev = () => { setCurrent((p) => (p - 1 + offers.length) % offers.length); setPaused(true); };
  const next = () => { setCurrent((p) => (p + 1) % offers.length); setPaused(true); };

  if (offers.length === 0) return null;

  const offer = offers[current] || offers[0];
  const bg = isLight ? offer.lightBg : offer.darkBg;
  const accent = isLight ? offer.lightTextAccent : offer.darkTextAccent;

  return (
    <section
      id="offers"
      className="relative py-12 overflow-hidden"
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
            className="text-3xl md:text-5xl font-black tracking-tight px-4"
            style={{ color: isLight ? "#18181b" : "#ffffff" }}
          >
            Exclusive{" "}
            <span style={{ color: offer.glow }}>Deals</span>{" "}
            &amp;{" "}
            <span style={{ color: offer.glow }}>Discounts</span>
          </h2>
          <p
            className="mt-4 max-w-lg text-[13px] md:text-sm leading-relaxed px-4"
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
              className="rounded-[2.5rem] overflow-hidden relative group"
              style={{
                background: bg,
                boxShadow: isLight
                  ? `0 20px 60px -12px ${offer.glow}30, 0 12px 40px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.8)`
                  : `0 30px 100px -20px ${offer.glow}25, 0 0 1px rgba(255,255,255,0.2), inset 0 1px 1px rgba(255,255,255,0.1)`,
                border: isLight ? `1px solid ${offer.glow}20` : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* ── Animated Background Reflection ── */}
              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                  opacity: [0, 0.15, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 2
                }}
                className="absolute inset-y-0 w-1/3 skew-x-[-25deg] pointer-events-none z-0"
                style={{
                  background: isLight 
                    ? `linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)`
                    : `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`
                }}
              />
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
                <div className="p-8 md:p-14">
                  {/* Festival tag */}
                  <div
                    className="inline-flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-5 md:mb-6 px-3 py-1 rounded-full"
                    style={{ background: `${offer.glow}20`, color: accent }}
                  >
                    <Sparkles size={11} /> {offer.festival}
                  </div>

                  <h3
                    className="text-2xl md:text-4xl font-black leading-[1.2] mb-4 max-w-lg"
                    style={{ color: isLight ? "#18181b" : "#ffffff" }}
                  >
                    {offer.title}
                  </h3>
                  <p
                    className="text-[13px] md:text-sm leading-relaxed mb-8 md:mb-10 max-w-md"
                    style={{ color: isLight ? "#52525b" : "rgba(255,255,255,0.55)" }}
                  >
                    {offer.subtitle}
                  </p>

                  {/* Discount + Coupon row */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Big Discount Badge */}
                    <div
                      className="flex items-center gap-3 rounded-2xl px-5 py-3.5 md:px-6 md:py-4"
                      style={{
                        background: `linear-gradient(135deg, ${offer.glow}${isLight ? "22" : "33"}, ${offer.glow}10)`,
                        border: `1px solid ${offer.glow}${isLight ? "40" : "35"}`,
                      }}
                    >
                      <span
                        className="text-3xl md:text-4xl font-black tracking-tight"
                        style={{ color: isLight ? offer.glow : "#ffffff" }}
                      >
                        {offer.discountPercent}% OFF
                      </span>
                    </div>

                    {/* Coupon Code */}
                    <div className="flex items-center gap-2 max-w-full">
                      <div
                        className="flex items-center gap-2 md:gap-3 rounded-xl px-4 py-3 md:px-5 md:py-3.5 flex-1 min-w-0"
                        style={{
                          background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
                          border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`,
                        }}
                      >
                        <Tag size={13} style={{ color: accent }} className="shrink-0" />
                        <span
                          className="font-black tracking-[0.1em] md:tracking-[0.18em] text-[13px] md:text-sm truncate"
                          style={{ color: isLight ? "#18181b" : "#ffffff" }}
                        >
                          {offer.code}
                        </span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={copyCode}
                        className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 md:py-3.5 text-[11px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 shrink-0"
                        style={{
                          background: copied
                            ? `${offer.glow}25`
                            : isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)",
                          color: copied ? offer.glow : (isLight ? "#18181b" : "white"),
                          border: `1px solid ${copied ? offer.glow + "60" : (isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)")}`,
                        }}
                      >
                        {copied ? <Check size={14} /> : <Copy size={13} />}
                        <span className="hidden xs:inline">{copied ? "Copied!" : "Copy"}</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-8 md:mt-10">
                    <Link href="/#products">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl text-[13px] md:text-sm font-black uppercase tracking-widest text-white group transition-all duration-300"
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
                      className="flex items-center justify-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-4 md:mb-6"
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
                            className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-1.5 overflow-hidden"
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
                                className="text-xl md:text-2xl font-black tabular-nums"
                                style={{ color: isLight ? "#18181b" : "#ffffff" }}
                              >
                                {v}
                              </motion.span>
                            </AnimatePresence>
                          </div>
                          <span
                            className="text-[8px] md:text-[9px] font-black uppercase tracking-widest"
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
                {o.discountPercent}% OFF
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
