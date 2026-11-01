import { Suspense } from "react"

import { PackageContent } from "@/components/package/package-content"
import { PackageContentSkeleton } from "@/components/package/package-content-skeleton"
import { packageNameFromSegments } from "@/lib/routes"
import { getPackageDetails } from "@/services/queries/package-details"

interface PackagePageProps {
  params: Promise<{ name: string[] }>
}

export default function PackagePage({ params }: PackagePageProps) {
  return (
    <main>
      <Suspense fallback={<PackageContentSkeleton />}>
        <PackageContent params={params} />
      </Suspense>
    </main>
  )
}

export async function generateMetadata({ params }: PackagePageProps) {
  const { name } = await params
  const decodedName = packageNameFromSegments(name)

  try {
    const pkg = await getPackageDetails(decodedName)
    return {
      title: `${pkg.name}`,
      description: pkg.description,
    }
  } catch {
    return { title: "Package not found" }
  }
}
