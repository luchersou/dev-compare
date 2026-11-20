import { act, fireEvent, render, screen } from "@testing-library/react"

import { useSearchStore } from "@/store/search.store"

import { GlobalSearch } from "./global-search"

// ─── mocks ────────────────────────────────────────────────────────────────────

jest.mock("./search-command", () => ({
  SearchCommand: ({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) => (
    <div data-testid="search-command" data-open={String(open)}>
      <button onClick={() => setOpen(false)}>Close</button>
    </div>
  ),
}))

// ─── GlobalSearch ─────────────────────────────────────────────────────────────

const dialog = () => screen.getByTestId("search-command")

beforeEach(() => {
  useSearchStore.setState({ open: false })
})

describe("GlobalSearch", () => {
  it("passes the store's open state to the dialog", () => {
    render(<GlobalSearch />)
    expect(dialog()).toHaveAttribute("data-open", "false")

    act(() => useSearchStore.getState().setOpen(true))
    expect(dialog()).toHaveAttribute("data-open", "true")
  })

  it("lets the dialog close itself through the store", () => {
    useSearchStore.setState({ open: true })
    render(<GlobalSearch />)

    fireEvent.click(screen.getByText("Close"))

    expect(useSearchStore.getState().open).toBe(false)
  })

  it.each([
    ["⌘K", { metaKey: true }],
    ["Ctrl+K", { ctrlKey: true }],
  ])("toggles the dialog with %s", (_, modifier) => {
    render(<GlobalSearch />)

    fireEvent.keyDown(window, { key: "k", ...modifier })
    expect(useSearchStore.getState().open).toBe(true)

    fireEvent.keyDown(window, { key: "k", ...modifier })
    expect(useSearchStore.getState().open).toBe(false)
  })

  it("accepts an uppercase K (e.g. with Caps Lock on)", () => {
    render(<GlobalSearch />)
    fireEvent.keyDown(window, { key: "K", metaKey: true })
    expect(useSearchStore.getState().open).toBe(true)
  })

  it("prevents the browser default for the shortcut", () => {
    render(<GlobalSearch />)
    const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, cancelable: true })

    act(() => {
      window.dispatchEvent(event)
    })

    expect(event.defaultPrevented).toBe(true)
  })

  it("ignores K without a modifier and other modified keys", () => {
    render(<GlobalSearch />)

    fireEvent.keyDown(window, { key: "k" })
    fireEvent.keyDown(window, { key: "j", metaKey: true })

    expect(useSearchStore.getState().open).toBe(false)
  })

  it("removes the shortcut listener on unmount", () => {
    const { unmount } = render(<GlobalSearch />)
    unmount()

    fireEvent.keyDown(window, { key: "k", metaKey: true })

    expect(useSearchStore.getState().open).toBe(false)
  })
})
