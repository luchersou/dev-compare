// Scoped packages ("@scope/pkg") keep their slash so they map to the
// /package/[...name] catch-all route; each segment is encoded on its own.
export function packageHref(name: string): string {
  return `/package/${name.split("/").map(encodeURIComponent).join("/")}`
}

export function compareHref(a: string, b: string): string {
  return `/compare?${new URLSearchParams({ a, b }).toString()}`
}

export function packageNameFromSegments(segments: string[]): string {
  return segments.map(decodeURIComponent).join("/")
}
