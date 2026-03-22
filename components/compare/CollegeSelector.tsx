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
      <div className="relative group bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 flex flex-col items-center justify-center gap-4 transition-all duration-500 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(79,70,229,0.2)] h-full min-h-[220px] ring-1 ring-white/5 shadow-2xl overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-600/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <button 
          onClick={onRemove}
          className="absolute top-4 right-4 w-8 h-8 bg-white/5 border border-white/10 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all z-10 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 duration-300"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="w-24 h-24 relative rounded-[20px] overflow-hidden bg-white shadow-2xl flex items-center justify-center border-4 border-white/10 p-3 group-hover:scale-105 transition-transform duration-500 ring-1 ring-black/5">
           {selectedCollege.logo_url ? (
             <Image 
              src={selectedCollege.logo_url} 
              alt={selectedCollege.college_name} 
              fill 
              className="object-contain p-1.5"
             />
           ) : (
             <div className="text-3xl font-black text-indigo-100 bg-indigo-600 w-full h-full flex items-center justify-center">{selectedCollege.college_name.charAt(0)}</div>
           )}
        </div>
        
        <div className="text-center text-balance overflow-hidden relative z-10 px-2">
          <h3 className="text-sm font-black text-white line-clamp-2 leading-tight tracking-tight mb-1 group-hover:text-indigo-200 transition-colors">{selectedCollege.college_name}</h3>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest opacity-70 flex items-center justify-center gap-1.5">
            <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {selectedCollege.city}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-[220px]" ref={dropdownRef}>
      <div 
        onClick={() => inputRef.current?.focus()}
        className="h-full flex flex-col items-center justify-center border border-white/5 rounded-[32px] p-8 bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.06] hover:border-indigo-500/30 transition-all duration-500 group cursor-pointer relative overflow-hidden ring-1 ring-white/5 shadow-2xl"
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 mb-5 shadow-inner relative z-10">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="w-full relative z-10">
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search College..."
            className="w-full bg-transparent border-none outline-none text-sm font-black text-center text-white placeholder-gray-500 cursor-text selection:bg-indigo-500/30"
          />
          <div className="w-8 mx-auto h-0.5 bg-indigo-500/0 group-hover:w-16 group-hover:bg-indigo-500/40 transition-all duration-500 mt-2 rounded-full" />
        </div>

        {loading && (
          <div className="absolute bottom-6 flex justify-center w-full">
            <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute top-[105%] left-0 right-0 p-2 bg-[#0F172A]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden ring-1 ring-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="max-h-[280px] overflow-y-auto no-scrollbar space-y-1">
            {results.map((college) => (
              <button
                key={college.college_id}
                onClick={() => {
                  onSelect(college)
                  setShowDropdown(false)
                  setQuery("")
                }}
                className="w-full flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-all text-left border border-transparent hover:border-white/5 group/item"
              >
                <div className="w-10 h-10 relative rounded-lg bg-white overflow-hidden shrink-0 border border-white/10 p-1 group-hover/item:scale-105 transition-transform">
                  {college.logo_url ? (
                     <Image src={college.logo_url} alt="" fill className="object-contain p-0.5" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-black text-sm">{college.college_name.charAt(0)}</div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-black text-white truncate decoration-indigo-500/30 group-hover/item:underline underline-offset-4 decoration-2">{college.college_name}</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1 group-hover/item:text-indigo-400 transition-colors">
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {college.city}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
