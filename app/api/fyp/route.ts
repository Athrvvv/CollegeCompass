import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/server"
import { neon } from "@neondatabase/serverless"

export async function GET(req: NextRequest) {
  const session = await auth.getSession();

  if (!session.data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // 1. Fetch User Profile
    const profiles = await sql`
      SELECT * FROM user_profiles WHERE auth_user_id = ${session.data.user.id} LIMIT 1
    `;
    const profile = profiles[0];

    if (!profile) {
      return NextResponse.json({ error: "Profile not found", needsOnboarding: true }, { status: 404 });
    }

    // 2. Fetch Colleges with detailed info for weighting
    // We'll fetch colleges and their ratings in one go
    const colleges = await sql`
      SELECT 
        c.*, 
        cr.infra, cr.academic, cr.faculty, cr.hostel, cr.placement,
        ARRAY(SELECT name FROM exams e JOIN college_exams ce ON e.exam_id = ce.exam_id WHERE ce.college_id = c.college_id) as accepted_exams,
        ARRAY(SELECT DISTINCT level FROM courses co JOIN college_courses cc ON co.course_id = cc.course_id WHERE cc.college_id = c.college_id) as course_levels
      FROM colleges c
      LEFT JOIN college_ratings cr ON c.college_id = cr.college_id AND cr.year = 2024
      LIMIT 100
    `;

    // 3. Recommendation Logic (Scoring)
    const scoredColleges = colleges.map((college: any) => {
      let score = 0;
      let reasons: string[] = [];

      // A. Level Matching Logic
      const q = profile.education_qualification;
      const targetLevels: string[] = [];
      if (q === "10th Standard") targetLevels.push("Diploma", "12th Standard");
      if (q === "12th Standard" || q === "Diploma") targetLevels.push("Undergraduate (UG)");
      if (q === "Undergraduate (UG)") targetLevels.push("Postgraduate (PG)");

      const levelMatch = college.course_levels.some((l: string) => targetLevels.includes(l));
      if (levelMatch) {
        score += 50;
        reasons.push(`Matches your ${q} background`);
      }

      // B. Exam Matching Logic
      const userExams = profile.exams_appeared || [];
      const userExamNames = userExams.map((e: any) => e.name);
      const examMatch = college.accepted_exams.some((e: string) => userExamNames.includes(e));
      if (examMatch) {
        score += 30;
        reasons.push("Accepts exams you've appeared for");
      }

      // C. Rating Logic
      const avgRating = (Number(college.infra) + Number(college.academic) + Number(college.faculty) + Number(college.placement)) / 4 || Number(college.rating);
      if (avgRating > 4) {
        score += 20;
        reasons.push("High student rating");
      }

      return {
        ...college,
        recommendationScore: score,
        recommendationReasons: reasons
      };
    });

    // Sort by score and return top results
    const recommendations = scoredColleges
      .filter((c: any) => c.recommendationScore > 0)
      .sort((a: any, b: any) => b.recommendationScore - a.recommendationScore)
      .slice(0, 15);

    return NextResponse.json(recommendations);
  } catch (error: any) {
    console.error("FYP Recommendation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
