/**
 * Mock data for NovaSaaS — the fictional SaaS company Frostboard administers.
 *
 * Everything here is generated deterministically from a fixed seed and a fixed
 * reference date. That matters for two reasons:
 *
 *   1. Server and client renders produce identical values, so there are no
 *      hydration mismatches when this data feeds React components.
 *   2. Snapshots, charts and KPI cards stay stable between runs, which is what
 *      you want from a demo dataset.
 *
 * The KPIs are derived from the customer and revenue series rather than typed
 * in by hand, so the headline numbers always tie out with the underlying data.
 */

export type Plan = "starter" | "pro" | "enterprise";
export type CustomerStatus = "active" | "trial" | "churned";
export type TransactionStatus = "paid" | "pending" | "failed";

export interface Customer {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  status: CustomerStatus;
  mrr: number; // monthly recurring revenue in USD (0 for trial/churned)
  createdAt: string; // ISO date string
  country: string; // country name
  avatar: string; // initials, e.g. "JD"
}

export interface MonthlyRevenue {
  month: string; // e.g. "Jan 2024"
  mrr: number;
  arr: number;
  newCustomers: number;
  churnedCustomers: number;
}

export interface DailyTraffic {
  date: string; // ISO date string (YYYY-MM-DD)
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: TransactionStatus;
  date: string; // ISO date string
  plan: Plan;
}

export interface KPIs {
  totalMRR: number;
  totalARR: number;
  activeCustomers: number;
  churnRate: number; // percentage, e.g. 2.4
  avgRevenuePerUser: number;
  netRevenueRetention: number; // percentage, e.g. 108.5
  mrrGrowth: number; // percentage vs. previous month
}

// --------------------------------------------------------------------------
// Deterministic primitives
// --------------------------------------------------------------------------

/** Throws on `undefined` so indexed access stays type-safe under
 * `noUncheckedIndexedAccess` without scattering non-null assertions. */
function req<T>(value: T | undefined, message = "unexpected undefined"): T {
  if (value === undefined) throw new Error(message);
  return value;
}

/** Small, fast seeded PRNG. Same seed → same stream, on server and client. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Picks an element using a `[0, 1)` random value, asserting the result. */
function pick<T>(items: readonly T[], r: number): T {
  return req(items[Math.floor(r * items.length)], "empty pool");
}

/** Picks from `[item, weight]` pairs proportionally to weight. */
function weightedPick<T>(entries: ReadonlyArray<readonly [T, number]>, r: number): T {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let threshold = r * total;
  for (const [item, weight] of entries) {
    threshold -= weight;
    if (threshold < 0) return item;
  }
  return req(entries[entries.length - 1], "empty weighted pool")[0];
}

const round2 = (n: number): number => Math.round(n * 100) / 100;
const round1 = (n: number): number => Math.round(n * 10) / 10;

// --------------------------------------------------------------------------
// Reference data
// --------------------------------------------------------------------------

/** Fixed "today" so the dataset never drifts between runs. */
const REFERENCE_TS = Date.UTC(2026, 5, 28, 12, 0, 0); // 2026-06-28T12:00:00Z
const DAY_MS = 86_400_000;

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

const PLAN_PRICE: Record<Plan, number> = {
  starter: 29,
  pro: 99,
  enterprise: 299,
};

const FIRST_NAMES = [
  "Emma", "Liam", "Olivia", "Noah", "Ava", "Lucas", "Sophia", "Mateo",
  "Isabella", "Ethan", "Mia", "Hugo", "Charlotte", "Leon", "Amelia", "Felix",
  "Clara", "Jonas", "Elena", "Marco", "Nina", "Oscar", "Lena", "Theo",
  "Sara", "Daniel", "Maya", "Viktor", "Alice", "Henrik",
] as const;

const LAST_NAMES = [
  "Andersen", "Becker", "Carter", "Dubois", "Eriksson", "Ferrari", "García",
  "Hansen", "Ivanov", "Johansson", "Klein", "Larsen", "Müller", "Novak",
  "O'Brien", "Patel", "Rossi", "Schmidt", "Tanaka", "Vargas", "Walsh",
  "Nguyen", "Kowalski", "Bianchi", "Hoffmann", "Lindqvist", "Moreau",
  "Sørensen", "Weber", "Costa",
] as const;

/** Country weights skewed toward the US and Europe. */
const COUNTRY_WEIGHTS: ReadonlyArray<readonly [string, number]> = [
  ["United States", 34],
  ["United Kingdom", 11],
  ["Germany", 10],
  ["France", 7],
  ["Canada", 6],
  ["Netherlands", 5],
  ["Sweden", 4],
  ["Spain", 4],
  ["Italy", 3],
  ["Ireland", 3],
  ["Australia", 3],
  ["Brazil", 2],
  ["Japan", 2],
  ["Denmark", 2],
];

