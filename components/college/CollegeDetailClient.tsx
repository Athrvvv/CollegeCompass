"use client"

import { useState } from "react"
import Image from "next/image"
import { useNotebook } from "@/context/NotebookContext"
import { useComparison } from "@/context/ComparisonContext"

type TabType = "Info" | "Courses & Fees" | "CutOff" | "Placement" | "Reviews" | "Location"

export default function CollegeDetailClient({
  college,
  details
}: {
  college: any
  details: any
}) {
  const [activeTab, setActiveTab] = useState<TabType>("Info")
  const [imgSrc, setImgSrc] = useState(college.logo_url || "/college-placeholder.png")

  const { addNote, isInNotebook } = useNotebook()
  const { addCollegeToCompare, isCollegeInComparison } = useComparison()

  const isSaved = isInNotebook(college.college_id.toString())
  const isCompared = isCollegeInComparison(college.college_id)

  const TABS: TabType[] = ["Info", "Courses & Fees", "CutOff", "Placement", "Reviews", "Location"]

  const handleAddToNotes = () => {
    if (isSaved) return
    addNote({
      note_id: college.college_id.toString(),
      note_name: college.college_name,
      remark: `Saved from college detail page. ${college.city}, ${college.state}`,
      data: [{
        college_id: college.college_id,
        college_name: college.college_name,
        city: college.city,
        state: college.state,
        rating: college.rating,
        highest_package: college.highest_package
      }]
    })
  }

  const handleAddToCompare = () => {
    if (isCompared) return
    const success = addCollegeToCompare({
      college_id: college.college_id,
      college_name: college.college_name,
      logo_url: college.logo_url,
      city: college.city,
      state: college.state
    })
    if (!success) {
      alert("Comparison list is full (max 4 colleges).")
    }
  }

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
        <div className="flex flex-col sm:flex-row gap-4 mt-12 mb-2 lg:mb-0">
          <button 
            onClick={handleAddToCompare}
            className={`flex-1 flex items-center justify-center gap-2 group relative overflow-hidden py-4 px-6 rounded-2xl text-sm font-bold transition-all duration-300 active:scale-[0.98] ${
              isCompared 
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' 
                : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white shadow-xl shadow-black/20'
            }`}
          >
            <svg 
              className={`w-4 h-4 transition-transform duration-500 ${isCompared ? 'rotate-0' : 'group-hover:rotate-12'}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>{isCompared ? 'In Comparison' : 'Compare College'}</span>
            
            {/* Hover Shine Effect */}
            {!isCompared && (
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
            )}
          </button>

          <button 
            onClick={handleAddToNotes}
            className={`flex-1 flex items-center justify-center gap-2 group relative overflow-hidden py-4 px-6 rounded-2xl text-sm font-bold transition-all duration-300 active:scale-[0.98] ${
              isSaved 
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white shadow-xl shadow-black/20'
            }`}
          >
            <svg 
              className={`w-4 h-4 transition-all duration-500 ${isSaved ? 'scale-110 fill-emerald-300/20' : 'group-hover:-translate-y-0.5'}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>{isSaved ? 'Saved in Notes' : 'Add to Notes'}</span>
            
            {/* Hover Shine Effect */}
            {!isSaved && (
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
            )}
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

              {activeTab === "Location" && (
                <div className="bg-white p-0 rounded-2xl border border-gray-100 shadow-xl overflow-hidden relative group h-[500px]">
                  {/* Google Maps Iframe */}
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps?q=${encodeURIComponent(college.college_name + " " + college.city + " " + college.state)}&output=embed`}
                    className="grayscale-[0.2] contrast-[1.1] transition-all duration-700 group-hover:grayscale-0"
                  />

                  {/* Glassmorphic Info Card Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-500 hover:bg-white/90 hover:shadow-[0_12px_48px_rgba(0,0,0,0.15)]">
                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                          {college.college_name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1.5 font-medium">
                          <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {college.city}, {college.state}
                        </p>
                      </div>

                      <div className="h-px bg-gray-200/50 w-full" />

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(college.college_name + " " + college.city + " " + college.state)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-indigo-600 text-white rounded-xl text-sm font-bold transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L16 4m0 13V4m0 0L9 7" />
                        </svg>
                        Get Directions
                      </a>
                    </div>
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
