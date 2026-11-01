import { CircleAlert, CircleCheck } from "lucide-react"

import { Container } from "@/components/layout/container"
import { formatSize } from "@/lib/utils"
import { PackageDetails } from "@/types/global"

interface BundleDetailsProps {
  pkg: PackageDetails
}

function getSizeRating(gzip: number): { label: string; good: boolean } {
  if (gzip < 5 * 1024) return { label: "Tiny", good: true }
  if (gzip < 20 * 1024) return { label: "Small", good: true }
  if (gzip < 50 * 1024) return { label: "Medium", good: true }
  return { label: "Large", good: false }
}

export function BundleDetails({ pkg }: BundleDetailsProps) {
  if (!pkg.bundle) return null

  const { size, gzip, hasSideEffects, hasJSModule } = pkg.bundle
  const rating = getSizeRating(gzip)
  const compressionRatio = ((1 - gzip / size) * 100).toFixed(0)
  const RatingIcon = rating.good ? CircleCheck : CircleAlert

  return (
    <section className="pkg-section" aria-labelledby="bundle-title">
      <Container className="pkg-split">
        <div className="pkg-split__head">
          <h2 id="bundle-title" className="pkg-section__title">Bundle size</h2>
          <p className={`status ${rating.good ? "status--good" : "status--bad"}`}>
            <RatingIcon aria-hidden="true" />
            {rating.label}
          </p>
        </div>

        <div className="bundle">
          <dl className="bundle__figures">
            <div className="stat">
              <dt>Minified</dt>
              <dd className="num">{formatSize(size)}</dd>
            </div>
            <div className="stat">
              <dt>Gzipped</dt>
              <dd className="num">{formatSize(gzip)}</dd>
              <dd className="stat__note">{compressionRatio}% smaller with gzip</dd>
            </div>
          </dl>

          {/* Gzipped share of the minified size, drawn to scale. */}
          <div
            className="bundle__bar"
            role="img"
            aria-label={`Gzipped is ${100 - Number(compressionRatio)}% of the minified size`}
          >
            <span style={{ width: `${Math.max(2, 100 - Number(compressionRatio))}%` }} />
          </div>

          {(hasSideEffects !== undefined || hasJSModule) && (
            <ul className="bundle__flags">
              {hasSideEffects !== undefined && (
                <li className={`status ${hasSideEffects ? "status--bad" : "status--good"}`}>
                  {hasSideEffects ? <CircleAlert aria-hidden="true" /> : <CircleCheck aria-hidden="true" />}
                  {hasSideEffects ? "Has side effects" : "No side effects"}
                </li>
              )}
              {hasJSModule && (
                <li className="status status--good">
                  <CircleCheck aria-hidden="true" />
                  ES Module
                </li>
              )}
            </ul>
          )}
        </div>
      </Container>
    </section>
  )
}
