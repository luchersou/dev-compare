import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface CompareStore {
  packages: string[]

  addPackage: (name: string) => void
  removePackage: (name: string) => void
  clear: () => void
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set) => ({
      packages: [],

      addPackage: (name) =>
        set((state) => {
          if (state.packages.includes(name)) return state

          if (state.packages.length >= 2) return state

          return { packages: [...state.packages, name] }
        }),

      removePackage: (name) =>
        set((state) => ({
          packages: state.packages.filter((p) => p !== name),
        })),

      clear: () => set({ packages: [] }),
    }),
    {
      name: "devcompare-selection",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ packages: state.packages }),
      // The server always renders an empty selection; rehydrate after mount
      // (see CompareFloatingBar) so the first client render matches it.
      skipHydration: true,
    }
  )
)
