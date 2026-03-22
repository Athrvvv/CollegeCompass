import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listTables() {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
  `;
  console.log("Tables:", result.map(r => r.table_name).join(', '));
}

listTables().catch(console.error);
