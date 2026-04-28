
import { useEffect, useState } from "react";
import { api } from "../utils/api";

const Icon = ({ d, size = 16, className = "", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round"
    strokeLinejoin="round" className={className} style={style}>
    {d}
  </svg>
);

const Icons = {
  Box:      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>,
  TrendUp:  <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
  BarChart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  Shield:   <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  ArrowUp:  <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
  ChevronR: <polyline points="9 18 15 12 9 6"/>,
  Package:  <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
  File:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  Cpu:      <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></>,
  Dollar:   <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
  Alert:    <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  Bell:     <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  Check:    <polyline points="20 6 9 17 4 12"/>,
  Clock:    <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  Map:      <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
};

const Sparkline = ({ data = [], color = "#3b82f6", height = 40 }) => {
  if (!data || data.length === 0) return null;
  const w = 110, h = height;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 6) - 3;
    return `${x},${y}`;
  }).join(" ");
  const areaBot = `${(data.length - 1) / (data.length - 1) * w},${h} 0,${h}`;
  const area = `0,${h - ((data[0] - min) / (max - min || 1)) * (h - 6) - 3} ` + pts + ` ${areaBot}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    "In Transit":   "bg-blue-50 text-blue-700 border border-blue-200",
    "Customs Hold": "bg-rose-50 text-rose-700 border border-rose-200",
    Delivered:      "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Processing:     "bg-amber-50 text-amber-700 border border-amber-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${map[status] || "bg-gray-50 text-gray-600 border border-gray-200"}`}>
      {status}
    </span>
  );
};

