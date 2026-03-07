import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL as string
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    try {
        const p = await prisma.product.findMany();
        console.log("Current Products in DB:");
        p.forEach(prod => {
            console.log(`- ${prod.name}: Main Image: ${prod.image.substring(0, 50)}...`);
        });
    } catch (e: any) {
        console.error("DB Error:", e.message);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}
main();
