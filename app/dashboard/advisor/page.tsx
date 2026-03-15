import Topbar from "@/components/dashboard/Topbar"
import AdvisorClient from "./AdvisorClient"
import { neon } from "@neondatabase/serverless"
import { getAdvisorChats } from "@/app/actions/advisor"

export const metadata = {
  title: "AI Advisor | College Compass",
  description: "Get personalized academic guidance and explore educational pathways with our AI Advisor.",
}

export default async function AdvisorPage() {
  const sql = neon(process.env.DATABASE_URL!);
  
  // Fetch data for the flow chart
  const exams = await sql`SELECT exam_id, name, applicable_level, stream_id FROM exams`;
  const courses = await sql`SELECT course_id, course_name, level, stream_id FROM courses`;
  const streams = await sql`SELECT stream_id, stream_name FROM streams`;
  
  // Fetch initial chats for history
  const initialChats = await getAdvisorChats().catch(() => []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <Topbar />
      <main className="flex-1 w-full bg-white">
        <AdvisorClient 
          initialExams={exams} 
          initialCourses={courses} 
          initialStreams={streams} 
          initialChats={initialChats}
        />
      </main>
    </div>
  )
}
