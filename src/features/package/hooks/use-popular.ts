import { useQuery } from "@tanstack/react-query"
import { getPopular } from "../services/popular.service"

export function usePopular() {
  return useQuery({
    queryKey: ["popular"],
    queryFn: getPopular,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}