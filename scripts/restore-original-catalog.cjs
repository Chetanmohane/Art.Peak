const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Clearing the jumbled database...");
    await prisma.product.deleteMany({});
    
    // Read the large file manually
    const content = fs.readFileSync('db-check-output.txt', 'utf8');
    
    // Split on ANY line that is just dashes!
    const sections = content.split(/[-]{10,}/m);
    
    console.log(`🚀 Found ${sections.length} potential product regions in the backup...`);
    
    let count = 0;
    for (const section of sections) {
        if (!section.includes('Name:')) continue;
        
        try {
            const lines = section.split('\n');
            let name = '', price = 0, category = '', image = '', images = '[]', bulkPricing = '[]', sizes = '[]';
            
            lines.forEach(line => {
                const trimmed = line.trim();
                if (trimmed.startsWith('Name: ')) name = trimmed.substring(6).trim();
                else if (trimmed.startsWith('Price: ')) price = parseInt(trimmed.substring(7).trim()) || 0;
                else if (trimmed.startsWith('Category: ')) category = trimmed.substring(10).trim();
                else if (trimmed.startsWith('Image: ')) image = trimmed.substring(7).trim();
                else if (trimmed.startsWith('Images: ')) images = trimmed.substring(8).trim();
                else if (trimmed.startsWith('BulkPricing: ')) bulkPricing = trimmed.substring(13).trim();
                else if (trimmed.startsWith('Sizes: ')) sizes = trimmed.substring(7).trim();
            });
            
            if (!name) continue;

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
            console.log(`✅ Restored ${count+1}: ${name}`);
            count++;
        } catch (e) {
            console.error(`❌ Failed to restore section: ${e.message}`);
        }
    }
    
    console.log(`\n✨ Successfully restored ${count} products to the exact "before" state.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
