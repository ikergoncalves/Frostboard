import type { Metadata } from "next";

import { AnalyticsView } from "./AnalyticsView";

export const metadata: Metadata = {
  title: "Analytics · Frostboard",
};

export default function AnalyticsPage() {
  return <AnalyticsView />;
}
