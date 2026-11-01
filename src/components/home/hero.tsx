"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SearchBar } from "@/components/search/search-bar";
import { compareHref } from "@/lib/routes";
import type { ComparisonCardData } from "@/types/compare";

import { HeroArena } from "./hero-arena";
import type { FieldLane } from "./hero-field";

interface HeroProps {
  comparisons: ComparisonCardData[];
}

export function Hero({ comparisons }: HeroProps) {
  const [pairIndex, setPairIndex] = useState(0);
  const pairs = useMemo<FieldLane[]>(
    () =>
      comparisons.map(({ pair, a, b }) => ({
        a: pair.a,
        b: pair.b,
        aDownloads: a.downloads,
        bDownloads: b.downloads,
      })),
    [comparisons]
  );
  const sample = comparisons[pairIndex]?.pair ?? comparisons[0]?.pair;

  return (
    <section className="hero hero--stage" aria-labelledby="hero-head">
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 id="hero-head">Compare npm packages with confidence</h1>
          <p className="lead">
            Real downloads, bundle size and GitHub activity, side by side.
          </p>
          <div className="hero__cta">
            <SearchBar />
            {sample && (
              <Link href={compareHref(sample.a, sample.b)} className="key">
                Try {sample.a} vs {sample.b}
              </Link>
            )}
          </div>
        </div>

        <HeroArena pairs={pairs} onPairChange={setPairIndex} />
      </div>
    </section>
  );
}
