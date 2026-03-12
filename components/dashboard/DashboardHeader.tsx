export default function DashboardHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-semibold text-gray-900">
        {title}
      </h1>

      {subtitle && (
        <p className="text-gray-500 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  )
}