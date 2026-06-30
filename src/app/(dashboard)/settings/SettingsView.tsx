"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Drawer,
  FileUpload,
  Input,
  NumberInput,
  Select,
  Switch,
  Tabs,
  Textarea,
  type BadgeVariant,
  type TabItem,
} from "chiselui";

import { useToast } from "@/hooks/useToast";

type Role = "Admin" | "Member" | "Viewer";

interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
}

const roleVariant: Record<Role, BadgeVariant> = {
  Admin: "info",
  Member: "success",
  Viewer: "default",
};

const members: readonly Member[] = [
  { id: "1", name: "Iker Gonçalves", email: "iker@novasaas.io", avatar: "IG", role: "Admin" },
  { id: "2", name: "Sofia Almeida", email: "sofia@novasaas.io", avatar: "SA", role: "Admin" },
  { id: "3", name: "Lucas Pereira", email: "lucas@novasaas.io", avatar: "LP", role: "Member" },
  { id: "4", name: "Marta Ribeiro", email: "marta@novasaas.io", avatar: "MR", role: "Member" },
  { id: "5", name: "Tomás Costa", email: "tomas@novasaas.io", avatar: "TC", role: "Viewer" },
];

const timezoneOptions = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "America/New_York" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "Europe/Lisbon", label: "Europe/Lisbon" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo" },
];

const roleOptions = [
  { value: "Admin", label: "Admin" },
  { value: "Member", label: "Member" },
  { value: "Viewer", label: "Viewer" },
];

type NotificationId =
  | "newCustomer"
  | "paymentFailed"
  | "churnAlert"
  | "weeklyDigest"
  | "productUpdates";

const notificationConfig: ReadonlyArray<{ id: NotificationId; title: string; desc: string }> = [
  { id: "newCustomer", title: "New customer signup", desc: "Get notified when a new customer joins." },
  { id: "paymentFailed", title: "Payment failed", desc: "Alert me when a charge cannot be processed." },
  { id: "churnAlert", title: "Churn alert", desc: "Flag accounts that look at risk of cancelling." },
  { id: "weeklyDigest", title: "Weekly digest", desc: "A summary of key metrics every Monday." },
  { id: "productUpdates", title: "Product updates", desc: "News about new Frostboard features." },
];

type SecurityId = "twoFactor" | "loginNotifications" | "sessionTimeout";

const securityConfig: ReadonlyArray<{ id: SecurityId; label: string; hint: string }> = [
  { id: "twoFactor", label: "Two-factor authentication", hint: "Require a one-time code at sign-in." },
  { id: "loginNotifications", label: "Login notifications", hint: "Email me about new sign-ins." },
  { id: "sessionTimeout", label: "Session timeout after 30 days", hint: "Automatically sign out idle sessions." },
];

interface Session {
  id: string;
  device: string;
  location: string;
  lastSeen: string;
  current: boolean;
}

const sessions: readonly Session[] = [
  { id: "1", device: "Chrome on macOS", location: "Lisbon, Portugal", lastSeen: "Active now", current: true },
  { id: "2", device: "Safari on iPhone", location: "Porto, Portugal", lastSeen: "2 hours ago", current: false },
];

