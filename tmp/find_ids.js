const { neon } = require('@neondatabase/serverless');
const dbUrl = 'postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-wandering-waterfall-ad4507r5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(dbUrl);

async function findIds() {
  const ids = await sql`
    SELECT college_id, college_name 
    FROM colleges 
    WHERE college_name ILIKE '%AIIMS%New%Delhi%' 
       OR college_name ILIKE '%IIM%Ahmedabad%'
  `;
  console.log(ids);
}

findIds();
