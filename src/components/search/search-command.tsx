"use client";

import { useState } from "react";

import { ErrorState } from "@/components/shared/error-state";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useSearch } from "@/features/search/use-search";
import { useDebounce } from "@/hooks/use-debounce";

import { SearchItem } from "./search-item";
import { SearchSkeleton } from "./search-skeleton";

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
      <DialogContent className="search-dialog cut" showCloseButton={false}>
        <Command shouldFilter={false} className="search-dialog__command">
          <CommandInput
            className="search-dialog__input"
            placeholder="Search npm packages..."
            value={query}
            onValueChange={setQuery}
          />

          <p className="search-dialog__hint">
            <span><kbd className="kbd">Enter</kbd> open package</span>
            <span><kbd className="kbd">+</kbd> add to compare</span>
            <span><kbd className="kbd">Esc</kbd> close</span>
          </p>

          <CommandList className="search-dialog__list">
            {isEmpty && (
              <p className="search-dialog__empty">
                Start typing to search for packages
              </p>
            )}

            {!isEmpty && isError && (
              <ErrorState
                message={error?.message || "Failed to fetch results"}
                onRetry={refetch}
              />
            )}

            {!isEmpty && isLoading && <SearchSkeleton />}

            {!isEmpty && !isLoading && !isError && data?.length === 0 && (
              <CommandEmpty className="search-dialog__empty">No results found.</CommandEmpty>
            )}

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
