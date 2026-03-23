"use server";

import { neon } from "@neondatabase/serverless";

export interface TrendDataPoint {
  year: number;
  [category: string]: any; 
}

export interface CourseTrend {
  course_id: number;
  specialization_id: number | null;
  exam_id: number;
  course_name: string;
  specialization_name: string | null;
  exam_name: string;
  categories: string[];
  years: number[];
  data: TrendDataPoint[];
}

export interface CollegeTrendsResponse {
  college_id: number;
  college_name: string;
  courses: CourseTrend[];
}

export async function getCollegeCutoffsTrends(collegeId: number): Promise<CollegeTrendsResponse | null> {
  const dbUrl = process.env.DATABASE_URL!;
  const sql = neon(dbUrl);

  try {
    // 1. Fetch raw cutoff data for the specific college
    const rawData = await sql`
      SELECT 
        c.course_id,
        c.specialization_id,
        c.exam_id,
        c.category,
        c.year,
        c.cutoff_value,
        col.college_name,
        cou.course_name,
        s.specialization_name,
        e.name as exam_name
      FROM cutoffs c
      JOIN colleges col ON c.college_id = col.college_id
      LEFT JOIN courses cou ON c.course_id = cou.course_id
      LEFT JOIN specializations s ON c.specialization_id = s.specialization_id
      LEFT JOIN exams e ON c.exam_id = e.exam_id
      WHERE c.college_id = ${collegeId} 
      ORDER BY c.course_id, c.specialization_id, c.exam_id, c.year ASC
    `;

    if (!rawData || rawData.length === 0) {
      // Fallback: Fetch college name if no cutoffs found
      const colDetails = await sql`SELECT college_name FROM colleges WHERE college_id = ${collegeId}`;
      if (colDetails.length > 0) {
          return {
              college_id: collegeId,
              college_name: colDetails[0].college_name,
              courses: []
          };
      }
      return null;
    }

    const collegeName = rawData[0].college_name;

    // 2. Transform the flat rows into structured courses -> grouped years -> categories
    const coursesMap = new Map<string, CourseTrend>();

    rawData.forEach(row => {
      // Grouping key: Course + Specialization + Exam
      const key = `${row.course_id}-${row.specialization_id || 'none'}-${row.exam_id}`;
      
      if (!coursesMap.has(key)) {
        coursesMap.set(key, {
            course_id: row.course_id,
            specialization_id: row.specialization_id,
            exam_id: row.exam_id,
            course_name: row.course_name || "General Course",
            specialization_name: row.specialization_name,
            exam_name: row.exam_name || "Institutional Exam",
            categories: [], 
            years: [],      
            data: []        
        });
      }

      const courseGroup = coursesMap.get(key)!;

      // Add category to list if not present
      if (!courseGroup.categories.includes(row.category)) {
          courseGroup.categories.push(row.category);
      }
      
      // Add year to list if not present
      if (!courseGroup.years.includes(row.year)) {
          courseGroup.years.push(row.year);
      }

      // Find or create the data point for this specific year
      let dataPoint = courseGroup.data.find((d: any) => d.year === row.year);
      if (!dataPoint) {
          dataPoint = { year: row.year };
          courseGroup.data.push(dataPoint);
      }

      // Assign the cutoff value to the category key
      // Convert string "1543.5" to float
      const val = parseFloat(row.cutoff_value);
      if (!isNaN(val)) {
        dataPoint[row.category] = val;
      }
    });

    // 3. Finalize sorting and formatting
    const courses = Array.from(coursesMap.values()).map((course: CourseTrend) => {
        // Sort data chronologically for the line chart
        course.data.sort((a: any, b: any) => a.year - b.year);
        course.years.sort((a: number, b: number) => a - b);
        course.categories.sort();
        return course;
    });

    return JSON.parse(JSON.stringify({
      college_id: collegeId,
      college_name: collegeName,
      courses: courses
    }));

  } catch (error) {
    console.error("Failed to fetch college cutoff trends:", error);
    return null;
  }
}
