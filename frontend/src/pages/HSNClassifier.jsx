
import { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";
import { Card } from "./Analytics";

// ─── Icon ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, className = "", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={style}>{d}</svg>
);
const SearchIcon = <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>;
const ArrowUpIcon = <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>;
const ChevronL = <polyline points="15 18 9 12 15 6"/>;
const ChevronR = <polyline points="9 18 15 12 9 6"/>;
const SparkIcon = <><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></>;
const ClockIcon = <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>;

// ─── Data ─────────────────────────────────────────────────────────────────────
const EXAMPLES = [
  { label: "Laptop",      text: "dell xps laptop core i7 16gb ram" },
  { label: "Smartphone",  text: "iphone 15 pro max 256gb" },
  { label: "Medicine",    text: "paracetamol 500mg tablet pain relief" },
  { label: "Vehicle",     text: "toyota camry sedan 2.5l petrol" },
  { label: "Garment",     text: "cotton formal shirt men full sleeves" },
  { label: "Machinery",   text: "excavator construction equipment" },
  { label: "Smart Watch", text: "samsung galaxy watch 6 fitness tracker" },
  { label: "Earbuds",     text: "boat airdopes 141 wireless earbuds" },
];

const COUNTRIES = ["IN", "US", "UK", "AE", "SG"];
const COUNTRY_NAMES = { IN: "India", US: "USA", UK: "United Kingdom", AE: "UAE", SG: "Singapore" };

const SOURCE_BADGE = {
  keyword_rule:      { label: "Keyword Rule",  cls: "bg-violet-50 text-violet-700 border-violet-200" },
  ml_ensemble:       { label: "ML Ensemble",   cls: "bg-blue-50 text-blue-700 border-blue-200" },
  ml_low_confidence: { label: "Low Confidence", cls: "bg-rose-50 text-rose-700 border-rose-200" },
  validation:        { label: "Invalid",        cls: "bg-slate-100 text-slate-500 border-slate-200" },
  error:             { label: "Error",          cls: "bg-rose-50 text-rose-700 border-rose-200" },
};

// ─── Confidence Bar ────────────────────────────────────────────────────────────
function ConfidenceBar({ value }) {
  const pct = Math.round(value * 100);
  const color = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";
  const bg    = pct >= 80 ? "#ecfdf5" : pct >= 60 ? "#fffbeb" : "#fff1f2";
  const text  = pct >= 80 ? "text-emerald-700" : pct >= 60 ? "text-amber-600" : "text-rose-600";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: bg }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className={`text-sm font-bold tabular-nums ${text}`}>{pct}%</span>
    </div>
  );
}

