import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({ select: { name: true, price: true, category: true, sortOrder: true } });
    console.log(JSON.stringify(products, null, 2));
    await prisma.$disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
