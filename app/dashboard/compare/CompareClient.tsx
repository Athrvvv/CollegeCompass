"use client"

import { useState } from "react"
import { useComparison } from "@/context/ComparisonContext"
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
  const { 
    selectedColleges, 
    removeCollegeFromCompare, 
    addCollegeToCompare 
  } = useComparison()
  
  const [comparisonData, setComparisonData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSelect = (index: number, college: CollegeBase) => {
    addCollegeToCompare(college)
  }

  const handleRemove = (index: number) => {
    removeCollegeFromCompare(index)
  }

  const addBlock = () => {
    // Context handles slots, but we can call a function if needed
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
    <div className="relative h-full overflow-y-auto pb-20 overflow-x-hidden">
      
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-600/10 blur-[100px] rounded-full -z-10" />

      <div className="max-w-[1440px] mx-auto px-6 py-10 md:py-16 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Comparison Engine
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Compare <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-violet-400 to-purple-400 drop-shadow-sm">Colleges</span>
          </h1>

          <p className="text-gray-400 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
            Side-by-side breakdown of placement records, fee structures, and campus rankings to help you make the right choice.
          </p>
        </div>

        {/* Selection Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {selectedColleges.map((college, idx) => (
            <div key={idx} className="h-full transform transition-all duration-500 hover:scale-[1.02]">
              <CollegeSelector
                index={idx}
                selectedCollege={college}
                onSelect={(col) => handleSelect(idx, col)}
                onRemove={() => handleRemove(idx)}
              />
            </div>
          ))}
          
          {selectedColleges.length < 4 && (
            <button 
              onClick={addBlock}
              className="h-full min-h-[220px] flex flex-col items-center justify-center border border-white/5 rounded-[32px] bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.06] hover:border-indigo-500/30 transition-all group relative overflow-hidden ring-1 ring-white/5 shadow-2xl"
            >
              <div className="absolute inset-0 bg-linear-to-br from-indigo-600/5 to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 group-hover:scale-110 transition-all duration-500 shadow-inner">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
              </div>
              <div className="mt-5 text-center">
                <span className="block text-sm font-black text-gray-400 group-hover:text-white transition-colors">Add More</span>
                <span className="text-[10px] text-gray-500 font-medium opacity-60 group-hover:opacity-100 transition-opacity uppercase tracking-widest mt-1">Empty Slot</span>
              </div>
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center mb-20 relative z-20">
          <button
            onClick={handleCompare}
            disabled={loading || selectedColleges.filter(c => c !== null).length < 2}
            className={`
              relative group py-5 px-14 rounded-full font-black text-sm md:text-base tracking-[0.2em] transition-all duration-500 active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed overflow-hidden
              ${loading 
                ? 'bg-slate-800 text-white border border-white/10 cursor-wait' 
                : 'bg-linear-to-r from-indigo-600 via-purple-600 to-violet-600 text-white border border-white/20 shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(139,92,246,0.6)] hover:border-white/40'
              }
            `}
          >
            {/* Inner Glare Effect */}
            <div className="absolute inset-0 bg-linear-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Animated Gradient Background for Hover */}
            {!loading && (
              <div className="absolute inset-0 bg-linear-to-r from-purple-600 via-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />
            )}
            
            <div className="relative flex items-center justify-center gap-3 z-10 w-full">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="uppercase tracking-widest text-white/90">Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="uppercase tracking-widest drop-shadow-md">Deep Compare</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Comparison Results */}
        {comparisonData && (
          <div className="mt-8 animate-in slide-in-from-bottom-5 duration-700">
            <ComparisonTable data={comparisonData} />
          </div>
        )}
      </div>
    </div>
  )
}
