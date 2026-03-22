import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

async function checkLatestOTP() {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`
    SELECT auth_user_id, email_otp, phone_otp, updated_at 
    FROM user_profiles 
    ORDER BY updated_at DESC 
    LIMIT 5;
  `;
  fs.writeFileSync('tmp/db_check.json', JSON.stringify(result, null, 2));
}

checkLatestOTP().catch(console.error);
