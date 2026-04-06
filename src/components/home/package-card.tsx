import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Download, Plus, Star, Weight } from "lucide-react"
import { formatDownloads, formatSize, formatStars } from "@/lib/utils"
import { generateIconColor } from "@/lib/utils"

interface PackageCardProps {
  name: string
  version: string
  description: string
  weeklyDownloads: number
  gzipSize: number
  stars: number
  href: string
  onAddToCompare?: () => void
  isSelected?: boolean
}

function PackageIcon({ name }: { name: string }) {
  const color = generateIconColor(name)
  const initials = name.replace(/^@[^/]+\//, "").slice(0, 2).toUpperCase()

  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  )
}

export function PackageCard({
  name,
  version,
  description,
  weeklyDownloads,
  gzipSize,
  stars,
  href,
  onAddToCompare,
  isSelected = false,
}: PackageCardProps) {
  return (
    <Card className={`flex flex-col transition-colors h-full hover:bg-accent/30 ${isSelected ? "border-primary" : ""}`}>

      <CardHeader className="pb-3">
        <Link
          href={href}
          className="flex items-start gap-3 group w-fit"
        >
          <PackageIcon name={name} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-foreground truncate group-hover:text-primary group-hover:underline transition-colors">
                {name}
              </span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              v{version}
            </span>
          </div>
        </Link>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1 justify-between">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Download className="h-3 w-3" />
              <span className="text-xs">weekly</span>
            </div>
            <span className="font-mono text-sm font-medium text-foreground">
              {formatDownloads(weeklyDownloads)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Weight className="h-3 w-3" />
              <span className="text-xs">gzip</span>
            </div>
            <span className="font-mono text-sm font-medium text-foreground">
              {formatSize(gzipSize)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-3 w-3" />
              <span className="text-xs">stars</span>
            </div>
            <span className="font-mono text-sm font-medium text-foreground">
              {formatStars(stars)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border">
        <Button
          size="sm"
          variant={isSelected ? "secondary" : "outline"}
          className="gap-1.5 text-xs w-full"
          onClick={onAddToCompare}
        >
          <Plus className="h-3 w-3" />
          {isSelected ? "Added" : "Compare"}
        </Button>
      </CardFooter>
    </Card>
  )
}