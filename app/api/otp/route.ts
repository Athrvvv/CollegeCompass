import { NextRequest, NextResponse } from "next/server"

// In-memory store for mock OTPs (for demonstration purposes)
const otpStore = new Map<string, string>();

export async function POST(req: NextRequest) {
  try {
    const { action, identifier, otp } = await req.json();

    if (action === "send") {
      // Simulate sending OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(identifier, code);
      console.log(`[MOCK OTP] Sent code ${code} to ${identifier}`);
      return NextResponse.json({ success: true, message: "OTP sent (check console)" });
    }

    if (action === "verify") {
      const storedOtp = otpStore.get(identifier);
      if (otp === storedOtp || otp === "123456") { // "123456" as a master bypass for testing
        otpStore.delete(identifier);
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
