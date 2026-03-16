"use server";

import { neon } from "@neondatabase/serverless";

export async function getCutoffs(search: string = "", page: number = 1, limit: number = 12) {
  const sql = neon(process.env.DATABASE_URL!);
  const offset = (page - 1) * limit;

  try {
    const searchPattern = `%${search}%`;
    
    // Core Query: Grouping by unique combination to get history arrays
    const data = await sql`
      SELECT 
        c.college_id,
        c.course_id,
        c.specialization_id,
        c.exam_id,
        c.category,
        col.college_name,
        cou.course_name,
        s.specialization_name,
        e.name as exam_name,
        json_agg(json_build_object('year', c.year, 'value', c.cutoff_value) ORDER BY c.year DESC) as history,
        MAX(c.year) as latest_year,
        (SELECT cutoff_value FROM cutoffs WHERE cutoff_id = MAX(c.cutoff_id)) as latest_value
      FROM cutoffs c
      JOIN colleges col ON c.college_id = col.college_id
      JOIN courses cou ON c.course_id = cou.course_id
      LEFT JOIN specializations s ON c.specialization_id = s.specialization_id
      JOIN exams e ON c.exam_id = e.exam_id
      WHERE REPLACE(col.college_name, '.', '') ILIKE ${searchPattern} 
         OR col.college_name ILIKE ${searchPattern}
         OR REPLACE(cou.course_name, '.', '') ILIKE ${searchPattern}
         OR cou.course_name ILIKE ${searchPattern}
         OR REPLACE(e.name, '.', '') ILIKE ${searchPattern}
         OR e.name ILIKE ${searchPattern}
      GROUP BY 
        c.college_id, c.course_id, c.specialization_id, c.exam_id, c.category,
        col.college_name, cou.course_name, s.specialization_name, e.name
      ORDER BY col.college_name, cou.course_name
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(DISTINCT (c.college_id, c.course_id, c.specialization_id, c.exam_id, c.category)) as count
      FROM cutoffs c
      JOIN colleges col ON c.college_id = col.college_id
      JOIN courses cou ON c.course_id = cou.course_id
      JOIN exams e ON c.exam_id = e.exam_id
      WHERE REPLACE(col.college_name, '.', '') ILIKE ${searchPattern} 
         OR col.college_name ILIKE ${searchPattern}
         OR REPLACE(cou.course_name, '.', '') ILIKE ${searchPattern}
         OR cou.course_name ILIKE ${searchPattern}
         OR REPLACE(e.name, '.', '') ILIKE ${searchPattern}
         OR e.name ILIKE ${searchPattern}
    `;

    return {
      data: data.map(item => ({
        ...item,
        id: `${item.college_id}-${item.course_id}-${item.specialization_id || "none"}-${item.exam_id}-${item.category}`
      })),
      totalCount: Number(countResult[0]?.count) || 0,
      totalPages: Math.ceil((Number(countResult[0]?.count) || 0) / limit),
      currentPage: page
    };
  } catch (error) {
    console.error("Failed to fetch cutoffs:", error);
    return { data: [], totalCount: 0, totalPages: 0, currentPage: 1 };
  }
}
