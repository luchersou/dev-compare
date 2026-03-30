import { useQuery } from "@tanstack/react-query"
import { comparePackages } from "../services/compare.service"

export function useCompare(a?: string, b?: string) {
  return useQuery({
    queryKey: ["compare", a, b],
    queryFn: () => comparePackages(a!, b!),
    enabled: !!a && !!b,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}