import { motion, AnimatePresence } from "framer-motion"

export type ChatMessage = {
  id: number
  sender: "user" | "ai"
  text: string
  colleges?: any[]
}

type Props = {
  chats: ChatMessage[]
  loading?: boolean
  onViewTable?: (colleges: any[]) => void
}

export default function PreviousChats({ chats, loading, onViewTable }: Props) {
  return (
    <div className="space-y-6 flex-1 overflow-y-auto px-1 custom-scrollbar pb-10 mt-4">
      <AnimatePresence>
        {chats.map((chat) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.8 }}
            className={`flex flex-col w-full ${chat.sender === "user" ? "items-end" : "items-start"}`}
          >
            
            {/* User Bubble */}
            {chat.sender === "user" ? (
              <div className="relative group max-w-[88%]">
                <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-15 group-hover:opacity-25 transition duration-500"></div>
                <div className="relative bg-linear-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-[13px] leading-relaxed shadow-lg border border-white/10 font-medium">
                  {chat.text}
                </div>
              </div>
            ) : (
              
            /* AI Bubble */
              <div className="flex flex-col gap-4 w-full pr-2">
                
                {/* AI Text Response */}
                <div className="flex gap-3.5">
                  <div className="w-8 h-8 shrink-0 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 mt-1 shadow-md group">
                    <span className="text-[12px] group-hover:scale-110 transition-transform">✨</span>
                  </div>
                  <div className="relative flex-1">
                    <div className="bg-slate-900/60 backdrop-blur-md text-slate-200 border border-slate-800/80 rounded-2xl rounded-tl-sm px-4 py-3.5 text-[13px] leading-[1.6] shadow-sm font-medium">
                      {chat.text}
                    </div>
                  </div>
                </div>

                {/* College Result Mini-Cards */}
                {chat.colleges && chat.colleges.length > 0 && (
                  <div className="ml-11">
                    <button 
                      onClick={() => onViewTable && onViewTable(chat.colleges!)}
                      className="group relative flex items-center gap-3 px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 hover:border-indigo-400/30 transition-all rounded-xl text-[11px] font-bold uppercase tracking-wider overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-indigo-500/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <span>Discovery: {chat.colleges.length} Institutions</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
            
          </motion.div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <motion.div
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex gap-3.5 w-full items-start mt-4"
          >
            <div className="w-8 h-8 shrink-0 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 mt-1 shadow-md relative overflow-hidden">
               <div className="absolute inset-0 bg-indigo-500/20 animate-pulse"></div>
               <span className="text-[12px] relative z-10">✨</span>
            </div>
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2 w-max shadow-sm">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s] shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s] shadow-[0_0_8px_rgba(129,140,248,0.4)]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce shadow-[0_0_8px_rgba(165,180,252,0.3)]"></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}