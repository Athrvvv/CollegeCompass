import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/server"
import { neon } from "@neondatabase/serverless"
import nodemailer from "nodemailer"
import fs from "fs"

export async function POST(req: NextRequest) {
  const session = await auth.getSession();
  if (!session.data?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const sql = neon(process.env.DATABASE_URL!);

    console.log(`[Email OTP] Request for: ${email}, generated OTP: ${otp}`);

    await sql`
      UPDATE user_profiles 
      SET email_otp = ${otp}
      WHERE auth_user_id = ${session.data.user.id}
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "atharvapkhond@gmail.com",
        pass: "mnia ohwc ziax kupy"
      }
    });

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log("[Email OTP] Transporter verified successfully");
    } catch (verifyError) {
      console.error("[Email OTP] Transporter verification failed:", verifyError);
      throw verifyError;
    }

    await transporter.sendMail({
      from: '"College Compass" <atharvapkhond@gmail.com>',
      to: email,
      subject: "Verify your Email - College Compass",
      text: `Your email verification code is: ${otp}`,
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 40px; background: #f8fafc; border-radius: 16px;">
          <h2 style="color: #4f46e5; margin-bottom: 24px;">Verify your Email</h2>
          <p style="color: #475569; font-size: 16px;">Enter the following code to verify your College Compass profile:</p>
          <div style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #0f172a; margin: 32px 0; background: white; padding: 20px; border-radius: 12px; border: 2px solid #e2e8f0; display: inline-block;">
            ${otp}
          </div>
          <p style="color: #94a3b8; font-size: 14px;">This code will expire securely.</p>
        </div>
      `
    });

    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (error: any) {
    console.error("Email OTP error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
