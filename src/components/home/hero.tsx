"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";

import { SearchBar } from "@/components/search/search-bar";
import { compareHref } from "@/lib/routes";
import type { ComparisonCardData } from "@/types/compare";

import { type FieldLane, HeroField } from "./hero-field";

interface HeroProps {
  comparisons: ComparisonCardData[];
}

export function Hero({ comparisons }: HeroProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const calmRefs = useMemo(() => [textRef, captionRef], []);
  const lanes = useMemo<FieldLane[]>(
    () =>
      comparisons.map(({ pair, a, b }) => ({
        a: pair.a,
        b: pair.b,
        aDownloads: a.downloads,
        bDownloads: b.downloads,
      })),
    [comparisons]
  );
  const sample = comparisons[0]?.pair;

  return (
    <section className="hero" aria-labelledby="hero-head">
      <HeroField lanes={lanes} calmRefs={calmRefs} />

      <div className="container hero__inner">
        <div className="hero__text" ref={textRef}>
          <h1 id="hero-head">Compare npm packages with confidence</h1>
          <p className="lead">
            Real downloads, bundle size and GitHub activity, side by side.
          </p>
          <div className="hero__actions">
            <SearchBar />
            {sample && (
              <Link href={compareHref(sample.a, sample.b)} className="key">
                Try {sample.a} vs {sample.b}
              </Link>
            )}
          </div>
        </div>
      </div>

      <p className="hero__caption" ref={captionRef}>
        Each lane is a popular comparison; glyph density follows its real weekly downloads.
      </p>
    </section>
  );
}
