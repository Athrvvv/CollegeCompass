require('dotenv').config({path: '.env.local'});
const { neon } = require('@neondatabase/serverless');
(async () => {
  const sql = neon(process.env.DATABASE_URL);
  const streams = await sql`
    SELECT s.stream_name as name, COUNT(DISTINCT cc.college_id) as count 
    FROM streams s 
    LEFT JOIN courses c ON s.stream_id = c.stream_id 
    LEFT JOIN college_courses cc ON c.course_id = cc.course_id 
    GROUP BY s.stream_id, s.stream_name 
    LIMIT 1
  `;
  console.log(JSON.stringify(streams));
})();
