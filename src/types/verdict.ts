export type VerdictSide = "a" | "b" | "tie"

export interface Insight {
  category: string
  winner: VerdictSide
  reason: string
  weight: number
}

export interface VerdictResult {
  winner: VerdictSide
  scoreA: number
  scoreB: number
}