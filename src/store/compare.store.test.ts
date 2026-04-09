import { useCompareStore } from "@/store/compare.store" 

// ─── compare.store ────────────────────────────────────────────────────────────

beforeEach(() => {
  useCompareStore.getState().clear()
})

describe("addPackage", () => {
  it("adds a package to the list", () => {
    useCompareStore.getState().addPackage("react")
    expect(useCompareStore.getState().packages).toEqual(["react"])
  })

  it("does not add the same package twice", () => {
    useCompareStore.getState().addPackage("react")
    useCompareStore.getState().addPackage("react")
    expect(useCompareStore.getState().packages).toEqual(["react"])
  })

  it("does not add a third package when already at the limit of 2", () => {
    useCompareStore.getState().addPackage("react")
    useCompareStore.getState().addPackage("vue")
    useCompareStore.getState().addPackage("svelte")
    expect(useCompareStore.getState().packages).toEqual(["react", "vue"])
  })
})

describe("removePackage", () => {
  it("removes an existing package", () => {
    useCompareStore.getState().addPackage("react")
    useCompareStore.getState().removePackage("react")
    expect(useCompareStore.getState().packages).toEqual([])
  })

  it("does nothing when removing a package that is not in the list", () => {
    useCompareStore.getState().addPackage("react")
    useCompareStore.getState().removePackage("vue")
    expect(useCompareStore.getState().packages).toEqual(["react"])
  })
})

describe("clear", () => {
  it("empties the list", () => {
    useCompareStore.getState().addPackage("react")
    useCompareStore.getState().addPackage("vue")
    useCompareStore.getState().clear()
    expect(useCompareStore.getState().packages).toEqual([])
  })
})