"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";

import { useSearch } from "@/features/search/hooks/use-search";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchItem } from "./search-item";
import { SearchSkeleton } from "./search-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { useState } from "react";

interface SearchCommandProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export function SearchCommand({ open, setOpen }: SearchCommandProps) {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query);

  const { data, isLoading, isError, error, refetch } = useSearch(debounced);

  const isEmpty = query.trim().length === 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          p-0
          !max-w-3xl
          w-full
          top-[15%] translate-y-0
          bg-background/70 backdrop-blur-2xl
          border border-border
          shadow-2xl
        "
      >
        <Command shouldFilter={false} className="w-full">

          {/* 🔹 INPUT */}
          <CommandInput
            className="h-14 text-base"
            placeholder="Search npm packages..."
            value={query}
            onValueChange={setQuery}
          />

          {/* 🔹 HINT */}
          <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground border-b border-border">
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-0.5 border rounded">Enter</kbd>
              open package
            </span>

            <span className="flex items-center gap-2">
              <kbd className="px-2 py-0.5 border rounded">Esc</kbd>
              close
            </span>
          </div>

          {/* 🔹 RESULTS */}
          <CommandList className="max-h-[400px] overflow-y-auto">

            {/* empty state */}
            {isEmpty && (
              <div className="p-6 text-sm text-muted-foreground text-center">
                Start typing to search for packages
              </div>
            )}

            {/* error */}
            {!isEmpty && isError && (
              <ErrorState
                message={error?.message || "Failed to fetch results"}
                onRetry={refetch}
              />
            )}

            {/* loading */}
            {!isEmpty && isLoading && <SearchSkeleton />}

            {/* empty */}
            {!isEmpty && !isLoading && !isError && data?.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}

            {/* results */}
            {!isEmpty && !isLoading && !isError &&
              data?.map((pkg) => (
                <SearchItem
                  key={pkg.name}
                  pkg={pkg}
                  onSelect={() => setOpen(false)}
                />
              ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}