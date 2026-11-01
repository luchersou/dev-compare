"use client"

import { GitCompareArrows, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { compareHref } from "@/lib/routes"
import { useCompareStore } from "@/store/compare.store"

function PackageSlot({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <div className="tray__slot">
      <span>{name}</span>
      <button type="button" onClick={onRemove} aria-label={`Remove ${name}`}>
        <X aria-hidden="true" />
      </button>
    </div>
  )
}

function EmptySlot() {
  return <div className="tray__empty">Add</div>
}

export function CompareFloatingBar() {
  const { packages, removePackage, clear } = useCompareStore()
  const router = useRouter()

  // Rendered once in the root layout, so this restores the saved selection
  // for every page.
  useEffect(() => {
    useCompareStore.persist.rehydrate()
  }, [])

  const canCompare = packages.length === 2

  function handleCompare() {
    if (!canCompare) return
    router.push(compareHref(packages[0], packages[1]))
  }

  if (packages.length === 0) return null

  return (
    <div className="tray" role="region" aria-label="Compare selection">
        <div className="tray__slots">
          {packages[0]
            ? <PackageSlot name={packages[0]} onRemove={() => removePackage(packages[0])} />
            : <EmptySlot />
          }
          <span className="tray__vs">vs</span>
          {packages[1]
            ? <PackageSlot name={packages[1]} onRemove={() => removePackage(packages[1])} />
            : <EmptySlot />
          }
        </div>

        <div className="tray__actions">
          <button
            type="button"
            className="key key--primary key--sm"
            disabled={!canCompare}
            onClick={handleCompare}
          >
            <GitCompareArrows aria-hidden="true" />
            Compare
          </button>
          <button
            type="button"
            className="key key--sm key--icon"
            onClick={clear}
            aria-label="Clear selection"
          >
            <X aria-hidden="true" />
          </button>
        </div>
    </div>
  )
}
