export interface NpmPackage {
  name: string
  description?: string
  "dist-tags": {
    latest: string
  }
  versions: Record<string, NpmVersion>
  time: Record<string, string>
  repository?: {
    type: string
    url: string
  }
}

export interface NpmVersion {
  name: string
  version: string
  description?: string
  keywords?: string[]
  homepage?: string
  license?: string
  dependencies?: Record<string, string>
}

export interface NpmSearchResult {
  name: string;
  description: string;
  version: string;
}