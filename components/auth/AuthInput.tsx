import React from 'react'

type Props = {
  type: string
  placeholder: string
  name: string
  required?: boolean
  disabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function AuthInput({ type, placeholder, name, required, disabled, onChange }: Props) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      onChange={onChange}
      className="w-full border rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900"
    />
  )
}
