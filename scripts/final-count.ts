import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.service.count();
    console.log('DATABASE SERVICE COUNT: ', count);
    const all = await prisma.service.findMany({ select: { title: true } });
    console.log('TITLES: ', all.map(s => s.title));
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
