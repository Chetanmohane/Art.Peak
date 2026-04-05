const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.product.count();
    const products = await prisma.product.findMany({ 
        select: { name: true, image: true, images: true } 
    });
    console.log(`Total products: ${count}`);
    products.forEach(p => {
        const hasImage = p.image ? 'YES' : 'NO';
        const imagesCount = p.images ? (JSON.parse(p.images).length) : 0;
        console.log(`Name: ${p.name} | Has Image: ${hasImage} | Images Count: ${imagesCount} | Image Type: ${p.image?.startsWith('data:') ? 'BASE64' : 'PATH/URL'}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
