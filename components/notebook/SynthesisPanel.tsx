"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { generateReport, downloadPdf } from "@/lib/notebookApi"
import { useNotebook } from "@/context/NotebookContext"
import ReportModal from "./ReportModal"

export default function SynthesisPanel({ 
  selectedIds 
}: { 
  selectedIds: string[] 
}) {
  const { notes } = useNotebook()
  const [query, setQuery] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportHtml, setReportHtml] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleGenerate = async () => {
    if (selectedIds.length === 0) return
    setIsGenerating(true)
    try {
      const selectedNotes = notes.filter(n => selectedIds.includes(n.note_id))
      const html = await generateReport({
        user_id: "user_123", // Replace with real user ID if available
        notebook: selectedNotes,
        user_query: query || "Summarize these colleges for me."
      })
      
      // Final sanity check: if generateReport somehow returned an object, extract the html
      const finalHtml = typeof html === 'object' && html !== null
        ? (html as any).html || JSON.stringify(html)
        : html;
        
      setReportHtml(finalHtml)
      setIsModalOpen(true)
    } catch (error) {
      console.error("Generation failed", error)
      alert("Failed to generate report. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-[32px] p-8 text-white shadow-xl shadow-blue-500/10 flex flex-col gap-8">
      <div>
        <h3 className="text-xl font-bold mb-2">Synthesis Engine</h3>
        <p className="text-blue-100 text-sm mb-6">
          Select colleges and ask a specific question to generate a custom analysis report.
        </p>

        <div className="space-y-4">
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
            <label className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-3 block">
              What do you want to find out?
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Compare the placements and campus life of these colleges."
              className="bg-transparent border-none w-full text-white placeholder:text-blue-300/50 focus:ring-0 text-sm h-32 resize-none p-0 custom-scrollbar"
            />
          </div>
          
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-blue-200 bg-black/20 px-4 py-2 rounded-xl">
            <span>Selected Institutions</span>
            <span className="bg-white text-blue-600 px-2 py-0.5 rounded-md">{selectedIds.length}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={selectedIds.length === 0 || isGenerating}
        className="w-full bg-white text-blue-600 font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 mt-auto"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating...
          </>
        ) : (
          "Generate Synthesis Report"
        )}
      </button>

      {isModalOpen && reportHtml && (
        <ReportModal 
          html={reportHtml} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  )
}
