import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function migrate() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    await sql`
      ALTER TABLE user_profiles
      ADD COLUMN IF NOT EXISTS user_rank integer,
      ADD COLUMN IF NOT EXISTS category varchar(50),
      ADD COLUMN IF NOT EXISTS gender varchar(20),
      ADD COLUMN IF NOT EXISTS state_of_eligibility varchar(100),
      ADD COLUMN IF NOT EXISTS pwd_status boolean DEFAULT false;
    `;
    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

migrate();
