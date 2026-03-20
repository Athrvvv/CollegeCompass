import { getCollegeById, getCollegeDetails } from "@/app/dashboard/actions"
import CollegeDetailClient from "@/components/college/CollegeDetailClient"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function CollegePage(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  const collegeId = parseInt(params.id, 10)

  if (isNaN(collegeId)) {
    notFound()
  }

  // Fetch all necessary data Server-Side
  const [college, details] = await Promise.all([
    getCollegeById(collegeId),
    getCollegeDetails(collegeId)
  ])

  if (!college) {
    notFound()
  }

  return <CollegeDetailClient college={college} details={details} />
}
