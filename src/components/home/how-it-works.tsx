"use client"

import { motion } from "framer-motion"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"

const STEPS = [
  {
    title: "Search",
    description:
      "Type any package name. Instant results with version, description and weekly downloads.",
    tags: ["npm registry", "instant"],
  },
  {
    title: "Explore",
    description:
      "View downloads, bundle size, GitHub stars and more. Add to compare with one click.",
    tags: ["bundlephobia", "github"],
  },
  {
    title: "Compare or go deep",
    description:
      "Side-by-side comparison with charts, or dive into a single package's full details.",
    tags: ["compare", "details"],
  },
]

export function HowItWorks() {
  return (
    <Section>
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="h-[5px] w-[5px] rounded-full bg-muted-foreground/50" />
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              How it works
            </p>
          </div>
          <h2 className="max-w-sm text-[clamp(1.6rem,3vw,2.25rem)] font-medium leading-[1.15] tracking-tight text-foreground">
            From search to decision in seconds
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Three steps to find the right package for your project
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 divide-y divide-border border border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0 rounded-lg overflow-hidden">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
              className="group relative bg-card p-8 transition-colors duration-200 hover:bg-muted/40"
            >
              {/* Number row */}
              <div className="mb-7 flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/60">
                  Step
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium text-muted-foreground transition-colors group-hover:border-foreground/20 group-hover:text-foreground">
                  {i + 1}
                </span>
              </div>

              {/* Content */}
              <p className="mb-2.5 text-[17px] font-medium leading-snug tracking-tight text-foreground">
                {step.title}
              </p>
              <p className="mb-6 text-[13px] leading-relaxed text-muted-foreground">
                {step.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {step.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-8 right-0 h-px origin-left scale-x-0 bg-border transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}