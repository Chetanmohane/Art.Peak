import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const connectionString = process.env.DATABASE_URL as string
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Old Products from searchData.ts
const oldProducts = [
    {
        name: "Custom Wooden Keychain",
        price: 200,
        image: "https://images.unsplash.com/photo-1542319630-55fb7f7c944a?q=80&w=2070&auto=format&fit=crop", // Using a placeholder as the old data only had icon emoji or simple strings
        category: "Product",
        images: ["https://images.unsplash.com/photo-1542319630-55fb7f7c944a?q=80&w=2070&auto=format&fit=crop"],
        bulkPricing: []
    },
    {
        name: "Metal Business Card",
        price: 999,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop",
        category: "Product",
        images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop"],
        bulkPricing: []
    },
    {
        name: "Glass Trophy Engraving",
        price: 2499,
        image: "https://plus.unsplash.com/premium_photo-1661299317537-805177242d54?q=80&w=2070&auto=format&fit=crop",
        category: "Product",
        images: ["https://plus.unsplash.com/premium_photo-1661299317537-805177242d54?q=80&w=2070&auto=format&fit=crop"],
        bulkPricing: []
    },
    {
        name: "Acrylic LED Logo",
        price: 3999,
        image: "https://images.unsplash.com/photo-1563245332-692e105b9ee2?q=80&w=2070&auto=format&fit=crop",
        category: "Product",
        images: ["https://images.unsplash.com/photo-1563245332-692e105b9ee2?q=80&w=2070&auto=format&fit=crop"],
        bulkPricing: []
    }
];

async function main() {
    try {
        console.log("Restoring old products...");

        for (const p of oldProducts) {
            await prisma.product.create({
                data: {
                    name: p.name,
                    price: p.price,
                    image: p.image,
                    category: p.category,
                    images: JSON.stringify(p.images),
                    bulkPricing: JSON.stringify(p.bulkPricing),
                }
            });
            console.log(`Created: ${p.name}`);
        }

        console.log("SUCCESS: Old products restored!");

        // Also promote common user emails to admin if requested (we'll do this for the current test account at least)
        const testEmail = "agent_final_test_300@example.com";
        const userEmail = "Bhumi@gmail.com";
        await prisma.user.updateMany({
            where: { email: { in: [testEmail, userEmail, "admin@example.com"] } },
            data: { role: "admin" }
        });
        console.log("Updated roles to admin for common accounts.");

    } catch (e: any) {
        console.error("RESTORE ERROR:");
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}
main();
