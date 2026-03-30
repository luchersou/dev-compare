export interface NpmDownloadsResponse {
  downloads: number
  start: string
  end: string
  package: string
}

export interface NpmDownloadsRange {
  downloads: {
    downloads: number
    day: string
  }[]
}