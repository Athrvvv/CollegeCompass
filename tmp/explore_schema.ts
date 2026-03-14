import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon("postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-wandering-waterfall-ad4507r5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
  
  console.log("--- Tables ---");
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
  console.log(JSON.stringify(tables, null, 2));

  for (const table of tables) {
    console.log(`\n--- Columns in ${table.table_name} ---`);
    const columns = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = ${table.table_name}`;
    console.log(JSON.stringify(columns, null, 2));
  }
}

main().catch(console.error);
