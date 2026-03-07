"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, ArrowUp } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Subscribed Successfully 🚀");
    setEmail("");
  };

  return (
    <footer
      className="relative pt-12 pb-10 overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))",
        color: "var(--text-secondary)",
      }}
    >
      {/* Top Glow Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse" />

      <div className="max-w-7xl mx-auto px-6">

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Company */}
          <div>
            <h2 className="text-3xl font-bold text-orange-500 tracking-wide">ArtPeak.Shop</h2>
            <p className="mt-6 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Premium laser engraving & CNC cutting services delivering
              precision and perfection for every project.
            </p>
            <div className="mt-6 space-y-4 text-sm">
              {[
                { icon: MapPin, label: "Madhya Pradesh , India" },
                { icon: Phone, label: "+91-8839034632" },
                { icon: Mail, label: "artpeak.shop@gmail.com" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 hover:text-orange-500 transition cursor-pointer">
                  <Icon size={18} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6" style={{ color: "var(--text-primary)" }}>Quick Links</h3>
            <ul className="space-y-4 text-sm">
              {["Home", "Services", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link href={`/#${item.toLowerCase()}`} className="hover:text-orange-500 transition hover:translate-x-1 inline-block duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-6" style={{ color: "var(--text-primary)" }}>Our Services</h3>
            <ul className="space-y-4 text-sm">
              {["Wood Engraving", "Metal Engraving", "Glass Engraving", "Acrylic Cutting", "CNC Laser Cutting"].map((s) => (
                <li key={s} className="hover:text-orange-500 transition hover:translate-x-1 duration-200 cursor-pointer">{s}</li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-6" style={{ color: "var(--text-primary)" }}>Newsletter</h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              Get updates on new services & special offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:border-orange-500 text-sm transition border"
                style={{
                  backgroundColor: "var(--bg-input)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-strong)",
                }}
              />
              <button type="submit" className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg text-white text-sm font-semibold transition duration-200">
                Subscribe
              </button>
            </form>

            {/* Social */}
            <div className="flex gap-4 mt-6">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-full hover:bg-orange-600 hover:text-white transition duration-300"
                  style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-16 pt-6 flex flex-col md:flex-row justify-between items-center text-sm gap-4 border-t"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <p className="text-center md:text-left">
            © {currentYear} ArtPeak.Shop. All rights reserved.
          </p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 hover:text-orange-500 transition duration-200">
            <ArrowUp size={16} />
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}
