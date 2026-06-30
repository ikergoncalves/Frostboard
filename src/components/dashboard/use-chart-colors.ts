"use client";

import { useEffect, useState } from "react";

export interface ChartColors {
  primary: string;
  danger: string;
  neutral: string;
  grid: string;
}

/** Light-theme token values, used until the real ones are read on the client. */
const FALLBACK: ChartColors = {
  primary: "#4f46e5",
  danger: "#dc2626",
  neutral: "#9ca3af",
  grid: "#e5e7eb",
};

function readColors(): ChartColors {
  const styles = getComputedStyle(document.documentElement);
  const read = (token: string, fallback: string): string => {
    const value = styles.getPropertyValue(token).trim();
    // A token may itself be defined as `var(--other)`; that string is unusable
    // as an SVG paint, so fall back when the value isn't a concrete colour.
    return value && !value.includes("var(") ? value : fallback;
  };
  return {
    primary: read("--color-primary", FALLBACK.primary),
    danger: read("--color-danger", FALLBACK.danger),
    neutral: read("--color-neutral-400", FALLBACK.neutral),
    grid: read("--color-border", FALLBACK.grid),
  };
}

/**
 * Resolves chiselui's design tokens to concrete colour strings for Recharts.
 *
 * Recharts paints SVG presentation attributes (`stroke`, `fill`), where the
 * `var(--token)` syntax does not resolve — so we read the computed token values
 * on mount and again whenever the theme flips (`data-theme` on `<html>`).
 */
export function useChartColors(): ChartColors {
  const [colors, setColors] = useState<ChartColors>(FALLBACK);

  useEffect(() => {
    setColors(readColors());
    const root = document.documentElement;
    const observer = new MutationObserver(() => setColors(readColors()));
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return colors;
}
