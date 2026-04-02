import { NextResponse } from "next/server"
import { getPackageDetails } from "@/services/aggregator/package-details"
import { POPULAR_PACKAGES } from "@/config/popular"

export async function GET() {
  try {
    const results = await Promise.allSettled(
      POPULAR_PACKAGES.map((name) => getPackageDetails(name))
    )

    const packages = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => (r as PromiseFulfilledResult<Awaited<ReturnType<typeof getPackageDetails>>>).value)

    return NextResponse.json(packages)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch popular packages" },
      { status: 500 }
    )
  }
}