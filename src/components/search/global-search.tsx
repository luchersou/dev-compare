"use client"

import { useEffect } from "react"

import { useSearchStore } from "@/store/search.store"

import { SearchCommand } from "./search-command"

export function GlobalSearch() {
  const open = useSearchStore((s) => s.open)
  const setOpen = useSearchStore((s) => s.setOpen)

  // ⌘K on macOS, Ctrl+K elsewhere, as the search triggers advertise.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!useSearchStore.getState().open)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [setOpen])

  return <SearchCommand open={open} setOpen={setOpen} />
}
