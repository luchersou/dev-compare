import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PackageDetails } from "@/types/global"
import {
  Scale,
  Calendar,
  Globe,
  Package,
  User,
} from "lucide-react"
import Link from "next/link"
import { GithubIcon } from "@/components/shared/icons"

const accentColors = [
  "var(--gradient-accent-1)",
  "var(--gradient-accent-2)",
  "var(--gradient-accent-3)",
  "var(--gradient-accent-4)",
  "var(--gradient-accent-5)",
  "var(--gradient-accent-6)",
]

interface PackageMetadataProps {
  pkg: PackageDetails
}

interface MetadataRowProps {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}

function MetadataRow({ icon, label, children }: MetadataRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <div className="text-sm font-medium break-words">{children}</div>
      </div>
    </div>
  )
}

export function PackageMetadata({ pkg }: PackageMetadataProps) {
  const depCount = pkg.dependencies ? Object.keys(pkg.dependencies).length : 0
  const hasContent =
    pkg.license ||
    pkg.publishedAt ||
    pkg.author ||
    pkg.homepage ||
    pkg.repository ||
    depCount > 0 ||
    (pkg.keywords && pkg.keywords.length > 0)

  if (!hasContent) return null

  return (
    <section className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-5xl">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Package Info</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-2">
            {pkg.license && (
              <MetadataRow icon={<Scale size={15} />} label="License">
                <Badge variant="secondary">{pkg.license}</Badge>
              </MetadataRow>
            )}

            {pkg.author && (
              <MetadataRow icon={<User size={15} />} label="Author">
                {pkg.author}
              </MetadataRow>
            )}

            {pkg.publishedAt && (
              <MetadataRow icon={<Calendar size={15} />} label="Latest release">
                {new Date(pkg.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </MetadataRow>
            )}

            {pkg.homepage && (
              <MetadataRow icon={<Globe size={15} />} label="Homepage">
                <Link
                  href={pkg.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline underline-offset-4 truncate"
                >
                  {pkg.homepage.replace(/^https?:\/\//, "")}
                </Link>
              </MetadataRow>
            )}

            {pkg.repository && (
              <MetadataRow icon={<GithubIcon />} label="Repository">
                <Link
                  href={pkg.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline underline-offset-4 truncate"
                >
                  {pkg.repository.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
                </Link>
              </MetadataRow>
            )}

            {depCount > 0 && (
              <MetadataRow icon={<Package size={15} />} label="Dependencies">
                <span className="tabular-nums">
                  {depCount} {depCount === 1 ? "dependency" : "dependencies"}
                </span>
              </MetadataRow>
            )}

            {pkg.keywords && pkg.keywords.length > 0 && (
              <MetadataRow
                icon={<span className="text-[11px] font-bold text-muted-foreground">#</span>}
                label="Keywords"
              >
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {pkg.keywords.slice(0, 12).map((kw, i) => (
                    <Badge
                      key={kw}
                      variant="outline"
                      className="text-xs font-normal"
                      style={{ borderColor: accentColors[i % accentColors.length] }}
                    >
                      {kw}
                    </Badge>
                  ))}
                </div>
              </MetadataRow>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}