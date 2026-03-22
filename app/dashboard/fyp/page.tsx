import { auth } from "@/lib/auth/server"
import { neon } from "@neondatabase/serverless"
import LockedState from "@/components/dashboard/LockedState"
import FYPClient from "./FYPClient"

export const dynamic = "force-dynamic"

export default async function FYPPage() {
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
    return <LockedState featureName="For You Page (FYP)" />
  }

  return <FYPClient />
}
