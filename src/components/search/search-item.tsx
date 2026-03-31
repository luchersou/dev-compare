"use client";

import { CommandItem } from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { NpmSearchResult } from "@/types/npm";

export function SearchItem({ pkg, onSelect }: { pkg: NpmSearchResult; onSelect: () => void }) {
  const router = useRouter();

  return (
    <CommandItem
      onSelect={() => {
        router.push(`/package/${pkg.name}`);
        onSelect();
      }}
      className="flex items-start gap-3 p-3"
    >
      {/* Avatar fake */}
      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-xs font-bold">
        {pkg.name.slice(0, 2).toUpperCase()}
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{pkg.name}</span>
          <span className="text-xs text-muted-foreground">
            v{pkg.version}
          </span>
        </div>

        <span className="text-xs text-muted-foreground line-clamp-1">
          {pkg.description ?? "No description"}
        </span>
      </div>
    </CommandItem>
  );
}