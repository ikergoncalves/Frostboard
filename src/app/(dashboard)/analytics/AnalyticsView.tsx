"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Accordion,
  Badge,
  DateRangePicker,
  type AccordionItem,
  type BadgeVariant,
  type DateRange,
} from "chiselui";

import { dailyTraffic, monthlyRevenue } from "@/lib/mock-data";
import { formatDate, formatNumber } from "@/lib/format";
import { useChartColors } from "@/components/dashboard/use-chart-colors";

const tooltipContentStyle = {
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  fontSize: "var(--font-size-sm)",
  color: "var(--color-neutral-900)",
} as const;

const tooltipLabelStyle = { color: "var(--color-neutral-500)" } as const;

interface Metric {
  label: string;
  value: string;
  delta: number;
  /** When true, a falling delta is the good outcome (e.g. bounce rate). */
  invert?: boolean;
}

const sum = (values: readonly number[]): number =>
  values.reduce((total, value) => total + value, 0);

const metrics: readonly Metric[] = [
  {
    label: "Page views",
    value: formatNumber(sum(dailyTraffic.map((day) => day.pageViews))),
    delta: 12.4,
  },
  {
    label: "Unique visitors",
    value: formatNumber(sum(dailyTraffic.map((day) => day.uniqueVisitors))),
    delta: 8.1,
  },
  {
    label: "Sessions",
    value: formatNumber(sum(dailyTraffic.map((day) => day.sessions))),
    delta: 9.7,
  },
  { label: "Bounce rate", value: "42.3%", delta: -3.2, invert: true },
];

/** Drop the year so chart ticks stay compact, e.g. `Jun 5`. */
const shortDate = (iso: string): string => formatDate(iso).replace(/,\s*\d{4}$/, "");

const insights: AccordionItem[] = [
  {
    id: "traffic",
    title: "Traffic grew 22% compared to the previous period",
    content:
      "Sustained growth across the window, with the strongest gains landing on weekdays. The upward trend held even through the quieter weekend dips.",
  },
  {
    id: "mobile",
    title: "Mobile users increased to 58% of all sessions",
    content:
      "Mobile overtook desktop for the first time this period. Consider prioritising mobile performance and above-the-fold layout in the next sprint.",
  },
  {
    id: "engagement",
    title: "Highest engagement day was Wednesday",
    content:
      "Wednesdays consistently drew the most page views and the longest sessions. Scheduling product announcements mid-week should maximise reach.",
  },
];

function deltaVariant(delta: number, invert: boolean): BadgeVariant {
  const positive = invert ? delta <= 0 : delta >= 0;
  return positive ? "success" : "danger";
}

export function AnalyticsView() {
  const colors = useChartColors();
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  const traffic = [...dailyTraffic];
  const monthly = [...monthlyRevenue];

  return (
    <div className="fb-stack">
      <div className="fb-page-header">
        <div>
          <h1 className="fb-page-title">Analytics</h1>
          <p className="fb-page-subtitle">
            Traffic and engagement over the last 30 days
          </p>
        </div>
        <DateRangePicker
          startLabel="From"
          endLabel="To"
          value={range}
          onChange={setRange}
        />
      </div>

      <div className="fb-kpi-grid">
        {metrics.map((metric) => (
          <div key={metric.label} className="fb-kpi-card">
            <span className="fb-kpi-card__label">{metric.label}</span>
            <span className="fb-kpi-card__value">{metric.value}</span>
            <div className="fb-kpi-card__delta">
              <Badge
                variant={deltaVariant(metric.delta, metric.invert ?? false)}
                size="sm"
              >
                {metric.delta > 0 ? "+" : ""}
                {metric.delta}%
              </Badge>
              <span className="fb-kpi-card__delta-label">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      <div className="fb-card">
        <div className="fb-card__header">
          <h3 className="fb-card__title">Traffic</h3>
        </div>
        <div className="fb-chart">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={traffic} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
              <XAxis
                dataKey="date"
                stroke={colors.neutral}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={shortDate}
              />
              <YAxis
                stroke={colors.neutral}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={48}
                tickFormatter={formatNumber}
              />
              <RechartsTooltip
                cursor={{ stroke: colors.grid }}
                labelFormatter={(label) => shortDate(String(label))}
                formatter={(value, name) => [formatNumber(Number(value)), name]}
                contentStyle={tooltipContentStyle}
                labelStyle={tooltipLabelStyle}
              />
              <Line
                type="monotone"
                name="Page views"
                dataKey="pageViews"
                stroke={colors.primary}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                name="Unique visitors"
                dataKey="uniqueVisitors"
                stroke={colors.neutral}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="fb-card">
        <div className="fb-card__header">
          <h3 className="fb-card__title">New customers by month</h3>
        </div>
        <div className="fb-chart">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthly} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
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
                formatter={(value) => [formatNumber(Number(value)), "New customers"]}
                contentStyle={tooltipContentStyle}
                labelStyle={tooltipLabelStyle}
              />
              <Bar
                dataKey="newCustomers"
                fill={colors.primary}
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="fb-card">
        <div className="fb-card__header">
          <h3 className="fb-card__title">Insights</h3>
        </div>
        <Accordion items={insights} defaultOpenIds={["traffic"]} />
      </div>
    </div>
  );
}
