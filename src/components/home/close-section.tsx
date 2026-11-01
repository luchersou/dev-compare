import Image from "next/image"

import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { SearchBar } from "@/components/search/search-bar"

export function CloseSection() {
  return (
    <Section labelledBy="close-title">
      <Container className="close">
        <div className="close__text">
          <h2 id="close-title">Pick two packages</h2>
          <p className="lead">Search one, add it to compare, then the other. The verdict does the rest.</p>
          <SearchBar />
        </div>

        <figure className="screen">
          <div className="screen__frame cut" data-kind="product">
            <Image
              className="screen--light"
              src="/images/screens/verdict-light.webp"
              alt=""
              width={1440}
              height={1080}
              sizes="(max-width: 960px) 100vw, 760px"
            />
            <Image
              className="screen--dark"
              src="/images/screens/verdict-dark.webp"
              alt=""
              width={1440}
              height={1080}
              sizes="(max-width: 960px) 100vw, 760px"
            />
          </div>
          <figcaption>The verdict for zod vs yup, weighted across four categories.</figcaption>
        </figure>
      </Container>
    </Section>
  )
}
