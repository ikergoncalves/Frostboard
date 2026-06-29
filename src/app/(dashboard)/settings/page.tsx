import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings · Frostboard",
};

export default function SettingsPage() {
  return (
    <div>
      <h1
        style={{
          color: "var(--color-neutral-900)",
          marginBottom: "var(--space-2)",
        }}
      >
        Settings
      </h1>
      <p style={{ color: "var(--color-neutral-500)" }}>
        Workspace settings — coming in a later phase.
      </p>
    </div>
  );
}
