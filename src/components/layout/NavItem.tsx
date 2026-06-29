"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge, Tooltip, type BadgeVariant } from "chiselui";

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: BadgeVariant;
  collapsed?: boolean;
  /** Called after the link is activated — used to close the mobile drawer. */
  onNavigate?: () => void;
}

export function NavItem({
  href,
  label,
  icon,
  badge,
  badgeVariant = "danger",
  collapsed,
  onNavigate,
}: NavItemProps) {
  const pathname = usePathname();
  // The Overview root is only active on an exact match; the deeper sections light
  // up whenever the current path sits underneath them.
  const isActive =
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={[
        "fb-nav-item",
        isActive ? "fb-nav-item--active" : "",
        collapsed ? "fb-nav-item--collapsed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="fb-nav-item__icon" aria-hidden="true">
        {icon}
      </span>
      {!collapsed && (
        <>
          <span className="fb-nav-item__label">{label}</span>
          {badge && (
            <span className="fb-nav-item__badge">
              <Badge variant={badgeVariant} size="sm">
                {badge}
              </Badge>
            </span>
          )}
        </>
      )}
    </Link>
  );

  // Collapsed rail hides the label, so surface it as a tooltip on hover/focus.
  if (collapsed) {
    return (
      <Tooltip content={label} placement="right">
        {link}
      </Tooltip>
    );
  }

  return link;
}
