const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function run() {
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'college_%'
    `;
    console.log("Tables:", JSON.stringify(tables, null, 2));

    for (const table of tables) {
      const columns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = ${table.table_name}
      `;
      console.log(`Columns for ${table.table_name}:`, JSON.stringify(columns, null, 2));
    }
  } catch (e) {
    console.error(e);
  }
}

run();
