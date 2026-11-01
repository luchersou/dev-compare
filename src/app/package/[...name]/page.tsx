import { Suspense } from "react"

import { PackageContent } from "@/components/package/package-content"
import { PackageContentSkeleton } from "@/components/package/package-content-skeleton"
import { packageHref, packageNameFromSegments } from "@/lib/routes"
import { getPackageDetails } from "@/services/queries/package-details"

interface PackagePageProps {
  params: Promise<{ name: string[] }>
}

export default function PackagePage({ params }: PackagePageProps) {
  return (
    <main id="main" className="pkg-page">
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
    const image = `/api/og?${new URLSearchParams({ name: pkg.name })}`
    const description = pkg.description ?? `Downloads, bundle size and GitHub stats for ${pkg.name}.`

    return {
      title: pkg.name,
      description,
      alternates: { canonical: packageHref(pkg.name) },
      openGraph: { title: pkg.name, description, url: packageHref(pkg.name), images: [image] },
      twitter: { title: pkg.name, description, images: [image] },
    }
  } catch {
    return { title: "Package not found" }
  }
}
