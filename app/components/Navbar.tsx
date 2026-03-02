"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "Products", href: "#products" }, // ✅ Added
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [logo, setLogo] = useState("");

  // 🔥 Fetch Logo From API
  useEffect(() => {
    async function fetchLogo() {
      try {
        const res = await fetch(
          "https://api.dicebear.com/7.x/initials/svg?seed=ArtPeak"
        );
        setLogo(res.url);
      } catch (error) {
        console.log(error);
      }
    }
    fetchLogo();
  }, []);

  // 🔥 Scroll Effect + Active Section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = document.querySelectorAll("section");
      sections.forEach((sec) => {
        const top = window.scrollY;
        const offset = sec.offsetTop - 120;
        const height = sec.clientHeight;
        const id = sec.getAttribute("id");

        if (top >= offset && top < offset + height && id) {
          setActive(id.charAt(0).toUpperCase() + id.slice(1));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-3">
          {logo && (
            <img
              src={logo}
              alt="logo"
              className="w-10 h-10 rounded-full bg-white"
            />
          )}
          <h1 className="text-2xl font-bold text-orange-500">
            Art.Peak
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative transition ${
                active === link.name
                  ? "text-orange-500"
                  : "text-white hover:text-orange-400"
              }`}
            >
              {link.name}

              {active === link.name && (
                <motion.span
                  layoutId="underline"
                  className="absolute left-0 -bottom-1 w-full h-[2px] bg-orange-500"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden text-white">
          {open ? (
            <X size={28} onClick={() => setOpen(false)} />
          ) : (
            <Menu size={28} onClick={() => setOpen(true)} />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="md:hidden bg-black/95 backdrop-blur-md px-6 py-6 space-y-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-lg text-white hover:text-orange-500"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
