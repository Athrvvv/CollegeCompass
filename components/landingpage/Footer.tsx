"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      })

      if (res.ok) {
        setStatus("success")
        setEmail("")
        setMessage("")
      } else {
        setStatus("error")
      }
    } catch (err) {
      setStatus("error")
    }

    setTimeout(() => setStatus("idle"), 5000)
  }

  return (
    <footer className="relative bg-slate-50 pt-32 pb-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Mission + Links */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-sm font-bold">
                  ✦
                </div>
                <span className="font-bold text-xl text-slate-900">
                  CollegeCompass
                </span>
              </div>
              <p className="text-slate-500 max-w-sm leading-relaxed text-sm lg:text-base">
                Navigating the complex landscape of higher education with data-driven insights and AI-powered discovery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Product</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Institutions</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Cutoff Trends</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Comparison Tool</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Company</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Query Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-6 sm:p-10 rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 relative overflow-hidden"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Send us a query</h3>
              <p className="text-slate-500 text-sm">Have an issue or a question? We're here to help.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-600 outline-none transition-all text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Your Query</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you today?"
                  rows={4}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-600 outline-none transition-all text-slate-900 resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={status === "loading"}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                  status === "success" 
                    ? "bg-green-600 text-white" 
                    : status === "error"
                    ? "bg-rose-600 text-white"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {status === "loading" ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : status === "success" ? (
                  <>Sent Successfully ✓</>
                ) : status === "error" ? (
                  <>Failed to Send ✕</>
                ) : (
                  <>Send Message</>
                )}
              </motion.button>
            </form>

            <AnimatePresence>
              {status === "success" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur flex flex-col items-center justify-center text-center p-8 z-10"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl mb-4">
                    ✓
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h4>
                  <p className="text-slate-500 text-sm">We'll get back to you within 24 hours.</p>
                  <button 
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-indigo-600 font-bold text-sm hover:underline"
                  >
                    Send another
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="mt-16 sm:mt-24 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-widest text-center sm:text-left">
          <p>© {new Date().getFullYear()} CollegeCompass. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}