"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNotebook } from "@/context/NotebookContext"
import { getColleges } from "@/app/dashboard/actions"
import { getCollegeCutoffsTrends, CollegeTrendsResponse, CourseTrend } from "@/app/actions/getCollegeCutoffsTrends"
import RemarkModal from "../notebook/RemarkModal"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, Sector, RadialBarChart, RadialBar, ComposedChart, Area
} from "recharts"
import { getAIAnalysis, AIAnalysisResponse } from "@/app/actions/getAIAnalysis"

// Premium Color Palettes
const CATEGORY_COLORS: Record<string, string> = {
  "GEN": "#4f46e5", // Indigo
  "OBC": "#0ea5e9", // Sky Blue
  "SC":  "#ec4899", // Pink
  "ST":  "#f59e0b", // Amber
  "EWS": "#10b981", // Emerald
};

const COMPARISON_PALETTE = [
  "#6366f1", "#10b981", "#f59e0b", "#ef4444", "#a855f7", "#06b6d4"
];

// --- Sub-Components ---
const AdmissionProbabilityGauge = ({ probability }: { probability: number }) => {
  const data = [{ name: 'L', value: probability, fill: probability > 75 ? '#22c55e' : (probability > 40 ? '#f59e0b' : '#ef4444') }];
  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={20} data={data} startAngle={180} endAngle={0}>
          <RadialBar background dataKey="value" cornerRadius={10} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
        <span className="text-3xl font-black text-slate-900">{probability}%</span>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chance</span>
      </div>
    </div>
  );
};

const MarketStabilityPie = ({ stability, volatility }: { stability: number, volatility: number }) => {
  const data = [
    { name: 'Stability', value: stability, fill: '#6366f1' },
    { name: 'Volatility', value: volatility, fill: '#fda4af' },
  ];
  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const AIInsightCard = ({ title, value, icon, color, subtitle }: { title: string, value: string | number, icon: React.ReactNode, color: string, subtitle?: string }) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
    <p className="text-xl font-black text-slate-900 leading-tight">{value}</p>
    {subtitle && <p className="text-[10px] font-medium text-slate-400 mt-2 leading-relaxed italic">{subtitle}</p>}
  </div>
);

interface BenchItem {
  id: string; // Dynamic ID
  collegeName: string;
  courseName: string;
  specName: string | null;
  examName: string;
  data: any[];
  categories: string[];
}

