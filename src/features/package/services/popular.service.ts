import type { PackageDetails } from "@/types/global"

export async function getPopular(): Promise<PackageDetails[]> {
  const res = await fetch("/api/popular")

  if (!res.ok) {
    throw new Error(`Failed to fetch popular: ${res.status}`)
  }

  return res.json()
}