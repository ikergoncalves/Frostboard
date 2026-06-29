import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics · Frostboard",
};

export default function AnalyticsPage() {
  return (
    <div>
      <h1
        style={{
          color: "var(--color-neutral-900)",
          marginBottom: "var(--space-2)",
        }}
      >
        Analytics
      </h1>
      <p style={{ color: "var(--color-neutral-500)" }}>
        Traffic and engagement analytics — coming in a later phase.
      </p>
    </div>
  );
}
