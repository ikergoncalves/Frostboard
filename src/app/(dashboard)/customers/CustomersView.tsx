"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  DataTable,
  DateRangePicker,
  Input,
  Modal,
  Select,
  type BadgeVariant,
  type DataTableColumn,
  type DateRange,
} from "chiselui";

import {
  customers,
  type CustomerStatus,
  type Plan,
} from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";

/**
 * Row shape for the table. A `type` alias (not the `Customer` interface) is
 * required: `DataTable`'s `T extends Record<string, unknown>` constraint accepts
 * type aliases — which carry an implicit index signature — but not interfaces.
 */
type CustomerRow = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: Plan;
  mrr: number;
  status: CustomerStatus;
  country: string;
  createdAt: string;
};

const planVariant: Record<Plan, BadgeVariant> = {
  starter: "default",
  pro: "info",
  enterprise: "success",
};

const statusVariant: Record<CustomerStatus, BadgeVariant> = {
  active: "success",
  trial: "warning",
  churned: "default",
};

const columns: DataTableColumn<CustomerRow>[] = [
  {
    key: "name",
    header: "Customer",
    sortable: true,
    render: (value, row) => (
      <div className="fb-customer-cell">
        <span className="fb-avatar">{row.avatar}</span>
        <span className="fb-customer-cell__text">
          <span className="fb-customer-cell__name">{value}</span>
          <span className="fb-customer-cell__email">{row.email}</span>
        </span>
      </div>
    ),
  },
  {
    key: "plan",
    header: "Plan",
    sortable: true,
    render: (value, row) => (
      <Badge variant={planVariant[row.plan]} size="sm">
        {value}
      </Badge>
    ),
  },
  {
    key: "mrr",
    header: "MRR",
    sortable: true,
    render: (_value, row) => (
      <span className="fb-cell-amount">{formatCurrency(row.mrr)}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (value, row) => (
      <Badge variant={statusVariant[row.status]} size="sm" dot>
        {value}
      </Badge>
    ),
  },
  { key: "country", header: "Country", sortable: true },
  {
    key: "createdAt",
    header: "Joined",
    sortable: true,
    render: (_value, row) => formatDate(row.createdAt),
  },
];

const planOptions = [
  { value: "", label: "All plans" },
  { value: "starter", label: "Starter" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "trial", label: "Trial" },
  { value: "churned", label: "Churned" },
];

const formPlanOptions = [
  { value: "starter", label: "Starter" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

const plusIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
  >
    <line x1="8" y1="3" x2="8" y2="13" />
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

/** End-of-day clone so a chosen end date includes everything on that day. */
function endOfDay(date: Date): Date {
  const clone = new Date(date);
  clone.setHours(23, 59, 59, 999);
  return clone;
}

const allRows: CustomerRow[] = customers.map((customer) => ({
  id: customer.id,
  name: customer.name,
  email: customer.email,
  avatar: customer.avatar,
  plan: customer.plan,
  mrr: customer.mrr,
  status: customer.status,
  country: customer.country,
  createdAt: customer.createdAt,
}));

export function CustomersView() {
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("");
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  const [isModalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPlan, setNewPlan] = useState("starter");

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const startTs = range.start ? range.start.getTime() : null;
    const endTs = range.end ? endOfDay(range.end).getTime() : null;

    return allRows.filter((row) => {
      if (
        query &&
        !row.name.toLowerCase().includes(query) &&
        !row.email.toLowerCase().includes(query)
      ) {
        return false;
      }
      if (plan && row.plan !== plan) return false;
      if (status && row.status !== status) return false;

      const created = new Date(row.createdAt).getTime();
      if (startTs !== null && created < startTs) return false;
      if (endTs !== null && created > endTs) return false;

      return true;
    });
  }, [search, plan, status, range]);

  const closeModal = () => {
    setModalOpen(false);
    setNewName("");
    setNewEmail("");
    setNewPlan("starter");
  };

  return (
    <div>
      <div className="fb-page-header">
        <div>
          <h1 className="fb-page-title">Customers</h1>
          <p className="fb-page-subtitle">
            Showing {rows.length} of {allRows.length} customers
          </p>
        </div>
        <Button leftIcon={plusIcon} onClick={() => setModalOpen(true)}>
          Add customer
        </Button>
      </div>

      <div className="fb-filters">
        <div className="fb-filter-item fb-filter-item--search">
          <Input
            label="Search"
            placeholder="Name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="fb-filter-item">
          <Select
            label="Plan"
            options={planOptions}
            value={plan}
            onChange={(event) => setPlan(event.target.value)}
          />
        </div>
        <div className="fb-filter-item">
          <Select
            label="Status"
            options={statusOptions}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          />
        </div>
        <div className="fb-filter-item fb-filter-item--range">
          <DateRangePicker
            label="Joined"
            startLabel="From"
            endLabel="To"
            value={range}
            onChange={setRange}
          />
        </div>
      </div>

      <div className="fb-card">
        <DataTable<CustomerRow>
          columns={columns}
          data={rows}
          pageSize={8}
          emptyMessage="No customers match these filters."
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Add customer"
        size="sm"
      >
        <div className="fb-modal-form">
          <Input
            label="Full name"
            placeholder="Jane Doe"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="jane@example.com"
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
          />
          <Select
            label="Plan"
            options={formPlanOptions}
            value={newPlan}
            onChange={(event) => setNewPlan(event.target.value)}
          />
          <div className="fb-form-actions">
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={closeModal}>Add customer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
