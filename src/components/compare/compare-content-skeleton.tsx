import { Container } from "@/components/layout/container"

// The shape of the compare page while both packages load.
export function CompareContentSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading comparison">
      <section className="cmp-hero page-top">
        <Container className="cmp-hero__inner">
          <span className="skel" style={{ width: 180, height: 14 }} />
          <span className="skel" style={{ width: "min(640px, 90%)", height: 72 }} />
          <div className="cmp-hero__ids">
            {[0, 1].map((i) => (
              <div key={i} className="cmp-id">
                <span className="skel" style={{ width: 160, height: 20 }} />
                <span className="skel" style={{ width: "90%", height: 16 }} />
                <span className="skel" style={{ width: "70%", height: 16 }} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="cmp-section">
        <Container>
          <span className="skel" style={{ width: 96, height: 28 }} />
          <div className="cmp-skel-rows">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="skel" style={{ height: 20 }} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
