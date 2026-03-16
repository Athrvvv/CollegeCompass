"use server";

import { neon } from "@neondatabase/serverless";

export async function getDiscoveryMeta() {
  const sql = neon(process.env.DATABASE_URL!);

  // Fetch unique streams with college counts and top courses
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

  // Fetch unique specializations with college counts
  const specializations = await sql`
    SELECT 
      s.specialization_name as name, 
      COUNT(DISTINCT cs.college_id) as count,
      COALESCE(
        (
          SELECT json_agg(c_sub.course_name)
          FROM (
            SELECT DISTINCT co.course_name
            FROM college_specializations cs2
            JOIN courses co ON cs2.course_id = co.course_id
            WHERE cs2.specialization_id = s.specialization_id
            LIMIT 2
          ) c_sub
        ),
        '[]'::json
      ) as sub_items
    FROM specializations s
    LEFT JOIN college_specializations cs ON s.specialization_id = cs.specialization_id
    GROUP BY s.specialization_id, s.specialization_name
    ORDER BY count DESC, name ASC
  `;

  // Fetch unique exams with college counts
  const exams = await sql`
    SELECT 
      e.name, 
      COUNT(DISTINCT ce.college_id) as count
    FROM exams e
    LEFT JOIN college_exams ce ON e.exam_id = ce.exam_id
    GROUP BY e.exam_id, e.name
    ORDER BY count DESC, e.name ASC
  `;

  // Fetch unique courses with college counts and metadata
  const courses = await sql`
    SELECT 
      c.course_name as name,
      c.level,
      c.duration_years as duration,
      COUNT(DISTINCT cc.college_id) as count,
      st.stream_name as stream
    FROM courses c
    LEFT JOIN streams st ON c.stream_id = st.stream_id
    LEFT JOIN college_courses cc ON c.course_id = cc.course_id
    GROUP BY c.course_id, c.course_name, c.level, c.duration_years, st.stream_name
    ORDER BY count DESC, name ASC
    LIMIT 100
  `;

  return {
    streams: streams || [],
    specializations: specializations || [],
    exams: exams || [],
    courses: courses || []
  };
}
