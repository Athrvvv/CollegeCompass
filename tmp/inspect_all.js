const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

async function inspectData() {
  const dbUrl = "postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-fancy-voice-adhx0bwf.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";
  const sql = neon(dbUrl);
  
  try {
    console.log("Listing all tables:");
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log(tables);

    console.log("\nSchema for cutoffs:");
    const cutoffsSchema = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'cutoffs'
    `;
    console.log(cutoffsSchema);

    console.log("\nSample row from cutoffs:");
    const row = await sql`SELECT * FROM cutoffs LIMIT 2`;
    console.log(row);

    // Save full cutoffs to file to parse
    const allCutoffs = await sql`SELECT * FROM cutoffs LIMIT 5000`;
    fs.writeFileSync('c:/college_compass/tmp/all_cutoffs.json', JSON.stringify(allCutoffs, null, 2));
    console.log("\nSaved all cutoffs to tmp/all_cutoffs.json. Total extracted:", allCutoffs.length);

  } catch (err) {
    console.error("Error analyzing:", err);
  }
}

inspectData();
