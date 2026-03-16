import CutoffTrendsClient from "@/components/cutoff/CutoffTrendsClient"
import ChatSidebar from "@/components/dashboard/ChatSidebar"
import Topbar from "@/components/dashboard/Topbar"

export default function CutoffTrendsPage() {
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

        {/* MAIN CONTENT AREA */}
        <CutoffTrendsClient />

      </div>
    </div>
  )
}
