"use client"

import { motion } from "motion/react"
import { TrendingUp } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { PackageCard } from "@/components/home/package-card"
import type { PackageSummary } from "@/types/global"
import { useCompareStore } from "@/store/compare.store"

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

interface PopularPackagesProps {
  data: PackageSummary[]
}

export function PopularPackages({ data }: PopularPackagesProps) {
  const { packages, addPackage, removePackage } = useCompareStore()
  
  return (
    <Section>
      <Container>
        <motion.div
          className="mb-10 flex flex-col gap-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              this week
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
          >
            Trending packages
          </motion.h2>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-sm text-muted-foreground max-w-md"
          >
            Most downloaded packages on npm in the last 7 days.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          <motion.div
            className="contents"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.08 }}
          >
            {data.map((pkg) => (
              <motion.div
                key={pkg.name}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <PackageCard
                  name={pkg.name}
                  version={pkg.version ?? "—"}
                  description={pkg.description ?? "No description available."}
                  weeklyDownloads={pkg.weeklyDownloads ?? 0}
                  gzipSize={pkg.gzipSize ?? 0}
                  stars={pkg.stars ?? 0}
                  isSelected={packages.includes(pkg.name)}
                  onAddToCompare={() =>
                    packages.includes(pkg.name)
                      ? removePackage(pkg.name)
                      : addPackage(pkg.name)
                  }
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}