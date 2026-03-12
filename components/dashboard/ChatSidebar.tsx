"use client"
import { useState } from "react"
import PreviousChats, { ChatMessage } from "@/components/dashboard/PreviousChats"
import { authClient } from "@/lib/auth/client"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

export default function ChatSidebar() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [chats, setChats] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [tableColleges, setTableColleges] = useState<any[] | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim() || loading) return

    setLoading(true)
    const currentMessage = message.trim()
    
    // Add user's query to chat list immediately
    const userChat: ChatMessage = { 
      id: Date.now(), 
      sender: "user", 
      text: currentMessage 
    }
    setChats(prev => [...prev, userChat])
    setMessage("")

    try {
      const { data } = await authClient.getSession()
      const sessionid = data?.session?.id || "default_session"

      const response = await fetch("https://nlqt-service.onrender.com/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionid,
          message: currentMessage,
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        console.error("NLQT API Error Details:", {
          status: response.status,
          statusText: response.statusText,
          body: errText
        })
        throw new Error(`API error ${response.status}: ${errText}`)
      }
      
      const responseData = await response.json()
      
      console.log("NLQT Raw JSON Response:", responseData)

      const replyText = responseData.response || responseData.answer || responseData.message || "Here's what I found:"

      const botChat: ChatMessage = { 
        id: Date.now() + 1, 
        sender: "ai", 
        text: replyText,
        colleges: responseData.rows || []
      }
      setChats(prev => [...prev, botChat])

    } catch (error: any) {
      console.error(error)
      setChats(prev => [
        ...prev, 
        { id: Date.now() + 2, sender: "ai", text: `Error: ${error?.message || "Failed to fetch response"}` }
      ])
    } finally {
      setLoading(false)
    }
  }

  function navigateToCollege(id: number) {
    if (id) {
      setTableColleges(null) // optionally close the drawer
      router.push(`/dashboard/college/${id}`)
    }
  }

  return (
    <div className="relative shrink-0 flex h-full z-40 bg-slate-900 border-r border-slate-800">
      
      {/* MAIN SIDEBAR CONTENT */}
      <aside className="w-64 text-slate-200 flex flex-col px-4 py-5 overflow-y-auto h-full relative z-50 bg-slate-900 shadow-xl custom-scrollbar">
        <div className="flex-1 flex flex-col justify-center">

          <p className="text-xl uppercase tracking-wide text-slate-400 mb-3">
            Ask me anything &gt;3
          </p>

          <form onSubmit={handleSubmit} className="flex items-center bg-slate-800 rounded-lg px-3 py-1.5 mb-5 focus-within:ring-2 ring-indigo-500 transition-all border border-slate-700/50">
            <input
              type="text"
              placeholder="Search queries..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-slate-500 disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={loading || !message.trim()}
              className="ml-2 text-slate-400 hover:text-white text-xs disabled:opacity-50"
            >
              ➤
            </button>
          </form>

          {/* PREVIOUS CHATS */}
          <PreviousChats 
            chats={chats} 
            loading={loading}
            onViewTable={(colleges) => setTableColleges(colleges)}
          />

        </div>
      </aside>

      {/* SLIDE OUT PANEL DRAWER OVERLAY */}
      <AnimatePresence>
        {tableColleges && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="absolute left-64 top-0 bottom-0 w-[800px] bg-white border-r border-slate-200 shadow-[20px_0_30px_-10px_rgba(0,0,0,0.1)] z-40 flex flex-col overflow-hidden rounded-r-2xl"
          >
            {/* Header */}
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white text-slate-800 z-10 sticky top-0">
              <div>
                <h2 className="text-xl font-bold">
                  Query Results
                </h2>
                <p className="text-xs text-slate-500 mt-1">Found {tableColleges.length} colleges matching your search</p>
              </div>
              <button 
                onClick={() => setTableColleges(null)} 
                className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Table Area */}
            <div className="flex-1 overflow-auto px-8 py-6 custom-scrollbar bg-slate-50/50">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <th className="py-3 px-4 font-semibold w-12 text-center text-slate-400">#</th>
                      <th className="py-3 px-4 font-semibold">College Name</th>
                      <th className="py-3 px-4 font-semibold whitespace-nowrap">City</th>
                      <th className="py-3 px-4 font-semibold whitespace-nowrap">Type</th>
                      <th className="py-3 px-4 font-semibold whitespace-nowrap">Established</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tableColleges.map((col, idx) => (
                      <tr 
                        key={col.college_id || idx} 
                        onClick={() => navigateToCollege(col.college_id)}
                        className="hover:bg-indigo-50/50 transition-colors group cursor-pointer"
                      >
                        <td className="py-3 px-4 text-center text-slate-400 font-medium group-hover:text-indigo-500 transition-colors">{idx + 1}</td>
                        <td className="py-3 px-4 font-medium text-slate-800 leading-snug group-hover:text-indigo-900 transition-colors">{col.college_name}</td>
                        <td className="py-3 px-4 text-slate-600">
                           <span className="bg-indigo-50/60 text-indigo-600 px-2 py-0.5 rounded-md text-[11px] font-medium border border-indigo-100/50 group-hover:bg-white transition-colors">
                             {col.city || "—"}
                           </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{col.typeofuni || "—"}</td>
                        <td className="py-3 px-4 text-slate-500 tabular-nums whitespace-nowrap">{col.established_year || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {tableColleges.length === 0 && (
                 <div className="text-center py-12 text-slate-400">No college data available for this query.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}