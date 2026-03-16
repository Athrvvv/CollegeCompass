const { neon } = require('@neondatabase/serverless');

async function main() {
  const dbUrl = "postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-fancy-voice-adhx0bwf.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";
  const sql = neon(dbUrl);
  try {
    console.log("Connect to DB...");
    
    const years = await sql`SELECT DISTINCT year FROM cutoffs ORDER BY year`;
    console.log('Years found:', JSON.stringify(years, null, 2));

    const categories = await sql`SELECT DISTINCT category FROM cutoffs ORDER BY category`;
    console.log('Categories found:', JSON.stringify(categories, null, 2));

    const multiYearCheck = await sql`SELECT COUNT(*) FROM cutoffs WHERE year != 2025`;
    console.log('Count of records NOT in 2025:', multiYearCheck[0].count);

    const count = await sql`SELECT COUNT(*) FROM cutoffs`;
    console.log('Total Count:', count[0].count);

  } catch (e) {
    console.error('ERROR:', e.message);
  }
}

main();
