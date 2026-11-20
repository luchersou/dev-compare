import { fireEvent, render, screen } from "@testing-library/react"

import { useCompareStore } from "@/store/compare.store"
import type { NpmSearchResult } from "@/types/npm"

import { SearchItem } from "./search-item"

// ─── mocks ────────────────────────────────────────────────────────────────────

const mockPush = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

// cmdk's item needs a <Command> context; stand in a plain element that fires
// onSelect on click, the way pressing Enter on a highlighted item does.
jest.mock("@/components/ui/command", () => ({
  CommandItem: ({
    children,
    onSelect,
  }: {
    children?: React.ReactNode
    onSelect?: () => void
  }) => (
    <div data-testid="command-item" onClick={onSelect}>
      {children}
    </div>
  ),
}))

// ─── SearchItem ───────────────────────────────────────────────────────────────

const react: NpmSearchResult = {
  name: "react",
  description: "A JS library",
  version: "19.0.0",
}

const renderItem = (pkg: NpmSearchResult = react, onSelect = jest.fn()) =>
  render(<SearchItem pkg={pkg} onSelect={onSelect} />)

beforeEach(() => {
  useCompareStore.setState({ packages: [] })
  mockPush.mockReset()
})

describe("SearchItem", () => {
  it("renders the package name, version and description", () => {
    renderItem()
    expect(screen.getByText("react")).toBeInTheDocument()
    expect(screen.getByText("19.0.0")).toBeInTheDocument()
    expect(screen.getByText("A JS library")).toBeInTheDocument()
  })

  it("falls back when the package has no description", () => {
    renderItem({ ...react, description: undefined as unknown as string })
    expect(screen.getByText("No description")).toBeInTheDocument()
  })

  it("navigates to the package page and calls onSelect when selected", () => {
    const onSelect = jest.fn()
    renderItem(react, onSelect)

    fireEvent.click(screen.getByTestId("command-item"))

    expect(mockPush).toHaveBeenCalledWith("/package/react")
    expect(onSelect).toHaveBeenCalled()
  })

  it("keeps the slash of a scoped package in the link", () => {
    renderItem({ ...react, name: "@tanstack/react-query" })

    fireEvent.click(screen.getByTestId("command-item"))

    expect(mockPush).toHaveBeenCalledWith("/package/%40tanstack/react-query")
  })

  it("adds the package to compare without navigating", () => {
    const onSelect = jest.fn()
    renderItem(react, onSelect)

    fireEvent.click(screen.getByRole("button", { name: "Add react to compare" }))

    expect(useCompareStore.getState().packages).toEqual(["react"])
    expect(mockPush).not.toHaveBeenCalled()
    expect(onSelect).not.toHaveBeenCalled()
  })

  it("removes the package from compare when it is already selected", () => {
    useCompareStore.setState({ packages: ["react"] })
    renderItem()

    const button = screen.getByRole("button", { name: "Remove react from compare" })
    expect(button).toHaveAttribute("aria-pressed", "true")

    fireEvent.click(button)

    expect(useCompareStore.getState().packages).toEqual([])
  })

  it("disables adding when two other packages are already selected", () => {
    useCompareStore.setState({ packages: ["vue", "svelte"] })
    renderItem()

    expect(screen.getByRole("button", { name: "Add react to compare" })).toBeDisabled()
  })

  it("still allows removing when the list is full and includes this package", () => {
    useCompareStore.setState({ packages: ["react", "vue"] })
    renderItem()

    expect(screen.getByRole("button", { name: "Remove react from compare" })).toBeEnabled()
  })
})
