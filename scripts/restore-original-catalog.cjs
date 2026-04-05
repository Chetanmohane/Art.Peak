const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    const content = fs.readFileSync('db-check-output.txt', 'utf8');
    const sections = content.split('----------------------------------------');
    
    console.log("🧹 Clearing the jumbled database...");
    await prisma.product.deleteMany({});
    
    let count = 0;
    for (const section of sections) {
        if (!section.includes('Name:')) continue;
        
        try {
            const lines = section.split('\n');
            let name = '', price = 0, category = '', image = '', images = '[]', bulkPricing = '[]', sizes = '[]';
            
            lines.forEach(line => {
                if (line.startsWith('Name: ')) name = line.substring(6).trim();
                if (line.startsWith('Price: ')) price = parseInt(line.substring(7).trim()) || 0;
                if (line.startsWith('Category: ')) category = line.substring(10).trim();
                if (line.startsWith('Image: ')) image = line.substring(7).trim();
                if (line.startsWith('Images: ')) images = line.substring(8).trim();
                if (line.startsWith('BulkPricing: ')) bulkPricing = line.substring(13).trim();
                if (line.startsWith('Sizes: ')) sizes = line.substring(7).trim();
            });
            
            if (!name) continue;
            
            // Validate image (some might be base64, some paths)
            if (!image) {
                image = "/placeholder.png"; 
            }
            
            await prisma.product.create({
                data: {
                    name,
                    price,
                    category,
                    image,
                    images,
                    bulkPricing,
                    sizes,
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
            console.error(`❌ Failed to restore section: ${e.message}`);
        }
    }
    
    console.log(`\n✨ Successfully restored ${count} products to the exact "before" state.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
