import "../styles/compare.css"

import { Suspense } from "react"

import { CompareContent } from "@/components/compare/compare-content"
import { CompareContentSkeleton } from "@/components/compare/compare-content-skeleton"
import { compareHref } from "@/lib/routes"

interface ComparePageProps {
  searchParams: Promise<{ a?: string; b?: string }>
}

export default function ComparePage({ searchParams }: ComparePageProps) {
  return (
    <main id="main" className="cmp-page">
      <Suspense fallback={<CompareContentSkeleton />}>
        <CompareContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

export async function generateMetadata({ searchParams }: ComparePageProps) {
  const { a, b } = await searchParams
  if (!a || !b) return { title: "Compare packages" }
  const title = `${a} vs ${b}`
  const description = `Compare ${a} and ${b} side by side. Downloads, bundle size, GitHub stats and more.`
  const image = `/api/og?${new URLSearchParams({ a, b })}`

  return {
    title,
    description,
    alternates: { canonical: compareHref(a, b) },
    openGraph: { title, description, url: compareHref(a, b), images: [image] },
    twitter: { title, description, images: [image] },
  }
}