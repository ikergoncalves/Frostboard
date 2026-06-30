"use client";

import { Spinner } from "chiselui";

/**
 * Route-level loading UI for the dashboard segment. Needs `"use client"`:
 * chiselui ships without `"use client"` directives, so importing a component
 * from it into a Server Component would break the server module graph.
 */
export default function Loading() {
  return (
    <div className="fb-loading-page">
      <Spinner size="lg" />
    </div>
  );
}
