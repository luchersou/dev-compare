import { NpmManifest } from "@/types/npm"

const BASE_NPM = "https://registry.npmjs.org"

export class PackageNotFoundError extends Error {
  constructor(name: string) {
    super(`Package "${name}" was not found on npm`)
    this.name = "PackageNotFoundError"
  }
}

export async function fetchNpmPackage(name: string): Promise<NpmManifest> {
  const res = await fetch(`${BASE_NPM}/${encodeURIComponent(name)}/latest`, {
    next: { revalidate: 60 * 60 }, // Revalidate every 1 hour
  })

  if (res.status === 404) {
    throw new PackageNotFoundError(name)
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch npm package "${name}": ${res.status}`)
  }

  return res.json()
}

interface NpmSearchResponse {
  objects: { package: { name: string; date?: string } }[]
}

// The latest manifest has no publish date, but the search index does.
export async function fetchPublishedAt(name: string): Promise<string | undefined> {
  try {
    const res = await fetch(
      `${BASE_NPM}/-/v1/search?text=${encodeURIComponent(name)}&size=5`,
      { next: { revalidate: 60 * 60 } } // Revalidate every 1 hour
    )

    if (!res.ok) return undefined

    const data = (await res.json()) as NpmSearchResponse
    return data.objects.find((o) => o.package.name === name)?.package.date
  } catch (error) {
    console.error(`[npm] Error fetching publish date for ${name}`, error)
    return undefined
  }
}
