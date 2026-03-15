"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { authClient } from "@/lib/auth/client"

export default function WelcomePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [stage, setStage] = useState(0)

  useEffect(() => {
    async function loadUser() {
      const { data } = await authClient.getSession()
      if (data?.user?.name) {
        setName(data.user.name.split(" ")[0])
      } else {
        setName("there")
      }
    }
    loadUser()

    // Animation sequence
    const timers = [
      setTimeout(() => setStage(1), 500),   // Show "Welcome"
      setTimeout(() => setStage(2), 2000),  // Show "Name"
      setTimeout(() => setStage(3), 4000),  // Fade out and redirect
    ]

    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (stage === 3) {
      const timer = setTimeout(() => {
        router.push("/dashboard/profile/setup")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [stage, router])

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden z-100">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-purple-600/5 blur-[100px] rounded-full" />
      
      <AnimatePresence mode="wait">
        {stage === 1 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              Welcome to <span className="text-blue-500">College Compass</span>
            </h1>
          </motion.div>
        )}

        {stage === 2 && (
          <motion.div
            key="name"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-6xl font-medium text-gray-300 mb-4">
              Hello,
            </h2>
            <h1 className="text-6xl md:text-8xl font-bold bg-linear-to-r from-white via-blue-400 to-blue-600 bg-clip-text text-transparent">
              {name}
            </h1>
            <p className="mt-8 text-gray-500 text-lg md:text-xl font-light tracking-widest uppercase">
              Let's build your profile
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Line */}
      <motion.div 
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-px bg-gray-800"
        initial={{ width: 0 }}
        animate={{ width: 128 }}
        transition={{ duration: 4, ease: "linear" }}
      >
        <motion.div 
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 4, ease: "linear" }}
        />
      </motion.div>
    </div>
  )
}
