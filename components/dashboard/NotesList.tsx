"use client"

import { useState } from "react"
import NoteCard from "./NoteCard"

const mockNotes = [
  {
    id: 1,
    title: "COEP Pune",
    points: ["Good placements", "Strong CS dept", "Affordable fees"],
  },
  {
    id: 2,
    title: "VJTI Mumbai",
    points: ["Top Maharashtra college", "Strong alumni", "Great campus"],
  },
  {
    id: 3,
    title: "PICT Pune",
    points: ["Good coding culture", "High placements", "Industry exposure"],
  },
]

export default function NotesList() {
  const [selectedNotes, setSelectedNotes] = useState<number[]>([])

  function toggleSelect(id: number) {
    setSelectedNotes((prev) =>
      prev.includes(id)
        ? prev.filter((n) => n !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="flex flex-col h-full">

      {/* NOTES */}
      <div className="space-y-4 overflow-y-auto flex-1">

        {mockNotes.map((note) => (
          <NoteCard
            key={note.id}
            id={note.id}
            title={note.title}
            points={note.points}
            selected={selectedNotes.includes(note.id)}
            toggleSelect={toggleSelect}
          />
        ))}

      </div>

      {/* GENERATE REPORT BUTTON */}
      <button className="mt-4 w-full bg-linear-90 from-slate-700 to-slate-800 font-bold text-white py-2.5 rounded-lg text-sm hover:from-slate-800 hover:to-slate-900 transition shadow-sm">
        Generate Report
      </button>

    </div>
  )
}