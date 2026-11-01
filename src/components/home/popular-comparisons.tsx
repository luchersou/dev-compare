"use client"

import Link from "next/link"
import { useRef, useState } from "react"

import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { useMediaQuery } from "@/hooks/use-media-query"
import { compareHref } from "@/lib/routes"
import { formatDownloads, formatSize } from "@/lib/utils"
import type { ComparisonCardData } from "@/types/compare"

const INITIAL_VISIBLE_DESKTOP = 6
const INITIAL_VISIBLE_MOBILE = 4

interface PopularComparisonsProps {
  data: ComparisonCardData[]
}

function Metric({
  title,
  item,
  pick,
  format,
}: {
  title: string
  item: ComparisonCardData
  pick: (side: ComparisonCardData["a"]) => number | null
  format: (n: number | null) => string
}) {
  const a = pick(item.a)
  const b = pick(item.b)
  const max = Math.max(a ?? 0, b ?? 0)
  if (!max) return null

  return (
    <div className="duel__metric">
      <h4>{title}</h4>
      {([["a", item.pair.a, a], ["b", item.pair.b, b]] as const).map(([side, name, value]) => (
        <div key={side} className={`duel__row duel__row--${side}`}>
          <span className="duel__name">{name}</span>
          <span className="duel__track" aria-hidden="true">
            <span className="duel__bar" style={{ width: `${Math.max(1, ((value ?? 0) / max) * 100)}%` }} />
          </span>
          <span className="duel__value">{format(value)}</span>
        </div>
      ))}
    </div>
  )
}

export function PopularComparisons({ data }: PopularComparisonsProps) {
  const [expanded, setExpanded] = useState(false)
  const [active, setActive] = useState(0)
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])
  const isMobile = useMediaQuery("(max-width: 640px)")

  const visibleCount = isMobile ? INITIAL_VISIBLE_MOBILE : INITIAL_VISIBLE_DESKTOP
  const visible = expanded ? data : data.slice(0, visibleCount)
  const hasMore = data.length > visibleCount
  const current = Math.min(active, visible.length - 1)

  // Arrow keys move between pairs, as a tablist should.
  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (index + delta + visible.length) % visible.length
    setActive(next)
    tabsRef.current[next]?.focus()
  }

  if (data.length === 0) return null

  return (
    <Section labelledBy="duel-title">
      <Container>
        <div className="duel__head">
          <h2 id="duel-title">Handpicked comparisons</h2>
          <p className="lead">A curated selection of common package comparisons to get you started.</p>
        </div>

        <div className="duel">
          <div>
            <div className="duel__tray" role="tablist" aria-label="Comparisons" aria-orientation="vertical">
              {visible.map((item, i) => (
                <button
                  key={`${item.pair.a}-${item.pair.b}`}
                  ref={(el) => { tabsRef.current[i] = el }}
                  type="button"
                  role="tab"
                  id={`duel-tab-${i}`}
                  aria-selected={i === current}
                  aria-controls={`duel-panel-${i}`}
                  tabIndex={i === current ? 0 : -1}
                  className="key key--sm"
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                >
                  <span>{item.pair.a}</span>
                  <span>vs</span>
                  <span>{item.pair.b}</span>
                </button>
              ))}
            </div>

            {hasMore && (
              <button
                type="button"
                className="key key--sm duel__more"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded ? "See less comparisons" : "See more comparisons"}
              </button>
            )}
          </div>

          {visible.map((item, i) => (
            <div
              key={`${item.pair.a}-${item.pair.b}`}
              role="tabpanel"
              id={`duel-panel-${i}`}
              aria-labelledby={`duel-tab-${i}`}
              hidden={i !== current}
              className="duel__panel cut"
            >
              <h3 className="duel__title">
                <span className="mono">{item.pair.a}</span>
                <span className="vs">vs</span>
                <span className="mono">{item.pair.b}</span>
              </h3>
              <Metric title="Downloads / week" item={item} pick={(s) => s.downloads} format={formatDownloads} />
              <Metric title="Bundle size (gzip)" item={item} pick={(s) => s.bundleSize} format={formatSize} />
              <Link href={compareHref(item.pair.a, item.pair.b)} className="key key--primary">
                Open the full comparison
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
