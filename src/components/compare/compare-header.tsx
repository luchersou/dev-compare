import Link from "next/link"

import { Container } from "@/components/layout/container"
import { packageHref } from "@/lib/routes"
import { PackageDetails } from "@/types/global"

interface CompareHeaderProps {
  pkgA: PackageDetails
  pkgB: PackageDetails
}

function PackageIdentity({ pkg, side }: { pkg: PackageDetails; side: "a" | "b" }) {
  return (
    <div className={`cmp-id cmp-id--${side}`}>
      <p className="cmp-id__name">
        <Link href={packageHref(pkg.name)} className="link mono">{pkg.name}</Link>
        <span className="cmp-id__version mono">v{pkg.version}</span>
      </p>

      {pkg.description && <p className="cmp-id__desc">{pkg.description}</p>}

      {(pkg.repository || pkg.homepage) && (
        <ul className="cmp-id__links">
          {pkg.repository && (
            <li>
              <a href={pkg.repository} target="_blank" rel="noopener noreferrer" className="link">
                Repository
              </a>
            </li>
          )}
          {pkg.homepage && (
            <li>
              <a href={pkg.homepage} target="_blank" rel="noopener noreferrer" className="link">
                Homepage
              </a>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

export function CompareHeader({ pkgA, pkgB }: CompareHeaderProps) {
  return (
    <section className="cmp-hero page-top" aria-labelledby="cmp-title">
      <Container className="cmp-hero__inner">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/" className="link">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Comparing packages</span>
        </nav>

        <h1 id="cmp-title" className="cmp-hero__title">
          <span>{pkgA.name}</span>
          <span>vs</span>
          <span>{pkgB.name}</span>
        </h1>

        <div className="cmp-hero__ids">
          <PackageIdentity pkg={pkgA} side="a" />
          <PackageIdentity pkg={pkgB} side="b" />
        </div>
      </Container>
    </section>
  )
}
