# Frostboard

A modern, production-feeling admin dashboard for a fictional SaaS company —
built as a reusable template and portfolio piece.

[Live demo](#) <!-- replace with the real Vercel URL after deploy -->

## Tech stack

- **Next.js 14** (App Router, TypeScript strict)
- **[chiselui](https://www.npmjs.com/package/chiselui)** — the only UI library,
  a CSS-variable-driven component system with native dark mode
- **Recharts** for data visualization
- **Deterministic mock data** — no backend, no database; every number is
  generated from a seeded PRNG so the dashboard looks the same on every load
- Deployed on **Vercel**

## Features

- 6 fully built pages: Overview, Analytics, Customers, Billing, Reports, Settings
- Native dark mode via chiselui's `ThemeToggle`, with a pre-hydration script to
  avoid a flash on reload
- Collapsible, keyboard-accessible sidebar with a working mobile drawer
- Live in-memory filtering (search, plan, status, date range) on the Customers page
- Sortable, paginated data tables built on chiselui's `DataTable`
- A self-contained, SSR-safe toast notification system (see
  [Design decisions](#design-decisions))
- Empty states, loading states, and a custom 404 page
- Fully responsive down to mobile

## Getting started

```bash
git clone https://github.com/ikergoncalves/Frostboard.git
cd Frostboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/
    (dashboard)/          route group — sidebar + header shell
      analytics/           page.tsx + AnalyticsView.tsx
      billing/             page.tsx + BillingView.tsx
      customers/           page.tsx + CustomersView.tsx
      dashboard/           Overview
      reports/             page.tsx + ReportsView.tsx
      settings/            page.tsx + SettingsView.tsx
      layout.tsx
      loading.tsx
    layout.tsx             root layout, theme init script
    not-found.tsx          custom 404
    page.tsx               redirects / -> /dashboard
  components/
    dashboard/             KpiCard, RevenueChart, RecentActivity,
                           PlanDistribution, TopCustomersTable, use-chart-colors
    layout/                Sidebar, Header, NavItem, mobile-nav-context,
                           toast-provider
  hooks/
    useToast.ts            re-export of the toast hook (stable import path)
  lib/
    mock-data.ts           deterministic NovaSaaS dataset
    format.ts              currency/date/number formatters
  styles/
    globals.css
```

## Design decisions

**Why chiselui as the only UI library?** The goal was to prove a dashboard this
complete doesn't need Tailwind or a component framework like MUI — a
well-designed, CSS-variable-driven design system is enough, and it keeps the
bundle lean.

**Toast system.** chiselui's own `ToastProvider` renders its notification portal
unconditionally into `document.body`, which crashes Next.js's static
prerendering (`document is not defined`). Frostboard ships a small SSR-safe
replacement (`src/components/layout/toast-provider.tsx`) that keeps the same
API (`useToast().toast({ message, variant })`) and visually matches chiselui's
own toast styling, but only mounts the portal after hydration.

**Deterministic mock data.** Every number on the dashboard is derived from a
seeded pseudo-random generator and a fixed reference date, so the dataset is
internally consistent (KPIs always tie out to the underlying records) and
identical between server and client renders — no hydration mismatches.

## License

MIT
