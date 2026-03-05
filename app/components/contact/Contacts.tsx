"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert("Message Sent Successfully 🚀");
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    }, 1500);
  };

  const inputStyle = {
    backgroundColor: "var(--bg-input)",
    color: "var(--text-primary)",
    borderColor: "var(--border-strong)",
  };

  return (
    <section
      id="contact"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: "linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary), var(--bg-primary))" }}
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/10 blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">

        {/* LEFT — Info */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
            Contact <span className="text-orange-500">LaserCraft</span>
          </h2>

          <p className="mt-6 text-base sm:text-lg" style={{ color: "var(--text-secondary)" }}>
            Ready to start your custom laser engraving project?
            Let&apos;s create something amazing together.
          </p>

          <div className="mt-10 space-y-6" style={{ color: "var(--text-secondary)" }}>
            {[
              { Icon: MapPin,  text: "Huzurganj, India" },
              { Icon: Phone,   text: "+91 9876543210" },
              { Icon: Mail,    text: "info@lasercraft.com" },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-4 hover:text-orange-500 transition cursor-pointer">
                <Icon className="text-orange-500 flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT — Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl border"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="space-y-6">

            {/* Name */}
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Full Name</label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange} required
                placeholder="Enter your name"
                style={inputStyle}
                className="w-full px-4 py-3 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Email Address</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="Enter your email"
                style={inputStyle}
                className="w-full px-4 py-3 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none transition"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Message</label>
              <textarea
                name="message" rows={5} value={form.message} onChange={handleChange} required
                placeholder="Write your message..."
                style={inputStyle}
                className="w-full px-4 py-3 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none transition resize-none"
              />
            </div>

            {/* Button */}
            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 transition rounded-lg text-white font-semibold shadow-lg shadow-orange-600/30"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
