"use client";

import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import Link from "next/link";
import PremiumBackground from "./PremiumBackground";

export default function Hero() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section
      id="home"
      className="relative min-h-[85dvh] pt-20 pb-10 flex flex-col items-center justify-center overflow-hidden"
    >
      <PremiumBackground />

      {/* Background is now handled by PremiumBackground entirely */}

      {/* 🔥 Animated Laser Line */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        className="absolute top-1/2 w-full h-[2px] opacity-60 blur-sm"
        style={{ backgroundColor: isLight ? "#ea580c" : "#f97316" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full text-sm font-semibold tracking-widest uppercase border"
          style={{
            backgroundColor: isLight ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.15)",
            borderColor: isLight ? "#f9731650" : "#f9731640",
            color: isLight ? "#c2410c" : "#fb923c",
          }}
        >
          ✦ Premium Laser Engraving
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight"
          style={{ color: isLight ? "#18181b" : "#ffffff" }}
        >
          Precision{" "}
          <span
            className="drop-shadow-[0_0_20px_orange]"
            style={{ color: "#f97316" }}
          >
            Laser Engraving
          </span>
          <div className="text-2xl md:text-3xl mt-2 opacity-90 font-black tracking-[0.2em] uppercase">at ArtPeak.Shop</div>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-lg md:text-xl"
          style={{ color: isLight ? "#52525b" : "#d4d4d8" }}
        >
          India's best shop for customized products! Get premium laser engraving on wood, metal, glass & acrylic.{" "}
          High-precision detailing with advanced machines only at ArtPeak.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
        >
          <Link href="/#contact">
            <button
              className="px-8 py-3.5 rounded-full font-semibold transition duration-300 shadow-lg w-full sm:w-auto"
              style={{
                backgroundColor: "#ea580c",
                color: "#ffffff",
                boxShadow: "0 10px 30px rgba(234,88,12,0.35)",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#c2410c")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#ea580c")}
            >
              Get Free Quote
            </button>
          </Link>

          <Link href="/#services">
            <button
              className="px-8 py-3.5 border-2 rounded-full font-semibold transition duration-300 w-full sm:w-auto"
              style={{
                borderColor: "#f97316",
                color: isLight ? "#c2410c" : "#f97316",
                backgroundColor: "transparent",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "#f97316";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = isLight ? "#c2410c" : "#f97316";
              }}
            >
              View Services
            </button>
          </Link>
        </motion.div>

        {/* Stats row - light mode only */}
        {isLight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-14 flex justify-center gap-10 flex-wrap"
          >
            {[
              { value: "500+", label: "Projects Done" },
              { value: "5+", label: "Years Exp." },
              { value: "100%", label: "Quality" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-black" style={{ color: "#ea580c" }}>{value}</p>
                <p className="text-xs mt-1 font-medium uppercase tracking-wider" style={{ color: "#71717a" }}>{label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
