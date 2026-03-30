import { NextResponse } from "next/server";
import { NpmSearchResult } from "@/types/npm";

const BASE_NPM = "https://registry.npmjs.org/-/v1/search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json<NpmSearchResult[]>([]);
  }

  try {
    const res = await fetch(`${BASE_NPM}?text=${query}&size=10`);

    if (!res.ok) {
      return NextResponse.json<NpmSearchResult[]>([]);
    }

    const data = await res.json();

    const results: NpmSearchResult[] = data.objects.map((item: any) => ({
      name: item.package.name,
      description: item.package.description, 
      version: item.package.version,
    }));

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json<NpmSearchResult[]>([]);
  }
}