import Link from "next/link"

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-20 ">

      {/* Top Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center">

        <div>
          <h1 className="text-5xl text-gray-700 font-semibold leading-tight">
            What is CollegeCompass?
          </h1>

          <button className="mt-6 bg-gray-900 text-white px-6 py-3 rounded-full text-sm hover:bg-blue-600 cursor-pointer transition-colors duration-300 ">
            <Link href="/signup">Explore now</Link>
          </button>
        </div>

        <p className="text-lg text-gray-700 leading-relaxed">
          CollegeCompass is a smart platform that helps students discover
          colleges based on their entrance exam rank, cutoff trends, fees,
          and location preferences. It simplifies the admission journey by
          helping you compare colleges, analyze past cutoffs, and make
          confident decisions about your academic future.
        </p>

      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-16">

        <div className="bg-gray-100 rounded-2xl p-6">
          <h3 className="text-lg text-gray-700 font-semibold mb-3">
            Rank-based discovery
          </h3>

          <p className="text-gray-600 text-sm">
            Instantly discover colleges where you have strong admission
            chances based on your entrance exam rank and previous cutoff
            trends.
          </p>
        </div>

        <div className="bg-gray-900 text-white rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3">
            Compare colleges easily
          </h3>

          <p className="text-gray-300 text-sm">
            Compare placements, fees, campus facilities and faculty across
            multiple colleges in one place to make smarter decisions.
          </p>
        </div>

        <div className="bg-gray-900 text-white rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3">
            Admission insights
          </h3>

          <p className="text-gray-300 text-sm">
            Explore historical cutoff trends, admission rounds and data
            insights that help you plan your college applications better.
          </p>
        </div>

      </div>

    </section>
  )
}