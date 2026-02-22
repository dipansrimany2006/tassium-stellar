"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { MetricsPoint } from "@/app/(root)/page";

const chartConfig = {
  credits: {
    label: "Credits",
    color: "#ffffff",
  },
  cpu: {
    label: "CPU %",
    color: "#22c55e",
  },
  ram: {
    label: "RAM %",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

function formatTime(ts: string) {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export function ChartArea({ metrics = [] }: { metrics?: MetricsPoint[] }) {
  const chartData = metrics.map((m) => ({
    time: formatTime(m.timestamp),
    credits: m.creditsEarned,
    cpu: Math.round(m.cpuUsagePercent),
    ram: m.ramTotalGb > 0 ? Math.round((m.ramUsedGb / m.ramTotalGb) * 100) : 0,
  }));

  if (chartData.length === 0) {
    return (
      <Card className="border-2 h-full rounded-none bg-neutral-800">
        <CardContent className="p-2 flex items-center justify-center h-full">
          <p className="text-neutral-500 text-sm">No metrics data yet. Waiting for first heartbeat...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 h-full rounded-none bg-neutral-800">
      <CardContent className="p-2">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#404040"
            />
            <XAxis
              dataKey="time"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              tick={{ fill: "#a3a3a3", fontSize: 10 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#a3a3a3", fontSize: 10 }}
              width={30}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="credits" fill="#ffffff" radius={4} />
            <Bar dataKey="cpu" fill="#22c55e" radius={4} />
            <Bar dataKey="ram" fill="#3b82f6" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
