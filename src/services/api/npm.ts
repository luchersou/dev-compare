import { NpmPackage } from "@/types/npm"

const BASE_NPM = "https://registry.npmjs.org"

export async function fetchNpmPackage(name: string): Promise<NpmPackage> {
  const res = await fetch(`${BASE_NPM}/${name}`, {
    next: { revalidate: 60 * 60 * 24 }, // Revalidate every 24 hours
  })

  if (!res.ok) {
    throw new Error("Failed to fetch npm package")
  }

  return res.json()
}