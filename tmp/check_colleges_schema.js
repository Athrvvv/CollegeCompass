const { neon } = require('@neondatabase/serverless');

async function checkSchema() {
  const dbUrl = 'postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-wandering-waterfall-ad4507r5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
  const sql = neon(dbUrl);
  
  try {
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'colleges'
    `;
    console.log("Colleges Columns:", columns.map(c => c.column_name));

    const sample = await sql`SELECT * FROM colleges LIMIT 1`;
    console.log("Sample College:", sample[0]);

    // Check if IIMA or AIIMS has data in cutoffs
    const iimCutoffs = await sql`
      SELECT COUNT(*) 
      FROM cutoffs c
      JOIN colleges col ON c.college_id = col.college_id
      WHERE col.college_name ILIKE '%IIM%'
    `;
    console.log("IIM Cutoffs Count:", iimCutoffs[0]);

    const aiimsCutoffs = await sql`
      SELECT COUNT(*) 
      FROM cutoffs c
      JOIN colleges col ON c.college_id = col.college_id
      WHERE col.college_name ILIKE '%AIIMS%'
    `;
    console.log("AIIMS Cutoffs Count:", aiimsCutoffs[0]);

  } catch (err) {
    console.error(err);
  }
}

checkSchema();
