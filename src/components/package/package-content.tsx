import { notFound } from "next/navigation"

import { BundleDetails } from "@/components/package/bundle-details"
import { DownloadsChart } from "@/components/package/downloads-chart"
import { PackageHero } from "@/components/package/package-hero"
import { PackageMetadata } from "@/components/package/package-metadata"
import { StatsGrid } from "@/components/package/stats-grid"
import { packageNameFromSegments } from "@/lib/routes"
import { getPackageDetails } from "@/services/queries/package-details"

interface PackageContentProps {
  params: Promise<{ name: string[] }>
}

export async function PackageContent({ params }: PackageContentProps) {
  const { name } = await params
  const decodedName = packageNameFromSegments(name)

  try {
    const pkg = await getPackageDetails(decodedName)

    return (
      <>
        <PackageHero pkg={pkg} />
        <StatsGrid pkg={pkg} />
        <DownloadsChart pkg={pkg} />
        <PackageMetadata pkg={pkg} />
        <BundleDetails pkg={pkg} />
      </>
    )
  } catch {
    notFound()
  }
}