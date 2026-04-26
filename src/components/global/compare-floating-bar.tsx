"use client"

import { useCompareStore } from "@/store/compare.store"
import { useRouter } from "next/navigation"
import { X, GitCompareArrows, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"

function PackageSlot({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1.5 text-xs font-mono sm:gap-2 sm:px-3 sm:text-sm">
      <span className="max-w-[80px] truncate sm:max-w-[120px]">{name}</span>
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
    <div className="flex items-center gap-1.5 rounded-md border border-dashed border-border px-2 py-1.5 text-xs text-muted-foreground sm:gap-2 sm:px-3 sm:text-sm">
      <Plus size={13} />
      <span>Add</span>
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
        className="fixed bottom-4 left-1/2 z-[9999] -translate-x-1/2 sm:bottom-6"
      >
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background/90 px-3 py-2.5 shadow-lg backdrop-blur-md sm:gap-3 sm:px-4 sm:py-3">

          {/* Slots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
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
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              size="sm"
              disabled={!canCompare}
              onClick={handleCompare}
              className="h-8 gap-1 px-2.5 text-xs sm:h-9 sm:gap-1.5 sm:px-3 sm:text-sm"
            >
              <GitCompareArrows size={13} />
              <span className="hidden sm:inline">Compare</span>
              <span className="sm:hidden">Go</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={clear}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground sm:h-9 sm:px-3 sm:text-sm"
            >
              <X size={13} className="sm:hidden" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  )
}