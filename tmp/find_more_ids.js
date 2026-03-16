const { neon } = require('@neondatabase/serverless');
const dbUrl = 'postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-wandering-waterfall-ad4507r5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(dbUrl);

async function findMoreIds() {
  const iims_cutoff = await sql`SELECT COUNT(*) FROM cutoffs WHERE college_id = 1111`;
  console.log("IIMS (1111) cutoffs:", iims_cutoff[0]);

  const aiims = await sql`SELECT college_id, college_name, city FROM colleges WHERE college_name ILIKE '%AIIMS%' LIMIT 5`;
  console.log("AIIMS results:", aiims);
  
  if (aiims.length > 0) {
      const aiims_id = aiims[0].college_id;
      const aiims_cutoff = await sql`SELECT COUNT(*) FROM cutoffs WHERE college_id = ${aiims_id}`;
      console.log(`AIIMS (${aiims_id}) cutoffs:`, aiims_cutoff[0]);
  }
}

findMoreIds();
