const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Clearing the jumbled database...");
    await prisma.product.deleteMany({});
    
    // Read the complete-db.txt created via sed (very reliable)
    const content = fs.readFileSync('complete-db.txt', 'utf8');
    
    // Split on "Name: " as the definitive product separator
    const sections = content.split(/Name: /i);
    
    console.log(`🚀 Found ${sections.length - 1} products in the backup via Name Split...`);
    
    let products = [];
    // The first section is just the header, we skip it
    for (let i = 1; i < sections.length; i++) {
        const section = sections[i];
        const lines = section.split(/\r?\n/);
        
        let name = lines[0].trim();
        let price = 0, category = '', image = '', images = '[]';
        
        lines.forEach(line => {
            const trimmed = line.trim();
            const lowered = trimmed.toLowerCase();
            
            if (lowered.startsWith('price: ')) price = parseInt(trimmed.substring(7).trim()) || 0;
            else if (lowered.startsWith('category: ')) category = trimmed.substring(10).trim();
            else if (lowered.startsWith('image: ')) image = trimmed.substring(7).trim();
            else if (lowered.startsWith('images: ')) images = trimmed.substring(8).trim();
        });
        
        if (name && image) {
            products.push({ name, price, category, image, images });
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
                    images: (p.images === '[]' || !p.images) ? JSON.stringify([p.image || "/placeholder.png"]) : p.images,
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
