const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  try {
    const products = await prisma.product.findMany({ 
        take: 10,
        select: { name: true, image: true, images: true } 
    });
    let output = '--- PRODUCT IMAGE CHECK ---\n';
    products.forEach(p => {
        output += `Name: ${p.name}\n`;
        output += `Image: ${p.image}\n`;
        output += `Images: ${p.images}\n`;
        output += '---\n';
    });
    fs.writeFileSync('db-check-output.txt', output);
  } catch (err) {
    fs.writeFileSync('db-check-output.txt', 'Error: ' + err.message + '\n' + err.stack);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
