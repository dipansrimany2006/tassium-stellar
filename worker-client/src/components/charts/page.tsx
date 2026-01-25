"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartData = [
  { month: "Jan", earnings: 186 },
  { month: "Feb", earnings: 305 },
  { month: "Mar", earnings: 237 },
  { month: "Apr", earnings: 73 },
  { month: "May", earnings: 209 },
  { month: "Jun", earnings: 214 },
  { month: "Jan", earnings: 186 },
  { month: "Feb", earnings: 305 },
  { month: "Mar", earnings: 237 },
  { month: "Apr", earnings: 73 },
  { month: "May", earnings: 209 },
  { month: "Jun", earnings: 214 },
  { month: "Jan", earnings: 186 },
  { month: "Feb", earnings: 305 },
  { month: "Mar", earnings: 237 },
  { month: "Apr", earnings: 73 },
  { month: "May", earnings: 209 },
  { month: "Jun", earnings: 214 },
  { month: "Jan", earnings: 186 },
  { month: "Feb", earnings: 305 },
  { month: "Mar", earnings: 237 },
  { month: "Apr", earnings: 73 },
  { month: "May", earnings: 209 },
  { month: "Jun", earnings: 214 },
];

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "#ffffff",
  },
} satisfies ChartConfig;

export function ChartArea() {
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
              dataKey="month"
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
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="earnings" fill="#ffffff" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
