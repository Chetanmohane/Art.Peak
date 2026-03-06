"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
            Contact <span className="text-orange-500">Art.Peak</span>
          </h2>

          <p className="mt-6 text-base sm:text-lg" style={{ color: "var(--text-secondary)" }}>
            Ready to start your custom laser engraving project?
            Let&apos;s create something amazing together.
          </p>

          <div className="mt-10 space-y-6" style={{ color: "var(--text-secondary)" }}>
            {[
              { Icon: MapPin,  text: "Madhya Pradesh , India" },
              { Icon: Phone,   text: "+91 8839034632" },
              { Icon: Mail,    text: "art.peak@gmail.com" },
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
            <div className="pt-2">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full py-3.5 bg-green-500 text-white font-semibold rounded-lg shadow-lg shadow-green-500/40 flex items-center justify-center gap-2"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    🎉
                  </motion.span>
                  Message Sent Successfully!
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-75 transition-all duration-300 rounded-lg text-white font-semibold shadow-lg shadow-orange-600/30 relative overflow-hidden group border border-orange-500/50 hover:border-orange-400"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      Send Message
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
