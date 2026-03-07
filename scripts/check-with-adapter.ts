import pkg from 'pg';
const { Client } = pkg;
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Manual .env parse since dotenv might not be working as expected in some environments
try {
    const envFile = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
    const lines = envFile.split('\n');
    for (const line of lines) {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim().replace(/^"|"$/g, '');
        }
    }
} catch (e) {
    console.error('.env not found or error loading it');
}

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const pool = new Client({ connectionString })

async function main() {
    await pool.connect();
    const adapter = new PrismaPg(pool as any)
    const prisma = new PrismaClient({ adapter })

    const count = await prisma.service.count();
    console.log('--- DB CHECK ---');
    console.log('Count: ', count);
    const all = await prisma.service.findMany();
    console.log('Services: ', all.map(s => s.title));

    await pool.end();
}

main().catch(console.error);
