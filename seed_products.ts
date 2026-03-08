import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log("🚀 Seeding products to MongoDB...");

        const count = await prisma.product.count();
        if (count > 0) {
            console.log(`Database already has ${count} products. Skipping initial seed.`);
        } else {
            const product = await prisma.product.create({
                data: {
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
            });
            console.log("SUCCESS: Sample product created!");
        }

    } catch (e: any) {
        console.error("SEED ERROR:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}
main();
