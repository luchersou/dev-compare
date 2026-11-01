"use client"

import { Check, Plus } from "lucide-react"
import Link from "next/link"

import { Container } from "@/components/layout/container"
import { CopyCommand } from "@/components/shared/copy-command"
import { useCompareStore } from "@/store/compare.store"
import type { PackageDetails } from "@/types/global"

interface PackageHeroProps {
  pkg: PackageDetails
}

export function PackageHero({ pkg }: PackageHeroProps) {
  const { packages, addPackage, removePackage } = useCompareStore()
  const isSelected = packages.includes(pkg.name)
  const isDisabled = !isSelected && packages.length >= 2

  function handleCompare() {
    if (isSelected) {
      removePackage(pkg.name)
    } else {
      addPackage(pkg.name)
    }
  }

  return (
    <section className="pkg-hero page-top" aria-labelledby="pkg-name">
      <Container className="pkg-hero__inner">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/" className="link">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="mono">{pkg.name}</span>
        </nav>

        <div className="pkg-hero__id">
          <h1 id="pkg-name" className="pkg-hero__name">{pkg.name}</h1>
          <p className="pkg-hero__facts">
            {pkg.version && <span className="mono">v{pkg.version}</span>}
            {pkg.license && <span>{pkg.license} license</span>}
            {pkg.author && <span>by {pkg.author}</span>}
          </p>
          {pkg.description && <p className="lead pkg-hero__desc">{pkg.description}</p>}

          <ul className="pkg-hero__links">
            {pkg.github?.url && (
              <li>
                <a href={pkg.github.url} target="_blank" rel="noopener noreferrer" className="link">
                  GitHub
                </a>
              </li>
            )}
            <li>
              <a
                href={`https://www.npmjs.com/package/${pkg.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                npm
              </a>
            </li>
            {pkg.homepage && (
              <li>
                <a href={pkg.homepage} target="_blank" rel="noopener noreferrer" className="link">
                  Homepage
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="pkg-hero__actions">
          <CopyCommand command={`npm i ${pkg.name}`} />
          <button
            type="button"
            onClick={handleCompare}
            disabled={isDisabled}
            aria-pressed={isSelected}
            className="key key--primary"
          >
            {isSelected ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
            {isSelected ? "Added to compare" : "Add to compare"}
          </button>
          {isDisabled && (
            <p className="pkg-hero__hint">Remove a package to add another</p>
          )}
        </div>
      </Container>
    </section>
  )
}
