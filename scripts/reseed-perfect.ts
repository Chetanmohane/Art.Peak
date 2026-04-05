import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();
const BASE = '/images/products';

// PREFIX BASED MAPPING (Logical based on user feedback)
// K = Keychain, E = Engraved/Spiritual, S = Stationery, C = Corporate, CB = Combo/Bottle, W = Wallet, L = Locket/Necklace
const allProducts = [
  // KEYCHAINS (K1-K5)
  { name: "Customised Name Keychain", image: `${BASE}/K1.webp`, category: "Keychain", price: 99 },
  { name: "Eyes Engraved Keychain", image: `${BASE}/K2.webp`, category: "Keychain", price: 199 },
  { name: "Customised Photo Keychain", image: `${BASE}/K3.webp`, category: "Keychain", price: 249 },
  { name: "Photo Engraved Keychain", image: `${BASE}/K4.webp`, category: "Keychain", price: 199 },
  { name: "Sublimation Keychain", image: `${BASE}/K5.webp`, category: "Keychain", price: 149 },
  
  // LOCKETS / NECKLACES (L1-L3)
  { name: "Necklace Couple Photo Engraved", image: `${BASE}/L1.webp`, category: "Gifts For Her", price: 349 },
  { name: "Eyes Engraved Necklace", image: `${BASE}/L2.webp`, category: "Gifts For Her", price: 249 },
  { name: "Cuff Bracelet (Lock)", image: `${BASE}/L3.webp`, category: "Gifts For Her", price: 249 },
  
  // WALLETS (W1-W4)
  { name: "Premium Wallet (Style 1)", image: `${BASE}/W1.webp`, category: "Gifts For Him", price: 349 },
  { name: "Premium Wallet (Style 2)", image: `${BASE}/W2.webp`, category: "Gifts For Him", price: 399 },
  { name: "Premium Wallet (Style 3)", image: `${BASE}/W3.webp`, category: "Gifts For Him", price: 449 },
  { name: "Premium Wallet (Style 4)", image: `${BASE}/W4.webp`, category: "Gifts For Him", price: 499 },
  
  // STATIONERY (S1-S2)
  { name: "Customised Pen (Engraved)", image: `${BASE}/S1.webp`, category: "Stationery", price: 299 },
  { name: "Wooden Pen Stand", image: `${BASE}/S2.webp`, category: "Stationery", price: 299 },
  
  // CORPORATE (C1-C2)
  { name: "Metal Business Card", image: `${BASE}/C1.webp`, category: "Corporate", price: 999 },
  { name: "Custom Wooden Keychain (Corporate)", image: `${BASE}/C2.webp`, category: "Corporate", price: 199 },
  
  // COMBO/BOTTLE (CB1, CB@2)
  { name: "Temperature Bottle (Metal)", image: `${BASE}/CB1.webp`, category: "Corporate", price: 499 },
  { name: "Man Combo Set (Wallet & Pen)", image: `${BASE}/CB@2.webp`, category: "Gifts For Him", price: 599 },
  
  // ENGRAVED / SPIRITUAL / DECOR (E1-E4)
  { name: "Wooden Mandir / Temple Showpiece", image: `${BASE}/E1.webp`, category: "Spiritual Decor", price: 499 },
  { name: "Om Wall Hanging (Engraved)", image: `${BASE}/E2.webp`, category: "Spiritual Decor", price: 399 },
  { name: "Wooden Photo Lamp", image: `${BASE}/E3.webp`, category: "Home Decor", price: 1199 },
  { name: "Kids DIY Painting Kit (MDF)", image: `${BASE}/E4.webp`, category: "Kids Gift", price: 199 },
];

async function main() {
  console.log("🗑️ Cleaning database for accurate mapping...");
  await prisma.product.deleteMany({});
  
  console.log("🚀 Seeding 22 products with PERFECT PREFIX MAPPING...");
  
  for (const p of allProducts) {
    await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        category: p.category,
        image: p.image,
        images: JSON.stringify([p.image]),
        bulkPricing: "[]",
        sizes: "[]",
        minQuantity: 1,
        weight: 100,
        length: 10,
        breadth: 10,
        height: 5,
        inStock: true,
        sortOrder: 999
      }
    });
    console.log(`✅ Added: ${p.name} -> ${p.image}`);
  }
  
  console.log("\n✨ Done! Wallet and Necklace mappings fixed.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
