"use client"

import { Check, Plus } from "lucide-react"
import Link from "next/link"

import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { packageHref } from "@/lib/routes"
import { formatDownloads, formatSize, formatStars } from "@/lib/utils"
import { useCompareStore } from "@/store/compare.store"
import type { PackageSummary } from "@/types/global"

const MOBILE_VISIBLE_LIMIT = 6

interface PopularPackagesProps {
  data: PackageSummary[]
}

export function PopularPackages({ data }: PopularPackagesProps) {
  const { packages, addPackage, removePackage } = useCompareStore()

  return (
    <Section labelledBy="packages-title">
      <Container>
        <div className="head-block">
          <h2 id="packages-title">Essential packages</h2>
          <p className="lead">
            The most used packages in the JavaScript ecosystem, hand-picked for you to explore and compare.
          </p>
        </div>

        <table className="index">
          <thead>
            <tr>
              <th scope="col">Package</th>
              <th scope="col" className="hide-md">Version</th>
              <th scope="col" className="num-col">Weekly</th>
              <th scope="col" className="num-col hide-sm">Gzip</th>
              <th scope="col" className="num-col hide-md">Stars</th>
              <th scope="col"><span className="visually-hidden">Compare</span></th>
            </tr>
          </thead>
          <tbody>
            {data.map((pkg, index) => {
              const isSelected = packages.includes(pkg.name)
              const isFull = !isSelected && packages.length >= 2
              return (
                <tr
                  key={pkg.name}
                  data-selected={isSelected}
                  data-mobile-hidden={index >= MOBILE_VISIBLE_LIMIT}
                >
                  <td>
                    <div className="index__pkg">
                      <Link href={packageHref(pkg.name)} className="link">{pkg.name}</Link>
                      <span>{pkg.description ?? "No description available."}</span>
                    </div>
                  </td>
                  <td className="index__version hide-md">{pkg.version ?? "—"}</td>
                  <td className="index__fig">{formatDownloads(pkg.weeklyDownloads || null)}</td>
                  <td className="index__fig hide-sm">{formatSize(pkg.gzipSize || null)}</td>
                  <td className="index__fig hide-md">{pkg.stars ? formatStars(pkg.stars) : "—"}</td>
                  <td>
                    <button
                      type="button"
                      className="key key--sm key--icon"
                      aria-pressed={isSelected}
                      disabled={isFull}
                      aria-label={isSelected ? `Remove ${pkg.name} from compare` : `Add ${pkg.name} to compare`}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()

                        if (packages.includes(pkg.name)) removePackage(pkg.name)
                        else addPackage(pkg.name)
                      }}
                    >
                      {isSelected ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Container>
    </Section>
  )
}
