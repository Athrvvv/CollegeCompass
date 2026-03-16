const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function check() {
  try {
    const tables = ['exams', 'courses', 'specializations', 'streams'];
    for (const table of tables) {
      const cols = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = ${table}
      `;
      console.log(`--- Columns in ${table} ---`);
      console.log(JSON.stringify(cols, null, 2));
    }
  } catch (err) {
    console.error(err);
  }
}

check();
