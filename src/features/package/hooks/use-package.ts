import { useQuery } from "@tanstack/react-query"
import { getPackage } from "../services/package.service" 

export function usePackage(name: string) {
  return useQuery({
    queryKey: ["package", name],
    queryFn: () => getPackage(name),
    enabled: !!name,
    staleTime: 1000 * 60 * 5, 
    retry: 1,                  
  })
}