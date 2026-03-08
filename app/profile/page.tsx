"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Package, Settings, LogOut, Loader2, KeyRound, ArrowLeft, MessageSquare, ShieldCheck, Mail, Calendar, CheckCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: string;
  customerName?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const { clearCart } = useCart();
  const isLight = theme === "light";

  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "security" | "messages">("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const tab = p.get('tab');
      if (tab === 'orders' || tab === 'security' || tab === 'messages') {
        setActiveTab(tab as any);
      }
      
      if (p.get('clearCart') === 'true') {
        clearCart();
        const newUrl = window.location.pathname + '?tab=orders';
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [clearCart]);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetch("/api/admin/check", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setIsAdmin(data.isAdmin))
        .catch(() => setIsAdmin(false));
    }
  }, [status, router]);

  useEffect(() => {
    if (activeTab === "orders" && session) {
      fetchOrders();
    }
    if (activeTab === "messages" && session) {
      fetchMessages();
    }
  }, [activeTab, session]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/user/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch("/api/contact");
      if (res.ok) {
        const data = await res.json();
        // Filter messages by logged-in user email
        setMessages(data.filter((m: ContactMessage) => m.email === session?.user?.email));
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        setPasswordMessage({ type: "success", text: "Password updated successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const text = await res.text();
        setPasswordMessage({ type: "error", text: text || "Failed to update password" });
      }
    } catch (error) {
      setPasswordMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  const tabClass = (tab: string) => {
    const isActive = activeTab === tab;
    return `
      relative flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl transition-all duration-300 group whitespace-nowrap flex-shrink-0
      ${isActive 
        ? "bg-orange-500 text-white shadow-xl shadow-orange-500/30 font-bold" 
        : (isLight 
            ? "text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900" 
            : "text-zinc-500 hover:bg-white/5 hover:text-white")}
    `;
  };

  return (
    <div className={`min-h-screen py-24 sm:py-32 ${isLight ? "bg-[#f8fafc]" : "bg-[#050505]"} transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 sm:mb-16">
          <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-xs uppercase tracking-widest mb-6 ${
              isLight ? "text-zinc-400 hover:text-orange-500 bg-white shadow-sm" : "text-zinc-500 hover:text-orange-400 bg-white/5"
            }`}
          >
            <ArrowLeft size={14} /> Back to Web
          </motion.button>
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className={`text-4xl sm:text-5xl font-black tracking-tighter ${isLight ? "text-zinc-900" : "text-white"}`}>
                Account <span className="text-orange-500">Settings</span>
              </h1>
              <p className={`mt-2 text-sm font-medium ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
                Manage your profile, orders and security preferences.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-4 p-2 rounded-2xl border ${
                isLight ? "bg-white border-zinc-200" : "bg-white/5 border-white/10"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-orange-500/20">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="pr-4">
                <p className={`font-black text-sm truncate max-w-[150px] ${isLight ? "text-zinc-900" : "text-white"}`}>
                  {session?.user?.name}
                </p>
                <div className="flex items-center gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                   <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 shrink-0">
            <nav className={`flex flex-row overflow-x-auto lg:flex-col lg:overflow-visible gap-2 p-2 rounded-3xl border bg-opacity-50 backdrop-blur-xl sticky top-24 transition-all duration-300 scrollbar-hide ${
              isLight ? "bg-white border-zinc-200/80 shadow-xl shadow-black/5" : "bg-zinc-950/50 border-white/5 shadow-2xl"
            }`}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-5 pt-4 pb-2">Navigation</p>
              
              <button onClick={() => setActiveTab("profile")} className={tabClass("profile")}>
                <User size={18} className={activeTab === "profile" ? "text-white" : "text-zinc-500"} /> 
                <span className="text-left">My Profile</span>
                {activeTab === "profile" && <motion.div layoutId="tab-indicator" className="absolute bottom-1 lg:bottom-auto lg:left-1 w-12 lg:w-1.5 h-1 lg:h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />}
              </button>
              
              <button onClick={() => setActiveTab("orders")} className={tabClass("orders")}>
                <Package size={18} className={activeTab === "orders" ? "text-white" : "text-zinc-500"} /> 
                <span className="text-left">Order History</span>
                {activeTab === "orders" && <motion.div layoutId="tab-indicator" className="absolute bottom-1 lg:bottom-auto lg:left-1 w-12 lg:w-1.5 h-1 lg:h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />}
              </button>
              
              <button onClick={() => setActiveTab("messages")} className={tabClass("messages")}>
                <MessageSquare size={18} className={activeTab === "messages" ? "text-white" : "text-zinc-500"} /> 
                <span className="text-left">My Messages</span>
                {activeTab === "messages" && <motion.div layoutId="tab-indicator" className="absolute bottom-1 lg:bottom-auto lg:left-1 w-12 lg:w-1.5 h-1 lg:h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />}
              </button>
              
              <button onClick={() => setActiveTab("security")} className={tabClass("security")}>
                <Settings size={18} className={activeTab === "security" ? "text-white" : "text-zinc-500"} /> 
                <span className="text-left">Account Settings</span>
                {activeTab === "security" && <motion.div layoutId="tab-indicator" className="absolute bottom-1 lg:bottom-auto lg:left-1 w-12 lg:w-1.5 h-1 lg:h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />}
              </button>

              <div className="hidden lg:block h-px bg-current opacity-10 mx-4 my-2"></div>
              <div className="lg:hidden w-px bg-current opacity-10 my-2 mx-1 flex-shrink-0"></div>

              {isAdmin && (
                <button
                  onClick={() => router.push("/admin")}
                  className={`flex flex-shrink-0 whitespace-nowrap items-center gap-2 lg:gap-3 px-4 lg:px-5 py-3 lg:py-3.5 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.15em] relative group
                    ${isLight 
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 lg:hover:-translate-y-0.5" 
                      : "bg-indigo-500 text-white hover:bg-indigo-600 shadow-2xl shadow-indigo-500/40"}`}
                >
                  <ShieldCheck size={16} className="lg:group-hover:rotate-12 transition-transform" /> 
                  Admin Console
                  <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              )}

              <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className={`lg:mt-2 flex flex-shrink-0 whitespace-nowrap items-center gap-2 lg:gap-3 px-4 lg:px-5 py-3 lg:py-3.5 rounded-2xl transition-all font-bold text-sm text-red-500 group
                  ${isLight ? "hover:bg-red-50" : "hover:bg-red-500/10"}`}
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                  <LogOut size={16} />
                </div>
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Main Content Viewport */}
          <div className="flex-1 min-w-0">
            <div className={`min-h-[600px] p-6 sm:p-10 rounded-[2.5rem] border backdrop-blur-3xl relative overflow-hidden transition-all duration-500 ${
              isLight ? "bg-white border-zinc-200/80 shadow-xl" : "bg-zinc-950/40 border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
            }`}>
              
              {/* Animated Background Element */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                >
                  {/* Profile Tab */}
                  {activeTab === "profile" && (
                    <div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className={`p-3 rounded-2xl ${isLight ? "bg-orange-50 text-orange-600" : "bg-orange-500/10 text-orange-500"}`}>
                          <User size={24} />
                        </div>
                        <h3 className={`text-2xl sm:text-3xl font-black ${isLight ? "text-zinc-900" : "text-white"}`}>Personal Profile</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ProfileField label="Full Name" value={session?.user?.name || "User"} isLight={isLight} icon={<User size={16}/>} />
                        <ProfileField label="Email Address" value={session?.user?.email || "Email"} isLight={isLight} icon={<Mail size={16}/>} />
                        <ProfileField label="Last Login" value="Recently" isLight={isLight} icon={<Calendar size={16}/>} />
                        <ProfileField label="Account Status" value="Active / Premium" isLight={isLight} icon={<ShieldCheck size={16}/>} />
                      </div>

                      <div className={`mt-12 p-8 rounded-3xl border border-dashed ${isLight ? "border-zinc-200 bg-zinc-50/50" : "border-zinc-800 bg-white/[0.01]"}`}>
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-orange-500/20 flex items-center justify-center text-orange-500">
                               <Settings className="animate-spin-slow" />
                            </div>
                            <div>
                               <p className={`font-bold ${isLight ? "text-zinc-900" : "text-white"}`}>Auto-save enabled</p>
                               <p className="text-[11px] text-zinc-500 font-medium">Your profile changes are synchronized across devices automatically.</p>
                            </div>
                         </div>
                      </div>
                    </div>
                  )}

                  {/* Orders Tab — Redesigned for premium look */}
                  {activeTab === "orders" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-4 mb-8">
                        <div className={`p-3 rounded-2xl ${isLight ? "bg-blue-50 text-blue-600" : "bg-blue-500/10 text-blue-500"}`}>
                          <Package size={24} />
                        </div>
                        <h3 className={`text-2xl sm:text-3xl font-black ${isLight ? "text-zinc-900" : "text-white"}`}>Purchase History</h3>
                      </div>
                      
                      {loadingOrders ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        </div>
                      ) : orders.length === 0 ? (
                        <div className="text-center py-20 px-6 rounded-[2rem] border border-dashed border-zinc-200/50">
                          <Package className={`w-16 h-16 mx-auto mb-4 ${isLight ? "text-zinc-200" : "text-zinc-800"}`} />
                          <p className={`text-lg font-bold ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>No orders found</p>
                          <p className="text-sm mt-1 text-zinc-500">Looks like you haven't made any purchases yet.</p>
                          <button 
                            onClick={() => router.push('/')} 
                            className="mt-8 px-8 py-3 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
                          >
                            Explore Products
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {orders.map((order) => {
                            let parsedItems = [];
                            try {
                              parsedItems = JSON.parse(order.items || "[]");
                            } catch(e) {}
                            return (
                            <div key={order.id} className={`p-6 sm:p-8 rounded-[2rem] border transition-all duration-300 hover:shadow-2xl ${
                              isLight ? "bg-zinc-50/50 border-zinc-100 hover:bg-white" : "bg-black/40 border-white/5 hover:bg-black/60"
                            }`}>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-6 border-b border-zinc-500/10">
                                <div>
                                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isLight ? "text-zinc-400" : "text-zinc-500"}`}>ID: {order.id.slice(-8).toUpperCase()}</p>
                                  <p className={`text-xl font-black ${isLight ? "text-zinc-900" : "text-white"}`}>
                                    {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                  </p>
                                  <div className="flex gap-2 mt-3">
                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                      order.status === 'pending' || order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 
                                      order.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                                      order.status === 'completed' || order.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : 
                                      'bg-zinc-500/10 text-zinc-500'
                                    }`}>
                                      {order.status.replace('_', ' ')}
                                    </span>
                                    {['COMPLETED', 'completed', 'processing', 'shipped', 'delivered'].includes(order.status) && (
                                       <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.1em] rounded-xl shadow-lg shadow-emerald-500/30">
                                         <CheckCircle size={10} className="mr-0.5" /> PAID
                                       </span>
                                    )}
                                  </div>
                                </div>
                                <div className="p-4 rounded-3xl bg-orange-500/5 border border-orange-500/10 text-left sm:text-right">
                                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>Total Pay</p>
                                  <p className="text-2xl font-black text-orange-500 leading-none">₹{order.totalAmount.toLocaleString()}</p>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                {parsedItems.map((item: any, idx: number) => (
                                  <div key={item?.id || idx} className={`flex gap-4 p-4 rounded-2xl ${isLight ? "bg-white shadow-sm" : "bg-zinc-900/50"}`}>
                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-200 shrink-0 border border-white/10 shadow-lg">
                                       {item?.product?.image ? (
                                         <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                       ) : (
                                         <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-[8px] text-zinc-500">No Img</div>
                                       )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                      <div className="flex justify-between items-start gap-2">
                                        <p className={`text-sm font-black truncate ${isLight ? "text-zinc-900" : "text-white"}`}>
                                          {item?.product?.name || 'Product'}
                                        </p>
                                        <p className="text-xs font-black text-orange-500 shrink-0">x{item?.qty || 1}</p>
                                      </div>
                                      {(item?.customText || item?.customImage) && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                          {item.customText && (
                                            <p className="text-[10px] bg-orange-500/5 text-orange-400 px-2 py-1 rounded-md font-bold italic truncate max-w-[150px]">"{item.customText}"</p>
                                          )}
                                          {item.customImage && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md font-bold">Image Attached</span>}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )})}
                        </div>
                      )}
                </div>
              )}

                  {/* Messages Tab — Redesigned for premium look */}
                  {activeTab === "messages" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-4 mb-8">
                        <div className={`p-3 rounded-2xl ${isLight ? "bg-emerald-50 text-emerald-600" : "bg-emerald-500/10 text-emerald-500"}`}>
                          <MessageSquare size={24} />
                        </div>
                        <h3 className={`text-2xl sm:text-3xl font-black ${isLight ? "text-zinc-900" : "text-white"}`}>Support Inquiries</h3>
                      </div>

                      {loadingMessages ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="text-center py-20 px-6 rounded-[2rem] border border-dashed border-zinc-200/50">
                          <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${isLight ? "text-zinc-200" : "text-zinc-800"}`} />
                          <p className={`text-lg font-bold ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>No messages yet</p>
                          <p className="text-sm mt-1 text-zinc-500">Inquiries sent via the contact form will appear here.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {messages.map((msg) => (
                            <div key={msg.id} className={`p-6 sm:p-8 rounded-[2rem] border transition-all duration-300 ${
                              isLight ? "bg-zinc-50/50 border-zinc-100 hover:bg-white" : "bg-black/40 border-white/5 hover:bg-black/60"
                            }`}>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-lg font-black shadow-inner">
                                    {msg.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className={`font-black text-sm uppercase tracking-widest ${isLight ? "text-zinc-900" : "text-white"}`}>{msg.name}</p>
                                    <p className={`text-xs font-bold text-zinc-500`}>{msg.email}</p>
                                  </div>
                                </div>
                                <p className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${isLight ? "bg-white text-zinc-400 shadow-sm" : "bg-white/5 text-zinc-500"}`}>
                                  {new Date(msg.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              <div className={`p-5 rounded-2xl leading-relaxed text-sm font-medium ${isLight ? "bg-white/50 text-zinc-700" : "bg-zinc-950/40 text-zinc-300"}`}>
                                {msg.message}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Account Settings Tab */}
                  {activeTab === "security" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-4 mb-10">
                        <div className={`p-4 rounded-[1.25rem] ${isLight ? "bg-indigo-50 text-indigo-600" : "bg-indigo-500/10 text-indigo-500"}`}>
                          <Settings size={28} />
                        </div>
                        <div>
                          <h3 className={`text-2xl sm:text-3xl font-black ${isLight ? "text-zinc-900" : "text-white"}`}>Account Settings</h3>
                          <p className="text-xs text-zinc-500 font-bold mt-1 uppercase tracking-widest">Manage your security and preferences</p>
                        </div>
                      </div>
                      
                      <div className="max-w-3xl">
                        <form onSubmit={handlePasswordChange} className="space-y-10">
                          <div className={`p-8 rounded-[2.5rem] border ${isLight ? "bg-white border-zinc-100 shadow-sm" : "bg-white/[0.02] border-white/5 shadow-2xl"}`}>
                            <div className="flex items-center gap-3 mb-8">
                               <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                                  <KeyRound size={16} />
                               </div>
                               <h4 className={`text-sm font-black uppercase tracking-widest ${isLight ? "text-zinc-900" : "text-white"}`}>Password & Security</h4>
                            </div>

                            {passwordMessage.text && (
                              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] mb-8 border ${
                                passwordMessage.type === 'error' 
                                  ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              }`}>
                                {passwordMessage.text}
                              </motion.div>
                            )}

                            <div className="space-y-8">
                              <FormInput label="Current Password" type="password" value={currentPassword} onChange={setCurrentPassword} isLight={isLight} icon={<KeyRound size={14}/>} />
                              
                              <div className="h-px bg-zinc-500/10"></div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormInput label="New Password" type="password" value={newPassword} onChange={setNewPassword} isLight={isLight} icon={<KeyRound size={14}/>} />
                                <FormInput label="Confirm New Password" type="password" value={confirmPassword} onChange={setConfirmPassword} isLight={isLight} icon={<KeyRound size={14}/>} />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                             <p className="text-xs text-zinc-500 font-medium max-w-[300px] text-center sm:text-left">
                                Ensure your password is at least 8 characters long and contains unique symbols for better safety.
                             </p>
                             <button
                               type="submit"
                               disabled={passwordLoading}
                               className="w-full sm:w-auto px-12 py-4.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-70 disabled:grayscale uppercase tracking-widest text-xs"
                             >
                               {passwordLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck size={20} />}
                               Update Settings
                             </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value, isLight, icon }: { label: string, value: string, isLight: boolean, icon: React.ReactNode }) {
  return (
    <div className={`p-5 rounded-3xl border transition-all hover:scale-[1.02] ${isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900 border-white/5 shadow-xl"}`}>
       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1.5 mb-2">{icon} {label}</p>
       <p className={`font-black text-lg ${isLight ? "text-zinc-900" : "text-white"}`}>{value}</p>
    </div>
  );
}

function FormInput({ label, type, value, onChange, isLight, icon }: { label: string, type: string, value: string, onChange: (v: string) => void, isLight: boolean, icon: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1.5 ml-1">{icon} {label}</label>
       <div className={`px-4 rounded-xl border transition-all focus-within:border-orange-500 ${isLight ? "bg-zinc-50 border-zinc-200 text-zinc-900" : "bg-black/30 border-white/10 text-white"}`}>
          <input 
            type={type}
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full py-3 bg-transparent outline-none text-sm font-bold"
          />
       </div>
    </div>
  );
}
