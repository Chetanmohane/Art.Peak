import pkg from 'pg';
const { Client } = pkg;
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const client = new Client({
    connectionString: process.env.POSTGRES_URL
});

async function main() {
    try {
        console.log("🚀 Checking Postgres for products...");
        await client.connect();
        
        // Check if Product table exists
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'Product'
            );
        `);
        
        if (tableCheck.rows[0].exists) {
            const count = await client.query('SELECT count(*) FROM "Product"');
            console.log(`Found Product table with ${count.rows[0].count} entries!`);
            
            const products = await client.query('SELECT name FROM "Product" LIMIT 10');
            console.log("Sample names:", products.rows.map(r => r.name));
        } else {
            console.log("Product table NOT found in Postgres.");
        }
        
    } catch (e: any) {
        console.error("Postgres error:", e.message);
    } finally {
        await client.end();
        process.exit(0);
    }
}

main();
