"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { authClient } from "@/lib/auth/client"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [profile, setProfile] = useState<any>(null)
  const [editedProfile, setEditedProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Verification states
  const [verifyModal, setVerifyModal] = useState<"email" | "phone" | null>(null)
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  // Exam editing states
  const [selectedExamId, setSelectedExamId] = useState("")
  const [examScore, setExamScore] = useState("")

  const examsList = [
    { id: "jee_mains", name: "JEE Mains" },
    { id: "jee_adv", name: "JEE Advanced" },
    { id: "neet", name: "NEET" },
    { id: "mht_cet", name: "MHT CET" },
    { id: "bitsat", name: "BITSAT" },
    { id: "viteeee", name: "VITEEE" },
  ]

  const categories = ["GEN", "OBC-NCL", "SC", "ST", "GEN-EWS"]
  const states = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Other"]

  useEffect(() => {
    async function init() {
      const { data: sessionData } = await authClient.getSession()
      if (!sessionData?.session) {
        router.push("/")
        return
      }

      try {
        const res = await fetch("/api/profile")
        const data = await res.json()
        
        if (!data || !data.onboarding_completed) {
          router.push("/dashboard/profile/welcome")
        } else {
          setProfile(data)
          setEditedProfile(data)
          if (searchParams.get("new") === "true") {
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router, searchParams])

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: editedProfile.first_name,
          middleName: editedProfile.middle_name,
          lastName: editedProfile.last_name,
          phone: editedProfile.phone,
          email: editedProfile.email,
          qualification: editedProfile.education_qualification,
          exams: editedProfile.exams_appeared,
          userRank: editedProfile.user_rank ? parseInt(editedProfile.user_rank) : null,
          category: editedProfile.category,
          gender: editedProfile.gender,
          stateOfEligibility: editedProfile.state_of_eligibility,
          pwdStatus: editedProfile.pwd_status,
        }),
      })
      if (res.ok) {
        setProfile(editedProfile)
        setIsEditing(false)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async () => {
    setIsVerifying(true)
    try {
      const res = await fetch("/api/profile/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: verifyModal, otp })
      })
      const data = await res.json()
      
      if (res.ok && data.success) {
        // Optimistically update the UI
        if (verifyModal === "email") {
          setProfile({ ...profile, email_verified: true })
          setEditedProfile({ ...editedProfile, email_verified: true })
        } else {
          setProfile({ ...profile, phone_verified: true })
          setEditedProfile({ ...editedProfile, phone_verified: true })
        }
        setVerifyModal(null)
        setOtp("")
      } else {
        alert(data.error || "Invalid Verification Code")
      }
    } catch (e) {
      console.error(e)
      alert("Verification failed.")
    } finally {
      setIsVerifying(false)
    }
  }

  const requestOtp = async (type: "email" | "phone") => {
    setVerifyModal(type)
    try {
      if (type === "email") {
        const res = await fetch("/api/profile/verify-email", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: editedProfile.email }) 
        })
        if (!res.ok) {
          const data = await res.json()
          alert(data.error || "Failed to send email OTP")
        }
      } else {
        const res = await fetch("/api/profile/verify-phone", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: editedProfile.phone }) 
        })
        if (!res.ok) {
          const data = await res.json()
          alert(data.error || "Failed to send phone OTP")
        }
      }
    } catch (e) {
      console.error("OTP Request Failed:", e)
      alert("Network error: Could not request OTP")
    }
  }

  const addExam = () => {
    if (!selectedExamId || !examScore) return
    const exam = examsList.find(e => e.id === selectedExamId)
    if (exam) {
      const currentExams = editedProfile.exams_appeared || []
      if (currentExams.find((e: any) => e.examId === selectedExamId)) return

      setEditedProfile({
        ...editedProfile,
        exams_appeared: [...currentExams, { examId: selectedExamId, name: exam.name, score: examScore }]
      })
      setSelectedExamId("")
      setExamScore("")
    }
  }

  const removeExam = (examId: string) => {
    setEditedProfile({ ...editedProfile, exams_appeared: (editedProfile.exams_appeared || []).filter((e: any) => e.examId !== examId) })
  }

  if (loading || !profile) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 relative">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-slate-50 overflow-y-auto overflow-x-hidden custom-scrollbar relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Verification Modal */}
      <AnimatePresence>
        {verifyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-2">Verify {verifyModal === "email" ? "Email" : "Phone"}</h3>
              <p className="text-sm font-bold text-slate-500 mb-6">Enter the 6-digit code sent to {verifyModal === "email" ? editedProfile.email : editedProfile.phone}.</p>
              
              <input 
                type="text" 
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-500 transition-all font-black text-center tracking-[0.5em] text-2xl mb-6"
                placeholder="000000"
              />
              
              <div className="flex gap-3">
                <button onClick={() => setVerifyModal(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">Cancel</button>
                <button onClick={handleVerification} disabled={otp.length !== 6 || isVerifying} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                  {isVerifying ? "Verifying..." : "Verify"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Success Modal */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md"
          >
            <div className="text-center p-12 bg-white rounded-[3rem] shadow-2xl border border-indigo-50">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner rotate-3">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Profile Updated</h2>
              <p className="text-slate-500 font-bold text-lg">Your data is synchronized securely.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto space-y-8 p-6 md:p-12 relative z-10 pb-32">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 mb-4 border border-indigo-100/50">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Onboarding Platform</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Portfolio Manager</h1>
            <p className="text-slate-500 font-bold max-w-xl">Curate your identity and academic standing to receive hyper-personalized AI admission strategies.</p>
          </div>
          <div className="flex gap-3 shrink-0">
             <Link href="/dashboard" className="px-6 py-3 bg-white text-slate-600 border-2 border-slate-200/60 rounded-2xl font-bold hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-2">
               Dashboard
             </Link>
             {isEditing && (
               <button onClick={() => { setIsEditing(false); setEditedProfile(profile); }} className="px-6 py-3 bg-white text-rose-600 border-2 border-rose-100 rounded-2xl font-bold hover:bg-rose-50 transition-all">Cancel</button>
             )}
             <button 
               onClick={isEditing ? handleSave : () => setIsEditing(true)}
               disabled={loading}
               className={`px-8 py-3 rounded-2xl font-black transition-all shadow-xl flex items-center gap-2 ${isEditing ? 'bg-indigo-600 shadow-indigo-500/20 text-white hover:bg-indigo-700 hover:-translate-y-0.5' : 'bg-slate-900 shadow-slate-900/20 text-white hover:bg-black hover:-translate-y-0.5'}`}
             >
               {loading ? "Syncing..." : (isEditing ? "Save & Sync" : "Edit Portfolio")}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section 1: Identity Core */}
          <section className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] group-hover:bg-indigo-500/10 transition-colors" />
            <div className="flex items-center gap-4 mb-8 relative">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Identity Core</h3>
            </div>
            <div className="space-y-5 relative">
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="First Name" value={editedProfile.first_name} isEditing={isEditing} onChange={(v) => setEditedProfile({...editedProfile, first_name: v})} />
                <InfoItem label="Last Name" value={editedProfile.last_name} isEditing={isEditing} onChange={(v) => setEditedProfile({...editedProfile, last_name: v})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">Gender</label>
                  {isEditing ? (
                    <select value={editedProfile.gender || ""} onChange={(e) => setEditedProfile({...editedProfile, gender: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-700">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Neutral">Neutral</option>
                    </select>
                  ) : <p className="text-lg font-black text-slate-900">{profile.gender || "---"}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">Category</label>
                  {isEditing ? (
                    <select value={editedProfile.category || ""} onChange={(e) => setEditedProfile({...editedProfile, category: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-700">
                      <option value="">Select</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : <p className="text-lg font-black text-slate-900">{profile.category || "---"}</p>}
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">PwD Status</label>
                {isEditing ? (
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-6 h-6 bg-slate-100 rounded-md border-2 border-slate-200 group-hover:border-indigo-400 transition-colors">
                      <input type="checkbox" checked={editedProfile.pwd_status || false} onChange={(e) => setEditedProfile({...editedProfile, pwd_status: e.target.checked})} className="opacity-0 absolute inset-0 cursor-pointer" />
                      {editedProfile.pwd_status && <svg className="w-4 h-4 text-indigo-600 absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="font-bold text-slate-700">Person with Disability</span>
                  </label>
                ) : <p className="text-lg font-black text-slate-900">{profile.pwd_status ? "Yes" : "No"}</p>}
              </div>
            </div>
          </section>

          {/* Section 2: Contact & Security */}
          <section className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] group-hover:bg-emerald-500/10 transition-colors" />
            <div className="flex items-center gap-4 mb-8 relative">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Security & Contact</h3>
            </div>
            <div className="space-y-6 relative">
              <ContactItem label="Primary Email" value={editedProfile.email} isEditing={isEditing} onChange={(v) => setEditedProfile({...editedProfile, email: v})} verified={profile.email_verified} onVerify={() => requestOtp("email")} />
              <ContactItem label="Phone Number" value={editedProfile.phone} isEditing={isEditing} onChange={(v) => setEditedProfile({...editedProfile, phone: v})} verified={profile.phone_verified} onVerify={() => requestOtp("phone")} />
            </div>
          </section>

          {/* Section 3: Academic Portfolio */}
          <section className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/40 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 blur-[50px] group-hover:bg-amber-500/10 transition-colors" />
            <div className="flex items-center gap-4 mb-8 relative">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Academic Portfolio</h3>
            </div>
            <div className="space-y-6 relative">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Current Qualification</label>
                {isEditing ? (
                  <select value={editedProfile.education_qualification || ""} onChange={(e) => setEditedProfile({...editedProfile, education_qualification: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-700">
                    <option value="">Select Qualification</option>
                    {["12th Appearing", "12th Passed", "Diploma", "Undergraduate (UG)", "Dropper"].map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                ) : <p className="text-lg font-black text-slate-900">{profile.education_qualification || "---"}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">State of Eligibility (Home State)</label>
                {isEditing ? (
                  <select value={editedProfile.state_of_eligibility || ""} onChange={(e) => setEditedProfile({...editedProfile, state_of_eligibility: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-700">
                    <option value="">Select State</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : <p className="text-lg font-black text-slate-900">{profile.state_of_eligibility || "---"}</p>}
              </div>
            </div>
          </section>

          {/* Section 4: Competitive Standing */}
          <section className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/40 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-rose-500/5 blur-[50px] group-hover:bg-rose-500/10 transition-colors" />
            <div className="flex items-center gap-4 mb-8 relative">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shadow-inner">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Competitive Standing</h3>
            </div>
            
            <div className="space-y-8 relative">
              <div className="p-5 bg-linear-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-lg relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-[20px] rounded-full" />
                <label className="text-xs font-black uppercase tracking-wider text-indigo-100 mb-2 block">Primary Model Rank (JEE/Main)</label>
                {isEditing ? (
                  <input type="number" value={editedProfile.user_rank || ""} onChange={(e) => setEditedProfile({...editedProfile, user_rank: e.target.value})} className="w-full px-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl outline-none focus:bg-white/30 focus:border-white transition-all font-black text-2xl placeholder:text-indigo-200" placeholder="e.g. 15400" />
                ) : <p className="text-4xl font-black tracking-tight">{profile.user_rank ? profile.user_rank.toLocaleString() : "Not Provided"}</p>}
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 block">Additional Exams & Scores</label>
                {isEditing && (
                  <div className="flex gap-2 mb-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <select value={selectedExamId} onChange={(e) => setSelectedExamId(e.target.value)} className="flex-1 px-4 py-2 bg-transparent outline-none font-bold text-slate-700">
                      <option value="">Select Exam</option>
                      {examsList.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <div className="w-px bg-slate-200 my-2" />
                    <input type="text" value={examScore} onChange={(e) => setExamScore(e.target.value)} className="w-24 px-4 py-2 bg-transparent outline-none font-bold text-slate-700 placeholder:text-slate-400" placeholder="Score" />
                    <button onClick={addExam} className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-colors shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                )}
                
                <div className="space-y-3">
                  {editedProfile.exams_appeared?.length > 0 ? (
                    editedProfile.exams_appeared.map((exam: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm group hover:border-indigo-100 transition-colors">
                        <span className="font-black text-slate-900">{exam.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg text-sm group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">Score: {exam.score}</span>
                          {isEditing && (
                            <button onClick={() => removeExam(exam.examId)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : <p className="text-sm font-bold text-slate-400 p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center">No additional exams provided.</p>}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value, isEditing, onChange }: { label: string, value: string, isEditing: boolean, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</label>
      {isEditing ? (
        <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-900 placeholder:text-slate-300" placeholder={`Enter ${label}`} />
      ) : <p className="text-lg font-black text-slate-900 truncate">{value || "---"}</p>}
    </div>
  )
}

function ContactItem({ label, value, isEditing, verified, onVerify, onChange }: { label: string, value: string, isEditing: boolean, verified: boolean, onVerify: () => void, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400">
        <span>{label}</span>
        {verified ? (
          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Verified</span>
        ) : (
          !isEditing && value && (
            <button onClick={onVerify} className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md hover:bg-amber-200 transition-colors flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Needs Verification</button>
          )
        )}
      </label>
      {isEditing ? (
        <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-900 placeholder:text-slate-300" placeholder={`Enter ${label}`} />
      ) : <p className="text-lg font-black text-slate-900 truncate">{value || "---"}</p>}
    </div>
  )
}

