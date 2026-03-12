"use client";
import { motion } from "framer-motion";

export default function PremiumBackground() {
  return (
    <div 
      className="fixed inset-0 -z-50 pointer-events-none w-full h-full overflow-hidden" 
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Precision Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.25] z-0"
        style={{
          backgroundImage: `
            linear-gradient(var(--border-strong) 1px, transparent 1px),
            linear-gradient(90deg, var(--border-strong) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Deep moving glow layers */}
      
      {/* Wave 1: Orange/Amber */}
      <motion.div 
        animate={{ 
          x: ["-20%", "20%", "-20%"], 
          y: ["-20%", "20%", "-20%"],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[150vw] h-[150vh] left-[-25%] top-[-25%] rounded-full opacity-60 dark:opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(234,88,12,0.4) 0%, rgba(234,88,12,0) 60%)',
          filter: 'blur(80px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Wave 2: Ruby/Pink */}
      <motion.div 
        animate={{ 
          x: ["20%", "-20%", "20%"], 
          y: ["10%", "-10%", "10%"],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[120vw] h-[120vh] right-[-10%] top-[10%] rounded-full opacity-50 dark:opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(225,29,72,0.4) 0%, rgba(225,29,72,0) 65%)',
          filter: 'blur(100px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Wave 3: Warm Yellow/Gold */}
      <motion.div 
        animate={{ 
          x: ["-10%", "10%", "-10%"], 
          y: ["20%", "-20%", "20%"],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[140vw] h-[100vh] left-[0%] bottom-[-20%] rounded-full opacity-60 dark:opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, rgba(245,158,11,0) 70%)',
          filter: 'blur(90px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Film grain overlay for premium texture */}
      <div 
        className="absolute inset-0 z-10 opacity-40 mix-blend-overlay pointer-events-none" 
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
        }}
      />
    </div>
  );
}
