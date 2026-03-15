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
  
  // Exam editing states
  const [selectedExamId, setSelectedExamId] = useState("")
  const [examScore, setExamScore] = useState("")

  const examsList = [
    { id: "jee_mains", name: "JEE Mains" },
    { id: "jee_adv", name: "JEE Advanced" },
    { id: "neet", name: "NEET" },
    { id: "gate", name: "GATE" },
    { id: "cat", name: "CAT" },
    { id: "upsc", name: "UPSC" },
  ]

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
          exams: editedProfile.exams_appeared
        }),
      })
      if (res.ok) {
        setProfile(editedProfile)
        setIsEditing(false)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const addExam = () => {
    if (!selectedExamId || !examScore) return
    const exam = examsList.find(e => e.id === selectedExamId)
    if (exam) {
      const currentExams = editedProfile.exams_appeared || []
      // Avoid duplicates
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
    setEditedProfile({
      ...editedProfile,
      exams_appeared: (editedProfile.exams_appeared || []).filter((e: any) => e.examId !== examId)
    })
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md"
          >
            <div className="text-center p-12 bg-white rounded-3xl shadow-2xl border border-blue-100">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Thank you!</h2>
              <p className="text-gray-500 text-lg">Your profile has been successfully set up.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">Your Profile</h1>
            <p className="text-gray-500 mt-1">Manage your information for personalized recommendations.</p>
          </div>
          <div className="flex gap-3">
             <Link 
               href="/dashboard"
               className="px-6 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
               </svg>
               Dashboard
             </Link>
             {isEditing && (
               <button 
                 onClick={() => { setIsEditing(false); setEditedProfile(profile); }}
                 className="px-6 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
               >
                 Cancel
               </button>
             )}
             <button 
               onClick={isEditing ? handleSave : () => setIsEditing(true)}
               disabled={loading}
               className={`px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm ${isEditing ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-900 text-white hover:bg-black'}`}
             >
               {loading ? "Saving..." : (isEditing ? "Save Changes" : "Edit Profile")}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Info */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
            </div>
            <div className="space-y-4">
              <InfoItem 
                label="First Name" 
                value={editedProfile.first_name} 
                isEditing={isEditing} 
                onChange={(v) => setEditedProfile({...editedProfile, first_name: v})}
              />
              <InfoItem 
                label="Middle Name" 
                value={editedProfile.middle_name} 
                isEditing={isEditing} 
                onChange={(v) => setEditedProfile({...editedProfile, middle_name: v})}
              />
              <InfoItem 
                label="Last Name" 
                value={editedProfile.last_name} 
                isEditing={isEditing} 
                onChange={(v) => setEditedProfile({...editedProfile, last_name: v})}
              />
            </div>
          </section>

          {/* Contact Info */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Contact</h3>
            </div>
            <div className="space-y-4">
              <InfoItem 
                label="Email" 
                value={editedProfile.email} 
                isEditing={isEditing} 
                onChange={(v) => setEditedProfile({...editedProfile, email: v})}
                verified={profile.email_verified} 
              />
              <InfoItem 
                label="Phone" 
                value={editedProfile.phone} 
                isEditing={isEditing} 
                onChange={(v) => setEditedProfile({...editedProfile, phone: v})}
                verified={profile.phone_verified} 
              />
            </div>
          </section>

          {/* Education */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Education</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-500">Qualification</label>
                {isEditing ? (
                  <select 
                    value={editedProfile.education_qualification}
                    onChange={(e) => setEditedProfile({...editedProfile, education_qualification: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-all"
                  >
                    {["10th Standard", "12th Standard", "Diploma", "Undergraduate (UG)", "Postgraduate (PG)"].map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-lg font-semibold text-gray-900">{profile.education_qualification || "---"}</p>
                )}
              </div>
            </div>
          </section>

          {/* Exams */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Exams</h3>
            </div>
            <div className="space-y-4">
              {isEditing && (
                <div className="flex gap-2 mb-6">
                  <select 
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-all font-medium"
                  >
                    <option value="">Select Exam</option>
                    {examsList.map(e => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                  <input 
                    type="text" 
                    value={examScore}
                    onChange={(e) => setExamScore(e.target.value)}
                    className="w-24 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-all font-medium"
                    placeholder="Score"
                  />
                  <button 
                    onClick={addExam}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all"
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {(isEditing ? editedProfile : profile).exams_appeared?.length > 0 ? (
                  (isEditing ? editedProfile : profile).exams_appeared.map((exam: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group/exam">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{exam.name}</span>
                        <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Score: {exam.score}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-black text-sm">{exam.score}</span>
                        {isEditing && (
                          <button 
                            onClick={() => removeExam(exam.examId)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic py-4 text-center">No exams added yet.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value, isEditing, verified, onChange }: { label: string, value: string, isEditing: boolean, verified?: boolean, onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-500">{label}</label>
      {isEditing ? (
        <input 
          type="text" 
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-all"
        />
      ) : (
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-gray-900">{value || "---"}</p>
          {verified && (
            <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wider border border-green-100">Verified</span>
          )}
        </div>
      )}
    </div>
  )
}

