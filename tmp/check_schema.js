const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function run() {
  try {
    const columns = await sql`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name IN ('colleges', 'courses', 'exams', 'streams') 
      ORDER BY table_name, ordinal_position
    `;
    console.log(JSON.stringify(columns, null, 2));
  } catch (e) {
    console.error(e);
  }
}

run();
