import Image from "next/image"

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
  return (
    <Section labelledBy="how-title" gap="large">
      <Container className="stack">
        <div className="stack__pane">
          <h2 id="how-title">From search to decision in seconds</h2>
          <ol className="steps">
            {STEPS.map((step) => (
              <li key={step.title}>
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
            <figure key={screen.name} className="screen">
              <div className="screen__frame cut" data-kind="product">
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
