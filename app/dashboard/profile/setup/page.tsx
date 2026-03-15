"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth/client"

// Components (We'll create these next)
// import PersonalInfo from "@/components/profile/steps/PersonalInfo"
// import ContactInfo from "@/components/profile/steps/ContactInfo"
// import EducationInfo from "@/components/profile/steps/EducationInfo"
// import ExamInfo from "@/components/profile/steps/ExamInfo"

import OTPModal from "@/components/profile/OTPModal"

export default function ProfileSetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    qualification: "",
    exams: [] as { examId: string; name: string; score: string }[],
  })

  // Verification states
  const [otpModal, setOtpModal] = useState<{ isOpen: boolean; type: "email" | "phone"; identifier: string }>({
    isOpen: false,
    type: "email",
    identifier: ""
  })
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)

  // Exam selection states
  const [selectedExamId, setSelectedExamId] = useState("")
  const [examScore, setExamScore] = useState("")

  const examsList = [
    { id: "jee_mains", name: "JEE Mains" },
    { id: "jee_adv", name: "JEE Advanced" },
    { id: "neet", name: "NEET" },
    { id: "gate", name: "GATE" },
    { id: "cat", name: "CAT" },
    { id: "upsi", name: "UPSC" },
  ]

  useEffect(() => {
    async function checkAuth() {
      const { data } = await authClient.getSession()
      if (!data?.session) {
        router.push("/")
      } else {
        setFormData(prev => ({ ...prev, email: data.user.email || "" }))
      }
    }
    checkAuth()
  }, [router])

  const totalSteps = 4

  const nextStep = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName)) {
      alert("Please enter your name")
      return
    }
    if (step === 2 && (!isEmailVerified || !isPhoneVerified)) {
      alert("Please verify both email and phone number")
      return
    }
    if (step === 3 && !formData.qualification) {
      alert("Please select your qualification")
      return
    }
    setStep(s => Math.min(s + 1, totalSteps))
  }
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const handleSendOtp = async (type: "email" | "phone") => {
    const identifier = type === "email" ? formData.email : formData.phone
    if (!identifier) return

    try {
      const res = await fetch("/api/otp", {
        method: "POST",
        body: JSON.stringify({ action: "send", identifier }),
      })
      if (res.ok) {
        setOtpModal({ isOpen: true, type, identifier })
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleVerifyOtp = async (otp: string) => {
    try {
      const res = await fetch("/api/otp", {
        method: "POST",
        body: JSON.stringify({ action: "verify", identifier: otpModal.identifier, otp }),
      })
      if (res.ok) {
        if (otpModal.type === "email") setIsEmailVerified(true)
        else setIsPhoneVerified(true)
        setOtpModal({ ...otpModal, isOpen: false })
        return true
      }
    } catch (e) {
      console.error(e)
    }
    return false
  }

  const addExam = () => {
    if (!selectedExamId || !examScore) return
    const exam = examsList.find(e => e.id === selectedExamId)
    if (exam) {
      setFormData({
        ...formData,
        exams: [...formData.exams, { examId: selectedExamId, name: exam.name, score: examScore }]
      })
      setSelectedExamId("")
      setExamScore("")
    }
  }

  const removeExam = (examId: string) => {
    setFormData({
      ...formData,
      exams: formData.exams.filter(e => e.examId !== examId)
    })
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setStep(5) // Success Stage
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (step === 5) {
      const timer = setTimeout(() => {
        router.push("/dashboard/profile?new=true")
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [step, router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        
        {/* Progress Header */}
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
            <p className="text-gray-500 text-sm mt-1">Step {step} of {totalSteps}</p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className={`w-10 h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'bg-blue-600' : 'bg-gray-100'}`} 
              />
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
             <motion.div
               key={step}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
             >
               {step === 1 && (
                 <div className="space-y-6">
                   <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700">First Name</label>
                       <input 
                         type="text" 
                         value={formData.firstName}
                         onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                         className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                         placeholder="John"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700">Middle Name</label>
                       <input 
                         type="text" 
                         value={formData.middleName}
                         onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                         className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                         placeholder="(Optional)"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700">Last Name</label>
                       <input 
                         type="text" 
                         value={formData.lastName}
                         onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                         className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                         placeholder="Doe"
                       />
                     </div>
                   </div>
                 </div>
               )}

               {step === 2 && (
                 <div className="space-y-6">
                   <h3 className="text-xl font-semibold text-gray-900">Contact Details</h3>
                   <div className="space-y-4">
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700">Email Address</label>
                       <div className="flex gap-2">
                         <input 
                           type="email" 
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           disabled={isEmailVerified}
                           className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none disabled:opacity-50"
                           placeholder="john@example.com"
                         />
                         <button 
                            onClick={() => handleSendOtp("email")}
                            disabled={isEmailVerified || !formData.email}
                            className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${isEmailVerified ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50'}`}
                          >
                           {isEmailVerified ? "Verified ✓" : "Verify"}
                         </button>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700">Phone Number</label>
                       <div className="flex gap-2">
                         <input 
                           type="tel" 
                           value={formData.phone}
                           onChange={(e) => setFormData({...formData, phone: e.target.value})}
                           disabled={isPhoneVerified}
                           className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none disabled:opacity-50"
                           placeholder="+91 98765 43210"
                         />
                         <button 
                            onClick={() => handleSendOtp("phone")}
                            disabled={isPhoneVerified || !formData.phone}
                            className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${isPhoneVerified ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50'}`}
                          >
                           {isPhoneVerified ? "Verified ✓" : "Verify"}
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               )}

               {step === 3 && (
                 <div className="space-y-6">
                   <h3 className="text-xl font-semibold text-gray-900">Education Background</h3>
                   <div className="space-y-4">
                     <label className="text-sm font-medium text-gray-700">Current Highest Qualification</label>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       {["10th Standard", "12th Standard", "Diploma", "Undergraduate (UG)", "Postgraduate (PG)"].map((q) => (
                         <button
                           key={q}
                           onClick={() => setFormData({...formData, qualification: q})}
                           className={`px-6 py-4 rounded-2xl border-2 text-left transition-all ${formData.qualification === q ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'}`}
                         >
                           <span className="font-semibold">{q}</span>
                         </button>
                       ))}
                     </div>
                   </div>
                 </div>
               )}

               {step === 4 && (
                 <div className="space-y-6">
                   <h3 className="text-xl font-semibold text-gray-900">Competitive Exams</h3>
                   <p className="text-sm text-gray-500">Add any entrance exams you have appeared for.</p>
                   
                   <div className="space-y-4">
                     <div className="flex gap-2">
                       <select 
                         value={selectedExamId}
                         onChange={(e) => setSelectedExamId(e.target.value)}
                         className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
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
                         className="w-24 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                         placeholder="Score"
                       />
                       <button 
                         onClick={addExam}
                         className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium"
                       >
                         Add
                       </button>
                     </div>

                     <div className="flex flex-wrap gap-2 mt-4">
                       {formData.exams.map((exam) => (
                         <div key={exam.examId} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-100 font-medium">
                           <span>{exam.name}: {exam.score}</span>
                           <button onClick={() => removeExam(exam.examId)} className="hover:text-red-500">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                             </svg>
                           </button>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               )}
               {step === 5 && (
                 <motion.div
                   key="success"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center py-12"
                 >
                   <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                     </svg>
                   </div>
                   <h3 className="text-3xl font-bold text-gray-900 mb-2">Thank you!</h3>
                   <p className="text-gray-500 text-lg">Thank you for your input! We've saved your details.</p>
                   <p className="mt-4 text-blue-600 font-medium animate-pulse">Redirecting to your profile...</p>
                 </motion.div>
               )}
             </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        {step < 5 && (
          <div className="px-8 py-6 bg-gray-50 flex items-center justify-between border-t border-gray-100">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`px-6 py-2.5 font-semibold rounded-xl transition-all ${step === 1 ? 'opacity-0' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              Previous
            </button>
            
            {step < totalSteps ? (
              <button
                onClick={nextStep}
                className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={loading}
                className="px-8 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 shadow-lg shadow-green-500/20 transition-all disabled:opacity-50"
              >
                {loading ? "Saving..." : "Complete Setup"}
              </button>
            )}
          </div>
        )}
      </div>

      <OTPModal 
        isOpen={otpModal.isOpen}
        onClose={() => setOtpModal({ ...otpModal, isOpen: false })}
        onVerify={handleVerifyOtp}
        identifier={otpModal.identifier}
        type={otpModal.type}
      />
    </div>
  )
}
