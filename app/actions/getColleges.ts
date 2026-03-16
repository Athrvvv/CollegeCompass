"use server";

import { neon } from "@neondatabase/serverless";

export async function getColleges() {

  const sql = neon(process.env.DATABASE_URL!);

  const data = await sql`
    SELECT 
      c.*,
      (SELECT p.highest_package FROM placements p WHERE p.college_id = c.college_id ORDER BY p.year DESC LIMIT 1) as latest_highest_package,
      (SELECT p.avg_package FROM placements p WHERE p.college_id = c.college_id ORDER BY p.year DESC LIMIT 1) as latest_avg_package,
      (SELECT r.infra FROM college_ratings r WHERE r.college_id = c.college_id ORDER BY r.year DESC LIMIT 1) as infra_rating,
      (SELECT r.academic FROM college_ratings r WHERE r.college_id = c.college_id ORDER BY r.year DESC LIMIT 1) as academic_rating,
      (
        SELECT COALESCE(json_agg(json_build_object('name', co.course_name, 'level', co.level, 'fee', cc.total_fees)), '[]'::json)
        FROM college_courses cc
        JOIN courses co ON cc.course_id = co.course_id
        WHERE cc.college_id = c.college_id
      ) as courses_data,
      (
        SELECT COALESCE(json_agg(e.name), '[]'::json)
        FROM college_exams ce
        JOIN exams e ON ce.exam_id = e.exam_id
        WHERE ce.college_id = c.college_id
      ) as exams_data,
      (
        SELECT COALESCE(json_agg(s.specialization_name), '[]'::json)
        FROM college_specializations cs
        JOIN specializations s ON cs.specialization_id = s.specialization_id
        WHERE cs.college_id = c.college_id
      ) as specializations_data,
      (
        SELECT COALESCE(json_agg(st.stream_name), '[]'::json)
        FROM college_courses cc
        JOIN courses co ON cc.course_id = co.course_id
        JOIN streams st ON co.stream_id = st.stream_id
        WHERE cc.college_id = c.college_id
      ) as streams_data
    FROM colleges c
    ORDER BY c.college_id
  `;

  return data;

}