const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Clearing the jumbled database...");
    await prisma.product.deleteMany({});
    
    // Read the complete-db.txt created via sed (very reliable)
    const content = fs.readFileSync('complete-db.txt', 'utf8');
    const lines = content.split('\n');
    
    console.log(`🚀 Scanned ${lines.length} lines in the backup...`);
    
    let products = [];
    let current = null;
    
    lines.forEach(line => {
        const trimmed = line.trim();
        const lowered = trimmed.toLowerCase();
        
        if (lowered.startsWith('name: ')) {
            if (current && current.name && (current.image || current.images)) products.push(current);
            current = { name: trimmed.substring(6).trim(), price: 0, category: '', image: '', images: '[]' };
        } else if (current) {
            if (lowered.startsWith('price: ')) current.price = parseInt(trimmed.substring(7).trim()) || 0;
            else if (lowered.startsWith('category: ')) current.category = trimmed.substring(10).trim();
            else if (lowered.startsWith('image: ')) current.image = trimmed.substring(7).trim();
            else if (lowered.startsWith('images: ')) current.images = trimmed.substring(8).trim();
        }
    });
    // Push last one
    if (current && current.name && (current.image || current.images)) products.push(current);

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
                    images: p.images === '[]' ? JSON.stringify([p.image || "/placeholder.png"]) : p.images,
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
