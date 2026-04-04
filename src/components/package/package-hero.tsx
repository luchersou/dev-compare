"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCompareStore } from "@/store/compare.store"
import type { PackageDetails } from "@/types/global"
import { GithubIcon } from "../shared/icons"
import {
  ExternalLink,
  Plus,
  Check,
  Scale,
  User,
  GitBranch,
  Container,
} from "lucide-react"
import Link from "next/link"

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
    <section className="border-b bg-muted/30 py-8 md:py-12">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{pkg.name}</span>
        </nav>

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Left: Info */}
          <div className="flex flex-col gap-3 min-w-0">
            {/* Name + badges */}
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold font-mono tracking-tight md:text-3xl">
                {pkg.name}
              </h1>
              {pkg.version && (
                <Badge variant="secondary" className="font-mono text-xs shrink-0">
                  v{pkg.version}
                </Badge>
              )}
              {pkg.license && (
                <Badge variant="outline" className="gap-1 text-xs shrink-0">
                  <Scale className="size-3" />
                  {pkg.license}
                </Badge>
              )}
            </div>

            {/* Description */}
            {pkg.description && (
              <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                {pkg.description}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {pkg.author && (
                <span className="flex items-center gap-1.5">
                  <User className="size-3.5 shrink-0" />
                  {pkg.author}
                </span>
              )}

              {pkg.author && (pkg.github?.url || pkg.homepage) && (
                <Separator orientation="vertical" className="h-4 hidden sm:block" />
              )}

              {pkg.github?.url && (
                <a
                  href={pkg.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <GithubIcon className="size-3.5 shrink-0" />
                  GitHub
                  <ExternalLink className="size-3" />
                </a>
              )}

              <a
                href={`https://www.npmjs.com/package/${pkg.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <GitBranch className="size-3.5 shrink-0" />
                npm
                <ExternalLink className="size-3" />
              </a>

              {pkg.homepage && (
                <a
                  href={pkg.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <ExternalLink className="size-3.5 shrink-0" />
                  Homepage
                </a>
              )}
            </div>
          </div>

          {/* Right: Compare button */}
          <div className="shrink-0">
            <Button
              onClick={handleCompare}
              disabled={isDisabled}
              variant={isSelected ? "default" : "outline"}
              className="w-full md:w-auto gap-2"
            >
              {isSelected ? (
                <>
                  <Check className="size-4" />
                  Added to compare
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Add to compare
                </>
              )}
            </Button>
            {isDisabled && (
              <p className="text-xs text-muted-foreground mt-2 text-center md:text-right">
                Remove a package to add another
              </p>
            )}
          </div>
        </div>
      </Container>      
    </section>
  )
}