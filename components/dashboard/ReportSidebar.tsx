import NotesList from "./NotesList"

export default function ReportSidebar() {
  return (
    <aside className="w-72 border-l border-slate-800 bg-slate-900 px-6 py-8 flex flex-col shrink-0 overflow-y-auto h-full relative z-40 shadow-xl custom-scrollbar">

      <div className="mb-6 px-1">
        <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500 mb-2">
          Notes & Reports
        </h3>
      </div>

      {/* Add Note */}
      <button className="group relative mb-8 w-full bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-xl py-3 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm overflow-hidden">
         <div className="absolute inset-0 bg-indigo-500/5 translate-y-full group-hover:translate-y-0 transition-transform"></div>
         <span className="relative z-10">Add new entry +</span>
      </button>

      <div className="flex-1">
        <NotesList />
      </div>

    </aside>
  )
}