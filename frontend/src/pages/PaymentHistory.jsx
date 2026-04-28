
// import { useState, useEffect, useCallback } from "react";
// import { api } from "../utils/api";
// import { Card } from "./Analytics";

// const fmt = (n) =>
//   new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

// const STATUS_META = {
//   paid:    { label: "Paid",    cls: "bg-green-100 text-green-700"  },
//   late:    { label: "Late",    cls: "bg-amber-100 text-amber-700"  },
//   overdue: { label: "Overdue", cls: "bg-red-100 text-red-700"      },
//   pending: { label: "Pending", cls: "bg-blue-100 text-blue-700"    },
// };

// function StatusBadge({ status }) {
//   const m = STATUS_META[status] || { label: status, cls: "bg-gray-100 text-gray-600" };
//   return (
//     <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${m.cls}`}>
//       {m.label}
//     </span>
//   );
// }

// function StatCard({ label, value, sub, color }) {
//   return (
//     <div className="bg-gray-50 rounded-xl p-4">
//       <p className="text-xs text-gray-400 mb-1">{label}</p>
//       <p className={`text-xl font-extrabold tracking-tight ${color || "text-gray-900"}`}>{value}</p>
//       {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
//     </div>
//   );
// }

// // ── Add Payment Modal ────────────────────────────────────────────────────────
// function AddPaymentModal({ onClose, onAdded }) {
//   const [form, setForm] = useState({
//     client_id:      "",
//     invoice_number: "",
//     invoice_amount: "",
//     due_date:       "",
//     payment_date:   "",
//     days_late:      "0",
//     status:         "paid",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error,   setError]   = useState("");

//   const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

//   async function submit(e) {
//     e.preventDefault();
//     setError("");
//     if (!form.client_id || !form.invoice_number || !form.invoice_amount || !form.due_date) {
//       setError("Client ID, invoice number, amount and due date are required.");
//       return;
//     }
//     setLoading(true);
//     try {
//       await api.addPayment({
//         client_id:      parseInt(form.client_id),
//         invoice_number: form.invoice_number,
//         invoice_amount: parseFloat(form.invoice_amount),
//         due_date:       form.due_date || null,
//         payment_date:   form.payment_date || null,
//         days_late:      parseInt(form.days_late) || 0,
//         status:         form.status,
//       });
//       onAdded?.();
//       onClose();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <h3 className="font-semibold text-gray-800 text-sm">Add Payment Record</h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
//         </div>

//         <form onSubmit={submit} className="p-6 space-y-4">
//           <div className="grid grid-cols-2 gap-3">
//             <Field label="Client ID">
//               <input className="input" type="number" placeholder="2" value={form.client_id} onChange={set("client_id")} />
//             </Field>
//             <Field label="Invoice number">
//               <input className="input" placeholder="INV-004" value={form.invoice_number} onChange={set("invoice_number")} />
//             </Field>
//           </div>

//           <Field label="Invoice amount (₹)">
//             <input className="input" type="number" placeholder="50000" value={form.invoice_amount} onChange={set("invoice_amount")} />
//           </Field>

//           <div className="grid grid-cols-2 gap-3">
//             <Field label="Due date">
//               <input className="input" type="date" value={form.due_date} onChange={set("due_date")} />
//             </Field>
//             <Field label="Payment date">
//               <input className="input" type="date" value={form.payment_date} onChange={set("payment_date")} />
//             </Field>
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <Field label="Days late">
//               <input className="input" type="number" min="0" value={form.days_late} onChange={set("days_late")} />
//             </Field>
//             <Field label="Status">
//               <select className="input" value={form.status} onChange={set("status")}>
//                 {Object.entries(STATUS_META).map(([k, v]) => (
//                   <option key={k} value={k}>{v.label}</option>
//                 ))}
//               </select>
//             </Field>
//           </div>

//           {error && (
//             <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
//           )}

