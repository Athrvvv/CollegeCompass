const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

async function analyzeCutoffs() {
  const dbUrl = "postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-fancy-voice-adhx0bwf.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";
  const sql = neon(dbUrl);
  
  try {
    console.log("Analyzing cutoffs data...");

    // 1. Get total count and distinct years
    const overall = await sql`SELECT COUNT(*) as total, array_agg(DISTINCT year) as years FROM cutoffs`;
    console.log("Overall Stats:", overall[0]);

    // 2. Check if there are any colleges with multiple years of data
    const collegesWithMultipleYears = await sql`
      SELECT c.college_id, col.college_name, COUNT(DISTINCT c.year) as year_count, array_agg(DISTINCT c.year) as years
      FROM cutoffs c
      JOIN colleges col ON c.college_id = col.college_id
      GROUP BY c.college_id, col.college_name
      HAVING COUNT(DISTINCT c.year) > 1
      LIMIT 5
    `;
    console.log(`\nColleges with multiple years (${collegesWithMultipleYears.length} found):`, collegesWithMultipleYears);

    // 3. Examine the actual cutoff values to see if they contain historical data encoded within them (e.g., JSON arrays)
    const sampleValues = await sql`
      SELECT cutoff_id, year, cutoff_value, cutoff_type 
      FROM cutoffs 
      LIMIT 10
    `;
    console.log("\nSample Cutoff Values:", sampleValues);

    // 4. Let's look for any cutoff_value that might not be a simple number
    const nonNumericValues = await sql`
      SELECT cutoff_id, cutoff_value 
      FROM cutoffs 
      WHERE cutoff_value !~ '^[0-9]+$' AND cutoff_value !~ '^[0-9]+\.[0-9]+$'
      LIMIT 5
    `;
    console.log(`\nNon-numeric cutoff values (${nonNumericValues.length} sample):`, nonNumericValues);

    // 5. Let's dump all data for a specific college to see exactly what's there for one institution
    const oneCollegeData = await sql`
      SELECT c.*, cou.course_name
      FROM cutoffs c
      JOIN colleges col ON c.college_id = col.college_id
      JOIN courses cou ON c.course_id = cou.course_id
      WHERE col.college_name ILIKE '%A.C.S. Medical College%'
      ORDER BY c.course_id, c.year
    `;
    console.log(`\nData for A.C.S. Medical College (${oneCollegeData.length} rows):`);
    console.log(oneCollegeData.slice(0, 5)); // print first 5

    // Save full dump for one college to file for deeper manual inspection if needed
    fs.writeFileSync('tmp/acs_cutoffs_dump.json', JSON.stringify(oneCollegeData, null, 2));
    console.log("\nSaved full dump for A.C.S. Medical College to tmp/acs_cutoffs_dump.json");

  } catch (err) {
    console.error("Error analyzing:", err);
  }
}

analyzeCutoffs();
