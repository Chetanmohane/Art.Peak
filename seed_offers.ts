import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const offers = [
    {
        festival: "Welcome Offer",
        title: "FLAT 10% OFF on Your First Order",
        subtitle: "Start your journey with ArtPeak. Handcrafted premium products customized just for you.",
        code: "WELCOME10",
        validTill: "31 March 2026",
        emoji: "🎨",
        glow: "#f97316",
        darkBg: "linear-gradient(135deg, #120900 0%, #251500 40%, #120900 100%)",
        lightBg: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)",
        darkTextAccent: "#fb923c",
        lightTextAccent: "#c2410c",
        discountPercent: 10,
        isActive: true,
        minAmount: 499,
        minQuantity: 1
    },
    {
        festival: "Midnight Flash Sale",
        title: "The Mystery Hour: 30% OFF Everything",
        subtitle: "Exclusive midnight deals on laser-engraved masterpieces.",
        code: "MYSTERY30",
        validTill: "20 March 2026",
        emoji: "🌙",
        glow: "#a855f7",
        darkBg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        lightBg: "linear-gradient(135deg, #f3f4f6 0%, #ede9fe 100%)",
        darkTextAccent: "#c084fc",
        lightTextAccent: "#7e22ce",
        discountPercent: 30,
        isActive: true,
        minAmount: 1499,
        minQuantity: 1
    },
    {
        festival: "Elite Gold Deal",
        title: "Go Premium with 20% OFF Limited Items",
        subtitle: "Luxury collections for those who appreciate the finer details in life.",
        code: "GOLD20",
        validTill: "25 March 2026",
        emoji: "🏆",
        glow: "#fbbf24",
        darkBg: "linear-gradient(135deg, #0c0a09 0%, #1c1917 100%)",
        lightBg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
        darkTextAccent: "#fcd34d",
        lightTextAccent: "#b45309",
        discountPercent: 20,
        isActive: true,
        minAmount: 2499,
        minQuantity: 1
    },
    {
        festival: "Corporate Excellence",
        title: "Bulk Orders? Save 15% Instantly",
        subtitle: "Perfect for offices, events, and gifting. Scale your brand with ArtPeak.",
        code: "CORP15",
        validTill: "10 April 2026",
        emoji: "💼",
        glow: "#10b981",
        darkBg: "linear-gradient(135deg, #022c22 0%, #064e3b 100%)",
        lightBg: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
        darkTextAccent: "#34d399",
        lightTextAccent: "#047857",
        discountPercent: 15,
        isActive: true,
        minAmount: 4999,
        minQuantity: 5
    },
    {
        festival: "Holi Special 2026",
        title: "Festival of Colors Sale - 25% OFF",
        subtitle: "Add color to your life with our custom vibrant keychains and lamps.",
        code: "HOLI25",
        validTill: "16 March 2026",
        emoji: "🌈",
        glow: "#ec4899",
        darkBg: "linear-gradient(135deg, #4c0519 0%, #831843 100%)",
        lightBg: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
        darkTextAccent: "#f472b6",
        lightTextAccent: "#be185d",
        discountPercent: 25,
        isActive: true,
        minAmount: 999,
        minQuantity: 1
    }
];

async function main() {
    try {
        console.log("💎 Seeding Premium Offers to MongoDB...\n");

        // Delete old offers and recreate
        await prisma.offer.deleteMany();

        for (const offer of offers) {
            const created = await prisma.offer.create({ data: offer });
            console.log(`✨ Created Offer: ${created.code} (${created.discountPercent}% OFF)`);
        }

        console.log(`\n👑 Successfully seeded ${offers.length} Premium Offers!`);
    } catch (e: any) {
        console.error("❌ SEED ERROR:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
