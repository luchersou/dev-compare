import { NextResponse } from "next/server"
import { getPackageDetails } from "@/services/aggregator/package-details"

export async function GET(
  _req: Request,
  { params }: { params: { name: string } }
) {
  try {
    const data = await getPackageDetails(params.name)

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 }
    )
  }
}