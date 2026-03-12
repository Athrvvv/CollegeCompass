"use client"

import { useState } from "react"
import CollegeSelector from "@/components/compare/CollegeSelector"
import ComparisonTable from "@/components/compare/ComparisonTable"
import { getCollegeDetails, getCollegeById } from "@/app/dashboard/actions"

interface CollegeBase {
  college_id: number
  college_name: string
  logo_url: string
  city: string
  state: string
}

export default function CompareClient() {
  const [selectedColleges, setSelectedColleges] = useState<(CollegeBase | null)[]>([null, null, null])
  const [comparisonData, setComparisonData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSelect = (index: number, college: CollegeBase) => {
    const newSelected = [...selectedColleges]
    newSelected[index] = college
    setSelectedColleges(newSelected)
  }

  const handleRemove = (index: number) => {
    const newSelected = [...selectedColleges]
    newSelected[index] = null
    setSelectedColleges(newSelected)
  }

  const addBlock = () => {
    if (selectedColleges.length < 4) {
      setSelectedColleges([...selectedColleges, null])
    }
  }

  const handleCompare = async () => {
    const validIds = selectedColleges
      .filter((c): c is CollegeBase => c !== null)
      .map(c => c.college_id)

    if (validIds.length < 2) {
      alert("Please select at least 2 colleges to compare.")
      return
    }

    setLoading(true)
    try {
      const data = await Promise.all(
        validIds.map(async (id) => {
          const [college, details] = await Promise.all([
            getCollegeById(id),
            getCollegeDetails(id)
          ])
          return { college, details }
        })
      )
      setComparisonData(data)
    } catch (error) {
      console.error("Comparison failed", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-10 md:py-16">
      
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Compare <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">Colleges</span>
        </h1>

        <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
          Add the colleges you're interested in and see a side-by-side breakdown of packages, fees, and more.
        </p>
      </div>

      {/* Selection Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {selectedColleges.map((college, idx) => (
          <CollegeSelector
            key={idx}
            index={idx}
            selectedCollege={college}
            onSelect={(col) => handleSelect(idx, col)}
            onRemove={() => handleRemove(idx)}
          />
        ))}
        {selectedColleges.length < 4 && (
          <button 
            onClick={addBlock}
            className="h-full min-h-[180px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/30 hover:bg-gray-50 hover:border-indigo-200 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-500 transition-all shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
            </div>
            <span className="text-sm font-bold text-gray-400 mt-3 group-hover:text-indigo-500">Add More</span>
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-center mb-16">
        <button
          onClick={handleCompare}
          disabled={loading || selectedColleges.filter(c => c !== null).length < 2}
          className="bg-[#1b2533] hover:bg-indigo-600 text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Fetching Data...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Compare Now</span>
            </>
          )}
        </button>
      </div>

      {/* Comparison Results */}
      {comparisonData && (
        <div className="mt-16 animate-in slide-in-from-bottom-5 duration-500">
          <ComparisonTable data={comparisonData} />
        </div>
      )}
    </div>
  )
}
