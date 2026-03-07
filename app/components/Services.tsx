"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface Service {
  title: string;
  desc: string;
  icon: string;
  image: string;
  tag: string;
}

const services: Service[] = [
  {
    title: "Wood Engraving",
    desc: "Custom wood cutting & engraving with premium finishing and precision detailing.",
    icon: "🪵",
    tag: "Wood",
    image: "https://images.unsplash.com/photo-1582652509080-4c0e9e37e83d?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Metal Engraving",
    desc: "High-precision laser marking on stainless steel & aluminum for lasting results.",
    icon: "⚙️",
    tag: "Metal",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Glass Engraving",
    desc: "Premium glass etching for gifts, awards & brand identity with crystal clarity.",
    icon: "🔮",
    tag: "Glass",
    image: "https://images.unsplash.com/photo-1614203611861-9e2e4ddb1168?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Acrylic Cutting",
    desc: "Sharp & clean acrylic cutting with smooth polished edges and vibrant colors.",
    icon: "✂️",
    tag: "Acrylic",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Custom Logo Engraving",
    desc: "Professional business branding & logo engraving on any surface, any material.",
    icon: "🎨",
    tag: "Branding",
    image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Industrial CNC Cutting",
    desc: "Heavy-duty CNC laser cutting for industrial & commercial scale projects.",
    icon: "🏭",
    tag: "CNC",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      style={{ background: "linear-gradient(to bottom, var(--gradient-from), var(--gradient-via), var(--gradient-to))" }}
      className="py-24"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Our <span className="text-orange-500">Services</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          style={{ color: "var(--text-secondary)" }}
          className="mt-6 max-w-2xl mx-auto text-base"
        >
          We provide high-quality laser engraving & cutting services
          with precision and perfection for all materials.
        </motion.p>

        {/* 🔥 Service Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow-xl transition-all duration-500 group border hover:border-orange-500/40"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-500" />

                {/* Tag badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-orange-400 font-bold uppercase tracking-widest">
                  {service.tag}
                </div>

                {/* Icon */}
                <div className="absolute bottom-3 right-3 text-3xl">
                  {service.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 text-left">
                <h3 className="text-xl font-bold group-hover:text-orange-400 transition duration-300" style={{ color: "var(--text-primary)" }}>
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {service.desc}
                </p>
                <Link href="/#contact">
                  <button className="mt-5 px-5 py-2 text-sm bg-orange-600 hover:bg-orange-500 text-white rounded-full transition-colors duration-300 font-semibold">
                    Learn More
                  </button>
                </Link>
              </div>

              {/* Glow Effect */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
