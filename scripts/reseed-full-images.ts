import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();
const BASE = '/images/products';

// THE ABSOLUTE COMPLETE CATALOG (V29) - EVERY PREFIXED PRODUCT
const productsSource = [
  // ── KEYCHAINS (K1-K10) ──
  { name: "Customised Name Keychain", price: 149, category: "Keychain", image: `${BASE}/K1.webp`, images: [`${BASE}/K1.webp`, `${BASE}/K2.webp`] },
  { name: "Metal Keychain (Pattern 2)", price: 199, category: "Keychain", image: `${BASE}/K2.webp`, images: [`${BASE}/K2.webp`, `${BASE}/K3.webp`] },
  { name: "Customised Photo Keychain", price: 249, category: "Keychain", image: `${BASE}/K3.webp`, images: [`${BASE}/K3.webp`, `${BASE}/K4.webp`] },
  { name: "Photo Engraved Keychain", price: 199, category: "Keychain", image: `${BASE}/K4.webp`, images: [`${BASE}/K4.webp`, `${BASE}/K5.webp`] },
  { name: "Sublimation Keychain", price: 149, category: "Keychain", image: `${BASE}/K5.webp`, images: [`${BASE}/K5.webp`, `${BASE}/K6.webp`] },
  { name: "Acrylic Keychain", price: 199, category: "Keychain", image: `${BASE}/K6.webp`, images: [`${BASE}/K6.webp`, `${BASE}/K7.webp`] },
  { name: "Metal Keychain (Premium)", price: 299, category: "Keychain", image: `${BASE}/K7.webp`, images: [`${BASE}/K7.webp`, `${BASE}/K8.webp`] },
  { name: "Customised Keychain (Luxury)", price: 349, category: "Keychain", image: `${BASE}/K8.webp`, images: [`${BASE}/K8.webp`, `${BASE}/K9.webp`] },
  { name: "Custom Wooden Keychain", price: 199, category: "Keychain", image: `${BASE}/K9.webp`, images: [`${BASE}/K9.webp`, `${BASE}/K10.webp`] },
  { name: "Keyring Pattern 10", price: 99, category: "Keychain", image: `${BASE}/K10.webp`, images: [`${BASE}/K10.webp`, `${BASE}/K1.webp`] },

  // ── PENS (P1-P6 & S1) ──
  { name: "Customised Pen (Engraved)", price: 299, category: "Pen", image: `${BASE}/S1.webp`, images: [`${BASE}/S1.webp`, `${BASE}/P1.webp`] },
  { name: "advocate Pen (Engraved)", price: 349, category: "Pen", image: `${BASE}/P1.webp`, images: [`${BASE}/P1.webp`, `${BASE}/P2.webp`] },
  { name: "Premium Metal Pen", price: 399, category: "Pen", image: `${BASE}/P2.webp`, images: [`${BASE}/P2.webp`, `${BASE}/P3.webp`] },
  { name: "Executive Ball Pen", price: 449, category: "Pen", image: `${BASE}/P3.webp`, images: [`${BASE}/P3.webp`, `${BASE}/P4.webp`] },
  { name: "Luxury Fountain Pen", price: 999, category: "Pen", image: `${BASE}/P4.webp`, images: [`${BASE}/P4.webp`, `${BASE}/P5.webp`] },
  { name: "Business Pen Set", price: 1299, category: "Pen", image: `${BASE}/P5.webp`, images: [`${BASE}/P5.webp`, `${BASE}/P6.webp`] },
  { name: "Stylus Metal Pen", price: 549, category: "Pen", image: `${BASE}/P6.webp`, images: [`${BASE}/P6.webp`, `${BASE}/S1.webp`] },

  // ── WALLETS (W1-W4) ──
  { name: "Premium Leather Wallet", price: 349, category: "Wallet", image: `${BASE}/W1.webp`, images: [`${BASE}/W1.webp`, `${BASE}/W2.webp`] },
  { name: "Executive Wallet", price: 399, category: "Wallet", image: `${BASE}/W2.webp`, images: [`${BASE}/W2.webp`, `${BASE}/W3.webp`] },
  { name: "Luxury Wallet", price: 449, category: "Wallet", image: `${BASE}/W3.webp`, images: [`${BASE}/W3.webp`, `${BASE}/W4.webp`] },
  { name: "Classic Wallet", price: 499, category: "Wallet", image: `${BASE}/W4.webp`, images: [`${BASE}/W4.webp`, `${BASE}/W1.webp`] },

  // ── LOCKETS (L1-L3) ──
  { name: "Necklace Couple Photo Engraved", price: 349, category: "Locket", image: `${BASE}/L1.webp`, images: [`${BASE}/L1.webp`, `${BASE}/L2.webp`] },
  { name: "Eyes Engraved Necklace", price: 249, category: "Locket", image: `${BASE}/L2.webp`, images: [`${BASE}/L2.webp`, `${BASE}/L3.webp`] },
  { name: "Cuff Bracelet", price: 249, category: "Locket", image: `${BASE}/L3.webp`, images: [`${BASE}/L3.webp`, `${BASE}/L1.webp`] },

  // ── BOTTLES (B1-B4 & CB1) ──
  { name: "Temperature Bottle (Metal)", price: 499, category: "Bottle", image: `${BASE}/CB1.webp`, images: [`${BASE}/CB1.webp`, `${BASE}/B1.webp`] },
  { name: "Customized Water Bottle", price: 399, category: "Bottle", image: `${BASE}/B1.webp`, images: [`${BASE}/B1.webp`, `${BASE}/B2.webp`] },
  { name: "Vacuum Flask (Insulated)", price: 649, category: "Bottle", image: `${BASE}/B2.webp`, images: [`${BASE}/B2.webp`, `${BASE}/B3.webp`] },
  { name: "Sports Hydra Bottle", price: 549, category: "Bottle", image: `${BASE}/B3.webp`, images: [`${BASE}/B3.webp`, `${BASE}/B4.webp`] },
  { name: "Stainless Steel Sipper", price: 349, category: "Bottle", image: `${BASE}/B4.webp`, images: [`${BASE}/B4.webp`, `${BASE}/CB1.webp`] },

  // ── HOME DECOR / SPIRITUAL (E1-E4 & F*) ──
  { name: "Wooden Mandir / Temple Showpiece", price: 1499, category: "Home Decor", image: `${BASE}/E1.webp`, images: [`${BASE}/E1.webp`, `${BASE}/E2.webp`] },
  { name: "Om Photo Frame (Engraved)", price: 349, category: "Home Decor", image: `${BASE}/E2.webp`, images: [`${BASE}/E2.webp`, `${BASE}/E3.webp`] },
  { name: "Wooden Photo Lamp (Customized)", price: 1199, category: "Home Decor", image: `${BASE}/E3.webp`, images: [`${BASE}/E3.webp`, `${BASE}/E4.webp`] },
  { name: "Kids DIY Painting Kit (MDF)", price: 199, category: "Kids Gift", image: `${BASE}/E4.webp`, images: [`${BASE}/E4.webp`, `${BASE}/E1.webp`] },
  { name: "Premium Desktop Nameplate", price: 1499, category: "Home Decor", image: `${BASE}/desktop-nameplate.jpg`, images: [`${BASE}/desktop-nameplate.jpg`] },
  { name: "Acrylic LED Logo", price: 1499, category: "Corporate", image: `${BASE}/A-logo1.webp`, images: [`${BASE}/A-logo1.webp`] },
  { name: "Glass Trophy Engraving", price: 999, category: "Corporate", image: `${BASE}/C1.webp`, images: [`${BASE}/C1.webp`, `${BASE}/C2.webp`] },
  { name: "Metal Business Card", price: 999, category: "Corporate", image: `${BASE}/C2.webp`, images: [`${BASE}/C2.webp`, `${BASE}/C1.webp`] }
];

async function main() {
  console.log("🚀 FINAL-EXHAUSTIVE-RESEED: Adding ALL Prefix-Mapped Products (38 Products)...");
  await prisma.product.deleteMany({});
  
  let count = 0;
  for (const p of productsSource) {
    await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        category: p.category,
        image: p.image,
        images: p.images,
        bulkPricing: "[]",
        sizes: "[]",
        minQuantity: 1,
        weight: 150,
        length: 10,
        breadth: 10,
        height: 10,
        inStock: true,
        sortOrder: count + 1
      }
    });
    console.log(`✅ ${p.name} -> Restored`);
    count++;
  }
  
  console.log(`\n✨ Done! Successfully restored ${count} total products with matching images.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
