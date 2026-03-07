import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL as string
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const oldProducts = [
    {
        name: "Custom Wooden Keychain",
        price: 200,
        image: "https://images.unsplash.com/photo-1542319630-55fb7f7c944a?q=80&w=2070&auto=format&fit=crop",
        category: "Product",
        images: JSON.stringify(["https://images.unsplash.com/photo-1542319630-55fb7f7c944a?q=80&w=2070&auto=format&fit=crop"]),
        bulkPricing: JSON.stringify([])
    },
    {
        name: "Metal Business Card",
        price: 999,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop",
        category: "Product",
        images: JSON.stringify(["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop"]),
        bulkPricing: JSON.stringify([])
    },
    {
        name: "Glass Trophy Engraving",
        price: 2499,
        image: "https://plus.unsplash.com/premium_photo-1661299317537-805177242d54?q=80&w=2070&auto=format&fit=crop",
        category: "Product",
        images: JSON.stringify(["https://plus.unsplash.com/premium_photo-1661299317537-805177242d54?q=80&w=2070&auto=format&fit=crop"]),
        bulkPricing: JSON.stringify([])
    },
    {
        name: "Acrylic LED Logo",
        price: 3999,
        image: "https://images.unsplash.com/photo-1563245332-692e105b9ee2?q=80&w=2070&auto=format&fit=crop",
        category: "Product",
        images: JSON.stringify(["https://images.unsplash.com/photo-1563245332-692e105b9ee2?q=80&w=2070&auto=format&fit=crop"]),
        bulkPricing: JSON.stringify([])
    },
    {
        name: "Premium Desktop Nameplate",
        price: 999,
        image: "https://images.unsplash.com/photo-1542319630-55fb7f7c944a?q=80&w=2070&auto=format&fit=crop",
        category: "Corporate",
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1542319630-55fb7f7c944a?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop"
        ]),
        bulkPricing: JSON.stringify([
            { qty: 10, price: 899 },
            { qty: 50, price: 749 }
        ])
    }
];

async function main() {
    try {
        console.log("🕯️ Restoring PURANE products (without deleting new ones)...\n")

        for (const prod of oldProducts) {
            // Check if already exists to avoid duplicates
            const exists = await prisma.product.findFirst({
                where: { name: prod.name }
            })

            if (!exists) {
                await prisma.product.create({ data: prod })
                console.log(`✅ Restored: ${prod.name}`)
            } else {
                console.log(`⏩ Already exists: ${prod.name}`)
            }
        }

        console.log(`\n🎉 Restoration complete!`)
    } catch (e: any) {
        console.error("❌ RESTORE ERROR:", e.message)
    } finally {
        await prisma.$disconnect()
        await pool.end()
    }
}

main()