export function SettingsView() {
  const { toast } = useToast();

  const [maxSeats, setMaxSeats] = useState(50);

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");

  const [notifications, setNotifications] = useState<Record<NotificationId, boolean>>({
    newCustomer: true,
    paymentFailed: true,
    churnAlert: true,
    weeklyDigest: false,
    productUpdates: false,
  });

  const [security, setSecurity] = useState<Record<SecurityId, boolean>>({
    twoFactor: false,
    loginNotifications: true,
    sessionTimeout: true,
  });

  const closeDrawer = () => {
    setDrawerOpen(false);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("Member");
  };

  const handleSaveChanges = () => {
    toast({ message: "Settings saved.", variant: "success" });
  };

  const handleSendInvite = () => {
    const recipient = inviteEmail.trim() || "the new member";
    closeDrawer();
    toast({ message: `Invitation sent to ${recipient}.`, variant: "success" });
  };

  const generalTab = (
    <div className="fb-card">
      <div className="fb-form">
        <div className="fb-form-row">
          <Input label="Company name" defaultValue="NovaSaaS" />
          <Input label="Domain" defaultValue="novasaas.io" leftAddon="https://" />
        </div>
        <Select label="Timezone" options={timezoneOptions} defaultValue="UTC" />
        <Textarea
          label="Company description"
          rows={3}
          defaultValue="NovaSaaS builds analytics tooling for modern product teams."
        />
        <FileUpload label="Logo" accept="image/*" multiple={false} maxFiles={1} />
        <NumberInput
          label="Max seats"
          value={maxSeats}
          onChange={setMaxSeats}
          min={1}
          step={1}
        />
        <div className="fb-form-actions">
          <Button onClick={handleSaveChanges}>Save changes</Button>
        </div>
      </div>
    </div>
  );

  const teamTab = (
    <div className="fb-card">
      <div className="fb-card__header">
        <h3 className="fb-card__title">Team members</h3>
        <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
          Invite member
        </Button>
      </div>
      <div>
        {members.map((member) => (
          <div key={member.id} className="fb-setting-row">
            <div className="fb-customer-cell">
              <span className="fb-avatar">{member.avatar}</span>
              <span className="fb-customer-cell__text">
                <span className="fb-customer-cell__name">{member.name}</span>
                <span className="fb-customer-cell__email">{member.email}</span>
              </span>
            </div>
            <Badge variant={roleVariant[member.role]} size="sm">
              {member.role}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );

  const notificationsTab = (
    <div className="fb-card">
      <div className="fb-card__header">
        <h3 className="fb-card__title">Notifications</h3>
      </div>
      <div>
        {notificationConfig.map((item) => (
          <div key={item.id} className="fb-setting-row">
            <div className="fb-setting-row__text">
              <span className="fb-setting-row__title">{item.title}</span>
              <span className="fb-setting-row__desc">{item.desc}</span>
            </div>
            <Switch
              checked={notifications[item.id]}
              onChange={(checked) =>
                setNotifications((prev) => ({ ...prev, [item.id]: checked }))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );

  const securityTab = (
    <div className="fb-stack">
      <div className="fb-card">
        <div className="fb-card__header">
          <h3 className="fb-card__title">Security</h3>
        </div>
        <div className="fb-check-group">
          {securityConfig.map((item) => (
            <Checkbox
              key={item.id}
              label={item.label}
              hint={item.hint}
              checked={security[item.id]}
              onChange={(checked) =>
                setSecurity((prev) => ({ ...prev, [item.id]: checked }))
              }
            />
          ))}
        </div>
      </div>

      <div className="fb-card">
        <div className="fb-card__header">
          <h3 className="fb-card__title">Active sessions</h3>
        </div>
        <div>
          {sessions.map((session) => (
            <div key={session.id} className="fb-setting-row">
              <div className="fb-setting-row__text">
                <span className="fb-setting-row__title">{session.device}</span>
                <span className="fb-setting-row__desc">
                  {session.location} · {session.lastSeen}
                </span>
              </div>
              {session.current ? (
                <Badge variant="success" size="sm" dot>
                  This device
                </Badge>
              ) : (
                <Button variant="ghost" size="sm">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs: TabItem[] = [
    { id: "general", label: "General", content: generalTab },
    { id: "team", label: "Team", content: teamTab },
    { id: "notifications", label: "Notifications", content: notificationsTab },
    { id: "security", label: "Security", content: securityTab },
  ];

  return (
    <div className="fb-stack">
      <div className="fb-page-header">
        <div>
          <h1 className="fb-page-title">Settings</h1>
          <p className="fb-page-subtitle">
            Manage your workspace, team and security preferences
          </p>
        </div>
      </div>

      <Tabs items={tabs} defaultActiveId="general" />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title="Invite member"
        footer={
          <div className="fb-form-actions">
            <Button variant="secondary" onClick={closeDrawer}>
              Cancel
            </Button>
            <Button onClick={handleSendInvite}>Send invite</Button>
          </div>
        }
      >
        <div className="fb-drawer-form">
          <Input
            label="Full name"
            placeholder="Jane Doe"
            value={inviteName}
            onChange={(event) => setInviteName(event.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="jane@novasaas.io"
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
          />
          <Select
            label="Role"
            options={roleOptions}
            value={inviteRole}
            onChange={(event) => setInviteRole(event.target.value)}
          />
        </div>
      </Drawer>
    </div>
  );
}
