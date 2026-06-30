"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button, Tabs, type TabItem } from "chiselui";

import { monthlyRevenue } from "@/lib/mock-data";
import { formatCompactUsd, formatCurrency, formatNumber } from "@/lib/format";
import { useChartColors } from "@/components/dashboard/use-chart-colors";

const tooltipContentStyle = {
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  fontSize: "var(--font-size-sm)",
  color: "var(--color-neutral-900)",
} as const;

const tooltipLabelStyle = { color: "var(--color-neutral-500)" } as const;

const legendStyle = { fontSize: "var(--font-size-sm)", color: "var(--color-neutral-600)" } as const;

const downloadIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 2v8" />
    <path d="M4.5 7 8 10.5 11.5 7" />
    <path d="M3 13h10" />
  </svg>
);

export function ReportsView() {
  const colors = useChartColors();
  const data = [...monthlyRevenue];

  const chartCard = (title: string, body: ReactNode): ReactNode => (
    <div className="fb-card">
      <div className="fb-card__header">
        <h3 className="fb-card__title">{title}</h3>
        <Button variant="secondary" size="sm" leftIcon={downloadIcon}>
          Export CSV
        </Button>
      </div>
      <div className="fb-chart">{body}</div>
    </div>
  );

  const revenueTab = chartCard(
    "Revenue — MRR & ARR",
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
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
          yAxisId="left"
          stroke={colors.neutral}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={56}
          tickFormatter={formatCompactUsd}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke={colors.neutral}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={56}
          tickFormatter={formatCompactUsd}
        />
        <RechartsTooltip
          cursor={{ fill: "color-mix(in srgb, var(--color-primary) 8%, transparent)" }}
          formatter={(value, name) => [formatCurrency(Number(value)), name]}
          contentStyle={tooltipContentStyle}
          labelStyle={tooltipLabelStyle}
        />
        <Legend wrapperStyle={legendStyle} iconType="circle" />
        <Bar
          yAxisId="left"
          dataKey="mrr"
          name="MRR"
          fill={colors.primary}
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="arr"
          name="ARR"
          stroke={colors.danger}
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>,
  );

  const customersTab = chartCard(
    "New vs churned customers",
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barGap={4}>
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
          width={32}
          allowDecimals={false}
        />
        <RechartsTooltip
          cursor={{ fill: "color-mix(in srgb, var(--color-primary) 8%, transparent)" }}
          formatter={(value, name) => [formatNumber(Number(value)), name]}
          contentStyle={tooltipContentStyle}
          labelStyle={tooltipLabelStyle}
        />
        <Legend wrapperStyle={legendStyle} iconType="circle" />
        <Bar
          dataKey="newCustomers"
          name="New"
          fill={colors.primary}
          radius={[4, 4, 0, 0]}
          maxBarSize={18}
        />
        <Bar
          dataKey="churnedCustomers"
          name="Churned"
          fill={colors.danger}
          radius={[4, 4, 0, 0]}
          maxBarSize={18}
        />
      </BarChart>
    </ResponsiveContainer>,
  );

  const churnTab = chartCard(
    "Churned customers",
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="fb-churn-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.danger} stopOpacity={0.28} />
            <stop offset="100%" stopColor={colors.danger} stopOpacity={0} />
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
          width={32}
          allowDecimals={false}
        />
        <RechartsTooltip
          cursor={{ stroke: colors.grid }}
          formatter={(value) => [formatNumber(Number(value)), "Churned"]}
          contentStyle={tooltipContentStyle}
          labelStyle={tooltipLabelStyle}
        />
        <Area
          type="monotone"
          dataKey="churnedCustomers"
          stroke={colors.danger}
          strokeWidth={2}
          fill="url(#fb-churn-area)"
        />
      </AreaChart>
    </ResponsiveContainer>,
  );

  const tabs: TabItem[] = [
    { id: "revenue", label: "Revenue", content: revenueTab },
    { id: "customers", label: "Customers", content: customersTab },
    { id: "churn", label: "Churn", content: churnTab },
  ];

  return (
    <div className="fb-stack">
      <div className="fb-page-header">
        <div>
          <h1 className="fb-page-title">Reports</h1>
          <p className="fb-page-subtitle">
            Revenue, customer and churn trends over the last 12 months
          </p>
        </div>
      </div>

      <Tabs items={tabs} defaultActiveId="revenue" />
    </div>
  );
}
