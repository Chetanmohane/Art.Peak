"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Sparks() {
  const [sparks, setSparks] = useState<any[]>([]);

  useEffect(() => {
    // Generate static initial values on mount to avoid hydration mismatch
    const newSparks = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      width: Math.random() * 2 + 1,
      height: Math.random() * 8 + 6,
      delay: Math.random() * 10,
      duration: Math.random() * 6 + 4
    }));
    setSparks(newSparks);
  }, []);

  if (sparks.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-50 z-0">
      {sparks.map(s => (
        <motion.div
          key={s.id}
          className="absolute bottom-0 bg-gradient-to-t from-orange-400 to-transparent rounded-full"
          style={{
            left: `${s.left}%`,
            width: `${s.width}px`,
            height: `${s.height}px`,
          }}
          animate={{
            y: ['100vh', '-20vh'],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 0.8, 0.2]
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: "easeOut",
            delay: s.delay
          }}
        />
      ))}
    </div>
  );
}

export default function PremiumBackground() {
  return (
    <div 
      className="fixed inset-0 -z-50 pointer-events-none w-full h-full overflow-hidden" 
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Premium Texture Overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay z-20" />
      
      {/* Precision Grid Pattern (Laser Theme) */}
      <div 
        className="absolute inset-0 opacity-[0.15] z-0"
        style={{
          backgroundImage: `
            linear-gradient(var(--border-strong) 1px, transparent 1px),
            linear-gradient(90deg, var(--border-strong) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 0%, #000 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 0%, #000 30%, transparent 100%)'
        }}
      />

      {/* Slow Moving Glow Orbs (Aurora Effect) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: [0, 60, -60, 0], y: [0, -60, 60, 0], scale: [1, 1.1, 0.9, 1] }}
        transition={{ opacity: { duration: 2 }, duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vh] rounded-full bg-orange-600/15 blur-[120px] mix-blend-screen"
      />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: [0, -80, 80, 0], y: [0, 80, -80, 0], scale: [1, 1.05, 0.95, 1] }}
        transition={{ opacity: { duration: 2 }, duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vh] rounded-full bg-red-600/10 blur-[140px] mix-blend-screen"
      />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: [0, 50, -50, 0], y: [0, -50, 50, 0], scale: [1, 1.1, 0.9, 1] }}
        transition={{ opacity: { duration: 2 }, duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[0%] left-[20%] w-[70vw] h-[60vh] rounded-full bg-amber-500/10 blur-[150px] mix-blend-screen"
      />

      {/* Upward Laser Sparks */}
      <Sparks />
    </div>
  );
}
