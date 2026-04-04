import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PackageDetails } from "@/types/global"
import { PackageOpen, Zap, AlertTriangle, CheckCircle } from "lucide-react"
import { formatSize } from "@/lib/utils"

interface BundleDetailsProps {
  pkg: PackageDetails
}

function getSizeRating(gzip: number): {
  label: string
  color: string
} {
  if (gzip < 5 * 1024) return { label: "Tiny", color: "var(--gradient-accent-2)" }
  if (gzip < 20 * 1024) return { label: "Small", color: "var(--gradient-accent-1)" }
  if (gzip < 50 * 1024) return { label: "Medium", color: "var(--gradient-accent-4)" }
  return { label: "Large", color: "var(--destructive)" }
}

interface SizeCardProps {
  label: string
  icon: React.ReactNode
  bytes: number
  description: string
}

function SizeCard({ label, icon, bytes, description }: SizeCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <span className="text-2xl font-bold tabular-nums">{formatSize(bytes)}</span>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

export function BundleDetails({ pkg }: BundleDetailsProps) {
  if (!pkg.bundle) return null

  const { size, gzip, hasSideEffects, hasJSModule } = pkg.bundle
  const rating = getSizeRating(gzip)
  const compressionRatio = ((1 - gzip / size) * 100).toFixed(0)

  return (
    <section className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-5xl">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Bundle Size</CardTitle>
              <Badge
                variant="outline"
                style={{ borderColor: rating.color, color: rating.color }}
                className="text-xs font-medium"
              >
                {rating.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">

            {/* Size cards */}
            <div className="grid grid-cols-2 gap-3">
              <SizeCard
                label="Minified"
                icon={<PackageOpen size={13} />}
                bytes={size}
                description="Minified size"
              />
              <SizeCard
                label="Gzipped"
                icon={<Zap size={13} />}
                bytes={gzip}
                description={`${compressionRatio}% smaller with gzip`}
              />
            </div>

            {/* Flags */}
            {(hasSideEffects !== undefined || hasJSModule !== undefined) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {hasSideEffects !== undefined && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {hasSideEffects ? (
                      <AlertTriangle size={13} className="text-yellow-500" />
                    ) : (
                      <CheckCircle size={13} className="text-green-500" />
                    )}
                    {hasSideEffects ? "Has side effects" : "No side effects"}
                  </div>
                )}
                {hasJSModule && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle size={13} className="text-green-500" />
                    ES Module
                  </div>
                )}
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </section>
  )
}