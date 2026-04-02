import { Skeleton } from "@/components/ui/skeleton"

export function PackageCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border p-5">
      <div className="flex items-start gap-3">
        <Skeleton className="h-9 w-9 rounded-md" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-border">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}