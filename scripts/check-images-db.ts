import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({ 
        take: 5,
        select: { name: true, image: true, images: true } 
    });
    console.log('--- PRODUCT IMAGE CHECK ---');
    products.forEach(p => {
        console.log(`Name: ${p.name}`);
        console.log(`Image: ${p.image}`);
        console.log(`Images: ${p.images}`);
        console.log('---');
    });
    
    await prisma.$disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
