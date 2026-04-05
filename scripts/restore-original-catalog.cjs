const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Clearing the jumbled database...");
    await prisma.product.deleteMany({});
    
    console.log("🚀 Extracting ALL entries using Binary-Safe Reading...");
    
    // Read the large file as raw binary to avoid UTF-8 truncation issues
    const binaryContent = fs.readFileSync('db-check-output.txt', 'latin1');
    const lines = binaryContent.split('\n');
    
    console.log(`🚀 Scanned ${lines.length} lines in the backup (Binary Mode)...`);
    
    let products = [];
    let current = null;
    
    lines.forEach(line => {
        const trimmed = line.trim();
        const lowered = trimmed.toLowerCase();
        
        if (lowered.startsWith('name: ')) {
            if (current && current.name && current.image) products.push(current);
            current = { name: trimmed.substring(6).trim(), price: 0, category: '', image: '', images: '[]', bulkPricing: '[]', sizes: '[]' };
        } else if (current) {
            if (lowered.startsWith('price: ')) current.price = parseInt(trimmed.substring(7).trim()) || 0;
            else if (lowered.startsWith('category: ')) current.category = trimmed.substring(10).trim();
            else if (lowered.startsWith('image: ')) current.image = trimmed.substring(7).trim();
            else if (lowered.startsWith('images: ')) current.images = trimmed.substring(8).trim();
            else if (lowered.startsWith('bulkpricing: ')) current.bulkPricing = trimmed.substring(13).trim();
            else if (lowered.startsWith('sizes: ')) current.sizes = trimmed.substring(7).trim();
        }
    });
    // Push last one
    if (current && current.name && current.image) products.push(current);

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
                    images: (p.images === '[]' || !p.images) ? JSON.stringify([p.image]) : p.images,
                    bulkPricing: (p.bulkPricing === 'Unknown' || !p.bulkPricing || p.bulkPricing === '[]') ? '[]' : p.bulkPricing,
                    sizes: (p.sizes === 'Unknown' || !p.sizes || p.sizes === '[]') ? '[]' : p.sizes,
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
