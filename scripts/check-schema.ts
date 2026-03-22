import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkSchema() {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'user_profiles';
  `;
  console.log(result.map(r => r.column_name).join(', '));
}

checkSchema().catch(console.error);
