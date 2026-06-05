export function DashboardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6 lg:flex-row">
      <div className="h-[640px] w-full rounded-3xl bg-white lg:w-80" />
      <div className="flex flex-1 flex-col gap-6">
        <div className="h-24 rounded-3xl bg-white" />
        <div className="h-28 rounded-3xl bg-white" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-36 rounded-3xl bg-white" />
          ))}
        </div>
        <div className="h-80 rounded-3xl bg-white" />
      </div>
    </div>
  )
}
