"use client"

import { motion } from "framer-motion"

interface DiscoveryCardProps {
  name: string
  count: number
  type: 'stream' | 'specialization' | 'exam' | 'course'
  onClick: () => void
  fullName?: string
  website?: string
  subItems?: string[]
  level?: string
  duration?: number
  stream?: string
}

export default function DiscoveryCard({ 
  name, 
  count, 
  type, 
  onClick,
  fullName,
  website,
  subItems,
  level,
  duration,
  stream
}: DiscoveryCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'stream': return '🎓'
      case 'specialization': return '🔬'
      case 'exam': return '📝'
      case 'course': return '📚'
      default: return '✨'
    }
  }

  const getColorClass = () => {
    switch (type) {
      case 'stream': return 'from-blue-500 to-indigo-600'
      case 'specialization': return 'from-purple-500 to-pink-600'
      case 'exam': return 'from-amber-500 to-orange-600'
      case 'course': return 'from-emerald-500 to-teal-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative group text-left w-full h-[280px] bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden flex flex-col justify-between"
    >
      {/* Decorative Gradient Background */}
      <div className={`absolute -right-12 -top-12 w-48 h-48 bg-linear-to-br ${getColorClass()} opacity-[0.03] group-hover:opacity-[0.1] rounded-full blur-3xl transition-opacity duration-700`} />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-white group-hover:shadow-lg transition-all duration-500">
            {getIcon()}
          </div>
          <div className="px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100/50">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              {count} {count === 1 ? 'Inst' : 'Insts'}
            </span>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors duration-300 mb-2">
            {name}
          </h3>
          
          {fullName && (
            <p className="text-xs font-bold text-gray-400 line-clamp-1 mb-4">{fullName}</p>
          )}

          {subItems && subItems.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {subItems.map((item, i) => (
                <span key={i} className="px-2 py-1 bg-indigo-50/50 text-[9px] font-black text-indigo-500 uppercase tracking-widest rounded-lg">
                  {item}
                </span>
              ))}
            </div>
          )}

          {(level || duration || stream) && (
            <div className="flex flex-wrap gap-3 mt-4">
              {stream && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stream}</span>
                </div>
              )}
              {level && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{level}</span>
                </div>
              )}
              {duration && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{duration}YRS</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          {website ? (
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline decoration-2">Official Site</span>
          ) : (
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Explore Details</span>
          )}
          
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 opacity-20 group-hover:opacity-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.button>
  )
}
