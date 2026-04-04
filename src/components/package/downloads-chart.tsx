"use client"

import { formatDownloads } from "@/lib/utils"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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

export function DownloadsChart({ pkg }: DownloadsChartProps) {
  if (!pkg.downloads) return null

  const data = [
    { period: "Weekly", downloads: pkg.downloads.weekly },
    { period: "Monthly", downloads: pkg.downloads.monthly },
    { period: "Yearly", downloads: pkg.downloads.yearly },
  ]

  return (
    <section className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-5xl">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Downloads</CardTitle>
            <CardDescription>Weekly, monthly and yearly download counts</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full md:h-[260px]">
              <BarChart data={data} accessibilityLayer barSize={98}>
                <defs>
                  <linearGradient id="downloadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gradient-accent-1)" />
                    <stop offset="100%" stopColor="var(--gradient-accent-3)" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="1 1" />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 14 }}
                />
                <YAxis
                  tickFormatter={formatDownloads}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  width={48}
                />
                <ChartTooltip
                  cursor={{ fill: "var(--muted)", radius: 16 }}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [
                        formatDownloads(value as number),
                        "Downloads",
                      ]}
                    />
                  }
                />
                <Bar
                  dataKey="downloads"
                  fill="url(#downloadsGradient)"  
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}