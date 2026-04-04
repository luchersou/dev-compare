import { BackgroundEffects } from "@/components/layout/background-effects"
import { PackageHero } from "@/components/package/package-hero"
import { StatsGrid } from "@/components/package/stats-grid"
import { getPackageDetails } from "@/services/aggregator/package-details"
import { notFound } from "next/navigation"

interface PackagePageProps {
  params: Promise<{ name: string }>
}

export default async function PackagePage({ params }: PackagePageProps) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)

  let pkg

  try {
    pkg = await getPackageDetails(decodedName)
  } catch {
    notFound()
  }

  return (
    <main>
        <BackgroundEffects />
      <PackageHero pkg={pkg} />
      <StatsGrid pkg={pkg} />
    </main>
  )
}

export async function generateMetadata({ params }: PackagePageProps) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)

  try {
    const pkg = await getPackageDetails(decodedName)
    return {
      title: `${pkg.name} — npmview`,
      description: pkg.description,
    }
  } catch {
    return {
      title: "Package not found — npmview",
    }
  }
}