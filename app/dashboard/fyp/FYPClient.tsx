"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useNotebook } from "@/context/NotebookContext"

export default function FYPPage() {
  const router = useRouter()
  const [colleges, setColleges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterState, setFilterState] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchFYP() {
      try {
        const res = await fetch("/api/fyp")
        if (res.status === 404) {
          const data = await res.json()
          if (data.needsOnboarding) {
            router.push("/dashboard/profile/welcome")
            return
          }
        }
        const data = await res.json()
        setColleges(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error("FYP Fetch Error:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchFYP()
  }, [router])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredColleges = colleges.filter(c => 
    !filterState || c.state === filterState
  )

  const states = Array.from(new Set(colleges.map(c => c.state))).filter(Boolean).sort()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              borderRadius: ["20%", "50%", "20%"]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 bg-linear-to-tr from-blue-600 via-purple-600 to-pink-600 shadow-[0_0_30px_rgba(37,99,235,0.4)]"
          />
          <p className="text-gray-400 font-bold tracking-widest text-sm uppercase animate-pulse">Computing your future</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-[#0a0a0a] text-white selection:bg-blue-500/30 overflow-y-auto">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 p-6 md:p-12 max-w-[1920px] mx-auto space-y-12">
        
        {/* Pinterest Style Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Discover Your Future</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
            >
              FOR YOU<span className="text-blue-600">.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-xl text-xl leading-relaxed font-medium"
            >
              Intelligence-driven recommendations tailored to your academic profile and aspirations.
            </motion.p>
          </div>

          {/* Premium Custom Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-6 bg-white/[0.03] backdrop-blur-3xl pl-7 pr-2 py-2 rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] cursor-pointer hover:bg-white/[0.07] hover:border-indigo-500/30 transition-all group"
            >
              <div className="flex flex-col py-1">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-0.5">Region</span>
                <span className="text-sm font-black text-white tracking-tight">{filterState || "All States"}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4.5 w-4.5 transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </motion.div>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute right-0 mt-4 w-72 bg-[#121212]/95 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] z-50 overflow-hidden"
                >
                  <div className="p-3 space-y-1.5">
                    <button 
                      onClick={() => { setFilterState(""); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-6 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${!filterState ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                      Universal View
                    </button>
                    <div className="h-px w-full bg-white/5 mx-auto my-2" />
                    <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-1 pr-1">
                      {states.map(s => (
                        <button 
                          key={s}
                          onClick={() => { setFilterState(s); setIsDropdownOpen(false); }}
                          className={`w-full text-left px-6 py-4 rounded-[1.5rem] text-sm font-bold transition-all ${filterState === s ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Masonry Layout */}
        <AnimatePresence mode="wait">
          {filteredColleges.length > 0 ? (
            <motion.div 
              className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8 pb-20"
            >
              {filteredColleges.map((college, idx) => (
                <PinterestCard key={college.college_id} college={college} index={idx} isMobile={false} />
              ))}
            </motion.div>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                 <span className="text-4xl text-gray-400">🔍</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold">No matches in {filterState}</h3>
                <p className="text-gray-500 text-lg">Try exploring other regions or updating your profile.</p>
              </div>
              <button 
                onClick={() => setFilterState("")}
                className="px-8 py-3 bg-white text-black font-black rounded-full hover:scale-105 transition-transform"
              >
                Reset Search
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function PinterestCard({ college, index, isMobile }: { college: any, index: number, isMobile?: boolean }) {
  const router = useRouter()
  const { addNote, removeNote, isInNotebook } = useNotebook()
  const [imgSrc, setImgSrc] = useState(college.logo_url || "/college-placeholder.png")

  const isBookmarked = isInNotebook(college.college_id.toString())

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isBookmarked) {
      removeNote(college.college_id.toString())
    } else {
      addNote({
        note_name: college.college_name,
        data: [{ 
          college_id: college.college_id, 
          title: college.college_name, 
          city: college.city, 
          state: college.state, 
          rating: college.rating, 
          typeofuni: college.typeofuni 
        }],
        remark: `Saved from FYP recommendations.`,
        note_id: college.college_id.toString()
      })
    }
  }

  const gradients = [
    'from-indigo-600/40 to-blue-600/40',
    'from-violet-600/40 to-purple-600/40',
    'from-blue-600/40 to-indigo-600/40',
    'from-fuchsia-600/40 to-purple-600/40',
    'from-indigo-700/40 to-indigo-500/40'
  ]
  const gradient = gradients[index % gradients.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="break-inside-avoid relative group"
      onClick={() => router.push(`/dashboard/college/${college.college_id}`)}
    >
      <div className={`relative overflow-hidden rounded-[2.5rem] bg-linear-to-br ${gradient} border border-white/10 transition-all duration-500 group-hover:border-white/30 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] cursor-pointer backdrop-blur-md`}>
        
        <div className="aspect-4/5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 mix-blend-soft-light transition-opacity group-hover:opacity-60">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--tw-gradient-from)_0%,transparent_100%)]" />
          </div>
          
          {/* Top Info Bar */}
          <div className="absolute top-0 left-0 right-0 p-5 flex items-start justify-between z-30">
             <div className="flex items-center gap-3">
               <div className="relative w-12 h-12 bg-white rounded-2xl p-2 shadow-2xl border border-white/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                 <Image
                    src={imgSrc}
                    alt={college.college_name}
                    fill
                    className="object-contain p-1.5"
                    onError={() => setImgSrc("/college-placeholder.png")}
                 />
               </div>
               <div className="bg-black/60 backdrop-blur-2xl px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Match: {Math.round(college.recommendationScore)}%</span>
               </div>
             </div>
             
             <button 
               onClick={handleBookmark}
               className={`w-11 h-11 rounded-full backdrop-blur-3xl border flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 ${isBookmarked ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/40' : 'bg-white/10 border-white/20 text-white/70 hover:text-white hover:bg-white/20'}`}
             >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill={isBookmarked ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  className="w-5 h-5"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
             </button>
          </div>

          {/* Bottom Glass Content */}
          <div className="absolute inset-x-0 bottom-0 p-5 z-20">
             <div className="p-6 bg-white/[0.08] backdrop-blur-[40px] rounded-[2rem] border border-white/20 space-y-4 group-hover:translate-y-[-8px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                <div className="space-y-1.5 min-w-0">
                   <h2 className="text-xl md:text-2xl font-black leading-[1.1] tracking-tightest line-clamp-2 text-white/95" title={college.college_name}>
                      {college.college_name}
                   </h2>
                   <div className="flex items-center gap-2">
                     <p className="text-indigo-200/80 text-[11px] font-black uppercase tracking-widest truncate">{college.city}, {college.state}</p>
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
                     <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-full border border-white/5">
                        <svg className="w-2.5 h-2.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-[11px] font-black text-white">{college.rating}</span>
                     </div>
                   </div>
                </div>

                <div className="flex flex-wrap gap-2">
                   {college.recommendationReasons.slice(0, 2).map((reason: string, i: number) => (
                     <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black border border-white/10 whitespace-nowrap text-white/80 uppercase tracking-tight">
                       {reason}
                     </span>
                   ))}
                </div>

                {/* Info Pills Revealed on Hover */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/10 h-0 group-hover:h-auto overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-0.5">Focus</span>
                      <span className="text-xs font-black text-white tracking-tight">{college.typeofuni || "Technical"}</span>
                   </div>
                   <div className="w-px h-7 bg-white/10" />
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-0.5">Campus</span>
                      <span className="text-xs font-black text-white tracking-tight">{college.campus_size || "40+ Acres"}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out pointer-events-none" />
      </div>
    </motion.div>
  )
}
