import { NpmSearchResult } from "@/types/npm"

export async function searchPackages(query: string): Promise<NpmSearchResult[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)

  if (!res.ok) {
    throw new Error(`Search failed: ${res.status}`)
  }

  return res.json()
}