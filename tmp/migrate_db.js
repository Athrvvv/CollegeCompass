const { neon } = require('@neondatabase/serverless');

async function main() {
  const dbUrl = "postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-wandering-waterfall-ad4507r5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  const sql = neon(dbUrl);
  try {
    console.log("Creating user_profiles table...");
    await sql`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        auth_user_id UUID NOT NULL,
        first_name TEXT,
        middle_name TEXT,
        last_name TEXT,
        phone TEXT,
        phone_verified BOOLEAN DEFAULT FALSE,
        email TEXT,
        email_verified BOOLEAN DEFAULT FALSE,
        education_qualification TEXT,
        exams_appeared JSONB DEFAULT '[]'::jsonb,
        onboarding_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    console.log("Table created successfully.");

    console.log("Creating unique index on auth_user_id...");
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_auth_user_id ON user_profiles(auth_user_id);`;
    console.log("Index created.");

  } catch (e) {
    console.error('CRITICAL ERROR:', e.message);
  }
}

main();
