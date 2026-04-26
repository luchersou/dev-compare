"use client"

import { motion } from "framer-motion"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { Workflow } from "lucide-react"

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
            <Workflow className="h-4 w-4 text-primary" />
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
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3 rounded-xl overflow-hidden border border-border">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
              className="group relative overflow-hidden bg-card px-8 py-10 transition-colors duration-200 hover:bg-muted/40"
            >
              {/* Decorative backdrop number */}
              <span className="pointer-events-none absolute -bottom-3 -right-2 select-none text-[7rem] font-semibold leading-none tracking-tighter text-foreground/[0.04] transition-all duration-300 group-hover:text-foreground/[0.07] group-hover:-bottom-1">
                {i + 1}
              </span>

              {/* Content */}
              <div className="relative z-10">
                <p className="mb-3 text-[17px] font-medium leading-snug tracking-tight text-foreground">
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
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}