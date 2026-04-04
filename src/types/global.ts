export interface PackageDetails {
  name: string
  version: string
  description?: string
  license?: string
  author?: string
  homepage?: string
  repository?: string
  keywords?: string[]
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  publishedAt?: string

  downloads?: {
    weekly: number
    monthly: number
    yearly: number
  }

  bundle?: {
    size: number
    gzip: number
    hasSideEffects?: boolean
    hasJSModule?: boolean       
  }

  github?: {
    stars: number
    forks: number
    issues: number
    url: string
    lastCommit?: string
    contributors?: number
  }
}

export interface PackageSummary {
  name: string
  version: string
  description?: string
  weeklyDownloads?: number
  gzipSize?: number
  stars?: number
}