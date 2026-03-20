"use client"

import NotesList from "@/components/dashboard/NotesList"
import SynthesisPanel from "@/components/notebook/SynthesisPanel"
import { motion } from "framer-motion"
import { useState } from "react"

export default function ReportPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  return (
    <div className="flex flex-col h-full bg-[#0a0f18] text-gray-100 font-sans overflow-y-auto">
      
      <div className="max-w-7xl mx-auto w-full px-6 py-12 flex flex-col">
        
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 shrink-0"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Analytics Hub</span>
            <div className="h-px w-12 bg-gray-800" />
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Personalized Insights</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight bg-linear-to-r from-white via-blue-100 to-gray-500 bg-clip-text text-transparent">
            Saved Reports <br />& <span className="text-blue-500">Academic Notes.</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* NOTES LIST COLUMN */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col"
          >
            <div className="bg-[#111827]/50 border border-gray-800 rounded-[32px] p-8 shadow-2xl backdrop-blur-sm flex flex-col">
              <div className="flex items-center justify-between mb-8 shrink-0">
                <h2 className="text-2xl font-bold tracking-tight">Recent Notes</h2>
                <div className="flex gap-2">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-widest bg-gray-800/50 px-3 py-1 rounded-full">
                    {selectedIds.length} Selected
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                <NotesList onSelectionChange={setSelectedIds} />
              </div>
            </div>
          </motion.div>

          {/* SYNTHESIS / SIDEBAR COLUMN */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-8"
          >
            <SynthesisPanel selectedIds={selectedIds} />

            <div className="bg-[#111827]/30 border border-gray-800 rounded-[32px] p-8">
              <h3 className="text-lg font-bold mb-4">Upcoming Deadlines</h3>
              <div className="space-y-4">
                {[
                  { title: "COEP Form Submission", date: "Mar 20" },
                  { title: "VJTI Counselling", date: "Apr 05" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-200">{item.title}</div>
                      <div className="text-xs text-gray-500 font-medium">{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </div>
  )
}
