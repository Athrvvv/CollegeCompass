"use client"

import { useState } from "react"

type Props = {
  name: string
  placeholder: string
  required?: boolean
  disabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function PasswordInput({ name, placeholder, required, disabled, onChange }: Props) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative mb-4">

      <input
        type={show ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onChange={onChange}
        className="w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-900"
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        disabled={disabled}
        className="absolute right-3 top-3 text-sm text-gray-500"
      >
        {show ? "Hide" : "Show"}
      </button>

    </div>
  )
}
