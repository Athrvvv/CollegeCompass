import ExploreClient from "./ExploreClient"
import { getColleges } from "@/app/actions/getColleges"

export const metadata = {
  title: "Discovery Hub | College Compass",
  description: "Explore colleges through placements, ratings, states, and academic streams in our comprehensive discovery engine.",
}

export default async function ExplorePage() {
  // Fetch all colleges once for client-side filtering as requested
  const colleges = await getColleges()

  return <ExploreClient colleges={colleges} />
}
