import { Suspense } from "react"
import { BackgroundEffects } from "@/components/layout/background-effects"
import { PackageContent } from "@/components/package/package-content"
import { PackageContentSkeleton } from "@/components/package/package-content-skeleton"

interface PackagePageProps {
  params: Promise<{ name: string }>
}

export default function PackagePage({ params }: PackagePageProps) {
  return (
    <main>
      <BackgroundEffects />
      <Suspense fallback={<PackageContentSkeleton />}>
        <PackageContent params={params} />
      </Suspense>
    </main>
  )
}

export async function generateMetadata({ params }: PackagePageProps) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)

  try {
    const { getPackageDetails } = await import("@/services/aggregator/package-details")
    const pkg = await getPackageDetails(decodedName)
    return {
      title: `${pkg.name} — DevCompare`,
      description: pkg.description,
    }
  } catch {
    return { title: "Package not found — DevCompare" }
  }
}