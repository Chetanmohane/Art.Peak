const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Clearing the jumbled database...");
    await prisma.product.deleteMany({});
    
    // Low-level read to be 100% sure we get ALL 32MB
    const fd = fs.openSync('db-check-output.txt', 'r');
    const stats = fs.fstatSync(fd);
    console.log(`🚀 File Size on disk: ${stats.size} bytes`);
    
    const buf = Buffer.alloc(stats.size);
    fs.readSync(fd, buf, 0, stats.size, 0);
    fs.closeSync(fd);
    console.log(`🚀 Actually Read: ${buf.length} bytes`);
    
    // Search for "Name: " globally in the buffer
    const namePattern = Buffer.from("Name: ");
    const pricePattern = Buffer.from("Price: ");
    const categoryPattern = Buffer.from("Category: ");
    const imagePattern = Buffer.from("Image: ");
    const newline = 0x0a;
    
    let productStarts = [];
    let pos = 0;
    while (pos < buf.length) {
        let idx = buf.indexOf(namePattern, pos);
        if (idx === -1) break;
        productStarts.push(idx);
        pos = idx + 6;
    }
    
    console.log(`🚀 Found ${productStarts.length} product markers in the binary buffer.`);
    
    let products = [];
    for (let i = 0; i < productStarts.length; i++) {
        const start = productStarts[i];
        const end = (i + 1 < productStarts.length) ? productStarts[i + 1] : buf.length;
        const section = buf.subarray(start, end);
        
        const getField = (pattern, labelLen) => {
            const fieldIdx = section.indexOf(pattern);
            if (fieldIdx === -1) return '';
            const valStart = fieldIdx + labelLen;
            const valEnd = section.indexOf(newline, valStart);
            return section.subarray(valStart, valEnd === -1 ? section.length : valEnd).toString('utf8').trim();
        };

        const name = getField(namePattern, 6);
        const price = parseInt(getField(pricePattern, 7)) || 0;
        const category = getField(categoryPattern, 10);
        const image = getField(imagePattern, 7);
        
        if (name && image) {
            products.push({ name, price, category, image });
        }
    }

    console.log(`✨ Identified ${products.length} unique records for restoration.`);
    
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
