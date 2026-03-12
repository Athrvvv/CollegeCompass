import { auth } from "@/lib/auth/server"
import { getColleges } from "./actions"

import ChatSidebar from "@/components/dashboard/ChatSidebar"
import PaginatedCollegeList from "@/components/dashboard/PaginatedCollegeList"
import Topbar from "@/components/dashboard/Topbar"
import ReportSidebar from "@/components/dashboard/ReportSidebar"

export const dynamic = "force-dynamic"

export default async function DashboardPage(
  props: { searchParams?: Promise<{ q?: string }> }
) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";

  const { data: session } = await auth.getSession()

  const { colleges, totalPages } = await getColleges(1, 9, query)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* FULL WIDTH TOPBAR */}
      <Topbar />

      {/* THREE COLUMN LAYOUT ENCOMPASSING REMAINDER OF HEIGHT */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        
        {/* LEFT SIDEBAR */}
        <ChatSidebar />

        {/* MAIN CONTENT (SCROLLABLE GRID) */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto p-4 md:p-6">
          <PaginatedCollegeList 
            key={query} 
            initialColleges={colleges} 
            initialTotalPages={totalPages} 
            initialSearchQuery={query} 
          />
        </main>

        {/* RIGHT SIDEBAR */}
        <ReportSidebar />

      </div>
    </div>
  )
}