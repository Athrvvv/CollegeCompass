import { auth } from "@/lib/auth/server"
import { getColleges } from "@/app/actions/getColleges"

import ChatSidebar from "@/components/dashboard/ChatSidebar"
import DashboardClient from "@/components/dashboard/DashboardClient"

export const dynamic = "force-dynamic"

export default async function DashboardPage(
  props: { searchParams?: Promise<{ q?: string }> }
) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";

  const { data: session } = await auth.getSession()

  // Fetch all colleges using the global rich data action
  const colleges = await getColleges()

  return (
    <DashboardClient 
      initialColleges={colleges}
      initialSearchQuery={query}
    />
  )
}