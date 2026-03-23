"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 sm:px-6 ${
        scrolled ? "py-4" : "py-6"
      }`}
    >
      <div className={`max-w-7xl mx-auto h-16 rounded-2xl flex items-center justify-between px-4 sm:px-8 transition-all duration-500 ${
        scrolled 
          ? "bg-white/70 backdrop-blur-md border border-slate-100 shadow-xl shadow-slate-200/50" 
          : "bg-transparent border-transparent"
      }`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center text-sm font-bold shadow-sm group-hover:bg-indigo-500 transition-colors">
            ✦
          </div>
          <span className="font-semibold text-lg text-slate-800 tracking-tight">
            CollegeCompass
          </span>
        </Link>

        {/* Desktop Navigation - Removed as per user request */}
        <div className="hidden md:flex flex-1"></div>

        {/* CTA Button */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/*<Link 
            href="/login" 
            className="text-[13px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Log in
          </Link>*/}
          <Link 
            href="/login" 
            className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-slate-900 transition-all shadow-md shadow-slate-200 active:scale-95"
          >
            Log in
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}