import { Metadata } from "next"

import { CloseSection } from "@/components/home/close-section"
import { DataSources } from "@/components/home/data-sources"
import { Hero } from "@/components/home/hero"
import { HowItWorks } from "@/components/home/how-it-works"
import { PopularComparisons } from "@/components/home/popular-comparisons"
import { PopularPackages } from "@/components/home/popular-packages"
import { Footer } from "@/components/layout/footer"
import { fetchPopularPackages } from "@/services/queries/package-summary"
import { fetchPopularComparisons } from "@/services/queries/popular-comparisons"

export const metadata: Metadata = {
  title: "DevCompare — Compare npm packages",
}

export default async function Home() {
  const [comparisons, packages] = await Promise.all([
    fetchPopularComparisons(),
    fetchPopularPackages(),
  ]);

  return (
    <>
      <main id="main">
        <Hero comparisons={comparisons} />
        <HowItWorks />
        <PopularComparisons data={comparisons} />
        <PopularPackages data={packages} />
        <DataSources />
        <CloseSection />
      </main>
      <Footer />
    </>
  );
}
