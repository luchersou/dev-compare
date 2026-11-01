import { Container } from "@/components/layout/container"
import { PackageDetails } from "@/types/global"

interface PackageMetadataProps {
  pkg: PackageDetails
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="meta-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export function PackageMetadata({ pkg }: PackageMetadataProps) {
  const depCount = pkg.dependencies ? Object.keys(pkg.dependencies).length : 0
  const hasContent =
    pkg.license ||
    pkg.publishedAt ||
    pkg.author ||
    pkg.homepage ||
    pkg.repository ||
    depCount > 0 ||
    (pkg.keywords && pkg.keywords.length > 0)

  if (!hasContent) return null

  return (
    <section className="pkg-section" aria-labelledby="info-title">
      <Container className="pkg-split">
        <h2 id="info-title" className="pkg-section__title">Package info</h2>
        <dl className="meta-list">
          {pkg.license && <Row label="License">{pkg.license}</Row>}

          {pkg.author && <Row label="Author">{pkg.author}</Row>}

          {pkg.publishedAt && (
            <Row label="Latest release">
              <time dateTime={pkg.publishedAt}>
                {new Date(pkg.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </Row>
          )}

          {pkg.homepage && (
            <Row label="Homepage">
              <a href={pkg.homepage} target="_blank" rel="noopener noreferrer" className="link meta-row__url">
                {pkg.homepage.replace(/^https?:\/\//, "")}
              </a>
            </Row>
          )}

          {pkg.repository && (
            <Row label="Repository">
              <a href={pkg.repository} target="_blank" rel="noopener noreferrer" className="link meta-row__url">
                {pkg.repository.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
              </a>
            </Row>
          )}

          {depCount > 0 && (
            <Row label="Dependencies">
              <span className="num">
                {depCount} {depCount === 1 ? "dependency" : "dependencies"}
              </span>
            </Row>
          )}

          {pkg.keywords && pkg.keywords.length > 0 && (
            <Row label="Keywords">
              <ul className="keywords">
                {pkg.keywords.slice(0, 12).map((kw) => (
                  <li key={kw} className="cut-s">{kw}</li>
                ))}
              </ul>
            </Row>
          )}
        </dl>
      </Container>
    </section>
  )
}
