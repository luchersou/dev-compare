"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"

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

// Screens captured from the running app (light and dark), one per step.
const SCREENS = [
  { name: "search", caption: "The search dialog, opened with ⌘ K." },
  { name: "package", caption: "A package page: figures, the weekly chart and the install command." },
  { name: "compare", caption: "Two packages side by side, each leading value checked." },
]

export function HowItWorks() {
  // Only the step whose screen is crossing the viewport's reading line is
  // shown; scrolling either way swaps it in place.
  const [active, setActive] = useState(0)
  const screensRef = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = screensRef.current.indexOf(entry.target as HTMLElement)
          if (index >= 0) setActive(index)
        }
      },
      // A one-pixel line 45% down the viewport: the screen on it is active.
      { rootMargin: "-45% 0px -55% 0px" }
    )
    for (const el of screensRef.current) if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Section labelledBy="how-title" gap="large">
      <Container className="stack">
        <div className="stack__pane">
          <h2 id="how-title">From search to decision in seconds</h2>
          <ol className="steps">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                data-state={i < active ? "before" : i > active ? "after" : "active"}
              >
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <ul className="steps__tags" aria-label="Data used">
                  {step.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <div className="stack__screens">
          {SCREENS.map((screen, i) => (
            <figure
              key={screen.name}
              className="screen"
              ref={(el) => { screensRef.current[i] = el }}
            >
              <div className={screen.name === "search" ? "screen__frame screen__frame--fit cut" : "screen__frame cut"} data-kind="product">
                <Image
                  className="screen--light"
                  src={`/images/screens/${screen.name}-light.webp`}
                  alt=""
                  width={1440}
                  height={900}
                  sizes="(max-width: 960px) 100vw, 760px"
                  priority={i === 0}
                />
                <Image
                  className="screen--dark"
                  src={`/images/screens/${screen.name}-dark.webp`}
                  alt=""
                  width={1440}
                  height={900}
                  sizes="(max-width: 960px) 100vw, 760px"
                />
              </div>
              <figcaption>{screen.caption}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  )
}
