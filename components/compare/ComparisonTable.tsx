"use client"

import { useState } from "react"
import Image from "next/image"

type TabType = "General" | "Placements" | "Courses" | "Cutoff" | "Ratings"

export default function ComparisonTable({ data }: { data: any[] }) {
  const [activeTab, setActiveTab] = useState<TabType>("General")
  const TABS: TabType[] = ["General", "Placements", "Courses", "Cutoff", "Ratings"]

  const renderGeneral = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-y border-gray-100">
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Feature</th>
            {data.map((item, i) => (
              <th key={i} className="px-6 py-4 text-left text-sm font-bold text-gray-900 border-l border-gray-100">
                {item.college.college_name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {[
            { label: "Location", key: (c: any) => `${c.college.city}, ${c.college.state}` },
            { label: "University Type", key: (c: any) => c.college.typeofuni },
            { label: "Established", key: (c: any) => c.college.established_year },
            { label: "Approvals", key: (c: any) => c.college.approvals || "N/A" },
            { label: "Top Exams", key: (c: any) => c.college.top_exams?.join(", ") || "N/A" },
          ].map((row, i) => (
            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-bold text-gray-600">{row.label}</td>
              {data.map((item, j) => (
                <td key={j} className="px-6 py-4 text-sm text-gray-700 border-l border-gray-100 font-medium">
                  {row.key(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderPlacements = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-y border-gray-100">
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Metric</th>
            {data.map((item, i) => (
              <th key={i} className="px-6 py-4 text-left text-sm font-bold text-gray-900 border-l border-gray-100">
                {item.college.college_name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {[
            { label: "Highest Package", key: (c: any) => c.details.placements[0] ? `₹${Number(c.details.placements[0].highest_package).toLocaleString('en-IN')}` : "N/A" },
            { label: "Average Package", key: (c: any) => c.details.placements[0] ? `₹${Number(c.details.placements[0].avg_package).toLocaleString('en-IN')}` : "N/A" },
            { label: "Lowest Package", key: (c: any) => c.details.placements[0] ? `₹${Number(c.details.placements[0].lowest_package).toLocaleString('en-IN')}` : "N/A" },
          ].map((row, i) => (
            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-bold text-gray-600">{row.label}</td>
              {data.map((item, j) => (
                <td key={j} className="px-6 py-4 text-sm border-l border-gray-100 font-bold text-indigo-600">
                  {row.key(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderCourses = () => (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 p-6">
        {data.map((item, i) => (
          <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200 truncate">{item.college.college_name}</h3>
            <div className="space-y-4">
              {item.details.courses.map((course: any, j: number) => (
                <div key={j} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-indigo-600 uppercase mb-1">{course.level}</p>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{course.course_name}</p>
                  <p className="text-lg font-extrabold text-gray-900 mt-2">₹{Number(course.total_fees).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCutoff = () => (
    <div className="overflow-x-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 p-6">
        {data.map((item, i) => (
          <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200 truncate">{item.college.college_name}</h3>
            <div className="space-y-3">
              {item.details.cutoffs.length > 0 ? item.details.cutoffs.map((cutoff: any, j: number) => (
                <div key={j} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded uppercase">{cutoff.exam_name}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{cutoff.year}</p>
                  </div>
                  <p className="text-xs font-bold text-gray-900 leading-tight mb-1">{cutoff.course_name}</p>
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] text-gray-500 font-medium">{cutoff.category}</p>
                    <p className="text-sm font-black text-emerald-600">{cutoff.cutoff_value}</p>
                  </div>
                </div>
              )) : <p className="text-xs text-gray-400 italic">No cutoff data available</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderRatings = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-y border-gray-100">
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Category</th>
            {data.map((item, i) => (
              <th key={i} className="px-6 py-4 text-left text-sm font-bold text-gray-900 border-l border-gray-100">
                {item.college.college_name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {[
            { label: "Hostel", key: "hostel" },
            { label: "Academic", key: "academic" },
            { label: "Faculty", key: "faculty" },
            { label: "Infrastructure", key: "infra" },
            { label: "Placement", key: "placement" },
          ].map((row, i) => (
            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-bold text-gray-600">{row.label}</td>
              {data.map((item, j) => (
                <td key={j} className="px-6 py-4 text-sm border-l border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-amber-400 rounded-full" 
                            style={{ width: `${(item.details.ratings?.[row.key] || 0) * 20}%` }}
                        />
                    </div>
                    <span className="font-bold text-gray-900">{item.details.ratings?.[row.key] || "N/A"}</span>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] shadow-2xl shadow-gray-200/50 overflow-hidden ring-1 ring-black/5">
      
      {/* Tabs Header */}
      <div className="flex items-center px-4 md:px-8 bg-white border-b border-gray-100 overflow-x-auto no-scrollbar pt-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 pb-6 text-sm font-bold transition-all relative whitespace-nowrap ${
              activeTab === tab 
                ? 'text-indigo-600' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-4 right-4 h-1 bg-indigo-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === "General" && renderGeneral()}
        {activeTab === "Placements" && renderPlacements()}
        {activeTab === "Courses" && renderCourses()}
        {activeTab === "Cutoff" && renderCutoff()}
        {activeTab === "Ratings" && renderRatings()}
      </div>
    </div>
  )
}
