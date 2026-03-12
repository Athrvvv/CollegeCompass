import ChatSidebar from "@/components/dashboard/ChatSidebar"
import DashboardGrid from "@/components/dashboard/DashboardGrid"
import Topbar from "@/components/dashboard/Topbar"
import ReportSidebar from "@/components/dashboard/ReportSidebar"

function SkeletonCard() {
  return (
    <div className="bg-white/70 backdrop-blur border border-gray-200 rounded-xl p-6 animate-pulse">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 bg-gray-200 rounded-full" />

        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>

      </div>

      <div className="mt-4 flex gap-2">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>

    </div>
  )
}

export default function LoadingDashboard() {

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">

      <ChatSidebar />

      <main className="flex-1 flex flex-col min-w-0">

        <Topbar />

        <div className="flex-1 p-4 md:p-6 overflow-y-auto">

          {/* <DashboardHeader title="CollegeCompass" /> */}

          <DashboardGrid>

            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}

          </DashboardGrid>

        </div>

      </main>

      <ReportSidebar />

    </div>
  )
}