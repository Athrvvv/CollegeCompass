import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

async function listProfiles() {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`
    SELECT auth_user_id, first_name, last_name, email_verified, updated_at 
    FROM user_profiles 
    LIMIT 20;
  `;
  fs.writeFileSync('tmp/profiles_list.json', JSON.stringify(result, null, 2));
}

listProfiles().catch(console.error);
