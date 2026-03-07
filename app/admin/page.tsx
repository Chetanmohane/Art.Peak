"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Loader2, MessageSquare, Trash2, Mail,
  Calendar, ArrowLeft, ShieldCheck, Search, X, Users, User as UserIcon,
  Package, Edit, Plus, Image as ImageIcon, Tag, IndianRupee, Layers, ShoppingCart, CheckCircle, Upload
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

interface Offer {
  id: string;
  festival: string;
  title: string;
  subtitle: string;
  discountPercent: number;
  code: string;
  validTill: string;
  emoji: string;
  glow: string;
  darkBg: string;
  lightBg: string;
  darkTextAccent: string;
  lightTextAccent: string;
  isActive: boolean;
  minQuantity: number;
  minAmount: number;
  createdAt?: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [activeTab, setActiveTab ] = useState<"messages" | "users" | "products" | "orders" | "offers">("messages");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  
  const [pageStatus, setPageStatus] = useState<"loading" | "forbidden" | "ready">("loading");
  const [search, setSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [deletingId, setDeletingId ] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adminCategoryFilter, setAdminCategoryFilter] = useState("all");
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  // Cropper State
  const [cropModal, setCropModal] = useState<{ show: boolean, img: string, isMain: boolean, index?: number }>({
    show: false, img: "", isMain: true
  });

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

  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerForm, setOfferForm] = useState({
    festival: "", title: "", subtitle: "", discountPercent: 0, 
    code: "", validTill: "", emoji: "🎉", glow: "#f97316", 
    darkBg: "linear-gradient(135deg, #120900 0%, #251500 40%, #120900 100%)", 
    lightBg: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)",
    darkTextAccent: "#fb923c", lightTextAccent: "#c2410c", isActive: true,
    minQuantity: 0, minAmount: 0
  });

  const [toast, setToast] = useState<{ show: boolean, message: string, type: "success" | "error" }>({
    show: false, message: "", type: "success"
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      // If we already know they are admin from session, skip redundant check call
      const skipCheck = (session?.user as any)?.role === "admin";
      initPage(skipCheck);
    }
  }, [status, session]);

  const initPage = async (skipAdminCheck = false) => {
    try {
      if (!skipAdminCheck) {
        const checkRes = await fetch("/api/admin/check", { credentials: "include" });
        const { isAdmin } = await checkRes.json();

        if (!isAdmin) {
          setPageStatus("forbidden");
          return;
        }
      }

      // Priority fetch for current tab
      if (activeTab === "messages") await fetchMessages();
      if (activeTab === "users") await fetchUsers();
      if (activeTab === "products") await fetchProducts();
      if (activeTab === "orders") await fetchOrders();
      if (activeTab === "offers") await fetchOffers();

      setPageStatus("ready");

      // Non-blocking fetch for everything else to fill counts
      Promise.all([
        activeTab !== "messages" && fetchMessages(),
        activeTab !== "users" && fetchUsers(),
        activeTab !== "products" && fetchProducts(),
        activeTab !== "orders" && fetchOrders(),
        activeTab !== "offers" && fetchOffers()
      ].filter(Boolean));
    } catch (e) {
      console.error("Admin page load error:", e);
      setPageStatus("ready");
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
  const fetchOffers = async () => {
    try {
      const offerRes = await fetch("/api/offers", { credentials: "include" });
      if (offerRes.ok) {
        const data = await offerRes.json();
        setOffers(data || []);
        setFilteredOffers(data || []);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (pageStatus === "ready") {
      if (activeTab === "messages" && messages.length === 0) fetchMessages();
      if (activeTab === "users" && users.length === 0) fetchUsers();
      if (activeTab === "products" && products.length === 0) fetchProducts();
      if (activeTab === "orders" && orders.length === 0) fetchOrders();
      if (activeTab === "offers" && offers.length === 0) fetchOffers();
    }
  }, [activeTab, pageStatus]);

  useEffect(() => {
    const q = search.toLowerCase();
    // Only filter active tab to save CPU cycles
    if (activeTab === "messages") {
      setFilteredMessages(
        q ? messages.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.message.toLowerCase().includes(q)) : messages
      );
    } else if (activeTab === "users") {
      setFilteredUsers(
        q ? users.filter(u => (u.name?.toLowerCase() || "").includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)) : users
      );
    } else if (activeTab === "products") {
      let filtered = [...products];
      if (adminCategoryFilter !== "all") {
        filtered = filtered.filter(p => p.category === adminCategoryFilter);
      }
      if (q) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      }
      setFilteredProducts(filtered);
    } else if (activeTab === "orders") {
      let filtered = [...orders];
      if (orderStatusFilter !== "all") {
        filtered = filtered.filter(o => o.status === orderStatusFilter);
      }
      if (q) {
        filtered = filtered.filter(o => o.transactionId?.toLowerCase().includes(q) || o.user.email.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
      }
      setFilteredOrders(filtered);
    } else if (activeTab === "offers") {
      setFilteredOffers(
        q ? offers.filter(o => o.festival.toLowerCase().includes(q) || o.code.toLowerCase().includes(q) || o.title.toLowerCase().includes(q)) : offers
      );
    }
  }, [search, messages, users, products, orders, offers, activeTab, orderStatusFilter, adminCategoryFilter]);

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
      else showToast(await res.text(), "error");
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
  
  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Is order ko delete karna chahte hain?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== id));
        showToast("Order deleted successfully", "success");
      } else {
        showToast(await res.text(), "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Something went wrong while deleting order", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm("Is offer ko delete karna chahte hain?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOffers(prev => prev.filter(o => o.id !== id));
        showToast("Offer deleted successfully", "success");
      } else {
        showToast(await res.text(), "error");
      }
    } finally { setDeletingId(null); }
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

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1000; // Limit resolution for web
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Quality 0.6 is plenty for web and fits within Vercel's limits
          const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
          resolve(dataUrl);
        };
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean, index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropModal({ show: true, img: reader.result as string, isMain, index });
      };
      reader.readAsDataURL(file);
    }
  };

  const finalizeImage = async () => {
    setPageStatus("loading");
    try {
      // In a real app we'd use a library like react-easy-crop, 
      // here we do a high-quality compression + square check
      const img = new window.Image();
      img.src = cropModal.img;
      
      const compressed = await new Promise<string>((resolve) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const size = Math.min(img.width, img.height);
          canvas.width = 1000;
          canvas.height = 1000;
          const ctx = canvas.getContext("2d");
          
          // Draw a center-cropped square
          ctx?.drawImage(
            img, 
            (img.width - size) / 2, (img.height - size) / 2, size, size, // source
            0, 0, 1000, 1000 // destination
          );
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
      });

      if (cropModal.isMain) {
        setProductForm(prev => ({ ...prev, image: compressed }));
      } else if (cropModal.index !== undefined) {
        const newImages = [...productForm.images];
        newImages[cropModal.index] = compressed;
        setProductForm(prev => ({ ...prev, images: newImages }));
      } else {
        setProductForm(prev => ({ ...prev, images: [...prev.images, compressed] }));
      }
      setCropModal({ ...cropModal, show: false });
    } finally {
      setPageStatus("ready");
    }
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
        showToast(`Product ${editingProduct ? "updated" : "created"} successfully!`, "success");
      } else {
        showToast(await res.text(), "error");
      }
    } finally { setPageStatus("ready"); }
  };

  const handleOpenOfferModal = (offer: Offer | null = null) => {
    if (offer) {
      setEditingOffer(offer);
      setOfferForm({
        festival: offer.festival, title: offer.title, subtitle: offer.subtitle,
        discountPercent: offer.discountPercent, code: offer.code, validTill: offer.validTill,
        emoji: offer.emoji, glow: offer.glow, darkBg: offer.darkBg, lightBg: offer.lightBg,
        darkTextAccent: offer.darkTextAccent, lightTextAccent: offer.lightTextAccent, isActive: offer.isActive,
        minQuantity: offer.minQuantity, minAmount: offer.minAmount
      });
    } else {
      setEditingOffer(null);
      setOfferForm({
        festival: "", title: "", subtitle: "", discountPercent: 0, 
        code: "", validTill: "", emoji: "🎉", glow: "#f97316", 
        darkBg: "linear-gradient(135deg, #120900 0%, #251500 40%, #120900 100%)", 
        lightBg: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)",
        darkTextAccent: "#fb923c", lightTextAccent: "#c2410c", isActive: true,
        minQuantity: 0, minAmount: 0
      });
    }
    setShowOfferModal(true);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setPageStatus("loading");
    try {
      const method = editingOffer ? "PUT" : "POST";
      const url = editingOffer ? `/api/offers/${editingOffer.id}` : "/api/offers";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerForm)
      });

      if (res.ok) {
        await fetchOffers();
        setShowOfferModal(false);
        showToast(`Offer ${editingOffer ? "updated" : "created"} successfully! ✨`, "success");
      } else {
        const errorData = await res.json();
        showToast(errorData.error || "Failed to save offer", "error");
      }
    } finally { setPageStatus("ready"); }
  };

  const toggleOfferActive = async (offer: Offer) => {
    setPageStatus("loading");
    try {
      const res = await fetch(`/api/offers/${offer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...offer, isActive: !offer.isActive })
      });
      if (res.ok) {
        await fetchOffers();
        showToast(`Offer ${offer.isActive ? "deactivated" : "activated"}!`, "success");
      } else {
        showToast(await res.text(), "error");
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
          <p className="text-zinc-400 text-sm font-medium tracking-wide">Initializing Premium Console...</p>
        </div>
      </div>
    );
  }

  if (pageStatus === "forbidden") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-black">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl">
          <ShieldCheck className="w-16 h-16 text-red-500 mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          <h1 className="text-2xl font-bold text-white tracking-wide">Access Denied</h1>
          <p className="text-zinc-400 mt-2 text-center max-w-xs">You do not have the required administrative privileges to view this area.</p>
          <button onClick={() => router.push("/")} className="mt-6 px-8 py-3 bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)] text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95">Go Home</button>
        </motion.div>
      </div>
    );
  }

  const renderMessages = () => {
    if (filteredMessages.length === 0) return <EmptyState icon={<MessageSquare />} text="No messages found" isLight={isLight} />;
    return (
      <div className="grid grid-cols-1 gap-4">
        {filteredMessages.map((msg, i) => (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={msg.id} onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)} className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${isLight ? "bg-white border-zinc-200/80 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10" : "bg-white/[0.02] border-white/5 hover:border-orange-500/30 hover:bg-white/[0.04] shadow-xl"}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg shadow-orange-500/20 shrink-0">
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 sm:hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-bold truncate text-sm ${isLight ? "text-zinc-900" : "text-white"}`}>{msg.name}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block ${isLight ? "bg-orange-100 text-orange-700" : "bg-orange-500/10 text-orange-400"}`}>{msg.email}</span>
                </div>
              </div>

              <div className="hidden sm:block flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-bold truncate ${isLight ? "text-zinc-900" : "text-white"}`}>{msg.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isLight ? "bg-orange-100 text-orange-700" : "bg-orange-500/10 text-orange-400"}`}>{msg.email}</span>
                </div>
                <p className={`text-sm truncate ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>{msg.message}</p>
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-3 shrink-0">
                <span className={`text-[10px] flex items-center gap-1.5 font-medium ${isLight ? "text-zinc-400" : "text-zinc-500"}`}><Calendar size={12}/>{formatDate(msg.createdAt)}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }} className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"><Trash2 size={16}/></button>
              </div>
            </div>
            <AnimatePresence>
              {expandedId === msg.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className={`mt-4 pt-4 border-t text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl ${isLight ? "border-zinc-100 bg-zinc-50/50 text-zinc-700" : "border-white/5 bg-black/20 text-zinc-300"}`}>
                    {msg.message}
                    <div className="mt-4"><a href={`mailto:${msg.email}`} className="inline-flex items-center gap-2 text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors">Reply via Email <ArrowLeft className="w-3 h-3 rotate-[135deg]" /></a></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderUsers = () => {
    if (filteredUsers.length === 0) return <EmptyState icon={<Users />} text="No users found" isLight={isLight} />;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user, i) => (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} key={user.id} className={`p-5 rounded-2xl border transition-all duration-300 ${isLight ? "bg-white/70 border-zinc-200/80 hover:shadow-lg" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] shadow-xl"}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${user.role === 'admin' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/20' : 'bg-gradient-to-br from-zinc-700 to-zinc-800 text-zinc-300'}`}>
                {user.role === 'admin' ? <ShieldCheck size={20}/> : <UserIcon size={20}/>}
              </div>
              <button disabled={user.email === session?.user?.email} onClick={() => handleDeleteUser(user.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-20"><Trash2 size={16}/></button>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-bold truncate text-lg ${isLight ? "text-zinc-900" : "text-white"}`}>{user.name || "Unknown User"}</span>
              </div>
              <p className={`text-sm truncate mb-3 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>{user.email}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400' : isLight ? 'bg-zinc-100 text-zinc-600' : 'bg-zinc-800 text-zinc-400'}`}>{user.role}</span>
                <span className={`text-[10px] font-medium ${isLight ? "text-zinc-400" : "text-zinc-500"}`}>{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderProducts = () => {
    const uniqueCategories = ["all", ...Array.from(new Set(products.map(p => p.category)))];
    
    return (
      <div className="space-y-6">
        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
          {uniqueCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setAdminCategoryFilter(cat)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                adminCategoryFilter === cat 
                  ? "bg-orange-500 text-white border-transparent shadow-lg shadow-orange-500/20" 
                  : isLight ? "bg-white border-zinc-200 text-zinc-500 hover:border-orange-200" : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState icon={<Package />} text="No products found in this category" isLight={isLight} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p, i) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={p.id} className={`group rounded-3xl border overflow-hidden transition-all duration-300 ${isLight ? "bg-white/70 border-zinc-200/80 hover:shadow-xl hover:shadow-black/5" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] shadow-xl hover:shadow-black/50"}`}>
                <div className={`relative aspect-square overflow-hidden shadow-inner ${isLight ? "bg-zinc-100" : "bg-black/40"}`}>
                  <Image 
                    src={p.image} 
                    alt={p.name} 
                    fill 
                    className="object-contain transition-transform duration-700 group-hover:scale-110" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw" 
                    priority={i < 4}
                    unoptimized={p.image.startsWith('data:')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60"></div>
                  <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] text-white font-bold tracking-widest uppercase border border-white/10">{p.category}</div>
                  <div className="absolute bottom-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-black shadow-lg shadow-orange-500/30">₹{p.price.toLocaleString()}</div>
                </div>
                <div className="p-5">
                  <h3 className={`font-bold text-lg truncate mb-4 ${isLight ? "text-zinc-900" : "text-white"}`}>{p.name}</h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenProductModal(p)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl font-bold transition-all"><Edit size={16}/> Edit</button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={16}/></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderOrders = () => {
    if (filteredOrders.length === 0) return <EmptyState icon={<ShoppingCart />} text="No orders found" isLight={isLight} />;
    return (
      <div className="space-y-4">
        {filteredOrders.map((order, i) => {
          let parsedItems = [];
          try { parsedItems = JSON.parse(order.items || "[]"); } catch (e) {}
          return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={order.id} className={`p-6 rounded-3xl border transition-all duration-300 ${isLight ? "bg-white/70 border-zinc-200/80 hover:shadow-lg" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] shadow-xl"}`}>
              <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
                <div className="flex gap-4 items-start">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${
                    order.status === 'awaiting_verification' ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-500/20' : 
                    order.status === 'processing' ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-blue-500/20' :
                    order.status === 'delivered' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/20' :
                    order.status === 'failed' ? 'bg-gradient-to-br from-red-400 to-red-600 text-white shadow-red-500/20' :
                    'bg-gradient-to-br from-zinc-400 to-zinc-600 text-white shadow-zinc-500/20'
                  }`}>
                    <ShoppingCart size={24}/>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`text-lg font-black tracking-wide ${isLight ? "text-zinc-900" : "text-white"}`}>#{order.id.slice(-6).toUpperCase()}</span>
                      <span className={`text-[10px] px-3 py-1 rounded-md font-bold uppercase tracking-widest ${
                        order.status === 'awaiting_verification' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                        order.status === 'processing' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                        order.status === 'failed' ? 'bg-red-500/20 text-red-600 dark:text-red-400' :
                        order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                        'bg-zinc-500/20 text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                      {order.status === 'awaiting_verification' && (
                        <button onClick={() => handleUpdateOrderStatus(order.id, 'processing')} className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] uppercase tracking-widest font-bold rounded-md transition shadow-md shadow-emerald-500/20">
                          <CheckCircle size={12}/> Verify
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleDeleteOrder(order.id)} 
                        disabled={deletingId === order.id}
                        className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] uppercase tracking-widest font-bold rounded-md transition border border-red-500/20 disabled:opacity-50"
                      >
                        {deletingId === order.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12}/>} Delete
                      </button>
                    </div>
                    <div className="flex flex-col gap-1 text-sm font-medium">
                      <span className={isLight ? "text-zinc-600" : "text-zinc-400"}>Customer: <span className={isLight ? "text-zinc-900" : "text-zinc-200"}>{order.user.name || order.user.email}</span></span>
                      <span className={isLight ? "text-zinc-600" : "text-zinc-400"}>Method: <span className="uppercase text-orange-500">{order.paymentMethod}</span></span>
                      {order.transactionId && <span className={isLight ? "text-zinc-600" : "text-zinc-400"}>UTR: <span className={`font-mono px-2 py-0.5 rounded-md ${isLight ? "bg-zinc-100 text-zinc-800" : "bg-white/10 text-white"}`}>{order.transactionId}</span></span>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col xl:items-end gap-3 min-w-[200px]">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">₹{order.totalAmount.toLocaleString()}</span>
                  <div className={`w-full xl:w-auto px-4 py-2 rounded-xl border flex items-center justify-between gap-3 ${isLight ? "bg-white border-zinc-200" : "bg-black/40 border-white/10"}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Status</span>
                    <select value={order.status} onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)} className="bg-transparent text-sm font-bold outline-none cursor-pointer">
                       <option value="pending">Pending</option>
                       <option value="awaiting_verification">Awaiting Verify</option>
                       <option value="processing">Processing</option>
                       <option value="shipped">Shipped</option>
                       <option value="delivered">Delivered</option>
                       <option value="failed">Failed / Fake</option>
                    </select>
                  </div>
                  <span className={`text-[11px] font-medium xl:mt-2 ${isLight ? "text-zinc-400" : "text-zinc-500"}`}>{formatDate(order.createdAt)}</span>
                </div>
              </div>

              {/* Order Details Accordion / Sections */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Items */}
                <div className={`p-5 rounded-2xl border ${isLight ? "bg-zinc-50/50 border-zinc-200/80" : "bg-white/[0.01] border-white/5"}`}>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-zinc-500"><Package size={14}/> Items Ordered</h4>
                  <div className="space-y-3">
                    {parsedItems.map((item: any, idx: number) => {
                      if (!item || !item.product) return null; // Defensive check
                      return (
                        <div key={item.id || idx} className={`flex gap-3 p-3 rounded-xl ${isLight ? "bg-white border border-zinc-100 shadow-sm" : "bg-black/20"}`}>
                            <div className="w-14 h-14 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-white/5 relative">
                               <Image 
                                 src={item.product?.image || "/images/placeholder.png"} 
                                 alt="" 
                                 fill 
                                 className="object-cover" 
                                 sizes="56px"
                               />
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className={`font-bold text-sm truncate ${isLight ? "text-zinc-900" : "text-white"}`}>{item.product?.name} <span className="text-orange-500">x{item.qty}</span></p>
                               {(item.customText || item.customImage) && (
                                  <div className="mt-2 text-xs space-y-1">
                                     {item.customText && <p><span className="text-zinc-500">Text:</span> {item.customText}</p>}
                                     {item.customImage && (
                                       <div className="flex gap-2 items-center mt-1">
                                         <a href={item.customImage} target="_blank" rel="noreferrer" className="w-8 h-8 rounded border border-white/20 overflow-hidden block relative shrink-0">
                                           <Image 
                                              src={item.customImage} 
                                              fill 
                                              alt="Custom customization" 
                                              className="object-cover"
                                              sizes="32px"
                                           />
                                         </a>
                                         <a href={item.customImage} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">View Image</a>
                                       </div>
                                     )}
                                  </div>
                               )}
                            </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Shipping */}
                <div className={`p-5 rounded-2xl border ${isLight ? "bg-orange-50/50 border-orange-200/50" : "bg-orange-500/5 border-orange-500/10"}`}>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-orange-500"><Mail size={14}/> Shipping Details</h4>
                  {order.customerName ? (
                    <div className="space-y-4 text-sm font-medium">
                      <div>
                        <p className={isLight ? "text-zinc-500 text-xs uppercase tracking-wider mb-1" : "text-zinc-500 text-xs uppercase tracking-wider mb-1"}>Customer</p>
                        <p className={isLight ? "text-zinc-900" : "text-white"}>{order.customerName}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className={isLight ? "text-zinc-500 text-xs uppercase tracking-wider mb-1" : "text-zinc-500 text-xs uppercase tracking-wider mb-1"}>Phone</p>
                          <p className={isLight ? "text-zinc-900" : "text-white"}>{order.phone}</p>
                        </div>
                        <div>
                          <p className={isLight ? "text-zinc-500 text-xs uppercase tracking-wider mb-1" : "text-zinc-500 text-xs uppercase tracking-wider mb-1"}>Email</p>
                          <p className={`truncate ${isLight ? "text-zinc-900" : "text-white"}`}>{order.email}</p>
                        </div>
                      </div>
                      <div>
                        <p className={isLight ? "text-zinc-500 text-xs uppercase tracking-wider mb-1" : "text-zinc-500 text-xs uppercase tracking-wider mb-1"}>Address</p>
                        <p className={isLight ? "text-zinc-900 leading-relaxed" : "text-white leading-relaxed"}>{order.address}<br/>{order.city}, {order.state} - {order.pincode}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm italic text-zinc-500">Legacy Order - No shipping data saved.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    );
  };

  const renderOffers = () => {
    if (filteredOffers.length === 0) return <EmptyState icon={<Tag />} text="No offers found" isLight={isLight} />;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer, i) => (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={offer.id} className={`p-6 rounded-3xl border transition-all duration-300 ${isLight ? "bg-white/70 border-zinc-200/80 hover:shadow-xl hover:shadow-black/5" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] shadow-xl hover:shadow-black/50"}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl bg-black/10 dark:bg-white/10 p-2 rounded-2xl">{offer.emoji}</span>
                <div>
                  <h3 className={`font-bold text-lg ${isLight ? "text-zinc-900" : "text-white"}`}>{offer.festival}</h3>
                  <p className={`text-sm ${isLight ? "text-orange-600" : "text-orange-400"} font-bold`}>{offer.discountPercent}% OFF</p>
                </div>
              </div>
            <div className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center gap-2 ${offer.isActive ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${offer.isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                {offer.isActive ? "Active" : "Inactive"}
              </div>
            </div>
            <div className="space-y-2 mb-6">
              <p className={`text-sm font-semibold truncate ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>{offer.title}</p>
              <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Code</span>
                <span className="font-mono text-sm font-bold bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded">{offer.code}</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {(offer.minQuantity > 0 || offer.minAmount > 0) && (
                  <div className={`p-2.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${isLight ? "bg-orange-50/50 border-orange-200/50 text-orange-600" : "bg-orange-500/5 border-orange-500/20 text-orange-400"}`}>
                    <div className="flex items-center gap-1.5 mb-1 opacity-80"><ShieldCheck size={10}/> Applied Rules:</div>
                    {offer.minQuantity > 0 && <div className="flex justify-between items-center px-1"><span>Min Items:</span> <span className="bg-orange-500/10 px-1.5 py-0.5 rounded">{offer.minQuantity} Qty</span></div>}
                    {offer.minAmount > 0 && <div className="flex justify-between items-center px-1 mt-0.5"><span>Min Total:</span> <span className="bg-orange-500/10 px-1.5 py-0.5 rounded">₹{offer.minAmount}</span></div>}
                  </div>
                )}
              </div>
              <p className={`text-xs ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>Valid till: {offer.validTill}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => toggleOfferActive(offer)} 
                className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  offer.isActive 
                  ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white" 
                  : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                }`}
              >
                {offer.isActive ? <X size={14}/> : <CheckCircle size={14}/>}
                {offer.isActive ? "Deactivate Offer" : "Activate Offer"}
              </button>
              <div className="flex gap-2">
                <button onClick={() => handleOpenOfferModal(offer)} className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex items-center justify-center gap-2"><Edit size={16}/> Edit</button>
                <button onClick={() => handleDeleteOffer(offer.id)} className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition"><Trash2 size={16}/></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const navItems = [
    { id: "messages", label: "Messages", icon: <MessageSquare size={18} />, count: messages.length, color: "text-orange-500", bg: "bg-orange-500" },
    { id: "users", label: "Users", icon: <Users size={18} />, count: users.length, color: "text-indigo-500", bg: "bg-indigo-500" },
    { id: "products", label: "Products", icon: <Package size={18} />, count: products.length, color: "text-emerald-500", bg: "bg-emerald-500" },
    { id: "orders", label: "Orders", icon: <ShoppingCart size={18} />, count: orders.length, color: "text-amber-500", bg: "bg-amber-500" },
    { id: "offers", label: "Offers", icon: <Tag size={18} />, count: offers.length, color: "text-fuchsia-500", bg: "bg-fuchsia-500" },
  ];

  return (
    <div className={`min-h-screen flex ${isLight ? "bg-[#f8fafc] text-zinc-900" : "bg-[#050505] text-white"}`}>
      
      {/* Desktop Sidebar */}
      <aside className={`max-md:hidden w-72 shrink-0 border-r flex flex-col relative z-20 ${isLight ? "bg-white/60 border-zinc-200/80 backdrop-blur-2xl" : "bg-black/40 border-white/5 backdrop-blur-2xl"}`}>
        <div className="p-8 pb-4">
          <button onClick={() => router.push("/")} className={`mb-8 p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 ${isLight ? "bg-white border-zinc-200 shadow-sm hover:shadow-md text-zinc-600" : "bg-white/5 border-white/10 hover:bg-white/10 text-zinc-400"}`}>
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wide">ADMIN</h1>
              <p className={`text-[10px] uppercase tracking-widest font-bold ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Console</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); setSearch(""); }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                  ? (isLight ? "bg-white shadow-md border border-zinc-100" : "bg-white/10 shadow-lg border border-white/10") 
                  : (isLight ? "hover:bg-black/5" : "hover:bg-white/5")
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? item.color : isLight ? "text-zinc-400 group-hover:text-zinc-600" : "text-zinc-500 group-hover:text-zinc-300"} transition-colors`}>{item.icon}</span>
                  <span className={`font-bold ${isActive ? (isLight ? "text-zinc-900" : "text-white") : (isLight ? "text-zinc-500 group-hover:text-zinc-700" : "text-zinc-400 group-hover:text-zinc-200")}`}>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${isActive ? `${item.bg} text-white shadow-md` : isLight ? "bg-zinc-200 text-zinc-600" : "bg-white/10 text-zinc-400"}`}>
                    {item.count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen relative max-w-full overflow-hidden">
        
        {/* Mobile Header */}
        <div className={`md:hidden sticky top-0 z-40 px-5 py-4 border-b flex flex-col gap-4 ${isLight ? "bg-white/80 border-zinc-200 backdrop-blur-xl" : "bg-black/80 border-white/5 backdrop-blur-xl"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <button onClick={() => router.push("/")} className={`p-2 rounded-lg ${isLight ? "bg-zinc-100/80 text-zinc-600" : "bg-white/10 text-zinc-400"}`}><ArrowLeft size={16}/></button>
               <span className={`font-black tracking-wider ${isLight ? "text-zinc-900" : "text-white"}`}>ADMIN PANEL</span>
            </div>
            {activeTab === "products" && (
              <button onClick={() => handleOpenProductModal()} className="p-2 bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-500/20">
                 <Plus size={18} />
              </button>
            )}
            {activeTab === "offers" && (
              <button onClick={() => handleOpenOfferModal()} className="p-2 bg-fuchsia-500 text-white rounded-lg shadow-lg shadow-fuchsia-500/20">
                 <Plus size={18} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar snap-x">
             {navItems.map(item => (
               <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id as any); setSearch(""); }} 
                className={`snap-center shrink-0 px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all border ${
                  activeTab === item.id 
                    ? `${item.bg} text-white border-transparent shadow-lg shadow-orange-500/20` 
                    : isLight 
                      ? "bg-zinc-100 border-zinc-200 text-zinc-500" 
                      : "bg-white/5 border-white/10 text-zinc-400"
                }`}
               >
                 {item.icon} <span className="text-xs">{item.label}</span>
               </button>
             ))}
          </div>

          <div className={`relative flex items-center rounded-xl border transition-all ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-white/5 border-white/10"}`}>
            <Search className={`absolute left-3 w-3.5 h-3.5 ${search ? "text-orange-500" : "text-zinc-500"}`} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className={`w-full pl-9 pr-9 py-2.5 bg-transparent outline-none text-xs font-medium placeholder:text-zinc-500 ${isLight ? "text-zinc-900" : "text-white"}`} 
            />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 p-1 hover:bg-zinc-500/20 rounded-md transition-colors"><X size={12}/></button>}
          </div>

          {activeTab === "orders" && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {["all", "pending", "awaiting_verification", "processing", "shipped", "delivered", "failed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderStatusFilter(status)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                    orderStatusFilter === status
                      ? "bg-orange-500 text-white border-transparent"
                      : isLight ? "bg-white border-zinc-200 text-zinc-500" : "bg-white/5 border-white/10 text-zinc-400"
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Top Navbar */}
        <header className={`hidden md:flex sticky top-0 z-30 px-10 py-6 items-center justify-between border-b ${isLight ? "bg-white/60 border-zinc-200/80 backdrop-blur-2xl" : "bg-black/40 border-white/5 backdrop-blur-2xl"}`}>
           <h2 className="text-3xl font-black capitalize tracking-tight flex items-center gap-4">
              {activeTab}
              <span className={`text-sm font-bold px-3 py-1 rounded-xl ${isLight ? "bg-zinc-200 text-zinc-600" : "bg-white/10 text-zinc-400"}`}>
                {activeTab === "messages" ? messages.length : activeTab === "users" ? users.length : activeTab === "products" ? products.length : activeTab === "offers" ? offers.length : orders.length} Total
              </span>
           </h2>
           <div className="flex items-center gap-4">
              <div className={`relative flex items-center rounded-2xl border transition-all ${search ? (isLight ? "border-orange-400 shadow-md shadow-orange-500/10" : "border-orange-500/50 shadow-lg shadow-orange-500/20") : (isLight ? "border-zinc-200 bg-white" : "border-white/10 bg-white/5")}`}>
                <Search className={`absolute left-4 w-4 h-4 ${search ? "text-orange-500" : "text-zinc-500"}`} />
                <input type="text" placeholder={`Search ${activeTab}...`} value={search} onChange={(e) => setSearch(e.target.value)} className={`w-64 pl-11 pr-10 py-3 bg-transparent outline-none text-sm font-medium placeholder:text-zinc-500 ${isLight ? "text-zinc-900" : "text-white"}`} />
                {search && <button onClick={() => setSearch("")} className="absolute right-3 p-1 hover:bg-zinc-500/20 rounded-md transition-colors"><X size={14}/></button>}
              </div>

              {activeTab === "products" && (
                <button onClick={() => handleOpenProductModal()} className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95">
                   <Plus size={18} /> Add
                </button>
              )}

              {activeTab === "offers" && (
                <button onClick={() => handleOpenOfferModal()} className="flex items-center gap-2 px-6 py-3 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-2xl font-bold shadow-lg shadow-fuchsia-500/20 transition-all hover:scale-105 active:scale-95">
                   <Plus size={18} /> Add
                </button>
              )}

              {activeTab === "orders" && (
                <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)} className={`px-4 py-3 rounded-2xl outline-none font-bold text-sm cursor-pointer border ${isLight ? "bg-white border-zinc-200" : "bg-[#111] border-white/10 text-white"}`}>
                   <option value="all">All Statuses</option>
                   <option value="pending">Pending</option>
                   <option value="awaiting_verification">Awaiting Verification</option>
                   <option value="processing">Processing</option>
                   <option value="shipped">Shipped</option>
                   <option value="delivered">Delivered</option>
                   <option value="failed">Failed / Fake</option>
                </select>
              )}
           </div>
        </header>

        {/* Content View */}
        <div className="flex-1 p-5 md:p-10 overflow-y-auto custom-scrollbar relative z-10 pb-32 md:pb-10">
           <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}>
                 {activeTab === "messages" && renderMessages()}
                 {activeTab === "users" && renderUsers()}
                 {activeTab === "products" && renderProducts()}
                 {activeTab === "orders" && renderOrders()}
                 {activeTab === "offers" && renderOffers()}
              </motion.div>
           </AnimatePresence>
        </div>
      </main>

      {/* Product Modal overlay unchanged functionally, but styled */}
      <AnimatePresence>
         {showProductModal && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProductModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl p-6 sm:p-8 custom-scrollbar ${isLight ? "bg-white border-zinc-200" : "bg-zinc-950 border-white/10"}`}>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-black ${isLight ? "text-zinc-900" : "text-white"}`}>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                    <button onClick={() => setShowProductModal(false)} className={`p-2 rounded-full transition-colors ${isLight ? "hover:bg-zinc-100" : "hover:bg-white/10"}`}><X size={20}/></button>
                 </div>
                 
                 <form onSubmit={handleSaveProduct} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       <FormGroup label="Product Name" icon={<Tag size={14}/>} isLight={isLight}>
                          <input required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm font-medium" placeholder="e.g. Wooden Frame" />
                       </FormGroup>
                       <FormGroup label="Base Price (₹)" icon={<IndianRupee size={14}/>} isLight={isLight}>
                          <input required type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm font-medium" placeholder="999" />
                       </FormGroup>
                        <FormGroup label="Category" icon={<Package size={14}/>} isLight={isLight}>
                           <div className="flex flex-col gap-2 py-1 w-full">
                              <select 
                                 value={showCustomCategory ? "custom" : productForm.category} 
                                 onChange={e => {
                                    if (e.target.value === "custom") {
                                       setShowCustomCategory(true);
                                    } else {
                                       setShowCustomCategory(false);
                                       setProductForm({...productForm, category: e.target.value});
                                    }
                                 }} 
                                 className={`w-full bg-transparent outline-none py-1 text-sm appearance-none font-bold ${isLight ? "" : "[&>option]:bg-zinc-900"}`}
                              >
                                 <option value="Personalized">Personalized</option>
                                 <option value="Keychain">Keychain</option>
                                 <option value="Home Decor">Home Decor</option>
                                 <option value="Corporate">Corporate</option>
                                 <option value="Gift Set">Gift Set</option>
                                 <option value="Office">Office</option>
                                 <option value="other">Other</option>
                                 <option value="custom">+ New Category...</option>
                              </select>
                              {showCustomCategory && (
                                 <input 
                                    autoFocus
                                    placeholder="Enter category name"
                                    className="w-full bg-orange-500/10 border border-orange-500/30 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-orange-500"
                                    value={productForm.category === "custom" ? "" : productForm.category}
                                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                                 />
                              )}
                           </div>
                        </FormGroup>
                        <div className="space-y-1.5 row-span-2">
                           <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 focus-within:text-orange-500 transition-colors">
                              <ImageIcon size={14}/> Main Image
                           </label>
                           <div 
                              onClick={() => fileInputRef.current?.click()}
                              className={`relative h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                                 productForm.image 
                                    ? "border-emerald-500/50 bg-emerald-500/5" 
                                    : "border-white/10 hover:border-orange-500/50 bg-white/5 hover:bg-orange-500/5"
                              }`}
                           >
                              <input 
                                 type="file" 
                                 ref={fileInputRef} 
                                 className="hidden" 
                                 accept="image/*"
                                 onChange={(e) => handleImageUpload(e, true)}
                              />
                              {productForm.image ? (
                                 <div className="absolute inset-0 p-1">
                                    <Image src={productForm.image} alt="Preview" fill className="object-cover rounded-xl" unoptimized />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                                       <Edit size={20} className="text-white" />
                                    </div>
                                 </div>
                              ) : (
                                 <>
                                    <Upload size={20} className="text-zinc-500 mb-1" />
                                    <p className="text-[10px] font-bold text-zinc-500">UPLOAD PHOTO</p>
                                 </>
                              )}
                           </div>
                        </div>
                     </div>

                    {/* Additional Images Section */}
                     <div className={`p-5 rounded-2xl border ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-black/20 border-white/5"}`}>
                        <div className="flex items-center justify-between mb-4">
                           <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><ImageIcon size={14}/> Additional Images Gallery</label>
                           <button type="button" onClick={() => additionalFileInputRef.current?.click()} className="text-[10px] bg-orange-500/10 text-orange-500 px-3 py-1.5 rounded-lg font-bold hover:bg-orange-500/20 transition flex items-center gap-1.5 border border-orange-500/20">
                              <Plus size={12}/> UPLOAD MORE
                           </button>
                           <input 
                              type="file" 
                              ref={additionalFileInputRef} 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, false)}
                           />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                           {productForm.images.map((url, idx) => (
                              <div key={idx} className="relative group aspect-square rounded-xl border border-white/10 overflow-hidden bg-black/20">
                                 <Image src={url} alt="" fill className="object-cover" unoptimized />
                                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button 
                                       type="button" 
                                       onClick={() => {
                                          const input = document.createElement('input');
                                          input.type = 'file';
                                          input.accept = 'image/*';
                                          input.onchange = (e: any) => handleImageUpload(e, false, idx);
                                          input.click();
                                       }}
                                       className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white transition"
                                    >
                                       <Edit size={14} />
                                    </button>
                                    <button type="button" onClick={() => removeImageField(idx)} className="p-1.5 bg-red-500/20 hover:bg-red-500 rounded-lg text-white transition"><Trash2 size={14}/></button>
                                 </div>
                              </div>
                           ))}
                           {productForm.images.length === 0 && (
                              <div className="col-span-full py-8 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
                                 <p className="text-xs text-zinc-500 italic font-medium">Click "UPLOAD MORE" to add gallery images.</p>
                              </div>
                           )}
                        </div>
                     </div>

                    {/* Bulk Pricing Section */}
                    <div className={`p-5 rounded-2xl border ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-black/20 border-white/5"}`}>
                       <div className="flex items-center justify-between mb-4">
                          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Layers size={14}/> Bulk Pricing Tiers</label>
                          <button type="button" onClick={addBulkTier} className="text-[10px] bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-500/20 transition flex items-center gap-1.5 border border-emerald-500/20"><Plus size={12}/> ADD TIER</button>
                       </div>
                       <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                          {productForm.bulkPricing.map((tier, idx) => (
                             <div key={idx} className="flex gap-2 items-center">
                                <div className={`flex-[2] px-4 rounded-xl border flex items-center gap-2 transition-colors focus-within:border-emerald-500 ${isLight ? "bg-white border-zinc-200" : "bg-black/50 border-white/10"}`}>
                                   <span className="text-[10px] uppercase font-bold text-zinc-500">Qty</span>
                                   <input type="number" value={tier.qty} onChange={e => updateBulkTier(idx, "qty", e.target.value)} className="w-full bg-transparent outline-none py-2.5 text-xs font-bold" />
                                </div>
                                <div className={`flex-[3] px-4 rounded-xl border flex items-center gap-2 transition-colors focus-within:border-emerald-500 ${isLight ? "bg-white border-zinc-200" : "bg-black/50 border-white/10"}`}>
                                   <span className="text-[10px] uppercase font-bold text-zinc-500">Price ₹</span>
                                   <input type="number" value={tier.price} onChange={e => updateBulkTier(idx, "price", e.target.value)} className="w-full bg-transparent outline-none py-2.5 text-xs font-bold text-emerald-500" />
                                </div>
                                <button type="button" onClick={() => removeBulkTier(idx)} className="p-3 text-zinc-500 hover:text-white hover:bg-red-500 rounded-xl transition-colors"><Trash2 size={16}/></button>
                             </div>
                          ))}
                          {productForm.bulkPricing.length === 0 && <p className="text-xs text-zinc-500 text-center py-4 italic font-medium">No bulk pricing tiers defined.</p>}
                       </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black rounded-2xl shadow-xl shadow-orange-500/25 transition-all active:scale-[0.98] uppercase tracking-widest mt-6 text-sm">
                       {editingProduct ? "Update Product" : "Save Product"}
                    </button>
                 </form>
              </motion.div>
           </div>
         )}
      </AnimatePresence>

      {/* Crop Modal */}
      <AnimatePresence>
        {cropModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setCropModal({ ...cropModal, show: false })} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className={`relative w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl ${isLight ? "bg-white" : "bg-zinc-900"} border border-white/10`}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-500/20"><ImageIcon className="text-white w-6 h-6" /></div>
                    <div>
                      <h2 className={`text-2xl font-black ${isLight ? "text-zinc-900" : "text-white"}`}>Crop Image</h2>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1 underline decoration-orange-500/30 underline-offset-4">Auto Square Center Crop</p>
                    </div>
                  </div>
                  <button onClick={() => setCropModal({ ...cropModal, show: false })} className="p-3 hover:bg-zinc-500/10 rounded-2xl transition-all"><X size={20}/></button>
                </div>

                <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-zinc-800 shadow-inner group">
                   <Image src={cropModal.img} alt="Crop Preview" fill className="object-contain" unoptimized />
                   {/* Visual Crop Guide */}
                   <div className="absolute inset-0 border-[3rem] border-black/40 pointer-events-none">
                      <div className="w-full h-full border-2 border-orange-500 border-dashed opacity-50"></div>
                   </div>
                </div>

                <p className="mt-6 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] text-center leading-relaxed">
                  Image will be automatically cropped from the center to a perfect square for consistency.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-10">
                  <button onClick={() => setCropModal({ ...cropModal, show: false })} className="py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-zinc-500/20 hover:bg-zinc-500/5 transition-all active:scale-95">Cancel</button>
                  <button onClick={finalizeImage} className="py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                     <CheckCircle size={14}/> Save Crop
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Offer Modal */}
      <AnimatePresence>
         {showOfferModal && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowOfferModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl p-6 sm:p-8 custom-scrollbar ${isLight ? "bg-white border-zinc-200" : "bg-zinc-950 border-white/10"}`}>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-black ${isLight ? "text-zinc-900" : "text-white"}`}>{editingOffer ? "Edit Offer" : "Add New Offer"}</h2>
                    <button onClick={() => setShowOfferModal(false)} className={`p-2 rounded-full transition-colors ${isLight ? "hover:bg-zinc-100" : "hover:bg-white/10"}`}><X size={20}/></button>
                 </div>
                 
                 <form onSubmit={handleSaveOffer} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       <FormGroup label="Festival / Event" icon={<Tag size={14}/>} isLight={isLight}>
                          <input required value={offerForm.festival} onChange={e => setOfferForm({...offerForm, festival: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm font-medium" placeholder="e.g. Holi Special" />
                       </FormGroup>
                       <FormGroup label="Discount Percent" icon={<Tag size={14}/>} isLight={isLight}>
                          <input required type="number" value={offerForm.discountPercent} onChange={e => setOfferForm({...offerForm, discountPercent: parseFloat(e.target.value)})} className="w-full bg-transparent outline-none py-2 text-sm font-medium" placeholder="25" />
                       </FormGroup>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       <FormGroup label="Promo Code" icon={<Tag size={14}/>} isLight={isLight}>
                          <input required value={offerForm.code} onChange={e => setOfferForm({...offerForm, code: e.target.value.toUpperCase()})} className="w-full bg-transparent outline-none py-2 text-sm font-bold uppercase" placeholder="HOLI25" />
                       </FormGroup>
                       <FormGroup label="Valid Till" icon={<Tag size={14}/>} isLight={isLight}>
                          <input required value={offerForm.validTill} onChange={e => setOfferForm({...offerForm, validTill: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm font-medium" placeholder="15 March 2026" />
                       </FormGroup>
                    </div>

                    <FormGroup label="Title" icon={<Tag size={14}/>} isLight={isLight}>
                       <input required value={offerForm.title} onChange={e => setOfferForm({...offerForm, title: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm font-medium" placeholder="Rang Barse, Gifts Barse" />
                    </FormGroup>
                    
                    <FormGroup label="Subtitle" icon={<Tag size={14}/>} isLight={isLight}>
                       <textarea required rows={2} value={offerForm.subtitle} onChange={e => setOfferForm({...offerForm, subtitle: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm font-medium resize-none" placeholder="Provide a short description..." />
                    </FormGroup>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                       <FormGroup label="Emoji" icon={<Tag size={14}/>} isLight={isLight}>
                          <input required value={offerForm.emoji} onChange={e => setOfferForm({...offerForm, emoji: e.target.value})} className="w-full bg-transparent outline-none py-2 text-sm font-medium text-center" />
                       </FormGroup>
                       <FormGroup label="Glow Color" icon={<Tag size={14}/>} isLight={isLight}>
                          <input required type="color" value={offerForm.glow} onChange={e => setOfferForm({...offerForm, glow: e.target.value})} className="w-full h-9 bg-transparent border-none outline-none cursor-pointer p-0 m-0" />
                       </FormGroup>
                       <FormGroup label="Light Text Accent" icon={<Tag size={14}/>} isLight={isLight}>
                          <input required type="color" value={offerForm.lightTextAccent} onChange={e => setOfferForm({...offerForm, lightTextAccent: e.target.value})} className="w-full h-9 bg-transparent border-none outline-none cursor-pointer p-0 m-0" />
                       </FormGroup>
                       <FormGroup label="Dark Text Accent" icon={<Tag size={14}/>} isLight={isLight}>
                          <input required type="color" value={offerForm.darkTextAccent} onChange={e => setOfferForm({...offerForm, darkTextAccent: e.target.value})} className="w-full h-9 bg-transparent border-none outline-none cursor-pointer p-0 m-0" />
                       </FormGroup>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <FormGroup label="Light Bg (CSS Gradient)" icon={<Tag size={14}/>} isLight={isLight}>
                          <input required value={offerForm.lightBg} onChange={e => setOfferForm({...offerForm, lightBg: e.target.value})} className="w-full bg-transparent outline-none py-2 text-xs font-mono" />
                       </FormGroup>
                       <FormGroup label="Dark Bg (CSS Gradient)" icon={<Tag size={14}/>} isLight={isLight}>
                          <input required value={offerForm.darkBg} onChange={e => setOfferForm({...offerForm, darkBg: e.target.value})} className="w-full bg-transparent outline-none py-2 text-xs font-mono" />
                       </FormGroup>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       <FormGroup label="Min Quantity Requirement" icon={<ShoppingCart size={14}/>} isLight={isLight}>
                          <input type="number" value={offerForm.minQuantity} onChange={e => setOfferForm({...offerForm, minQuantity: parseInt(e.target.value) || 0})} className="w-full bg-transparent outline-none py-2 text-sm font-medium" placeholder="0 (No minimum)" />
                       </FormGroup>
                       <FormGroup label="Min Amount Requirement" icon={<Tag size={14}/>} isLight={isLight}>
                          <input type="number" value={offerForm.minAmount} onChange={e => setOfferForm({...offerForm, minAmount: parseFloat(e.target.value) || 0})} className="w-full bg-transparent outline-none py-2 text-sm font-medium" placeholder="0 (No minimum)" />
                       </FormGroup>
                    </div>

                    <div className="flex items-center gap-3">
                       <input type="checkbox" id="isActiveOffer" checked={offerForm.isActive} onChange={e => setOfferForm({...offerForm, isActive: e.target.checked})} className="w-5 h-5 accent-fuchsia-500 cursor-pointer" />
                       <label htmlFor="isActiveOffer" className={`text-sm font-bold cursor-pointer ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>Active (Show on website)</label>
                    </div>

                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 hover:from-fuchsia-600 hover:to-fuchsia-700 text-white font-black rounded-2xl shadow-xl shadow-fuchsia-500/25 transition-all active:scale-[0.98] uppercase tracking-widest mt-6 text-sm">
                       {editingOffer ? "Update Offer" : "Save Offer"}
                    </button>
                 </form>
              </motion.div>
           </div>
         )}
      </AnimatePresence>

      <ToastNotification toast={toast} isLight={isLight} />
    </div>
  );
}

{/* Premium Toast Notification */}
const ToastNotification = ({ toast, isLight }: { toast: { show: boolean, message: string, type: "success" | "error" }, isLight: boolean }) => (
  <AnimatePresence>
    {toast.show && (
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9, x: "-50%" }}
        animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
        exit={{ opacity: 0, y: 20, scale: 0.9, x: "-50%" }}
        className="fixed bottom-10 left-1/2 z-[200] px-4"
        style={{ perspective: "1000px" }}
      >
        <div className={`
          px-8 py-5 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-3xl border flex items-center gap-5 min-w-[340px] max-w-[90vw]
          ${toast.type === "success" 
            ? (isLight ? "bg-white/95 border-emerald-100 shadow-emerald-500/10" : "bg-zinc-900/90 border-emerald-500/20 shadow-emerald-500/20")
            : (isLight ? "bg-white/95 border-red-100 shadow-red-500/10" : "bg-zinc-900/90 border-red-500/20 shadow-red-500/20")
          }
        `}>
          <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shadow-2xl transition-all hover:rotate-12 hover:scale-110 shrink-0 ${toast.type === "success" ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white" : "bg-gradient-to-br from-red-400 to-red-600 text-white"}`}>
            {toast.type === "success" ? <CheckCircle size={28}/> : <X size={28}/>}
          </div>
          <div className="flex-1">
            <p className={`text-[10px] uppercase font-black tracking-[0.3em] mb-1 opacity-70 ${toast.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
              {toast.type === "success" ? "Action Verified" : "Critical Update"}
            </p>
            <p className={`text-base font-black tracking-tight leading-tight ${isLight ? "text-zinc-900" : "text-white"}`}>{toast.message}</p>
          </div>
          <div className="absolute inset-x-12 bottom-0 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 4, ease: "linear" }}
              className={`h-full ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
            />
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);


function EmptyState({ icon, text, isLight }: { icon: React.ReactNode, text: string, isLight: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed ${isLight ? "border-zinc-300" : "border-zinc-800"}`}>
       <div className="text-zinc-600 mb-4 scale-150 opacity-20">{icon}</div>
       <p className="text-zinc-500 font-medium">{text}</p>
    </div>
  );
}

function FormGroup({ label, icon, children, isLight }: { label: string, icon: React.ReactNode, children: React.ReactNode, isLight: boolean }) {
  return (
    <div className="space-y-1.5">
       <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">{icon} {label}</label>
       <div className={`px-4 rounded-xl border transition-all focus-within:border-orange-500 ${
         isLight 
          ? "bg-zinc-50 border-zinc-200 text-zinc-900" 
          : "bg-black/20 border-white/10 text-white"
       }`}>
          {children}
       </div>
    </div>
  );
}
