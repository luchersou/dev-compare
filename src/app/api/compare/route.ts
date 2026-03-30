import { NextResponse } from "next/server"
import { comparePackages } from "@/services/aggregator/compare"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 })
  }

  const [a, b] = query.split(",")

  try {
    const packages = await comparePackages(a, b)

    return NextResponse.json({ packages })
  } catch {
    return NextResponse.json(
      { error: "Compare failed" },
      { status: 500 }
    )
  }
}