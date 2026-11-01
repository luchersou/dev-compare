import { NextResponse } from "next/server";

import { NpmSearchResult } from "@/types/npm";

interface NpmSearchResponse {
  objects: { package: NpmSearchResult }[];
}

const BASE_NPM = "https://registry.npmjs.org/-/v1/search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json<NpmSearchResult[]>([]);
  }

  try {
    const res = await fetch(`${BASE_NPM}?text=${encodeURIComponent(query)}&size=10`);

    if (!res.ok) {
      return NextResponse.json<NpmSearchResult[]>([]);
    }

    const data = (await res.json()) as NpmSearchResponse;

    const results: NpmSearchResult[] = data.objects.map((item) => ({
      name: item.package.name,
      description: item.package.description, 
      version: item.package.version,
    }));

    return NextResponse.json(results);
  } catch {
    return NextResponse.json<NpmSearchResult[]>([]);
  }
}