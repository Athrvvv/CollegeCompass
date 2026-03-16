import { 
  LineChart, Line, YAxis, ResponsiveContainer, 
  BarChart, Bar
} from "recharts"

type Props = {
  id: string
  title: string
  points: string[]
  remark?: string
  advisorContent?: string
  chartData?: any[]
  chartType?: "LINE" | "BAR"
  selected: boolean
  toggleSelect: (id: string) => void
  onRemove: (id: string) => void
}

export default function NoteCard({
  id,
  title,
  points,
  remark,
  advisorContent,
  chartData,
  chartType,
  selected,
  toggleSelect,
  onRemove,
}: Props) {
  return (
    <div
      onClick={() => toggleSelect(id)}
      className={`group relative border rounded-[24px] p-6 text-sm cursor-pointer transition-all duration-300 h-full
      ${selected 
        ? "bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10" 
        : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"}`}
    >
      {/* REMOVE BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-10"
        title="Remove Note"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

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

      {/* PREVIEW CONTENT */}
      <div className="flex-1 min-h-[140px] mt-2 group-hover:bg-white/5 rounded-xl transition-colors p-2">
        {chartData && chartData.length > 0 ? (
          <div className="h-[120px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "LINE" ? (
                <LineChart data={chartData}>
                  <YAxis reversed hide domain={['auto', 'auto']} />
                  <Line 
                    type="monotone" 
                    dataKey="rank" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    dot={false} 
                    animationDuration={1500}
                  />
                </LineChart>
              ) : (
                <BarChart data={chartData}>
                  <Bar 
                    dataKey="val_0" 
                    fill="#6366f1" 
                    radius={[4, 4, 0, 0]} 
                  />
                  {chartData[0] && "val_1" in chartData[0] && (
                    <Bar 
                      dataKey="val_1" 
                      fill="#10b981" 
                      radius={[4, 4, 0, 0]} 
                    />
                  )}
                </BarChart>
              )}
            </ResponsiveContainer>
            <div className="text-[9px] font-black uppercase tracking-tighter text-gray-500 mt-2 flex justify-between px-1">
               <span>Trend Analysis Preview</span>
               <span>{chartType === "LINE" ? "Historical Range" : "Side-by-Side"}</span>
            </div>
          </div>
        ) : (
          <ul className="text-gray-400 text-xs space-y-2 font-medium">
            {points.length > 0 ? (
              points.slice(0, 3).map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span>{p}</span>
                </li>
              ))
            ) : advisorContent ? (
              <li className="flex flex-col gap-2">
                <span className="text-blue-400 font-bold uppercase tracking-widest text-[9px]">AI Advisory Preview</span>
                <p className="line-clamp-4 text-gray-300 italic leading-relaxed">
                  "{advisorContent.replace(/[#*`]/g, '').substring(0, 150)}..."
                </p>
              </li>
            ) : (
              <li className="flex items-center justify-center h-full text-gray-600 italic text-[10px]">
                No preview data available
              </li>
            )}
          </ul>
        )}
      </div>

      {remark && (
        <div className="mt-4 text-[10px] italic text-gray-500 border-t border-gray-800/50 pt-3 line-clamp-2">
          {remark}
        </div>
      )}
    </div>
  )
}