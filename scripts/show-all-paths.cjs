const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();
async function main() {
    const products = await prisma.product.findMany({ select: { name: true, image: true } });
    products.forEach(p => {
        console.log(`Name: "${p.name}" | Image: ${p.image.substring(0, 30)}`);
    });
}
main();
