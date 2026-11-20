import { fireEvent, render, screen } from "@testing-library/react"

import { useSearchStore } from "@/store/search.store"

import { SearchBar } from "./search-bar"

// ─── SearchBar ────────────────────────────────────────────────────────────────

beforeEach(() => {
  useSearchStore.setState({ open: false })
})

describe("SearchBar", () => {
  it("renders a dialog trigger", () => {
    render(<SearchBar />)
    const button = screen.getByRole("button", { name: /search npm packages/i })
    expect(button).toHaveAttribute("aria-haspopup", "dialog")
  })

  it("opens the global search dialog when clicked", () => {
    render(<SearchBar />)
    fireEvent.click(screen.getByRole("button", { name: /search npm packages/i }))
    expect(useSearchStore.getState().open).toBe(true)
  })

  it("merges a custom className", () => {
    render(<SearchBar className="hero-search" />)
    const button = screen.getByRole("button", { name: /search npm packages/i })
    expect(button).toHaveClass("search-key", "hero-search")
  })
})
