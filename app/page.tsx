import About from "./components/About";
import Contact from "./components/contact/Contacts";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Offers from "./components/Offers";
import Services from "./components/Services";
import Products from "./components/products/Products";
import { prisma } from "../lib/prisma";

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return products.map((p: any) => ({
      ...p,
      images: JSON.parse(p.images || "[]"),
      bulkPricing: p.bulkPricing ? JSON.parse(p.bulkPricing) : []
    }));
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

export default async function Home() { 
  const [products, offers] = await Promise.all([
    getProducts(),
    getOffers()
  ]);

  return (
    <>
      <Navbar />
      <Hero />
      <Offers initialOffers={offers as any} />
      <Products initialProducts={products as any} />
      <Services />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
