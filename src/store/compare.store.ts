import { create } from "zustand"

interface CompareStore {
  packages: string[]

  addPackage: (name: string) => void
  removePackage: (name: string) => void
  clear: () => void
}

export const useCompareStore = create<CompareStore>((set) => ({
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
}))