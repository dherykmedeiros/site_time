export default function PlayerProfileLoading() {
  return (
    <div className="min-h-screen animate-pulse pb-16">
      {/* Hero skeleton */}
      <div className="h-52 bg-gray-300" />

      <div className="mx-auto -mt-5 max-w-4xl px-4">
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-[20px] border border-gray-200 bg-gray-100"
            />
          ))}
        </div>

        {/* Table skeleton */}
        <div className="mt-10 space-y-3">
          <div className="h-7 w-48 rounded-lg bg-gray-200" />
          <div className="h-48 rounded-[20px] bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
