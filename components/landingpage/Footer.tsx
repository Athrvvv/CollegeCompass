export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-24">
      <div className="max-w-6xl mx-auto px-8 py-16">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900">Contact Us</h2>
          <p className="text-gray-500 mt-2">
            Have questions, feedback, or queries? Reach out to us.
          </p>
        </div>

        {/* Contact + FAQ Section */}
        <div className="grid md:grid-cols-2 gap-16">

          {/* Query Box */}
          <div className="flex flex-col gap-4">

            <h3 className="text-xl font-semibold text-gray-800">
              Send us a query
            </h3>

            <input
              type="email"
              placeholder="Your Email"
              className="border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
            />

            <textarea
              placeholder="Write your query or feedback..."
              rows={4}
              className="border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
            />

            <button className="bg-gray-900 text-white py-3 rounded-lg hover:bg-black transition">
              Send Message
            </button>

          </div>

          {/* FAQ Section */}
          <div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              FAQs
            </h3>

            <div className="space-y-3">

              <details className="border rounded-lg p-4 bg-white">
                <summary className="cursor-pointer font-medium text-gray-800">
                  How does CollegeCompass suggest colleges?
                </summary>
                <p className="text-gray-600 mt-2 text-sm">
                  Suggestions are generated using previous cutoff trends,
                  entrance exam ranks, and student preferences.
                </p>
              </details>

              <details className="border rounded-lg p-4 bg-white">
                <summary className="cursor-pointer font-medium text-gray-800">
                  Is the cutoff data reliable?
                </summary>
                <p className="text-gray-600 mt-2 text-sm">
                  Yes, we use verified historical admission datasets to
                  provide accurate insights.
                </p>
              </details>

              <details className="border rounded-lg p-4 bg-white">
                <summary className="cursor-pointer font-medium text-gray-800">
                  Can I compare multiple colleges?
                </summary>
                <p className="text-gray-600 mt-2 text-sm">
                  Yes, CollegeCompass allows side-by-side comparison of
                  colleges based on placements, fees, facilities and cutoffs.
                </p>
              </details>

            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="text-center text-sm text-gray-500 mt-16">
          © {new Date().getFullYear()} CollegeCompass
        </div>

      </div>
    </footer>
  )
}