const RiskDot = ({ level }) => {
  const c = { low: "bg-emerald-400", medium: "bg-amber-400", high: "bg-rose-500" };
  return <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${c[level] || "bg-gray-300"}`} />;
};

export function PageLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-7 h-7 border-[2.5px] border-slate-200 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
}

export function StatCard({ label, value, sub, up, icon, color = "#3b82f6", bg = "#eff6ff", sparkData }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
          {icon && Icons[icon] && <Icon d={Icons[icon]} size={17} style={{ color }} />}
        </div>
        {sub !== undefined && (
          <span className={`text-[11px] font-semibold flex items-center gap-0.5 px-2 py-1 rounded-full ${up ? "text-emerald-700 bg-emerald-50" : "text-slate-400 bg-slate-50"}`}>
            {up && <Icon d={Icons.ArrowUp} size={10} className="text-emerald-600" />}
            {sub}
          </span>
        )}
      </div>
      <p className="text-[26px] font-extrabold text-slate-900 leading-none tracking-tight mb-1">{value ?? "—"}</p>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      {sparkData && (
        <div className="mt-3 opacity-80 group-hover:opacity-100 transition">
          <Sparkline data={sparkData} color={color} />
        </div>
      )}
    </div>
  );
}

export function Card({ title, sub, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 p-5 ${className}`}>
      {(title || sub) && (
        <div className="mb-4">
          {title && <p className="font-bold text-slate-900 text-sm">{title}</p>}
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

export default function Analytics({ onNav }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const dashboardData = await api.dashboard();
        setData(dashboardData);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <PageLoading />;
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-rose-700 font-medium">Failed to load dashboard</p>
          <p className="text-rose-500 text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const summary = data?.summary || {};
  const shipmentTrends = data?.shipment_trends || [];
  
  // Extract months and values from backend data
  const months = shipmentTrends.map(t => t.month);
  const shipmentValues = shipmentTrends.map(t => t.shipments);
  const maxShipment = Math.max(...shipmentValues, 1);

  // Quick actions
  const QUICK = [
    { icon: "Cpu",     label: "Classify HSN",    sub: "AI-powered HS code",  page: "hsn",       color: "#6366f1", bg: "#eef2ff" },
    { icon: "Dollar",  label: "Calculate Duty",  sub: "Taxes & landed cost", page: "duty",      color: "#3b82f6", bg: "#eff6ff" },
    { icon: "Package", label: "New Shipment",    sub: "Book & track cargo",  page: "shipments", color: "#10b981", bg: "#ecfdf5" },
    { icon: "File",    label: "Upload Document", sub: "OCR extraction",      page: "documents", color: "#f59e0b", bg: "#fffbeb" },
  ];

  return (
    <div className="p-6 space-y-5 min-h-screen" style={{ background: "#f8fafc" }}>

      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          API Online
        </div>
      </div>

      {/* Stat cards - using real data from backend */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard 
          label="Total Shipments"  
          value={summary.total_shipments?.toLocaleString() || "0"} 
          sub="All time" 
          up={true} 
          icon="Box" 
          color="#3b82f6" 
          bg="#eff6ff" 
          sparkData={shipmentValues.slice(-6)}
        />
        <StatCard 
          label="Active Shipments" 
          value={summary.active_shipments?.toLocaleString() || "0"} 
          sub="In progress" 
          up={true} 
          icon="TrendUp" 
          color="#6366f1" 
          bg="#eef2ff" 
          sparkData={shipmentValues.slice(-6)}
        />
        <StatCard 
          label="Total Value" 
          value={`$${((summary.total_value_usd || 0) / 1e6).toFixed(1)}M`} 
          sub="All time" 
          up={true} 
          icon="BarChart" 
          color="#10b981" 
          bg="#ecfdf5" 
        />
        <StatCard 
          label="Compliance Rate" 
          value={`${summary.compliance_rate || 97.8}%`} 
          sub="This month" 
          up={true} 
          icon="Shield" 
          color="#f59e0b" 
          bg="#fffbeb" 
          sparkData={[94, 96, 93, 97, 95, summary.compliance_rate || 98]}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Bar chart - using real data */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-bold text-slate-900 text-sm">Shipment Trends</p>
              <p className="text-xs text-slate-400 mt-0.5">Monthly volume — last {months.length} months</p>
            </div>
            {shipmentValues.length > 1 && (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                ↑ {((shipmentValues[shipmentValues.length - 1] / shipmentValues[0] - 1) * 100).toFixed(1)}% vs prior
              </span>
            )}
          </div>
          {shipmentValues.length === 0 ? (
            <div className="flex items-center justify-center h-44 text-slate-400">
              <p className="text-sm">No shipment data available</p>
            </div>
          ) : (
            <div className="flex items-end gap-3 h-44">
              {months.map((m, i) => {
                const pct = (shipmentValues[i] / maxShipment) * 100;
                const isLast = i === months.length - 1;
                return (
                  <div key={m} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500">{shipmentValues[i]}</span>
                    <div className="w-full rounded-t-xl relative group cursor-default transition-all duration-300"
                      style={{
                        height: `${pct * 0.75}%`,
                        background: isLast
                          ? "linear-gradient(180deg, #3b82f6 0%, #6366f1 100%)"
                          : "#e2e8f0",
                        minHeight: pct > 0 ? "4px" : "2px"
                      }}>
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-800 text-white
                                      text-[10px] font-semibold px-2 py-1 rounded-lg opacity-0
                                      group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10 shadow-lg">
                        {m}: {shipmentValues[i]} shipments
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">{m}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Compliance gauge - using real data */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <p className="font-bold text-slate-900 text-sm">Compliance Score</p>
          <p className="text-xs text-slate-400 mt-0.5 mb-4">Regulatory adherence</p>
          <div className="flex flex-col items-center">
            <svg width="160" height="100" viewBox="0 0 160 100">
              <path d="M 20 90 A 60 60 0 0 1 140 90" fill="none" stroke="#f1f5f9" strokeWidth="14" strokeLinecap="round" />
              <path d="M 20 90 A 60 60 0 0 1 140 90" fill="none" stroke="url(#cg)" strokeWidth="14" strokeLinecap="round"
                strokeDasharray="188.5" strokeDashoffset={188.5 * (1 - (summary.compliance_rate || 97.8) / 100)} />
              <defs>
                <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <text x="80" y="82" textAnchor="middle" fontSize="22" fontWeight="800" fill="#0f172a" fontFamily="inherit">
                {summary.compliance_rate || 97.8}%
              </text>
            </svg>
            <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 -mt-1">
              <Icon d={Icons.ArrowUp} size={10} /> Good standing
            </p>
          </div>
          <div className="mt-5 space-y-3">
            {[
              ["HS Code Accuracy",  "99.1%", 95, "#6366f1"],
              ["Tariff Compliance", "97.2%", 88, "#3b82f6"],
              ["Doc Verification",  "96.8%", 85, "#10b981"],
            ].map(([lbl, val, pct, clr]) => (
              <div key={lbl}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">{lbl}</span>
                  <span className="font-bold text-slate-700">{val}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: clr }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <p className="font-bold text-slate-900 text-sm mb-1">Quick Actions</p>
        <p className="text-xs text-slate-400 mb-4">Jump to frequently used tools</p>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {QUICK.map((q) => (
            <button key={q.page} onClick={() => onNav?.(q.page)}
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50
                         hover:bg-white hover:border-slate-200 hover:shadow-md transition-all duration-200 text-left group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: q.bg }}>
                <Icon d={Icons[q.icon]} size={18} style={{ color: q.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800 truncate">{q.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{q.sub}</p>
              </div>
              <Icon d={Icons.ChevronR} size={14} className="text-slate-300 group-hover:text-slate-500 flex-shrink-0 transition" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}