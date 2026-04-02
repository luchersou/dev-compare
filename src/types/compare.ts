import { ComparisonPair } from "@/config/popular-comparisons"

export interface PackageSnapshot {
  name: string
  downloads: number | null
  bundleSize: number | null
}

export interface ComparisonCardData {
  pair: ComparisonPair
  a: PackageSnapshot
  b: PackageSnapshot
}