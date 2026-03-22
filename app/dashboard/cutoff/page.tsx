import CutoffTrendsClient from "@/components/cutoff/CutoffTrendsClient"
import ChatSidebar from "@/components/dashboard/ChatSidebar"
import { auth } from "@/lib/auth/server"
import { neon } from "@neondatabase/serverless"
import LockedState from "@/components/dashboard/LockedState"

export const dynamic = "force-dynamic"

export default async function CutoffTrendsPage() {
  const { data: session } = await auth.getSession()

  let locked = false;
  if (session?.user) {
    const sql = neon(process.env.DATABASE_URL!);
    const userProfile = await sql`SELECT onboarding_completed FROM user_profiles WHERE auth_user_id = ${session.user.id} LIMIT 1`;
    if (!userProfile || userProfile.length === 0 || !userProfile[0].onboarding_completed) {
      locked = true;
    }
  }

  if (locked) {
    return <LockedState featureName="Cutoff Trends" />
  }

  return <CutoffTrendsClient />
}
