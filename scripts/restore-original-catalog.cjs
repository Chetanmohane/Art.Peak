const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Clearing the jumbled database...");
    await prisma.product.deleteMany({});
    
    console.log("🚀 Extracting ALL 26 entries using Buffer Scanning...");
    
    const buffer = fs.readFileSync('db-check-output.txt');
    const content = buffer.toString('utf8'); // Full 32MB string
    
    // Split on ANY region of "Name: " (CASE INSENSITIVE)!
    const sep = "Name: ";
    const lsep = "name: ";
    
    // We'll use a manual split that handles both cases and doesn't stop at nulls
    const products = [];
    let pos = 0;
    
    while (true) {
        let nameIdx = content.indexOf(sep, pos);
        let lnameIdx = content.indexOf(lsep, pos);
        
        let startIdx = -1;
        if (nameIdx === -1 && lnameIdx === -1) break;
        if (nameIdx === -1) startIdx = lnameIdx;
        else if (lnameIdx === -1) startIdx = nameIdx;
        else startIdx = Math.min(nameIdx, lnameIdx);
        
        startIdx += 6; // Skip "Name: "
        
        // Find end of section (next "Name: " or "ID: ")
        let nextNameIdx = content.indexOf(sep, startIdx);
        let nextLNameIdx = content.indexOf(lsep, startIdx);
        let endIdx = content.length;
        
        if (nextNameIdx !== -1 && nextLNameIdx !== -1) endIdx = Math.min(nextNameIdx, nextLNameIdx);
        else if (nextNameIdx !== -1) endIdx = nextNameIdx;
        else if (nextLNameIdx !== -1) endIdx = nextLNameIdx;
        
        const section = content.substring(startIdx, endIdx);
        const lines = section.split('\n');
        
        let name = lines[0].trim();
        let price = 0, category = '', image = '', images = '[]', bulkPricing = '[]', sizes = '[]';
        
        lines.forEach(line => {
            const trimmed = line.trim();
            const lowered = trimmed.toLowerCase();
            if (lowered.startsWith('price: ')) price = parseInt(trimmed.substring(7).trim()) || 0;
            else if (lowered.startsWith('category: ')) category = trimmed.substring(10).trim();
            else if (lowered.startsWith('image: ')) image = trimmed.substring(7).trim();
            else if (lowered.startsWith('images: ')) images = trimmed.substring(8).trim();
            else if (lowered.startsWith('bulkpricing: ')) bulkPricing = trimmed.substring(13).trim();
            else if (lowered.startsWith('sizes: ')) sizes = trimmed.substring(7).trim();
        });
        
        if (name && image) {
            products.push({ name, price, category, image, images, bulkPricing, sizes });
        }
        
        pos = endIdx;
    }

    console.log(`✨ Found ${products.length} products in the full backup.`);
    
    let count = 0;
    for (let p of products) {
        try {
            await prisma.product.create({
                data: {
                    name: p.name,
                    price: p.price,
                    category: p.category,
                    image: p.image || "/placeholder.png",
                    images: (p.images === '[]' || !p.images) ? JSON.stringify([p.image]) : p.images,
                    bulkPricing: (p.bulkPricing === 'Unknown' || !p.bulkPricing || p.bulkPricing === '[]') ? '[]' : p.bulkPricing,
                    sizes: (p.sizes === 'Unknown' || !p.sizes || p.sizes === '[]') ? '[]' : p.sizes,
                    minQuantity: 1,
                    weight: 150,
                    length: 10,
                    breadth: 10,
                    height: 10,
                    inStock: true
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
