const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Clearing the jumbled database...");
    await prisma.product.deleteMany({});
    
    // Read the large file manually
    const content = fs.readFileSync('db-check-output.txt', 'utf8');
    
    // Split on ANY region of "Name: " (CASE INSENSITIVE)!
    const sections = content.split(/Name: /i);
    
    console.log(`🚀 Found ${sections.length - 1} potential product definitions in the backup...`);
    
    let count = 0;
    for (let i = 1; i < sections.length; i++) {
        const section = sections[i];
        try {
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
            
            if (!name) continue;

            // Handle the name possibly having been lowercase during the split
            // But Name: was the separator, so name is just the rest of the line.

            await prisma.product.create({
                data: {
                    name,
                    price,
                    category,
                    image: image || "/placeholder.png",
                    images: images === '[]' ? JSON.stringify([image]) : images,
                    bulkPricing: (bulkPricing === 'Unknown' || !bulkPricing) ? '[]' : bulkPricing,
                    sizes: (sizes === 'Unknown' || !sizes) ? '[]' : sizes,
                    minQuantity: 1,
                    weight: 150,
                    length: 10,
                    breadth: 10,
                    height: 10,
                    inStock: true
                }
            });
            console.log(`✅ Restored ${count+1}/${sections.length-1}: ${name}`);
            count++;
        } catch (e) {
            console.error(`❌ Failed to restore section ${i}: ${e.message}`);
        }
    }
    
    console.log(`\n✨ Successfully restored ${count} products to the exact "before" state.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
