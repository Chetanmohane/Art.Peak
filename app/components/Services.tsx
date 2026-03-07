"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  Hammer, 
  Cpu, 
  Layers, 
  PenTool, 
  Settings, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from "lucide-react";

interface Service {
  title: string;
  desc: string;
  longDesc: string;
  icon: React.ReactNode;
  image: string;
  tag: string;
  features: string[];
}

const services: Service[] = [
  {
    title: "Wood Engraving",
    desc: "Precision laser etching on soft and hardwood for personalized art.",
    longDesc: "Transform natural wood into a canvas. We specialize in high-detail etching and cutting for photo frames, nameplates, and intricate architectural models with zero burn marks.",
    icon: <Hammer className="w-6 h-6" />,
    tag: "Woodcraft",
    image: "https://images.unsplash.com/photo-1582652509080-4c0e9e37e83d?q=80&w=800&auto=format&fit=crop",
    features: ["Deep Engraving", "Clean Cutting", "3D Texturing"]
  },
  {
    title: "Metal Marking",
    desc: "Industrial-grade fiber laser marking on steel, brass, and aluminum.",
    longDesc: "Permanent, high-contrast marking ideal for industrial serial numbers, QR codes, and premium metallic branding that never fades or peels off.",
    icon: <Cpu className="w-6 h-6" />,
    tag: "Industrial",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
    features: ["Fiber Laser", "NFC/QR Ready", "Rust Resistant"]
  },
  {
    title: "Glass Etching",
    desc: "Elegant frosted finishes on glass and crystal for corporate gifts.",
    longDesc: "Create a lasting impression with sand-blast style laser etching. Perfect for luxury trophies, personalized bottles, and decorative glass partitions.",
    icon: <Sparkles className="w-6 h-6" />,
    tag: "Luxury",
    image: "https://images.unsplash.com/photo-1614203611861-9e2e4ddb1168?q=80&w=800&auto=format&fit=crop",
    features: ["Frosted Finish", "Bottle Marking", "Crystal Clear"]
  },
  {
    title: "Acrylic Cutting",
    desc: "Sharp, clean acrylic cutting with smooth polished edges.",
    longDesc: "High-speed laser cutting for 3D signage, display stands, and architectural prototypes. Multiple colors and thicknesses supported with perfect edge clarity.",
    icon: <Layers className="w-6 h-6" />,
    tag: "Signage",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop",
    features: ["Polished Edges", "LED Ready", "Precision Fit"]
  },
  {
    title: "Brand Engraving",
    desc: "Professional branding on corporate gifts and tech accessories.",
    longDesc: "Build your brand identity with custom engraving on leather diaries, power banks, pens, and corporate merchandise with bulk processing capabilities.",
    icon: <PenTool className="w-6 h-6" />,
    tag: "Branding",
    image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=800&auto=format&fit=crop",
    features: ["Logo Design", "Bulk Orders", "Multi-Material"]
  },
  {
    title: "CNC Fabrication",
    desc: "Heavy-duty CNC laser cutting for large-scale industrial projects.",
    longDesc: "Advanced CNC routing and laser cutting for thick sheets, furniture components, and custom metal fabrication with industrial accuracy.",
    icon: <Settings className="w-6 h-6" />,
    tag: "CNC Works",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
    features: ["Heavy Duty", "Large Scale", "Material Versatility"]
  },
];

export default function Services() {
  return (
    <section
      id="services"
      style={{ background: "linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary))" }}
      className="py-12 relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Zap size={14} /> Our Capabilities
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Premium Engraving <span className="text-orange-500 underline decoration-orange-500/30 underline-offset-8">Solutions</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            We combine high-tech machinery with artistic craftsmanship to deliver 
            unmatched precision for personal and industrial needs.
          </motion.p>
        </div>

        {/* 🔥 Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative flex flex-col h-full rounded-[2.5rem] overflow-hidden border border-white/5 transition-all duration-500 hover:border-orange-500/30 bg-zinc-900/40 backdrop-blur-xl shadow-2xl"
            >
              {/* Image Header */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
                
                {/* Float Badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                  <span className="text-orange-400">{service.icon}</span>
                  <span className="text-[10px] text-white font-black uppercase tracking-wider">{service.tag}</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-black text-white group-hover:text-orange-500 transition-colors mb-4">
                  {service.title}
                </h3>
                <p className="text-sm text-zinc-400 mb-6 flex-1 leading-relaxed">
                  {service.longDesc}
                </p>

                {/* Feature List */}
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={12} className="text-orange-500" />
                      </div>
                      <span className="text-xs font-semibold text-zinc-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/#contact" className="w-full">
                  <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-orange-600 hover:border-orange-600 text-white font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                    Get a Quote <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>

              {/* Decorative Corner Glow */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-600/10 blur-[60px] rounded-full group-hover:bg-orange-600/20 transition-colors" />
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
}