// ─── Result Metric ────────────────────────────────────────────────────────────
function Metric({ label, value, accent, warning, large }) {
  const cls = accent ? "text-blue-600" : warning ? "text-amber-600" : "text-slate-900";
  return (
    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`${large ? "text-2xl" : "text-lg"} font-extrabold ${cls} leading-tight`}>{value}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Classifier Tab
// ─────────────────────────────────────────────────────────────────────────────
function ClassifierTab({ onClassified }) {
  const [desc, setDesc]       = useState("");
  const [country, setCountry] = useState("IN");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const classify = async () => {
    setError(""); setResult(null);
    if (!desc.trim()) { setError("Please enter a product description."); return; }
    setLoading(true);
    try {
      const d = await api.classifyHSN({ product_description: desc, country });
      setResult(d);
      onClassified?.();
    } catch (e) {
      setError(e.message || "Classification failed.");
    } finally {
      setLoading(false);
    }
  };

  const srcBadge = result?.source ? SOURCE_BADGE[result.source] : null;
  const conf = result ? Math.round(result.confidence * 100) : 0;

  return (
    <div className="space-y-4">

      {/* Input card */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {/* Header stripe */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">HSN Code Classifier</h2>
            <p className="text-xs text-slate-400 mt-0.5">AI-powered Harmonized System classification</p>
          </div>
          <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200 px-2.5 py-1 rounded-full">
            Ensemble LR + SVC · ~95%+ Accuracy
          </span>
        </div>

        <div className="p-6 space-y-4">
          {/* Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Product Description</label>
            <div className="relative">
              <textarea
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) classify(); }}
                placeholder="e.g. dell xps laptop core i7 16gb ram, samsung galaxy s24 ultra 5g…"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 resize-none transition"
              />
              <div className="absolute bottom-3 right-3 text-[10px] text-slate-300 font-medium">Ctrl+Enter to classify</div>
            </div>
          </div>

          {/* Country + Button row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 mb-2">Country / Jurisdiction</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition bg-white">
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c} — {COUNTRY_NAMES[c]}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={classify} disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition disabled:opacity-60 shadow-sm hover:shadow-md"
                style={{ background: loading ? "#94a3b8" : "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)" }}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Classifying…
                  </>
                ) : (
                  <>
                    <Icon d={SparkIcon} size={15} />
                    Classify with AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
              <span className="mt-0.5">⚠️</span>
              {error}
            </div>
          )}

          {/* Examples */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Quick Examples</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button key={ex.label} onClick={() => setDesc(ex.text)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${
                    desc === ex.text
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                  }`}>
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Result card */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-900 text-sm mr-1">Classification Result</h3>
            {result.hsn_code ? (
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">✓ Classified Successfully</span>
            ) : (
              <span className="text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full">⚠ Classification Failed</span>
            )}
            {srcBadge && (
              <span className={`text-[11px] font-semibold border px-2.5 py-1 rounded-full ${srcBadge.cls}`}>{srcBadge.label}</span>
            )}
            {result.manual_verification_required && (
              <span className="text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">Manual Verification Recommended</span>
            )}
          </div>

          {result.hsn_code ? (
            <div className="p-6">
              {/* HSN hero */}
              <div className="flex items-center gap-4 mb-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div>
                  <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-1">HSN Code</p>
                  <p className="text-4xl font-black text-blue-700 tracking-widest font-mono">{result.hsn_code}</p>
                </div>
                <div className="flex-1 border-l border-blue-200 pl-4">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Category</p>
                  <p className="text-sm font-semibold text-slate-700">{result.description}</p>
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <Metric label="Country"       value={`${result.country} — ${COUNTRY_NAMES[result.country]}`} />
                <Metric label="Basic Duty"    value={`${(result.duty_rate * 100).toFixed(1)}%`} />
                <Metric label="GST Rate"      value={`${(result.gst_rate * 100).toFixed(1)}%`} />
                <Metric label="Adjusted Duty" value={`${(result.adjusted_duty * 100).toFixed(1)}%`} warning />
                <Metric label="Conf. Level"   value={result.confidence_level} accent />
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Confidence</p>
                  <ConfidenceBar value={result.confidence} />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <p className="text-sm text-slate-500">{result.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// History Tab
// ─────────────────────────────────────────────────────────────────────────────
function HistoryTab({ refresh }) {
  const [history, setHistory] = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(0);
  const PAGE_SIZE = 10;

  const fetchHistory = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await api.hsnHistory(PAGE_SIZE, page * PAGE_SIZE);
      setHistory(data.history || []);
      setTotal(data.total || 0);
    } catch (e) {
      setError(e.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchHistory(); }, [fetchHistory, refresh]);

  const filtered = search.trim()
    ? history.filter(h =>
        h.product_description?.toLowerCase().includes(search.toLowerCase()) ||
        h.predicted_hsn?.includes(search)
      )
    : history;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-sm">Classification History</h2>
          <p className="text-xs text-slate-400 mt-0.5">{total} total classifications</p>
        </div>
      </div>

      <div className="px-6 pt-4 pb-3">
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
            <Icon d={SearchIcon} size={14} />
          </div>
          <input type="text" placeholder="Search by product or HSN code…"
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
          <div className="text-4xl mb-3">📋</div>
          <p className="text-sm font-semibold">{search ? "No results match your search" : "No classifications yet"}</p>
          {!search && <p className="text-xs mt-1">Use the Classify tab to get started</p>}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-100">
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-2.5">Product</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2.5">HSN Code</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2.5">Confidence</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-2.5 pr-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((row, i) => {
                const pct = row.confidence_score != null ? Math.round(row.confidence_score * 100) : null;
                const confCls = pct == null ? "" : pct >= 80 ? "bg-emerald-50 text-emerald-700" : pct >= 60 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";
                return (
                  <tr key={row.result_id || i} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-6 max-w-xs">
                      <p className="text-slate-800 font-medium truncate text-sm" title={row.product_description}>
                        {row.product_description}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      {row.predicted_hsn ? (
                        <span className="font-mono text-blue-600 font-bold bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-lg text-xs">
                          {row.predicted_hsn}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs italic">Unclassified</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {pct != null ? (
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${confCls}`}>{pct}%</span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function HSNClassifier() {
  const [activeTab, setActiveTab] = useState("classify");
  const [historyKey, setHistoryKey] = useState(0);

  const tabs = [
    { id: "classify", label: "Classify", icon: SparkIcon },
    { id: "history",  label: "History",  icon: ClockIcon },
  ];

  return (
    <div className="p-6 max-w-3xl space-y-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>

      {/* Page header */}
      <div className="mb-1">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">HSN Classifier</h1>
        <p className="text-xs text-slate-400 mt-0.5">Harmonized System code classification powered by ML ensemble</p>
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

      {activeTab === "classify" && <ClassifierTab onClassified={() => setHistoryKey(k => k + 1)} />}
      {activeTab === "history"  && <HistoryTab refresh={historyKey} />}
    </div>
  );
}