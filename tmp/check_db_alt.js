const { neon } = require('@neondatabase/serverless');

async function main() {
  // Trying to use the host from NEON_AUTH_URL with the password from DATABASE_URL
  const dbUrl = "postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-fancy-voice-adhx0bwf.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";
  const sql = neon(dbUrl);
  try {
    console.log("Connect to alternative DB host...");
    const schemas = await sql`SELECT schema_name FROM information_schema.schemata`;
    console.log("Schemas found:", JSON.stringify(schemas, null, 2));

    const tables = await sql`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'neon_auth'
    `;
    console.log("Auth tables:", JSON.stringify(tables, null, 2));

    if (tables.length > 0) {
      for (const table of tables) {
        console.log(`\n--- Columns in neon_auth.${table.table_name} ---`);
        const columns = await sql`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_schema = 'neon_auth' AND table_name = ${table.table_name}
        `;
        console.log(JSON.stringify(columns, null, 2));
      }
    }
  } catch (e) {
    console.error('CRITICAL ERROR:', e.message);
  }
}

main();
