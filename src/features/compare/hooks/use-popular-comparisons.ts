import { useQuery } from "@tanstack/react-query"
import { fetchPopularComparisons } from "../services/popular-comparisons.service"

export function usePopularComparisons() {
  return useQuery({
    queryKey: ["popular-comparisons"],
    queryFn: fetchPopularComparisons,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  })
}