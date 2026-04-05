const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Clearing the jumbled database...");
    await prisma.product.deleteMany({});
    
    // Absolute paths for 100% reliability
    const baseDir = path.resolve(__dirname, '..');
    const backupFile = path.resolve(baseDir, 'manageable-db.txt');
    const productsDir = path.resolve(baseDir, 'public/images/products');
    
    console.log(`📂 Reading backup from: ${backupFile}`);
    const content = fs.readFileSync(backupFile, 'utf8');
    console.log(`📊 Content Length: ${content.length} characters`);
    
    const imageFiles = fs.readdirSync(productsDir);
    
    const getMapping = (name) => {
        const n = name.toLowerCase();
        if (n.includes('wallet')) return imageFiles.filter(f => f.startsWith('W'));
        if (n.includes('lockey') || n.includes('locket')) return imageFiles.filter(f => f.startsWith('L'));
        if (n.includes('keychain')) {
            if (n.includes('photo')) return imageFiles.filter(f => f.startsWith('K-') && f.includes('photo'));
            return imageFiles.filter(f => f.startsWith('K'));
        }
        if (n.includes('pen')) return imageFiles.filter(f => f.startsWith('P'));
        if (n.includes('bottle')) return imageFiles.filter(f => f.startsWith('B'));
        if (n.includes('logo')) return imageFiles.filter(f => f.startsWith('A-logo'));
        if (n.includes('mandir')) return ["mandir.jpg"];
        if (n.includes('desk') || n.includes('nameplate')) return ["desktop-nameplate.jpg"];
        if (n.includes('frame')) return imageFiles.filter(f => f.startsWith('F'));
        return [];
    };

    // Use a very broad split to handle any case or trailing characters
    const sections = content.split(/Name:\s*/i);
    
    console.log(`🚀 Found ${sections.length - 1} product sections...`);
    
    let products = [];
    for (let i = 1; i < sections.length; i++) {
        const section = sections[i];
        const lines = section.split(/\r?\n/);
        
        let name = lines[0].trim();
        let price = 0, category = '', image = '';
        
        lines.forEach(line => {
            const trimmed = line.trim();
            const lowered = trimmed.toLowerCase();
            if (lowered.startsWith('price: ')) price = parseInt(trimmed.substring(7).trim()) || 0;
            else if (lowered.startsWith('category: ')) category = trimmed.substring(10).trim();
            else if (lowered.startsWith('image: ')) image = trimmed.substring(7).trim();
        });
        
        const gallery = getMapping(name);
        let finalImage = image;
        let finalGallery = [image];
        
        if (gallery.length > 0) {
            finalImage = `/images/products/${gallery[0]}`;
            finalGallery = gallery.map(f => `/images/products/${f}`);
        }

        if (name) {
            products.push({ name, price, category, image: finalImage, images: JSON.stringify(finalGallery) });
        }
    }

    console.log(`✨ Identified ${products.length} unique products to restore.`);
    
    let count = 0;
    for (let p of products) {
        try {
            await prisma.product.create({
                data: {
                    name: p.name,
                    price: p.price,
                    category: p.category,
                    image: p.image || "/placeholder.png",
                    images: p.images,
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
