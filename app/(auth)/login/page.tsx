'use client';

import { useActionState } from 'react';
import { signInWithEmail } from "./actions"
import Link from "next/link"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [state, action, isPending] = useActionState(signInWithEmail, null);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 py-24 sm:py-12 overflow-x-hidden overflow-y-auto bg-slate-950">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Back to Landing */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-4 sm:top-8 sm:left-8 z-50"
      >
        <Link
          href="/"
          className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300 font-medium"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span>Back to home</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px] mt-12 sm:mt-0"
      >
        {/* Logo Section */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-linear-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-500/20"
          >
            <span className="text-3xl text-white font-bold">✦</span>
          </motion.div>
          <h2 className="text-3xl font-black text-white tracking-tight italic">CollegeCompass</h2>
          <p className="text-slate-400 mt-2 font-medium">Welcome back! Please enter your details.</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] pointer-events-none" />
          
          <form action={action} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                required
                disabled={isPending}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Password</label>
                <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</Link>
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                disabled={isPending}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            {state?.error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <p className="text-red-400 text-xs text-center font-bold tracking-tight">{state.error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-linear-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-400 font-medium text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-white font-black hover:text-indigo-400 transition-colors hover:underline underline-offset-4 decoration-2">
                Create one for free
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center mt-8 text-slate-500 text-xs font-semibold tracking-wide uppercase px-4 leading-relaxed">
          The ultimate platform for higher education discovery & analytics.
        </p>
      </motion.div>
    </div>
  )
}