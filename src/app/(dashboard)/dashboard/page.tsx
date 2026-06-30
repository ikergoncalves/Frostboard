import type { Metadata } from "next";

import {
  customers,
  kpis,
  monthlyRevenue,
  transactions,
  type MonthlyRevenue,
} from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/format";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { PlanDistribution } from "@/components/dashboard/PlanDistribution";
import { TopCustomersTable } from "@/components/dashboard/TopCustomersTable";

export const metadata: Metadata = {
  title: "Overview · Frostboard",
};

const round1 = (value: number): number => Math.round(value * 10) / 10;

/** Net new logos last month as a share of the active base. */
function activeCustomerDelta(): number | undefined {
  const latest = monthlyRevenue.at(-1);
  if (!latest) return undefined;
  const net = latest.newCustomers - latest.churnedCustomers;
  return round1((net / kpis.activeCustomers) * 100);
}

/** Change in churn rate (percentage points) vs. the prior three-month window. */
function churnRateDelta(): number | undefined {
  const recent = monthlyRevenue.slice(-3);
  const prior = monthlyRevenue.slice(-6, -3);
  if (recent.length < 3 || prior.length < 3) return undefined;

  const avgChurn = (series: readonly MonthlyRevenue[]): number =>
    series.reduce((sum, month) => sum + month.churnedCustomers, 0) / series.length;
  const toRate = (count: number): number => (count / kpis.activeCustomers) * 100;

  return round1(toRate(avgChurn(recent)) - toRate(avgChurn(prior)));
}

export default function DashboardPage() {
  return (
    <div className="fb-dashboard-grid">
      <div className="fb-kpi-grid">
        <KpiCard
          label="MRR"
          value={formatCurrency(kpis.totalMRR)}
          delta={kpis.mrrGrowth}
          deltaLabel="vs last month"
        />
        <KpiCard
          label="Active customers"
          value={formatNumber(kpis.activeCustomers)}
          delta={activeCustomerDelta()}
          deltaLabel="vs last month"
        />
        <KpiCard
          label="Churn rate"
          value={`${kpis.churnRate}%`}
          delta={churnRateDelta()}
          deltaLabel="vs last month"
          invertDelta
        />
        <KpiCard label="ARR" value={formatCurrency(kpis.totalARR)} />
      </div>

      <RevenueChart />

      <div className="fb-dashboard-row">
        <RecentActivity transactions={transactions} />
        <PlanDistribution customers={customers} />
      </div>

      <TopCustomersTable customers={customers} />
    </div>
  );
}
