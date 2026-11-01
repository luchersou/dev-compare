import { create } from "zustand"

interface SearchStore {
  open: boolean
  setOpen: (open: boolean) => void
}

// One search dialog for the whole app; every trigger (nav, hero, close)
// opens the same instance.
export const useSearchStore = create<SearchStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}))
