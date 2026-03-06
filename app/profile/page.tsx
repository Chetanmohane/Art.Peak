"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Package, Settings, LogOut, Loader2, KeyRound, ArrowLeft, MessageSquare, ShieldCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

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
  const isLight = theme === "light";

  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "security" | "messages">("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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

  const tabClass = (tab: string) => `
    flex items-center gap-3 px-5 py-3 rounded-xl transition-all font-medium text-sm
    ${activeTab === tab 
      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
      : (isLight ? "text-zinc-600 hover:bg-zinc-100" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white")}
  `;

  return (
    <div className={`min-h-screen pt-28 pb-20 ${isLight ? "bg-zinc-50" : "bg-black"}`}>
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-2">
            <div className={`p-6 rounded-3xl mb-6 border ${isLight ? "bg-white border-zinc-200" : "bg-zinc-900 border-white/5"}`}>
              <div className="w-16 h-16 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-2xl font-bold mb-4">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <h2 className={`font-bold text-lg truncate ${isLight ? "text-zinc-900" : "text-white"}`}>
                {session?.user?.name}
              </h2>
              <p className={`text-sm truncate ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
                {session?.user?.email}
              </p>
            </div>

            <nav className="flex flex-col gap-2">
              <button onClick={() => router.push('/')} className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all font-medium text-sm mb-2 ${isLight ? "text-zinc-600 hover:bg-zinc-100" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"}`}>
                <ArrowLeft size={18} /> Back to Home
              </button>
              <button onClick={() => setActiveTab("profile")} className={tabClass("profile")}>
                <User size={18} /> My Profile
              </button>
              <button onClick={() => setActiveTab("orders")} className={tabClass("orders")}>
                <Package size={18} /> Order History
              </button>
              <button onClick={() => setActiveTab("security")} className={tabClass("security")}>
                <Settings size={18} /> Security
              </button>
              <button onClick={() => setActiveTab("messages")} className={tabClass("messages")}>
                <MessageSquare size={18} /> My Messages
              </button>
              {/* Admin Panel link — only for admins */}
              {isAdmin && (
                <button
                  onClick={() => router.push("/admin")}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all font-bold text-sm mt-2 
                    ${isLight 
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100" 
                      : "bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20"}`}
                >
                  <ShieldCheck size={18} /> Admin Panel
                </button>
              )}
              <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all font-medium text-sm mt-4 text-red-500 ${isLight ? "hover:bg-red-50" : "hover:bg-red-500/10"}`}
              >
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className={`min-h-[500px] p-8 rounded-3xl border ${isLight ? "bg-white border-zinc-200" : "bg-zinc-900 border-white/5 shadow-xl"}`}>
              
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className={`text-2xl font-bold mb-6 ${isLight ? "text-zinc-900" : "text-white"}`}>Personal Information</h3>
                  
                  <div className="space-y-6 max-w-xl">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>Full Name</label>
                      <div className={`w-full px-4 py-3 rounded-xl border ${isLight ? "bg-zinc-50 border-zinc-200 text-zinc-900" : "bg-black/50 border-white/10 text-white"}`}>
                        {session?.user?.name}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>Email Address</label>
                      <div className={`w-full px-4 py-3 rounded-xl border ${isLight ? "bg-zinc-50 border-zinc-200 text-zinc-900" : "bg-black/50 border-white/10 text-white"}`}>
                        {session?.user?.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className={`text-2xl font-bold mb-6 ${isLight ? "text-zinc-900" : "text-white"}`}>Order History</h3>
                  
                  {loadingOrders ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16">
                      <Package className={`w-16 h-16 mx-auto mb-4 ${isLight ? "text-zinc-300" : "text-zinc-700"}`} />
                      <p className={`text-lg font-medium ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>No orders found</p>
                      <p className={`text-sm mt-2 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Looks like you haven't made any purchases yet.</p>
                      <button 
                        onClick={() => router.push('/')} 
                        className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        let parsedItems = [];
                        try {
                          parsedItems = JSON.parse(order.items || "[]");
                        } catch(e) {}
                        return (
                        <div key={order.id} className={`p-5 rounded-2xl border flex flex-col gap-4 ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-black/30 border-white/5"}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <p className={`text-xs font-mono mb-1 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>ORDER #{order.id.slice(-8).toUpperCase()}</p>
                              <p className={`font-semibold ${isLight ? "text-zinc-900" : "text-white"}`}>
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                              <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                order.status === 'pending' || order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 
                                order.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                                order.status === 'completed' || order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : 
                                'bg-zinc-500/10 text-zinc-500'
                              }`}>
                                {order.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className={`text-sm ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>Total Amount</p>
                              <p className={`text-xl font-bold text-orange-500`}>₹{order.totalAmount.toLocaleString()}</p>
                            </div>
                          </div>
                          
                          {/* Items Section */}
                          <div className={`mt-2 p-4 rounded-xl ${isLight ? "bg-black/5" : "bg-white/5"}`}>
                            <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>Items Ordered</p>
                            <div className="space-y-3">
                              {parsedItems.map((item: any, idx: number) => (
                                <div key={item.id || idx} className="flex gap-3 items-center">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-200 shrink-0">
                                    <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold truncate ${isLight ? "text-zinc-900" : "text-white"}`}>
                                      {item.product?.name} <span className="text-zinc-500 text-xs font-normal">x{item.qty}</span>
                                    </p>
                                    {(item.customText || item.customImage) && (
                                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                                        {item.customText && (
                                          <p className="text-xs text-orange-500 truncate"><span className="text-zinc-500">Text:</span> "{item.customText}"</p>
                                        )}
                                        {item.customImage && (
                                          <div className="w-full mt-2 flex flex-col gap-1.5">
                                            <p className={`text-[10px] font-semibold uppercase tracking-wider ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>Custom Image:</p>
                                            <div className="flex gap-3 items-center">
                                              <a href={item.customImage} target="_blank" rel="noreferrer" className={`block shrink-0 w-16 h-16 rounded-xl overflow-hidden border transition relative ${isLight ? "border-zinc-300 shadow-sm" : "border-white/20 shadow-md"}`}>
                                                 <img src={item.customImage} alt="Custom" className="w-full h-full object-cover" />
                                              </a>
                                              <div className="flex flex-col gap-1.5 flex-1 max-w-[120px]">
                                                <button type="button" onClick={async () => {
                                                    try {
                                                      if (item.customImage.startsWith('data:')) {
                                                        const res = await fetch(item.customImage);
                                                        const blob = await res.blob();
                                                        const url = window.URL.createObjectURL(blob);
                                                        window.open(url, '_blank');
                                                      } else {
                                                        window.open(item.customImage, '_blank');
                                                      }
                                                    } catch(e) {
                                                      window.open(item.customImage, '_blank');
                                                    }
                                                }} className="text-[10px] w-full bg-blue-500/10 text-blue-500 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-500/20 transition text-center border-none cursor-pointer">
                                                   Open Link
                                                </button>
                                                <button type="button" onClick={async () => {
                                                    try {
                                                      const res = await fetch(item.customImage);
                                                      const blob = await res.blob();
                                                      const url = window.URL.createObjectURL(blob);
                                                      const a = document.createElement("a");
                                                      a.href = url;
                                                      a.download = `artpeak_custom_${item.id || idx}.jpg`;
                                                      a.click();
                                                      window.URL.revokeObjectURL(url);
                                                    } catch(e) {
                                                      window.open(item.customImage, '_blank');
                                                    }
                                                }} className="text-[10px] bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-500/20 transition border-none cursor-pointer">
                                                   Download Img
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )})}
                    </div>
                  )}
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === "messages" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className={`text-2xl font-bold mb-6 ${isLight ? "text-zinc-900" : "text-white"}`}>My Contact Messages</h3>

                  {loadingMessages ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-16">
                      <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${isLight ? "text-zinc-300" : "text-zinc-700"}`} />
                      <p className={`text-lg font-medium ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>No messages yet</p>
                      <p className={`text-sm mt-2 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Messages you send via the contact form will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`p-5 rounded-2xl border ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-black/30 border-white/5"}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-sm font-bold">
                                {msg.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className={`font-semibold text-sm ${isLight ? "text-zinc-900" : "text-white"}`}>{msg.name}</p>
                                <p className={`text-xs ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>{msg.email}</p>
                              </div>
                            </div>
                            <p className={`text-xs font-mono ${isLight ? "text-zinc-400" : "text-zinc-600"}`}>
                              {new Date(msg.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <p className={`text-sm leading-relaxed pl-10 ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className={`text-2xl font-bold mb-6 ${isLight ? "text-zinc-900" : "text-white"}`}>Security Settings</h3>
                  
                  <form onSubmit={handlePasswordChange} className="max-w-xl space-y-5">
                    {passwordMessage.text && (
                      <div className={`p-4 rounded-xl text-sm font-medium ${
                        passwordMessage.type === 'error' 
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                          : 'bg-green-500/10 text-green-500 border border-green-500/20'
                      }`}>
                        {passwordMessage.text}
                      </div>
                    )}

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>Current Password</label>
                      <input 
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all ${
                          isLight ? "bg-zinc-50 border-zinc-200 text-zinc-900" : "bg-black/50 border-white/10 text-white"
                        }`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>New Password</label>
                        <input 
                          type="password"
                          required
                          minLength={6}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all ${
                            isLight ? "bg-zinc-50 border-zinc-200 text-zinc-900" : "bg-black/50 border-white/10 text-white"
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>Confirm New Password</label>
                        <input 
                          type="password"
                          required
                          minLength={6}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all ${
                            isLight ? "bg-zinc-50 border-zinc-200 text-zinc-900" : "bg-black/50 border-white/10 text-white"
                          }`}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="mt-4 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {passwordLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <KeyRound className="w-5 h-5" />}
                      Update Password
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
