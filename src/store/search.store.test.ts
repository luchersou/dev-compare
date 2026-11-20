import { useSearchStore } from "@/store/search.store"

// ─── search.store ─────────────────────────────────────────────────────────────

beforeEach(() => {
  useSearchStore.setState({ open: false })
})

describe("useSearchStore", () => {
  it("starts closed", () => {
    expect(useSearchStore.getState().open).toBe(false)
  })

  it("opens and closes the dialog", () => {
    useSearchStore.getState().setOpen(true)
    expect(useSearchStore.getState().open).toBe(true)

    useSearchStore.getState().setOpen(false)
    expect(useSearchStore.getState().open).toBe(false)
  })
})
