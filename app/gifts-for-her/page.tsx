import { prisma } from "../../lib/prisma";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PremiumBackground from "../components/PremiumBackground";
import Products from "../components/products/Products";
import CategoryHeader from "../components/CategoryHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gifts For Her | Personalized Laser Engraved Gifts | ArtPeak",
  description: "Discover the perfect personalized gifts for her at ArtPeak. Custom engraved wooden keepsakes, jewelry, and unique treasures. Premium quality laser engraving in India. Order now!",
  keywords: ["gifts for her", "personalized gifts for her", "customized gifts for women", "laser engraved gifts India", "ArtPeak gifts"],
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

      <div className="relative pb-16">
        <Products initialProducts={products as any} forcedCategory="Gifts For Her" />
      </div>

      <Footer />
    </main>
  );
}
