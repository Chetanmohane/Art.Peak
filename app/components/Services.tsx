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
  Sparkles,
  Package,
  Star,
  Heart
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

interface Service {
  id?: string;
  title: string;
  desc: string;
  longDesc: string;
  icon?: React.ReactNode;
  iconName?: string;
  image: string;
  tag: string;
  features: string[];
}

interface DBService {
  id: string;
  title: string;
  desc: string;
  longDesc: string;
  image: string;
  tag: string;
  iconName: string;
  features: string[];
}

interface ServicesProps {
  initialServices?: DBService[];
}

const getIcon = (name: string) => {
  switch (name) {
    case "Hammer": return <Hammer className="w-6 h-6" />;
    case "Cpu": return <Cpu className="w-6 h-6" />;
    case "Layers": return <Layers className="w-6 h-6" />;
    case "PenTool": return <PenTool className="w-6 h-6" />;
    case "Settings": return <Settings className="w-6 h-6" />;
    case "Zap": return <Zap className="w-6 h-6" />;
    case "Sparkles": return <Sparkles className="w-6 h-6" />;
    case "Package": return <Package className="w-6 h-6" />;
    case "Star": return <Star className="w-6 h-6" />;
    case "Heart": return <Heart className="w-6 h-6" />;
    default: return <Sparkles className="w-6 h-6" />;
  }
};

const services: Service[] = [
  {
    title: "Laser Engraving",
    desc: "Precision engraving on multiple materials with high-tech machinery.",
    longDesc: "Expert laser etching on wood, metal, glass, and acrylic. Perfect for personalized awards, gifts, and industrial marking.",
    icon: <Hammer className="w-6 h-6" />,
    tag: "Premium",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800",
    features: ["Custom Designs", "Multi-Material", "Precision Accuracy"]
  },
  {
    title: "Web Developer",
    desc: "Modern and professional website development using latest technologies.",
    longDesc: "Full-stack web development specializing in Next.js, React, and Node.js. We build lightning-fast, SEO-optimized, and scalable web apps.",
    icon: <Cpu className="w-6 h-6" />,
    tag: "Digital",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800",
    features: ["Next.js/React", "Custom CMS", "Responsive Design"]
  },
  {
    title: "Digital Marketing",
    desc: "Strategic marketing campaigns to grow your brand and reach new customers.",
    longDesc: "Comprehensive digital strategies including SEO, PPC, and social media management to maximize your online footprint and ROI.",
    icon: <Zap className="w-6 h-6" />,
    tag: "Growth",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
    features: ["SEO Strategies", "Social Ads", "Email Marketing"]
  },
  {
    title: "Graphic Designer",
    desc: "Stunning visual designs that speak your brand's unique story.",
    longDesc: "High-quality creative services for branding, logos, print media, and digital assets that capture attention and leave an impression.",
    icon: <PenTool className="w-6 h-6" />,
    tag: "Creative",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800",
    features: ["Logo Design", "Branding", "Illustrations"]
  },
  {
    title: "UI/UX Design",
    desc: "User-centric design focused on intuitive and beautiful user journeys.",
    longDesc: "Crafting seamless user experiences and professional interfaces to ensure your product is as functional as it is aesthetic.",
    icon: <Layers className="w-6 h-6" />,
    tag: "Modern",
    image: "https://images.unsplash.com/photo-1541462608141-ad4d157ee9f8?q=80&w=800",
    features: ["Figma Experts", "User Testing", "Prototyping"]
  },
  {
    title: "App Development",
    desc: "High-performance mobile applications for iOS and Android.",
    longDesc: "Building native and cross-platform mobile apps that provide a smooth user experience and high functionality on all devices.",
    icon: <Sparkles className="w-6 h-6" />,
    tag: "Mobile",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800",
    features: ["iOS & Android", "Native Performance", "Push Notifications"]
  }
];

export default function Services({ initialServices }: ServicesProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [data, setData] = useState<any[]>(initialServices && initialServices.length > 0 ? initialServices : services);

  useEffect(() => {
    // Only fetch if no initial services provided
    if (!initialServices || initialServices.length === 0) {
      fetch("/api/services")
        .then(res => res.json())
        .then(resData => {
           if (resData && resData.length > 0) {
              setData(resData);
           }
        })
        .catch(err => console.error("Error fetching services:", err));
    }
  }, [initialServices]);

  const displayServices = data;
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
          {displayServices.map((service, index) => (
            <motion.div
              key={service.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group relative flex flex-col h-full rounded-[2.5rem] overflow-hidden border transition-all duration-500 hover:border-orange-500/30 backdrop-blur-xl shadow-2xl ${
                isLight ? "bg-white border-zinc-200" : "bg-zinc-900/40 border-white/5"
              }`}
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
                  <span className="text-orange-400">{service.icon || getIcon(service.iconName)}</span>
                  <span className="text-[10px] text-white font-black uppercase tracking-wider">{service.tag}</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-8 flex-1 flex flex-col">
                <h3 className={`text-2xl font-black transition-colors mb-4 ${
                  isLight ? "text-zinc-900 group-hover:text-orange-600" : "text-white group-hover:text-orange-500"
                }`}>
                  {service.title}
                </h3>
                <p className={`text-sm mb-6 flex-1 leading-relaxed ${
                  isLight ? "text-zinc-600" : "text-zinc-400"
                }`}>
                  {service.longDesc}
                </p>

                {/* Feature List */}
                <div className="space-y-3 mb-8">
                  {service.features.map((feature: string, fidx: number) => (
                    <div key={fidx} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={12} className="text-orange-500" />
                      </div>
                      <span className={`text-xs font-semibold ${
                        isLight ? "text-zinc-700" : "text-zinc-300"
                      }`}>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/#contact" className="w-full">
                  <button className={`w-full py-4 rounded-2xl border font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
                    isLight 
                    ? "bg-zinc-100 border-zinc-200 text-zinc-900 hover:bg-orange-600 hover:text-white hover:border-orange-600" 
                    : "bg-white/5 border-white/10 text-white hover:bg-orange-600 hover:border-orange-600"
                  }`}>
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
