import { Suspense } from "react"
import { PackageContent } from "@/components/package/package-content"
import { PackageContentSkeleton } from "@/components/package/package-content-skeleton"

interface PackagePageProps {
  params: Promise<{ name: string }>
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
  const decodedName = decodeURIComponent(name)

  try {
    const { getPackageDetails } = await import("@/services/queries/package-details")
    const pkg = await getPackageDetails(decodedName)
    return {
      title: `${pkg.name}`,
      description: pkg.description,
    }
  } catch {
    return { title: "Package not found" }
  }
}