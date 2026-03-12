"use client"

import { useState } from "react"

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void
  activeFilters: any
  availableStates: string[]
  availableTypes: string[]
  availableStreams: string[]
  availableLevels: string[]
}

export default function FilterSidebar({ 
  onFilterChange, 
  activeFilters, 
  availableStates, 
  availableTypes,
  availableStreams,
  availableLevels
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({ 
    states: true, 
    types: false, 
    package: true, 
    fees: true, 
    ratings: false,
    courses: false 
  })

  const updateFilters = (key: string, value: any) => {
    onFilterChange({ ...activeFilters, [key]: value })
  }

  const toggleListFilter = (category: string, value: string) => {
    const current = activeFilters[category] || []
    const updated = current.includes(value) 
      ? current.filter((i: string) => i !== value) 
      : [...current, value]
    updateFilters(category, updated)
  }

  const clearFilters = () => {
    onFilterChange({
      states: [],
      types: [],
      packageRange: [0, 100],
      feeRange: [0, 5000000],
      minInfraRating: 0,
      levels: [],
      streams: []
    })
  }

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-10 h-fit lg:sticky lg:top-24 pb-20">
      
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-black text-gray-900 font-sans tracking-tight">Advanced Filters</h2>
        <button 
          onClick={clearFilters}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest"
        >
          Reset All
        </button>
      </div>

      {/* Package Range */}
      <div className="space-y-4">
        <button 
          onClick={() => setOpenSections(s => ({ ...s, package: !s.package }))}
          className="flex items-center justify-between w-full text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]"
        >
          Placement (LPA)
          <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${openSections.package ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {openSections.package && (
          <div className="space-y-6 pt-2 px-1">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Min</label>
                <input 
                  type="number"
                  value={activeFilters.packageRange[0]}
                  onChange={(e) => updateFilters('packageRange', [Number(e.target.value), activeFilters.packageRange[1]])}
                  className="w-full mt-1 bg-gray-50 border border-gray-100 rounded-lg py-2 px-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Max</label>
                <input 
                  type="number"
                  value={activeFilters.packageRange[1]}
                  onChange={(e) => updateFilters('packageRange', [activeFilters.packageRange[0], Number(e.target.value)])}
                  className="w-full mt-1 bg-gray-50 border border-gray-100 rounded-lg py-2 px-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={activeFilters.packageRange[1]}
              onChange={(e) => updateFilters('packageRange', [activeFilters.packageRange[0], Number(e.target.value)])}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        )}
      </div>

      {/* Infrastructure Rating */}
      <div className="space-y-4">
        <button 
          onClick={() => setOpenSections(s => ({ ...s, ratings: !s.ratings }))}
          className="flex items-center justify-between w-full text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]"
        >
          Infra Rating
          <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${openSections.ratings ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {openSections.ratings && (
          <div className="flex items-center gap-1 pt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => updateFilters('minInfraRating', star === activeFilters.minInfraRating ? 0 : star)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  star <= activeFilters.minInfraRating 
                    ? 'bg-amber-100 text-amber-600 shadow-sm scale-110' 
                    : 'bg-gray-50 text-gray-300 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill={star <= activeFilters.minInfraRating ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            ))}
            {activeFilters.minInfraRating > 0 && <span className="ml-2 text-xs font-bold text-gray-400">{activeFilters.minInfraRating}+</span>}
          </div>
        )}
      </div>

      {/* Fee Range */}
      <div className="space-y-4">
        <button 
          onClick={() => setOpenSections(s => ({ ...s, fees: !s.fees }))}
          className="flex items-center justify-between w-full text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]"
        >
          Total Fees (Max)
          <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${openSections.fees ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {openSections.fees && (
          <div className="space-y-4 pt-2 px-1">
            <div className="bg-[#1b2533] text-white py-3 px-4 rounded-2xl flex items-center justify-between shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Upto</span>
              <span className="text-sm font-black tracking-tight">₹{(activeFilters.feeRange[1] / 100000).toFixed(1)} Lakhs</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="5000000" 
              step="50000"
              value={activeFilters.feeRange[1]}
              onChange={(e) => updateFilters('feeRange', [0, Number(e.target.value)])}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#1b2533]"
            />
          </div>
        )}
      </div>

      {/* University Types */}
      <div className="space-y-4">
        <button 
          onClick={() => setOpenSections(s => ({ ...s, types: !s.types }))}
          className="flex items-center justify-between w-full text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]"
        >
          Category
          <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${openSections.types ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {openSections.types && (
          <div className="flex flex-col gap-3 pl-0.5">
            {availableTypes.map(type => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={activeFilters.types.includes(type)}
                    onChange={() => toggleListFilter('types', type)}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-lg checked:bg-[#1b2533] checked:border-[#1b2533] transition-all duration-200 cursor-pointer"
                  />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[13px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors uppercase tracking-tight">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Levels & Streams */}
      <div className="space-y-4">
        <button 
          onClick={() => setOpenSections(s => ({ ...s, courses: !s.courses }))}
          className="flex items-center justify-between w-full text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]"
        >
          Programs & Levels
          <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${openSections.courses ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {openSections.courses && (
          <div className="space-y-8 pt-2">
            {/* Levels */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.15em]">Study Level</h4>
              <div className="flex flex-wrap gap-2">
                {availableLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => toggleListFilter('levels', level)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                      activeFilters.levels.includes(level)
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                        : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Streams */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.15em]">Top Streams</h4>
              <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {availableStreams.slice(0, 15).map(stream => (
                  <label key={stream} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={activeFilters.streams.includes(stream)}
                      onChange={() => toggleListFilter('streams', stream)}
                      className="w-4 h-4 border-2 border-gray-200 rounded checked:bg-indigo-600 outline-none transition-all cursor-pointer"
                    />
                    <span className="text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors line-clamp-1">{stream}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* States */}
      <div className="space-y-4">
        <button 
          onClick={() => setOpenSections(s => ({ ...s, states: !s.states }))}
          className="flex items-center justify-between w-full text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]"
        >
          Regions
          <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${openSections.states ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {openSections.states && (
          <div className="flex flex-col gap-3 pl-0.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {availableStates.sort().map(state => (
              <label key={state} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={activeFilters.states.includes(state)}
                    onChange={() => toggleListFilter('states', state)}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-lg checked:bg-[#1b2533] checked:border-[#1b2533] transition-all duration-200 cursor-pointer"
                  />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[13px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors tracking-tight">{state}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
