"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <section
      id="about"
      className="relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-transparent"
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
