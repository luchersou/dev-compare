export interface PackageDetails {
  name: string
  description?: string
  version: string

  downloads?: number

  bundle?: {
    size: number
    gzip: number
  }

  github?: {
    stars: number
    forks: number
    issues: number
    url: string
  }
}