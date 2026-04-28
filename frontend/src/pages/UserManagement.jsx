
import { useState, useEffect } from "react";
import { api } from "../utils/api";

const Icon = ({ d, size = 16, className = "", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={style}>{d}</svg>
);

const UserIcon = <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>;
const MailIcon = <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>;
const BuildingIcon = <><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/></>;
const PhoneIcon = <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z"/></>;
const LockIcon = <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>;
const ShieldIcon = <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>;
const CheckIcon = <><polyline points="20 6 9 17 4 12"/></>;
const XIcon = <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>;
const RefreshIcon = <><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/></>;

const ROLE_CONFIG = {
  admin:    { label: "Admin", color: "#dc2626", bg: "#fef2f2", icon: "👑", ring: "ring-red-200" },
  importer: { label: "Importer", color: "#3b82f6", bg: "#eff6ff", icon: "📦", ring: "ring-blue-200" },
  exporter: { label: "Exporter", color: "#10b981", bg: "#ecfdf5", icon: "📤", ring: "ring-green-200" },
  broker:   { label: "Broker", color: "#f59e0b", bg: "#fffbeb", icon: "🤝", ring: "ring-amber-200" },
};

const ROLES = ["importer", "exporter", "broker", "admin"];

// ─── Helper Components ─────────────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      {children}
    </div>
  );
}

function Alert({ type, children, onClose }) {
  const config = type === "success" 
    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
    : "bg-rose-50 border-rose-200 text-rose-700";
  return (
    <div className={`border rounded-xl px-4 py-3 text-sm flex items-center justify-between ${config}`}>
      <span className="flex items-center gap-2">
        {type === "success" ? <Icon d={CheckIcon} size={14} /> : <Icon d={XIcon} size={14} />}
        {children}
      </span>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100">
          <Icon d={XIcon} size={14} />
        </button>
      )}
    </div>
  );
}

function Card({ title, sub, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      {(title || sub) && (
        <div className="px-6 py-4 border-b border-slate-100">
          {title && <h2 className="font-bold text-slate-900 text-sm">{title}</h2>}
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

function RoleBadge({ role }) {
  const config = ROLE_CONFIG[role] || { label: role, color: "#64748b", bg: "#f1f5f9", icon: "👤" };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: config.bg, color: config.color }}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}

// ─── User List Component ───────────────────────────────────────────────────────
function UserList({ users, loading, onRefresh }) {
  const initials = (name) =>
    (name || "?").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <Card title="All Users" sub="Registered accounts on TradeLint">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
          {loading ? "Loading..." : `${users.length} users`}
        </span>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-500 transition"
        >
          <Icon d={RefreshIcon} size={12} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 py-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-slate-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-100 rounded w-1/3" />
                <div className="h-2 bg-slate-100 rounded w-1/4" />
              </div>
              <div className="w-20 h-6 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <Icon d={UserIcon} size={28} className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">No users found</p>
          <p className="text-xs text-slate-400 mt-1">Add your first user using the form</p>
        </div>
      ) : (
        <div className="space-y-1 -mx-2">
          {users.map((u) => {
            const config = ROLE_CONFIG[u.role] || { ring: "ring-slate-100" };
            return (
              <div
                key={u.username || u.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition group"
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ring-2 ${config.ring} ring-offset-2`}>
                  {initials(u.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-800">{u.full_name}</p>
                  <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                    <Icon d={MailIcon} size={10} />
                    {u.email}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <RoleBadge role={u.role} />
                  {u.company_name && (
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Icon d={BuildingIcon} size={9} />
                      {u.company_name}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// ─── Add User Form Component ───────────────────────────────────────────────────
function AddUserForm({ onUserAdded }) {
  const [form, setForm] = useState({
    full_name: "", username: "", email: "",
    company_name: "", phone: "", password: "", role: "importer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const required = ["full_name", "username", "email", "company_name", "phone", "password"];
    const missing = required.filter(f => !form[f].trim());
    if (missing.length) {
      setError(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    setLoading(true);
    try {
      await api.register({ ...form });
      setSuccess(`User "${form.username}" created successfully.`);
      setForm({
        full_name: "", username: "", email: "",
        company_name: "", phone: "", password: "", role: "importer",
      });
      onUserAdded?.();
    } catch (err) {
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Quick Register" sub="Add a new user to the system">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full name" required>
            <input
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
              placeholder="Ravi Kumar"
              value={form.full_name}
              onChange={updateField("full_name")}
            />
          </Field>
          <Field label="Username" required>
            <input
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
              placeholder="ravi_kumar"
              value={form.username}
              onChange={updateField("username")}
            />
          </Field>
        </div>

        <Field label="Email" required>
          <input
            type="email"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
            placeholder="ravi@company.com"
            value={form.email}
            onChange={updateField("email")}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Company Name" required>
            <input
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
              placeholder="Kumar Exports"
              value={form.company_name}
              onChange={updateField("company_name")}
            />
          </Field>
          <Field label="Phone" required>
            <input
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
              placeholder="+91 9876543210"
              value={form.phone}
              onChange={updateField("phone")}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Password" required>
            <input
              type="password"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
              placeholder="••••••••"
              value={form.password}
              onChange={updateField("password")}
            />
          </Field>
          <Field label="Role" required>
            <select
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition bg-white"
              value={form.role}
              onChange={updateField("role")}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {error && <Alert type="error" onClose={() => setError("")}>{error}</Alert>}
        {success && <Alert type="success" onClose={() => setSuccess("")}>{success}</Alert>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl font-bold hover:from-blue-800 hover:to-indigo-800 disabled:opacity-60 transition-all shadow-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating User...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Icon d={UserIcon} size={16} />
              Add User
            </span>
          )}
        </button>
      </form>
    </Card>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.listUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [refreshKey]);

  const handleUserAdded = () => {
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="p-6 space-y-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Icon d={ShieldIcon} size={20} />
          User Management
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage system users and their roles</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <UserList users={users} loading={loading} onRefresh={loadUsers} />
        </div>
        <div>
          <AddUserForm onUserAdded={handleUserAdded} />
        </div>
      </div>
    </div>
  );
}