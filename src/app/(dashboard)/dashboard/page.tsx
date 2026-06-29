import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview · Frostboard",
};

export default function DashboardPage() {
  return (
    <div>
      <h1
        style={{
          color: "var(--color-neutral-900)",
          marginBottom: "var(--space-2)",
        }}
      >
        Overview
      </h1>
      <p style={{ color: "var(--color-neutral-500)" }}>
        Dashboard overview — coming in Phase 3.
      </p>
    </div>
  );
}
