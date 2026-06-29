import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports · Frostboard",
};

export default function ReportsPage() {
  return (
    <div>
      <h1
        style={{
          color: "var(--color-neutral-900)",
          marginBottom: "var(--space-2)",
        }}
      >
        Reports
      </h1>
      <p style={{ color: "var(--color-neutral-500)" }}>
        Generated reports — coming in a later phase.
      </p>
    </div>
  );
}
