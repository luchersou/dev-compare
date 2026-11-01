// The two opposing arrows from app/icon.tsx: one package in, one out.
export function Wordmark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 22 22" fill="none" aria-hidden="true" {...props}>
      <line x1="2" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <polyline points="15,3 20,7 15,11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="20" y1="15" x2="2" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <polyline points="7,11 2,15 7,19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
