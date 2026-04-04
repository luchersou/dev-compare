"use client"

import { useCompareStore } from "@/store/compare.store"
import { useRouter } from "next/navigation"
import { X, GitCompareArrows, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"

function PackageSlot({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-sm font-mono">
      <span className="max-w-[120px] truncate">{name}</span>
      <button
        onClick={onRemove}
        className="text-muted-foreground transition-colors hover:text-foreground"
        aria-label={`Remove ${name}`}
      >
        <X size={13} />
      </button>
    </div>
  )
}

function EmptySlot() {
  return (
    <div className="flex items-center gap-2 rounded-md border border-dashed border-border px-3 py-1.5 text-sm text-muted-foreground">
      <Plus size={13} />
      <span>Add package</span>
    </div>
  )
}

export function CompareFloatingBar() {
  const { packages, removePackage, clear } = useCompareStore()
  const router = useRouter()

  const canCompare = packages.length === 2

  function handleCompare() {
    if (!canCompare) return
    router.push(`/compare?a=${packages[0]}&b=${packages[1]}`)
  }

  if (packages.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-6 left-1/2 z-60 -translate-x-1/2"
      >
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background/90 px-4 py-3 shadow-lg backdrop-blur-md">

          {/* Slots */}
          <div className="flex items-center gap-2">
            {packages[0]
              ? <PackageSlot name={packages[0]} onRemove={() => removePackage(packages[0])} />
              : <EmptySlot />
            }
            <span className="text-xs text-muted-foreground">vs</span>
            {packages[1]
              ? <PackageSlot name={packages[1]} onRemove={() => removePackage(packages[1])} />
              : <EmptySlot />
            }
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-border" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled={!canCompare}
              onClick={handleCompare}
              className="gap-1.5"
            >
              <GitCompareArrows size={14} />
              Compare
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={clear}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  )
}