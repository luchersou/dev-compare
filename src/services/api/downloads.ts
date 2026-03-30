import { NpmDownloadsResponse } from "@/types/downloads"

const BASE_DOWNLOADS = "https://api.npmjs.org"

export async function fetchDownloads(name: string) {
  const res = await fetch(
    `${BASE_DOWNLOADS}/downloads/point/last-week/${name}`
  )

  if (!res.ok) return null

  return (await res.json()) as NpmDownloadsResponse
}