//           <div className="flex gap-3 pt-1">
//             <button type="button" onClick={onClose}
//               className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
//               Cancel
//             </button>
//             <button type="submit" disabled={loading}
//               className="flex-1 py-2.5 bg-[#1a3a6b] text-white rounded-xl text-sm font-semibold hover:bg-blue-800 disabled:opacity-60 transition">
//               {loading ? "Saving…" : "Add Record"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ══════════════════════════════════════════════════════════════════════════════
// export default function PaymentHistory({ user }) {
//   const [history,     setHistory]     = useState([]);
//   const [summary,     setSummary]     = useState(null);
//   const [total,       setTotal]       = useState(0);
//   const [loading,     setLoading]     = useState(false);
//   const [error,       setError]       = useState("");
//   const [clientId,    setClientId]    = useState("");
//   const [filterInput, setFilterInput] = useState("");
//   const [statusFilter,setStatusFilter]= useState("");
//   const [page,        setPage]        = useState(0);
//   const [showModal,   setShowModal]   = useState(false);
//   const [refreshKey,  setRefreshKey]  = useState(0);

//   const PAGE_SIZE = 10;
//   const isAdmin = user?.role === "admin" || user?.role === "broker";

//   const fetchHistory = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const cid = filterInput ? parseInt(filterInput) : null;
//       const data = await api.paymentHistory(cid, PAGE_SIZE, page * PAGE_SIZE);
//       let rows = data.history || [];

//       // client-side status filter (backend doesn't filter by status yet)
//       if (statusFilter) rows = rows.filter((r) => r.status === statusFilter);

//       setHistory(rows);
//       setTotal(data.total || 0);
//       setSummary(data.summary || null);
//     } catch (e) {
//       setError(e.message || "Failed to load payment history");
//     } finally {
//       setLoading(false);
//     }
//   }, [page, filterInput, statusFilter, refreshKey]);

//   useEffect(() => { fetchHistory(); }, [fetchHistory]);

//   // debounce client id filter
//   useEffect(() => {
//     const t = setTimeout(() => { setPage(0); setClientId(filterInput); }, 400);
//     return () => clearTimeout(t);
//   }, [filterInput]);

//   const totalPages = Math.ceil(total / PAGE_SIZE);

//   return (
//     <div className="space-y-5">
//       {/* Summary cards */}
//       {summary && (
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//           <StatCard
//             label="Total invoices"
//             value={summary.total_invoices}
//             color="text-gray-900"
//           />
//           <StatCard
//             label="Total value"
//             value={`₹${fmt(summary.total_amount)}`}
//             color="text-blue-600"
//           />
//           <StatCard
//             label="Late payments"
//             value={summary.late_count}
//             sub={summary.total_invoices > 0
//               ? `${((summary.late_count / summary.total_invoices) * 100).toFixed(0)}% of total`
//               : ""}
//             color={summary.late_count > 0 ? "text-amber-600" : "text-green-600"}
//           />
//           <StatCard
//             label="Avg days late"
//             value={`${parseFloat(summary.avg_days_late).toFixed(1)}d`}
//             color={parseFloat(summary.avg_days_late) > 5 ? "text-red-600" : "text-green-600"}
//           />
//         </div>
//       )}

//       {/* On-time rate bar */}
//       {summary && summary.total_invoices > 0 && (
//         <div className="bg-gray-50 rounded-xl p-4">
//           <div className="flex justify-between text-xs text-gray-500 mb-2">
//             <span className="font-medium">Payment performance</span>
//             <span>
//               {summary.paid_count} paid · {summary.late_count} late · {summary.pending_count} pending
//             </span>
//           </div>
//           <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden flex">
//             {[
//               { value: summary.paid_count,    color: "bg-green-500" },
//               { value: summary.late_count,    color: "bg-amber-400" },
//               { value: summary.pending_count, color: "bg-blue-400"  },
//             ].map((seg, i) => {
//               const pct = (seg.value / summary.total_invoices) * 100;
//               return pct > 0 ? (
//                 <div key={i} className={`${seg.color} h-full`} style={{ width: `${pct}%` }} />
//               ) : null;
//             })}
//           </div>
//           <div className="flex gap-4 mt-2">
//             {[
//               { label: "Paid",    color: "bg-green-500" },
//               { label: "Late",    color: "bg-amber-400" },
//               { label: "Pending", color: "bg-blue-400"  },
//             ].map((l) => (
//               <div key={l.label} className="flex items-center gap-1.5">
//                 <div className={`w-2 h-2 rounded-full ${l.color}`} />
//                 <span className="text-xs text-gray-400">{l.label}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <Card
//         title="Payment History"
//         sub={total > 0 ? `${total} records` : "No payment records"}
//       >
//         {/* Toolbar */}
//         <div className="flex flex-wrap gap-3 mb-4">
//           <input
//             type="number"
//             placeholder="Filter by client ID…"
//             value={filterInput}
//             onChange={(e) => setFilterInput(e.target.value)}
//             className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-400 w-44"
//           />

