"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Subscribed Successfully 🚀");
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-b from-black to-gray-950 text-gray-300 pt-20 pb-10 overflow-hidden">
      
      {/* Top Glow Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-6">

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Company */}
          <div>
            <h2 className="text-3xl font-bold text-orange-500 tracking-wide">
              LaserCraft
            </h2>

            <p className="mt-6 text-gray-400 text-sm leading-relaxed">
              Premium laser engraving & CNC cutting services delivering
              precision and perfection for every project.
            </p>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center gap-3 hover:text-orange-500 transition">
                <MapPin size={18} />
                <span>Huzurganj, India</span>
              </div>
              <div className="flex items-center gap-3 hover:text-orange-500 transition">
                <Phone size={18} />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center gap-3 hover:text-orange-500 transition">
                <Mail size={18} />
                <span>info@lasercraft.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4 text-sm">
              {["Home", "Services", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="hover:text-orange-500 transition hover:translate-x-1 inline-block duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Our Services
            </h3>
            <ul className="space-y-4 text-sm">
              {[
                "Wood Engraving",
                "Metal Engraving",
                "Glass Engraving",
                "Acrylic Cutting",
                "CNC Laser Cutting",
              ].map((service) => (
                <li
                  key={service}
                  className="hover:text-orange-500 transition hover:translate-x-1 duration-200 cursor-pointer"
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Newsletter
            </h3>

            <p className="text-sm text-gray-400 mb-4">
              Get updates on new services & special offers.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-900/70 backdrop-blur border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 text-sm transition"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg text-white text-sm font-semibold transition duration-200"
              >
                Subscribe
              </button>
            </form>

            {/* Social */}
            <div className="flex gap-4 mt-6">
              {[Facebook, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="p-2 bg-gray-800 rounded-full hover:bg-orange-600 transition duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">

          <p className="text-center md:text-left">
            © {currentYear} LaserCraft. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-orange-500 transition duration-200"
          >
            <ArrowUp size={16} />
            Back to Top
          </button>

        </div>

      </div>
    </footer>
  );
}
