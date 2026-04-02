import { HowItWorks } from "@/components/home/how-it-works";
import { PopularComparisons } from "@/components/home/popular-comparisons";
import { PopularPackages } from "@/components/home/popular-packages";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/layout/hero";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <PopularPackages />
      <PopularComparisons />
      <HowItWorks />
      <Footer />
    </>
  );
}
