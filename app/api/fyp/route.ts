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
      let profileScore = 0;
      let examScore = 0;
      let qualityScore = 0;
      let reasons: string[] = [];

      // A. Profile Match (Max 50%)
      const q = profile.education_qualification;
      const targetLevels: string[] = [];
      if (q === "10th Standard") targetLevels.push("Diploma", "12th Standard");
      if (q === "12th Standard" || q === "Diploma") targetLevels.push("Undergraduate (UG)");
      if (q === "Undergraduate (UG)") targetLevels.push("Postgraduate (PG)");

      // 1. Academic Level Match (25%)
      const levelMatch = college.course_levels?.some((l: string) => targetLevels.includes(l));
      if (levelMatch) {
        profileScore += 25;
        reasons.push(`${college.course_levels.join("/")} courses available`);
      }

      // 2. Geographic Match (15%)
      if (college.state === profile.state_of_eligibility) {
        profileScore += 15;
        reasons.push(`In your preferred state (${profile.state_of_eligibility})`);
      }

      // 3. Institutional Type/Preference (10%)
      if (college.typeofuni === "Public" || college.typeofuni === "Government") {
        profileScore += 10;
        reasons.push("Highly reputed public institution");
      } else if (college.typeofuni === "Private" && profile.category === "General") {
        profileScore += 5; // Slight boost for private if general category?
      }

      // B. Exam Match (Max 30%)
      const userExams = Array.isArray(profile.exams_appeared) ? profile.exams_appeared : (typeof profile.exams_appeared === 'string' ? JSON.parse(profile.exams_appeared) : []);
      const userExamNames = userExams.map((e: any) => e.name);
      const matchingExams = college.accepted_exams?.filter((e: string) => userExamNames.includes(e)) || [];
      
      if (matchingExams.length > 0) {
        // Linear scaling: if college accepts at least one of user's exams
        examScore = 30;
        reasons.push(`Accepts ${matchingExams.join(", ")}`);
      }

      // C. Quality Score (Max 20%)
      const infra = Number(college.infra) || 0;
      const academic = Number(college.academic) || 0;
      const faculty = Number(college.faculty) || 0;
      const placement = Number(college.placement) || 0;
      
      const ratingSum = infra + academic + faculty + placement;
      if (ratingSum > 0) {
        // Scale sum (max 20 if all 5)
        qualityScore = (ratingSum / 20) * 20;
        if (placement > 4) reasons.push("Excellent placement record");
        if (infra > 4) reasons.push("Modern infrastructure");
      } else {
        // Fallback to general rating
        const genRating = Number(college.rating) || 0;
        qualityScore = (genRating / 5) * 20;
        if (genRating > 4) reasons.push("High student satisfaction");
      }

      const totalScore = profileScore + examScore + qualityScore;

      return {
        ...college,
        recommendationScore: Math.min(Math.round(totalScore), 100),
        recommendationReasons: Array.from(new Set(reasons))
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
