import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL as string
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const products = [
    {
        name: "Customised Name Keychain",
        price: 99,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
        category: "Keychain",
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop"
        ]),
        bulkPricing: JSON.stringify([
            { qty: 10, price: 79 },
            { qty: 50, price: 59 }
        ])
    },
    {
        name: "Customised Photo Keychain",
        price: 249,
        image: "https://images.unsplash.com/photo-1591782698789-8c6d7cf6657e?w=800&auto=format&fit=crop",
        category: "Keychain",
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1591782698789-8c6d7cf6657e?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1586864387789-628af9feed72?w=800&auto=format&fit=crop"
        ]),
        bulkPricing: JSON.stringify([
            { qty: 10, price: 199 },
            { qty: 25, price: 149 }
        ])
    },
    {
        name: "Customised Pen (Engraved)",
        price: 299,
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop",
        category: "Stationery",
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop"
        ]),
        bulkPricing: JSON.stringify([
            { qty: 10, price: 249 },
            { qty: 50, price: 199 }
        ])
    },
    {
        name: "Wooden Photo Lamp",
        price: 1199,
        image: "https://images.unsplash.com/photo-1513506003901-1e6a35760c79?w=800&auto=format&fit=crop",
        category: "Home Decor",
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1513506003901-1e6a35760c79?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1524055988636-436cfa46e59e?w=800&auto=format&fit=crop"
        ]),
        bulkPricing: JSON.stringify([
            { qty: 5, price: 999 },
            { qty: 10, price: 899 }
        ])
    },
    {
        name: "Wooden Mandir / Temple Showpiece",
        price: 499,
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop",
        category: "Spiritual Decor",
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=800&auto=format&fit=crop"
        ]),
        bulkPricing: JSON.stringify([
            { qty: 5, price: 449 },
            { qty: 10, price: 399 }
        ])
    },
    {
        name: "Kids DIY Painting Kit",
        price: 199,
        image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&auto=format&fit=crop",
        category: "Kids Gift",
        images: JSON.stringify([
            "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop"
        ]),
        bulkPricing: JSON.stringify([
            { qty: 10, price: 169 },
            { qty: 50, price: 129 }
        ])
    }
]

async function main() {
    try {
        console.log("🌱 Seeding Art.peak products...\n")

        // ✅ Only ADD products — never delete existing ones
        for (const product of products) {
            const created = await prisma.product.create({ data: product })
            console.log(`✅ Created: ${created.name} (₹${created.price})`)
        }

        console.log(`\n🎉 Successfully seeded ${products.length} products!`)
    } catch (e: any) {
        console.error("❌ SEED ERROR:", e.message)
    } finally {
        await prisma.$disconnect()
        await pool.end()
    }
}

main()
