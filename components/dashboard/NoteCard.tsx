"use client"

type Props = {
  id: number
  title: string
  points: string[]
  selected: boolean
  toggleSelect: (id: number) => void
}

export default function NoteCard({
  id,
  title,
  points,
  selected,
  toggleSelect,
}: Props) {
  return (
    <div
      onClick={() => toggleSelect(id)}
      className={`border rounded-xl p-4 text-sm cursor-pointer transition
      ${selected ? "bg-blue-50 border-blue-500" : "bg-white hover:bg-gray-50"}`}
    >
      <h3 className="font-semibold mb-2">{title}</h3>

      <ul className="text-gray-600 text-xs space-y-1">
        {points.map((p, i) => (
          <li key={i}>• {p}</li>
        ))}
      </ul>
    </div>
  )
}