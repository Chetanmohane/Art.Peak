const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Clearing the jumbled database...");
    await prisma.product.deleteMany({});
    
    // Read the large file manually
    const content = fs.readFileSync('db-check-output.txt', 'utf8');
    
    console.log("🚀 Restoring from ALL 26 archived entries in the backup...");
    
    // Find all occurrences of name and image using a broad regex
    const nameRegex = /Name: (.*)/g;
    const priceRegex = /Price: (.*)/g;
    const categoryRegex = /Category: (.*)/g;
    const imageRegex = /Image: (.*)/g;
    
    const names = [], prices = [], categories = [], images = [];
    
    let match;
    while ((match = nameRegex.exec(content)) !== null) names.push(match[1].trim());
    while ((match = priceRegex.exec(content)) !== null) prices.push(parseInt(match[1].trim()) || 0);
    while ((match = categoryRegex.exec(content)) !== null) categories.push(match[1].trim());
    while ((match = imageRegex.exec(content)) !== null) images.push(match[1].trim());
    
    const minLen = Math.min(names.length, images.length);
    let count = 0;
    
    for (let i = 0; i < minLen; i++) {
        try {
            await prisma.product.create({
                data: {
                    name: names[i],
                    price: prices[i] || 0,
                    category: categories[i] || "",
                    image: images[i] || "/placeholder.png",
                    images: JSON.stringify([images[i] || "/placeholder.png"]),
                    bulkPricing: "[]",
                    sizes: "[]",
                    minQuantity: 1,
                    weight: 150,
                    length: 10,
                    breadth: 10,
                    height: 10,
                    inStock: true
                }
            });
            console.log(`✅ Restored ${i+1}/${minLen}: ${names[i]}`);
            count++;
        } catch (e) {
            console.error(`❌ Failed to restore ${names[i]}: ${e.message}`);
        }
    }
    
    console.log(`\n✨ Successfully restored ${count} products to the exact "before" state.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
