import { prisma } from "../../lib/prisma";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PremiumBackground from "../components/PremiumBackground";
import Products from "../components/products/Products";
import CategoryHeader from "../components/CategoryHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gifts For Her 💗 | Personalized Laser Engraved Gifts | ArtPeak.Shop",
  description: "Discover the most thoughtful personalized gifts for her. Custom engraved jewelry, wooden keepsakes, and more at ArtPeak.Shop. India's best laser engraving shop.",
};

async function getCategoryProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { category: "Gifts For Her" },
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

export default async function GiftsForHerPage() {
  const products = await getCategoryProducts();

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <PremiumBackground />
      <Navbar />
      
      <CategoryHeader 
        title="Her" 
        theme="her" 
        subtitle="Make her feel extra special with our handpicked, precision-engraved treasures. From hearts to memories, we laser-etch your love with perfection."
      />

      <div className="relative z-10 pb-16">
        <Products initialProducts={products as any} forcedCategory="Gifts For Her" />
      </div>

      <Footer />
    </main>
  );
}
