"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form Data:", form);
      alert("Message Sent Successfully 🚀");
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    }, 1500);
  };

  return (
    <section
      id="contact"
      className="relative py-20 md:py-28 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/10 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">

        {/* LEFT SIDE INFO */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Contact <span className="text-orange-500">LaserCraft</span>
          </h2>

          <p className="mt-6 text-gray-400 text-base sm:text-lg">
            Ready to start your custom laser engraving project?
            Let’s create something amazing together.
          </p>

          <div className="mt-10 space-y-6 text-gray-300">

            <div className="flex items-center gap-4 hover:text-orange-500 transition">
              <MapPin className="text-orange-500" />
              <span>Huzurganj, India</span>
            </div>

            <div className="flex items-center gap-4 hover:text-orange-500 transition">
              <Phone className="text-orange-500" />
              <span>+91 9876543210</span>
            </div>

            <div className="flex items-center gap-4 hover:text-orange-500 transition">
              <Mail className="text-orange-500" />
              <span>info@lasercraft.com</span>
            </div>

          </div>
        </motion.div>

        {/* RIGHT SIDE FORM */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="backdrop-blur-xl bg-white/5 p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl border border-orange-500/20"
        >
          <div className="space-y-6">

            {/* Name */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-black/60 border border-gray-700 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none text-white transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-black/60 border border-gray-700 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none text-white transition"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
                placeholder="Write your message..."
                className="w-full px-4 py-3 bg-black/60 border border-gray-700 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none text-white transition resize-none"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 transition rounded-lg text-white font-semibold shadow-lg shadow-orange-600/30 flex items-center justify-center"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

          </div>
        </motion.form>

      </div>
    </section>
  );
}
