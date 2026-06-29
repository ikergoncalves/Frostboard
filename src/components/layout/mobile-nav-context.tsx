"use client";

import { createContext, useContext, useMemo, useState } from "react";

interface MobileNavContextValue {
  /** Whether the sidebar drawer is open on small viewports. */
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const MobileNavContext = createContext<MobileNavContextValue | null>(null);

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const value = useMemo<MobileNavContextValue>(
    () => ({ open, setOpen, toggle: () => setOpen((o) => !o) }),
    [open],
  );

  return (
    <MobileNavContext.Provider value={value}>
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNav(): MobileNavContextValue {
  const context = useContext(MobileNavContext);
  if (context === null) {
    throw new Error("useMobileNav must be used within a MobileNavProvider");
  }
  return context;
}
