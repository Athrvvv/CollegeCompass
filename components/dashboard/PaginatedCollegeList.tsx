"use client"

import { useState } from "react"
import DashboardGrid from "./DashboardGrid"
import DashboardCard from "./DashboardCard"
import { getColleges } from "@/app/dashboard/actions"

export default function PaginatedCollegeList({
  initialColleges,
  initialTotalPages,
  initialSearchQuery = "",
}: {
  initialColleges: any[]
  initialTotalPages: number
  initialSearchQuery?: string
}) {
  const [colleges, setColleges] = useState(initialColleges)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  async function goToPage(page: number) {
    if (page === currentPage || page < 1 || page > initialTotalPages) return

    setLoading(true)
    try {
      const { colleges: newColleges } = await getColleges(page, 9, initialSearchQuery)
      setColleges(newColleges)
      setCurrentPage(page)
      
      // Scroll to top of grid when page changes
      const container = document.querySelector('.overflow-y-auto')
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error("Failed to load page", error)
    } finally {
      setLoading(false)
    }
  }

  // Generate pagination array (e.g., [1, 2, '...', 7, 8, 9, '...', 12])
  function getPaginationItems() {
    const items: (number | string)[] = []
    const total = initialTotalPages
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) items.push(i)
    } else {
      if (currentPage <= 3) {
        items.push(1, 2, 3, 4, '...', total)
      } else if (currentPage >= total - 2) {
        items.push(1, '...', total - 3, total - 2, total - 1, total)
      } else {
        items.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', total)
      }
    }
    return items
  }

  return (
    <>
      <div className={`transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <DashboardGrid>
          {colleges.map((college) => (
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
              highest_package={college.highest_package}
              avg_package={college.avg_package}
              top_exams={college.top_exams}
            />
          ))}
        </DashboardGrid>
      </div>

      {initialTotalPages > 1 && (
        <div className="flex justify-center mt-10 mb-6">
          <div className="inline-flex items-center bg-white border border-gray-200 rounded-full shadow-sm p-1">
            
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center px-1 gap-1">
              {getPaginationItems().map((item, i) => (
                <button
                  key={i}
                  onClick={() => typeof item === 'number' && goToPage(item)}
                  disabled={item === '...' || loading}
                  className={`w-8 h-8 text-sm font-medium rounded-full flex items-center justify-center transition-all ${
                    item === currentPage
                      ? 'bg-indigo-600 text-white shadow-md'
                      : item === '...'
                      ? 'text-gray-400 cursor-default'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === initialTotalPages || loading}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

          </div>
        </div>
      )}
    </>
  )
}
