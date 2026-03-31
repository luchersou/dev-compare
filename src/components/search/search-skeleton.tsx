export function SearchSkeleton() {
  return (
    <div className="p-4 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-10 w-full rounded-md bg-muted animate-pulse"
        />
      ))}
    </div>
  );
}