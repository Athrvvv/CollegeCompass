import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/server"
import fs from "fs"

export async function GET(req: NextRequest) {
  const session = await auth.getSession();
  
  const logData = {
    timestamp: new Date().toISOString(),
    session: session,
    headers: Object.fromEntries(req.headers.entries())
  };
  
  fs.appendFileSync('tmp/session_debug.log', JSON.stringify(logData, null, 2) + "\n---\n");
  
  return NextResponse.json(session);
}
