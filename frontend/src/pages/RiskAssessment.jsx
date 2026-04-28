

// import { useState } from "react";
// import { api } from "../utils/api";
// import { Card } from "./Analytics";

// const LEVEL_STYLES = {
//   LOW:    { bar: "bg-green-500",  badge: "bg-green-100 text-green-700",  score: "text-green-600"  },
//   MEDIUM: { bar: "bg-amber-500",  badge: "bg-amber-100 text-amber-700",  score: "text-amber-600"  },
//   HIGH:   { bar: "bg-red-500",    badge: "bg-red-100 text-red-700",      score: "text-red-600"    },
// };

// const fmt = (n) =>
//   new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

// export default function RiskAssessment() {
//   const [clientId, setClientId] = useState("");
//   const [result,   setResult]   = useState(null);
//   const [loading,  setLoading]  = useState(false);
//   const [error,    setError]    = useState("");

//   const assess = async () => {
//     setError(""); setResult(null);
//     const id = parseInt(clientId);
//     if (!id || id <= 0) { setError("Enter a valid client ID (number)."); return; }
//     setLoading(true);
//     try {
//       setResult(await api.assessRisk(id));
//     } catch (e) {
//       // Show the backend's specific message (e.g. "Client ID X has no payment history")
//       setError(e.message || "Assessment failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const style = result ? (LEVEL_STYLES[result.risk_level] || LEVEL_STYLES.MEDIUM) : null;
//   const stats = result?.payment_stats;

//   return (
//     <div className="max-w-2xl space-y-5">
//       <Card title="Risk Assessment" sub="Scored from real payment history data">
//         <div className="flex gap-4 items-end">
//           <div className="flex-1">
//             <label className="block text-xs font-medium text-gray-600 mb-1.5">Client ID</label>
//             <input
//               type="number"
//               value={clientId}
//               onChange={(e) => { setClientId(e.target.value); setError(""); setResult(null); }}
//               onKeyDown={(e) => e.key === "Enter" && assess()}
//               placeholder="Enter a client ID from payment history…"
//               className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
//             />
//           </div>
//           <button
//             onClick={assess}
//             disabled={loading || !clientId}
//             className="px-6 py-2.5 bg-[#1a3a6b] text-white rounded-xl text-sm font-semibold hover:bg-blue-800 disabled:opacity-60 transition"
//           >
//             {loading ? "Assessing…" : "Assess Risk"}
//           </button>
//         </div>

//         {/* Helper text */}
//         <p className="text-xs text-gray-400 mt-2">
//           Only clients with existing payment records can be assessed.
//           Client IDs with data: <span className="font-semibold text-gray-500">2, 3</span> (from your seeded data).
//         </p>

//         {error && (
//           <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
//             <span className="text-red-500 text-lg leading-none mt-0.5">⚠</span>
//             <div>
//               <p className="text-sm font-semibold text-red-700">Assessment failed</p>
//               <p className="text-xs text-red-600 mt-0.5">{error}</p>
//             </div>
//           </div>
//         )}
//       </Card>

//       {result && (
//         <div className="space-y-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Score gauge */}
//             <Card title="Risk Score">
//               <div className="text-center py-4">
//                 <p className={`text-7xl font-extrabold tracking-tighter ${style.score}`}>
//                   {result.risk_score}
//                 </p>
//                 <span className={`inline-block mt-3 px-5 py-1.5 rounded-full text-sm font-bold ${style.badge}`}>
//                   {result.risk_level}
//                 </span>

//                 <div className="mt-5">
//                   <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
//                     <div
//                       className={`h-full rounded-full transition-all duration-700 ${style.bar}`}
//                       style={{ width: `${result.risk_score}%` }}
//                     />
//                   </div>
//                   <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
//                     <span>Low (0–30)</span>
//                     <span>Medium (30–60)</span>
//                     <span>High (60+)</span>
//                   </div>
//                 </div>
//               </div>
//             </Card>

