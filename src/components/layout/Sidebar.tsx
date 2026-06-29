"use client";

import { useState } from "react";
import Link from "next/link";
import type { BadgeVariant } from "chiselui";

import { NavItem } from "./NavItem";
import { useMobileNav } from "./mobile-nav-context";

// Inline, stroke-based SVG icons (20x20) — no icon library, theme-aware via
// `currentColor`.
const icons = {
  overview: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="11" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="11" width="6" height="6" rx="1" />
      <rect x="11" y="11" width="6" height="6" rx="1" />
    </svg>
  ),
  analytics: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3,14 7,9 11,12 17,5" />
      <line x1="3" y1="17" x2="17" y2="17" />
    </svg>
  ),
  customers: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="7" r="3" />
      <path d="M2 17c0-3 2.5-5 6-5s6 2 6 5" />
      <path d="M14 7c1.5 0 3 1 3 3" strokeDasharray="2 1" />
      <path d="M16 13c1.5.5 2.5 1.5 2.5 3" strokeDasharray="2 1" />
    </svg>
  ),
  billing: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <rect x="2" y="5" width="16" height="11" rx="2" />
      <line x1="2" y1="9" x2="18" y2="9" />
      <line x1="6" y1="13" x2="9" y2="13" />
    </svg>
  ),
  reports: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <rect x="4" y="2" width="12" height="16" rx="2" />
      <line x1="7" y1="7" x2="13" y2="7" />
      <line x1="7" y1="10" x2="13" y2="10" />
      <line x1="7" y1="13" x2="10" y2="13" />
    </svg>
  ),
  settings: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10" cy="10" r="3" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" />
    </svg>
  ),
  logo: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <polygon
        points="14,2 25,8 25,20 14,26 3,20 3,8"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="color-mix(in srgb, var(--color-primary) 15%, transparent)"
      />
      <polygon
        points="14,7 20,10.5 20,17.5 14,21 8,17.5 8,10.5"
        fill="var(--color-primary)"
        opacity="0.6"
      />
    </svg>
  ),
  chevronLeft: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="10,4 6,8 10,12" />
    </svg>
  ),
  chevronRight: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6,4 10,8 6,12" />
    </svg>
  ),
} as const;

interface NavConfig {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: BadgeVariant;
}

const navItems: readonly NavConfig[] = [
  { href: "/dashboard", label: "Overview", icon: icons.overview },
  { href: "/dashboard/analytics", label: "Analytics", icon: icons.analytics },
  { href: "/dashboard/customers", label: "Customers", icon: icons.customers },
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: icons.billing,
    badge: "3",
    badgeVariant: "danger",
  },
  { href: "/dashboard/reports", label: "Reports", icon: icons.reports },
  { href: "/dashboard/settings", label: "Settings", icon: icons.settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { open: mobileOpen, setOpen: setMobileOpen } = useMobileNav();

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <div
        className={[
          "fb-sidebar-overlay",
          mobileOpen ? "fb-sidebar-overlay--visible" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={closeMobile}
        aria-hidden="true"
      />

      <aside
        className={[
          "fb-sidebar",
          collapsed ? "fb-sidebar--collapsed" : "",
          mobileOpen ? "fb-sidebar--mobile-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Link href="/dashboard" className="fb-sidebar__logo" onClick={closeMobile}>
          {icons.logo}
          {!collapsed && (
            <span className="fb-sidebar__logo-text">Frostboard</span>
          )}
        </Link>

        <nav className="fb-sidebar__nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
              badgeVariant={item.badgeVariant}
              collapsed={collapsed}
              onNavigate={closeMobile}
            />
          ))}
        </nav>

        <div className="fb-sidebar__footer">
          <div className="fb-sidebar__user">
            <div className="fb-sidebar__avatar">IK</div>
            {!collapsed && (
              <div className="fb-sidebar__user-info">
                <div className="fb-sidebar__user-name">Iker Goncalves</div>
                <div className="fb-sidebar__user-role">Admin</div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="fb-sidebar__collapse-btn"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
          >
            {collapsed ? icons.chevronRight : icons.chevronLeft}
          </button>
        </div>
      </aside>
    </>
  );
}
