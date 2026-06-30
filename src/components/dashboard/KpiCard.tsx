"use client";

import { useEffect, useState } from "react";
import { Badge, Skeleton } from "chiselui";

interface KpiCardProps {
  label: string;
  /** Pre-formatted headline value, e.g. `"$2,877"`. */
  value: string;
  /** Percentage change vs. the comparison period, e.g. `4.7` or `-2.1`. */
  delta?: number;
  deltaLabel?: string;
  /** When true, a falling delta is the good outcome (e.g. churn). */
  invertDelta?: boolean;
}

export function KpiCard({
  label,
  value,
  delta,
  deltaLabel,
  invertDelta = false,
}: KpiCardProps) {
  // Brief skeleton so the dashboard reads like a live, data-fetching product.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fb-kpi-card" aria-busy="true">
        <Skeleton width={90} height={14} />
        <Skeleton width={130} height={30} />
        <Skeleton width={72} height={20} />
      </div>
    );
  }

  return (
    <div className="fb-kpi-card">
      <span className="fb-kpi-card__label">{label}</span>
      <span className="fb-kpi-card__value">{value}</span>
      {delta !== undefined && (
        <div className="fb-kpi-card__delta">
          <Badge
            variant={(invertDelta ? delta <= 0 : delta >= 0) ? "success" : "danger"}
            size="sm"
          >
            {delta > 0 ? "+" : ""}
            {delta}%
          </Badge>
          {deltaLabel && (
            <span className="fb-kpi-card__delta-label">{deltaLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
