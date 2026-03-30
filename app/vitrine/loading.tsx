import { Skeleton } from "@/components/ui/Skeleton";

export default function VitrineLoading() {
  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-[var(--border)] px-4 pb-14 pt-14">
        <div className="mx-auto max-w-5xl text-center">
          <Skeleton className="mx-auto h-4 w-28 rounded-full" />
          <Skeleton className="mx-auto mt-4 h-10 w-80 max-w-full rounded-2xl" />
          <Skeleton className="mx-auto mt-3 h-4 w-[32rem] max-w-full rounded-full" />
          <div className="mx-auto mt-7 max-w-xl rounded-full border border-[var(--border)] bg-white/75 p-2">
            <Skeleton className="h-10 w-full rounded-full" />
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-5xl px-4">
        <Skeleton className="mb-4 h-4 w-44 rounded-full" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="app-surface rounded-[24px] border border-[var(--border)] p-5"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-40 rounded-full" />
                  <Skeleton className="h-3 w-24 rounded-full" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-5/6 rounded-full" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-[var(--border)] p-3">
                <Skeleton className="h-14 rounded-xl" />
                <Skeleton className="h-14 rounded-xl" />
              </div>
              <div className="mt-5 flex items-center justify-between">
                <Skeleton className="h-4 w-14 rounded-full" />
                <Skeleton className="h-10 w-28 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}