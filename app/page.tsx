import About from "./components/About";
import Contact from "./components/contact/Contacts";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Offers from "./components/Offers";
import Services from "./components/Services";
import Products from "./components/products/Products";
import { prisma } from "../lib/prisma";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [products, services] = await Promise.all([
      prisma.product.findMany({ select: { name: true, category: true }, take: 20 }),
      prisma.service.findMany({ select: { title: true }, take: 10 })
    ]);
    
    const productNames = (products as any[]).map(p => p.name).join(", ");
    const productCategories = Array.from(new Set((products as any[]).map(p => p.category))).join(", ");
    const serviceNames = (services as any[]).map(s => s.title).join(", ");

    return {
      title: "ArtPeak.Shop | Buy Personalized " + (productCategories || "Products") + " & Professional Services",
      description: "Explore " + (productNames.slice(0, 80) || "premium products") + " and expert services like " + (serviceNames || "Laser Engraving") + ". India's top destination for customization, web development, and digital marketing at ArtPeak.Shop.",
      keywords: "customized gifts, ArtPeak products, " + (productNames ? productNames + ", " : "") + (productCategories ? productCategories + ", " : "") + (serviceNames ? serviceNames + ", " : "") + "digital marketing agency, web development India, laser engraving shop",
    };
  } catch (error) {
    console.error("SSR Metadata Fetch Error:", error);
    return {
      title: "ArtPeak.Shop | Buy Personalized Products & Professional Services",
      description: "Explore premium products and expert services like Laser Engraving. India's top destination for customization, web development, and digital marketing at ArtPeak.Shop.",
      keywords: "customized gifts, ArtPeak products, digital marketing agency, web development India, laser engraving shop",
    };
  }
}

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
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
    <>
      <Navbar />
      <Hero />
      <Offers initialOffers={offers as any} />
      <Products initialProducts={products as any} />
      <Services initialServices={services as any} />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
