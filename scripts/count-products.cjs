const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();
async function main() {
    console.log(await prisma.product.count());
    await prisma.$disconnect();
}
main();
