import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const connectionString = process.env.DATABASE_URL as string
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    try {
        const users = await prisma.user.findMany();
        console.log('USERS_LIST_START');
        console.log(JSON.stringify(users, null, 2));
        console.log('USERS_LIST_END');
    } catch (e: any) {
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}
main();
