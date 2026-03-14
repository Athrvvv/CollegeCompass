import { auth } from "@/lib/auth/server"
import { getColleges } from "@/app/actions/getColleges"

import ChatSidebar from "@/components/dashboard/ChatSidebar"
import Topbar from "@/components/dashboard/Topbar"
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
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      
      {/* FULL WIDTH TOPBAR */}
      <div className="shrink-0">
        <Topbar />
      </div>

      {/* THREE COLUMN LAYOUT ENCOMPASSING REMAINDER OF HEIGHT */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        
        {/* LEFT SIDEBAR */}
        <ChatSidebar />

        {/* MAIN DASHBOARD CLIENT (CONTENT + ADVANCED FILTERS) */}
        <DashboardClient 
          initialColleges={colleges}
          initialSearchQuery={query}
        />

      </div>
    </div>
  )
}