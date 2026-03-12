import About from "./components/About";
import Contact from "./components/contact/Contacts";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Offers from "./components/Offers";
import Services from "./components/Services";
import Products from "./components/products/Products";
import PremiumBackground from "./components/PremiumBackground";
import { prisma } from "../lib/prisma";
import { Metadata } from "next";

const SEO_KEYWORDS = [
  "ArtPeak", "ArtPeak.shop", "artpeak shop", "laser engraving India", "laser engraving Indore",
  "custom engraving India", "personalized gifts India", "wooden keychain India", "custom wooden keychain",
  "metal engraving", "acrylic engraving", "glass engraving", "corporate gifts India",
  "personalized corporate gifts", "customized products India", "laser cutting services India",
  "engraved keychains", "name plate engraving", "trophy engraving", "custom logo engraving",
  "Art Peak Shop", "laser engraving MP", "Indore laser engraving", "best laser engraving India"
];

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [products, services] = await Promise.all([
      prisma.product.findMany({ select: { name: true, category: true }, take: 20 }),
      prisma.service.findMany({ select: { title: true }, take: 10 })
    ]);
    
    const productNames = (products as any[]).map(p => p.name).slice(0, 5).join(", ");
    const productCategories = Array.from(new Set((products as any[]).map(p => p.category))).slice(0, 5).join(", ");
    const serviceNames = (services as any[]).map(s => s.title).slice(0, 4).join(", ");

    const dynamicKeywords = [
      ...SEO_KEYWORDS,
      ...(productNames ? productNames.split(", ") : []),
      ...(productCategories ? productCategories.split(", ") : []),
      ...(serviceNames ? serviceNames.split(", ") : []),
    ].filter(Boolean);

    return {
      title: "ArtPeak.Shop | Laser Engraving India | " + (productCategories || "Custom Gifts & Engraved Products"),
      description: "Shop " + (productNames || "laser engraved products") + " at ArtPeak.shop. " + (productCategories ? productCategories + ". " : "") + "Services: " + (serviceNames || "Laser Engraving") + ". India delivery. 500+ projects. Indore, MP. Order now!",
      keywords: [...new Set(dynamicKeywords)].join(", "),
      openGraph: {
        title: "ArtPeak.Shop | Laser Engraving India | Custom Gifts",
        description: "Premium laser engraving. Custom wooden keychains, metal engraving, personalized gifts. artpeak.shop",
      },
    };
  } catch (error) {
    console.error("SSR Metadata Fetch Error:", error);
    return {
      title: "ArtPeak.Shop | Laser Engraving India | Custom Gifts & Engraved Products",
      description: "India's best laser engraving shop. Custom wooden keychains, metal engraving, personalized gifts, corporate branding. Order at artpeak.shop. Indore, MP.",
      keywords: SEO_KEYWORDS.join(", "),
    };
  }
}

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    products.sort((a: any, b: any) => {
      const sa = a.sortOrder ?? 999;
      const sb = b.sortOrder ?? 999;
      return sa - sb;
    });
    return products.map((p: any) => {
      let images = [];
      let bulkPricing = [];
      let sizes = [];
      
      try { images = JSON.parse(p.images || "[]"); } catch (e) { images = [p.image || "/placeholder.png"]; }
      try { bulkPricing = p.bulkPricing ? JSON.parse(p.bulkPricing) : []; } catch (e) { bulkPricing = []; }
      try { sizes = p.sizes ? JSON.parse(p.sizes) : []; } catch (e) { sizes = []; }

      return {
        ...p,
        images,
        bulkPricing,
        sizes,
        minQuantity: p.minQuantity ?? 1
      };
    });
  } catch (e) {
    console.error("SSR Products Fetch Error:", e);
    return [];
  }
}

async function getOffers() {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: "desc" },
      where: { isActive: true }
    });
    return offers;
  } catch (e) {
    console.error("SSR Offers Fetch Error:", e);
    return [];
  }
}

async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" }
    });
    return services.map((s: any) => ({
      ...s,
      features: JSON.parse(s.features || "[]")
    }));
  } catch (e) {
    console.error("SSR Services Fetch Error:", e);
    return [];
  }
}

export default async function Home() { 
  const [products, offers, services] = await Promise.all([
    getProducts(),
    getOffers(),
    getServices()
  ]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Navbar />
      <div className="relative z-10">
        <Hero />
        <Offers initialOffers={offers as any} />
        <Products initialProducts={products as any} />
        <Services initialServices={services as any} />
        <About />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
