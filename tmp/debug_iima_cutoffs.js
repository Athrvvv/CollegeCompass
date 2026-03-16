const { neon } = require('@neondatabase/serverless');

async function debugCutoffs() {
  const dbUrl = 'postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-wandering-waterfall-ad4507r5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
  const sql = neon(dbUrl);
  
  try {
    // Check IIM Ahmedabad (college_id 1288? no, wait, let's find IIMA id)
    const iima = await sql`SELECT college_id, college_name FROM colleges WHERE college_name ILIKE '%IIM%Ahmedabad%' LIMIT 1`;
    console.log("IIMA:", iima[0]);

    if (iima[0]) {
      const collegeId = iima[0].college_id;
      const sampleCutoffs = await sql`
        SELECT c.*, cou.course_name, e.name as exam_name
        FROM cutoffs c
        LEFT JOIN courses cou ON c.course_id = cou.course_id
        LEFT JOIN exams e ON c.exam_id = e.exam_id
        WHERE c.college_id = ${collegeId}
        LIMIT 5
      `;
      console.log("Sample Cutoffs for IIMA:", sampleCutoffs);
      
      const nonNumeric = await sql`
        SELECT cutoff_value, COUNT(*) 
        FROM cutoffs 
        WHERE college_id = ${collegeId} AND cutoff_value !~ '^[0-9]+$'
        GROUP BY cutoff_value
        LIMIT 10
      `;
      console.log("Non-numeric cutoffs for IIMA:", nonNumeric);
    }

  } catch (err) {
    console.error(err);
  }
}

debugCutoffs();
