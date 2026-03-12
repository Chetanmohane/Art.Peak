"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CategoryHeaderProps {
  title: string;
  theme: "her" | "him";
  subtitle: string;
}

export default function CategoryHeader({ title, theme, subtitle }: CategoryHeaderProps) {
  const isHer = theme === "her";
  const gradientFrom = isHer ? "from-rose-500 to-pink-500" : "from-blue-500 to-indigo-500";
  const shadowColor = isHer ? "rgba(244,63,94,0.3)" : "rgba(59,130,246,0.3)";
  const icon = isHer ? "💗" : "💙";

  const btnClasses = isHer 
    ? "hover:border-rose-500/30 hover:bg-rose-500/10" 
    : "hover:border-blue-500/30 hover:bg-blue-500/10";
  
  const iconClasses = isHer ? "text-rose-500" : "text-blue-500";
  
  const badgeClasses = isHer 
    ? "bg-rose-500/10 border-rose-500/20 text-rose-500" 
    : "bg-blue-500/10 border-blue-500/20 text-blue-500";

  return (
    <div className="relative pt-24 pb-4">
      {/* Top Navigation Row */}
      <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-between">
        <Link 
          href="/#products" 
          className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-zinc-300 hover:text-white transition-all duration-300 group shadow-2xl ${btnClasses}`}
        >
          <ArrowLeft size={18} className={`group-hover:-translate-x-1.5 transition-transform duration-300 ${iconClasses}`} />
          <span className="text-sm font-black tracking-widest uppercase">Back to Products</span>
        </Link>
        
        <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${badgeClasses}`}>
          Lifestyle • Personalized • Premium
        </div>
      </div>

      {/* Content Header */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-6">
        <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`inline-block px-5 py-2 rounded-full border text-xs font-black uppercase tracking-[0.3em] mb-6 shadow-inner ${badgeClasses}`}
        >
          {icon} Special Collection
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tighter"
        >
          Gifts For <span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradientFrom}`} style={{ filter: `drop-shadow(0 0 30px ${shadowColor})` }}>{title}</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium"
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );
}
