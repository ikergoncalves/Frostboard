"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  DataTable,
  Progress,
  Switch,
  Tabs,
  type BadgeVariant,
  type DataTableColumn,
  type ProgressColor,
  type TabItem,
} from "chiselui";

import { transactions, type TransactionStatus } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";

type InvoiceRow = {
  id: string;
  date: string;
  amount: number;
  status: TransactionStatus;
};

const statusVariant: Record<TransactionStatus, BadgeVariant> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
};

const invoiceColumns: DataTableColumn<InvoiceRow>[] = [
  { key: "id", header: "Invoice #", sortable: true },
  {
    key: "date",
    header: "Date",
    sortable: true,
    render: (_value, row) => formatDate(row.date),
  },
  {
    key: "amount",
    header: "Amount",
    sortable: true,
    render: (_value, row) => (
      <span className="fb-cell-amount">{formatCurrency(row.amount)}</span>
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
];

const invoices: InvoiceRow[] = transactions.map((txn, index) => ({
  id: `INV-2026-${String(index + 1).padStart(4, "0")}`,
  date: txn.date,
  amount: txn.amount,
  status: txn.status,
}));

interface UsageMeter {
  label: string;
  detail: string;
  value: number;
  color: ProgressColor;
}

const usage: readonly UsageMeter[] = [
  { label: "API calls", detail: "8,432 / 10,000", value: 84, color: "primary" },
  { label: "Team members", detail: "4 / 5", value: 80, color: "primary" },
  { label: "Storage", detail: "2.1 GB / 5 GB", value: 42, color: "success" },
];

export function BillingView() {
  const [autoRenew, setAutoRenew] = useState(true);

  const tabs: TabItem[] = [
    {
      id: "invoices",
      label: "Invoices",
      content: (
        <div className="fb-card">
          <DataTable<InvoiceRow>
            columns={invoiceColumns}
            data={invoices}
            pageSize={8}
            emptyMessage="No invoices yet."
          />
        </div>
      ),
    },
    {
      id: "payment",
      label: "Payment methods",
      content: (
        <div className="fb-card">
          <div className="fb-payment-card">
            <div className="fb-payment-card__info">
              <span className="fb-card-brand">VISA</span>
              <div className="fb-setting-row__text">
                <span className="fb-setting-row__title">Visa •••• 4242</span>
                <span className="fb-setting-row__desc">Expires 09/27</span>
              </div>
            </div>
            <Button variant="secondary">Add payment method</Button>
          </div>
        </div>
      ),
    },
    {
      id: "usage",
      label: "Usage",
      content: (
        <div className="fb-stack">
          <div className="fb-card">
            <div className="fb-card__header">
              <h3 className="fb-card__title">This billing period</h3>
            </div>
            <div className="fb-usage-list">
              {usage.map((meter) => (
                <div key={meter.label} className="fb-usage-row">
                  <div className="fb-usage-row__head">
                    <span className="fb-usage-row__label">{meter.label}</span>
                    <span className="fb-usage-row__value">{meter.detail}</span>
                  </div>
                  <Progress value={meter.value} color={meter.color} showLabel />
                </div>
              ))}
            </div>
          </div>

          <div className="fb-card">
            <div className="fb-setting-row">
              <div className="fb-setting-row__text">
                <span className="fb-setting-row__title">Auto-renewal</span>
                <span className="fb-setting-row__desc">
                  Automatically renew your subscription each billing cycle.
                </span>
              </div>
              <Switch
                checked={autoRenew}
                onChange={setAutoRenew}
                label={autoRenew ? "On" : "Off"}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fb-stack">
      <div className="fb-page-header">
        <div>
          <h1 className="fb-page-title">Billing</h1>
          <p className="fb-page-subtitle">
            Manage your subscription, payment methods and invoices
          </p>
        </div>
      </div>

      <div className="fb-summary-grid">
        <div className="fb-card">
          <span className="fb-stat-card__label">Next charge</span>
          <span className="fb-stat-card__value">$99</span>
          <span className="fb-stat-card__meta">Pro Plan · Jul 28, 2026</span>
        </div>
        <div className="fb-card">
          <span className="fb-stat-card__label">Payment method</span>
          <span className="fb-stat-card__value">Visa •••• 4242</span>
          <span className="fb-stat-card__meta">Expires 09/27</span>
        </div>
        <div className="fb-card">
          <span className="fb-stat-card__label">Subscription</span>
          <span className="fb-stat-card__value">
            <Badge variant="success" dot>
              Active
            </Badge>
          </span>
          <span className="fb-stat-card__meta">Renews monthly</span>
        </div>
      </div>

      <Tabs items={tabs} defaultActiveId="invoices" />
    </div>
  );
}
