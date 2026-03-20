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
    <AdvisorClient 
      initialExams={exams} 
      initialCourses={courses} 
      initialStreams={streams} 
      initialChats={initialChats}
    />
  )
}
