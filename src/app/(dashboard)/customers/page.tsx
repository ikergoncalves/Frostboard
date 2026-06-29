import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers · Frostboard",
};

export default function CustomersPage() {
  return (
    <div>
      <h1
        style={{
          color: "var(--color-neutral-900)",
          marginBottom: "var(--space-2)",
        }}
      >
        Customers
      </h1>
      <p style={{ color: "var(--color-neutral-500)" }}>
        Customer directory — coming in a later phase.
      </p>
    </div>
  );
}
