import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email, message } = await request.json();

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required" },
        { status: 400 }
      );
    }

    // Configure nodemailer with Gmail (same as OTP)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "atharvapingle.work@gmail.com",
        pass: "zujf ykyq lryp wqps", // App Password
      },
    });

    // Send email to the support mailbox
    await transporter.sendMail({
      from: `"CollegeCompass Query" <atharvapingle.work@gmail.com>`,
      to: "atharvapingle.work@gmail.com", // Forwarding to same email for now
      subject: `New Query from ${email}`,
      text: `User Email: ${email}\n\nQuery:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1a1a1a;">New Inquiry Received</h2>
          <p><strong>From:</strong> ${email}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Query API Error:", error);
    return NextResponse.json(
      { error: "Failed to send query" },
      { status: 500 }
    );
  }
}
