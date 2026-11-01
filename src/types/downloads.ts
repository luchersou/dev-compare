export interface NpmDownloadsResponse {
  downloads: number
  start: string
  end: string
  package: string
}

export interface DailyDownloads {
  downloads: number
  day: string
}

export interface NpmDownloadsRange {
  start: string
  end: string
  package: string
  downloads: DailyDownloads[]
}

export interface WeeklyDownloads {
  week: string
  downloads: number
}
