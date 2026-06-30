/**
 * Re-exports chiselui's toast hook so views import feedback helpers from a
 * single, stable path (`@/hooks/useToast`). The provider is mounted in the
 * dashboard layout through a thin "use client" boundary
 * (`@/components/layout/toast-boundary`).
 */
export {
  useToast,
  type ToastOptions,
  type ToastVariant,
} from "chiselui";
