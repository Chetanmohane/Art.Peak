const { PrismaClient } = require('@prisma/client');
const { spawn } = require('child_process');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Clearing the jumbled database...");
    await prisma.product.deleteMany({});
    
    console.log("🚀 Extracting ALL entries via Streamed Strings Extraction...");
    
    // Spawn strings process and read continuously to avoid buffer issues
    const strings = spawn('strings', ['-n', '10', 'db-check-output.txt']);
    let leftovers = '';
    let products = [];
    let current = null;

    strings.stdout.on('data', (data) => {
        const lines = (leftovers + data.toString()).split('\n');
        leftovers = lines.pop(); // Save incomplete line
        
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
    });

    await new Promise((resolve) => {
        strings.on('close', () => {
            if (current && current.name && current.image) products.push(current);
            resolve();
        });
    });

    console.log(`✨ Found ${products.length} products to restore.`);
    
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
