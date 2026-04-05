const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    const content = fs.readFileSync('db-check-output.txt', 'utf8');
    
    // Split by "Name: " prefix to get individual product data
    const sections = content.split(/\nName: /);
    
    console.log("🧹 Clearing the jumbled database...");
    await prisma.product.deleteMany({});
    
    let count = 0;
    // The first section might be header info or contain the first product
    for (let i = 0; i < sections.length; i++) {
        let section = sections[i];
        if (i === 0 && !section.includes('Image:')) continue;
        
        try {
            // Restore "Name: " prefix for the first part of each section (except possibly the very first one)
            const lines = section.split('\n');
            let name = (i === 0 && section.includes('Name: ')) ? section.match(/Name: (.*)/)?.[1]?.trim() : lines[0].trim();
            let price = 0, category = '', image = '', images = '[]', bulkPricing = '[]', sizes = '[]';
            
            lines.forEach(line => {
                if (line.startsWith('Price: ')) price = parseInt(line.substring(7).trim()) || 0;
                if (line.startsWith('Category: ')) category = line.substring(10).trim();
                if (line.startsWith('Image: ')) image = line.substring(7).trim();
                if (line.startsWith('Images: ')) images = line.substring(8).trim();
                if (line.startsWith('BulkPricing: ')) bulkPricing = line.substring(13).trim();
                if (line.startsWith('Sizes: ')) sizes = line.substring(7).trim();
            });
            
            if (!name || (!image && !section.includes('Image: '))) continue;
            
            // Clean up name if it contains other fields
            if (name.includes('\r')) name = name.replace('\r', '');

            await prisma.product.create({
                data: {
                    name,
                    price,
                    category,
                    image: image || "/placeholder.png",
                    images: images === '[]' ? JSON.stringify([image]) : images,
                    bulkPricing: bulkPricing === 'Unknown' ? '[]' : bulkPricing,
                    sizes: sizes === 'Unknown' ? '[]' : sizes,
                    minQuantity: 1,
                    weight: 150,
                    length: 10,
                    breadth: 10,
                    height: 10,
                    inStock: true
                }
            });
            console.log(`✅ Restored: ${name}`);
            count++;
        } catch (e) {
            console.error(`❌ Failed to restore section ${i}: ${e.message}`);
        }
    }
    
    console.log(`\n✨ Successfully restored ${count} products to the exact "before" state.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
