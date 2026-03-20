"use client"

import { useState, useMemo, useEffect } from "react"
import DashboardCard from "./DashboardCard"
import DashboardGrid from "./DashboardGrid"
import DiscoveryCard from "./DiscoveryCard"
import AdvanceFilter, { FilterState } from "./AdvanceFilter"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { getDiscoveryMeta } from "@/app/actions/getDiscoveryMeta"

export default function DashboardClient({ 
  initialColleges,
  initialSearchQuery
}: { 
  initialColleges: any[],
  initialSearchQuery: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || initialSearchQuery

  const [activeTab, setActiveTab] = useState<'colleges' | 'streams' | 'specializations' | 'exams' | 'courses'>('colleges')
  const [discoveryMeta, setDiscoveryMeta] = useState<{streams: any[], specializations: any[], exams: any[], courses: any[]} | null>(null)

  // Drill-down states
  const [selectedStream, setSelectedStream] = useState<string | null>(null)
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null)
  const [selectedExam, setSelectedExam] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  // Advanced Filter State
  const [filters, setFilters] = useState<FilterState>({
    minPackage: 0,
    maxFees: 5000000,
    minRating: 0,
    universityType: [],
    states: [],
    cities: [],
    levels: [],
    exams: [],
    specializations: [],
    streams: []
  })

  // Pagination States per tab
  const [collegePage, setCollegePage] = useState(1)
  const [streamPage, setStreamPage] = useState(1)
  const [specPage, setSpecPage] = useState(1)
  const [examPage, setExamPage] = useState(1)
  const [coursePage, setCoursePage] = useState(1)
  
  const itemsPerPage = 12

  // Fetch discovery meta on mount
  useEffect(() => {
    async function loadMeta() {
      const meta = await getDiscoveryMeta()
      setDiscoveryMeta(meta)
    }
    loadMeta()
  }, [])

  useEffect(() => {
    setSelectedStream(null)
    setSelectedSpec(null)
    setSelectedExam(null)
    setSelectedCourse(null)
    setCollegePage(1)
    setStreamPage(1)
    setSpecPage(1)
    setExamPage(1)
    setCoursePage(1)
  }, [activeTab])

  // Derive available filter options from initialColleges
  const availableOptions = useMemo(() => {
    const states = new Set<string>()
    const types = new Set<string>()
    const levels = new Set<string>()
    const exams = new Set<string>()
    const specializations = new Set<string>()
    const streams = new Set<string>()
    
    initialColleges.forEach(c => {
      if (c.state) states.add(c.state)
      if (c.typeofuni) types.add(c.typeofuni)
      c.courses_data?.forEach((course: any) => {
        if (course.level) levels.add(course.level)
      })
      c.exams_data?.forEach((exam: string) => {
        if (exam) exams.add(exam)
      })
      c.specializations_data?.forEach((spec: string) => {
        if (spec) specializations.add(spec)
      })
      c.streams_data?.forEach((stream: string) => {
        if (stream) streams.add(stream)
      })
    })

    return {
      states: Array.from(states).sort(),
      types: Array.from(types).sort(),
      levels: Array.from(levels).sort(),
      exams: Array.from(exams).sort(),
      specializations: Array.from(specializations).sort(),
      streams: Array.from(streams).sort(),
    }
  }, [initialColleges])

  // Filtering Logic for Colleges
  const filteredColleges = useMemo(() => {
    return initialColleges.filter(college => {
      // Search Match - check college name, city, state, AND streams/specializations
      const searchLower = q.toLowerCase()
      const matchSearch = q 
        ? college.college_name.toLowerCase().includes(searchLower) || 
          college.city.toLowerCase().includes(searchLower) || 
          college.state.toLowerCase().includes(searchLower) ||
          college.streams_data?.some((s: string) => s.toLowerCase().includes(searchLower)) ||
          college.specializations_data?.some((s: string) => s.toLowerCase().includes(searchLower))
        : true

      if (!matchSearch) return false

      // Placement Match
      if (filters.minPackage > 0) {
        const pkg = college.latest_highest_package || 0
        if (pkg < filters.minPackage) return false
      }

      // Fees Match
      if (filters.maxFees < 2000000) { 
        const fees = college.courses_data?.map((c: any) => c.fee).filter(Boolean) || []
        if (fees.length > 0) {
          const minFee = Math.min(...fees)
          if (minFee > filters.maxFees) return false
        } else {
          return false 
        }
      }

      // Rating Match
      if (filters.minRating > 0) {
        const rating = parseFloat(college.infra_rating) || 0
        if (rating < filters.minRating) return false
      }

      // University Type Match
      if (filters.universityType.length > 0) {
        if (!filters.universityType.includes(college.typeofuni)) return false
      }

      // States Match
      if (filters.states.length > 0) {
        if (!filters.states.includes(college.state)) return false
      }

      // Levels Match
      if (filters.levels.length > 0) {
        const hasLevel = college.courses_data?.some((c: any) => filters.levels.includes(c.level))
        if (!hasLevel) return false
      }

      // Exams Match
      if (filters.exams.length > 0) {
        const hasExam = college.exams_data?.some((e: string) => filters.exams.includes(e))
        if (!hasExam) return false
      }

      // Specializations Match
      if (filters.specializations.length > 0) {
        const hasSpec = college.specializations_data?.some((s: string) => filters.specializations.includes(s))
        if (!hasSpec) return false
      }

      // Streams Match
      if (filters.streams.length > 0) {
        const hasStream = college.streams_data?.some((s: string) => filters.streams.includes(s))
        if (!hasStream) return false
      }

      return true
    })
  }, [initialColleges, q, filters])

  // Subtab filtering (Search)
  const filteredStreams = useMemo(() => {
    if (!discoveryMeta) return []
    return discoveryMeta.streams.filter(s => s.name.toLowerCase().includes(q.toLowerCase()))
  }, [discoveryMeta, q])

  const filteredSpecs = useMemo(() => {
    if (!discoveryMeta) return []
    return discoveryMeta.specializations.filter(s => s.name.toLowerCase().includes(q.toLowerCase()))
  }, [discoveryMeta, q])

  const filteredExams = useMemo(() => {
    if (!discoveryMeta) return []
    return discoveryMeta.exams.filter(e => e.name.toLowerCase().includes(q.toLowerCase()))
  }, [discoveryMeta, q])

  // Reset pagination when search or filters change
  useEffect(() => {
    setCollegePage(1)
    setStreamPage(1)
    setSpecPage(1)
    setExamPage(1)
    setCoursePage(1)
  }, [q, filters])

  // Pagination Logic
  const getPaginatedItems = (items: any[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }

  const handleDiscoveryClick = (type: 'stream' | 'spec' | 'exam' | 'course', name: string) => {
    if (type === 'stream') setSelectedStream(name)
    if (type === 'spec') setSelectedSpec(name)
    if (type === 'exam') setSelectedExam(name)
    if (type === 'course') setSelectedCourse(name)
    
    setCollegePage(1)
  }

  const renderPagination = (totalItems: number, currentPage: number, setCurrentPage: (p: number) => void) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    if (totalPages <= 1) return null
    
    return (
      <div className="shrink-0 px-6 py-4 border-t border-gray-50 bg-white flex items-center justify-between mt-auto">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Showing {Math.min(itemsPerPage, totalItems - (currentPage - 1) * itemsPerPage)} of {totalItems} items
        </p>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-400 disabled:opacity-20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = currentPage;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                    currentPage === pageNum 
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200' 
                      : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-400 disabled:opacity-20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'colleges', label: 'Explore Colleges', icon: '🏛️' },
    { id: 'streams', label: 'Explore Streams', icon: '🎓' },
    { id: 'courses', label: 'Explore Courses', icon: '📚' },
    { id: 'specializations', label: 'Explore Specializations', icon: '🔬' },
    { id: 'exams', label: 'Explore Exams', icon: '📝' },
  ] as const

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
        
      {/* MAIN CONTENT Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
        
        {/* Subtabs Switcher */}
        <div className="px-6 py-4 border-b border-gray-50 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-[20px] w-fit border border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-[16px] text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-white text-indigo-600 shadow-[0_8px_20px_-4px_rgba(79,70,229,0.15)] ring-1 ring-black/5' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + collegePage + streamPage + specPage + examPage + coursePage + q + selectedStream + selectedSpec + selectedExam + selectedCourse}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              {activeTab === 'colleges' && (
                <>
                  <DashboardGrid>
                    {getPaginatedItems(filteredColleges, collegePage).map((college) => (
                      <DashboardCard
                        key={college.college_id}
                        college_id={college.college_id}
                        title={college.college_name}
                        description={college.typeofuni}
                        logo={college.logo_url}
                        rating={college.infra_rating}
                        city={college.city}
                        state={college.state}
                        established={college.established_year}
                        typeofuni={college.typeofuni}
                        approvals={college.approvals}
                        highest_package={college.latest_highest_package}
                        avg_package={college.latest_avg_package}
                        top_exams={college.exams_data?.slice(0, 3)}
                      />
                    ))}
                  </DashboardGrid>
                  {filteredColleges.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100 mx-4">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 text-3xl">🔭</div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tighter">No Results Found</h3>
                      <p className="text-gray-400 font-bold mt-2 text-center max-w-sm px-6">We couldn't locate any institutions matching your criteria.</p>
                    </div>
                  )}
                  {renderPagination(filteredColleges.length, collegePage, setCollegePage)}
                </>
              )}

              {activeTab === 'streams' && (
                <>
                  {selectedStream ? (
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setSelectedStream(null)}
                            className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all group"
                          >
                            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <div>
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Exploring Stream</p>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{selectedStream}</h2>
                          </div>
                        </div>
                      </div>
                      
                          <DashboardGrid>
                            {getPaginatedItems(filteredColleges.filter(c => c.streams_data?.includes(selectedStream)), collegePage).map((college) => (
                               <DashboardCard
                                 key={college.college_id}
                                 {...college}
                                 title={college.college_name}
                                 description={college.typeofuni}
                                 top_exams={college.exams_data?.slice(0, 3)}
                               />
                            ))}
                          </DashboardGrid>
                          {renderPagination(filteredColleges.filter(c => c.streams_data?.includes(selectedStream)).length, collegePage, setCollegePage)}
                        </div>
                      ) : (
                        <>
                          <DashboardGrid>
                            {getPaginatedItems(discoveryMeta?.streams || [], streamPage).map((stream) => (
                              <DiscoveryCard
                                key={stream.name}
                                name={stream.name}
                                count={parseInt(stream.count)}
                                subItems={stream.sub_items}
                                type="stream"
                                onClick={() => handleDiscoveryClick('stream', stream.name)}
                              />
                            ))}
                          </DashboardGrid>
                          {renderPagination(discoveryMeta?.streams.length || 0, streamPage, setStreamPage)}
                        </>
                      )}
                    </>
                  )}

                  {activeTab === 'courses' && (
                    <>
                      {selectedCourse ? (
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => setSelectedCourse(null)}
                                className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all group"
                              >
                                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <div>
                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Exploring Course</p>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{selectedCourse}</h2>
                              </div>
                            </div>
                          </div>
                          
                          <DashboardGrid>
                            {getPaginatedItems(filteredColleges.filter(c => c.courses_data?.some((co: any) => co.name === selectedCourse)), collegePage).map((college) => (
                               <DashboardCard
                                 key={college.college_id}
                                 {...college}
                                 title={college.college_name}
                                 description={college.typeofuni}
                                 top_exams={college.exams_data?.slice(0, 3)}
                               />
                            ))}
                          </DashboardGrid>
                          {renderPagination(filteredColleges.filter(c => c.courses_data?.some((co: any) => co.name === selectedCourse)).length, collegePage, setCollegePage)}
                        </div>
                      ) : (
                        <>
                          <DashboardGrid>
                            {getPaginatedItems(discoveryMeta?.courses.filter((c: any) => c.name.toLowerCase().includes(q.toLowerCase())) || [], coursePage).map((course) => (
                              <DiscoveryCard
                                key={course.name}
                                name={course.name}
                                count={parseInt(course.count)}
                                type="course"
                                level={course.level}
                                duration={course.duration}
                                stream={course.stream}
                                onClick={() => handleDiscoveryClick('course', course.name)}
                              />
                            ))}
                          </DashboardGrid>
                          {renderPagination(discoveryMeta?.courses.filter((c: any) => c.name.toLowerCase().includes(q.toLowerCase())).length || 0, coursePage, setCoursePage)}
                        </>
                      )}
                    </>
                  )}

              {activeTab === 'specializations' && (
                <>
                  {selectedSpec ? (
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setSelectedSpec(null)}
                            className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all group"
                          >
                            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <div>
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Exploring Specialization</p>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{selectedSpec}</h2>
                          </div>
                        </div>
                      </div>
                      
                      <DashboardGrid>
                        {getPaginatedItems(filteredColleges.filter(c => c.specializations_data?.includes(selectedSpec)), collegePage).map((college) => (
                           <DashboardCard
                             key={college.college_id}
                             {...college}
                             title={college.college_name}
                             description={college.typeofuni}
                             top_exams={college.exams_data?.slice(0, 3)}
                           />
                        ))}
                      </DashboardGrid>
                      {renderPagination(filteredColleges.filter(c => c.specializations_data?.includes(selectedSpec)).length, collegePage, setCollegePage)}
                    </div>
                  ) : (
                    <>
                      <DashboardGrid>
                        {getPaginatedItems(discoveryMeta?.specializations.filter((s:any) => s.name.toLowerCase().includes(q.toLowerCase())) || [], specPage).map((spec) => (
                          <DiscoveryCard
                            key={spec.name}
                            name={spec.name}
                            count={parseInt(spec.count)}
                            subItems={spec.sub_items}
                            type="specialization"
                            onClick={() => handleDiscoveryClick('spec', spec.name)}
                          />
                        ))}
                      </DashboardGrid>
                      {renderPagination(discoveryMeta?.specializations.filter((s:any) => s.name.toLowerCase().includes(q.toLowerCase())).length || 0, specPage, setSpecPage)}
                    </>
                  )}
                </>
              )}

              {activeTab === 'exams' && (
                <>
                  {selectedExam ? (
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setSelectedExam(null)}
                            className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all group"
                          >
                            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <div>
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Exploring Exam</p>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{selectedExam}</h2>
                          </div>
                        </div>
                      </div>
                      
                      <DashboardGrid>
                        {getPaginatedItems(filteredColleges.filter(c => c.exams_data?.includes(selectedExam)), collegePage).map((college) => (
                           <DashboardCard
                             key={college.college_id}
                             {...college}
                             title={college.college_name}
                             description={college.typeofuni}
                             top_exams={college.exams_data?.slice(0, 3)}
                           />
                        ))}
                      </DashboardGrid>
                      {renderPagination(filteredColleges.filter(c => c.exams_data?.includes(selectedExam)).length, collegePage, setCollegePage)}
                    </div>
                  ) : (
                    <>
                      <DashboardGrid>
                        {getPaginatedItems(discoveryMeta?.exams.filter((e:any) => e.name.toLowerCase().includes(q.toLowerCase())) || [], examPage).map((exam) => (
                          <DiscoveryCard
                            key={exam.name}
                            name={exam.name}
                            count={parseInt(exam.count)}
                            fullName={exam.full_name}
                            website={exam.website}
                            type="exam"
                            onClick={() => handleDiscoveryClick('exam', exam.name)}
                          />
                        ))}
                      </DashboardGrid>
                      {renderPagination(discoveryMeta?.exams.filter((e:any) => e.name.toLowerCase().includes(q.toLowerCase())).length || 0, examPage, setExamPage)}
                    </>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {activeTab === 'colleges' && (
        <AdvanceFilter 
            filters={filters}
            setFilters={setFilters}
            availableStates={availableOptions.states}
            availableCities={[]} 
            availableTypes={availableOptions.types}
            availableLevels={availableOptions.levels}
            availableExams={availableOptions.exams}
            availableSpecializations={availableOptions.specializations}
            availableStreams={availableOptions.streams}
        />
      )}

    </div>
  )
}
