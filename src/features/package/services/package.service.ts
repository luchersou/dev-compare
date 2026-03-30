import type { PackageDetails } from "@/types/global"

export async function getPackage(name: string): Promise<PackageDetails> {
  const res = await fetch(`/api/package/${encodeURIComponent(name)}`)

  if (!res.ok) {
    throw new Error(`Failed to fetch package: ${res.status}`)
  }

  return res.json()
}