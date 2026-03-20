import DashboardGrid from "@/components/dashboard/DashboardGrid"

function SkeletonCard({ delay }: { delay: number }) {
  return (
    <div 
      className="bg-white/70 backdrop-blur-md border border-gray-100 rounded-[32px] p-6 shadow-sm overflow-hidden relative group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-100 rounded-full w-3/4 animate-pulse" />
          <div className="h-3 bg-gray-50 rounded-full w-1/2 animate-pulse" />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="h-2 bg-gray-50 rounded-full w-full animate-pulse" />
        <div className="h-2 bg-gray-50 rounded-full w-5/6 animate-pulse" />
        <div className="h-2 bg-gray-50 rounded-full w-2/3 animate-pulse" />
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-50">
        <div className="h-6 bg-gray-100 rounded-lg w-16 animate-pulse" />
        <div className="h-6 bg-gray-100 rounded-lg w-16 animate-pulse" />
      </div>
    </div>
  )
}

export default function LoadingDashboard() {
  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Subtabs Skeleton */}
      <div className="px-6 py-4 border-b border-gray-50 shrink-0">
        <div className="flex gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-50 rounded-2xl w-32 animate-pulse" />
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <DashboardGrid>
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} delay={i * 100} />
          ))}
        </DashboardGrid>
      </div>
    </div>
  )
}