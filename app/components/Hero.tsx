"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Hero() {
  const [bgImage, setBgImage] = useState("");

  // 🔥 Fetch Random Laser Image from API
  useEffect(() => {
    async function fetchImage() {
      try {
        const res = await fetch(
          "https://source.unsplash.com/1600x900/?laser,engraving,technology"
        );
        setBgImage(res.url);
      } catch (error) {
        console.log(error);
      }
    }

    fetchImage();
  }, []);

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0  from-black/80 via-black/70 to-black/90" />

      {/* 🔥 Animated Laser Line */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "linear",
        }}
        className="absolute top-1/2 w-full  bg-orange-500 opacity-70 blur-sm"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-extrabold text-white leading-tight"
        >
          Precision{" "}
          <span className="text-orange-500 drop-shadow-[0_0_20px_orange]">
            Laser Engraving
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-lg md:text-xl text-gray-300"
        >
          Custom engraving on wood, metal, glass & acrylic.
          High-precision detailing with advanced CNC laser machines.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-10 flex flex-col md:flex-row justify-center gap-6"
        >
          <button className="px-8 py-3 bg-orange-600 hover:bg-orange-700 rounded-full text-white font-semibold transition duration-300 shadow-lg shadow-orange-600/30">
            Get Free Quote
          </button>

          <button className="px-8 py-3 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black rounded-full transition duration-300">
            View Services
          </button>
        </motion.div>
      </div>
    </section>
  );
}
