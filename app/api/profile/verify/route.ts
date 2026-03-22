import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/server"
import { neon } from "@neondatabase/serverless"

export async function POST(req: NextRequest) {
  const session = await auth.getSession();
  if (!session.data?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { type, otp } = await req.json(); // type: "email" | "phone"
    if (!type || !otp) return NextResponse.json({ error: "Type and OTP required" }, { status: 400 });

    const sql = neon(process.env.DATABASE_URL!);
    
    // Check OTP
    const user = await sql`
      SELECT email_otp, phone_otp 
      FROM user_profiles 
      WHERE auth_user_id = ${session.data.user.id}
    `;

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    const record = user[0];

    if (type === "email") {
      if (record.email_otp === otp) {
        await sql`UPDATE user_profiles SET email_verified = true, email_otp = NULL WHERE auth_user_id = ${session.data.user.id}`;
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ error: "Invalid Email OTP" }, { status: 400 });
      }
    } else if (type === "phone") {
      if (record.phone_otp === otp) {
        await sql`UPDATE user_profiles SET phone_verified = true, phone_otp = NULL WHERE auth_user_id = ${session.data.user.id}`;
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ error: "Invalid Phone OTP" }, { status: 400 });
      }
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
