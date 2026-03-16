const { neon } = require('@neondatabase/serverless');

async function debugCutoffs() {
  const dbUrl = 'postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-wandering-waterfall-ad4507r5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
  const sql = neon(dbUrl);
  
  try {
    const iima = await sql`SELECT college_id, college_name FROM colleges WHERE college_name ILIKE '%IIM%Ahmedabad%' LIMIT 1`;
    console.log("IIMA ID:", iima[0]?.college_id);

    if (iima[0]) {
      const types = await sql`
        SELECT cutoff_type, COUNT(*) 
        FROM cutoffs 
        WHERE college_id = ${iima[0].college_id} 
        GROUP BY cutoff_type
      `;
      console.log("Cutoff Types for IIMA:", types);

      const sampleValues = await sql`
        SELECT cutoff_value 
        FROM cutoffs 
        WHERE college_id = ${iima[0].college_id} 
        LIMIT 10
      `;
      console.log("Sample Cutoff Values for IIMA:", sampleValues);
    }
  } catch (err) {
    console.error(err);
  }
}

debugCutoffs();
