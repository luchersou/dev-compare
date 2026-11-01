"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Container } from "@/components/layout/container"
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
    <section className="pkg-section" aria-labelledby="chart-title">
      <Container>
        <div className="pkg-section__head">
          <h2 id="chart-title" className="pkg-section__title">Weekly downloads</h2>
          <p className="muted">Downloads per week over the last 12 months</p>
        </div>
        <figure className="chart-frame">
            <ChartContainer config={chartConfig} className="chart-frame__plot">
              <AreaChart data={history} accessibilityLayer margin={{ left: 0, right: 8 }}>
                <defs>
                  <linearGradient id="downloadsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-downloads)" style={{ stopOpacity: "var(--chart-fill-top)" }} />
                    <stop offset="100%" stopColor="var(--color-downloads)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-rule)" />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={formatMonth}
                  tick={{ fontSize: 13, fill: "var(--color-muted)" }}
                />
                <YAxis
                  tickFormatter={formatDownloads}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 13, fill: "var(--color-muted)" }}
                  width={64}
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
        </figure>
      </Container>
    </section>
  )
}
