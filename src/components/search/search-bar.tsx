"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { SearchCommand } from "./search-command";

export function SearchBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="
          flex items-center gap-3 w-full max-w-xl mx-auto
          px-4 py-3
          bg-card border border-border
          rounded-xl cursor-pointer
          hover:bg-accent/50 transition
        "
      >
        <Search className="w-5 h-5 text-muted-foreground" />

        <span className="text-muted-foreground">
          Search npm packages...
        </span>

        <kbd className="ml-auto text-xs text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <SearchCommand open={open} setOpen={setOpen} />
    </>
  );
}