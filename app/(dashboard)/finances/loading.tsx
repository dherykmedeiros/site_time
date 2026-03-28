import { ListSkeleton } from "@/components/ui/Skeleton";

export default function FinancesLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-10 w-28 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-24 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-24 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-24 animate-pulse rounded-lg bg-gray-200" />
      </div>
      <ListSkeleton rows={6} />
    </div>
  );
}
