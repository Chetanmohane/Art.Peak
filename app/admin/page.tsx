"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Loader2, MessageSquare, Trash2, Mail,
  Calendar, ArrowLeft, ShieldCheck, Search, X, Users, User as UserIcon,
  Package, Edit, Plus, Image as ImageIcon, Tag, IndianRupee, Layers, ShoppingCart, CheckCircle
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface BulkTier {
  qty: number;
  price: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  images: string[];
  bulkPricing: BulkTier[];
  createdAt: string;
}

interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  items: string;
  paymentMethod: string;
  transactionId: string | null;
  status: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
  customerName?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [activeTab, setActiveTab ] = useState<"messages" | "users" | "products" | "orders">("messages");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  
  const [pageStatus, setPageStatus] = useState<"loading" | "forbidden" | "ready">("loading");
  const [search, setSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [deletingId, setDeletingId ] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "Wood",
    image: "",
    images: [] as string[],
    bulkPricing: [] as BulkTier[]
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      initPage();
    }
  }, [status]);

  const initPage = async () => {
    try {
      const checkRes = await fetch("/api/admin/check", { credentials: "include" });
      const { isAdmin } = await checkRes.json();

      if (!isAdmin) {
        setPageStatus("forbidden");
        return;
      }

      await Promise.all([fetchMessages(), fetchUsers(), fetchProducts(), fetchOrders()]);
      setPageStatus("ready");
    } catch (e) {
      console.error("Admin page load error:", e);
      setPageStatus("forbidden");
    }
  };

  const fetchMessages = async () => {
    try {
      const msgRes = await fetch("/api/admin/contacts", { credentials: "include" });
      if (msgRes.ok) {
        const data = await msgRes.json();
        setMessages(data || []);
        setFilteredMessages(data || []);
      }
    } catch (e) { console.error(e); }
  };

  const fetchUsers = async () => {
    try {
      const userRes = await fetch("/api/admin/users", { credentials: "include" });
      if (userRes.ok) {
        const data = await userRes.json();
        setUsers(data || []);
        setFilteredUsers(data || []);
      }
    } catch (e) { console.error(e); }
  };

  const fetchProducts = async () => {
    try {
      const prodRes = await fetch("/api/admin/products", { credentials: "include" });
      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(data || []);
        setFilteredProducts(data || []);
      }
    } catch (e) { console.error(e); }
  };
  const fetchOrders = async () => {
    try {
      const orderRes = await fetch("/api/admin/orders", { credentials: "include" });
      if (orderRes.ok) {
        const data = await orderRes.json();
        setOrders(data || []);
        setFilteredOrders(data || []);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const q = search.toLowerCase();
    if (activeTab === "messages") {
      setFilteredMessages(
        q ? messages.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.message.toLowerCase().includes(q)) : messages
      );
    } else if (activeTab === "users") {
      setFilteredUsers(
        q ? users.filter(u => (u.name?.toLowerCase() || "").includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)) : users
      );
    } else if (activeTab === "products") {
      setFilteredProducts(
        q ? products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) : products
      );
    } else {
      let filtered = [...orders];
      if (orderStatusFilter !== "all") {
        filtered = filtered.filter(o => o.status === orderStatusFilter);
      }
      if (q) {
        filtered = filtered.filter(o => o.transactionId?.toLowerCase().includes(q) || o.user.email.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
      }
      setFilteredOrders(filtered);
    }
  }, [search, messages, users, products, orders, activeTab, orderStatusFilter]);

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Is message ko delete karna chahte hain?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/contacts?id=${id}`, { method: "DELETE" });
      if (res.ok) setMessages(prev => prev.filter(m => m.id !== id));
    } finally { setDeletingId(null); }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Is user ko delete karna chahte hain?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (res.ok) setUsers(prev => prev.filter(u => u.id !== id));
      else alert(await res.text());
    } finally { setDeletingId(null); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Is product ko delete karna chahte hain?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) setProducts(prev => prev.filter(p => p.id !== id));
    } finally { setDeletingId(null); }
  };
  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) await fetchOrders();
    } catch (e) { console.error(e); }
  };

  const handleOpenProductModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        image: product.image,
        images: product.images || [],
        bulkPricing: product.bulkPricing || []
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: "", price: "", category: "Wood",
        image: "", images: [], bulkPricing: []
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setPageStatus("loading");
    try {
      const method = editingProduct ? "PUT" : "POST";
      const body = {
        ...productForm,
        id: editingProduct?.id,
        price: parseFloat(productForm.price)
      };

      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        await fetchProducts();
        setShowProductModal(false);
      } else {
        alert(await res.text());
      }
    } finally { setPageStatus("ready"); }
  };

  const addBulkTier = () => {
    setProductForm({
      ...productForm,
      bulkPricing: [...productForm.bulkPricing, { qty: 0, price: 0 }]
    });
  };

  const removeBulkTier = (index: number) => {
    const newPricing = [...productForm.bulkPricing];
    newPricing.splice(index, 1);
    setProductForm({ ...productForm, bulkPricing: newPricing });
  };

  const updateBulkTier = (index: number, field: "qty" | "price", value: string) => {
    const newPricing = [...productForm.bulkPricing];
    newPricing[index] = { ...newPricing[index], [field]: parseFloat(value) || 0 };
    setProductForm({ ...productForm, bulkPricing: newPricing });
  };

  const addImageField = () => {
    setProductForm({ ...productForm, images: [...productForm.images, ""] });
  };

  const removeImageField = (index: number) => {
    const newImages = [...productForm.images];
    newImages.splice(index, 1);
    setProductForm({ ...productForm, images: newImages });
  };

  const updateImageField = (index: number, value: string) => {
    const newImages = [...productForm.images];
    newImages[index] = value;
    setProductForm({ ...productForm, images: newImages });
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  if (status === "loading" || pageStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          <p className="text-zinc-400 text-sm">Processing admin console...</p>
        </div>
      </div>
    );
  }

  if (pageStatus === "forbidden") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-black">
        <ShieldCheck className="w-16 h-16 text-zinc-700" />
        <h1 className="text-2xl font-bold text-white">Access Denied</h1>
        <p className="text-zinc-400">Yeh page sirf admins ke liye hai.</p>
        <button onClick={() => router.push("/")} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition">Go Home</button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-20 ${isLight ? "bg-zinc-50" : "bg-black"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/profile")}
              className={`p-2 rounded-xl transition ${isLight ? "hover:bg-zinc-200 text-zinc-600" : "hover:bg-zinc-800 text-zinc-400"}`}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
                <span className={`text-xs font-bold uppercase tracking-widest ${isLight ? "text-zinc-400" : "text-zinc-500"}`}>
                  Admin Panel
                </span>
              </div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${isLight ? "text-zinc-900" : "text-white"}`}>
                Management Console
              </h1>
            </div>
          </div>

          <div className={`px-5 py-3 rounded-2xl border text-center ${isLight ? "bg-white border-zinc-200" : "bg-zinc-900 border-white/10"}`}>
            <p className="text-2xl font-bold text-orange-500">
               {activeTab === "messages" ? messages.length : activeTab === "users" ? users.length : products.length}
            </p>
            <p className={`text-xs mt-0.5 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
              Total {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
           <button 
             onClick={() => { setActiveTab("messages"); setSearch(""); }}
             className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all shadow-md ${activeTab === "messages" ? "bg-orange-500 text-white" : isLight ? "bg-white text-zinc-500 hover:bg-zinc-100 shadow-sm" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 shadow-sm"}`}
           >
             <MessageSquare size={16} /> Messages
           </button>
           <button 
             onClick={() => { setActiveTab("users"); setSearch(""); }}
             className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all shadow-md ${activeTab === "users" ? "bg-indigo-600 text-white" : isLight ? "bg-white text-zinc-500 hover:bg-zinc-100 shadow-sm" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 shadow-sm"}`}
           >
             <Users size={16} /> Users
           </button>
            <button 
              onClick={() => { setActiveTab("products"); setSearch(""); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all shadow-md ${activeTab === "products" ? "bg-emerald-600 text-white" : isLight ? "bg-white text-zinc-500 hover:bg-zinc-100 shadow-sm" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 shadow-sm"}`}
            >
              <Package size={16} /> Products
            </button>
            <button 
              onClick={() => { setActiveTab("orders"); setSearch(""); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all shadow-md ${activeTab === "orders" ? "bg-amber-600 text-white" : isLight ? "bg-white text-zinc-500 hover:bg-zinc-100 shadow-sm" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 shadow-sm"}`}
            >
              <ShoppingCart size={16} /> Orders
            </button>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className={`relative flex-1 rounded-2xl border ${isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900 border-white/5"}`}>
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-zinc-400" : "text-zinc-500"}`} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-11 pr-10 py-3.5 text-sm bg-transparent focus:outline-none rounded-2xl ${isLight ? "text-zinc-900 placeholder:text-zinc-400" : "text-white placeholder:text-zinc-700"}`}
            />
            {search && <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-zinc-500" /></button>}
          </div>
          {activeTab === "products" && (
            <button 
              onClick={() => handleOpenProductModal()}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/10"
            >
              <Plus size={18} /> Add Product
            </button>
          )}

          {activeTab === "orders" && (
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className={`px-4 py-3.5 text-sm font-bold border outline-none rounded-2xl transition-all cursor-pointer ${isLight ? "bg-white border-zinc-200 text-zinc-900 shadow-sm" : "bg-zinc-900 border-white/5 text-white"}`}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="awaiting_verification">Awaiting Verification</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed / Fake Payment</option>
            </select>
          )}
        </div>

        {/* Content Views */}
        <div className="space-y-4">
          {activeTab === "messages" && (
             filteredMessages.length === 0 ? <EmptyState icon={<MessageSquare />} text="No messages found" isLight={isLight} /> :
             filteredMessages.map(msg => (
                <div key={msg.id} onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)} className={`p-5 rounded-2xl border cursor-pointer transition-all ${isLight ? "bg-white border-zinc-200 hover:border-orange-200 shadow-sm" : "bg-zinc-900 border-white/5 hover:border-orange-500/20"}`}>
                   <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold"> {msg.name.charAt(0).toUpperCase()} </div>
                      <div className="flex-1">
                         <div className="flex items-center gap-2"><span className={`font-bold ${isLight ? "text-zinc-900" : "text-white"}`}>{msg.name}</span><span className="text-[10px] text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full font-bold uppercase">{msg.email}</span></div>
                         <p className={`text-sm truncate mt-0.5 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>{msg.message}</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Calendar size={12}/>{formatDate(msg.createdAt)}</span>
                         <button onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"><Trash2 size={16}/></button>
                      </div>
                   </div>
                   {expandedId === msg.id && (
                     <div className="mt-4 pt-4 border-t border-white/5 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap bg-black/20 p-4 rounded-xl">
                        {msg.message}
                        <div className="mt-3"><a href={`mailto:${msg.email}`} className="text-xs text-orange-500 hover:underline">Reply via Email →</a></div>
                     </div>
                   )}
                </div>
             ))
          )}

          {activeTab === "users" && (
            filteredUsers.length === 0 ? <EmptyState icon={<Users />} text="No users found" isLight={isLight} /> :
            filteredUsers.map(user => (
               <div key={user.id} className={`p-5 rounded-2xl border transition-all ${isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900 border-white/5"}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${user.role === 'admin' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-zinc-800 text-zinc-500'}`}> {user.role === 'admin' ? <ShieldCheck size={20}/> : <UserIcon size={20}/>} </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-2"><span className={`font-bold ${isLight ? "text-zinc-900" : "text-white"}`}>{user.name || "N/A"}</span><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${user.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-zinc-600 text-zinc-300'}`}>{user.role}</span></div>
                        <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] text-zinc-500">Joined {formatDate(user.createdAt)}</span>
                        <button disabled={user.email === session?.user?.email} onClick={() => handleDeleteUser(user.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition disabled:opacity-20"><Trash2 size={16}/></button>
                     </div>
                  </div>
               </div>
            ))
          )}

          {activeTab === "products" && (
            filteredProducts.length === 0 ? <EmptyState icon={<Package />} text="No products found" isLight={isLight} /> :
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               {filteredProducts.map(p => (
                  <div key={p.id} className={`rounded-2xl border overflow-hidden ${isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900 border-white/5"}`}>
                     <div className="relative h-40">
                        <Image src={p.image} alt={p.name} fill className="object-cover" unoptimized />
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-orange-400 font-bold uppercase">{p.category}</div>
                     </div>
                     <div className="p-4">
                        <h3 className={`font-bold truncate ${isLight ? "text-zinc-900" : "text-white"}`}>{p.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                           <span className="text-lg font-black text-orange-500">₹{p.price}</span>
                           <div className="flex items-center gap-1">
                              <button onClick={() => handleOpenProductModal(p)} className="p-2 text-zinc-400 hover:bg-emerald-500/10 hover:text-emerald-500 rounded-lg transition"><Edit size={16}/></button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition"><Trash2 size={16}/></button>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
          )}

          {activeTab === "orders" && (
            filteredOrders.length === 0 ? <EmptyState icon={<ShoppingCart />} text="No orders found" isLight={isLight} /> :
            <div className="space-y-4">
               {filteredOrders.map(order => {
                  let parsedItems = [];
                  try {
                    parsedItems = JSON.parse(order.items || "[]");
                  } catch (e) {}
                  return (
                  <div key={order.id} className={`p-5 rounded-2xl border transition-all ${isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900 border-white/5"}`}>
                     <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${order.status === 'awaiting_verification' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                           <ShoppingCart size={24}/>
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-1">
                              <span className={`font-bold ${isLight ? "text-zinc-900" : "text-white"}`}>Order #{order.id.slice(-6).toUpperCase()}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                order.status === 'awaiting_verification' ? 'bg-amber-500 text-black' :
                                order.status === 'processing' ? 'bg-blue-600 text-white' :
                                order.status === 'failed' ? 'bg-red-600 text-white' :
                                'bg-emerald-600 text-white'
                              }`}>
                                {order.status.replace('_', ' ')}
                              </span>
                           </div>
                           <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                              <span>Customer: {order.user.name || order.user.email}</span>
                              <span>Method: <span className="uppercase font-bold text-orange-500">{order.paymentMethod}</span></span>
                              {order.transactionId && <span className="text-zinc-400">UTR: <span className="font-mono text-white bg-white/5 px-1.5 py-0.5 rounded">{order.transactionId}</span></span>}
                           </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <span className="text-lg font-black text-orange-500">₹{order.totalAmount.toLocaleString()}</span>
                           <div className="flex items-center gap-2">
                              {order.status === 'awaiting_verification' && (
                                <button 
                                  onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg transition"
                                >
                                  <CheckCircle size={14}/> Verify Payment
                                </button>
                              )}
                              <select 
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className="bg-black/20 border border-white/10 text-[10px] px-2 py-1.5 rounded-lg outline-none focus:border-orange-500 transition"
                              >
                                 <option value="pending">Pending</option>
                                 <option value="awaiting_verification">Awaiting Verify</option>
                                 <option value="processing">Processing</option>
                                 <option value="shipped">Shipped</option>
                                 <option value="delivered">Delivered</option>
                                 <option value="failed">Failed / Fake Payment</option>
                              </select>
                           </div>
                        </div>
                     </div>

                     {/* Customization Details Section */}
                     <div className={`mt-4 pt-4 border-t ${isLight ? "border-zinc-200" : "border-white/5"}`}>
                        <p className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>Order Items & Customizations</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           {parsedItems.map((item: any, idx: number) => (
                              <div key={item.id || idx} className={`flex gap-3 p-3 rounded-xl border ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-black/20 border-white/5"}`}>
                                 <div className="w-12 h-12 rounded-lg bg-zinc-800 overflow-hidden shrink-0">
                                    <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                                 </div>
                                 <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <p className={`text-sm font-bold truncate ${isLight ? "text-zinc-900" : "text-white"}`}>{item.product?.name} <span className="text-zinc-500 font-normal">x{item.qty}</span></p>
                                    
                                    {(item.customText || item.customImage) && (
                                       <div className="mt-1.5 space-y-1">
                                          {item.customText && (
                                             <div className="text-xs bg-orange-500/10 text-orange-500 px-2 py-1 rounded inline-block max-w-[200px] truncate">
                                                <span className="font-semibold text-orange-600">Text:</span> {item.customText}
                                             </div>
                                          )}
                                          {item.customImage && (
                                             <div className="mt-2 text-left flex flex-col gap-1.5">
                                                <p className={`text-[10px] font-semibold uppercase tracking-wider ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>Custom Image:</p>
                                                <div className="flex gap-3 items-center">
                                                   <a href={item.customImage} target="_blank" rel="noreferrer" className={`block shrink-0 w-16 h-16 rounded-xl overflow-hidden border transition relative ${isLight ? "border-zinc-300 shadow-sm" : "border-white/20 shadow-md"}`}>
                                                      <img src={item.customImage} alt="Custom" className="w-full h-full object-cover" />
                                                   </a>
                                                   <div className="flex flex-col gap-1.5">
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
                                                      }} className="w-full text-[10px] bg-blue-500/10 text-blue-500 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-500/20 transition text-center border-none cursor-pointer">
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

                     {/* Shipping Details Block */}
                     <div className={`mt-4 p-4 rounded-xl border ${isLight ? "bg-orange-50 border-orange-200" : "bg-orange-500/5 border-orange-500/10"}`}>
                         <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-3">Shipping Details</h4>
                         {order.customerName ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                     <p className={`text-xs mb-0.5 ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>Customer Name</p>
                                     <p className={`text-sm font-semibold ${isLight ? "text-zinc-900" : "text-white"}`}>{order.customerName}</p>
                                 </div>
                                 <div>
                                     <p className={`text-xs mb-0.5 ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>Contact</p>
                                     <p className={`text-sm font-semibold ${isLight ? "text-zinc-900" : "text-white"}`}>{order.phone}</p>
                                     {order.email && <p className={`text-xs ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>{order.email}</p>}
                                 </div>
                                 <div className="md:col-span-2">
                                     <p className={`text-xs mb-0.5 ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>Delivery Address</p>
                                     <p className={`text-sm font-semibold ${isLight ? "text-zinc-900" : "text-white"}`}>{order.address}</p>
                                     <p className={`text-xs mt-0.5 ${isLight ? "text-zinc-700" : "text-zinc-400"}`}>{order.city}, {order.state} - {order.pincode}</p>
                                 </div>
                             </div>
                         ) : (
                             <p className={`text-sm italic ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>No shipping details provided (Legacy Order)</p>
                         )}
                     </div>
                  </div>
               )})}
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
         {showProductModal && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProductModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl p-6 sm:p-8 ${isLight ? "bg-white border-zinc-200" : "bg-zinc-950 border-white/10"}`}>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-bold ${isLight ? "text-zinc-900" : "text-white"}`}>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                    <button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={20}/></button>
                 </div>
                 
                 <form onSubmit={handleSaveProduct} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       <FormGroup label="Product Name" icon={<Tag size={14}/>}>
                          <input required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm" placeholder="e.g. Wooden Frame" />
                       </FormGroup>
                       <FormGroup label="Base Price (₹)" icon={<IndianRupee size={14}/>}>
                          <input required type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm" placeholder="999" />
                       </FormGroup>
                       <FormGroup label="Category" icon={<Package size={14}/>}>
                          <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm appearance-none">
                             <option value="Wood">Wood</option>
                             <option value="Metal">Metal</option>
                             <option value="Glass">Glass</option>
                             <option value="Acrylic">Acrylic</option>
                          </select>
                       </FormGroup>
                       <FormGroup label="Main Image URL" icon={<ImageIcon size={14}/>}>
                          <input required value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm" placeholder="https://..." />
                       </FormGroup>
                    </div>

                    {/* Additional Images Section */}
                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5"><ImageIcon size={14}/> Additional Images</label>
                          <button type="button" onClick={addImageField} className="text-[10px] bg-orange-500/10 text-orange-500 px-2 py-1 rounded-md font-bold hover:bg-orange-500/20 transition flex items-center gap-1"><Plus size={10}/> Add URL</button>
                       </div>
                       <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                          {productForm.images.map((url, idx) => (
                             <div key={idx} className="flex gap-2">
                                <div className="flex-1 px-3 rounded-xl border bg-black/20 border-white/5 flex items-center">
                                   <input value={url} onChange={e => updateImageField(idx, e.target.value)} className="w-full bg-transparent outline-none py-2 text-xs" placeholder="https://..." />
                                </div>
                                <button type="button" onClick={() => removeImageField(idx)} className="p-2 text-zinc-500 hover:text-red-500 transition"><Trash2 size={14}/></button>
                             </div>
                          ))}
                          {productForm.images.length === 0 && <p className="text-[10px] text-zinc-600 text-center py-2">No additional images added.</p>}
                       </div>
                    </div>

                    {/* Bulk Pricing Section */}
                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5"><Layers size={14}/> Bulk Pricing Tiers</label>
                          <button type="button" onClick={addBulkTier} className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md font-bold hover:bg-emerald-500/20 transition flex items-center gap-1"><Plus size={10}/> Add Tier</button>
                       </div>
                       <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                          {productForm.bulkPricing.map((tier, idx) => (
                             <div key={idx} className="flex gap-2 items-center">
                                <div className="flex-[2] px-3 rounded-xl border bg-black/20 border-white/5 flex items-center gap-2">
                                   <span className="text-[10px] text-zinc-600">Qty:</span>
                                   <input type="number" value={tier.qty} onChange={e => updateBulkTier(idx, "qty", e.target.value)} className="w-full bg-transparent outline-none py-2 text-xs" />
                                </div>
                                <div className="flex-[3] px-3 rounded-xl border bg-black/20 border-white/5 flex items-center gap-2">
                                   <span className="text-[10px] text-zinc-600">Price: ₹</span>
                                   <input type="number" value={tier.price} onChange={e => updateBulkTier(idx, "price", e.target.value)} className="w-full bg-transparent outline-none py-2 text-xs" />
                                </div>
                                <button type="button" onClick={() => removeBulkTier(idx)} className="p-2 text-zinc-500 hover:text-red-500 transition"><Trash2 size={14}/></button>
                             </div>
                          ))}
                          {productForm.bulkPricing.length === 0 && <p className="text-[10px] text-zinc-600 text-center py-2">No bulk pricing tiers defined.</p>}
                       </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl shadow-xl shadow-orange-900/10 transition active:scale-95 uppercase tracking-widest mt-4">
                       {editingProduct ? "Update Product" : "Save Product"}
                    </button>
                 </form>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ icon, text, isLight }: { icon: React.ReactNode, text: string, isLight: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed ${isLight ? "border-zinc-300" : "border-zinc-800"}`}>
       <div className="text-zinc-600 mb-4 scale-150 opacity-20">{icon}</div>
       <p className="text-zinc-500 font-medium">{text}</p>
    </div>
  );
}

function FormGroup({ label, icon, children }: { label: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
       <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">{icon} {label}</label>
       <div className={`px-4 rounded-xl border bg-black/20 focus-within:border-orange-500 transition-colors border-white/5`}>
          {children}
       </div>
    </div>
  );
}
