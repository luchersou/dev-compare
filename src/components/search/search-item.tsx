"use client";

import { Check, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { CommandItem } from "@/components/ui/command";
import { packageHref } from "@/lib/routes";
import { useCompareStore } from "@/store/compare.store";
import { NpmSearchResult } from "@/types/npm";

export function SearchItem({ pkg, onSelect }: { pkg: NpmSearchResult; onSelect: () => void }) {
  const router = useRouter();
  const { packages, addPackage, removePackage } = useCompareStore();
  const isSelected = packages.includes(pkg.name);
  const isFull = packages.length >= 2 && !isSelected;

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
        router.push(packageHref(pkg.name));
        onSelect();
      }}
      className="search-item"
    >
      <div className="search-item__text">
        <div className="search-item__name">
          <span className="mono">{pkg.name}</span>
          <span className="search-item__version">{pkg.version}</span>
        </div>
        <span className="search-item__desc">
          {pkg.description ?? "No description"}
        </span>
      </div>

      <button
        type="button"
        className="key key--sm key--icon search-item__add"
        aria-pressed={isSelected}
        onClick={handleCompare}
        disabled={isFull}
        aria-label={isSelected ? `Remove ${pkg.name} from compare` : `Add ${pkg.name} to compare`}
      >
        {isSelected ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
      </button>
    </CommandItem>
  );
}
