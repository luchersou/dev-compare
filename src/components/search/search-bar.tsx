"use client";

import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store/search.store";

interface SearchBarProps {
  className?: string;
}

// The large search trigger used in the hero and the close; it opens the
// global dialog.
export function SearchBar({ className }: SearchBarProps) {
  const setOpen = useSearchStore((s) => s.setOpen);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={cn("search-key", className)}
      aria-haspopup="dialog"
    >
      <Search aria-hidden="true" />
      <span>Search npm packages…</span>
      <span className="search-key__keys" aria-hidden="true">
        <kbd className="kbd">⌘</kbd>
        <kbd className="kbd">K</kbd>
      </span>
    </button>
  );
}
