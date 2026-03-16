const { neon } = require('@neondatabase/serverless');

async function analyzeCorrectDatabase() {
  // Using the exact DATABASE_URL from .env.local
  const dbUrl = "postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-wandering-waterfall-ad4507r5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  const sql = neon(dbUrl);
  
  try {
    console.log("Analyzing cutoffs data in the CORRECT database...");

    // 1. Get total count and distinct years
    const overall = await sql`SELECT COUNT(*) as total, array_agg(DISTINCT year) as years FROM cutoffs`;
    console.log("Overall Stats:", overall[0]);

    // 2. Based on user screenshot: college_id=1288, course_id=14, specialization_id=62, exam_id=8
    console.log("\n--- Checking specific case from user screenshot ---");
    const specificCase = await sql`
      SELECT c.cutoff_id, c.college_id, c.course_id, c.specialization_id, c.exam_id, c.category, c.year, c.cutoff_value
      FROM cutoffs c
      WHERE c.college_id = 1288 
        AND c.course_id = 14 
        AND c.specialization_id = 62 
        AND c.exam_id = 8
      ORDER BY c.year DESC, c.category
    `;
    console.table(specificCase);

    // 3. Let's see how many colleges have historical data
    const historicalStats = await sql`
      SELECT c.college_id, COUNT(DISTINCT c.year) as num_years
      FROM cutoffs c
      GROUP BY c.college_id
      HAVING COUNT(DISTINCT c.year) > 1
    `;
    console.log(`\nColleges with historical data (multiple years): ${historicalStats.length}`);

    // 4. Examine different categories available
    const categories = await sql`SELECT DISTINCT category FROM cutoffs`;
    console.log("\nDistinct Categories in the database:", categories.map(c => c.category));

  } catch (err) {
    console.error("Error analyzing:", err);
  }
}

analyzeCorrectDatabase();
