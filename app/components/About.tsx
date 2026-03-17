"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <section
      id="about"
      className="relative py-12 sm:py-16 lg:py-20 overflow-hidden"
      style={{ background: "linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary), var(--bg-primary))" }}
    >
      {/* 🔥 Background Glow Effect */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-orange-600/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* ================= IMAGE SECTION ================= */}
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden border border-orange-500/20 shadow-2xl shadow-orange-500/10 group">

            <Image
              src="/images/about-new.png"
              alt="Laser Engraving Machine"
              width={1200}
              height={800}
              className="w-full h-auto object-cover transition duration-700 group-hover:scale-105"
              priority
            />

            {/* Overlay Effect */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition duration-500"></div>
          </div>

          {/* Bottom Glow */}
          <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-orange-500/20 blur-3xl rounded-full"></div>
        </motion.div>

        {/* ================= CONTENT SECTION ================= */}
        <motion.div
          initial={{ opacity: 0, x: 70 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
            About <span className="text-orange-500">Art.Peak</span>
          </h2>

          <p className="mt-6 text-base sm:text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            ArtPeak.Shop is your premium destination for high-precision laser engraving and CNC cutting
            services in India. We specialize in creating high-end customized products on wood, metal, glass, 
            and acrylic for both personal gifts and industrial company branding.
          </p>

          <p className="mt-4 text-sm sm:text-base" style={{ color: "var(--text-muted)" }}>
            Our mission is to transform ideas into reality with precision,
            creativity, and modern engineering excellence.
          </p>

          <p className="mt-6 text-[15px] sm:text-[17px] font-medium" style={{ color: "var(--text-primary)" }}>
            Founded and owned by <span className="text-orange-500 font-bold">Chetan Mohane</span>.
          </p>

          <div className="mt-4">
            <a 
              href="https://www.instagram.com/artpeak.shop/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-orange-500 hover:text-orange-400 font-semibold transition"
            >
              <span>Follow our work on Instagram @artpeak.shop</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>

          {/* ================= STATS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">

            <div className="text-center bg-white/5 backdrop-blur-md p-6 rounded-xl border border-orange-500/10 hover:border-orange-500/30 transition">
              <h3 className="text-3xl font-bold text-orange-500">500+</h3>
              <p className="text-gray-400 text-sm mt-2">Projects Completed</p>
            </div>

            <div className="text-center bg-white/5 backdrop-blur-md p-6 rounded-xl border border-orange-500/10 hover:border-orange-500/30 transition">
              <h3 className="text-3xl font-bold text-orange-500">5+</h3>
              <p className="text-gray-400 text-sm mt-2">Years Experience</p>
            </div>

            <div className="text-center bg-white/5 backdrop-blur-md p-6 rounded-xl border border-orange-500/10 hover:border-orange-500/30 transition">
              <h3 className="text-3xl font-bold text-orange-500">100%</h3>
              <p className="text-gray-400 text-sm mt-2">Quality Commitment</p>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
