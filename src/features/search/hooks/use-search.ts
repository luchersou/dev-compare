import { useQuery } from "@tanstack/react-query";
import { searchPackages } from "../services/search.service";
import { NpmSearchResult } from "@/types/npm";

export function useSearch(query: string) {
  return useQuery<NpmSearchResult[], Error>({
    queryKey: ["search", query],
    queryFn: () => searchPackages(query),
    enabled: query.trim().length > 2,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}