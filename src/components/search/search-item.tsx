"use client";

import { CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { NpmSearchResult } from "@/types/npm";
import { useCompareStore } from "@/store/compare.store";
import { Plus, Check } from "lucide-react";
import { generateIconColor } from "@/lib/utils";

export function SearchItem({ pkg, onSelect }: { pkg: NpmSearchResult; onSelect: () => void }) {
  const router = useRouter();
  const { packages, addPackage, removePackage } = useCompareStore();
  const isSelected = packages.includes(pkg.name);
  const isFull = packages.length >= 2 && !isSelected;
  const iconColor = generateIconColor(pkg.name)
  const initials = pkg.name.replace(/^@[^/]+\//, "").slice(0, 2).toUpperCase()

  function handleCompare(e: React.MouseEvent) {
    e.stopPropagation()
    if (isSelected) {
      removePackage(pkg.name)
    } else {
      addPackage(pkg.name)
    }
  }

  return (
    <CommandItem
      onSelect={() => {
        router.push(`/package/${pkg.name}`);
        onSelect();
      }}
      className="group flex items-center gap-3 p-3"
    >
      {/* Avatar */}
      <div
        className="w-9 h-9 shrink-0 rounded-md flex items-center justify-center text-xs font-bold text-white"
        style={{ backgroundColor: iconColor }}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono font-medium text-sm truncate">{pkg.name}</span>
          <span className="text-xs text-muted-foreground shrink-0">v{pkg.version}</span>
        </div>
        <span className="text-xs text-muted-foreground line-clamp-1">
          {pkg.description ?? "No description"}
        </span>
      </div>

      {/* Compare button */}
      <Button
        size="icon"
        variant={isSelected ? "default" : "outline"}
        className={`
          shrink-0 h-7 w-7
          md:opacity-0 md:group-hover:opacity-100
          transition-opacity duration-150
          ${isFull ? "cursor-not-allowed opacity-30 md:group-hover:opacity-30" : ""}
          ${isSelected ? "hover:bg-destructive hover:text-destructive-foreground" : ""}
        `}
        onClick={handleCompare}
        disabled={isFull}
        aria-label={isSelected ? `Remove ${pkg.name} from compare` : `Add ${pkg.name} to compare`}
      >
        {isSelected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
      </Button>
    </CommandItem>
  );
}