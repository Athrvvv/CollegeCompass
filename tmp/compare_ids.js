const { neon } = require('@neondatabase/serverless');
const oldDb = 'postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-fancy-voice-adhx0bwf.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';
const newDb = 'postgresql://neondb_owner:npg_2LksMfGKzm7U@ep-wandering-waterfall-ad4507r5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function compare() {
  const sqlOld = neon(oldDb);
  const sqlNew = neon(newDb);

  const oldIIMA = await sqlOld`SELECT college_id, college_name FROM colleges WHERE college_name ILIKE '%IIM%Ahmedabad%'`;
  const newIIMA = await sqlNew`SELECT college_id, college_name FROM colleges WHERE college_name ILIKE '%IIM%Ahmedabad%'`;

  console.log("OLD IIMA:", oldIIMA);
  console.log("NEW IIMA:", newIIMA);
}

compare();
