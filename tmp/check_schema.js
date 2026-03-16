const { neon } = require('@neondatabase/serverless');

async function main() {
  const dbUrl = "postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-fancy-voice-adhx0bwf.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";
  const sql = neon(dbUrl);
  try {
    console.log("Connect to DB...");
    
    const streamsCount = await sql`SELECT COUNT(*) FROM streams`;
    console.log(`Table streams count:`, streamsCount[0].count);

    const coursesCount = await sql`SELECT COUNT(*) FROM courses`;
    console.log(`Table courses count:`, coursesCount[0].count);

    const examsCount = await sql`SELECT COUNT(*) FROM exams`;
    console.log(`Table exams count:`, examsCount[0].count);

    const specsCount = await sql`SELECT COUNT(*) FROM specializations`;
    console.log(`Table specializations count:`, specsCount[0].count);

    const collSpecsCount = await sql`SELECT COUNT(*) FROM college_specializations`;
    console.log(`Table college_specializations count:`, collSpecsCount[0].count);

    if (specsCount[0].count > 0) {
        const sample = await sql`SELECT * FROM specializations LIMIT 2`;
        console.log(`Sample from specializations:`, JSON.stringify(sample, null, 2));
    }

    const joinCheck = await sql`
        SELECT 
            s.specialization_name, 
            COUNT(cs.college_id) as count
        FROM specializations s
        LEFT JOIN college_specializations cs ON s.specialization_id = cs.specialization_id
        GROUP BY s.specialization_id, s.specialization_name
        ORDER BY count DESC
        LIMIT 5
    `;
    console.log("\n--- Join Check (Specializations) ---");
    console.log(JSON.stringify(joinCheck, null, 2));

  } catch (e) {
    console.error('ERROR:', e.message);
  }
}

main();
