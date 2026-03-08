
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const products = await prisma.product.findMany({ take: 1 });
        console.log('Successfully queried products:', products);
        process.exit(0);
    } catch (e) {
        console.error('Error querying products:', e);
        process.exit(1);
    }
}

main();
