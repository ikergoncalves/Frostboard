/**
 * Deterministic display formatters.
 *
 * Everything here produces identical output on the server and the client (no
 * locale- or timezone-dependent APIs), so client components that format the
 * mock data never trigger a hydration mismatch.
 */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/** Inserts thousands separators into an integer's string form. */
function group(value: number): string {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Whole-dollar amount, e.g. `$2,877`. */
export function formatCurrency(value: number): string {
  return `$${group(value)}`;
}

/** Abbreviated dollar amount for chart axes, e.g. `$36k`. */
export function formatCompactUsd(value: number): string {
  if (Math.abs(value) >= 1000) return `$${group(value / 1000)}k`;
  return `$${group(value)}`;
}

/** Plain grouped integer, e.g. `1,204`. */
export function formatNumber(value: number): string {
  return group(value);
}

/** Short UTC date, e.g. `Mar 9, 2025` — stable across runtimes. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  const month = MONTHS[date.getUTCMonth()] ?? "";
  return `${month} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}
