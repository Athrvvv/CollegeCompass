"use client"
import PreviousChats from "@/components/dashboard/PreviousChats"

export default function ChatSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col px-4 py-5 shrink-0 overflow-y-auto">
{/* USER
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
          👤
        </div>

        <p className="text-sm font-medium text-slate-300">
          user_name
        </p>
      </div>
*/}

      {/* CENTER AREA */}
      <div className="flex-1 flex flex-col justify-center">

        <p className="text-xl uppercase tracking-wide text-slate-400 mb-3">
          Ask me anything &gt;3
        </p>

        <div className="flex items-center bg-slate-800 rounded-lg px-3 py-1.5 mb-5">

          <input
            type="text"
            placeholder="Search queries..."
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-slate-500"
          />

          <button className="ml-2 text-slate-400 hover:text-white text-xs">
            ➤
          </button>

        </div>


        {/* PREVIOUS CHATS */}
        <PreviousChats
          chats={[
            { id: 1, title: "previously conducted chat number 1" },
            { id: 2, title: "previously conducted chat number 2" },
          ]}
        />

      </div>

    </aside>
  )
}