const EMAIL_DOMAINS = [
  "gmail.com", "outlook.com", "proton.me", "fastmail.com",
  "hey.com", "icloud.com",
] as const;

const PLAN_WEIGHTS: ReadonlyArray<readonly [Plan, number]> = [
  ["starter", 45],
  ["pro", 37],
  ["enterprise", 18],
];

const STATUS_WEIGHTS: ReadonlyArray<readonly [CustomerStatus, number]> = [
  ["active", 72],
  ["trial", 16],
  ["churned", 12],
];

// --------------------------------------------------------------------------
// Customers
// --------------------------------------------------------------------------

function buildCustomers(): Customer[] {
  const rng = mulberry32(0x5eed_1);
  const usedEmails = new Set<string>();
  const customers: Customer[] = [];

  for (let i = 0; i < 50; i += 1) {
    const firstName = pick(FIRST_NAMES, rng());
    const lastName = pick(LAST_NAMES, rng());
    const plan = weightedPick(PLAN_WEIGHTS, rng());
    const status = weightedPick(STATUS_WEIGHTS, rng());
    const country = weightedPick(COUNTRY_WEIGHTS, rng());

    // NFD splits accented letters into an ASCII base + a non-ASCII combining
    // mark; drop the non-ASCII marks, then any remaining non-letters, so
    // accented names yield clean ASCII email locals.
    const ascii = (s: string): string =>
      s.normalize("NFD").replace(/[^\x00-\x7F]/g, "").replace(/[^a-z]/gi, "");
    const domain = pick(EMAIL_DOMAINS, rng());
    let local = `${ascii(firstName)}.${ascii(lastName)}`.toLowerCase();
    let email = `${local}@${domain}`;
    while (usedEmails.has(email)) {
      local = `${local}${i}`;
      email = `${local}@${domain}`;
    }
    usedEmails.add(email);

    // Spread sign-up dates across the last ~18 months.
    const daysAgo = 30 + Math.floor(rng() * 515);
    const createdAt = new Date(REFERENCE_TS - daysAgo * DAY_MS).toISOString();

    customers.push({
      id: `cus_${String(i + 1).padStart(4, "0")}`,
      name: `${firstName} ${lastName}`,
      email,
      plan,
      status,
      mrr: status === "active" ? PLAN_PRICE[plan] : 0,
      createdAt,
      country,
      avatar: `${req(firstName[0])}${req(lastName[0])}`.toUpperCase(),
    });
  }

  return customers;
}

export const customers: readonly Customer[] = buildCustomers();

const activeCustomers = customers.filter((c) => c.status === "active");
const totalMRR = activeCustomers.reduce((sum, c) => sum + c.mrr, 0);
const avgRevenuePerUser = round2(totalMRR / activeCustomers.length);

// --------------------------------------------------------------------------
// Monthly revenue — a 12-month series ending at the live totalMRR
// --------------------------------------------------------------------------

/** Existing-account expansion applied to the prior month's base. Used to derive
 * net revenue retention; set above the churn rate so the existing book grows. */
const MONTHLY_EXPANSION_RATE = 0.061;

function buildMonthlyRevenue(): MonthlyRevenue[] {
  const rng = mulberry32(0x5eed_2);
  const months = 12;
  const start = totalMRR * 0.58;
  const series: MonthlyRevenue[] = [];
  let previousMrr = Math.round(start * 0.94);

  for (let k = 0; k < months; k += 1) {
    const progress = k / (months - 1);

    // MRR climbs smoothly from `start` to exactly `totalMRR`, with light jitter
    // so the line isn't suspiciously perfect. The endpoint is pinned so the
    // chart ties out with the customer-derived `totalMRR` KPI.
    const smooth = start + (totalMRR - start) * Math.pow(progress, 0.95);
    const jitter = 1 + (rng() - 0.5) * 0.03;
    let mrr = k === months - 1 ? totalMRR : Math.round(smooth * jitter);
    if (mrr <= previousMrr) mrr = previousMrr + Math.round(previousMrr * 0.01) + 1;

    // Gross monthly logo activity for an early-stage book of this size: a few
    // new logos a month, trending up with the company; churn stays low.
    const newCustomers = Math.max(
      2,
      Math.round(3 + progress * 5 + (rng() - 0.5) * 2),
    );
    const churnedCustomers = 1 + (rng() < 0.3 ? 1 : 0);

    const monthIndex = ((5 - (months - 1 - k)) % 12 + 12) % 12;
    const year = 2026 + Math.floor((5 - (months - 1 - k)) / 12);

    series.push({
      month: `${req(MONTH_NAMES[monthIndex])} ${year}`,
      mrr,
      arr: mrr * 12,
      newCustomers,
      churnedCustomers,
    });
    previousMrr = mrr;
  }

  return series;
}