//           <div className="flex gap-1">
//             {["", ...Object.keys(STATUS_META)].map((s) => (
//               <button
//                 key={s || "all"}
//                 onClick={() => { setStatusFilter(s); setPage(0); }}
//                 className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition
//                   ${statusFilter === s
//                     ? "bg-[#1a3a6b] text-white border-[#1a3a6b]"
//                     : "border-gray-200 text-gray-500 hover:border-gray-300"
//                   }`}
//               >
//                 {s ? STATUS_META[s].label : "All"}
//               </button>
//             ))}
//           </div>

//           {isAdmin && (
//             <button
//               onClick={() => setShowModal(true)}
//               className="ml-auto px-4 py-2 bg-[#1a3a6b] text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition"
//             >
//               + Add Record
//             </button>
//           )}
//         </div>

//         {error && (
//           <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">{error}</p>
//         )}

//         {loading ? (
//           <div className="flex justify-center py-12">
//             <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           </div>
//         ) : history.length === 0 ? (
//           <div className="text-center py-14 text-gray-400">
//             <div className="text-4xl mb-3">💳</div>
//             <p className="text-sm font-medium">
//               {filterInput || statusFilter ? "No records match your filters" : "No payment records yet"}
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-gray-100">
//                   {["Client ID", "Invoice", "Amount (₹)", "Due Date", "Paid Date", "Days Late", "Status"].map((h) => (
//                     <th key={h} className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4 whitespace-nowrap">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {history.map((row, i) => (
//                   <tr key={row.id || i} className="border-b border-gray-50 hover:bg-gray-50 transition">
//                     <td className="py-3 pr-4">
//                       <span className="font-mono text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
//                         #{row.client_id}
//                       </span>
//                     </td>
//                     <td className="py-3 pr-4">
//                       <span className="font-mono text-blue-600 text-xs font-semibold">{row.invoice_number}</span>
//                     </td>
//                     <td className="py-3 pr-4 font-semibold text-gray-800 text-xs">
//                       ₹{fmt(row.invoice_amount)}
//                     </td>
//                     <td className="py-3 pr-4 text-gray-500 text-xs whitespace-nowrap">
//                       {row.due_date
//                         ? new Date(row.due_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
//                         : "—"}
//                     </td>
//                     <td className="py-3 pr-4 text-gray-500 text-xs whitespace-nowrap">
//                       {row.payment_date
//                         ? new Date(row.payment_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
//                         : <span className="text-gray-300">—</span>}
//                     </td>
//                     <td className="py-3 pr-4 text-xs">
//                       {row.days_late > 0
//                         ? <span className="text-amber-600 font-semibold">{row.days_late}d</span>
//                         : <span className="text-green-600 font-semibold">On time</span>}
//                     </td>
//                     <td className="py-3">
//                       <StatusBadge status={row.status} />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
//             <p className="text-xs text-gray-400">Page {page + 1} of {totalPages}</p>
//             <div className="flex gap-2">
//               <button
//                 disabled={page === 0}
//                 onClick={() => setPage((p) => p - 1)}
//                 className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
//               >
//                 ← Prev
//               </button>
//               <button
//                 disabled={page >= totalPages - 1}
//                 onClick={() => setPage((p) => p + 1)}
//                 className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
//               >
//                 Next →
//               </button>
//             </div>
//           </div>
//         )}
//       </Card>

//       {showModal && (
//         <AddPaymentModal
//           onClose={() => setShowModal(false)}
//           onAdded={() => setRefreshKey((k) => k + 1)}
//         />
//       )}
//     </div>
//   );
// }

// function Field({ label, children }) {
//   return (
//     <div>
//       <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
//       {children}
//     </div>
//   );
// }

import { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, className = "", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={style}>{d}</svg>
);

const SearchIcon = <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>;
const ChevronL = <polyline points="15 18 9 12 15 6"/>;
const ChevronR = <polyline points="9 18 15 12 9 6"/>;
const DollarIcon = <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>;
const ClockIcon = <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>;
const CheckIcon = <><polyline points="20 6 9 17 4 12"/></>;
const XIcon = <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>;
const TrendingUp = <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>;
const TrendingDown = <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></>;
const PlusIcon = <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>;

