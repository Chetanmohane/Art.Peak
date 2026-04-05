const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  try {
    const products = await prisma.product.findMany({ 
        take: 20,
        select: { name: true, image: true } 
    });
    products.forEach(p => {
        console.log(`Name: ${p.name} | Image: ${p.image.substring(0, 50)}${p.image.length > 50 ? '...' : ''}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
