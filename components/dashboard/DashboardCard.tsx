"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useNotebook } from "@/context/NotebookContext"
import RemarkModal from "../notebook/RemarkModal"

export default function DashboardCard({
  college_id,
  title,
  description,
  logo,
  rating,
  city,
  state,
  established,
  typeofuni,
  approvals,
  highest_package,
  avg_package,
  top_exams,
}: {
  college_id: number
  title: string
  description: string
  logo?: string
  rating: string
  city: string
  state: string
  established: number
  typeofuni: string
  approvals: string
  highest_package?: number
  avg_package?: number
  top_exams?: string[]
}) {
  const router = useRouter()
  const { addNote, removeNote, isInNotebook } = useNotebook()
  const [imgSrc, setImgSrc] = useState(logo || "/college-placeholder.png")
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false)

  function handleNavigate() {
    router.push(`/dashboard/college/${college_id}`)
  }

  function handleBookmarkClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isInNotebook(college_id.toString())) {
      removeNote(college_id.toString());
    } else {
      setIsRemarkModalOpen(true);
    }
  }

  function handleConfirmRemark(remark: string) {
    addNote({
      note_name: title,
      data: [{ college_id, title, city, state, highest_package, avg_package, rating, typeofuni }],
      remark: remark || `Saved from dashboard search.`,
      note_id: college_id.toString()
    });
  }

  return (
    <>
      <div
        onClick={handleNavigate}
        className="bg-white/90 backdrop-blur border border-gray-100 rounded-lg p-4 group hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer flex flex-col justify-between h-full"
      >
        <div className="flex items-start gap-4">
          <div className="relative w-10 h-10 shrink-0 bg-white rounded-md p-1 shadow-sm border border-gray-100 group-hover:bg-gray-50 transition-colors">
            <Image
              src={imgSrc}
              alt={title}
              fill
              className="object-contain p-0.5"
              sizes="40px"
              onError={() => setImgSrc("/college-placeholder.png")}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h2 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1" title={title}>
                {title}
              </h2>
              <button
                onClick={handleBookmarkClick}
                className={`p-1.5 rounded-full transition-all duration-300 -mt-1 -mr-1 ${
                  isInNotebook(college_id.toString())
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-300 hover:text-blue-500 hover:bg-blue-50/50'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill={isInNotebook(college_id.toString()) ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  className="w-4 h-4"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
              </button>
            </div>
            <p className="text-gray-500 text-xs truncate mt-0.5">
              {city}, {state}
            </p>
          </div>
        </div>

        <div className="flex items-center mt-3 pt-3 border-t border-gray-50 gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-gray-700 text-xs font-semibold">{rating || '--'}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-gray-500 text-xs truncate">{established ? `Est. ${established}` : typeofuni || 'Unknown'}</span>
          
          {highest_package && (
            <>
              <div className="w-1 h-1 rounded-full bg-gray-300" />
              <div className="text-emerald-700 font-medium text-xs bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                 ₹{Number(highest_package).toLocaleString('en-IN')} LPA Max
              </div>
            </>
          )}

        </div>

        {/* Exams Badges */}
        {top_exams && top_exams.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {top_exams.map((exam, i) => (
              <span key={i} className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-500 text-[10px] uppercase font-semibold rounded-md tracking-wide">
                {exam}
              </span>
            ))}
          </div>
        )}

      </div>

      <RemarkModal
        isOpen={isRemarkModalOpen}
        onClose={() => setIsRemarkModalOpen(false)}
        onConfirm={handleConfirmRemark}
        title={title}
      />
    </>
  )
}