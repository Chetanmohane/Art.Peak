const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    const content = fs.readFileSync('db-check-output.txt', 'utf8');
    const sections = content.split('---');
    
    const imageMap = new Map();
    
    sections.forEach(section => {
        const lines = section.trim().split('\n');
        let name = '';
        let image = '';
        let images = '';
        
        lines.forEach(line => {
            if (line.startsWith('Name: ')) name = line.substring(6).trim();
            if (line.startsWith('Image: ')) image = line.substring(7).trim();
            if (line.startsWith('Images: ')) images = line.substring(8).trim();
        });
        
        if (name && (image || images)) {
            imageMap.set(name, { image, images });
        }
    });

    console.log(`Loaded ${imageMap.size} products from backup.`);

    for (const [name, data] of imageMap.entries()) {
        const existing = await prisma.product.findFirst({
            where: { name: name }
        });
        
        if (existing) {
            console.log(`Restoring images for: ${name}`);
            await prisma.product.update({
                where: { id: existing.id },
                data: {
                    image: data.image || existing.image,
                    images: data.images || existing.images
                }
            });
        } else {
            console.log(`Re-adding missing product: ${name}`);
            await prisma.product.create({
                data: {
                    name: name,
                    image: data.image || "/placeholder.png",
                    images: data.images || "[]",
                    price: 0,
                    category: "Gifts",
                    bulkPricing: "[]",
                    sizes: "[]",
                    minQuantity: 1,
                    weight: 500,
                    length: 10,
                    breadth: 10,
                    height: 10,
                    inStock: true,
                    sortOrder: 999
                }
            });
        }
    }

    console.log("✅ Restoration complete!");
    await prisma.$disconnect();
}

main().catch(console.error);
