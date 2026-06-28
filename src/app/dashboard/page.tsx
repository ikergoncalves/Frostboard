import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard · Frostboard",
};

export default function DashboardPage() {
  return (
    <main style={{ padding: "var(--space-8)" }}>
      <h1>Dashboard</h1>
      <p style={{ color: "var(--color-neutral-500)" }}>Coming soon.</p>
    </main>
  );
}
