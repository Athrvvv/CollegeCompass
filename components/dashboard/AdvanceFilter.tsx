"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface FilterState {
  minPackage: number
  maxFees: number
  minRating: number
  universityType: string[]
  states: string[]
  cities: string[]
  levels: string[]
  exams: string[]
  specializations: string[]
}

interface AdvanceFilterProps {
  filters: FilterState
  setFilters: (update: (prev: FilterState) => FilterState) => void
  availableStates: string[]
  availableCities: string[]
  availableTypes: string[]
  availableLevels: string[]
  availableExams: string[]
  availableSpecializations: string[]
}

export default function AdvanceFilter({
  filters,
  setFilters,
  availableStates,
  availableCities,
  availableTypes,
  availableLevels,
  availableExams,
  availableSpecializations
}: AdvanceFilterProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleToggleType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      universityType: prev.universityType.includes(type)
        ? prev.universityType.filter(t => t !== type)
        : [...prev.universityType, type]
    }))
  }

  const handleToggleState = (state: string) => {
    setFilters(prev => ({
      ...prev,
      states: prev.states.includes(state)
        ? prev.states.filter(s => s !== state)
        : [...prev.states, state]
    }))
  }

  const handleToggleLevel = (level: string) => {
    setFilters(prev => ({
      ...prev,
      levels: prev.levels.includes(level)
        ? prev.levels.filter(l => l !== level)
        : [...prev.levels, level]
    }))
  }

  const handleToggleExam = (exam: string) => {
    setFilters(prev => ({
      ...prev,
      exams: prev.exams.includes(exam)
        ? prev.exams.filter(e => e !== exam)
        : [...prev.exams, exam]
    }))
  }

  const handleToggleSpecialization = (spec: string) => {
    setFilters(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }))
  }

  const resetFilters = () => {
    setFilters(() => ({
      minPackage: 0,
      maxFees: 5000000,
      minRating: 0,
      universityType: [],
      states: [],
      cities: [],
      levels: [],
      exams: [],
      specializations: []
    }))
  }

  return (
    <div className={`h-full flex flex-col bg-white border-l border-gray-100 transition-all duration-300 ${isOpen ? 'w-80' : 'w-0 overflow-hidden border-none'}`}>
      <div className="flex items-center justify-between p-6 border-b border-gray-50">
        <h3 className="text-lg font-black text-gray-900 tracking-tighter uppercase">Filters</h3>
        <button 
          onClick={resetFilters}
          className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors"
        >
          Reset All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Placement Filter */}
        <section>
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Placement (LPA)</label>
          <input 
            type="range" 
            min="0" 
            max="50" 
            step="1"
            value={filters.minPackage}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setFilters(prev => ({ ...prev, minPackage: val }));
            }}
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between mt-2 text-xs font-bold text-gray-600">
            <span>₹{filters.minPackage} LPA+</span>
            <span className="text-gray-300">Max ₹50L</span>
          </div>
        </section>

        {/* Fees Filter */}
        <section>
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Max Total Fees</label>
          <input 
            type="range" 
            min="0" 
            max="2000000" 
            step="50000"
            value={filters.maxFees}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setFilters(prev => ({ ...prev, maxFees: val }));
            }}
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between mt-2 text-xs font-bold text-gray-600">
            <span>Upto ₹{(filters.maxFees / 100000).toFixed(1)}L</span>
          </div>
        </section>

        {/* Rating Filter */}
        <section>
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Min Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setFilters(prev => ({ ...prev, minRating: star }))}
                className={`flex-1 py-2 rounded-xl border-2 transition-all font-bold text-sm ${
                  filters.minRating === star 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'bg-white border-gray-100 text-gray-400 hover:border-indigo-200'
                }`}
              >
                {star}★
              </button>
            ))}
          </div>
        </section>

        {/* Exams Filter */}
        <section>
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Entrance Exams</label>
          <div className="flex flex-wrap gap-2">
            {availableExams.map((exam) => (
              <button
                key={exam}
                onClick={() => handleToggleExam(exam)}
                className={`px-3 py-1.5 rounded-lg border-2 text-[10px] font-black uppercase tracking-wider transition-all ${
                  filters.exams.includes(exam)
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : 'bg-white border-gray-50 text-gray-400 hover:border-gray-200'
                }`}
              >
                {exam}
              </button>
            ))}
          </div>
        </section>

        {/* Specializations Filter */}
        <section>
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Specializations</label>
          <div className="flex flex-wrap gap-2">
            {availableSpecializations.slice(0, 15).map((spec) => (
              <button
                key={spec}
                onClick={() => handleToggleSpecialization(spec)}
                className={`px-3 py-1.5 rounded-lg border-2 text-[10px] font-black uppercase tracking-wider transition-all ${
                  filters.specializations.includes(spec)
                    ? 'bg-indigo-900 border-indigo-900 text-white'
                    : 'bg-white border-gray-50 text-gray-400 hover:border-gray-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </section>

        {/* University Type Filter */}
        <section>
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 block">University Type</label>
          <div className="flex flex-wrap gap-2">
            {availableTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleToggleType(type)}
                className={`px-3 py-1.5 rounded-lg border-2 text-[10px] font-black uppercase tracking-wider transition-all ${
                  filters.universityType.includes(type)
                    ? 'bg-gray-900 border-gray-900 text-white'
                    : 'bg-white border-gray-50 text-gray-400 hover:border-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* State Filter */}
        <section>
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 block">States</label>
          <div className="grid grid-cols-2 gap-2">
            {availableStates.map((state) => (
              <button
                key={state}
                onClick={() => handleToggleState(state)}
                className={`px-3 py-2 rounded-xl border-2 text-left truncate text-[11px] font-bold transition-all ${
                  filters.states.includes(state)
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white border-gray-50 text-gray-500 hover:border-gray-100'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </section>

        {/* Levels Filter */}
        <section>
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Study Levels</label>
          <div className="flex flex-wrap gap-2">
            {availableLevels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleToggleLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg border-2 text-[10px] font-black uppercase tracking-wider transition-all ${
                  filters.levels.includes(lvl)
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-gray-50 text-gray-400 hover:border-gray-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="p-6 border-t border-gray-50 bg-gray-50/50">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">
            Advanced Matching Engine v1.8
        </p>
      </div>
    </div>
  )
}
