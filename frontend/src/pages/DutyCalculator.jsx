
import { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";
const Icon = ({ d, size = 16, className = "", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={style}>{d}</svg>
);

const SearchIcon = <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>;
const DollarIcon = <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>;
const ChevronL = <polyline points="15 18 9 12 15 6"/>;
const ChevronR = <polyline points="9 18 15 12 9 6"/>;
const ClockIcon = <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>;
const PackageIcon = <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>;
const TrendingUp = <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>;
const CalculatorIcon = <><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="10" y2="16"/><line x1="14" y1="16" x2="16" y2="16"/></>;

const COUNTRIES = ["IN", "US", "UK", "AE", "SG"];
const COUNTRY_NAMES = { IN: "India", US: "USA", UK: "United Kingdom", AE: "UAE", SG: "Singapore" };

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

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

// ─── Calculator Tab ─────────────────────────────────────────────────────────
function CalculatorTab({ onCalculated }) {
  const [form, setForm] = useState({
    hsn_code: "", product_value: "", quantity: "",
    origin_country: "IN", destination_country: "IN",
    freight_cost: "0", insurance_cost: "0",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const calculate = async () => {
    setError(""); setResult(null);
    const { hsn_code, product_value, quantity } = form;
    if (!hsn_code || !product_value || !quantity) {
      setError("Please fill HSN code, product value and quantity.");
      return;
    }
    setLoading(true);
    try {
      const d = await api.calculateDuty({
        hsn_code,
        product_value: parseFloat(product_value),
        quantity: parseInt(quantity),
        origin_country: form.origin_country,
        destination_country: form.destination_country,
        freight_cost: parseFloat(form.freight_cost) || 0,
        insurance_cost: parseFloat(form.insurance_cost) || 0,
      });
      setResult(d);
      onCalculated?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Input card */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Duty & Tax Calculator</h2>
            <p className="text-xs text-slate-400 mt-0.5">Basic customs duty, IGST, anti-dumping & landed cost</p>
          </div>
          <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-full">
            Real-time calculation
          </span>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">HSN Code</label>
              <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
                placeholder="e.g. 84713000" value={form.hsn_code} onChange={set("hsn_code")} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Product value (USD per unit)</label>
              <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
                type="number" placeholder="1000" value={form.product_value} onChange={set("product_value")} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Quantity</label>
              <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
                type="number" placeholder="10" value={form.quantity} onChange={set("quantity")} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Origin country</label>
              <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition bg-white" 
                value={form.origin_country} onChange={set("origin_country")}>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c} — {COUNTRY_NAMES[c]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Destination country</label>
              <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition bg-white" 
                value={form.destination_country} onChange={set("destination_country")}>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c} — {COUNTRY_NAMES[c]}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Freight cost (USD)</label>
              <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
                type="number" value={form.freight_cost} onChange={set("freight_cost")} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Insurance cost (USD)</label>
              <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
                type="number" value={form.insurance_cost} onChange={set("insurance_cost")} />
            </div>
          </div>

          <button onClick={calculate} disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition disabled:opacity-60 shadow-sm hover:shadow-md"
            style={{ background: loading ? "#94a3b8" : "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)" }}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Icon d={CalculatorIcon} size={15} />
                Calculate Duties
              </>
            )}
          </button>

          {error && (
            <div className="flex items-start gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
              <span className="mt-0.5">⚠️</span>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Result card */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Duty Breakdown</h3>
          </div>

          <div className="p-6">
            {/* Hero amount */}
            <div className="flex items-center gap-4 mb-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div>
                <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-1">Landed Cost</p>
                <p className="text-4xl font-black text-blue-700">${fmt(result.landed_cost)}</p>
              </div>
              <div className="flex-1 border-l border-blue-200 pl-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Effective Duty Rate</p>
                <p className="text-2xl font-bold text-amber-600">{result.effective_rate_pct.toFixed(2)}%</p>
              </div>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <Metric label="Assessable Value" value={`$${fmt(result.assessable_value)}`} />
              <Metric label="Basic Customs Duty" value={`$${fmt(result.basic_customs_duty)}`} />
              <Metric label="Anti-Dumping Duty" value={`$${fmt(result.anti_dumping_duty)}`} warning />
              <Metric label="Social Welfare Surcharge" value={`$${fmt(result.social_welfare_surcharge)}`} />
              <Metric label="IGST" value={`$${fmt(result.igst)}`} />
              <Metric label="Total Duty" value={`$${fmt(result.total_duty)}`} danger />
            </div>

            {/* Visual breakdown bar */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Cost breakdown</p>
              <div className="h-3 rounded-full overflow-hidden flex">
                {[
                  { value: result.assessable_value, color: "bg-blue-400" },
                  { value: result.basic_customs_duty, color: "bg-blue-600" },
                  { value: result.anti_dumping_duty, color: "bg-amber-400" },
                  { value: result.igst, color: "bg-purple-400" },
                ].map((seg, i) => {
                  const pct = (seg.value / result.landed_cost) * 100;
                  return pct > 0 ? (
                    <div key={i} className={`${seg.color} h-full`} style={{ width: `${pct}%` }} />
                  ) : null;
                })}
              </div>
              <div className="flex gap-4 mt-2 flex-wrap">
                {[
                  { label: "Assessable value", color: "bg-blue-400" },
                  { label: "Basic duty", color: "bg-blue-600" },
                  { label: "Anti-dumping", color: "bg-amber-400" },
                  { label: "IGST", color: "bg-purple-400" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                    <span className="text-xs text-slate-400">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
      const data = await api.dutyHistory(PAGE_SIZE, page * PAGE_SIZE);
      setHistory(data.history || []);
      setTotal(data.total || 0);
    } catch (e) {
      setError(e.message || "Failed to load duty history");
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
          h.hsn_code?.includes(search) ||
          h.origin_country?.includes(search) ||
          h.destination_country?.includes(search)
      )
    : history;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-sm">Duty Calculation History</h2>
          <p className="text-xs text-slate-400 mt-0.5">{total} total calculations</p>
        </div>
      </div>

      <div className="px-6 pt-4 pb-3">
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
            <Icon d={SearchIcon} size={14} />
          </div>
          <input type="text" placeholder="Search by HSN code or country…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" />
        </div>
      </div>

      {error && (
        <div className="mx-6 mb-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 px-6">
          <div className="text-4xl mb-3">💰</div>
          <p className="text-sm font-semibold">{search ? "No results match your search" : "No duty calculations yet"}</p>
          {!search && <p className="text-xs mt-1">Use the Calculate tab to get started</p>}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-100">
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-2.5">HSN Code</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2.5">Route</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2.5">Qty</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2.5">Landed Cost</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2.5 pr-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((row, i) => (
                <tr key={row.calculation_id || i} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-6">
                    <span className="font-mono text-blue-600 font-bold bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-lg text-xs">
                      {row.hsn_code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-600 text-xs font-medium flex items-center gap-1">
                      {row.origin_country} <Icon d={ChevronR} size={10} /> {row.destination_country}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-sm font-semibold">
                    {row.quantity}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ${fmt(row.landed_cost)}
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
              ))}
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
export default function DutyCalculator() {
  const [activeTab, setActiveTab] = useState("calculate");
  const [historyKey, setHistoryKey] = useState(0);

  const tabs = [
    { id: "calculate", label: "Calculate", icon: CalculatorIcon },
    { id: "history", label: "History", icon: ClockIcon },
  ];

  return (
    <div className="p-6 space-y-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Page header */}
      <div className="mb-1">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Duty Calculator</h1>
        <p className="text-xs text-slate-400 mt-0.5">Calculate customs duties, taxes, and landed cost</p>
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

      {activeTab === "calculate" && <CalculatorTab onCalculated={() => setHistoryKey(k => k + 1)} />}
      {activeTab === "history" && <HistoryTab refresh={historyKey} />}
    </div>
  );
}