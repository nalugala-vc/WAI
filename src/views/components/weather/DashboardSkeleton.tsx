const block =
  'rounded-3xl border border-white/10 bg-white/15 backdrop-blur-sm'

export function DashboardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6 lg:flex-row">
      <div className={`h-[640px] w-full lg:w-[280px] ${block}`} />
      <div className="flex flex-1 flex-col gap-6">
        <div className={`h-24 ${block}`} />
        <div className={`h-28 ${block}`} />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={`h-36 ${block}`} />
          ))}
        </div>
        <div className={`h-80 ${block}`} />
      </div>
    </div>
  )
}
