import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/server"
import { neon } from "@neondatabase/serverless"

export async function POST(req: NextRequest) {
  const session = await auth.getSession();
  if (!session.data?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { phone } = await req.json();
    if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const sql = neon(process.env.DATABASE_URL!);

    await sql`
      UPDATE user_profiles 
      SET phone_otp = ${otp}
      WHERE auth_user_id = ${session.data.user.id}
    `;

    // Real SMS via HttpSMS
    try {
      const smsRes = await fetch("https://api.httpsms.com/v1/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "uk_sZrRWiiR9wL1aQ79aCAFwD-6qVwrb4cv5xamczMeBV_AkcEfg4iUCU4Ov-uXNjiM"
        },
        body: JSON.stringify({
          content: `Your College Compass verification code is: ${otp}`,
          from: "+919594797470",
          to: phone
        })
      });

      if (!smsRes.ok) {
        const errorText = await smsRes.text();
        throw new Error(`HttpSMS failed: ${errorText}`);
      }

      console.log(`[HttpSMS] Sent code ${otp} to phone: ${phone}`);
      return NextResponse.json({ success: true, message: "OTP sent to your phone" });
    } catch (smsError: any) {
      console.error("SMS SEND ERROR:", smsError);
      return NextResponse.json({ error: "Failed to send SMS OTP. Please try again later." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Phone OTP error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
