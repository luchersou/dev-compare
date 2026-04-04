"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ComparisonCard } from "./comparison-card"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import type { ComparisonCardData } from "@/types/compare"

const INITIAL_VISIBLE_DESKTOP = 6
const INITIAL_VISIBLE_MOBILE = 3

interface PopularComparisonsProps {
  data: ComparisonCardData[]
}

export function PopularComparisons({ data }: PopularComparisonsProps) {
  const [expanded, setExpanded] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")

  const visibleCount = isMobile ? INITIAL_VISIBLE_MOBILE : INITIAL_VISIBLE_DESKTOP
  const visible = expanded ? data : data.slice(0, visibleCount)
  const hasMore = data.length > visibleCount

  return (
    <Section>
      <Container>
        <div className="mb-8">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-2">
            Comparisons
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">Popular comparisons</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            The most searched package comparisons this week
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((item) => (
              <ComparisonCard key={`${item.pair.a}-${item.pair.b}`} data={item} />
            ))}
          </div>

          {hasMore && !expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          )}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded((prev) => !prev)}
              className="text-muted-foreground"
            >
              {expanded ? "See less comparisons" : "See more comparisons"}
            </Button>
          </div>
        )}
      </Container>
    </Section>
  )
}