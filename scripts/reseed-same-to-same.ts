import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();
const BASE = '/images/products';

// PRECISE REPLACEMENT LOGIC based on user report and logical prefixes
const productsSource = [
  // ── KEYCHAINS ──
  { name: "Customised Name Keychain", price: 99, category: "Keychain", image: `${BASE}/K1.webp`, images: [`${BASE}/K1.webp`] },
  { name: "Eyes Engraved Keychain", price: 199, category: "Keychain", image: `${BASE}/K2.webp`, images: [`${BASE}/K2.webp`] },
  { name: "Customised Photo Keychain", price: 249, category: "Keychain", image: `${BASE}/K3.webp`, images: [`${BASE}/K3.webp`] },
  { name: "Photo Engraved Keychain", price: 199, category: "Keychain", image: `${BASE}/K4.webp`, images: [`${BASE}/K4.webp`] },
  { name: "Sublimation Keychain", price: 149, category: "Keychain", image: `${BASE}/K5.webp`, images: [`${BASE}/K5.webp`] },

  // ── GIFTS FOR HER (L SERIES) ──
  { name: "Necklace Couple Photo Engraved", price: 349, category: "Gifts For Her", image: `${BASE}/L1.webp`, images: [`${BASE}/L1.webp`] },
  { name: "Eyes Engraved Necklace", price: 249, category: "Gifts For Her", image: `${BASE}/L2.webp`, images: [`${BASE}/L2.webp`] },
  { name: "Cuff Bracelet", price: 249, category: "Gifts For Her", image: `${BASE}/L3.webp`, images: [`${BASE}/L3.webp`] },

  // ── GIFTS FOR HIM (W SERIES + CB@2) ──
  { name: "Wallet for Men (Style 1)", price: 349, category: "Gifts For Him", image: `${BASE}/W1.webp`, images: [`${BASE}/W1.webp`] },
  { name: "Wallet for Men (Style 2)", price: 399, category: "Gifts For Him", image: `${BASE}/W2.webp`, images: [`${BASE}/W2.webp`] },
  { name: "Wallet for Men (Style 3)", price: 449, category: "Gifts For Him", image: `${BASE}/W3.webp`, images: [`${BASE}/W3.webp`] },
  { name: "Wallet for Men (Style 4)", price: 499, category: "Gifts For Him", image: `${BASE}/W4.webp`, images: [`${BASE}/W4.webp`] },
  { name: "Man Combo Set (Bottle + Wallet + Pen)", price: 599, category: "Gifts For Him", image: `${BASE}/CB@2.webp`, images: [`${BASE}/CB@2.webp`] },

  // ── STATIONERY (S SERIES) ──
  { name: "Customised Pen (Engraved)", price: 299, category: "Stationery", image: `${BASE}/S1.webp`, images: [`${BASE}/S1.webp`] },
  { name: "Wooden Pen Stand", price: 299, category: "Stationery", image: `${BASE}/S2.webp`, images: [`${BASE}/S2.webp`] },

  // ── CORPORATE (C SERIES + CB1) ──
  { name: "Metal Business Card", price: 999, category: "Corporate", image: `${BASE}/C1.webp`, images: [`${BASE}/C1.webp`] },
  { name: "Custom Wooden Keychain (Corporate)", price: 199, category: "Corporate", image: `${BASE}/C2.webp`, images: [`${BASE}/C2.webp`] },
  { name: "Temperature Bottle (Metal)", price: 499, category: "Corporate", image: `${BASE}/CB1.webp`, images: [`${BASE}/CB1.webp`] },

  // ── HOME DECOR / SPIRITUAL (E SERIES) ──
  { name: "Wooden Mandir / Temple Showpiece", price: 499, category: "Spiritual Decor", image: `${BASE}/E1.webp`, images: [`${BASE}/E1.webp`] },
  { name: "Om Photo Frame (Engraved)", price: 349, category: "Home Decor", image: `${BASE}/E2.webp`, images: [`${BASE}/E2.webp`] },
  { name: "Wooden Photo Lamp (Customized)", price: 1199, category: "Home Decor", image: `${BASE}/E3.webp`, images: [`${BASE}/E3.webp`] },
  { name: "Kids DIY Painting Kit (MDF)", price: 199, category: "Kids Gift", image: `${BASE}/E4.webp`, images: [`${BASE}/E4.webp`] },
];

async function main() {
  console.log("🧹 Clearing old products to ensure zero mismatch...");
  await prisma.product.deleteMany({});
  
  console.log("💎 Seeding 22 products with ORIGINAL METADATA & CORRECT IMAGES...");
  
  for (const p of productsSource) {
    // Generate some default metadata like weight/stock
    await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        category: p.category,
        image: p.image,
        images: JSON.stringify(p.images),
        bulkPricing: "[]",
        sizes: "[]",
        minQuantity: 1,
        weight: 150,
        length: 10,
        breadth: 10,
        height: 10,
        inStock: true,
        sortOrder: 100
      }
    });
    console.log(`✅ Success: ${p.name} updated with ${p.image}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
