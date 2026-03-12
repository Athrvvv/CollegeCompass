"use client"

import { useState, useEffect, useRef } from "react"
import { getColleges } from "@/app/dashboard/actions"
import Image from "next/image"

interface College {
  college_id: number
  college_name: string
  logo_url: string
  city: string
  state: string
}

export default function CollegeSelector({
  onSelect,
  onRemove,
  selectedCollege,
  index
}: {
  onSelect: (college: College) => void
  onRemove: () => void
  selectedCollege: College | null
  index: number
}) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<College[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(async () => {
      console.log("Searching for:", query)
      if (query.trim().length > 1) {
        setLoading(true)
        try {
          const { colleges } = await getColleges(1, 5, query)
          console.log("Search results:", colleges)
          setResults(colleges)
          setShowDropdown(true)
        } catch (error) {
          console.error("Search failed", error)
        } finally {
          setLoading(false)
        }
      } else {
        setResults([])
        setShowDropdown(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (selectedCollege) {
    return (
      <div className="relative group bg-white border-2 border-indigo-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all hover:border-indigo-200 hover:shadow-lg h-full min-h-[180px]">
        <button 
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-7 h-7 bg-white border border-gray-100 shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 transition-all z-10"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100 p-2">
           {selectedCollege.logo_url ? (
             <Image 
              src={selectedCollege.logo_url} 
              alt={selectedCollege.college_name} 
              fill 
              className="object-contain p-1"
             />
           ) : (
             <div className="text-2xl font-bold text-gray-300">{selectedCollege.college_name.charAt(0)}</div>
           )}
        </div>
        
        <div className="text-center text-balance overflow-hidden">
          <h3 className="text-[13px] font-bold text-gray-900 line-clamp-2 leading-tight px-1">{selectedCollege.college_name}</h3>
          <p className="text-[10px] text-gray-500 mt-1 font-medium">{selectedCollege.city}, {selectedCollege.state}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-[180px]" ref={dropdownRef}>
      <div 
        onClick={() => inputRef.current?.focus()}
        className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-gray-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all mb-4 shadow-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        
        <input 
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search college..."
          className="w-full bg-transparent border-none outline-none text-sm font-medium text-center text-gray-900 placeholder-gray-400 cursor-text"
        />

        
        {loading && (
          <div className="mt-2">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden ring-1 ring-black/5">
          {results.map((college) => (
            <button
              key={college.college_id}
              onClick={() => {
                onSelect(college)
                setShowDropdown(false)
                setQuery("")
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
            >
              <div className="w-8 h-8 relative rounded-md bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                {college.logo_url ? (
                   <Image src={college.logo_url} alt="" fill className="object-contain p-0.5" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-500 font-bold text-xs">{college.college_name.charAt(0)}</div>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-gray-900 truncate">{college.college_name}</div>
                <div className="text-[10px] text-gray-500 font-medium">{college.city}, {college.state}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
