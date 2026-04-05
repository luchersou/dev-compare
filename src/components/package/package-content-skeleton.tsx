import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

function PackageHeroSkeleton() {
  return (
    <section className="px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-5xl flex flex-col gap-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-2" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Name + badges + button */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-72" />
              <Skeleton className="h-3 w-52" />
            </div>

            {/* Links */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          {/* Add to compare button */}
          <Skeleton className="h-9 w-36 rounded-lg shrink-0 hidden md:block" />
        </div>
      </div>
    </section>
  )
}

function StatsGridSkeleton() {
  const cards = Array.from({ length: 8 })

  return (
    <section className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-5xl flex flex-col gap-4">

        {/* STATS label */}
        <Skeleton className="h-3 w-10" />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {cards.map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-2.5 w-24" />
                  <Skeleton className="h-3.5 w-3.5 rounded-sm" />
                </div>
                <Skeleton className="h-7 w-20" />
                {/* subtitle */}
                {i === 3 || i === 7 ? (
                  <Skeleton className="h-2.5 w-16" />
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PackageContentSkeleton() {
  return (
    <>
      <PackageHeroSkeleton />
      <StatsGridSkeleton />
    </>
  )
}