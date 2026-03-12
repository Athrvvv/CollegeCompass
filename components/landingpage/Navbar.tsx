import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold text-gray-800">
          <span className="text-2xl">✦</span>
          <span>CollegeCompass</span>
        </div>

{/*
        // Desktop Navigation
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#" className="hover:text-black">Colleges</a>
          <a href="#" className="hover:text-black">Cutoffs</a>
          <a href="#" className="hover:text-black">Compare</a>
          <a href="#" className="hover:text-black">Developers</a>
        </div>

        // Mobile Bottom Navigation
        <div className="fixed bottom-0 left-0 w-full border-t border-gray-200 shadow-sm bg-white flex justify-around items-center py-3 text-sm text-gray-600 md:hidden">
          <a href="#" className="hover:text-black">Colleges</a>
          <a href="#" className="hover:text-black">Cutoffs</a>
          <a href="#" className="hover:text-black">Compare</a>
          <a href="#" className="hover:text-black">Developers</a>
        </div>
*/}

        {/* CTA Button */}
        <Link href="/login" className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm hover:bg-blue-600 cursor-pointer transition-colors duration-300">
          Join us
        </Link>

      </div>
    </nav>
  )
}