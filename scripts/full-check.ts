import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function main() {
    const productsCount = await prisma.product.count();
    const offersCount = await prisma.offer.count();
    const servicesCount = await prisma.service.count();
    
    console.log('--- DATABASE COUNTS ---');
    console.log('Product Count: ', productsCount);
    console.log('Offer Count:   ', offersCount);
    console.log('Service Count: ', servicesCount);
    
    await prisma.$disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
