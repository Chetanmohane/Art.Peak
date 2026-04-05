import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();
const BASE = '/images/products';

const allProducts = [
  // KEYCHAINS
  { name: "Customised Name Keychain", image: `${BASE}/K1.webp`, category: "Keychain", price: 99, images: [`${BASE}/K1.webp`] },
  { name: "Eyes Engraved Keychain", image: `${BASE}/K2.webp`, category: "Keychain", price: 199, images: [`${BASE}/K2.webp`] },
  { name: "Customised Photo Keychain", image: `${BASE}/K3.webp`, category: "Keychain", price: 249, images: [`${BASE}/K3.webp`] },
  { name: "Photo Engraved Keychain", image: `${BASE}/K4.webp`, category: "Keychain", price: 199, images: [`${BASE}/K4.webp`] },
  { name: "Sublimation Keychain", image: `${BASE}/K5.webp`, category: "Keychain", price: 149, images: [`${BASE}/K5.webp`] },
  
  // ENGRAVED / GIFTS FOR HER
  { name: "Necklace Couple Photo Engraved", image: `${BASE}/E1.webp`, category: "Gifts For Her", price: 349, images: [`${BASE}/E1.webp`] },
  { name: "Eyes Engraved Necklace", image: `${BASE}/E2.webp`, category: "Gifts For Her", price: 249, images: [`${BASE}/E2.webp`] },
  { name: "Cuff Bracelet", image: `${BASE}/E3.webp`, category: "Gifts For Her", price: 249, images: [`${BASE}/E3.webp`] },
  { name: "Photo frame (Customise)", image: `${BASE}/E4.webp`, category: "Gifts For Her", price: 349, images: [`${BASE}/E4.webp`] },
  
  // GIFTS FOR HIM
  { name: "Wallet for Men", image: `${BASE}/CB1.webp`, category: "Gifts For Him", price: 349, images: [`${BASE}/CB1.webp`] },
  { name: "Man Combo Set", image: `${BASE}/CB@2.webp`, category: "Gifts For Him", price: 599, images: [`${BASE}/CB@2.webp`] },
  
  // STATIONERY
  { name: "Customised Pen (Engraved)", image: `${BASE}/S1.webp`, category: "Stationery", price: 299, images: [`${BASE}/S1.webp`] },
  { name: "Wooden Pen Stand", image: `${BASE}/S2.webp`, category: "Stationery", price: 299, images: [`${BASE}/S2.webp`] },
  
  // CORPORATE
  { name: "Metal Business Card", image: `${BASE}/C1.webp`, category: "Corporate", price: 999, images: [`${BASE}/C1.webp`] },
  { name: "Custom Wooden Keychain", image: `${BASE}/C2.webp`, category: "Corporate", price: 199, images: [`${BASE}/C2.webp`] },
  { name: "Temperature Bottle (Metal)", image: `${BASE}/W2.webp`, category: "Corporate", price: 499, images: [`${BASE}/W2.webp`] },
  
  // HOME DECOR
  { name: "Wooden Photo Lamp", image: `${BASE}/L1.webp`, category: "Home Decor", price: 1199, images: [`${BASE}/L1.webp`] },
  { name: "Wooden Photo", image: `${BASE}/L2.webp`, category: "Home Decor", price: 599, images: [`${BASE}/L2.webp`] },
  { name: "Wooden Photo Frame", image: `${BASE}/L3.webp`, category: "Home Decor", price: 499, images: [`${BASE}/L3.webp`] },
  
  // SPIRITUAL / DECOR
  { name: "Wooden Mandir / Temple Showpiece", image: `${BASE}/W1.webp`, category: "Spiritual Decor", price: 499, images: [`${BASE}/W1.webp`] },
  { name: "Customised Keychain", image: `${BASE}/W3.webp`, category: "Keychain", price: 149, images: [`${BASE}/W3.webp`] },
  { name: "Kids DIY Painting Kit (MDF)", image: `${BASE}/W4.webp`, category: "Kids Gift", price: 199, images: [`${BASE}/W4.webp`] },
];

async function main() {
  console.log("🗑️ Cleaning database...");
  await prisma.product.deleteMany({});
  
  console.log("🚀 Seeding 22 unique products...");
  
  for (const p of allProducts) {
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
        weight: 100,
        length: 10,
        breadth: 10,
        height: 5,
        inStock: true,
        sortOrder: 999
      }
    });
    console.log(`✅ Added: ${p.name}`);
  }
  
  console.log("\n✨ Done! Database is now clean and mapped correctly.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
