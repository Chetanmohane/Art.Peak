import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { execSync } from 'child_process';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Migrating products from SQLite CLI output to MongoDB...");

    try {
        // Run sqlite3 and get JSON
        const output = execSync('sqlite3 dev.db "SELECT * FROM Product" -json', { encoding: 'utf8' });
        const sqliteProducts: any[] = JSON.parse(output);
        console.log(`Found ${sqliteProducts.length} products in SQLite.`);

        for (const p of sqliteProducts) {
            // Check if product with same name exists in MongoDB
            const existing = await prisma.product.findFirst({
                where: { name: p.name }
            });

            if (!existing) {
                console.log(`➕ Migrating: ${p.name}`);
                await prisma.product.create({
                    data: {
                        name: p.name,
                        price: parseFloat(p.price) || 0,
                        image: p.image || "/placeholder.png",
                        category: p.category || "General",
                        images: p.images || "[]",
                        bulkPricing: p.bulkPricing || "[]",
                        sizes: p.sizes || "[]",
                        minQuantity: parseInt(p.minQuantity) || 1,
                        sortOrder: parseInt(p.sortOrder) || 999,
                        weight: parseFloat(p.weight) || 500,
                        length: parseFloat(p.length) || 10,
                        breadth: parseFloat(p.breadth) || 10,
                        height: parseFloat(p.height) || 10,
                        inStock: p.inStock === 1 || p.inStock === true
                    }
                });
            } else {
                console.log(`⏩ Skipping (already exists): ${p.name}`);
            }
        }

        console.log("🎉 Migration complete!");
    } catch (error) {
        console.error("❌ MIGRATION ERROR:", error);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
}

main();
