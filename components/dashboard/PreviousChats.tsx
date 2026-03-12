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
    <div className="space-y-5 flex-1 overflow-y-auto px-1 custom-scrollbar pb-6 mt-2">
      <AnimatePresence>
        {chats.map((chat) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col w-full ${chat.sender === "user" ? "items-end" : "items-start"}`}
          >
            
            {/* User Bubble */}
            {chat.sender === "user" ? (
              <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] text-[13px] leading-relaxed shadow-sm">
                {chat.text}
              </div>
            ) : (
              
            /* AI Bubble */
              <div className="flex flex-col gap-3 w-full pr-4">
                
                {/* AI Text Response */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 shrink-0 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 mt-1 shadow-sm">
                    <span className="text-[10px]">✨</span>
                  </div>
                  <div className="bg-slate-800 text-slate-200 border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3 text-[13px] leading-relaxed shadow-sm w-full font-medium">
                    {chat.text}
                  </div>
                </div>

                {/* College Result Mini-Cards */}
                {chat.colleges && chat.colleges.length > 0 && (
                  <div className="ml-10 space-y-2 mt-1">
                    <button 
                      onClick={() => onViewTable && onViewTable(chat.colleges!)}
                      className="w-full mt-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors font-semibold py-2 rounded-xl text-[11px] flex justify-center items-center gap-2 shadow-sm"
                    >
                      View all {chat.colleges.length} results in Table <span className="text-lg leading-none">→</span>
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
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="flex gap-3 w-full items-start mt-2"
          >
            <div className="w-7 h-7 shrink-0 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 mt-1">
              <span className="text-[10px]">✨</span>
            </div>
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5 w-max">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}