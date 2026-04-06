"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      parts: [{ text: input }],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages,
        }),
      });

      const data = await response.json();

      if (data.text) {
        setMessages((prev) => [
          ...prev,
          { role: "model", parts: [{ text: data.text }] },
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "model", parts: [{ text: "⚠️ " + data.error }] },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "Can't connect to ArtPeak AI right now. Please try again later." }] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="mb-4 w-[calc(100vw-32px)] sm:w-[400px] h-[75vh] sm:h-[600px] rounded-2xl overflow-hidden flex flex-col shadow-2xl border"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-strong)",
              backdropFilter: "blur(16px)",
            }}
          >
            {/* Header */}
            <div 
              className="p-4 flex items-center justify-between border-b"
              style={{ borderColor: "var(--border)", backgroundColor: "rgba(0,0,0,0.1)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-300 flex items-center justify-center shadow-lg">
                  <Bot size={22} className="text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wide" style={{ color: "var(--text-primary)" }}>ArtPeak Assistant</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-tighter opacity-70" style={{ color: "var(--text-secondary)" }}>Online & Ready</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-3 opacity-60">
                  <Sparkles size={32} className="text-orange-400" />
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Hi! I'm the ArtPeak AI. Ask me about our custom engraving, pricing, or gift ideas!
                  </p>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === "user" 
                        ? "bg-orange-600 text-white rounded-tr-none shadow-md" 
                        : "rounded-tl-none border shadow-sm"
                    }`}
                    style={msg.role === "model" ? { 
                      backgroundColor: "rgba(255,255,255,0.05)", 
                      borderColor: "var(--border)",
                      color: "var(--text-primary)" 
                    } : {}}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.parts[0].text}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div 
                    className="p-3 rounded-2xl rounded-tl-none border flex items-center gap-2"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "var(--border)" }}
                  >
                    <Loader2 size={16} className="animate-spin text-orange-400" />
                    <span className="text-xs italic opacity-70">ArtPeak is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="w-full pl-4 pr-12 py-3 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-orange-500/50 outline-none"
                  style={{ 
                    backgroundColor: "var(--bg-input)", 
                    borderColor: "var(--border-strong)",
                    color: "var(--text-primary)"
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500 disabled:opacity-50 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] mt-2 text-center opacity-40 uppercase tracking-widest font-bold" style={{ color: "var(--text-muted)" }}>
                Powered by ArtPeak Intelligence
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden group"
        style={{
          background: "linear-gradient(135deg, #ea580c 0%, #fbbf24 100%)",
        }}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <X className="text-black" size={28} />
        ) : (
          <MessageCircle className="text-black" size={28} />
        )}
      </motion.button>
    </div>
  );
}
