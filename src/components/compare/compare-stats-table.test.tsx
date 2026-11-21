import { render, screen, within } from "@testing-library/react"

import type { PackageDetails } from "@/types/global"

import { CompareStatsTable } from "./compare-stats-table"

function pkg(overrides: Partial<PackageDetails>): PackageDetails {
  return { name: "pkg", version: "1.0.0", ...overrides }
}

// Returns which column(s) of a metric row are marked as leading.
function leaders(label: string) {
  const row = screen.getByRole("rowheader", { name: label }).closest("tr")!
  const [a, b] = within(row).getAllByRole("cell")
  return {
    a: within(a).queryByText("leads") !== null,
    b: within(b).queryByText("leads") !== null,
  }
}

const github = { forks: 0, url: "", stars: 0, issues: 0 }

describe("CompareStatsTable", () => {
  it("marks the higher value as leading for downloads and stars", () => {
    render(
      <CompareStatsTable
        pkgA={pkg({ name: "a", downloads: { weekly: 10, monthly: 100, yearly: 1000 }, github: { ...github, stars: 1 } })}
        pkgB={pkg({ name: "b", downloads: { weekly: 20, monthly: 50, yearly: 1000 }, github: { ...github, stars: 9 } })}
      />
    )

    expect(leaders("Weekly downloads")).toEqual({ a: false, b: true })
    expect(leaders("Monthly downloads")).toEqual({ a: true, b: false })
    expect(leaders("GitHub stars")).toEqual({ a: false, b: true })
  })

  it("marks the lower value as leading for open issues and bundle size", () => {
    render(
      <CompareStatsTable
        pkgA={pkg({ name: "a", github: { ...github, issues: 3 }, bundle: { size: 0, gzip: 5000 } })}
        pkgB={pkg({ name: "b", github: { ...github, issues: 30 }, bundle: { size: 0, gzip: 1000 } })}
      />
    )

    expect(leaders("Open issues")).toEqual({ a: true, b: false })
    expect(leaders("Bundle (gzip)")).toEqual({ a: false, b: true })
  })

  it("marks no leader on a tie", () => {
    render(
      <CompareStatsTable
        pkgA={pkg({ name: "a", downloads: { weekly: 10, monthly: 10, yearly: 1000 } })}
        pkgB={pkg({ name: "b", downloads: { weekly: 20, monthly: 10, yearly: 1000 } })}
      />
    )

    expect(leaders("Yearly downloads")).toEqual({ a: false, b: false })
  })

  it("marks no leader and shows a dash when one side is missing data", () => {
    render(
      <CompareStatsTable
        pkgA={pkg({ name: "a", github: { ...github, stars: 100 }, bundle: { size: 0, gzip: 10 } })}
        pkgB={pkg({ name: "b" })}
      />
    )

    expect(leaders("GitHub stars")).toEqual({ a: false, b: false })
    expect(leaders("Bundle (gzip)")).toEqual({ a: false, b: false })

    const starsRow = screen.getByRole("rowheader", { name: "GitHub stars" }).closest("tr")!
    expect(within(starsRow).getAllByRole("cell")[1]).toHaveTextContent("—")
  })
})
