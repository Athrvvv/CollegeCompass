import NotesList from "./NotesList"

export default function ReportSidebar() {
  return (
    <aside className="w-64 border-l bg-slate-900 p-4 flex flex-col shrink-0 overflow-y-auto">

      {/* Add Note */}
      <button className="mb-4 w-full border border-slate-700 rounded-md py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition">
        Add new note +
      </button>

      <NotesList />

    </aside>
  )
}