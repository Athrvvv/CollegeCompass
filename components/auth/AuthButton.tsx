type Props = {
  children: React.ReactNode
  type?: "button" | "submit" | "reset"
  disabled?: boolean
}

export default function AuthButton({ children, type = "button", disabled }: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-blue-600 cursor-pointer transition-colors duration-300 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  )
}