//             {/* Details */}
//             <Card title="Assessment Details">
//               <div className="space-y-4">
//                 <div>
//                   <p className="text-xs text-gray-400 mb-1">Client ID</p>
//                   <p className="text-base font-bold text-gray-800">#{result.client_id}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-400 mb-1">Recommendation</p>
//                   <p className="text-sm font-medium text-gray-700 leading-relaxed">{result.recommendation}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-400 mb-1">Credit Limit</p>
//                   <p className="text-2xl font-extrabold text-blue-600 tracking-tight">
//                     ₹{fmt(result.credit_limit_usd)}
//                   </p>
//                 </div>
//               </div>
//             </Card>
//           </div>

//           {/* Payment stats breakdown */}
//           {stats && (
//             <Card title="Payment History Basis" sub="Risk score derived from these records">
//               <div className="grid grid-cols-3 gap-4 mb-4">
//                 <div className="bg-gray-50 rounded-xl p-3 text-center">
//                   <p className="text-2xl font-extrabold text-gray-800">{stats.total_invoices}</p>
//                   <p className="text-xs text-gray-400 mt-0.5">Total invoices</p>
//                 </div>
//                 <div className="bg-green-50 rounded-xl p-3 text-center">
//                   <p className="text-2xl font-extrabold text-green-600">{stats.on_time}</p>
//                   <p className="text-xs text-gray-400 mt-0.5">Paid on time</p>
//                 </div>
//                 <div className="bg-amber-50 rounded-xl p-3 text-center">
//                   <p className="text-2xl font-extrabold text-amber-600">{stats.late_payments}</p>
//                   <p className="text-xs text-gray-400 mt-0.5">Late payments</p>
//                 </div>
//               </div>

//               {/* On-time bar */}
//               {stats.total_invoices > 0 && (
//                 <div>
//                   <div className="flex justify-between text-xs text-gray-400 mb-1.5">
//                     <span>On-time rate</span>
//                     <span className="font-semibold">
//                       {((stats.on_time / stats.total_invoices) * 100).toFixed(0)}%
//                     </span>
//                   </div>
//                   <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
//                     <div
//                       className="bg-green-500 h-full rounded-full transition-all duration-700"
//                       style={{ width: `${(stats.on_time / stats.total_invoices) * 100}%` }}
//                     />
//                     <div
//                       className="bg-amber-400 h-full transition-all duration-700"
//                       style={{ width: `${(stats.late_payments / stats.total_invoices) * 100}%` }}
//                     />
//                   </div>
//                   <div className="flex gap-4 mt-1.5">
//                     <div className="flex items-center gap-1.5">
//                       <div className="w-2 h-2 rounded-full bg-green-500" />
//                       <span className="text-xs text-gray-400">On time</span>
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       <div className="w-2 h-2 rounded-full bg-amber-400" />
//                       <span className="text-xs text-gray-400">Late</span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {stats.total_amount > 0 && (
//                 <div className="mt-4 pt-4 border-t border-gray-100">
//                   <p className="text-xs text-gray-400 mb-1">Total invoice value assessed</p>
//                   <p className="text-lg font-bold text-gray-800">₹{fmt(stats.total_amount)}</p>
//                 </div>
//               )}
//             </Card>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";

// ─── Icon System ─────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, className = "", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={style}>{d}</svg>
);

const SearchIcon = <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>;
const ShieldIcon = <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>;
const ChevronL = <polyline points="15 18 9 12 15 6"/>;
const ChevronR = <polyline points="9 18 15 12 9 6"/>;
const ClockIcon = <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>;
const AlertTriangle = <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>;
const TrendingUp = <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>;
const TrendingDown = <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></>;

const LEVEL_STYLES = {
  LOW:    { bar: "bg-emerald-500",  badge: "bg-emerald-50 text-emerald-700 border-emerald-200",  score: "text-emerald-600"  },
  MEDIUM: { bar: "bg-amber-500",    badge: "bg-amber-50 text-amber-700 border-amber-200",      score: "text-amber-600"  },
  HIGH:   { bar: "bg-rose-500",     badge: "bg-rose-50 text-rose-700 border-rose-200",        score: "text-rose-600"    },
};

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

