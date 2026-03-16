const { neon } = require('@neondatabase/serverless');

async function main() {
  const dbUrl = "postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-fancy-voice-adhx0bwf.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";
  const sql = neon(dbUrl);
  try {
    console.log("Searching for 'Memorial' in cutoffs...");
    const data = await sql`
      SELECT DISTINCT col.college_name 
      FROM cutoffs c 
      JOIN colleges col ON c.college_id = col.college_id 
      WHERE col.college_name ILIKE '%memorial%'
    `;
    console.log("Colleges found:", JSON.stringify(data, null, 2));

    console.log("\nChecking year distribution...");
    const years = await sql`SELECT year, COUNT(*) FROM cutoffs GROUP BY year ORDER BY year`;
    console.log("Years found:", JSON.stringify(years, null, 2));

    console.log("\nSample for A.C.S. Medical College...");
    const acs = await sql`
      SELECT c.year, c.cutoff_value 
      FROM cutoffs c 
      JOIN colleges col ON c.college_id = col.college_id 
      WHERE col.college_name ILIKE '%A.C.S. Medical College%'
      LIMIT 10
    `;
    console.log("ACS data:", JSON.stringify(acs, null, 2));

  } catch (e) {
    console.error('ERROR:', e.message);
  }
}

main();
