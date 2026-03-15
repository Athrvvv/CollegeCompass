const { neon } = require('@neondatabase/serverless');

async function main() {
  const dbUrl = "postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-wandering-waterfall-ad4507r5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  const sql = neon(dbUrl);
  try {
    console.log("Searching for 'user' or 'auth' tables...");
    const tables = await sql`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name ILIKE '%user%' OR table_name ILIKE '%auth%'
      OR table_schema ILIKE '%auth%'
    `;
    console.log(JSON.stringify(tables, null, 2));

  } catch (e) {
    console.error('CRITICAL ERROR:', e);
  }
}

main();