// ─── Metric Component ────────────────────────────────────────────────────────
function Metric({ label, value, accent, danger, warning, large }) {
  const cls = accent ? "text-blue-600" : danger ? "text-rose-600" : warning ? "text-amber-600" : "text-slate-900";
  return (
    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`${large ? "text-2xl" : "text-lg"} font-extrabold ${cls} leading-tight`}>{value}</p>
    </div>
  );
}

// ─── Assess Tab Component ─────────────────────────────────────────────────
function AssessTab({ onAssessed }) {
  const [clientId, setClientId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const assess = async () => {
    setError(""); setResult(null);
    const id = parseInt(clientId);
    if (!id || id <= 0) { setError("Enter a valid client ID (number)."); return; }
    setLoading(true);
    try {
      const res = await api.assessRisk(id);
      setResult(res);
      onAssessed?.();
    } catch (e) {
      setError(e.message || "Assessment failed");
    } finally {
      setLoading(false);
    }
  };

  const style = result ? (LEVEL_STYLES[result.risk_level] || LEVEL_STYLES.MEDIUM) : null;
  const stats = result?.payment_stats;

  return (
    <div className="space-y-4">
      {/* Input card */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Risk Assessment</h2>
            <p className="text-xs text-slate-400 mt-0.5">Scored from real payment history data</p>
          </div>
          <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200 px-2.5 py-1 rounded-full">
            AI-Powered Scoring
          </span>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 mb-2">Client ID</label>
              <input
                type="number"
                value={clientId}
                onChange={(e) => { setClientId(e.target.value); setError(""); setResult(null); }}
                onKeyDown={(e) => e.key === "Enter" && assess()}
                placeholder="Enter a client ID from payment history…"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
              />
            </div>
            <button
              onClick={assess}
              disabled={loading || !clientId}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition disabled:opacity-60 shadow-sm hover:shadow-md"
              style={{ background: loading ? "#94a3b8" : "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)" }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Assessing…
                </>
              ) : (
                <>
                  <Icon d={ShieldIcon} size={15} />
                  Assess Risk
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Only clients with existing payment records can be assessed.
            Client IDs with data: <span className="font-semibold text-slate-500">2, 3</span> (from your seeded data).
          </p>

          {error && (
            <div className="flex items-start gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
              <Icon d={AlertTriangle} size={16} className="text-rose-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-rose-700">Assessment failed</p>
                <p className="text-xs text-rose-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Score gauge */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Risk Score</h3>
              </div>
              <div className="p-6 text-center">
                <p className={`text-7xl font-extrabold tracking-tighter ${style.score}`}>
                  {result.risk_score}
                </p>
                <span className={`inline-block mt-3 px-5 py-1.5 rounded-full text-sm font-bold border ${style.badge}`}>
                  {result.risk_level}
                </span>

                <div className="mt-5">
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${style.bar}`}
                      style={{ width: `${result.risk_score}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                    <span>Low (0–30)</span>
                    <span>Medium (30–60)</span>
                    <span>High (60+)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Assessment Details</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Client ID</p>
                  <p className="text-base font-bold text-slate-900">#{result.client_id}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Recommendation</p>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">{result.recommendation}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Credit Limit</p>
                  <p className="text-2xl font-extrabold text-blue-600 tracking-tight">₹{fmt(result.credit_limit_usd)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment stats breakdown */}
          {stats && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Payment History Basis</h3>
                <p className="text-xs text-slate-400 mt-0.5">Risk score derived from these records</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                    <p className="text-2xl font-extrabold text-slate-800">{stats.total_invoices}</p>
                    <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Total invoices</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                    <p className="text-2xl font-extrabold text-emerald-600">{stats.on_time}</p>
                    <p className="text-[11px] font-semibold text-emerald-500 mt-0.5">Paid on time</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                    <p className="text-2xl font-extrabold text-amber-600">{stats.late_payments}</p>
                    <p className="text-[11px] font-semibold text-amber-500 mt-0.5">Late payments</p>
                  </div>
                </div>

                {/* On-time bar */}
                {stats.total_invoices > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>On-time rate</span>
                      <span className="font-semibold text-emerald-600">
                        {((stats.on_time / stats.total_invoices) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                        style={{ width: `${(stats.on_time / stats.total_invoices) * 100}%` }}
                      />
                      <div
                        className="bg-amber-400 h-full transition-all duration-700"
                        style={{ width: `${(stats.late_payments / stats.total_invoices) * 100}%` }}
                      />
                    </div>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs text-slate-400">On time</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-xs text-slate-400">Late</span>
                      </div>
                    </div>
                  </div>
                )}

                {stats.total_amount > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Total invoice value assessed</p>
                    <p className="text-xl font-bold text-slate-900">₹{fmt(stats.total_amount)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── History Tab ─────────────────────────────────────────────────────────────
function HistoryTab({ refresh }) {
  const [history, setHistory] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.riskHistory(PAGE_SIZE, page * PAGE_SIZE);
      setHistory(data.history || []);
      setTotal(data.total || 0);
    } catch (e) {
      setError(e.message || "Failed to load risk assessment history");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory, refresh]);

  const filtered = search.trim()
    ? history.filter(
        (h) =>
          h.client_id?.toString().includes(search) ||
          h.risk_level?.toLowerCase().includes(search.toLowerCase())
      )
    : history;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const getRiskStyle = (level) => {
    return LEVEL_STYLES[level] || LEVEL_STYLES.MEDIUM;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-sm">Risk Assessment History</h2>
          <p className="text-xs text-slate-400 mt-0.5">{total} total assessments</p>
        </div>
      </div>

      <div className="px-6 pt-4 pb-3">
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
            <Icon d={SearchIcon} size={14} />
          </div>
          <input type="text" placeholder="Search by client ID or risk level…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" />
        </div>
      </div>

      {error && (
        <div className="mx-6 mb-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 px-6">
          <div className="text-4xl mb-3">🛡️</div>
          <p className="text-sm font-semibold">{search ? "No results match your search" : "No risk assessments yet"}</p>
          {!search && <p className="text-xs mt-1">Use the Assess tab to evaluate client risk</p>}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-100">
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-2.5">Client ID</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2.5">Risk Score</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2.5">Risk Level</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2.5">Credit Limit</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2.5">Recommendation</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2.5 pr-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((row, i) => {
                const riskStyle = getRiskStyle(row.risk_level);
                return (
                  <tr key={row.id || i} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-6">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg">
                        #{row.client_id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${riskStyle.score}`}>
                          {row.risk_score}
                        </span>
                        <div className="flex-1 max-w-[60px]">
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${riskStyle.bar}`}
                              style={{ width: `${row.risk_score}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${riskStyle.badge}`}>
                        {row.risk_level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 text-xs">
                      ₹{fmt(row.credit_limit_usd)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs max-w-[200px] truncate">
                      {row.recommendation}
                    </td>
                    <td className="py-3.5 px-4 pr-6 text-slate-400 text-xs whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Icon d={ClockIcon} size={11} />
                        {row.created_at
                          ? new Date(row.created_at).toLocaleString("en-IN", {
                              day: "2-digit", month: "short", year: "numeric",
                              hour: "2-digit", minute: "2-digit",
                            })
                          : "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !search && (
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-400">Page {page + 1} of {totalPages} · {total} records</p>
          <div className="flex items-center gap-2">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition">
              <Icon d={ChevronL} size={12} /> Prev
            </button>
            <span className="text-xs font-semibold text-slate-500 px-1">{page + 1}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition">
              Next <Icon d={ChevronR} size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════════════════════
export default function RiskAssessment() {
  const [activeTab, setActiveTab] = useState("assess");
  const [historyKey, setHistoryKey] = useState(0);

  const tabs = [
    { id: "assess", label: "Assess", icon: ShieldIcon },
    { id: "history", label: "History", icon: ClockIcon },
  ];

  return (
    <div className="p-6 space-y-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Page header */}
      <div className="mb-1">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Risk Assessment</h1>
        <p className="text-xs text-slate-400 mt-0.5">AI-driven client credit & compliance risk scoring</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-white border border-slate-200 rounded-xl w-fit shadow-sm">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === t.id
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}>
            <Icon d={t.icon} size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "assess" && <AssessTab onAssessed={() => setHistoryKey(k => k + 1)} />}
      {activeTab === "history" && <HistoryTab refresh={historyKey} />}
    </div>
  );
}