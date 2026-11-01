import { Container } from "@/components/layout/container"

// The shape of the package page while its data loads.
export function PackageContentSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading package">
      <section className="pkg-hero page-top">
        <Container className="pkg-hero__inner">
          <span className="skel" style={{ width: 120, height: 14 }} />
          <div className="pkg-hero__id">
            <span className="skel" style={{ width: "min(360px, 70%)", height: 56 }} />
            <span className="skel" style={{ width: 220, height: 16 }} />
            <span className="skel" style={{ width: "min(560px, 90%)", height: 22 }} />
          </div>
          <div className="pkg-hero__actions">
            <span className="skel" style={{ width: 240, height: 44 }} />
            <span className="skel" style={{ width: 200, height: 48 }} />
          </div>
        </Container>
      </section>

      <section className="pkg-section">
        <Container>
          <span className="skel" style={{ width: 96, height: 28 }} />
          <div className="stats-board">
            {Array.from({ length: 3 }).map((_, group) => (
              <div key={group} className="stat-group">
                <span className="skel" style={{ width: 80, height: 14 }} />
                <div className="stat-group__list">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="stat">
                      <span className="skel" style={{ width: 110, height: 12 }} />
                      <span className="skel" style={{ width: 90, height: 32 }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
