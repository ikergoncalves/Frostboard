"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";

import type { Customer, Plan } from "@/lib/mock-data";
import { useChartColors } from "./use-chart-colors";

interface PlanDistributionProps {
  customers: readonly Customer[];
}

const PLAN_ORDER: readonly Plan[] = ["starter", "pro", "enterprise"];

export function PlanDistribution({ customers }: PlanDistributionProps) {
  const colors = useChartColors();

  const planColors: Record<Plan, string> = {
    starter: colors.neutral,
    pro: colors.primary,
    enterprise: colors.danger,
  };

  const counts: Record<Plan, number> = { starter: 0, pro: 0, enterprise: 0 };
  for (const customer of customers) {
    if (customer.status === "active") counts[customer.plan] += 1;
  }

  const data = PLAN_ORDER.map((plan) => ({
    name: plan.charAt(0).toUpperCase() + plan.slice(1),
    value: counts[plan],
    plan,
  }));

  return (
    <div className="fb-card">
      <div className="fb-card__header">
        <h3 className="fb-card__title">Plan distribution</h3>
      </div>
      <div className="fb-chart">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={56}
              outerRadius={84}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.plan} fill={planColors[entry.plan]} />
              ))}
            </Pie>
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--font-size-sm)",
                color: "var(--color-neutral-900)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={32}
              iconType="circle"
              formatter={(value) => (
                <span
                  style={{
                    color: "var(--color-neutral-600)",
                    fontSize: "var(--font-size-sm)",
                  }}
                >
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
