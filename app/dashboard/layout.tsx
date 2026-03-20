import Topbar from "@/components/dashboard/Topbar"
import ChatSidebar from "@/components/dashboard/ChatSidebar"
import PageTransition from "@/components/dashboard/PageTransition"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-slate-950 text-gray-900 font-sans overflow-hidden">
      
      {/* SHRED TOPBAR */}
      <div className="shrink-0 z-50">
        <Topbar />
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        
        {/* SHARED SIDEBAR */}
        <ChatSidebar />

        {/* CONTENT AREA WITH ANIMATED TRANSITIONS */}
        <main className="flex-1 min-w-0 overflow-hidden relative bg-transparent">
           <PageTransition>
             {children}
           </PageTransition>
        </main>

      </div>
    </div>
  )
}
