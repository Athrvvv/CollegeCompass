"use client"

import { motion, AnimatePresence } from "framer-motion"
import { downloadPdf } from "@/lib/notebookApi"
import { useState } from "react"

export default function ReportModal({ 
  html, 
  isOpen, 
  onClose 
}: { 
  html: string, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const downloadUrl = await downloadPdf(html)
      
      // Handle download via hidden link for both standard and blob URLs
      const link = document.createElement("a")
      link.href = downloadUrl
      link.setAttribute("download", "Notebook_Analysis.pdf")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // If it's a blob URL, we should revoke it after a few seconds
      if (downloadUrl.startsWith("blob:")) {
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 10000)
      }
    } catch (error) {
      console.error("Download failed", error)
      alert("Failed to download PDF.")
    } finally {
      setIsDownloading(false)
    }
  }

  // AI-generated SVG/HTML often has escaped quotes like \"63.1\" which breaks React render
  const sanitizedHtml = html
    ?.replace(/&quot;/g, '"')
    ?.replace(/\\"/g, '"')
    ?.replace(/"([^"]*)"/g, '$1') // Sometimes triple quotes occur
    ?.replace(/="([\d.]+)"/g, '="$1"') // Restore simple digits
    // Actually, the most robust way is to just look for \" and replace with "
    .split('\\"').join('"');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0a0f18]/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl h-[85vh] bg-[#111827] border border-gray-800 rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-800 shrink-0">
              <div>
                <h3 className="text-xl font-bold">Synthesis Report</h3>
                <p className="text-gray-500 text-xs mt-1">AI-generated analysis based on your selected institutions.</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                >
                  {isDownloading ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  {isDownloading ? "Preparing..." : "Download PDF"}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content Preview */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white rounded-[32px] m-4">
              <div 
                className="prose prose-sm max-w-none text-gray-900"
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
