// Was a fade-in that left the page blank until JavaScript ran; the compare
// page is now visible as soon as it streams in.
export function CompareFadeSection({ children }: {
  children: React.ReactNode
  delay?: number
}) {
  return <>{children}</>
}
