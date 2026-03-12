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
    <div className="flex flex-col w-full h-full bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
      
      {/* HEADER HERO SECTION */}
      <div className="relative bg-slate-900 border-b border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
        
        {/* LOGO */}
        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-xl p-2 shrink-0 shadow-sm border border-gray-200 relative flex items-center justify-center">
          <Image
            src={imgSrc}
            alt={college.college_name}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 96px, 128px"
            onError={() => setImgSrc("/college-placeholder.png")}
          />
        </div>

        {/* TITLE AND HIGH LEVEL STATS */}
        <div className="flex-1 text-white">
          <h1 className="text-2xl md:text-3xl font-bold font-sans tracking-tight mb-2">
            {college.college_name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 font-medium font-sans">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {college.city}, {college.state}
            </span>
            <span className="text-gray-500">•</span>
            <span>{college.typeofuni}</span>
            <span className="text-gray-500">•</span>
            <span>Estd {college.established_year}</span>
          </div>
        </div>

        {/* TOP RIGHT RATINGS AND CTA */}
        <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-white">{college.rating || 'N/A'}</span>
            <div className="flex flex-col text-xs text-gray-300">
               <span className="flex text-amber-400 text-sm">★★★★☆</span>
               <span>(128 Reviews)</span>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none border border-white/20 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              Will You Get In
            </button>
            <button className="flex-1 md:flex-none border border-white/20 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              Contact Details
            </button>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="border-b border-gray-200 px-4 md:px-8 bg-white sticky top-0 z-10 w-full overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-6 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-semibold border-b-2 transition-colors duration-200 ${
                activeTab === tab 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT AND SIDEBAR GRID */}
      <div className="flex flex-col lg:flex-row w-full p-4 md:p-8 gap-8 bg-gray-50 min-h-[500px]">
        
        {/* LEFT COLUMN - MAIN CONTENT */}
        <div className="flex-1 flex flex-col gap-8 min-w-0">
          {activeTab === "Info" && (
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{college.college_name} Latest Updates</h2>
              <p className="text-gray-700 leading-relaxed">
                {college.approvals && (
                  <span className="block mb-4 font-medium text-indigo-700">
                    Approved by: {college.approvals.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                )}
                {college.established_year && (
                  <span>Established in <strong>{college.established_year}</strong>, this is a premier <strong>{college.typeofuni}</strong> institution located in {college.city}, {college.state}. </span>
                )}
                The college is widely recognized for its excellent placement records and state-of-the-art infrastructure. Students consistently secure top packages across various streams.
              </p>
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

        {/* RIGHT COLUMN - STICKY SIDEBAR */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="sticky top-[100px] bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
            <h3 className="text-sm font-bold text-gray-900 mb-4 whitespace-nowrap">Are You Interested in this College?</h3>
            <div className="flex flex-col gap-3">
              <button className="w-full bg-[#f16322] hover:bg-[#d6551b] text-white py-3 rounded-lg font-bold transition-colors">
                Apply Now »
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors">
                 Download Brochure ⬇
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
