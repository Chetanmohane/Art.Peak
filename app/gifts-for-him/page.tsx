import { prisma } from "../../lib/prisma";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PremiumBackground from "../components/PremiumBackground";
import Products from "../components/products/Products";
import CategoryHeader from "../components/CategoryHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gifts For Him 💙 | Custom Laser Engraved Gear | ArtPeak.Shop",
  description: "Sophisticated and rugged personalized gifts for him. Metal wallets, wooden notebooks, and precision gear at ArtPeak.Shop. Premium laser engraving India.",
};

async function getCategoryProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { category: "Gifts For Him" },
      orderBy: { createdAt: "desc" },
    });
    return products.map((p: any) => ({
      ...p,
      images: JSON.parse(p.images || "[]"),
      bulkPricing: p.bulkPricing ? JSON.parse(p.bulkPricing) : [],
      sizes: p.sizes ? JSON.parse(p.sizes) : [],
      minQuantity: p.minQuantity ?? 1,
    }));
  } catch (e) {
    console.error("Fetch Category Products Error:", e);
    return [];
  }
}

export default async function GiftsForHimPage() {
  const products = await getCategoryProducts();

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <PremiumBackground />
      <Navbar />
      
      <CategoryHeader 
        title="Him" 
        theme="him" 
        subtitle="Rugged, refined, and completely custom. Discover high-precision laser-engraved gear tailored for his unique style and journey."
      />

      <div className="relative pb-16">
        <Products initialProducts={products as any} forcedCategory="Gifts For Him" />
      </div>

      <Footer />
    </main>
  );
}
