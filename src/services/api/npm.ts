import { NpmPackage } from "@/types/npm"

const BASE_NPM = "https://registry.npmjs.org"

export class PackageNotFoundError extends Error {
  constructor(name: string) {
    super(`Package "${name}" was not found on npm`)
    this.name = "PackageNotFoundError"
  }
}

export async function fetchNpmPackage(name: string): Promise<NpmPackage> {
  const res = await fetch(`${BASE_NPM}/${encodeURIComponent(name)}`, {
    next: { revalidate: 60 * 60 * 24 }, // Revalidate every 24 hours
  })

  if (res.status === 404) {
    throw new PackageNotFoundError(name)
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch npm package "${name}": ${res.status}`)
  }

  return res.json()
}
