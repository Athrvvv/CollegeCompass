import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function migrate() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    await sql`
      ALTER TABLE user_profiles
      ADD COLUMN IF NOT EXISTS email_otp varchar(10),
      ADD COLUMN IF NOT EXISTS phone_otp varchar(10),
      ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false;
    `;
    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

migrate();
