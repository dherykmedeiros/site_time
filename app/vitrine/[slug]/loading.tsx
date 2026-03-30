import { Skeleton } from "@/components/ui/Skeleton";

export default function VitrineTeamLoading() {
  return (
    <div className="min-h-screen pb-16">
      <header className="relative overflow-hidden px-4 pb-20 pt-14">
        <div className="mx-auto max-w-5xl">
          <Skeleton className="h-8 w-40 rounded-full" />
        </div>
        <div className="mx-auto mt-8 max-w-4xl text-center">
          <Skeleton className="mx-auto h-28 w-28 rounded-full" />
          <Skeleton className="mx-auto mt-4 h-5 w-24 rounded-full" />
          <Skeleton className="mx-auto mt-3 h-10 w-80 max-w-full rounded-2xl" />
          <Skeleton className="mx-auto mt-4 h-4 w-[32rem] max-w-full rounded-full" />
          <div className="mt-7 flex items-center justify-center gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-10 max-w-5xl space-y-10 px-4">
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-32 rounded-[22px]" />
          <Skeleton className="h-32 rounded-[22px]" />
          <Skeleton className="h-32 rounded-[22px]" />
        </div>

        <section>
          <Skeleton className="mb-4 h-8 w-44 rounded-2xl" />
          <div className="grid gap-4 sm:grid-cols-4">
            <Skeleton className="h-24 rounded-[18px]" />
            <Skeleton className="h-24 rounded-[18px]" />
            <Skeleton className="h-24 rounded-[18px]" />
            <Skeleton className="h-24 rounded-[18px]" />
          </div>
        </section>

        <section>
          <Skeleton className="mb-4 h-8 w-36 rounded-2xl" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-20 rounded-[18px]" />
            ))}
          </div>
        </section>

        <section>
          <Skeleton className="mb-4 h-8 w-52 rounded-2xl" />
          <Skeleton className="h-80 rounded-[24px]" />
        </section>
      </main>
    </div>
  );
}