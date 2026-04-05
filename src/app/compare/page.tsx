import { Suspense } from "react"
import { CompareContent } from "@/components/compare/compare-content"
import { CompareContentSkeleton } from "@/components/compare/compare-content-skeleton"

interface ComparePageProps {
  searchParams: Promise<{ a?: string; b?: string }>
}

export default function ComparePage({ searchParams }: ComparePageProps) {
  return (
    <main>
      <Suspense fallback={<CompareContentSkeleton />}>
        <CompareContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

export async function generateMetadata({ searchParams }: ComparePageProps) {
  const { a, b } = await searchParams
  if (!a || !b) return { title: "Compare packages — DevCompare" }
  return {
    title: `${a} vs ${b} — DevCompare`,
    description: `Compare ${a} and ${b} side by side. Downloads, bundle size, GitHub stats and more.`,
  }
}