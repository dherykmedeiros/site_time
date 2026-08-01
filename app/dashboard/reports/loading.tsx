export default function ReportsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-wrap items-center gap-4">
        <div className="h-10 w-64 rounded-lg bg-white/5" />
        <div className="h-10 w-40 rounded-lg bg-white/5" />
        <div className="h-10 w-40 rounded-lg bg-white/5" />
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 w-32 shrink-0 rounded-full bg-white/5" />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-white/5 border border-white/[0.04]" />
        ))}
      </div>

      <div className="h-[400px] rounded-xl bg-white/5 border border-white/[0.04]" />
    </div>
  );
}
