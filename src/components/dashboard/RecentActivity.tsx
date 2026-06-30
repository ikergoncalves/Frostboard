"use client";

import { Badge } from "chiselui";

import type { Transaction, TransactionStatus } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

const statusVariant: Record<TransactionStatus, "success" | "warning" | "danger"> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
};

interface RecentActivityProps {
  transactions: readonly Transaction[];
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  const recent = transactions.slice(0, 8);

  return (
    <div className="fb-card">
      <div className="fb-card__header">
        <h3 className="fb-card__title">Recent activity</h3>
      </div>
      <ul className="fb-activity-list">
        {recent.map((txn) => (
          <li key={txn.id} className="fb-activity-item">
            <div className="fb-activity-item__info">
              <span className="fb-activity-item__name">{txn.customerName}</span>
              <span className="fb-activity-item__plan">{txn.plan}</span>
            </div>
            <div className="fb-activity-item__meta">
              <span className="fb-activity-item__amount">
                {formatCurrency(txn.amount)}
              </span>
              <Badge variant={statusVariant[txn.status]} size="sm">
                {txn.status}
              </Badge>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
