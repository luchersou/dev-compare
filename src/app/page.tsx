import { HowItWorks } from "@/components/home/how-it-works"
import { PopularComparisons } from "@/components/home/popular-comparisons"
import { PopularPackages } from "@/components/home/popular-packages"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/layout/hero"
import { fetchPopularComparisons } from "@/services/aggregator/popular-comparisons"
import { fetchPopularPackages } from "@/services/aggregator/package-summary"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "DevCompare — Compare npm packages",
}

export default async function Home() {
  const [comparisons, packages] = await Promise.all([
    fetchPopularComparisons(),
    fetchPopularPackages(),
  ]);

  return (
    <main className="relative">
      <Hero />
      <PopularPackages data={packages} />
      <PopularComparisons data={comparisons} />
      <HowItWorks />
      <Footer />
    </main>
  );
}