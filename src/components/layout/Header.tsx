"use client";

import { usePathname } from "next/navigation";
import {
  Badge,
  Breadcrumb,
  Input,
  Popover,
  ThemeToggle,
  type BreadcrumbItem,
} from "chiselui";

import { useMobileNav } from "./mobile-nav-context";

// Human-readable labels for each path segment used in the breadcrumb trail.
const routeLabels: Record<string, string> = {
  dashboard: "Overview",
  analytics: "Analytics",
  customers: "Customers",
  billing: "Billing",
  reports: "Reports",
  settings: "Settings",
};

const searchIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <circle cx="7" cy="7" r="4.5" />
    <line x1="10.5" y1="10.5" x2="14" y2="14" />
  </svg>
);

const bellIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 2a5 5 0 0 1 5 5v3l1.5 2.5H2.5L4 10V7a5 5 0 0 1 5-5z" />
    <path d="M7 14.5a2 2 0 0 0 4 0" />
  </svg>
);

const hamburgerIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <line x1="3" y1="5" x2="15" y2="5" />
    <line x1="3" y1="9" x2="15" y2="9" />
    <line x1="3" y1="13" x2="15" y2="13" />
  </svg>
);

interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
}

const notifications: readonly Notification[] = [
  {
    id: "1",
    title: "New enterprise customer",
    desc: "Acme Corp upgraded to Enterprise plan",
    time: "2 min ago",
  },
  {
    id: "2",
    title: "Payment failed",
    desc: "Invoice #INV-0089 could not be processed",
    time: "1 hour ago",
  },
  {
    id: "3",
    title: "Churn alert",
    desc: "3 Pro accounts flagged as at-risk this week",
    time: "3 hours ago",
  },
];

const notificationPanel = (
  <div className="fb-notif">
    <div className="fb-notif__header">
      <span className="fb-notif__title">Notifications</span>
      <Badge variant="danger" size="sm">
        {String(notifications.length)}
      </Badge>
    </div>
    <div className="fb-notif-list">
      {notifications.map((notification) => (
        <div key={notification.id} className="fb-notif-item">
          <span className="fb-notif-item__title">{notification.title}</span>
          <span className="fb-notif-item__desc">{notification.desc}</span>
          <span className="fb-notif-item__time">{notification.time}</span>
        </div>
      ))}
    </div>
  </div>
);

export function Header() {
  const pathname = usePathname();
  const { toggle: toggleMobileNav } = useMobileNav();

  // Build the trail from the path, accumulating an href per segment. The
  // component renders the final crumb as the current page automatically.
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbItems: BreadcrumbItem[] = segments.map((segment, index) => ({
    label: routeLabels[segment] ?? segment,
    href: "/" + segments.slice(0, index + 1).join("/"),
  }));

  return (
    <header className="fb-header">
      <button
        type="button"
        className="fb-mobile-menu-btn"
        aria-label="Open menu"
        onClick={toggleMobileNav}
      >
        {hamburgerIcon}
      </button>

      <div className="fb-header__breadcrumb">
        {breadcrumbItems.length > 0 && <Breadcrumb items={breadcrumbItems} />}
      </div>

      <div className="fb-header__actions">
        <div className="fb-header__search">
          <Input
            type="search"
            size="sm"
            placeholder="Search..."
            aria-label="Search"
            leftAddon={searchIcon}
          />
        </div>

        <Popover
          content={notificationPanel}
          placement="bottom-end"
          trapFocus
        >
          <button
            type="button"
            className="fb-header__notif-btn"
            aria-label="Notifications"
          >
            {bellIcon}
            <span className="fb-header__notif-dot" aria-hidden="true" />
          </button>
        </Popover>

        <ThemeToggle />
      </div>
    </header>
  );
}
