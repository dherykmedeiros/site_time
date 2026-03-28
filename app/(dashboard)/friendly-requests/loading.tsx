import { ListSkeleton } from "@/components/ui/Skeleton";

export default function FriendlyRequestsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
      </div>
      <ListSkeleton rows={5} />
    </div>
  );
}
