import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

// These images are now in /public/images/products/ and served from the site
// K = Keychain, E = Engraved items, C = Corporate/Card, S = Stationery/Pen, W = Wood/Decor, L = Lamp, CB = Combo/Bottle
const BASE = '/images/products';

const allProducts = [
  // ── KEYCHAINS ──
  {
    name: "Customised Name Keychain",
    price: 99,
    category: "Keychain",
    image: `${BASE}/K1.webp`,
    images: JSON.stringify([`${BASE}/K1.webp`, `${BASE}/K2.webp`]),
    bulkPricing: JSON.stringify([{ qty: 10, price: 79 }, { qty: 50, price: 59 }]),
    minQuantity: 1, weight: 50, length: 5, breadth: 5, height: 1, inStock: true
  },
  {
    name: "Customised Photo Keychain",
    price: 249,
    category: "Keychain",
    image: `${BASE}/K3.webp`,
    images: JSON.stringify([`${BASE}/K3.webp`, `${BASE}/K4.webp`]),
    bulkPricing: JSON.stringify([{ qty: 10, price: 199 }, { qty: 25, price: 149 }]),
    minQuantity: 1, weight: 50, length: 5, breadth: 5, height: 1, inStock: true
  },
  {
    name: "Sublimation Keychain",
    price: 149,
    category: "Keychain",
    image: `${BASE}/K5.webp`,
    images: JSON.stringify([`${BASE}/K5.webp`, `${BASE}/K1.webp`]),
    bulkPricing: JSON.stringify([{ qty: 10, price: 119 }, { qty: 50, price: 89 }]),
    minQuantity: 1, weight: 50, length: 5, breadth: 5, height: 1, inStock: true
  },
  {
    name: "Eyes Engraved Keychain",
    price: 199,
    category: "Keychain",
    image: `${BASE}/K2.webp`,
    images: JSON.stringify([`${BASE}/K2.webp`, `${BASE}/K3.webp`]),
    bulkPricing: JSON.stringify([{ qty: 10, price: 159 }, { qty: 50, price: 129 }]),
    minQuantity: 1, weight: 50, length: 5, breadth: 5, height: 1, inStock: true
  },
  {
    name: "Photo Engraved Keychain",
    price: 199,
    category: "Keychain",
    image: `${BASE}/K4.webp`,
    images: JSON.stringify([`${BASE}/K4.webp`, `${BASE}/K5.webp`]),
    bulkPricing: JSON.stringify([{ qty: 10, price: 159 }, { qty: 50, price: 129 }]),
    minQuantity: 1, weight: 50, length: 5, breadth: 5, height: 1, inStock: true
  },

  // ── ENGRAVED / GIFTS FOR HER ──
  {
    name: "Necklace Couple Photo Engraved",
    price: 349,
    category: "Gifts For Her",
    image: `${BASE}/E1.webp`,
    images: JSON.stringify([`${BASE}/E1.webp`, `${BASE}/E2.webp`]),
    bulkPricing: JSON.stringify([{ qty: 5, price: 299 }, { qty: 10, price: 249 }]),
    minQuantity: 1, weight: 100, length: 10, breadth: 5, height: 2, inStock: true
  },
  {
    name: "Eyes Engraved Necklace",
    price: 249,
    category: "Gifts For Her",
    image: `${BASE}/E2.webp`,
    images: JSON.stringify([`${BASE}/E2.webp`, `${BASE}/E1.webp`]),
    bulkPricing: JSON.stringify([{ qty: 5, price: 199 }, { qty: 10, price: 169 }]),
    minQuantity: 1, weight: 100, length: 10, breadth: 5, height: 2, inStock: true
  },
  {
    name: "Cuff Bracelet",
    price: 249,
    category: "Gifts For Her",
    image: `${BASE}/E3.webp`,
    images: JSON.stringify([`${BASE}/E3.webp`, `${BASE}/E4.webp`]),
    bulkPricing: JSON.stringify([{ qty: 5, price: 199 }, { qty: 10, price: 179 }]),
    minQuantity: 1, weight: 100, length: 10, breadth: 5, height: 2, inStock: true
  },
  {
    name: "Photo frame (Customise)",
    price: 349,
    category: "Gifts For Her",
    image: `${BASE}/E4.webp`,
    images: JSON.stringify([`${BASE}/E4.webp`, `${BASE}/E1.webp`]),
    bulkPricing: JSON.stringify([{ qty: 5, price: 299 }, { qty: 10, price: 249 }]),
    minQuantity: 1, weight: 300, length: 20, breadth: 15, height: 3, inStock: true
  },

  // ── GIFTS FOR HIM ──
  {
    name: "Wallet for Men",
    price: 349,
    category: "Gifts For Him",
    image: `${BASE}/CB1.webp`,
    images: JSON.stringify([`${BASE}/CB1.webp`, `${BASE}/CB@2.webp`]),
    bulkPricing: JSON.stringify([{ qty: 5, price: 299 }, { qty: 10, price: 249 }]),
    minQuantity: 1, weight: 200, length: 12, breadth: 10, height: 2, inStock: true
  },
  {
    name: "Man Combo Set",
    price: 599,
    category: "Gifts For Him",
    image: `${BASE}/CB@2.webp`,
    images: JSON.stringify([`${BASE}/CB@2.webp`, `${BASE}/CB1.webp`]),
    bulkPricing: JSON.stringify([{ qty: 5, price: 499 }, { qty: 10, price: 449 }]),
    minQuantity: 1, weight: 400, length: 20, breadth: 15, height: 10, inStock: true
  },

  // ── STATIONERY / PENS ──
  {
    name: "Customised Pen (Engraved)",
    price: 299,
    category: "Stationery",
    image: `${BASE}/S1.webp`,
    images: JSON.stringify([`${BASE}/S1.webp`, `${BASE}/S2.webp`]),
    bulkPricing: JSON.stringify([{ qty: 10, price: 249 }, { qty: 50, price: 199 }]),
    minQuantity: 1, weight: 50, length: 15, breadth: 3, height: 3, inStock: true
  },
  {
    name: "Wooden Pen Stand",
    price: 299,
    category: "Stationery",
    image: `${BASE}/S2.webp`,
    images: JSON.stringify([`${BASE}/S2.webp`, `${BASE}/S1.webp`]),
    bulkPricing: JSON.stringify([{ qty: 10, price: 249 }, { qty: 50, price: 199 }]),
    minQuantity: 1, weight: 200, length: 10, breadth: 10, height: 8, inStock: true
  },

  // ── CORPORATE ──
  {
    name: "Metal Business Card",
    price: 999,
    category: "Corporate",
    image: `${BASE}/C1.webp`,
    images: JSON.stringify([`${BASE}/C1.webp`, `${BASE}/C2.webp`]),
    bulkPricing: JSON.stringify([{ qty: 10, price: 799 }, { qty: 50, price: 599 }]),
    minQuantity: 10, weight: 50, length: 9, breadth: 6, height: 1, inStock: true
  },
  {
    name: "Custom Wooden Keychain",
    price: 199,
    category: "Corporate",
    image: `${BASE}/C2.webp`,
    images: JSON.stringify([`${BASE}/C2.webp`, `${BASE}/C1.webp`]),
    bulkPricing: JSON.stringify([{ qty: 10, price: 149 }, { qty: 50, price: 119 }]),
    minQuantity: 1, weight: 50, length: 5, breadth: 5, height: 1, inStock: true
  },

  // ── HOME DECOR / LAMPS ──
  {
    name: "Wooden Photo Lamp",
    price: 1199,
    category: "Home Decor",
    image: `${BASE}/L1.webp`,
    images: JSON.stringify([`${BASE}/L1.webp`, `${BASE}/L2.webp`, `${BASE}/L3.webp`]),
    bulkPricing: JSON.stringify([{ qty: 5, price: 999 }, { qty: 10, price: 899 }]),
    minQuantity: 1, weight: 500, length: 20, breadth: 20, height: 25, inStock: true
  },
  {
    name: "Wooden Photo",
    price: 599,
    category: "Home Decor",
    image: `${BASE}/L2.webp`,
    images: JSON.stringify([`${BASE}/L2.webp`, `${BASE}/L3.webp`]),
    bulkPricing: JSON.stringify([{ qty: 5, price: 499 }, { qty: 10, price: 449 }]),
    minQuantity: 1, weight: 300, length: 20, breadth: 15, height: 5, inStock: true
  },
  {
    name: "Wooden Photo Frame",
    price: 499,
    category: "Home Decor",
    image: `${BASE}/L3.webp`,
    images: JSON.stringify([`${BASE}/L3.webp`, `${BASE}/L1.webp`]),
    bulkPricing: JSON.stringify([{ qty: 5, price: 399 }, { qty: 10, price: 349 }]),
    minQuantity: 1, weight: 300, length: 20, breadth: 15, height: 3, inStock: true
  },

  // ── SPIRITUAL DECOR / WOOD ──
  {
    name: "Wooden Mandir / Temple Showpiece",
    price: 499,
    category: "Spiritual Decor",
    image: `${BASE}/W1.webp`,
    images: JSON.stringify([`${BASE}/W1.webp`, `${BASE}/W2.webp`]),
    bulkPricing: JSON.stringify([{ qty: 5, price: 449 }, { qty: 10, price: 399 }]),
    minQuantity: 1, weight: 500, length: 20, breadth: 15, height: 25, inStock: true
  },
  {
    name: "Temperature Bottle (Metal)",
    price: 499,
    category: "Corporate",
    image: `${BASE}/W2.webp`,
    images: JSON.stringify([`${BASE}/W2.webp`, `${BASE}/W3.webp`]),
    bulkPricing: JSON.stringify([{ qty: 10, price: 399 }, { qty: 50, price: 349 }]),
    minQuantity: 1, weight: 400, length: 8, breadth: 8, height: 25, inStock: true
  },
  {
    name: "Customised Keychain",
    price: 149,
    category: "Keychain",
    image: `${BASE}/W3.webp`,
    images: JSON.stringify([`${BASE}/W3.webp`, `${BASE}/W4.webp`]),
    bulkPricing: JSON.stringify([{ qty: 10, price: 119 }, { qty: 50, price: 89 }]),
    minQuantity: 1, weight: 50, length: 5, breadth: 5, height: 1, inStock: true
  },
  {
    name: "Kids DIY Painting Kit (MDF)",
    price: 199,
    category: "Kids Gift",
    image: `${BASE}/W4.webp`,
    images: JSON.stringify([`${BASE}/W4.webp`, `${BASE}/W1.webp`]),
    bulkPricing: JSON.stringify([{ qty: 10, price: 169 }, { qty: 50, price: 129 }]),
    minQuantity: 1, weight: 300, length: 20, breadth: 20, height: 5, inStock: true
  },
];

async function main() {
  console.log("🚀 Seeding real ArtPeak products with actual images...\n");
  let added = 0, skipped = 0;

  for (const product of allProducts) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (existing) {
      // Update with real images
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          image: product.image,
          images: product.images,
          price: product.price,
          category: product.category,
          bulkPricing: product.bulkPricing,
          minQuantity: product.minQuantity,
          weight: product.weight,
          length: product.length,
          breadth: product.breadth,
          height: product.height,
          inStock: product.inStock,
        }
      });
      console.log(`🔄 Updated images: ${product.name}`);
      skipped++;
    } else {
      await prisma.product.create({
        data: {
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          images: product.images,
          bulkPricing: product.bulkPricing,
          sizes: "[]",
          minQuantity: product.minQuantity,
          weight: product.weight,
          length: product.length,
          breadth: product.breadth,
          height: product.height,
          inStock: product.inStock,
          sortOrder: 999,
        }
      });
      console.log(`✅ Added: ${product.name}`);
      added++;
    }
  }

  console.log(`\n✨ Done! Added ${added} new products, updated ${skipped} existing products.`);
  const total = await prisma.product.count();
  console.log(`📦 Total products in DB: ${total}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
