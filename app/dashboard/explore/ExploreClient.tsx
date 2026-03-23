"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import DashboardCard from "@/components/dashboard/DashboardCard"
import { useSearchParams } from "next/navigation"

export default function ExploreClient({ colleges }: { colleges: any[] }) {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "")

  // 1. TOP PLACEMENTS (Placement Powerhouses)
  const placementPowerhouses = useMemo(() => {
    return [...colleges]
      .sort((a, b) => (Number(b.latest_highest_package) || 0) - (Number(a.latest_highest_package) || 0))
      .slice(0, 6)
  }, [colleges])

  // 2. TOP RANKED (Campus Excellence)
  const campusExcellence = useMemo(() => {
    return [...colleges]
      .sort((a, b) => (Number(b.infra_rating) || 0) - (Number(a.infra_rating) || 0))
      .slice(0, 6)
  }, [colleges])

  // 3. REGIONAL HUBS (Explore by State)
  const states = useMemo(() => {
    const counts: Record<string, number> = {}
    colleges.forEach(c => {
      if (c.state) counts[c.state] = (counts[c.state] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
  }, [colleges])

  // 4. ACADEMIC STREAMS
  const academicStreams = useMemo(() => {
    const streams: Record<string, number> = {}
    colleges.forEach(c => {
      c.courses_data?.forEach((course: any) => {
        if (course.name) streams[course.name] = (streams[course.name] || 0) + 1
      })
    })
    return Object.entries(streams)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
  }, [colleges])

  // Global Search Filtered Results
  const filteredColleges = useMemo(() => {
    if (!searchQuery) return []
    return colleges.filter(college =>
      college.college_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.state.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 24)
  }, [colleges, searchQuery])

  const SectionHeader = ({ title, subtitle, icon }: { title: string, subtitle: string, icon: string }) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">{title}</h2>
      </div>
      <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">{subtitle}</p>
    </div>
  )

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 min-h-screen space-y-24">
      
      {/* Hero Search Section */}
      <section className="relative py-20 overflow-hidden rounded-[48px] bg-gray-900">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600/20 via-transparent to-violet-600/20" />
        <div className="relative z-10 px-8 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="h-px w-8 bg-indigo-500" />
            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">Academic Discovery Hub v3.0</span>
            <span className="h-px w-8 bg-indigo-500" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-10"
          >
            Explore the <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-400 italic">Universe</span> of Education.
          </motion.h1>
          
          <div className="relative max-w-2xl mx-auto group">
            <input 
              type="text"
              placeholder="Search by college name, city, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-6 px-8 text-white text-xl placeholder-white/20 outline-none focus:border-indigo-500 focus:bg-white/10 transition-all shadow-2xl"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest">
              Ctrl + K
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <AnimatePresence>
        {searchQuery && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-8"
          >
            <SectionHeader 
              title="Global Search" 
              subtitle={`${filteredColleges.length} matches found for "${searchQuery}"`}
              icon="🔍"
            />
            {filteredColleges.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredColleges.map((college) => (
                  <DashboardCard key={college.college_id} {...college} title={college.college_name} highest_package={college.latest_highest_package} avg_package={college.latest_avg_package} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-black text-xl italic uppercase tracking-widest">No signals detected in this sector.</p>
              </div>
            )}
            <div className="h-px w-full bg-linear-to-r from-transparent via-gray-100 to-transparent my-20" />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Discovery Hub Grid */}
      <div className="space-y-32">
        
        {/* Placement Powerhouses */}
        <section>
          <SectionHeader 
            title="Placement Powerhouses" 
            subtitle="Institutions leading the career trajectory charts"
            icon="🚀"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {placementPowerhouses.map((college) => (
              <DashboardCard key={college.college_id} {...college} title={college.college_name} highest_package={college.latest_highest_package} avg_package={college.latest_avg_package} />
            ))}
          </div>
        </section>

        {/* Campus Excellence */}
        <section>
          <SectionHeader 
            title="Campus Excellence" 
            subtitle="Top-tier infrastructure and academic environments"
            icon="🏛️"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campusExcellence.map((college) => (
              <DashboardCard key={college.college_id} {...college} title={college.college_name} highest_package={college.latest_highest_package} avg_package={college.latest_avg_package} />
            ))}
          </div>
        </section>

        {/* Categories Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Regional Hubs */}
          <section className="bg-gray-50 rounded-[48px] p-12 border border-gray-100">
            <SectionHeader 
              title="Regional Hubs" 
              subtitle="Major educational centers by state"
              icon="📍"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {states.map(([state, count]) => (
                <div key={state} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-indigo-600 transition-all group flex items-center justify-between cursor-pointer">
                  <div>
                    <h3 className="font-black text-gray-900 uppercase tracking-tighter text-lg">{state}</h3>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{count} Institutions</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Academic Streams */}
          <section className="bg-gray-900 rounded-[48px] p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px]" />
            <div className="relative z-10">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🎓</span>
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Academic Streams</h2>
                </div>
                <p className="text-indigo-400 font-bold text-sm tracking-widest uppercase">Specializations & Disciplines</p>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                {academicStreams.map(([stream, count]) => (
                  <div key={stream} className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl hover:bg-white/10 hover:border-indigo-500 transition-all cursor-pointer group">
                    <h3 className="text-white font-black uppercase tracking-tight text-sm mb-1 group-hover:text-indigo-400 transition-colors">{stream}</h3>
                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em]">{count} Programs</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* Realistic Stats Bar */}
        <section className="py-20 border-y border-gray-100 flex flex-wrap items-center justify-around gap-12">
          <div className="text-center">
            <div className="text-4xl font-black text-gray-900 tracking-tighter mb-2">{colleges.length}</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Verified Institutions</div>
          </div>
          <div className="h-12 w-px bg-gray-100 hidden md:block" />
          <div className="text-center">
            <div className="text-4xl font-black text-gray-900 tracking-tighter mb-2">850k+</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Live Data Points</div>
          </div>
          <div className="h-12 w-px bg-gray-100 hidden md:block" />
          <div className="text-center">
            <div className="text-4xl font-black text-gray-900 tracking-tighter mb-2">24/7</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Discovery Engine</div>
          </div>
        </section>

      </div>
    </div>
  )
}
