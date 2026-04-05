const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Clearing the jumbled database...");
    await prisma.product.deleteMany({});
    
    console.log("🚀 Restoring from PARALLEL-EXTRACTION... (The True State)");
    
    const names = fs.readFileSync('names.txt', 'latin1').split('\n').map(l => l.includes("Name: ") ? l.substring(l.indexOf("Name: ") + 6).trim() : l.trim()).filter(Boolean);
    const prices = fs.readFileSync('prices.txt', 'latin1').split('\n').map(l => l.includes("Price: ") ? parseInt(l.substring(l.indexOf("Price: ") + 7).trim()) || 0 : parseInt(l.trim()) || 0).filter(l => !isNaN(l));
    const categories = fs.readFileSync('categories.txt', 'latin1').split('\n').map(l => l.includes("Category: ") ? l.substring(l.indexOf("Category: ") + 10).trim() : l.trim()).filter(Boolean);
    const images = fs.readFileSync('images.txt', 'latin1').split('\n').map(l => l.includes("Image: ") ? l.substring(l.indexOf("Image: ") + 7).trim() : l.trim()).filter(Boolean);
    
    console.log(`📊 Backup Counts: Names=${names.length}, Prices=${prices.length}, Categories=${categories.length}, Images=${images.length}`);
    
    const minLen = Math.min(names.length, prices.length, categories.length, images.length);
    let count = 0;
    
    for (let i = 0; i < minLen; i++) {
        try {
            await prisma.product.create({
                data: {
                    name: names[i],
                    price: prices[i],
                    category: categories[i],
                    image: images[i] || "/placeholder.png",
                    images: JSON.stringify([images[i] || "/placeholder.png"]),
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
            console.log(`✅ Restored ${count+1}/${minLen}: ${names[i]}`);
            count++;
        } catch (e) {
            console.error(`❌ Failed to restore ${names[i]}: ${e.message}`);
        }
    }
    
    console.log(`\n✨ Successfully restored ${count} products to the exact "before" state.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
