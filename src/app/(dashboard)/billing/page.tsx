import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing · Frostboard",
};

export default function BillingPage() {
  return (
    <div>
      <h1
        style={{
          color: "var(--color-neutral-900)",
          marginBottom: "var(--space-2)",
        }}
      >
        Billing
      </h1>
      <p style={{ color: "var(--color-neutral-500)" }}>
        Invoices and subscriptions — coming in a later phase.
      </p>
    </div>
  );
}
