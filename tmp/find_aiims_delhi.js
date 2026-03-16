const { neon } = require('@neondatabase/serverless');
const dbUrl = 'postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-wandering-waterfall-ad4507r5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(dbUrl);

async function findAiimsDelhi() {
  const result = await sql`
    SELECT college_id, college_name, city, state 
    FROM colleges 
    WHERE college_name ILIKE '%AIIMS%' AND (city ILIKE '%Delhi%' OR state ILIKE '%Delhi%')
  `;
  console.log(result);
}

findAiimsDelhi();
