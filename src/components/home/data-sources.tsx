import { Container } from "@/components/layout/container"

// Each public source and the verdict category it feeds, with the weights
// computeVerdict uses (src/lib/verdict.ts).
const SOURCES = [
  { host: "api.npmjs.org", what: "Daily downloads for the last year" },
  { host: "api.github.com", what: "Stars, forks, open issues and last push" },
  { host: "bundlephobia.com", what: "Bundle size, minified and gzipped" },
  { host: "registry.npmjs.org", what: "Latest manifest and publish date" },
]

const CATEGORIES = [
  { name: "Popularity", weight: 3 },
  { name: "Community", weight: 2 },
  { name: "Bundle size", weight: 2 },
  { name: "Maintenance", weight: 1 },
]

// Source row -> category row. GitHub's last push and the registry's publish
// date both feed Maintenance.
const WIRES: Array<[number, number]> = [
  [0, 0],
  [1, 1],
  [1, 3],
  [2, 2],
  [3, 3],
]

const ROW = 96

export function DataSources() {
  const height = ROW * SOURCES.length

  return (
    <section className="band band--graphite" aria-labelledby="sources-title">
      <Container>
        <div className="sources__head">
          <h2 id="sources-title">Four public sources, one verdict</h2>
          <p className="lead">No API keys. Every figure comes from these endpoints, cached for an hour.</p>
        </div>

        <div className="mapping">
          <ul className="mapping__pane" aria-label="Data sources">
            {SOURCES.map((s) => (
              <li key={s.host}>
                <span className="mapping__host">{s.host}</span>
                <span className="mapping__what">{s.what}</span>
              </li>
            ))}
          </ul>

          <svg
            className="mapping__wires"
            viewBox={`0 0 100 ${height}`}
            preserveAspectRatio="none"
            role="img"
            aria-label="Diagram: which source feeds each verdict category"
          >
            {WIRES.map(([from, to]) => {
              const y1 = from * ROW + ROW / 2
              const y2 = to * ROW + ROW / 2
              return (
                <path
                  key={`${from}-${to}`}
                  d={`M0 ${y1} H50 V${y2} H100`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}
          </svg>

          <ul className="mapping__pane" aria-label="Verdict categories and weights">
            {CATEGORIES.map((c) => (
              <li key={c.name}>
                <span className="mapping__cat">
                  {c.name}
                  <span>weight {c.weight}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
