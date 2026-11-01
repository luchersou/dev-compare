export function SearchSkeleton() {
  return (
    <div className="search-skeleton" data-testid="search-skeleton" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="search-skeleton__row">
          <span className="skel" style={{ width: `${32 - i * 3}%`, height: 14 }} />
          <span className="skel" style={{ width: `${70 - i * 6}%`, height: 12 }} />
        </div>
      ))}
    </div>
  );
}
