"use server"

import { neon } from "@neondatabase/serverless"

export async function getColleges(page: number = 1, limit: number = 9, search: string = "") {
  const sql = neon(process.env.DATABASE_URL!)
  let colleges: any[] = []
  let totalCount = 0

  try {
    const offset = Math.max(0, (page - 1) * limit)

    if (search) {
      const qs = `%${search}%`
      colleges = await sql`
        SELECT 
          c.*,
          (SELECT p.highest_package FROM placements p WHERE p.college_id = c.college_id ORDER BY p.year DESC LIMIT 1) as highest_package,
          (SELECT p.avg_package FROM placements p WHERE p.college_id = c.college_id ORDER BY p.year DESC LIMIT 1) as avg_package,
          (
            SELECT COALESCE(json_agg(e.name), '[]'::json)
            FROM (
              SELECT ex.name
              FROM college_exams ce
              JOIN exams ex ON ce.exam_id = ex.exam_id
              WHERE ce.college_id = c.college_id
              LIMIT 3
            ) e
          ) as top_exams
        FROM colleges c
        WHERE c.college_name ILIKE ${qs} OR c.city ILIKE ${qs} OR c.state ILIKE ${qs}
        ORDER BY c.college_id
        LIMIT ${limit} OFFSET ${offset}
      `
      const countResult = await sql`
        SELECT COUNT(*) as count
        FROM colleges c
        WHERE c.college_name ILIKE ${qs} OR c.city ILIKE ${qs} OR c.state ILIKE ${qs}
      `
      totalCount = Number(countResult[0]?.count) || 0
    } else {
      colleges = await sql`
        SELECT 
          c.*,
          (SELECT p.highest_package FROM placements p WHERE p.college_id = c.college_id ORDER BY p.year DESC LIMIT 1) as highest_package,
          (SELECT p.avg_package FROM placements p WHERE p.college_id = c.college_id ORDER BY p.year DESC LIMIT 1) as avg_package,
          (
            SELECT COALESCE(json_agg(e.name), '[]'::json)
            FROM (
              SELECT ex.name
              FROM college_exams ce
              JOIN exams ex ON ce.exam_id = ex.exam_id
              WHERE ce.college_id = c.college_id
              LIMIT 3
            ) e
          ) as top_exams
        FROM colleges c
        ORDER BY c.college_id
        LIMIT ${limit} OFFSET ${offset}
      `
      const countResult = await sql`
        SELECT COUNT(*) as count
        FROM colleges
      `
      totalCount = Number(countResult[0]?.count) || 0
    }

  } catch (error) {
    console.error("Database query failed:", error)
  }

  const totalPages = Math.ceil(totalCount / limit)

  return { 
    colleges, 
    currentPage: page,
    totalPages,
    totalCount 
  }
}

export async function getCollegeDetails(collegeId: number) {
  const sql = neon(process.env.DATABASE_URL!)
  
  try {
    const [ratings, courses, placements, cutoffs] = await Promise.all([
      // Ratings for the specific college
      sql`SELECT hostel, academic, faculty, infra, placement, year FROM college_ratings WHERE college_id = ${collegeId} ORDER BY year DESC LIMIT 1`,
      
      // Top 5 courses with fees and eligibility
      sql`
        SELECT c.course_name, c.level, c.duration_years, cc.total_fees, cc.base_eligibility
        FROM college_courses cc
        JOIN courses c ON cc.course_id = c.course_id
        WHERE cc.college_id = ${collegeId}
        LIMIT 5
      `,
      
      // Historical Placements
      sql`SELECT highest_package, lowest_package, avg_package, year FROM placements WHERE college_id = ${collegeId} ORDER BY year DESC LIMIT 3`,
      
      // Recent Cutoffs
      sql`
        SELECT c.course_name, e.name as exam_name, cu.category, cu.year, cu.cutoff_type, cu.cutoff_value
        FROM cutoffs cu
        JOIN courses c ON cu.course_id = c.course_id
        JOIN exams e ON cu.exam_id = e.exam_id
        WHERE cu.college_id = ${collegeId}
        ORDER BY cu.year DESC
        LIMIT 5
      `
    ])

    return {
      ratings: ratings[0] || null,
      courses,
      placements,
      cutoffs
    }
  } catch (error) {
    console.error("Failed to fetch college details:", error)
    return null
  }
}
export async function getCollegeById(collegeId: number) {
  const sql = neon(process.env.DATABASE_URL!)
  
  try {
    const colleges = await sql`
      SELECT 
        c.*,
        (SELECT p.highest_package FROM placements p WHERE p.college_id = c.college_id ORDER BY p.year DESC LIMIT 1) as highest_package,
        (SELECT p.avg_package FROM placements p WHERE p.college_id = c.college_id ORDER BY p.year DESC LIMIT 1) as avg_package,
        (
          SELECT COALESCE(json_agg(e.name), '[]'::json)
          FROM (
            SELECT ex.name
            FROM college_exams ce
            JOIN exams ex ON ce.exam_id = ex.exam_id
            WHERE ce.college_id = c.college_id
            LIMIT 3
          ) e
        ) as top_exams
      FROM colleges c
      WHERE c.college_id = ${collegeId}
    `
    return colleges[0] || null
  } catch (error) {
    console.error("Failed to fetch college by id:", error)
    return null
  }
}
