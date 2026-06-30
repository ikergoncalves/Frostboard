"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs } from "chiselui";

import { monthlyRevenue } from "@/lib/mock-data";
import { formatCompactUsd, formatCurrency, formatNumber } from "@/lib/format";
import { useChartColors } from "./use-chart-colors";

interface MetricConfig {
  id: string;
  label: string;
  dataKey: "mrr" | "arr" | "newCustomers";
  formatAxis: (value: number) => string;
  formatValue: (value: number) => string;
}

const METRICS: readonly MetricConfig[] = [
  { id: "mrr", label: "MRR", dataKey: "mrr", formatAxis: formatCompactUsd, formatValue: formatCurrency },
  { id: "arr", label: "ARR", dataKey: "arr", formatAxis: formatCompactUsd, formatValue: formatCurrency },
  { id: "customers", label: "New customers", dataKey: "newCustomers", formatAxis: formatNumber, formatValue: formatNumber },
];

export function RevenueChart() {
  const colors = useChartColors();
  const data = [...monthlyRevenue];

  const items = METRICS.map((metric) => ({
    id: metric.id,
    label: metric.label,
    content: (
      <div className="fb-chart">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`fb-area-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.primary} stopOpacity={0.28} />
                <stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
            <XAxis
              dataKey="month"
              stroke={colors.neutral}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              stroke={colors.neutral}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={56}
              tickFormatter={metric.formatAxis}
            />
            <RechartsTooltip
              cursor={{ stroke: colors.grid }}
              formatter={(value) => [metric.formatValue(Number(value)), metric.label]}
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--font-size-sm)",
                color: "var(--color-neutral-900)",
              }}
              labelStyle={{ color: "var(--color-neutral-500)" }}
            />
            <Area
              type="monotone"
              dataKey={metric.dataKey}
              stroke={colors.primary}
              strokeWidth={2}
              fill={`url(#fb-area-${metric.id})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    ),
  }));

  return (
    <div className="fb-card">
      <div className="fb-card__header">
        <h3 className="fb-card__title">Revenue</h3>
      </div>
      <Tabs items={items} defaultActiveId="mrr" />
    </div>
  );
}
