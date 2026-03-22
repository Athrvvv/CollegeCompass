import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkLatestOTP() {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`
    SELECT auth_user_id, email_otp, phone_otp, updated_at 
    FROM user_profiles 
    ORDER BY updated_at DESC 
    LIMIT 5;
  `;
  console.log(JSON.stringify(result, null, 2));
}

checkLatestOTP().catch(console.error);
