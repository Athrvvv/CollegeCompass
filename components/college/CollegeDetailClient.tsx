"use client"

import { useState } from "react"
import Image from "next/image"

type TabType = "Info" | "Courses & Fees" | "CutOff" | "Placement" | "Reviews"

export default function CollegeDetailClient({
  college,
  details
}: {
  college: any
  details: any
}) {
  const [activeTab, setActiveTab] = useState<TabType>("Info")
  const [imgSrc, setImgSrc] = useState(college.logo_url || "/college-placeholder.png")

  const TABS: TabType[] = ["Info", "Courses & Fees", "CutOff", "Placement", "Reviews"]

  return (
    <div className="flex flex-col lg:flex-row w-full h-full bg-white relative">
      
      {/* LEFT DARK HERO CARD */}
      <div className="w-full lg:w-[420px] xl:w-[480px] shrink-0 bg-[#0A1128] text-white p-6 md:p-10 flex flex-col justify-between rounded-b-[40px] lg:rounded-b-none lg:rounded-r-[70px] relative z-20 shadow-[10px_0_30px_rgba(0,0,0,0.1)] min-h-fit lg:min-h-[650px] border-r border-[#1a2235]">
        <div className="flex flex-col gap-10">
          
          {/* Top row: Logo and Rating */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="w-24 h-24 md:w-[120px] md:h-[120px] bg-white rounded-[24px] p-2 shrink-0 shadow-lg relative flex items-center justify-center overflow-hidden border-2 border-white/5">
              <Image
                src={imgSrc}
                alt={college.college_name}
                fill
                className="object-contain p-2.5"
                sizes="(max-width: 768px) 96px, 120px"
                onError={() => setImgSrc("/college-placeholder.png")}
              />
            </div>
            
            {/* Rating */}
            <div className="flex flex-col pt-2">
              <div className="flex items-center gap-3">
                <span className="text-4xl md:text-[52px] font-extrabold tracking-tight text-white leading-none">{college.rating || '4.4'}</span>
                <span className="text-[#FFB800] text-lg md:text-xl tracking-widest flex">★★★★☆</span>
              </div>
              <span className="text-gray-300 text-sm mt-2 font-medium">(128 Reviews)</span>
            </div>
          </div>

          {/* Title and Stats */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-sans tracking-tight leading-[1.3] text-white">
              {college.college_name}
            </h1>
            <div className="flex flex-col lg:flex-row lg:flex-wrap items-start lg:items-center gap-x-3 gap-y-2 text-sm text-gray-300 font-medium mt-1">
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {college.city}, {college.state}
              </span>
              <span className="hidden lg:inline text-gray-600">•</span>
              <span className="whitespace-nowrap">{college.typeofuni}</span>
              <span className="hidden lg:inline text-gray-600">•</span>
              <span className="whitespace-nowrap">Estd {college.established_year}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-12 mb-2 lg:mb-0">
          <button className="flex-1 border border-white/20 bg-transparent hover:bg-white/10 text-white py-3.5 px-4 rounded-[12px] text-sm font-semibold transition-all duration-200">
            Compare this College
          </button>
          <button className="flex-1 border border-white/20 bg-transparent hover:bg-white/10 text-white py-3.5 px-4 rounded-[12px] text-sm font-semibold transition-all duration-200">
            Add this to the Notes
          </button>
        </div>
      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative z-10 w-full overflow-hidden">
        
        {/* TABS NAVIGATION */}
        <div className="border-b border-gray-100 px-6 md:px-12 bg-white sticky top-0 z-30 w-full overflow-x-auto no-scrollbar pt-6 lg:pt-10">
          <div className="flex items-center gap-8 md:gap-12 min-w-max pb-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-base md:text-lg font-bold transition-colors duration-200 relative ${
                  activeTab === tab 
                    ? 'text-[#4F46E5]' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col xl:flex-row w-full p-6 md:p-12 gap-8 min-h-[500px]">
            
            {/* LEFT COLUMN - MAIN CONTENT */}
            <div className="flex-1 flex flex-col gap-8 min-w-0">
              {activeTab === "Info" && (
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{college.college_name} Latest Updates</h2>
                  <div className="text-gray-700 leading-relaxed">
                    {college.approvals && (
                      <div className="flex items-center gap-2 mb-5">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Recognized By</span>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 shadow-sm transition-all hover:shadow-md hover:bg-indigo-100/50 cursor-default">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-bold tracking-wide">
                            {college.approvals.replace(/([A-Z])/g, ' $1').trim()} Approved
                          </span>
                        </div>
                      </div>
                    )}
                    <p>
                      {college.established_year && (
                        <span>Established in <strong>{college.established_year}</strong>, this is a premier <strong>{college.typeofuni}</strong> institution located in {college.city}, {college.state}. </span>
                      )}
                      The college is widely recognized for its excellent placement records and state-of-the-art infrastructure. Students consistently secure top packages across various streams.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "Placement" && details?.placements && (
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                   <h2 className="text-xl font-bold text-gray-900 mb-6">Placement Records</h2>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100/50">
                         <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Highest Package</p>
                         <p className="text-2xl font-bold text-indigo-900">₹{Number(details.placements[0]?.highest_package || 0).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100/50">
                         <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Average Package</p>
                         <p className="text-2xl font-bold text-emerald-900">₹{Number(details.placements[0]?.avg_package || 0).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200/50">
                         <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Lowest Package</p>
                         <p className="text-2xl font-bold text-gray-900">₹{Number(details.placements[0]?.lowest_package || 0).toLocaleString('en-IN')}</p>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === "Courses & Fees" && details?.courses && (
                <div className="bg-white p-0 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                   <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-[#edf2fa] text-gray-900 font-bold border-b border-gray-200">
                         <tr>
                            <th className="px-6 py-4">Courses</th>
                            <th className="px-6 py-4">Total Fees</th>
                            <th className="px-6 py-4 hidden md:table-cell">Duration</th>
                            <th className="px-6 py-4 hidden sm:table-cell">Eligibility</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                         {details.courses.map((course: any, i: number) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                               <td className="px-6 py-4">
                                  <p className="font-semibold text-blue-600">{course.course_name}</p>
                                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{course.level}</p>
                               </td>
                               <td className="px-6 py-4">
                                  <p className="font-medium">₹{Number(course.total_fees).toLocaleString('en-IN')}</p>
                               </td>
                               <td className="px-6 py-4 hidden md:table-cell">
                                  <p>{course.duration_years} Years</p>
                               </td>
                               <td className="px-6 py-4 hidden sm:table-cell whitespace-normal text-xs text-balance max-w-xs">
                                  <p>{course.base_eligibility || "N/A"}</p>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              )}

              {activeTab === "CutOff" && details?.cutoffs && (
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                   <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Cutoffs</h2>
                   <div className="space-y-3">
                     {details.cutoffs.map((cutoff: any, i: number) => (
                       <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                          <div className="mb-2 sm:mb-0">
                            <p className="text-base font-semibold text-gray-900">{cutoff.course_name}</p>
                            <div className="flex gap-2 mt-1.5">
                               <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-semibold">{cutoff.exam_name}</span>
                               <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold">{cutoff.category}</span>
                            </div>
                          </div>
                          <div className="sm:text-right">
                            <p className="text-sm text-gray-500 font-medium mb-0.5">{cutoff.cutoff_type}</p>
                            <p className="text-xl font-bold text-emerald-600">{cutoff.cutoff_value}</p>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
              )}

              {activeTab === "Reviews" && details?.ratings && (
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                   <h2 className="text-xl font-bold text-gray-900 mb-6">Detailed Ratings</h2>
                   <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                     {[
                       { label: 'Academic', val: details.ratings.academic, icon: '📚' },
                       { label: 'Faculty', val: details.ratings.faculty, icon: '👨‍🏫' },
                       { label: 'Infrastructure', val: details.ratings.infra, icon: '🏢' },
                       { label: 'Placement', val: details.ratings.placement, icon: '💼' },
                       { label: 'Hostel', val: details.ratings.hostel, icon: '🛏️' },
                     ].map((item, i) => item.val != null && (
                       <div key={i} className="bg-gray-50/80 border border-gray-100 rounded-lg p-5 text-center flex flex-col items-center justify-center shadow-sm">
                         <span className="text-2xl mb-2">{item.icon}</span>
                         <p className="text-2xl font-bold text-gray-900 mb-1">{Number(item.val).toFixed(1)}</p>
                         <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">{item.label}</p>
                       </div>
                     ))}
                   </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
