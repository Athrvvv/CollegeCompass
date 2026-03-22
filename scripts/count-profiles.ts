import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function countProfiles() {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`SELECT count(*) FROM user_profiles;`;
  console.log("Total Profiles:", result[0].count);
}

countProfiles().catch(console.error);
