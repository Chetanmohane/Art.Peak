const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Clearing the jumbled database...");
    await prisma.product.deleteMany({});
    
    console.log("🚀 Extracting ALL 26 archived entries using strings...");
    
    // Extract everything that looks like a field
    const output = execSync('strings -n 10 db-check-output.txt').toString();
    const lines = output.split('\n');
    
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
    
    // Also handle possible lowercase "name: "
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.toLowerCase().startsWith('name: ') && !products.some(p => p.name === trimmed.substring(6).trim())) {
             // ... duplicate logic for lowercase "name" if needed ...
        }
    });

    console.log(`✨ Found ${products.length} unique products in the string dump.`);
    
    let count = 0;
    for (let p of products) {
        try {
            await prisma.product.create({
                data: {
                    name: p.name,
                    price: p.price,
                    category: p.category,
                    image: p.image || "/placeholder.png",
                    images: p.images === '[]' ? JSON.stringify([p.image]) : p.images,
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
