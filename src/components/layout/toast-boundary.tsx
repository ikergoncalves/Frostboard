"use client";

/**
 * Client boundary for chiselui's native `ToastProvider`.
 *
 * chiselui's build ships without a "use client" directive, so importing
 * `ToastProvider` straight into the Server Component dashboard layout would trip
 * React's "useState only works in a Client Component" rule. Re-exporting it
 * through this "use client" module marks it as a client reference — the same
 * boundary pattern the project already uses for `MobileNavProvider`.
 *
 * chiselui 0.6.3 fixed the separate SSR crash on its own: the portal now mounts
 * only after hydration (mounted guard), so the previous hand-rolled provider
 * that reimplemented the toast queue is no longer needed.
 */
export { ToastProvider } from "chiselui";
