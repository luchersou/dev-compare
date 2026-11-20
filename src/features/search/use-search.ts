import { useQuery } from "@tanstack/react-query";

import { NpmSearchResult } from "@/types/npm";

import { searchPackages } from "./search.service";

export function useSearch(query: string) {
  // Trim once so "react " and "react" share one request and one cache entry.
  const q = query.trim();

  return useQuery<NpmSearchResult[], Error>({
    queryKey: ["search", q],
    queryFn: () => searchPackages(q),
    enabled: q.length > 2,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
