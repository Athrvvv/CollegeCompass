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
  const [tableSearch, setTableSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 8

  // Filtered colleges based on search
  const filteredColleges = tableColleges ? tableColleges.filter(col => 
    col.college_name?.toLowerCase().includes(tableSearch.toLowerCase()) ||
    col.city?.toLowerCase().includes(tableSearch.toLowerCase())
  ) : []

  // Pagination logic
  const totalPages = Math.ceil(filteredColleges.length / ITEMS_PER_PAGE)
  const paginatedColleges = filteredColleges.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

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
    <div className="relative shrink-0 flex h-full z-40 bg-slate-950 border-r border-slate-800/50">
      
      {/* MAIN SIDEBAR CONTENT */}
      <aside className="w-72 text-slate-200 flex flex-col px-5 py-6 overflow-y-auto h-full relative z-50 bg-slate-950/80 backdrop-blur-xl shadow-2xl custom-scrollbar">
        <div className="flex-1 flex flex-col h-full relative">

          <AnimatePresence mode="wait">
            {chats.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center justify-center flex-1 w-full text-center mt-[-10%]"
              >
                <div className="w-16 h-16 rounded-[24px] bg-linear-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.15)] border border-indigo-500/20 relative group">
                  <span className="text-3xl relative z-10 group-hover:scale-110 transition-transform duration-500">✨</span>
                  <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse [animation-duration:3s]" />
                </div>
                
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-3 drop-shadow-sm">
                  College Compass AI
                </h2>
                <p className="text-2xl font-black text-white tracking-tight leading-tight mb-8 drop-shadow-md">
                  How can I help<br/>you today?
                </p>

                <div className="w-full relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl blur-lg opacity-30 group-focus-within:opacity-60 transition duration-1000 group-hover:duration-500" />
                  <form onSubmit={handleSubmit} className="relative flex items-center bg-slate-900/90 border border-slate-800 rounded-2xl px-5 py-4 focus-within:border-indigo-500/50 focus-within:bg-slate-900 transition-all shadow-xl">
                    <input
                      type="text"
                      placeholder="Ask me about any college..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={loading}
                      className="flex-1 min-w-0 bg-transparent text-[13px] font-medium outline-none placeholder:text-slate-500 disabled:opacity-50 text-white"
                    />
                    <button 
                      type="submit" 
                      disabled={loading || !message.trim()}
                      className="ml-3 w-8 h-8 shrink-0 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white disabled:opacity-30 transition-all group-focus-within:bg-indigo-500 group-focus-within:text-white"
                    >
                      {loading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="chat-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col h-full w-full"
              >
                {/* Compact Header */}
                <div className="shrink-0 flex items-center gap-3 pb-4 border-b border-slate-800/50 mb-4 z-10 sticky top-0 bg-slate-950/80 backdrop-blur-xl">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                    <span className="text-base">✨</span>
                  </div>
                  <div>
                    <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-0.5">
                      College Compass
                    </h2>
                    <p className="text-sm font-bold text-white tracking-wide">
                      AI Assistant
                    </p>
                  </div>
                </div>

                {/* PREVIOUS CHATS */}
                <div className="flex-1 overflow-hidden flex flex-col">
                  <PreviousChats 
                    chats={chats} 
                    loading={loading}
                    onViewTable={(colleges) => {
                       setTableColleges(colleges)
                       setTableSearch("")
                       setCurrentPage(1)
                    }}
                  />
                </div>

                {/* Input at the bottom */}
                <div className="shrink-0 pt-4 pb-2 bg-slate-950/90 backdrop-blur-xl z-20 sticky bottom-0 border-t border-slate-900">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition duration-1000 group-hover:duration-500" />
                    <form onSubmit={handleSubmit} className="relative flex items-center bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 focus-within:border-indigo-500/50 transition-all shadow-lg">
                      <input
                        type="text"
                        placeholder="Follow up..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={loading}
                        className="flex-1 min-w-0 bg-transparent text-[13px] font-medium outline-none placeholder:text-slate-500 disabled:opacity-50 text-white"
                      />
                      <button 
                        type="submit" 
                        disabled={loading || !message.trim()}
                        className="ml-2 w-8 h-8 shrink-0 rounded-[10px] flex items-center justify-center bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white disabled:opacity-30 transition-all focus:bg-indigo-500 focus:text-white group-focus-within:bg-indigo-500 group-focus-within:text-white"
                      >
                        {loading ? (
                          <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </aside>

      {/* SLIDE OUT PANEL DRAWER OVERLAY */}
      <AnimatePresence>
        {tableColleges && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTableColleges(null)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-30"
            />
            <motion.div
              initial={{ x: "-20px", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-20px", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-72 top-4 bottom-4 w-[850px] bg-slate-900/95 backdrop-blur-2xl border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-40 flex flex-col overflow-hidden rounded-2xl"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/50 backdrop-blur-md z-10 sticky top-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Search Results
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400">
                    We found <span className="text-indigo-400 font-semibold">{filteredColleges.length}</span> institutional matches
                  </p>
                </div>

                {/* Inline Table Search */}
                <div className="flex-1 max-w-xs mx-4">
                  <div className="relative group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Filter results..."
                      value={tableSearch}
                      onChange={(e) => {
                        setTableSearch(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setTableColleges(null)} 
                    className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all border border-slate-700/50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Table Area */}
              <div className="flex-1 overflow-auto px-8 pt-8 pb-4 custom-scrollbar bg-slate-950/20">
                <div className="border border-slate-800/50 rounded-2xl overflow-hidden bg-slate-900/40 backdrop-blur-sm shadow-inner min-h-[400px]">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr className="bg-slate-800/50 border-b border-slate-700/50 text-slate-400 uppercase tracking-widest text-[10px] font-bold">
                        <th className="py-4 px-6 w-16 text-center">#</th>
                        <th className="py-4 px-6">Institution Name</th>
                        <th className="py-4 px-6">Location</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6 text-right">Est.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {paginatedColleges.map((col, idx) => {
                        const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1
                        return (
                          <motion.tr 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={col.college_id || idx} 
                            onClick={() => navigateToCollege(col.college_id)}
                            className="hover:bg-indigo-500/5 transition-all group cursor-pointer"
                          >
                            <td className="py-4 px-6 text-center text-slate-600 font-medium group-hover:text-indigo-400 transition-colors">
                              {String(globalIdx).padStart(2, '0')}
                            </td>
                            <td className="py-4 px-6 font-semibold text-slate-200 leading-tight group-hover:text-white transition-colors">
                              {col.college_name}
                            </td>
                            <td className="py-4 px-6">
                               <div className="inline-flex items-center gap-1.5 bg-slate-800/50 text-slate-300 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-700/50 group-hover:bg-slate-700/50 group-hover:text-white transition-all">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                                   <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                 </svg>
                                 {col.city || "N/A"}
                               </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-slate-400 group-hover:text-slate-300 transition-colors">
                                {col.typeofuni || "Private"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right text-slate-500 tabular-nums font-mono group-hover:text-indigo-300 transition-colors">
                              {col.established_year || "—"}
                            </td>
                          </motion.tr>
                        )
                      })}
                    </tbody>
                  </table>
                  
                  {filteredColleges.length === 0 && (
                     <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-4">
                        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xl">
                          🔍
                        </div>
                        <p className="text-sm font-medium">No results matched your search criteria.</p>
                     </div>
                  )}
                </div>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="px-8 py-4 bg-slate-900/50 flex justify-center items-center gap-4">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30 disabled:border-slate-800 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Prev
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg text-[10px] font-bold transition-all border
                          ${currentPage === page 
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]' 
                            : 'bg-slate-800 border-slate-700/50 text-slate-500 hover:text-slate-300'}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30 disabled:border-slate-800 transition-all"
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Footer */}
              <div className="px-8 py-4 bg-slate-900/80 border-t border-slate-800/50 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <span>College Compass Intelligence</span>
                <div className="flex items-center gap-4">
                  <span className="text-indigo-500/50">Auto-Generated Report</span>
                  <span className="w-1 h-1 bg-slate-700 rounded-full" />
                  <span>Page {currentPage} of {totalPages || 1}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}