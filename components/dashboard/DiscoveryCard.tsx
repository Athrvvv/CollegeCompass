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
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative group text-left w-full h-[280px] bg-white/70 backdrop-blur-3xl rounded-[32px] p-7 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.1)] border border-slate-100 transition-all duration-500 overflow-hidden flex flex-col justify-between"
    >
      {/* Dynamic Animated Gradient Background */}
      <div className={`absolute -right-20 -top-20 w-64 h-64 bg-linear-to-br ${getColorClass()} opacity-0 group-hover:opacity-[0.15] rounded-full blur-[60px] transition-all duration-700 ease-out group-hover:scale-150`} />
      
      {/* Glowing Border effect on hover */}
      <div className={`absolute inset-0 rounded-[32px] bg-linear-to-br ${getColorClass()} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} style={{ margin: '-1px' }} />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/50 transition-all duration-700 opacity-0 group-hover:opacity-100" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-5">
          <div className="relative w-14 h-14 rounded-[20px] bg-slate-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-500 z-10">
            {/* Custom Icon Background Glow */}
            <div className={`absolute inset-0 bg-linear-to-br ${getColorClass()} opacity-0 group-hover:opacity-20 rounded-[20px] blur-md transition-opacity duration-500`} />
            <div className="relative bg-white w-full h-full rounded-[20px] shadow-sm border border-slate-100/50 flex items-center justify-center group-hover:border-transparent transition-colors">
              <span className="drop-shadow-sm">{getIcon()}</span>
            </div>
          </div>
          <div className="px-3.5 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200/60 shadow-xs">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              {count} {count === 1 ? 'Inst' : 'Insts'}
            </span>
          </div>
        </div>

        <div className="flex-1 mt-2">
          <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors duration-300 mb-1.5 tracking-tight">
            {name}
          </h3>
          
          {fullName && (
            <p className="text-xs font-bold text-slate-400 line-clamp-1 mb-4 leading-relaxed tracking-wide">{fullName}</p>
          )}

          {subItems && subItems.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {subItems.slice(0, 3).map((item, i) => (
                <span key={i} className="px-2.5 py-1 bg-indigo-50/80 border border-indigo-100/50 text-[9px] font-black text-indigo-500 uppercase tracking-widest rounded-lg shadow-inner">
                  {item}
                </span>
              ))}
              {subItems.length > 3 && (
                <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest rounded-lg">
                  +{subItems.length - 3}
                </span>
              )}
            </div>
          )}

          {(level || duration || stream) && (
            <div className="flex flex-wrap gap-4 mt-5">
              {stream && (
                <div className="flex items-center gap-1.5 bg-slate-50/50 px-2.5 py-1 rounded-md">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stream}</span>
                </div>
              )}
              {level && (
                <div className="flex items-center gap-1.5 bg-emerald-50/50 px-2.5 py-1 rounded-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{level}</span>
                </div>
              )}
              {duration && (
                <div className="flex items-center gap-1.5 bg-blue-50/50 px-2.5 py-1 rounded-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{duration}YRS</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-5 pb-1 flex items-center justify-between border-t border-slate-100/50 pt-4">
          {website ? (
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-600 transition-colors flex items-center gap-1">
              Official Site
              <svg className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
          ) : (
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 group-hover:text-indigo-500 transition-colors">
              Explore Details
            </span>
          )}
          
          <div className="w-10 h-10 rounded-[14px] bg-slate-50/80 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 group-hover:shadow-[0_4px_12px_rgba(79,70,229,0.3)] transition-all duration-500 transform group-hover:-translate-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.button>
  )
}