export const monthlyRevenue: readonly MonthlyRevenue[] = buildMonthlyRevenue();

// --------------------------------------------------------------------------
// Daily traffic — last 30 days, with quieter weekends
// --------------------------------------------------------------------------

function buildDailyTraffic(): DailyTraffic[] {
  const rng = mulberry32(0x5eed_3);
  const days = 30;
  const traffic: DailyTraffic[] = [];

  for (let i = 0; i < days; i += 1) {
    const dayOffset = days - 1 - i; // oldest first
    const ts = REFERENCE_TS - dayOffset * DAY_MS;
    const dow = new Date(ts).getUTCDay(); // 0 = Sun, 6 = Sat
    const isWeekend = dow === 0 || dow === 6;

    const trend = 1 + (i / days) * 0.22; // gentle upward trend over the window
    const weekendFactor = isWeekend ? 0.56 : 1;
    const noise = 1 + (rng() - 0.5) * 0.16;

    const pageViews = Math.round(4200 * trend * weekendFactor * noise);
    const uniqueVisitors = Math.round(pageViews * (0.4 + rng() * 0.04));
    const sessions = Math.round(pageViews * (0.55 + rng() * 0.05));

    traffic.push({
      date: new Date(ts).toISOString().slice(0, 10),
      pageViews,
      uniqueVisitors,
      sessions,
    });
  }

  return traffic;
}

export const dailyTraffic: readonly DailyTraffic[] = buildDailyTraffic();

// --------------------------------------------------------------------------
// Transactions — 20 most recent payments
// --------------------------------------------------------------------------

const TRANSACTION_STATUS_WEIGHTS: ReadonlyArray<readonly [TransactionStatus, number]> = [
  ["paid", 80],
  ["pending", 12],
  ["failed", 8],
];

function buildTransactions(): Transaction[] {
  const rng = mulberry32(0x5eed_4);
  // Payments come from customers that actually pay (active or converting trials).
  const payers = customers.filter((c) => c.status !== "churned");
  const transactions: Transaction[] = [];

  for (let i = 0; i < 20; i += 1) {
    const customer = pick(payers, rng());
    // Most charges are the monthly plan price; some are annual prepayments.
    const annual = rng() < 0.25;
    const amount = annual ? PLAN_PRICE[customer.plan] * 12 : PLAN_PRICE[customer.plan];

    const dayOffset = Math.floor(rng() * 30);
    const minutes = Math.floor(rng() * 1440);
    const ts = REFERENCE_TS - dayOffset * DAY_MS - minutes * 60_000;

    transactions.push({
      id: `txn_${String(i + 1).padStart(4, "0")}`,
      customerId: customer.id,
      customerName: customer.name,
      amount,
      status: weightedPick(TRANSACTION_STATUS_WEIGHTS, rng()),
      date: new Date(ts).toISOString(),
      plan: customer.plan,
    });
  }

  // Most recent first.
  return transactions.sort((a, b) => b.date.localeCompare(a.date));
}

export const transactions: readonly Transaction[] = buildTransactions();

// --------------------------------------------------------------------------
// KPIs — derived from the series above
// --------------------------------------------------------------------------

function buildKPIs(): KPIs {
  const latest = req(monthlyRevenue[monthlyRevenue.length - 1]);
  const previous = req(monthlyRevenue[monthlyRevenue.length - 2]);

  // Recent monthly logo churn relative to the active base.
  const recentChurn =
    monthlyRevenue.slice(-3).reduce((sum, m) => sum + m.churnedCustomers, 0) / 3;
  const churnRate = round1((recentChurn / activeCustomers.length) * 100);

  // Net revenue retention from the existing book: expansion lifts it, churned
  // revenue drags it. Expansion is modelled; churn is taken from the series.
  const churnedRevenue = latest.churnedCustomers * avgRevenuePerUser;
  const expansionRevenue = previous.mrr * MONTHLY_EXPANSION_RATE;
  const netRevenueRetention = round1(
    ((previous.mrr + expansionRevenue - churnedRevenue) / previous.mrr) * 100,
  );

  const mrrGrowth = round1(((latest.mrr - previous.mrr) / previous.mrr) * 100);

  return {
    totalMRR,
    totalARR: totalMRR * 12,
    activeCustomers: activeCustomers.length,
    churnRate,
    avgRevenuePerUser,
    netRevenueRetention,
    mrrGrowth,
  };
}

export const kpis: KPIs = buildKPIs();
