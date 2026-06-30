"use client";

import { Badge, DataTable } from "chiselui";
import type { BadgeVariant, DataTableColumn } from "chiselui";

import type { Customer, CustomerStatus, Plan } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";

/**
 * Row shape for the table. A `type` alias (not the `Customer` interface) is
 * required: `DataTable`'s `T extends Record<string, unknown>` constraint accepts
 * type aliases — which carry an implicit index signature — but not interfaces.
 */
type CustomerRow = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: Plan;
  mrr: number;
  status: CustomerStatus;
  country: string;
  createdAt: string;
};

const planVariant: Record<Plan, BadgeVariant> = {
  starter: "default",
  pro: "info",
  enterprise: "success",
};

const statusVariant: Record<CustomerStatus, BadgeVariant> = {
  active: "success",
  trial: "warning",
  churned: "default",
};

const columns: DataTableColumn<CustomerRow>[] = [
  {
    key: "name",
    header: "Customer",
    sortable: true,
    render: (value, row) => (
      <div className="fb-customer-cell">
        <span className="fb-avatar">{row.avatar}</span>
        <span className="fb-customer-cell__text">
          <span className="fb-customer-cell__name">{value}</span>
          <span className="fb-customer-cell__email">{row.email}</span>
        </span>
      </div>
    ),
  },
  {
    key: "plan",
    header: "Plan",
    sortable: true,
    render: (value, row) => (
      <Badge variant={planVariant[row.plan]} size="sm">
        {value}
      </Badge>
    ),
  },
  {
    key: "mrr",
    header: "MRR",
    sortable: true,
    render: (_value, row) => (
      <span className="fb-cell-amount">{formatCurrency(row.mrr)}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (value, row) => (
      <Badge variant={statusVariant[row.status]} size="sm" dot>
        {value}
      </Badge>
    ),
  },
  { key: "country", header: "Country", sortable: true },
  {
    key: "createdAt",
    header: "Joined",
    sortable: true,
    render: (_value, row) => formatDate(row.createdAt),
  },
];

interface TopCustomersTableProps {
  customers: readonly Customer[];
}

export function TopCustomersTable({ customers }: TopCustomersTableProps) {
  const rows: CustomerRow[] = customers
    .filter((customer) => customer.status === "active")
    .sort((a, b) => b.mrr - a.mrr)
    .map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      avatar: customer.avatar,
      plan: customer.plan,
      mrr: customer.mrr,
      status: customer.status,
      country: customer.country,
      createdAt: customer.createdAt,
    }));

  return (
    <div className="fb-card">
      <div className="fb-card__header">
        <h3 className="fb-card__title">Top customers</h3>
      </div>
      <DataTable<CustomerRow>
        columns={columns}
        data={rows}
        pageSize={10}
        emptyMessage="No active customers."
      />
    </div>
  );
}
