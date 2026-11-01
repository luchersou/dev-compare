import { notFound } from "next/navigation"

import { CompareHeader } from "@/components/compare/compare-header"
import { CompareStatsTable } from "@/components/compare/compare-stats-table"
import { CompareVerdict } from "@/components/compare/compare-verdict"
import { getPackageDetailsOrNotFound } from "@/services/queries/package-details"

import { CompareFadeSection } from "./compare-fade-section"

interface CompareContentProps {
  searchParams: Promise<{ a?: string; b?: string }>
}

export async function CompareContent({ searchParams }: CompareContentProps) {
  const { a, b } = await searchParams
  if (!a || !b) notFound()

  const [pkgA, pkgB] = await Promise.all([
    getPackageDetailsOrNotFound(a),
    getPackageDetailsOrNotFound(b),
  ])

  return (
		<>
			<CompareFadeSection delay={0}>
				<CompareHeader pkgA={pkgA} pkgB={pkgB} />
			</CompareFadeSection>
			<CompareFadeSection delay={0.12}>
				<CompareStatsTable pkgA={pkgA} pkgB={pkgB} />
			</CompareFadeSection>
			<CompareFadeSection delay={0.24}>
				<CompareVerdict pkgA={pkgA} pkgB={pkgB} />
			</CompareFadeSection>
		</>
	)
}