import { render, screen, fireEvent } from "@testing-library/react"
import { CompareFloatingBar } from "./compare-floating-bar"
import { useCompareStore } from "@/store/compare.store"

// ─── mocks ────────────────────────────────────────────────────────────────────

const mockPush = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// ─── CompareFloatingBar ───────────────────────────────────────────────────────

beforeEach(() => {
  useCompareStore.setState({ packages: [] })
  mockPush.mockReset()
})

describe("CompareFloatingBar", () => {
  it("renders nothing when there are no packages", () => {
    const { container } = render(<CompareFloatingBar />)
    expect(container).toBeEmptyDOMElement()
  })

  it("renders an empty slot when only one package is selected", () => {
    useCompareStore.setState({ packages: ["react"] })
    render(<CompareFloatingBar />)
    expect(screen.getByText("react")).toBeInTheDocument()
    expect(screen.getByText("Add")).toBeInTheDocument()
  })

  it("disables the compare button when fewer than 2 packages are selected", () => {
    useCompareStore.setState({ packages: ["react"] })
    render(<CompareFloatingBar />)
    expect(screen.getByRole("button", { name: /compare|go/i })).toBeDisabled()
  })

  it("enables the compare button when 2 packages are selected", () => {
    useCompareStore.setState({ packages: ["react", "vue"] })
    render(<CompareFloatingBar />)
    expect(screen.getByRole("button", { name: /compare|go/i })).toBeEnabled()
  })

  it("navigates to the correct compare url when compare is clicked", () => {
    useCompareStore.setState({ packages: ["react", "vue"] })
    render(<CompareFloatingBar />)
    fireEvent.click(screen.getByRole("button", { name: /compare|go/i }))
    expect(mockPush).toHaveBeenCalledWith("/compare?a=react&b=vue")
  })

  it("removes the correct package when remove is clicked", () => {
    useCompareStore.setState({ packages: ["react", "vue"] })
    render(<CompareFloatingBar />)
    fireEvent.click(screen.getByRole("button", { name: "Remove react" }))
    expect(useCompareStore.getState().packages).toEqual(["vue"])
  })

  it("clears all packages when clear is clicked", () => {
    useCompareStore.setState({ packages: ["react", "vue"] })
    render(<CompareFloatingBar />)
    fireEvent.click(screen.getByRole("button", { name: /clear/i }))
    expect(useCompareStore.getState().packages).toEqual([])
  })
})