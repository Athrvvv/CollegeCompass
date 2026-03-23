export default function AuthCard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full max-w-[380px] p-8 bg-white border rounded-xl shadow-sm">
      {children}
    </div>
  )
}