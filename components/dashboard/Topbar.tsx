"use client"

import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth/client"
import { useRouter, useSearchParams } from "next/navigation"

export default function Topbar() {

  const router = useRouter()

  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ""
  const [searchQuery, setSearchQuery] = useState(q)

  const [name, setName] = useState("")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim() === "") {
       router.push("/dashboard")
    } else {
       router.push(`/dashboard?q=${encodeURIComponent(searchQuery)}`)
    }
  }

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

  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-xl z-50 sticky top-0">

      {/* SEARCH BAR */}
      <form onSubmit={handleSearch} className="group flex items-center w-full max-w-3xl bg-gray-50 hover:bg-white border border-gray-100 focus-within:border-gray-200 focus-within:bg-white focus-within:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-full px-5 py-2.5 transition-all duration-300 ease-out">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-300 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search colleges, courses..."
          className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-gray-900 placeholder-gray-400"
        />
        <button type="submit" className="hidden"></button>
        <kbd className="hidden sm:flex items-center justify-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm group-focus-within:opacity-0 group-focus-within:translate-x-2 transition-all duration-300 shrink-0">
          <span className="text-[13px] leading-none text-gray-600 font-sans">⌘</span>
          <span className="text-[11px] font-bold text-gray-600 uppercase">K</span>
        </kbd>
      </form>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6 shrink-0 ml-4">

        {/* FEATURES DROPDOWN */}
        <div
          className="relative"
          onMouseEnter={() => setFeaturesOpen(true)}
          onMouseLeave={() => setFeaturesOpen(false)}
        >
          <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 py-2 transition-colors duration-200">
            Features
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform duration-300 ${featuresOpen ? 'rotate-180 text-gray-900' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Invisible padding to prevent hover gap issues */}
          <div className="absolute top-full left-0 w-full h-2" />

          <div 
            className={`absolute right-0 top-[calc(100%+8px)] w-64 z-50 transition-all duration-300 origin-top-right
              ${featuresOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
          >
            <div className="bg-white border border-gray-100 rounded-xl shadow-xl shadow-gray-200/50 p-2 overflow-hidden ring-1 ring-black/5">
              <div className="flex flex-col">
                
                <div className="group/item flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600 group-hover/item:bg-blue-100 group-hover/item:scale-105 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">AI Search</div>
                    <div className="text-[11px] text-gray-500 leading-tight mt-0.5 text-balance">Conversational college discovery</div>
                  </div>
                </div>

                <div className="group/item flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-purple-50 text-purple-600 group-hover/item:bg-purple-100 group-hover/item:scale-105 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Explore Colleges</div>
                    <div className="text-[11px] text-gray-500 leading-tight mt-0.5 text-balance">Browse extensive databases</div>
                  </div>
                </div>

                <div className="group/item flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600 group-hover/item:bg-amber-100 group-hover/item:scale-105 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Compare</div>
                    <div className="text-[11px] text-gray-500 leading-tight mt-0.5 text-balance">Side-by-side analysis</div>
                  </div>
                </div>

                <div className="group/item flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-100 group-hover/item:scale-105 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Cutoff Trends</div>
                    <div className="text-[11px] text-gray-500 leading-tight mt-0.5 text-balance">Historical admission data</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>


        {/* PROFILE SECTION */}
        <div
          className="relative flex items-center gap-2"
          onMouseEnter={() => setProfileOpen(true)}
          onMouseLeave={() => setProfileOpen(false)}
        >

          <button className="group flex items-center gap-2.5 p-1 pr-3 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-300 ease-out">
            
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#1b2533] text-white flex items-center justify-center text-sm font-bold shadow-sm ring-1 ring-white group-hover:scale-105 transition-all duration-300">
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>

            {/* Username */}
            <span className="text-sm font-semibold text-gray-900 tracking-tight transition-colors duration-300">
              {name || "User"}
            </span>
            
          </button>

          {/* Invisible padding to prevent hover gap issues */}
          <div className="absolute top-full right-0 w-full h-2" />

          <div 
            className={`absolute right-0 top-[calc(100%+8px)] w-56 z-50 transition-all duration-300 origin-top-right
              ${profileOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
          >
            <div className="bg-white border border-gray-100 rounded-xl shadow-xl shadow-gray-200/50 p-2 overflow-hidden ring-1 ring-black/5">
              <div className="flex flex-col">

                <div className="group/item flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-gray-50 text-gray-600 group-hover/item:bg-gray-100 group-hover/item:text-gray-900 group-hover/item:scale-105 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Profile</div>
                    <div className="text-[11px] text-gray-500 leading-tight mt-0.5 text-balance">Manage your account</div>
                  </div>
                </div>

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