import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const session = await auth.getSession();
    const sql = neon(process.env.DATABASE_URL!);
    const dbCheck = await sql`SELECT NOW()`;
    
    return NextResponse.json({ 
      status: "OK", 
      sessionActive: !!session.data?.user,
      userId: session.data?.user?.id || null,
      dbTime: dbCheck[0].now
    });
  } catch (e: any) {
    console.error("TEST API ERROR:", e);
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
  }
}
