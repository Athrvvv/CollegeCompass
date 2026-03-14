"use client"

type Props = {
  id: string
  title: string
  points: string[]
  remark?: string
  selected: boolean
  toggleSelect: (id: string) => void
}

export default function NoteCard({
  id,
  title,
  points,
  remark,
  selected,
  toggleSelect,
}: Props) {
  return (
    <div
      onClick={() => toggleSelect(id)}
      className={`group border rounded-[24px] p-6 text-sm cursor-pointer transition-all duration-300 h-full
      ${selected 
        ? "bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10" 
        : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-bold text-lg tracking-tight ${selected ? "text-blue-400" : "text-white"}`}>{title}</h3>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? "bg-blue-500 border-blue-500" : "border-white/10"}`}>
          {selected ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          )}
        </div>
      </div>

      <ul className="text-gray-400 text-xs space-y-2 font-medium">
        {points.slice(0, 3).map((p, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-blue-500">•</span>
            <span>{p}</span>
          </li>
        ))}
        {remark && (
          <li className="mt-2 text-[10px] italic text-gray-500 border-t border-gray-800/50 pt-2">
            {remark}
          </li>
        )}
      </ul>
    </div>
  )
}