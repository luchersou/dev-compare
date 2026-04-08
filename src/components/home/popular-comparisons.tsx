"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { GitCompare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ComparisonCard } from "./comparison-card"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import type { ComparisonCardData } from "@/types/compare"

const INITIAL_VISIBLE_DESKTOP = 6
const INITIAL_VISIBLE_MOBILE = 3

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

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
        <motion.div
          className="mb-10 flex flex-col gap-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2"
          >
            <GitCompare className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              comparisons
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
          >
            Handpicked comparisons
          </motion.h2>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-sm text-muted-foreground max-w-md"
          >
            A curated selection of common package comparisons to get you started
          </motion.p>
        </motion.div>

        <div className="relative">
          <motion.div
            key={expanded ? "expanded" : "collapsed"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-50px" }}
          >
            {visible.map((item, index) => (
              <motion.div
                key={`${item.pair.a}-${item.pair.b}`}
                variants={fadeUp}
                transition={{ duration: 0.4, delay: index >= (isMobile ? INITIAL_VISIBLE_MOBILE : INITIAL_VISIBLE_DESKTOP) ? (index % 3) * 0.08 : 0 }}
              >
                <ComparisonCard data={item} />
              </motion.div>
            ))}
          </motion.div>

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