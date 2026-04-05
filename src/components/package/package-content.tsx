import { getPackageDetails } from "@/services/aggregator/package-details"
import { PackageHero } from "@/components/package/package-hero"
import { StatsGrid } from "@/components/package/stats-grid"
import { DownloadsChart } from "@/components/package/downloads-chart"
import { PackageMetadata } from "@/components/package/package-metadata"
import { BundleDetails } from "@/components/package/bundle-details"
import { notFound } from "next/navigation"

interface PackageContentProps {
  params: Promise<{ name: string }>
}

export async function PackageContent({ params }: PackageContentProps) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)

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