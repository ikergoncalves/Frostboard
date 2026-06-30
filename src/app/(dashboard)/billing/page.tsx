import type { Metadata } from "next";

import { BillingView } from "./BillingView";

export const metadata: Metadata = {
  title: "Billing · Frostboard",
};

export default function BillingPage() {
  return <BillingView />;
}
