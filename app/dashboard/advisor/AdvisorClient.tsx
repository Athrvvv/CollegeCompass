"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getAdvisorResponse, createAdvisorChat, getAdvisorMessages, getAdvisorChats } from "@/app/actions/advisor"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useNotebook } from "@/context/NotebookContext"
import RemarkModal from "@/components/notebook/RemarkModal"

interface AdvisorClientProps {
  initialExams: any[]
  initialCourses: any[]
  initialStreams: any[]
  initialChats: any[]
}

const getSafeMessageId = (content: string) => {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Combine hash with length for extra uniqueness
  return 'advisor_' + Math.abs(hash).toString(36) + content.length.toString(36);
};

export default function AdvisorClient({ initialExams, initialCourses, initialStreams, initialChats }: AdvisorClientProps) {
  const [messages, setMessages] = useState<{ role: "user" | "model", content: string }[]>([])
  const [sessions, setSessions] = useState<any[]>(initialChats)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(initialChats[0]?.id || null)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [expandedStage, setExpandedStage] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const { addNote, isInNotebook } = useNotebook()
  const [pendingNoteContent, setPendingNoteContent] = useState<string | null>(null)
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load history when active session changes
  useEffect(() => {
    if (activeSessionId) {
      setLoadingHistory(true)
      getAdvisorMessages(activeSessionId)
        .then(msgs => {
          console.log("Loaded msgs:", msgs)
          if (Array.isArray(msgs)) {
             setMessages(msgs.map((m: any) => ({ role: m.role, content: m.content })))
          } else {
             console.error("Not an array:", msgs)
          }
        })
        .catch(err => {
          console.error("Error fetching msgs:", err)
        })
        .finally(() => setLoadingHistory(false))
    } else {
      setMessages([])
    }
  }, [activeSessionId])

  const handleNewChat = async () => {
    setActiveSessionId(null)
    setMessages([])
  }

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput("")
    
    let chatId = activeSessionId
    setLoading(true)

    try {
      // Create chat if it doesn't exist
      if (!chatId) {
        chatId = await createAdvisorChat(userMessage.substring(0, 30))
        setActiveSessionId(chatId)
        // Refresh session list
        const updatedSessions = await getAdvisorChats();
        setSessions(updatedSessions);
      }

      // Add user message to UI immediately
      setMessages(prev => [...prev, { role: "user", content: userMessage }])

      const response = await getAdvisorResponse(userMessage, chatId || undefined)
      setMessages(prev => [...prev, { role: "model", content: response }])
      
      // Update session list to show latest title/time
      const latestSessions = await getAdvisorChats();
      setSessions(latestSessions);
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { role: "model", content: "Sorry, I encountered an error. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-68px)] overflow-hidden">
      
      {/* LEFT: FLOW CHART AREA */}
      <div className="w-full lg:w-[40%] xl:w-[35%] overflow-auto bg-[#f8fafc] p-4 lg:p-8 border-r border-slate-200">
        <div className="max-w-5xl mx-auto space-y-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Academic Navigator
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Your Personal <span className="text-blue-600">Growth Map</span></h2>
            <p className="text-slate-500 text-lg max-w-2xl">A multi-dimensional view of your educational journey. Interact with stages to explore pathways.</p>
          </motion.div>

          <div className="relative">
            {/* Background Gradient Orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

            {/* Visual Flow Representation */}
            <div className="flex flex-col gap-24 relative z-10">
              
              {/* Level 1: Schooling */}
              <div className="flex flex-col items-center group">
                <motion.div 
                  layout
                  onClick={() => setExpandedStage(expandedStage === 'school' ? null : 'school')}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl shadow-blue-500/5 border border-slate-200 w-full max-w-md text-center transition-all cursor-pointer hover:border-blue-500 active:scale-[0.98] ${expandedStage === 'school' ? 'ring-2 ring-blue-500 ring-offset-4' : ''}`}
                >
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30 transform group-hover:rotate-6 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Foundation Stage</h3>
                  <p className="text-slate-500 mt-2 font-medium">Secondary & Senior Secondary Schooling</p>
                  
                  <AnimatePresence>
                    {expandedStage === 'school' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-slate-100 text-left space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-[10px] font-bold text-blue-600 uppercase">PCM / PCB</p>
                            <p className="text-xs text-slate-600 mt-1">Science Stream - Engineering or Medical focus.</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-[10px] font-bold text-blue-600 uppercase">Commerce</p>
                            <p className="text-xs text-slate-600 mt-1">Business, Finance & Accountancy focus.</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-[10px] font-bold text-blue-600 uppercase">Arts / Humanities</p>
                            <p className="text-xs text-slate-600 mt-1">Social Sciences, Literature & Design.</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-[10px] font-bold text-blue-600 uppercase">Skill Vocations</p>
                            <p className="text-xs text-slate-600 mt-1">Diploma & Professional training paths.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                
                {/* Visual Connector */}
                <div className="h-24 w-1 bg-linear-to-b from-blue-500 to-indigo-500 relative flex items-center justify-center">
                   <div className="absolute top-0 w-4 h-4 rounded-full border-4 border-white bg-blue-500 shadow-md" />
                   <div className="absolute bottom-0 w-4 h-4 rounded-full border-4 border-white bg-indigo-500 shadow-md animate-bounce" />
                </div>
              </div>

              {/* Level 2: Competitive Exams */}
              <div className="flex flex-col items-center">
                <div className="text-center mb-10">
                  <h3 className="text-xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
                    Entrance Gateways
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-black uppercase tracking-widest">Crucial Step</span>
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">Unlock top universities across the country</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                  {initialExams.slice(0, 4).map((exam, i) => (
                    <motion.div 
                      key={exam.exam_id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="bg-white p-6 rounded-[28px] shadow-xl shadow-slate-200/50 border border-slate-100 text-center cursor-pointer group hover:bg-indigo-600 transition-all duration-300"
                    >
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2 block group-hover:text-indigo-200 transition-colors">{exam.applicable_level}</span>
                      <h4 className="font-bold text-slate-900 group-hover:text-white transition-colors">{exam.name}</h4>
                    </motion.div>
                  ))}
                </div>

                {/* Multiple Connectors */}
                <div className="flex justify-between w-full max-w-2xl mt-10 h-14 relative">
                   <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-500/20 to-transparent blur-xl pointer-events-none" />
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-px h-full bg-linear-to-b from-indigo-500/50 to-blue-500 relative">
                        {i % 2 === 0 && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                     </div>
                   ))}
                </div>
              </div>

              {/* Level 3: Professional Courses */}
              <div className="flex flex-col items-center">
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="bg-slate-900 p-12 rounded-[48px] w-full shadow-3xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]" />
                  
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                      <div className="space-y-4">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/40">🎓</div>
                        <h3 className="text-white font-black text-3xl">Professional Degrees</h3>
                        <p className="text-slate-400 max-w-md">The core of your specialization. High-impact curriculum designed for global relevance.</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white text-xs font-bold backdrop-blur-md italic">Verifiable Degrees</span>
                        <span className="px-4 py-2 bg-blue-600/20 border border-blue-600/30 rounded-full text-blue-400 text-xs font-bold backdrop-blur-md">UGC Approved</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {initialCourses.slice(0, 6).map((course, i) => (
                        <motion.div 
                          key={course.course_id}
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                          className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl transition-all duration-300 group/item"
                        >
                           <p className="text-blue-400 text-[10px] mb-2 font-black uppercase tracking-[0.2em]">{course.level}</p>
                           <h4 className="text-white font-bold text-lg mb-3 leading-tight">{course.course_name}</h4>
                           <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                             <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                             <span className="text-[10px] text-slate-400 font-bold uppercase">Popular Choice</span>
                           </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Level 4: Specializations / Career */}
              <div className="flex flex-col items-center">
                <div className="h-20 w-1 bg-linear-to-b from-blue-500 to-indigo-600 relative">
                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 border-4 border-white bg-indigo-600 rounded-full shadow-lg" />
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-linear-to-br from-blue-700 via-indigo-800 to-slate-900 p-12 lg:p-20 rounded-[64px] w-full text-center shadow-4xl text-white relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full flex items-center justify-center mb-8 shadow-2xl">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                       </svg>
                    </div>
                    <h3 className="text-4xl lg:text-6xl font-black mb-6 tracking-tighter italic">Future Ready.</h3>
                    <p className="text-blue-200 text-lg opacity-80 mb-12 max-w-2xl mx-auto">Master the technologies and domains that are shaping the next decade. Your journey doesn't end at a degree—it starts there.</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {["Quantum Computing", "Deep Learning", "Fintech", "Cyber Law", "Robotics", "Bio-Tech", "ESG Investing"].map((spec, i) => (
                        <motion.span 
                          key={spec}
                          whileHover={{ scale: 1.1, rotate: i % 2 === 0 ? 2 : -2 }}
                          className="px-6 py-3 bg-white/15 rounded-2xl text-xs font-black backdrop-blur-3xl border border-white/20 shadow-xl"
                        >
                          {spec}
                        </motion.span>
                      ))}
                      <span className="px-6 py-3 bg-blue-500/40 rounded-2xl text-xs font-black backdrop-blur-3xl border border-blue-400/40 shadow-xl flex items-center justify-center gap-2">
                        + Infinity
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: CHATBOT AREA */}
      <div className="flex-1 flex w-full bg-white shadow-[-20px_0_40px_-15px_rgba(0,0,0,0.05)] relative z-10 overflow-hidden">
        
        {/* Chat History Drawer/Sidebar */}
        <div className="w-[220px] shrink-0 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-5 border-b border-slate-100/60 bg-white/50 backdrop-blur-sm">
            <button 
              onClick={handleNewChat}
              className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            <div className="px-2 pb-2 pt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">History</div>
            {sessions.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`w-full text-left p-3 rounded-xl transition-all group border ${
                  activeSessionId === s.id 
                    ? 'bg-white border-blue-100 text-blue-700 shadow-sm shadow-blue-500/5' 
                    : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100/50'
                }`}
              >
                <div className="text-xs font-bold truncate">{s.title || "New Chat"}</div>
                <div className="text-[10px] opacity-60 mt-1">{new Date(s.updated_at).toLocaleDateString()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="py-4 px-6 border-b border-slate-100 bg-white/80 backdrop-blur-md z-20 flex items-center justify-between sticky top-0 shadow-sm shadow-slate-200/20">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-linear-to-br from-blue-500 to-indigo-600 rounded-[14px] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                 </svg>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">AI Advisor</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personalized guidance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-50/50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/40 via-transparent to-transparent">
            {loadingHistory ? (
               <div className="flex items-center justify-center h-full">
                 <div className="w-6 h-6 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
               </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">💡</div>
                <h4 className="text-slate-900 font-bold text-lg mb-1">Start a Conversation</h4>
                <p className="text-slate-500 text-xs leading-relaxed max-w-[200px] mx-auto">Ask about exams, colleges, or career paths.</p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
                  >
                    <div className={`max-w-[90%] md:max-w-[80%] rounded-3xl shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-linear-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm font-medium p-4 text-[15px] shadow-blue-500/20 shadow-md' 
                        : 'bg-white border border-slate-100/60 text-slate-800 rounded-bl-sm shadow-xl shadow-slate-200/20 backdrop-blur-xl'
                    }`}>
                      {msg.role === 'model' ? (
                        <div className="flex flex-col">
                          <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-100/60 flex items-center justify-between rounded-t-3xl">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-inner">
                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                              </div>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Guidance</span>
                            </div>
                             {!isInNotebook(getSafeMessageId(msg.content)) ? (
                               <button 
                                 onClick={() => {
                                   setPendingNoteContent(msg.content);
                                   setIsRemarkModalOpen(true);
                                 }}
                                 className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 px-2 py-1 rounded-md flex items-center gap-1 transition-all"
                               >
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                 </svg>
                                 Save
                               </button>
                             ) : (
                               <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1 border border-green-100">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path d="M5 13l4 4L19 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                                 Saved
                               </span>
                             )}
                          </div>
                          <div className="p-5 prose prose-sm md:prose-base prose-slate max-w-none prose-headings:text-slate-900 prose-ul:list-disc prose-ol:list-decimal prose-p:leading-relaxed prose-headings:mb-3 prose-headings:mt-5 first:prose-headings:mt-0 prose-ul:my-3 prose-li:my-1 pb-2">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                  <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 md:p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
            <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex gap-3">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for guidance or explore a career path..."
                  className="w-full pl-6 pr-16 py-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 focus:bg-white transition-all text-[15px] font-medium placeholder-slate-400 shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white rounded-[14px] flex items-center justify-center transition-all shadow-lg shadow-blue-500/20 active:scale-95 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </form>
            <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-50" />
              AI Advisor guidance is personalized to your profile
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-50" />
            </p>
          </div>
        </div>
      </div>
      <RemarkModal
        isOpen={isRemarkModalOpen}
        onClose={() => setIsRemarkModalOpen(false)}
        onConfirm={(remark) => {
          if (pendingNoteContent) {
            addNote({
              note_id: getSafeMessageId(pendingNoteContent),
              note_name: sessions.find(s => s.id === activeSessionId)?.title || "AI Academic Guidance",
              data: [{ advisor_content: pendingNoteContent }],
              remark: remark || `Saved from AI Advisor on ${new Date().toLocaleDateString()}`
            });
            setPendingNoteContent(null);
          }
        }}
        title="Advisory Guidance"
      />
    </div>
  )
}
