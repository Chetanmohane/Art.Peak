const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Clearing the jumbled database...");
    await prisma.product.deleteMany({});
    
    // THE ULTIMATE BINARY-SAFE RAW SCAN
    const content = fs.readFileSync('db-check-output.txt', 'latin1');
    
    // We split by "Name: " but we do so case-insensitively and through the whole 32MB single line if needed
    const sep = /Name: /ig;
    const sections = content.split(sep);
    
    console.log(`🚀 Found ${sections.length - 1} products in the backup via GLOBAL split...`);
    
    let products = [];
    for (let i = 1; i < sections.length; i++) {
        const section = sections[i];
        
        // Extract field values by looking for the labels in this section
        const getField = (label) => {
            const l = label.toLowerCase();
            const s = section.toLowerCase();
            const startIdx = s.indexOf(l);
            if (startIdx === -1) return '';
            const endIdx = s.indexOf('\n', startIdx);
            return section.substring(startIdx + label.length, endIdx === -1 ? section.length : endIdx).trim();
        };
        
        const name = section.split('\n')[0].trim();
        const price = parseInt(getField('Price: ')) || 0;
        const category = getField('Category: ');
        const image = getField('Image: ');
        
        if (name && image) {
            products.push({ name, price, category, image });
        }
    }

    console.log(`✨ Identified ${products.length} products to restore.`);
    
    let count = 0;
    for (let p of products) {
        try {
            await prisma.product.create({
                data: {
                    name: p.name,
                    price: p.price,
                    category: p.category,
                    image: p.image || "/placeholder.png",
                    images: JSON.stringify([p.image || "/placeholder.png"]),
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
            console.log(`✅ Restored ${count+1}/${products.length}: ${p.name}`);
            count++;
        } catch (e) {
            console.error(`❌ Failed to restore ${p.name}: ${e.message}`);
        }
    }
    
    console.log(`\n✨ Successfully restored ${count} products to the exact "before" state.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
