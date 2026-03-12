import Topbar from "@/components/dashboard/Topbar"
import ExploreClient from "./ExploreClient"
import { getColleges } from "@/app/actions/getColleges"

export const metadata = {
  title: "Explore Colleges | College Compass",
  description: "Browse and filter through our extensive database of colleges.",
}

export default async function ExplorePage() {
  // Fetch all colleges once for client-side filtering as requested
  const colleges = await getColleges()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Topbar />
      <main className="flex-1 w-full bg-white transition-all duration-500 ease-in-out">
        <ExploreClient colleges={colleges} />
      </main>
    </div>
  )
}
