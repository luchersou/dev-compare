"use client"

import { motion } from "motion/react"
import { Link, Package } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { PackageCard } from "@/components/home/popular-package-card"
import type { PackageSummary } from "@/types/global"
import { useCompareStore } from "@/store/compare.store"

const MOBILE_VISIBLE_LIMIT = 6

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

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
            <Package className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              popular
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
          >
            Essential packages
          </motion.h2>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-sm text-muted-foreground max-w-md"
          >
            The most used packages in the JavaScript ecosystem, hand-picked for you to explore and compare.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {data.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className={`h-full ${index >= MOBILE_VISIBLE_LIMIT ? "hidden sm:block" : ""}`}
            >
              <motion.div
                key={pkg.name}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className={`h-full ${index >= MOBILE_VISIBLE_LIMIT ? "hidden sm:block" : ""}`}
              >
                <PackageCard
                  name={pkg.name}
                  version={pkg.version ?? "—"}
                  description={pkg.description ?? "No description available."}
                  weeklyDownloads={pkg.weeklyDownloads ?? 0}
                  gzipSize={pkg.gzipSize ?? 0}
                  stars={pkg.stars ?? 0}
                  isSelected={packages.includes(pkg.name)}
                  onAddToCompare={(e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    packages.includes(pkg.name)
                      ? removePackage(pkg.name)
                      : addPackage(pkg.name)
                  }}
                  href={`/package/${pkg.name}`}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  )
}