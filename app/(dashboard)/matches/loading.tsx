import { ListSkeleton } from "@/components/ui/Skeleton";

export default function MatchesLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-10 w-28 animate-pulse rounded bg-gray-200" />
      </div>
      <ListSkeleton rows={6} />
    </div>
  );
}
