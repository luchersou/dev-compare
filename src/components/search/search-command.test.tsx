import { fireEvent,render, screen } from "@testing-library/react"

import { useSearch } from "@/features/search/use-search"
import type { NpmSearchResult } from "@/types/npm"

import { SearchCommand } from "./search-command"

// ─── mocks ────────────────────────────────────────────────────────────────────

type WithChildren = { children?: React.ReactNode }

jest.mock("@/features/search/use-search")
jest.mock("@/hooks/use-debounce", () => ({
  useDebounce: (value: string) => value,
}))

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: WithChildren) => <div>{children}</div>,
  DialogContent: ({ children }: WithChildren) => <div>{children}</div>,
}))

jest.mock("@/components/ui/command", () => ({
  Command: ({ children }: WithChildren) => <div>{children}</div>,
  CommandInput: ({
    value,
    onValueChange,
    placeholder,
  }: {
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
  }) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    />
  ),
  CommandList: ({ children }: WithChildren) => <div>{children}</div>,
  CommandEmpty: ({ children }: WithChildren) => <div>{children}</div>,
}))

jest.mock("./search-item", () => ({
  SearchItem: ({ pkg, onSelect }: { pkg: NpmSearchResult; onSelect: () => void }) => (
    <button onClick={onSelect}>{pkg.name}</button>
  ),
}))

jest.mock("./search-skeleton", () => ({
  SearchSkeleton: () => <div data-testid="search-skeleton" />,
}))

jest.mock("@/components/shared/error-state", () => ({
  ErrorState: ({ message, onRetry }: { message?: string; onRetry?: () => void }) => (
    <div>
      <span>{message}</span>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}))

// ─── SearchCommand ────────────────────────────────────────────────────────────

const mockUseSearch = useSearch as jest.Mock

const defaultSearch = {
  data: [],
  isLoading: false,
  isError: false,
  error: null,
  refetch: jest.fn(),
}

const renderComponent = (setOpen = jest.fn()) =>
  render(<SearchCommand open={true} setOpen={setOpen} />)

const typeQuery = (value: string) =>
  fireEvent.change(screen.getByPlaceholderText("Search npm packages..."), {
    target: { value },
  })

beforeEach(() => {
  mockUseSearch.mockReturnValue(defaultSearch)
})

describe("SearchCommand", () => {
  it("shows the empty prompt when query is empty", () => {
    renderComponent()
    expect(screen.getByText("Start typing to search for packages")).toBeInTheDocument()
  })

  it("shows the loading skeleton while fetching", () => {
    mockUseSearch.mockReturnValue({ ...defaultSearch, isLoading: true })
    renderComponent()
    typeQuery("react")
    expect(screen.getByTestId("search-skeleton")).toBeInTheDocument()
  })

  it("shows the error state when the search fails", () => {
    mockUseSearch.mockReturnValue({
      ...defaultSearch,
      isError: true,
      error: { message: "Failed to fetch results" },
    })
    renderComponent()
    typeQuery("react")
    expect(screen.getByText("Failed to fetch results")).toBeInTheDocument()
  })

  it("shows no results message when search returns empty", () => {
    mockUseSearch.mockReturnValue({ ...defaultSearch, data: [] })
    renderComponent()
    typeQuery("react")
    expect(screen.getByText("No results found.")).toBeInTheDocument()
  })

  it("renders a result item for each package returned", () => {
    mockUseSearch.mockReturnValue({
      ...defaultSearch,
      data: [
        { name: "react" },
        { name: "vue" },
      ],
    })
    renderComponent()
    typeQuery("react")
    expect(screen.getByText("react")).toBeInTheDocument()
    expect(screen.getByText("vue")).toBeInTheDocument()
  })

  it("calls setOpen with false when a result item is selected", () => {
    const setOpen = jest.fn()
    mockUseSearch.mockReturnValue({
      ...defaultSearch,
      data: [{ name: "react" }],
    })
    renderComponent(setOpen)
    typeQuery("react")
    fireEvent.click(screen.getByText("react"))
    expect(setOpen).toHaveBeenCalledWith(false)
  })

  it("calls refetch when retry is clicked on error state", () => {
    const refetch = jest.fn()
    mockUseSearch.mockReturnValue({
      ...defaultSearch,
      isError: true,
      error: { message: "Failed to fetch results" },
      refetch,
    })
    renderComponent()
    typeQuery("react")
    fireEvent.click(screen.getByText("Retry"))
    expect(refetch).toHaveBeenCalled()
  })
})