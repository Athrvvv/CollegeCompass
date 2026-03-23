"use client"

import { useState, useEffect, Suspense } from "react"
import { authClient } from "@/lib/auth/client"
import { motion } from "framer-motion"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Link from "next/link"

function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ""
  const [searchQuery, setSearchQuery] = useState(q)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim() === "") {
       router.push("/dashboard")
    } else {
       router.push(`/dashboard?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="group flex items-center w-full bg-white/5 hover:bg-white/10 border border-white/10 focus-within:border-white/20 focus-within:bg-white/10 rounded-full px-4 py-2 sm:py-2.5 transition-all duration-300 ease-out">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 group-focus-within:text-white transition-colors duration-300 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        className="flex-1 min-w-0 bg-transparent border-none outline-none text-[13px] sm:text-[15px] font-medium text-white placeholder-gray-500"
      />
      <button type="submit" className="hidden"></button>
      <kbd className="hidden sm:flex items-center justify-center gap-1 bg-white/10 border border-white/10 rounded-full px-3 py-1 group-focus-within:opacity-0 group-focus-within:translate-x-2 transition-all duration-300 shrink-0">
        <span className="text-[13px] leading-none text-gray-400 font-sans">⌘</span>
        <span className="text-[11px] font-bold text-gray-400 uppercase">K</span>
      </kbd>
    </form>
  )
}

export default function Topbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [profileOpen, setProfileOpen] = useState(false)
  const [name, setName] = useState("")

  useEffect(() => {
    async function loadSession() {
      const { data } = await authClient.getSession()
      if (data?.user?.name) {
        setName(formatName(data.user.name))
      }
    }
    loadSession()
  }, [])

  function formatName(name: string) {
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  async function handleLogout() {
    await authClient.signOut()
    router.push("/")
  }

  const tabs = [
    { name: "AI Search", href: "/dashboard" },
    { name: "AI Advisor", href: "/dashboard/advisor" },
    { name: "Compare", href: "/dashboard/compare" },
    { name: "Cutoff Trends", href: "/dashboard/cutoff" },
    { name: "Notebook", href: "/dashboard/notebook" },
    { name: "FYP", href: "/dashboard/fyp" },
  ]

  return (
    <div className="w-full bg-slate-950/90 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3 flex flex-wrap sm:flex-nowrap items-center justify-between shadow-2xl z-50 sticky top-0 gap-y-3 gap-x-4">

      {/* SEARCH BAR WITH SUSPENSE */}
      <Suspense fallback={<div className="flex-1 sm:max-w-xl bg-white/5 rounded-full px-5 py-2.5 h-10 animate-pulse min-w-0" />}>
        <div className="flex-1 min-w-0 sm:max-w-xl">
          <SearchInput />
        </div>
      </Suspense>

      {/* TABS SECTION */}
      <nav className="w-full sm:w-auto sm:flex-1 order-3 sm:order-none flex justify-start items-center overflow-x-auto no-scrollbar mask-gradient-right pb-1 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="flex items-center gap-2 sm:gap-1 sm:bg-white/5 sm:p-1.5 sm:rounded-2xl sm:border border-white/10 w-max pr-4 sm:pr-0">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          
          if (tab.name === "FYP") {
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`relative px-4 sm:px-5 py-2 sm:py-2 text-[12px] sm:text-sm font-bold transition-all duration-300 ease-out rounded-full sm:rounded-xl whitespace-nowrap group/fyp overflow-hidden border ${
                  isActive
                    ? 'text-white border-transparent bg-white/10 shadow-[0_0_30px_rgba(168,85,247,0.3)]'
                    : 'text-white/90 border-purple-500/30 sm:border-transparent bg-linear-to-r from-red-500/10 via-blue-500/10 to-purple-500/10 sm:bg-transparent hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                }`}
              >
                {!isActive && <div className="absolute inset-0 bg-linear-to-r from-red-500/10 via-blue-500/10 to-purple-500/10 sm:from-transparent sm:group-hover/fyp:from-red-500/10 transition-all duration-500 -z-10" />}
                <span className="relative z-10 flex items-center gap-2.5">
                  <span className="bg-linear-to-r from-red-300 uppercase via-blue-300 to-purple-300 bg-clip-text text-transparent">{tab.name}</span>
                  <span className="text-[11px] animate-pulse">✨</span>
                </span>
                {isActive && (
                  <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-8 h-[2px] bg-linear-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                )}
              </Link>
            )
          }

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`relative px-4 sm:px-5 py-2 sm:py-2 text-[12px] sm:text-sm font-bold transition-all duration-300 ease-out rounded-full sm:rounded-xl whitespace-nowrap border
                ${isActive 
                  ? 'text-slate-900 sm:text-white bg-white sm:bg-white/10 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.2)] border-transparent' 
                  : 'text-slate-400 hover:text-white bg-white/5 sm:bg-transparent sm:hover:bg-white/5 border-white/5 sm:border-transparent'
                }`}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                {tab.name}
              </span>
              {isActive && (
                <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-6 h-[2px] bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)] hidden sm:block"></span>
              )}
            </Link>
          )
        })}
        </div>
      </nav>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-2 sm:gap-6 shrink-0 order-2 sm:order-none">

        {/* PROFILE SECTION */}
        <div
          className="relative flex items-center gap-2"
          onMouseEnter={() => setProfileOpen(true)}
          onMouseLeave={() => setProfileOpen(false)}
        >
          <button className="group flex items-center gap-2 p-1 sm:pr-3 rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-300 ease-out">
            <div className="w-8 h-8 rounded-full bg-white text-slate-950 flex items-center justify-center text-sm font-bold shadow-sm ring-1 ring-white group-hover:scale-105 transition-all duration-300">
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="text-[13px] sm:text-sm font-bold text-white tracking-tight transition-colors duration-300 hidden sm:inline-block">
              {name || "User"}
            </span>
          </button>
          <div className="absolute top-full right-0 w-full h-2" />
          <div 
            className={`absolute right-0 top-[calc(100%+8px)] w-56 z-50 transition-all duration-300 origin-top-right
              ${profileOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
          >
            <div className="bg-white border border-gray-100 rounded-xl shadow-xl shadow-gray-200/50 p-2 overflow-hidden ring-1 ring-black/5">
              <div className="flex flex-col">
                <Link 
                  href="/dashboard/profile"
                  className="group/item flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                >
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-gray-50 text-gray-600 group-hover/item:bg-gray-100 group-hover/item:text-gray-900 group-hover/item:scale-105 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Profile</div>
                    <div className="text-[11px] text-gray-500 leading-tight mt-0.5 text-balance">Manage your account</div>
                  </div>
                </Link>

                <div className="group/item flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-gray-50 text-gray-600 group-hover/item:bg-gray-100 group-hover/item:text-gray-900 group-hover/item:scale-105 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Settings</div>
                    <div className="text-[11px] text-gray-500 leading-tight mt-0.5 text-balance">Preferences & notifications</div>
                  </div>
                </div>

                <div className="my-1 border-t border-gray-100"></div>

                <button
                  onClick={handleLogout}
                  className="group/item w-full flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-red-50 cursor-pointer transition-colors duration-200 text-left"
                >
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-red-50 text-red-500 group-hover/item:bg-red-100 group-hover/item:scale-105 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-red-600">Logout</div>
                    <div className="text-[11px] text-red-400 leading-tight mt-0.5 text-balance">Securely sign out</div>
                  </div>
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}