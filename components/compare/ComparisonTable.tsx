"use client"

import { useState } from "react"
import Image from "next/image"

type TabType = "General" | "Placements" | "Courses" | "Cutoff" | "Ratings"

export default function ComparisonTable({ data }: { data: any[] }) {
  const [activeTab, setActiveTab] = useState<TabType>("General")
  const TABS: TabType[] = ["General", "Placements", "Courses", "Cutoff", "Ratings"]

  const renderGeneral = () => {
    const features = [
      { label: "Location", key: (c: any) => `${c.college.city}, ${c.college.state}` },
      { label: "University Type", key: (c: any) => c.college.typeofuni },
      { label: "Established", key: (c: any) => c.college.established_year },
      { label: "Approvals", key: (c: any) => c.college.approvals || "N/A" },
      { label: "Top Exams", key: (c: any) => c.college.top_exams?.join(", ") || "N/A" },
    ];

    return (
      <div className="overflow-x-auto w-full custom-scrollbar snap-x snap-mandatory">
        <table className="w-full border-separate border-spacing-0 min-w-max">
          <thead>
            <tr className="bg-slate-900/60 border-y border-white/10">
              <th className="px-5 py-4 sm:px-6 sm:py-5 text-left text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] w-[120px] sm:w-[180px] shrink-0 border-r border-white/5">
                Feature
              </th>
              {data.map((item, i) => (
                <th key={i} className="px-5 py-4 sm:px-6 sm:py-5 text-left text-sm font-black text-white min-w-[200px] sm:min-w-[260px] snap-start border-l border-white/5">
                  <div className="line-clamp-2 leading-tight">
                    {item.college.college_name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {features.map((row, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-5 py-4 sm:px-6 sm:py-5 text-[10px] sm:text-xs font-bold text-gray-400 group-hover:text-indigo-300 transition-colors uppercase tracking-wider border-r border-white/5">
                  {row.label}
                </td>
                {data.map((item, j) => (
                  <td key={j} className="px-5 py-4 sm:px-6 sm:py-5 text-xs sm:text-sm text-gray-300 border-l border-white/5 font-medium leading-relaxed bg-white/[0.01]">
                    {row.key(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderPlacements = () => {
    const metrics = [
      { label: "Highest Package", key: (c: any) => c.details.placements[0] ? `₹${Number(c.details.placements[0].highest_package).toLocaleString('en-IN')}` : "N/A" },
      { label: "Average Package", key: (c: any) => c.details.placements[0] ? `₹${Number(c.details.placements[0].avg_package).toLocaleString('en-IN')}` : "N/A" },
      { label: "Lowest Package", key: (c: any) => c.details.placements[0] ? `₹${Number(c.details.placements[0].lowest_package).toLocaleString('en-IN')}` : "N/A" },
    ];

    return (
      <div className="overflow-x-auto w-full custom-scrollbar snap-x snap-mandatory">
        <table className="w-full border-separate border-spacing-0 min-w-max">
          <thead>
            <tr className="bg-slate-900/60 border-y border-white/10">
              <th className="px-5 py-4 sm:px-6 sm:py-5 text-left text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] w-[120px] sm:w-[180px] shrink-0 border-r border-white/5">
                Metric
              </th>
              {data.map((item, i) => (
                <th key={i} className="px-5 py-4 sm:px-6 sm:py-5 text-left text-sm font-black text-white min-w-[200px] sm:min-w-[260px] snap-start border-l border-white/5">
                  <div className="line-clamp-2 leading-tight">
                    {item.college.college_name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {metrics.map((row, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-5 py-4 sm:px-6 sm:py-5 text-[10px] sm:text-xs font-bold text-gray-400 group-hover:text-indigo-300 transition-colors uppercase tracking-wider border-r border-white/5">
                  {row.label}
                </td>
                {data.map((item, j) => (
                  <td key={j} className="px-5 py-4 sm:px-6 sm:py-5 text-[15px] sm:text-base border-l border-white/5 font-black text-indigo-400 bg-indigo-500/[0.02]">
                    {row.key(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderCourses = () => (
    <div className="overflow-x-auto custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6 p-4 md:p-8">
        {data.map((item, i) => (
          <div key={i} className="bg-white/[0.03] rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 blur-2xl rounded-full" />
            <h3 className="font-black text-white text-sm mb-6 pb-3 border-b border-white/5 truncate group-hover:text-indigo-300 transition-colors">{item.college.college_name}</h3>
            <div className="space-y-4">
              {item.details.courses.map((course: any, j: number) => (
                <div key={j} className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all shadow-xl">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1.5">{course.level}</p>
                  <p className="text-xs font-bold text-gray-200 leading-tight mb-3">{course.course_name}</p>
                  <p className="text-xl font-black text-white">₹{Number(course.total_fees).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCutoff = () => (
    <div className="overflow-x-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6 p-4 md:p-8">
        {data.map((item, i) => (
          <div key={i} className="bg-white/[0.03] rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 blur-2xl rounded-full" />
            <h3 className="font-black text-white text-sm mb-6 pb-3 border-b border-white/5 truncate group-hover:text-violet-300 transition-colors">{item.college.college_name}</h3>
            <div className="space-y-3">
              {item.details.cutoffs.length > 0 ? item.details.cutoffs.map((cutoff: any, j: number) => (
                <div key={j} className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all shadow-xl">
                  <div className="flex justify-between items-start mb-2.5">
                    <p className="text-[9px] font-black bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-violet-500/20">{cutoff.exam_name}</p>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{cutoff.year}</p>
                  </div>
                  <p className="text-[11px] font-bold text-gray-200 leading-tight mb-2.5 truncate">{cutoff.course_name}</p>
                  <div className="flex justify-between items-end pt-2 border-t border-white/5">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{cutoff.category}</p>
                    <p className="text-sm font-black text-indigo-400">{cutoff.cutoff_value}</p>
                  </div>
                </div>
              )) : <p className="text-xs text-gray-500 italic py-4 text-center">No cutoff records found</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderRatings = () => {
    const categories = [
      { label: "Hostel", key: "hostel" },
      { label: "Academic", key: "academic" },
      { label: "Faculty", key: "faculty" },
      { label: "Infrastructure", key: "infra" },
      { label: "Placement", key: "placement" },
    ];

    return (
      <div className="overflow-x-auto w-full custom-scrollbar snap-x snap-mandatory">
        <table className="w-full border-separate border-spacing-0 min-w-max">
          <thead>
            <tr className="bg-slate-900/60 border-y border-white/10">
              <th className="px-5 py-4 sm:px-6 sm:py-5 text-left text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] w-[120px] sm:w-[180px] shrink-0 border-r border-white/5">
                Category
              </th>
              {data.map((item, i) => (
                <th key={i} className="px-5 py-4 sm:px-6 sm:py-5 text-left text-sm font-black text-white min-w-[200px] sm:min-w-[260px] snap-start border-l border-white/5">
                  <div className="line-clamp-2 leading-tight">
                    {item.college.college_name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.map((row, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-5 py-4 sm:px-6 sm:py-5 text-[10px] sm:text-xs font-bold text-gray-400 group-hover:text-orange-300 transition-colors uppercase tracking-wider border-r border-white/5">
                  {row.label}
                </td>
                {data.map((item, j) => (
                  <td key={j} className="px-5 py-4 sm:px-6 sm:py-5 text-sm border-l border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[120px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                              className="h-full bg-linear-to-r from-amber-400 to-orange-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all duration-1000" 
                              style={{ width: `${(item.details?.ratings?.[row.key as keyof typeof item.details.ratings] || 0) * 20}%` }}
                          />
                      </div>
                      <span className="font-black text-white text-[11px] sm:text-xs">{item.details?.ratings?.[row.key as keyof typeof item.details.ratings] || "0.0"}</span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-3xl overflow-hidden ring-1 ring-white/5">
      
      {/* Tabs Header */}
      <div className="flex items-center px-4 md:px-10 bg-white/[0.02] border-b border-white/5 overflow-x-auto no-scrollbar pt-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 pb-6 text-xs font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
              activeTab === tab 
                ? 'text-indigo-400 opacity-100' 
                : 'text-gray-500 hover:text-white opacity-60 hover:opacity-100'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-8 right-8 h-1 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)]" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[450px]">
        <div className="animate-in fade-in zoom-in-95 duration-500">
          {activeTab === "General" && renderGeneral()}
          {activeTab === "Placements" && renderPlacements()}
          {activeTab === "Courses" && renderCourses()}
          {activeTab === "Cutoff" && renderCutoff()}
          {activeTab === "Ratings" && renderRatings()}
        </div>
      </div>
    </div>
  )
}
