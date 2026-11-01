// Manifest of a single published version, as returned by
// registry.npmjs.org/<name>/latest. The full packument (all versions) can
// weigh several MB, which is over the 2MB limit of the Next.js fetch cache.
export interface NpmManifest {
  name: string
  version: string
  description?: string
  keywords?: string[]
  homepage?: string
  license?: string
  author?: string | { name: string; email?: string }
  repository?:
    | string
    | {
        type: string
        url: string
        directory?: string
      }
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

export interface NpmSearchResult {
  name: string;
  description: string;
  version: string;
}
