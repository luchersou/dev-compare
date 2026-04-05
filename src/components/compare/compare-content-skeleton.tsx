import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

function CompareHeaderSkeleton() {
  return (
    <section className="px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-5xl flex flex-col gap-8">

        {/* Label */}
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="h-3 w-40" />
        </div>

        {/* Packages */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center">

          {/* Package A */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>

          {/* vs */}
          <div className="flex items-center justify-center md:mt-6">
            <Skeleton className="h-3 w-5" />
          </div>

          {/* Package B */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

function CompareStatsTableSkeleton() {
  const rows = Array.from({ length: 9 })

  return (
    <section className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-5xl">
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-12" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-4 text-left w-[40%]">
                      <Skeleton className="h-3 w-14" />
                    </th>
                    <th className="py-3 px-4 text-center">
                      <Skeleton className="h-3 w-20 mx-auto" />
                    </th>
                    <th className="py-3 px-4 text-center">
                      <Skeleton className="h-3 w-20 mx-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((_, i) => (
                    <tr
                      key={i}
                      className={`border-b border-border last:border-0 ${
                        i % 2 === 0 ? "bg-muted/20" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-3 w-3 rounded-sm" />
                          <Skeleton className="h-3 w-28" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton className="h-3 w-12 mx-auto" />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton className="h-3 w-12 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export function CompareContentSkeleton() {
  return (
    <>
      <CompareHeaderSkeleton />
      <CompareStatsTableSkeleton />
    </>
  )
}