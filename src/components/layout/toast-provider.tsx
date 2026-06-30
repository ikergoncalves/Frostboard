"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

/**
 * SSR-safe toast system for Frostboard.
 *
 * chiselui's own `ToastProvider` renders its portal into `document.body`
 * unconditionally during render, which throws (`document is not defined`) when
 * Next.js statically prerenders the dashboard. This provider mirrors chiselui's
 * queue behaviour and reuses its `chs-toast*` CSS (loaded via `styles.css`) for
 * a native look, but only mounts the portal after hydration — so the context is
 * available during SSR (where `useToast` is called) while the portal is not.
 */

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  /** The text shown in the toast. */
  message: string;
  /** Semantic style of the toast. */
  variant: ToastVariant;
  /** Auto-dismiss delay in ms. Pass 0 to keep it until dismissed. @default 4000 */
  duration?: number;
}

interface ToastContextValue {
  /** Enqueue a toast. */
  toast: (options: ToastOptions) => void;
}

interface QueuedToast {
  id: number;
  message: string;
  variant: ToastVariant;
  leaving: boolean;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/** Fallback auto-dismiss delay, matching chiselui's default. */
const DEFAULT_DURATION = 4000;
/** Time allowed for the fade-out animation before the toast is removed. */
const LEAVE_DURATION = 200;

const toastIcons: Record<ToastVariant, ReactNode> = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l9 16H3L12 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 10v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

export function AppToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<QueuedToast[]>([]);
  const [mounted, setMounted] = useState(false);
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    setMounted(true);
    // `timers.current` is a stable array reference (only ever pushed to), so the
    // snapshot captured here is the same array the cleanup clears on unmount.
    const pending = timers.current;
    return () => {
      pending.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((current) =>
      current.map((item) => (item.id === id ? { ...item, leaving: true } : item)),
    );
    const timer = window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, LEAVE_DURATION);
    timers.current.push(timer);
  }, []);

  const toast = useCallback(
    ({ message, variant, duration }: ToastOptions) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, message, variant, leaving: false }]);

      const ttl = duration ?? DEFAULT_DURATION;
      if (ttl > 0) {
        const timer = window.setTimeout(() => dismiss(id), ttl);
        timers.current.push(timer);
      }
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div className="chs-toast-region" role="status" aria-live="polite">
            {toasts.map((item) => (
              <div
                key={item.id}
                className={`chs-toast chs-toast--${item.variant}${
                  item.leaving ? " chs-toast--leaving" : ""
                }`}
              >
                <span className="chs-toast__icon">{toastIcons[item.variant]}</span>
                <span className="chs-toast__message">{item.message}</span>
                <button
                  type="button"
                  className="chs-toast__close"
                  aria-label="Dismiss notification"
                  onClick={() => dismiss(item.id)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

/**
 * Access the toast queue from anywhere under `AppToastProvider` (mounted in the
 * dashboard layout). Mirrors chiselui's `useToast` signature.
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within an AppToastProvider.");
  }
  return context;
}
