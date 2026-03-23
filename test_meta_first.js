require('dotenv').config({path: '.env.local'});
const { neon } = require('@neondatabase/serverless');

async function test() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const streams = await sql`
      SELECT 
        s.stream_name as name, 
        COUNT(DISTINCT cc.college_id) as count,
        COALESCE(
          (
            SELECT json_agg(c_sub.course_name)
            FROM (
              SELECT DISTINCT course_name 
              FROM courses 
              WHERE stream_id = s.stream_id 
              LIMIT 3
            ) c_sub
          ),
          '[]'::json
        ) as sub_items
      FROM streams s
      LEFT JOIN courses c ON s.stream_id = c.stream_id
      LEFT JOIN college_courses cc ON c.course_id = cc.course_id
      GROUP BY s.stream_id, s.stream_name
      ORDER BY count DESC, name ASC
    `;
    console.log("first stream:", streams[0]);
  } catch (e) {
    console.error("Error:", e.message);
  }
}

test();
