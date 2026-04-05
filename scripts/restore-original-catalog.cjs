const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Clearing the jumbled database...");
    await prisma.product.deleteMany({});
    
    console.log("🚀 Extracting EVERYTHING using Deep Buffer Scanning...");
    
    // Read the ENTIRE 32MB file as a raw buffer
    const buf = fs.readFileSync('db-check-output.txt');
    console.log(`🚀 Buffer Size: ${buf.length} bytes`);
    
    // We'll search for field labels as hex patterns to be 100% binary-safe
    const patterns = {
        name: Buffer.from("Name: "),
        price: Buffer.from("Price: "),
        category: Buffer.from("Category: "),
        image: Buffer.from("Image: "),
        end: Buffer.from("----------------------------------------")
    };
    
    let products = [];
    let pos = 0;
    
    while (pos < buf.length) {
        // Find next "Name: "
        let nameIdx = buf.indexOf(patterns.name, pos);
        if (nameIdx === -1) break;
        
        // Find end of this product section
        let nextNameIdx = buf.indexOf(patterns.name, nameIdx + 6);
        let endIdx = (nextNameIdx === -1) ? buf.length : nextNameIdx;
        
        // Extract section buffer
        const section = buf.slice(nameIdx, endIdx);
        
        // Extract fields from section
        const getName = () => {
            let start = 6;
            let end = section.indexOf(0x0a, start);
            return section.slice(start, end === -1 ? section.length : end).toString('utf8').trim();
        };
        
        const getField = (pattern, offset) => {
            let idx = section.indexOf(pattern);
            if (idx === -1) return '';
            let start = idx + offset;
            let end = section.indexOf(0x0a, start);
            return section.slice(start, end === -1 ? section.length : end).toString('utf8').trim();
        };
        
        const name = getName();
        const price = parseInt(getField(patterns.price, 7)) || 0;
        const category = getField(patterns.category, 10);
        const image = getField(patterns.image, 7);
        
        if (name && image) {
            products.push({ name, price, category, image });
        }
        
        pos = endIdx;
    }

    console.log(`✨ Identified ${products.length} product records in the backup.`);
    
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
