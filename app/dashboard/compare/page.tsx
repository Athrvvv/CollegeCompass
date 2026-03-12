import Topbar from "@/components/dashboard/Topbar"
import CompareClient from "./CompareClient"

export const metadata = {
  title: "Compare Colleges | College Compass",
  description: "Compare your favorite colleges side-by-side with detailed analysis.",
}

export default function ComparePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Topbar />
      <main className="flex-1 w-full bg-white">
        <CompareClient />
      </main>
    </div>
  )
}
