"use client"

import { useState, useMemo, useEffect } from "react"
import DashboardCard from "./DashboardCard"
import DashboardGrid from "./DashboardGrid"
import AdvanceFilter, { FilterState } from "./AdvanceFilter"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardClient({ 
  initialColleges,
  initialSearchQuery
}: { 
  initialColleges: any[],
  initialSearchQuery: string
}) {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || initialSearchQuery

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
    specializations: []
  })

  // Local Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Derive available filter options from initialColleges
  const availableOptions = useMemo(() => {
    const states = new Set<string>()
    const types = new Set<string>()
    const levels = new Set<string>()
    const exams = new Set<string>()
    const specializations = new Set<string>()
    
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
    })

    return {
      states: Array.from(states).sort(),
      types: Array.from(types).sort(),
      levels: Array.from(levels).sort(),
      exams: Array.from(exams).sort(),
      specializations: Array.from(specializations).sort(),
    }
  }, [initialColleges])

  // Filtering Logic
  const filteredColleges = useMemo(() => {
    return initialColleges.filter(college => {
      // Search Match
      const matchSearch = q 
        ? college.college_name.toLowerCase().includes(q.toLowerCase()) || 
          college.city.toLowerCase().includes(q.toLowerCase()) || 
          college.state.toLowerCase().includes(q.toLowerCase())
        : true

      if (!matchSearch) return false

      // Placement Match
      if (filters.minPackage > 0) {
        const pkg = college.latest_highest_package || 0
        if (pkg < filters.minPackage) return false
      }

      // Fees Match (Fixed: Only apply filter if maxFees is less than the max range)
      if (filters.maxFees < 2000000) { 
        const fees = college.courses_data?.map((c: any) => c.fee).filter(Boolean) || []
        if (fees.length > 0) {
          const minFee = Math.min(...fees)
          if (minFee > filters.maxFees) return false
        } else {
          // If no fee data exists, we hide it ONLY if user is actively filtering down
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

      return true
    })
  }, [initialColleges, q, filters])

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [q, filters])

  // Calculate Paginated Results
  const paginatedColleges = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredColleges.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredColleges, currentPage])

  const totalPages = Math.ceil(filteredColleges.length / itemsPerPage)

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
        
      {/* MAIN CONTENT Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <AnimatePresence>
            <motion.div
              key={currentPage + (q || '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DashboardGrid>
                {paginatedColleges.map((college) => (
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
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
                    <span className="text-3xl">🔭</span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter">No Results Found</h3>
                  <p className="text-gray-400 font-bold mt-2 text-center max-w-sm px-6">
                    We couldn't locate any institutions matching your criteria. Try adjusting the filters!
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* MINIMALISTIC PAGINATION */}
        {totalPages > 1 && (
          <div className="shrink-0 px-6 py-4 border-t border-gray-50 bg-white flex items-center justify-between">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Showing {paginatedColleges.length} of {filteredColleges.length} Instituions
            </p>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-400 disabled:opacity-20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* RIGHT SIDEBAR FILTERS */}
      <AdvanceFilter 
        filters={filters}
        setFilters={setFilters}
        availableStates={availableOptions.states}
        availableCities={[]} 
        availableTypes={availableOptions.types}
        availableLevels={availableOptions.levels}
        availableExams={availableOptions.exams}
        availableSpecializations={availableOptions.specializations}
      />

    </div>
  )
}
