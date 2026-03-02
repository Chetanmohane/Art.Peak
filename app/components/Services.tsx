"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Service {
  title: string;
  desc: string;
  keyword: string;
  image?: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([
    {
      title: "Wood Engraving",
      desc: "Custom wood cutting & engraving with premium finishing.",
      keyword: "wood,laser,engraving",
    },
    {
      title: "Metal Engraving",
      desc: "High-precision laser marking on stainless steel & aluminum.",
      keyword: "metal,laser,cutting",
    },
    {
      title: "Glass Engraving",
      desc: "Premium glass etching for gifts & branding.",
      keyword: "glass,laser,design",
    },
    {
      title: "Acrylic Cutting",
      desc: "Sharp & clean acrylic cutting with smooth edges.",
      keyword: "acrylic,laser,cutting",
    },
    {
      title: "Custom Logo Engraving",
      desc: "Professional business branding & logo engraving.",
      keyword: "logo,laser,engraving",
    },
    {
      title: "Industrial CNC Cutting",
      desc: "Heavy-duty CNC laser cutting for industrial projects.",
      keyword: "cnc,laser,machine",
    },
  ]);

  // 🔥 Fetch Images from API
  useEffect(() => {
    const fetchImages = async () => {
      const updatedServices = await Promise.all(
        services.map(async (service) => {
          try {
            const res = await fetch(
              `https://source.unsplash.com/600x400/?${service.keyword}`
            );
            return { ...service, image: res.url };
          } catch {
            return service;
          }
        })
      );
      setServices(updatedServices);
    };

    fetchImages();
  }, []);

  return (
    <section
      id="services"
      className="py-24 bg-gradient-to-b from-gray-950 via-black to-gray-950"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-bold text-white"
        >
          Our <span className="text-orange-500">Services</span>
        </motion.h2>

        <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
          We provide high-quality laser engraving & cutting services
          with precision and perfection for all materials.
        </p>

        {/* 🔥 Service Cards */}
        <div className="grid md:grid-cols-3 gap-10 mt-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-orange-500/10 hover:scale-105 transition duration-300"
            >
              {/* Image */}
              {service.image && (
                <div
                  className="h-52 bg-cover bg-center"
                  style={{ backgroundImage: `url(${service.image})` }}
                />
              )}

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-white">
                  {service.title}
                </h3>
                <p className="mt-4 text-gray-400 text-sm">
                  {service.desc}
                </p>

                <button className="mt-6 px-6 py-2 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-full transition">
                  Learn More
                </button>
              </div>

              {/* Glow Effect */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500/20 blur-3xl rounded-full"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
