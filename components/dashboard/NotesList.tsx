"use client"

import { useState } from "react"
import { useNotebook } from "@/context/NotebookContext"
import NoteCard from "./NoteCard"
import { motion } from "framer-motion"

export default function NotesList({ 
  onSelectionChange 
}: { 
  onSelectionChange?: (ids: string[]) => void 
}) {
  const { notes, removeNote } = useNotebook()
  const [selectedNotes, setSelectedNotes] = useState<string[]>([])

  function toggleSelect(id: string) {
    const newSelection = selectedNotes.includes(id)
        ? selectedNotes.filter((n) => n !== id)
        : [...selectedNotes, id];
        
    setSelectedNotes(newSelection);
    onSelectionChange?.(newSelection);
  }

  function handleRemove(id: string) {
    removeNote(id);
    // Also remove from selection if selected
    if (selectedNotes.includes(id)) {
      const newSelection = selectedNotes.filter(n => n !== id);
      setSelectedNotes(newSelection);
      onSelectionChange?.(newSelection);
    }
  }

  if (notes.length === 0) {
    return (
      <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h3 className="text-gray-400 font-bold">No notes yet</h3>
        <p className="text-gray-600 text-sm mt-1">Start bookmarking colleges to see them here.</p>
      </div>
    )
  }

  return (
    <>
      {notes.map((note, index) => {
        let chartData: any[] | undefined = undefined;
        let chartType: "LINE" | "BAR" | undefined = undefined;
        let points: string[] = [];

        // Detect Cutoff Trend (Single)
        if (note.data?.[0] && 'cutoff_history' in note.data[0]) {
          chartType = "LINE";
          // Convert history map to array for Recharts
          const history = note.data[0].cutoff_history as Record<string, any>;
          chartData = Object.entries(history)
            .map(([year, categories]) => ({
              year,
              rank: categories["GEN"] || categories["General"] || Object.values(categories)[0]
            }))
            .sort((a, b) => Number(a.year) - Number(b.year));
          
          points = [
            `Course: ${note.data[0].course_name}`,
            `Exam: ${note.data[0].exam_name}`,
            `Latest Rank: ${chartData[chartData.length - 1]?.rank?.toLocaleString() || 'N/A'}`
          ];
        } 
        // Detect Comparison Benchmark (Bar)
        else if (note.note_id.startsWith('comp-')) {
          chartType = "BAR";
          // We need to pivot the bench data into year-based bars
          const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
          chartData = years.map(y => {
            const obj: any = { year: y };
            note.data.forEach((benchItem, idx) => {
              const hist = (benchItem as any).data?.find((h: any) => h.year === y);
              if (hist && hist.ranks) {
                obj[`val_${idx}`] = hist.ranks["GEN"] || hist.ranks["General"] || Object.values(hist.ranks)[0];
              }
            });
            return obj;
          });
          points = [`Comparing ${note.data.length} Institutions`];
        }
        // Generic Note
        else if (note.data?.[0]) {
          points = [
            note.data[0].city && note.data[0].state ? `${note.data[0].city}, ${note.data[0].state}` : null,
            note.data[0].highest_package ? `₹${note.data[0].highest_package} LPA Max` : null,
            note.data[0].rating ? `${note.data[0].rating} Infrastructure` : null
          ].filter(Boolean) as string[];
        }

        return (
          <motion.div
            key={note.note_id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <NoteCard
              id={note.note_id}
              title={note.note_name}
              points={points}
              remark={note.remark}
              advisorContent={note.data?.[0]?.advisor_content}
              chartData={chartData}
              chartType={chartType}
              selected={selectedNotes.includes(note.note_id)}
              toggleSelect={toggleSelect}
              onRemove={handleRemove}
            />
          </motion.div>
        );
      })}
    </>
  )
}