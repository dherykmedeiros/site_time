export default function SeasonsLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-48 animate-pulse rounded-xl bg-[var(--surface-soft)]" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-20 animate-pulse rounded-2xl bg-[var(--surface-soft)]" />
      ))}
    </div>
  );
}
