"use client"

import { useState, useMemo, useEffect } from "react"
import FilterSidebar from "@/components/explore/FilterSidebar"
import DashboardGrid from "@/components/dashboard/DashboardGrid"
import DashboardCard from "@/components/dashboard/DashboardCard"
import { useSearchParams } from "next/navigation"

export default function ExploreClient({ colleges }: { colleges: any[] }) {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ""

  const [filters, setFilters] = useState({
    states: [] as string[],
    types: [] as string[],
    packageRange: [0, 100] as [number, number],
    feeRange: [0, 5000000] as [number, number],
    minInfraRating: 0,
    levels: [] as string[],
    streams: [] as string[]
  })

  // Pagination state - updated to 18 per page
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 18

  // Extract metadata for sidebar
  const availableStates = useMemo(() => Array.from(new Set(colleges.map(c => c.state).filter(Boolean))), [colleges])
  const availableTypes = useMemo(() => Array.from(new Set(colleges.map(c => c.typeofuni).filter(Boolean))), [colleges])
  
  const availableStreams = useMemo(() => {
    const streams = new Set<string>()
    colleges.forEach(c => c.courses_data?.forEach((course: any) => streams.add(course.name)))
    return Array.from(streams)
  }, [colleges])

  const availableLevels = useMemo(() => {
    const levels = new Set<string>()
    colleges.forEach(c => c.courses_data?.forEach((course: any) => levels.add(course.level)))
    return Array.from(levels)
  }, [colleges])

  // Advanced Filtering Logic
  const filteredColleges = useMemo(() => {
    return colleges.filter(college => {
      // 1. Text Search
      const matchSearch = q 
        ? college.college_name.toLowerCase().includes(q.toLowerCase()) || 
          college.city.toLowerCase().includes(q.toLowerCase()) || 
          college.state.toLowerCase().includes(q.toLowerCase())
        : true

      // 2. State & Type
      const matchState = filters.states.length > 0 ? filters.states.includes(college.state) : true
      const matchType = filters.types.length > 0 ? filters.types.includes(college.typeofuni) : true

      // 3. Package Range
      const pkg = Number(college.latest_highest_package) || 0
      const matchPkg = pkg >= filters.packageRange[0] && pkg <= filters.packageRange[1]

      // 4. Fee (Max fee among college courses should be within selected range)
      const collegeFees = college.courses_data?.map((c: any) => Number(c.fee) || 0) || [0]
      const maxColFee = Math.max(...collegeFees)
      const matchFee = maxColFee <= filters.feeRange[1]

      // 5. Rating
      const infra = Number(college.infra_rating) || 0
      const matchRating = infra >= filters.minInfraRating

      // 6. Levels & Streams
      const collegeLevels = college.courses_data?.map((c: any) => c.level) || []
      const collegeCourses = college.courses_data?.map((c: any) => c.name) || []
      
      const matchLevel = filters.levels.length > 0 
        ? filters.levels.some(l => collegeLevels.includes(l)) 
        : true
        
      const matchStream = filters.streams.length > 0 
        ? filters.streams.some(s => collegeCourses.includes(s)) 
        : true

      return matchSearch && matchState && matchType && matchPkg && matchFee && matchRating && matchLevel && matchStream
    })
  }, [colleges, q, filters])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, q])

  // Paginated Results
  const paginatedColleges = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredColleges.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredColleges, currentPage])

  const totalPages = Math.ceil(filteredColleges.length / itemsPerPage)

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 min-h-screen">
      
      {/* Dynamic Header */}
      <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Global Discovery</span>
            <div className="h-px w-12 bg-gray-100" />
            <span className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">{filteredColleges.length} Institutions Found</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none">
            Find your <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-900 via-indigo-600 to-violet-600">Future.</span>
          </h1>
          <p className="text-gray-400 font-bold mt-6 text-xl max-w-xl leading-relaxed">
            Advanced search across {colleges.length} premium colleges. Filter by placements, fees, and global infrastructure ratings.
          </p>
        </div>

        {/* Quick View Stats */}
        <div className="flex gap-4">
          <div className="bg-gray-50 border border-gray-100 rounded-[32px] p-6 text-center min-w-[140px]">
            <div className="text-2xl font-black text-gray-900 leading-none">18</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Per Page</div>
          </div>
          <div className="bg-indigo-600 rounded-[32px] p-6 text-center min-w-[140px] shadow-xl shadow-indigo-600/20">
            <div className="text-2xl font-black text-white leading-none">{filteredColleges.length}</div>
            <div className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mt-2">Matching</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-20">
        
        {/* Advanced Sidebar */}
        <FilterSidebar 
          onFilterChange={setFilters} 
          activeFilters={filters} 
          availableStates={availableStates}
          availableTypes={availableTypes}
          availableStreams={availableStreams}
          availableLevels={availableLevels}
        />

        {/* Results Engine */}
        <div className="flex-1 min-w-0">
          {filteredColleges.length > 0 ? (
            <div className="space-y-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {paginatedColleges.map((college) => (
                  <DashboardCard
                    key={college.college_id}
                    college_id={college.college_id}
                    title={college.college_name}
                    description={college.typeofuni}
                    logo={college.logo_url}
                    rating={college.rating}
                    city={college.city}
                    state={college.state}
                    established={college.established_year}
                    typeofuni={college.typeofuni}
                    approvals={college.approvals}
                    highest_package={college.latest_highest_package}
                    avg_package={college.latest_avg_package}
                    top_exams={college.top_exams}
                  />
                ))}
              </div>

              {/* Ultra-Modern Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-6 pb-20 mt-12">
                  <div className="h-px w-full bg-gray-100 mb-4" />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border-2 border-gray-100 text-gray-900 hover:border-indigo-600 disabled:opacity-30 disabled:hover:border-gray-100 transition-all active:scale-95 group"
                    >
                      <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <div className="flex items-center gap-2 px-8 py-4 bg-gray-900 rounded-2xl shadow-2xl">
                      <span className="text-lg font-black text-white tracking-tighter">Page {currentPage}</span>
                      <span className="text-gray-500 font-bold mx-2">of</span>
                      <span className="text-lg font-black text-indigo-400 tracking-tighter">{totalPages}</span>
                    </div>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border-2 border-gray-100 text-gray-900 hover:border-indigo-600 disabled:opacity-30 disabled:hover:border-gray-100 transition-all active:scale-95 group"
                    >
                      <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Institutional Explorer Engine v2.0</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-gray-50/50 rounded-[64px] border-4 border-dashed border-gray-200 animate-in zoom-in-95 duration-700">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-8 relative">
                <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping" />
                <span className="text-4xl">🔭</span>
              </div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter">No Matches Found</h3>
              <p className="text-gray-400 font-bold mt-3 text-center max-w-sm px-6 text-xl">
                We couldn't locate any institutions with those specific criteria. Try expanding your search horizons!
              </p>
              <button 
                onClick={() => setFilters({
                  states: [],
                  types: [],
                  packageRange: [0, 100],
                  feeRange: [0, 5000000],
                  minInfraRating: 0,
                  levels: [],
                  streams: []
                })}
                className="mt-12 font-black text-sm text-white bg-gray-900 hover:bg-black uppercase tracking-widest px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95"
              >
                Reset Deep Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
