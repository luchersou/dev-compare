import { NpmPackage } from "@/types/npm"

const BASE_NPM = "https://registry.npmjs.org"

export async function fetchNpmPackage(name: string): Promise<NpmPackage> {
  const res = await fetch(`${BASE_NPM}/${name}`)

  if (!res.ok) {
    throw new Error("Failed to fetch npm package")
  }

  return res.json()
}