import type { PackageDetails } from "@/types/global"

export async function comparePackages(a: string, b: string): Promise<PackageDetails[]> {
  const res = await fetch(
    `/api/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`
  )

  if (!res.ok) {
    throw new Error(`Compare failed: ${res.status}`)
  }

  return res.json()
}