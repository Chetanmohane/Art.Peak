import pkg from 'pg';
const { Client } = pkg;
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Manual .env parse since dotenv is missing
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

const client = new Client({
    connectionString: process.env.DATABASE_URL
});

async function main() {
    await client.connect();
    const res = await client.query('SELECT count(*) FROM "Service"');
    console.log('COUNT: ', res.rows[0].count);
    const rows = await client.query('SELECT title FROM "Service"');
    console.log('TITLES: ', rows.rows.map(r => r.title));
    await client.end();
}

main().catch(console.error);
