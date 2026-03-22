import Link from "next/link"

export default function LockedState({ featureName }: { featureName: string }) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 md:p-16 rounded-[3rem] shadow-2xl max-w-xl text-center relative z-10">
        <div className="w-24 h-24 mx-auto bg-linear-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-4">
          Oops! <span className="text-red-500">Locked.</span>
        </h2>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
          Sorry, <span className="text-white font-bold">{featureName}</span> is locked until you complete your professional profile. We need your academic details to provide accurate AI capabilities.
        </p>

        <Link
          href="/dashboard/profile"
          className="inline-flex items-center justify-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-full font-black tracking-wide hover:scale-105 transition-transform duration-300 shadow-xl shadow-white/10"
        >
          Complete Profile
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