export default function CutoffTrendsClient() {
  const { addNote, removeNote, isInNotebook } = useNotebook()
  
  // Navigation State
  const [viewState, setViewState] = useState<"SEARCH" | "DASHBOARD">("SEARCH")
  const [analysisMode, setAnalysisMode] = useState<"SINGLE" | "COMPARE">("SINGLE")
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  // Selection State (Single)
  const [activeCollege, setActiveCollege] = useState<CollegeTrendsResponse | null>(null)
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)
  
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [selectedSpecId, setSelectedSpecId] = useState<number | null | "none">(null)
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null)

  // Comparison State
  const [comparisonBench, setComparisonBench] = useState<BenchItem[]>([])

  // Modal State
  const [remarkModal, setRemarkModal] = useState<{
    isOpen: boolean;
    title: string;
    type: "SINGLE" | "COMPARE";
    data: any;
  }>({ isOpen: false, title: "", type: "SINGLE", data: null });
  
  // AI Prediction State
  const [userRank, setUserRank] = useState<number | "">("")
  const [userLocation, setUserLocation] = useState("")
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResponse | null>(null)
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false)

  // --- Derived Data for Selectors ---
  const courses = useMemo(() => {
    if (!activeCollege) return [];
    const unique = new Map();
    activeCollege.courses.forEach(c => {
      if (!unique.has(c.course_id)) {
        unique.set(c.course_id, c.course_name);
      }
    });
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
  }, [activeCollege]);

  const specializations = useMemo(() => {
    if (!activeCollege || selectedCourseId === null) return [];
    const unique = new Map<number | "none", string>();
    activeCollege.courses
      .filter(c => c.course_id === selectedCourseId)
      .forEach(c => {
        const specId = c.specialization_id ?? "none";
        if (!unique.has(specId)) {
          unique.set(specId, c.specialization_name || "General/No Specialization");
        }
      });
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
  }, [activeCollege, selectedCourseId]);

  const exams = useMemo(() => {
    if (!activeCollege || selectedCourseId === null || selectedSpecId === null) return [];
    const specToMatch = selectedSpecId === "none" ? null : Number(selectedSpecId);
    return activeCollege.courses
      .filter(c => c.course_id === selectedCourseId && c.specialization_id === specToMatch)
      .map(c => ({ id: c.exam_id, name: c.exam_name }));
  }, [activeCollege, selectedCourseId, selectedSpecId]);

  const activeTrend = useMemo(() => {
    if (!activeCollege || selectedCourseId === null || selectedSpecId === null || selectedExamId === null) return null;
    const specToMatch = selectedSpecId === "none" ? null : Number(selectedSpecId);
    return activeCollege.courses.find(c => 
      c.course_id === selectedCourseId && 
      c.specialization_id === specToMatch && 
      c.exam_id === Number(selectedExamId)
    );
  }, [activeCollege, selectedCourseId, selectedSpecId, selectedExamId]);

  // Set initial selections when college changes
  useEffect(() => {
    if (activeCollege && activeCollege.courses.length > 0) {
      const first = activeCollege.courses[0];
      setSelectedCourseId(first.course_id);
      setSelectedSpecId(first.specialization_id ?? "none");
      setSelectedExamId(first.exam_id);
    }
  }, [activeCollege]);

  // Sync Specialization when Course changes
  useEffect(() => {
    if (specializations.length > 0) {
      const currentValid = specializations.find(s => s.id === selectedSpecId);
      if (!currentValid) {
        setSelectedSpecId(specializations[0].id);
      }
    }
  }, [selectedCourseId, specializations]);

  // Sync Exam when spec changes
  useEffect(() => {
    if (exams.length > 0) {
      const currentValid = exams.find(e => e.id === selectedExamId);
      if (!currentValid) {
        setSelectedExamId(exams[0].id);
      }
    }
  }, [selectedSpecId, exams]);

  // --- Search Logic ---
  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) {
        setSearchResults([]);
        return;
    }
    setIsSearching(true);
    try {
        const result = await getColleges(1, 5, q); 
        setSearchResults((result as any)?.colleges || []);
    } catch (error) {
        setSearchResults([]);
    } finally {
        setIsSearching(false);
    }
  }

  const handleSelectCollege = async (college: any) => {
    setSearchQuery("");
    setSearchResults([]);
    setViewState("DASHBOARD");
    setIsLoadingInsights(true);
    try {
        const trends = await getCollegeCutoffsTrends(college.college_id);
        setActiveCollege(trends);
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoadingInsights(false);
    }
  }

  // --- Comparison Logic ---
  const handleAddToCompare = () => {
    if (!activeTrend || !activeCollege) return;
    const id = `${activeCollege.college_id}-${activeTrend.course_id}-${activeTrend.specialization_id}-${activeTrend.exam_id}`;
    if (comparisonBench.some(item => item.id === id)) return;

    const newItem: BenchItem = {
      id,
      collegeName: activeCollege.college_name,
      courseName: activeTrend.course_name,
      specName: activeTrend.specialization_name,
      examName: activeTrend.exam_name,
      data: activeTrend.data,
      categories: activeTrend.categories
    };
    setComparisonBench(prev => [...prev, newItem]);
  }

  const removeFromCompare = (id: string) => {
    setComparisonBench(prev => prev.filter(item => item.id !== id));
  }

  const handleAIAnalysis = async () => {
    if (!activeTrend || !activeCollege || !userRank) return;

    setIsAnalyzingAI(true);
    try {
        const result = await getAIAnalysis({
            counseling_source: "JoSAA", // This could be dynamic if needed
            exam_type: activeTrend.exam_name,
            college_name: activeCollege.college_name,
            course_name: activeTrend.course_name,
            category: "OPEN", // Default to OPEN for now
            user_rank: Number(userRank),
            user_location: userLocation || "Unknown",
            history: activeTrend.data.map(d => d.GEN).filter(v => v !== undefined) // Use GEN for history
        });
        setAiAnalysis(result);
    } catch (error) {
        console.error("AI Analysis failed:", error);
    } finally {
        setIsAnalyzingAI(false);
    }
  }

  const comparisonChartData = useMemo(() => {
    if (comparisonBench.length === 0) return [];
    
    // Find all unique years across all bench items
    const allYearsSet = new Set<number>();
    comparisonBench.forEach(item => {
      item.data.forEach(pt => allYearsSet.add(pt.year));
    });
    const years = Array.from(allYearsSet).sort((a, b) => a - b);

    return years.map(year => {
      const point: any = { year };
      comparisonBench.forEach((item, idx) => {
        const yearData = item.data.find(d => d.year === year);
        if (yearData) {
          // Use General category for comparison or the first available category
          const bestCat = item.categories.includes("GEN") ? "GEN" : item.categories[0];
          point[`val_${idx}`] = yearData[bestCat];
          point[`label_${idx}`] = `${item.collegeName.split(' - ')[0]} (${item.courseName})`;
        }
      });
      return point;
    });
  }, [comparisonBench]);

  // --- Renderers ---
  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-y-auto custom-scrollbar relative">
      <AnimatePresence mode="wait">
        
        {viewState === "SEARCH" && (
          <motion.div 
            key="search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center min-h-full p-8"
          >
            <div className="max-w-3xl w-full text-center mb-12">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/10 rotate-3 cursor-default">
                 <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                 </svg>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tightest mb-4">Cutoff Control Center</h1>
              <p className="text-slate-500 font-bold text-lg max-w-xl mx-auto">Analyze historical trends or compare multiple institutions side-by-side in one unified dashboard.</p>
            </div>

            <div className="w-full max-w-2xl relative">
                <input
                    type="text"
                    placeholder="Search for an institution..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-white border-2 border-slate-100 rounded-4xl text-lg font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-xl"
                />
                <AnimatePresence>
                    {searchResults.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-14 left-0 right-0 pt-8 pb-4 bg-white border border-slate-100 rounded-b-[2rem] shadow-2xl z-10 overflow-hidden">
                            {searchResults.map((college) => (
                                <button key={college.college_id} onClick={() => handleSelectCollege(college)} className="w-full text-left px-6 py-4 hover:bg-slate-50 flex items-center gap-4 group">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-black text-indigo-300">
                                      {college.logo_url ? <img src={college.logo_url} className="w-full h-full object-contain p-1" /> : college.college_name[0]}
                                    </div>
                                    <div className="flex-1 truncate">
                                      <span className="block text-sm font-black text-slate-900 group-hover:text-indigo-600 truncate">{college.college_name}</span>
                                      <span className="text-xs font-bold text-slate-400">{college.city}, {college.state}</span>
                                    </div>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </motion.div>
        )}

        {viewState === "DASHBOARD" && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-full flex flex-col p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 max-w-7xl mx-auto w-full">
              <div className="flex items-center gap-4">
                <button onClick={() => setViewState("SEARCH")} className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all shadow-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tightest leading-tight line-clamp-1">{activeCollege?.college_name}</h1>
                  <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-1">Unified Analysis Dashboard</p>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex bg-white p-1.5 rounded-[1.25rem] border border-slate-200 shadow-sm self-start md:self-center">
                <button 
                  onClick={() => setAnalysisMode("SINGLE")}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${analysisMode === "SINGLE" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Deep Insights
                </button>
                <button 
                  onClick={() => setAnalysisMode("COMPARE")}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${analysisMode === "COMPARE" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Compare Mode
                  {comparisonBench.length > 0 && <span className={`px-1.5 rounded-md text-[10px] ${analysisMode === "COMPARE" ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-600"}`}>{comparisonBench.length}</span>}
                </button>
              </div>
            </div>

            {isLoadingInsights ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6"><div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" /></div>
            ) : analysisMode === "SINGLE" ? (
              /* SINGLE VIEW DASHBOARD */
              <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-20">
                {/* Top Row: Info & Controls */}
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Control Panel */}
                  <div className="w-full lg:w-80 space-y-4 shrink-0">
                    <div className="bg-white p-6 rounded-4xl border border-slate-200 shadow-sm">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Configuration</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter block mb-2">Select Course</label>
                          <select 
                            value={selectedCourseId || ""} 
                            onChange={(e) => { setSelectedCourseId(Number(e.target.value)); setAiAnalysis(null); }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          >
                            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter block mb-2">Specialization</label>
                          <select 
                            value={selectedSpecId || ""} 
                            onChange={(e) => { setSelectedSpecId(e.target.value as any); setAiAnalysis(null); }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          >
                            {specializations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter block mb-2">Academic Exam</label>
                          <select 
                            value={selectedExamId || ""} 
                            onChange={(e) => { setSelectedExamId(Number(e.target.value)); setAiAnalysis(null); }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          >
                            {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                          </select>
                        </div>

                        {/* AI Input Section */}
                        <div className="pt-4 border-t border-slate-100">
                          <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3">AI Predictor Input</h4>
                          <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter block mb-2">Your AIR Rank</label>
                                <input 
                                    type="number" 
                                    placeholder="Enter your rank..."
                                    value={userRank}
                                    onChange={(e) => setUserRank(e.target.value ? Number(e.target.value) : "")}
                                    className="w-full bg-indigo-50/30 border border-indigo-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter block mb-2">Location (Optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Mumbai, Maharashtra"
                                    value={userLocation}
                                    onChange={(e) => setUserLocation(e.target.value)}
                                    className="w-full bg-indigo-50/30 border border-indigo-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={handleAIAnalysis}
                          disabled={isAnalyzingAI || !userRank}
                          className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isAnalyzingAI ? "bg-slate-100 text-slate-400" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"}`}
                        >
                          {isAnalyzingAI ? (
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          )}
                          Analyze with AI Ensemble
                        </button>
                      </div>
                    </div>

                    <button 
                        onClick={handleAddToCompare}
                        className="w-full py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" /></svg>
                        Add to Comparison
                    </button>
                  </div>

                  {/* Main Graph Area */}
                  <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm p-8 flex flex-col min-h-[500px]">
                    {activeTrend ? (
                      <>
                        <div className="flex justify-between items-start mb-8">
                          <div>
                            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg mb-2">Predictive Analysis</span>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tightest mb-1">{activeTrend.course_name}</h2>
                            <p className="text-sm font-bold text-slate-500">{activeTrend.specialization_name || "General Specialty"} • {activeTrend.exam_name}</p>
                          </div>
                          <div className="flex gap-2">
                             <button 
                                onClick={() => {
                                    const noteId = `${activeCollege?.college_id}-${activeTrend.course_id}-${activeTrend.specialization_id ?? 'none'}-${activeTrend.exam_id}`;
                                    if (isInNotebook(noteId)) {
                                    removeNote(noteId);
                                    } else {
                                    setRemarkModal({
                                        isOpen: true,
                                        title: `${activeCollege?.college_name} - ${activeTrend.course_name}`,
                                        type: "SINGLE",
                                        data: activeTrend
                                    });
                                    }
                                }}
                                className={`p-3 rounded-2xl transition-all ${
                                    isInNotebook(`${activeCollege?.college_id}-${activeTrend.course_id}-${activeTrend.specialization_id ?? 'none'}-${activeTrend.exam_id}`)
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                    : "bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200"
                                }`}
                                >
                                <svg className="w-5 h-5" fill={isInNotebook(`${activeCollege?.college_id}-${activeTrend.course_id}-${activeTrend.specialization_id ?? 'none'}-${activeTrend.exam_id}`) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                </svg>
                            </button>
                          </div>
                        </div>

                        <div className="flex-1 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={[
                                ...activeTrend.data,
                                ...(aiAnalysis ? [{ year: 2026, GEN: aiAnalysis.predicted_rank, isPrediction: true }] : [])
                            ]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 800}} dy={10} />
                              <YAxis reversed axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 800}} dx={-10} tickFormatter={(v) => v.toLocaleString()} />
                              <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const isPred = payload[0].payload.isPrediction;
                                        return (
                                            <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-50">
                                                <p className="text-xs font-black text-slate-400 uppercase mb-2">{label} {isPred ? "(AI Predicted)" : "(Historical)"}</p>
                                                {payload.map((p: any) => (
                                                    <div key={p.name} className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                                        <span className="text-sm font-black text-slate-900">{p.name}: {p.value.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                              />
                              <Legend iconType="circle" wrapperStyle={{ paddingTop: '30px', fontWeight: 800 }} />
                              {activeTrend.categories.map((cat, i) => (
                                <Line 
                                    key={cat} 
                                    type="monotone" 
                                    dataKey={cat} 
                                    stroke={CATEGORY_COLORS[cat] || COMPARISON_PALETTE[i % 6]} 
                                    strokeWidth={4} 
                                    dot={{ r: 6 }} 
                                    strokeDasharray={cat === "PRED" ? "5 5" : ""}
                                    connectNulls 
                                />
                              ))}
                              {aiAnalysis && (
                                <Line 
                                    type="monotone" 
                                    dataKey="GEN" 
                                    stroke="#4f46e5" 
                                    strokeWidth={4} 
                                    strokeDasharray="5 5" 
                                    dot={{ r: 8, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }} 
                                    name="2026 AI Prediction (GEN)"
                                />
                              )}
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 font-bold p-12 text-center">
                        <div className="text-5xl mb-4">🔬</div>
                        <p>Select a course configuration to begin analysis.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Insights & Visualizations (Middle Row) */}
                <AnimatePresence>
                  {aiAnalysis && (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Admission Prob.</h3>
                            <AdmissionProbabilityGauge probability={aiAnalysis.admission_probability} />
                            <p className="text-[10px] font-bold text-slate-500 text-center px-4 -mt-4 italic">Estimated based on rank drift & ensemble variance.</p>
                        </div>

                        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Market Stability</h3>
                            <MarketStabilityPie stability={aiAnalysis.stability_score} volatility={aiAnalysis.volatility_score} />
                            <div className="flex gap-4 -mt-2">
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Stable</span>
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-400 uppercase"><div className="w-2 h-2 rounded-full bg-rose-300" /> Volatile</span>
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <AIInsightCard 
                                title="Trend Forecast" 
                                value={aiAnalysis.trend_tag} 
                                color="bg-emerald-50 text-emerald-600"
                                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                                subtitle="Overall direction of cutoffs."
                            />
                            <AIInsightCard 
                                title="Admission Outlook" 
                                value={aiAnalysis.final_verdict} 
                                color="bg-indigo-50 text-indigo-600"
                                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                subtitle="AI ensemble's final confirmation."
                            />
                            <AIInsightCard 
                                title="Market Risk" 
                                value={`${(aiAnalysis.anomaly_score * 100).toFixed(1)}%`} 
                                color={aiAnalysis.is_anomaly ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600"}
                                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                                subtitle="Likelihood of unusual shifts."
                            />
                            <AIInsightCard 
                                title="Demand Index" 
                                value={`${aiAnalysis.region_competition_index}%`} 
                                color="bg-amber-50 text-amber-600"
                                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                subtitle="Regional popularity for this course."
                            />
                        </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom Row: Strategy & Alternatives */}
                <AnimatePresence>
                  {aiAnalysis && (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        {/* Round-wise Section */}
                        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">Round-wise Strategy</h3>
                                    <p className="text-xs font-bold text-slate-400">Predicted entry thresholds across counseling cycles.</p>
                                </div>
                                <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Recommended: {aiAnalysis.recommended_round}
                                </div>
                            </div>
                            
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={aiAnalysis.round_predictions} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="round_name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 800}} />
                                        <YAxis reversed axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 800}} />
                                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontWeight: 'bold' }} />
                                        <Bar dataKey="predicted_cutoff" name="Predicted Cutoff" fill="#4f46e5" radius={[10, 10, 0, 0]}>
                                            {aiAnalysis.round_predictions.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.status === "SECURED" ? "#10b981" : "#6366f1"} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-6">
                                {aiAnalysis.round_predictions.map((r) => (
                                    <div key={r.round_name} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{r.round_name}</span>
                                        <span className="text-lg font-black text-slate-900 mb-1">{r.predicted_cutoff.toLocaleString()}</span>
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter ${r.status === "SECURED" ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"}`}>
                                            {r.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Strategic Action Plan */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.644.322a6 6 0 01-3.86.517l-2.387-.477a2 2 0 00-1.022.547l-1.16 1.16a2 2 0 00.439 3.28 12.06 12.06 0 0013.882 0 2 2 0 00.439-3.28l-1.16-1.16z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /></svg>
                            </div>
                            <h3 className="text-xl font-black mb-2">Strategic Action Plan</h3>
                            <p className="text-slate-400 text-sm font-bold mb-8 italic">AI-crafted maneuvers based on market trends.</p>
                            
                            <div className="space-y-6">
                                {aiAnalysis.strategy_insights.map((insight, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="shrink-0 w-6 h-6 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-black">{i + 1}</div>
                                        <p className="text-sm font-bold text-slate-300 leading-relaxed">{insight}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 p-5 bg-white/5 rounded-4xl border border-white/10">
                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Model Insights</h4>
                                <ul className="space-y-3">
                                    {aiAnalysis.insights.map((insight, i) => (
                                        <li key={i} className="flex gap-2 text-[11px] font-bold text-slate-400">
                                            <span className="text-indigo-400">•</span> {insight}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* AI Alternative Seat Match */}
                        <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">AI Alternative Seat Match</h3>
                                    <p className="text-xs font-bold text-slate-400">Real institutions mapped by historical cutoff similarity & admission patterns.</p>
                                </div>
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {aiAnalysis.competitors.map((comp, i) => (
                                    <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-slate-300 shadow-sm">
                                                {comp.college_name[0]}
                                            </div>
                                            <div className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                {(comp.similarity_score * 100).toFixed(0)}% Match
                                            </div>
                                        </div>
                                        <h4 className="text-sm font-black text-slate-900 line-clamp-1 mb-1">{comp.college_name}</h4>
                                        <p className="text-[11px] font-bold text-slate-500 mb-4">{comp.course_name || "Similar Department"}</p>
                                        
                                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${comp.similarity_score * 100}%` }} />
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span className="text-[9px] font-black text-slate-400 uppercase">Avg. Rank</span>
                                            <span className="text-[10px] font-black text-slate-900">{comp.avg_rank.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* COMPARISON VIEW */
              <div className="max-w-7xl mx-auto w-full pb-20">
                {comparisonBench.length > 0 ? (
                  <div className="flex flex-col gap-8">
                    {/* Comparative Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {comparisonBench.map((item, i) => (
                        <div key={item.id} className="bg-white p-6 rounded-4xl border-l-8 shadow-sm flex items-center justify-between" style={{ borderLeftColor: COMPARISON_PALETTE[i % 6] }}>
                          <div className="min-w-0 pr-4">
                            <span className="block text-xs font-black text-slate-400 uppercase tracking-tighter mb-1 truncate">{item.collegeName.split(' - ')[0]}</span>
                            <span className="block text-sm font-black text-slate-900 truncate">{item.courseName}</span>
                          </div>
                          <button onClick={() => removeFromCompare(item.id)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" /></svg>
                          </button>
                        </div>
                      ))}
                      
                      {/* Add more placeholder */}
                      <button onClick={() => setAnalysisMode("SINGLE")} className="bg-slate-50 border-2 border-dashed border-slate-200 p-6 rounded-4xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all group">
                        <svg className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">Add Institution</span>
                      </button>
                    </div>

                    {/* Comparative Chart */}
                    <div className="bg-white p-10 rounded-4xl border border-slate-200 shadow-sm relative">
                      <div className="mb-10 flex justify-between items-start">
                        <div>
                          <h2 className="text-3xl font-black text-slate-900 tracking-tightest">Comparative Cutoff Benchmark</h2>
                          <p className="text-sm font-bold text-slate-500 mt-2 italic">Benchmarking based on primary seat category (GEN) across historical intake cycles.</p>
                        </div>
                        
                        <button 
                          onClick={() => {
                            const noteId = `comp-${comparisonBench.map(b => b.id).sort().join('-')}`;
                            if (isInNotebook(noteId)) {
                              removeNote(noteId);
                            } else {
                              setRemarkModal({
                                isOpen: true,
                                title: `Comparative Benchmark (${comparisonBench.length} Items)`,
                                type: "COMPARE",
                                data: comparisonBench
                              });
                            }
                          }}
                          className={`p-3 rounded-2xl transition-all ${
                            isInNotebook(`comp-${comparisonBench.map(b => b.id).sort().join('-')}`)
                             ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                             : "bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white hover:border hover:border-slate-200"
                          }`}
                        >
                          <svg className="w-6 h-6" fill={isInNotebook(`comp-${comparisonBench.map(b => b.id).sort().join('-')}`) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                          </svg>
                        </button>
                      </div>

                      <div className="h-[500px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={comparisonChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 900}} dy={10} />
                            <YAxis reversed axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 800}} dx={-10} tickFormatter={(v) => v.toLocaleString()} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                            <Legend wrapperStyle={{ paddingTop: '40px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }} />
                            {comparisonBench.map((item, idx) => (
                              <Bar 
                                key={item.id} 
                                dataKey={`val_${idx}`} 
                                name={item.collegeName.split(' - ')[0].substring(0, 15) + '...'} 
                                fill={COMPARISON_PALETTE[idx % 6]}
                                radius={[6, 6, 0, 0]}
                              />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 italic text-slate-400">
                    <div className="text-6xl mb-6">⚖️</div>
                    <p className="text-xl font-bold">Your comparison bench is empty.</p>
                    <p className="mt-2 mb-8">Go back to Deep Insights to add combinations to your benchmark list.</p>
                    <button onClick={() => setAnalysisMode("SINGLE")} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">Start Adding Colleges</button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <RemarkModal
        isOpen={remarkModal.isOpen}
        onClose={() => setRemarkModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={(remark) => {
          if (remarkModal.type === "SINGLE") {
            if (!activeTrend || !activeCollege) return;
            const noteId = `${activeCollege.college_id}-${activeTrend.course_id}-${activeTrend.specialization_id ?? 'none'}-${activeTrend.exam_id}`;
            addNote({
              note_id: noteId,
              note_name: `${activeCollege.college_name} - ${activeTrend.course_name} Trend`,
              data: [activeTrend],
              remark: remark || `Historical cutoff trends for ${activeTrend.course_name} at ${activeCollege.college_name}`
            });
          } else {
            const noteId = `comp-${comparisonBench.map(b => b.id).sort().join('-')}`;
            addNote({
              note_id: noteId,
              note_name: `Comparative Analysis: ${comparisonBench.length} Programs`,
              data: comparisonBench,
              remark: remark || `Comparison of ${comparisonBench.map(b => b.collegeName).join(', ')}`
            });
          }
        }}
        title={remarkModal.title}
      />
    </div>
  )
}
