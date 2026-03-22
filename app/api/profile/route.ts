import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/server"
import { neon } from "@neondatabase/serverless"

export async function POST(req: NextRequest) {
  const session = await auth.getSession();

  if (!session.data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { firstName, middleName, lastName, phone, email, qualification, exams, userRank, category, gender, stateOfEligibility, pwdStatus } = body;

    const sql = neon(process.env.DATABASE_URL!);

    // Upsert profile
    await sql`
      INSERT INTO user_profiles (
        auth_user_id, 
        first_name, 
        middle_name, 
        last_name, 
        phone, 
        email, 
        education_qualification, 
        exams_appeared, 
        user_rank,
        category,
        gender,
        state_of_eligibility,
        pwd_status,
        onboarding_completed,
        updated_at
      ) 
      VALUES (
        ${session.data.user.id}, 
        ${firstName}, 
        ${middleName}, 
        ${lastName}, 
        ${phone}, 
        ${email}, 
        ${qualification}, 
        ${JSON.stringify(exams)},
        ${userRank || null},
        ${category || null},
        ${gender || null},
        ${stateOfEligibility || null},
        ${pwdStatus || false},
        TRUE,
        NOW()
      )
      ON CONFLICT (auth_user_id) 
      DO UPDATE SET
        first_name = EXCLUDED.first_name,
        middle_name = EXCLUDED.middle_name,
        last_name = EXCLUDED.last_name,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        education_qualification = EXCLUDED.education_qualification,
        exams_appeared = EXCLUDED.exams_appeared,
        user_rank = EXCLUDED.user_rank,
        category = EXCLUDED.category,
        gender = EXCLUDED.gender,
        state_of_eligibility = EXCLUDED.state_of_eligibility,
        pwd_status = EXCLUDED.pwd_status,
        onboarding_completed = TRUE,
        updated_at = NOW();
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth.getSession();

  if (!session.data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const profiles = await sql`
      SELECT * FROM user_profiles WHERE auth_user_id = ${session.data.user.id} LIMIT 1
    `;

    return NextResponse.json(profiles[0] || null);
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
