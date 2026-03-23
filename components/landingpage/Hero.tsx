"use client"

import { ReactTyped } from "react-typed"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-6 pt-24 pb-16">
      {/* Background Subtle Gradients */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-white">
        <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-indigo-50/50 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-slate-50/50 rounded-full blur-[100px] animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content Section */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-[11px] font-bold uppercase tracking-[0.25em]"
              >
                Intelligent Navigator
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight text-slate-800 leading-[1.1]">
                Master Your Admission with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-400 block mt-2">
                  <ReactTyped
                    strings={["Insights", "Precision", "Success"]}
                    typeSpeed={70}
                    backSpeed={40}
                    loop
                  />
                </span>
              </h1>
            </div>

            <p className="text-lg lg:text-2xl text-slate-400 leading-relaxed max-w-xl font-light">
              Explore institutions tailored to your <span className="text-slate-600 font-medium">rank</span>, analyze historical <span className="text-slate-600 font-medium">trends</span>, and compare colleges with a more refined perspective.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/signup">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 bg-slate-800 text-white rounded-2xl font-medium shadow-xl shadow-slate-200 hover:shadow-2xl transition-all flex items-center gap-2 group text-lg"
                >
                  Get Started
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Minimalist Cards Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 bg-white/40 backdrop-blur-sm p-10 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:bg-white/60">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-xl border border-indigo-100">
                    ✦
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 text-lg">Rank Matching</h3>
                    <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-0.5">Historical Accuracy: 98.4%</p>
                  </div>
                </div>
                <p className="text-slate-500 text-base leading-relaxed font-light">
                  Direct correlation between entrance ranks and institutional cutoffs using verified multi-year datasets.
                </p>
              </div>

              <div className="bg-white/40 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-100 transition-all">
                <h3 className="font-semibold text-slate-700 text-base mb-3">Compare</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-light">
                  Granular analysis of fees, placements, and campus environment.
                </p>
              </div>

              <div className="bg-white/40 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-100 transition-all">
                <h3 className="font-semibold text-slate-700 text-base mb-3">Trends</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-light">
                  Round-wise projection models and predictive admission logic.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}