"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatDownloads } from "@/lib/utils"
import { PackageDetails } from "@/types/global"

interface DownloadsChartProps {
  pkg: PackageDetails
}

const chartConfig = {
  downloads: {
    label: "Downloads",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function formatMonth(day: string) {
  return new Date(day).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })
}

function formatWeek(day: unknown) {
  return `Week of ${new Date(String(day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })}`
}

export function DownloadsChart({ pkg }: DownloadsChartProps) {
  const history = pkg.downloads?.history
  if (!history || history.length < 2) return null

  return (
    <section className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-5xl">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Weekly downloads</CardTitle>
            <CardDescription>Downloads per week over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full md:h-[260px]">
              <AreaChart data={history} accessibilityLayer margin={{ left: 0, right: 8 }}>
                <defs>
                  <linearGradient id="downloadsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-downloads)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--color-downloads)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="1 1" />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={formatMonth}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={formatDownloads}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  width={48}
                />
                <ChartTooltip
                  cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      labelFormatter={formatWeek}
                    />
                  }
                />
                <Area
                  dataKey="downloads"
                  type="monotone"
                  stroke="var(--color-downloads)"
                  strokeWidth={2}
                  fill="url(#downloadsFill)"
                  activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--background)" }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