const STATUS_CONFIG = {
  paid:    { label: "Paid", color: "#10b981", bg: "#ecfdf5", icon: "✅" },
  late:    { label: "Late", color: "#f59e0b", bg: "#fffbeb", icon: "⚠️" },
  overdue: { label: "Overdue", color: "#ef4444", bg: "#fef2f2", icon: "🔴" },
  pending: { label: "Pending", color: "#3b82f6", bg: "#eff6ff", icon: "⏳" },
};

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

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

function StatCard({ label, value, sub, trend, trendUp }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-baseline justify-between">
        <p className={`text-2xl font-extrabold tracking-tight ${trendUp ? "text-emerald-600" : "text-slate-900"}`}>
          {value}
        </p>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trendUp ? "text-emerald-600" : "text-rose-600"}`}>
            <Icon d={trendUp ? TrendingUp : TrendingDown} size={12} />
            {trend}
          </span>
        )}
      </div>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, color: "#64748b", bg: "#f1f5f9", icon: "📋" };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: config.bg, color: config.color }}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}

// ─── Add Payment Modal ────────────────────────────────────────────────────────
function AddPaymentModal({ onClose, onAdded }) {
  const [form, setForm] = useState({
    client_id:      "",
    invoice_number: "",
    invoice_amount: "",
    due_date:       "",
    payment_date:   "",
    days_late:      "0",
    status:         "paid",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.client_id || !form.invoice_number || !form.invoice_amount || !form.due_date) {
      setError("Client ID, invoice number, amount and due date are required.");
      return;
    }
    setLoading(true);
    try {
      await api.addPayment({
        client_id:      parseInt(form.client_id),
        invoice_number: form.invoice_number,
        invoice_amount: parseFloat(form.invoice_amount),
        due_date:       form.due_date || null,
        payment_date:   form.payment_date || null,
        days_late:      parseInt(form.days_late) || 0,
        status:         form.status,
      });
      onAdded?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Add Payment Record</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none transition">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Client ID" required>
              <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
                type="number" placeholder="2" value={form.client_id} onChange={updateField("client_id")} />
            </Field>
            <Field label="Invoice number" required>
              <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
                placeholder="INV-004" value={form.invoice_number} onChange={updateField("invoice_number")} />
            </Field>
          </div>

          <Field label="Invoice amount (₹)" required>
            <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
              type="number" placeholder="50000" value={form.invoice_amount} onChange={updateField("invoice_amount")} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Due date" required>
              <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
                type="date" value={form.due_date} onChange={updateField("due_date")} />
            </Field>
            <Field label="Payment date">
              <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
                type="date" value={form.payment_date} onChange={updateField("payment_date")} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Days late">
              <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
                type="number" min="0" value={form.days_late} onChange={updateField("days_late")} />
            </Field>
            <Field label="Status">
              <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition bg-white" 
                value={form.status} onChange={updateField("status")}>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </Field>
          </div>

          {error && <Alert type="error" onClose={() => setError("")}>{error}</Alert>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl text-sm font-bold hover:shadow-md disabled:opacity-60 transition">
              {loading ? "Saving..." : "Add Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PaymentHistory({ user }) {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterInput, setFilterInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const PAGE_SIZE = 10;
  const isAdmin = user?.role === "admin" || user?.role === "broker";

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const cid = filterInput ? parseInt(filterInput) : null;
      const data = await api.paymentHistory(cid, PAGE_SIZE, page * PAGE_SIZE);
      let rows = data.history || [];
      if (statusFilter) rows = rows.filter((r) => r.status === statusFilter);
      setHistory(rows);
      setTotal(data.total || 0);
      setSummary(data.summary || null);
    } catch (e) {
      setError(e.message || "Failed to load payment history");
    } finally {
      setLoading(false);
    }
  }, [page, filterInput, statusFilter, refreshKey]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  useEffect(() => {
    const t = setTimeout(() => { setPage(0); }, 400);
    return () => clearTimeout(t);
  }, [filterInput]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6 max-w-5xl space-y-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Icon d={DollarIcon} size={20} />
          Payment History
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Track and manage payment records</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Total Invoices"
            value={summary.total_invoices}
          />
          <StatCard
            label="Total Value"
            value={`₹${fmt(summary.total_amount)}`}
            trendUp={true}
          />
          <StatCard
            label="Late Payments"
            value={summary.late_count}
            sub={summary.total_invoices > 0 ? `${((summary.late_count / summary.total_invoices) * 100).toFixed(0)}% of total` : ""}
            trendUp={false}
            trend={`${((summary.late_count / summary.total_invoices) * 100).toFixed(0)}%`}
          />
          <StatCard
            label="Avg Days Late"
            value={`${parseFloat(summary.avg_days_late).toFixed(1)}d`}
            trendUp={parseFloat(summary.avg_days_late) > 5}
            trend={parseFloat(summary.avg_days_late) > 5 ? "High" : "Good"}
          />
        </div>
      )}

      {/* Performance Bar */}
      {summary && summary.total_invoices > 0 && (
        <div className="bg-white rounded-xl p-5 border border-slate-100">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold">Payment Performance</span>
            <span>
              {summary.paid_count} paid · {summary.late_count} late · {summary.pending_count} pending
            </span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
            {[
              { value: summary.paid_count, color: "bg-emerald-500" },
              { value: summary.late_count, color: "bg-amber-400" },
              { value: summary.pending_count, color: "bg-blue-400" },
            ].map((seg, i) => {
              const pct = (seg.value / summary.total_invoices) * 100;
              return pct > 0 ? (
                <div key={i} className={`${seg.color} h-full transition-all duration-500`} style={{ width: `${pct}%` }} />
              ) : null;
            })}
          </div>
          <div className="flex gap-4 mt-3">
            {[
              { label: "Paid", color: "bg-emerald-500" },
              { label: "Late", color: "bg-amber-400" },
              { label: "Pending", color: "bg-blue-400" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${l.color}`} />
                <span className="text-xs text-slate-400">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Table */}
      <Card title="Payment Records" sub={total > 0 ? `${total} total records` : "No payment records"}>
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-[180px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
              <Icon d={SearchIcon} size={14} />
            </div>
            <input
              type="number"
              placeholder="Filter by client ID..."
              value={filterInput}
              onChange={(e) => setFilterInput(e.target.value)}
              className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
            />
          </div>

          <div className="flex gap-1 p-1 bg-slate-50 rounded-lg">
            {["", ...Object.keys(STATUS_CONFIG)].map((s) => (
              <button
                key={s || "all"}
                onClick={() => { setStatusFilter(s); setPage(0); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === s
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {s ? STATUS_CONFIG[s].label : "All"}
              </button>
            ))}
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl text-xs font-semibold hover:shadow-md transition ml-auto"
            >
              <Icon d={PlusIcon} size={12} />
              Add Record
            </button>
          )}
        </div>

        {error && <Alert type="error" onClose={() => setError("")}>{error}</Alert>}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <Icon d={DollarIcon} size={28} className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">
              {filterInput || statusFilter ? "No records match your filters" : "No payment records yet"}
            </p>
            {!filterInput && !statusFilter && isAdmin && (
              <p className="text-xs text-slate-400 mt-1">Click "Add Record" to create your first payment entry</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Client ID", "Invoice", "Amount (₹)", "Due Date", "Paid Date", "Days Late", "Status"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider pb-3 pl-1 pr-4 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {history.map((row, i) => (
                  <tr key={row.id || i} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 pl-1 pr-4">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded-lg">
                        #{row.client_id}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                        {row.invoice_number}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-bold text-slate-800">
                      ₹{fmt(row.invoice_amount)}
                    </td>
                    <td className="py-3 pr-4 text-slate-500 text-xs whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Icon d={ClockIcon} size={11} />
                        {row.due_date
                          ? new Date(row.due_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                          : "—"}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-500 text-xs whitespace-nowrap">
                      {row.payment_date
                        ? new Date(row.payment_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                        : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="py-3 pr-4">
                      {row.days_late > 0 ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs">
                          🔴 {row.days_late}d
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                          ✅ On time
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">Page {page + 1} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 transition"
              >
                <Icon d={ChevronL} size={12} /> Prev
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 transition"
              >
                Next <Icon d={ChevronR} size={12} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {showModal && (
        <AddPaymentModal
          onClose={() => setShowModal(false)}
          onAdded={() => setRefreshKey(k => k + 1)}
        />
      )}
    </div>
  );
}