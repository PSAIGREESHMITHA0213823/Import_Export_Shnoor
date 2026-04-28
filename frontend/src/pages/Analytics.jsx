// import { useEffect, useState, useRef } from "react";
// import { api } from "../utils/api";
// import { Chart, registerables } from "chart.js";
// Chart.register(...registerables);

// export default function Analytics({ onNav }) {
//   const [data, setData]     = useState(null);
//   const [loading, setLoading] = useState(true);
//   const trendRef = useRef(null);
//   const valueRef = useRef(null);
//   const trendChart = useRef(null);
//   const valueChart = useRef(null);

//   useEffect(() => {
//     api.dashboard().then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
//   }, []);

//   useEffect(() => {
//     if (!data) return;
//     const months = data.shipment_trends.map((t) => t.month);
//     const ships  = data.shipment_trends.map((t) => t.shipments);
//     const values = data.shipment_trends.map((t) => t.value_usd);

//     if (trendChart.current) trendChart.current.destroy();
//     trendChart.current = new Chart(trendRef.current, {
//       type: "bar",
//       data: {
//         labels: months,
//         datasets: [{ label: "Shipments", data: ships, backgroundColor: "rgba(26,58,107,0.85)", borderRadius: 6 }],
//       },
//       options: {
//         responsive: true, maintainAspectRatio: false,
//         plugins: { legend: { display: false } },
//         scales: { x: { grid: { display: false } }, y: { grid: { color: "rgba(0,0,0,0.05)" } } },
//       },
//     });

//     if (valueChart.current) valueChart.current.destroy();
//     valueChart.current = new Chart(valueRef.current, {
//       type: "doughnut",
//       data: {
//         labels: months,
//         datasets: [{
//           data: values,
//           backgroundColor: ["#1a3a6b","#3a6abf","#c8992a","#6b8fd6","#e8c875","#8ab4e0"],
//           borderWidth: 0,
//         }],
//       },
//       options: {
//         responsive: true, maintainAspectRatio: false,
//         plugins: { legend: { position: "bottom", labels: { font: { size: 11 }, boxWidth: 10 } } },
//         cutout: "65%",
//       },
//     });

//     return () => {
//       trendChart.current?.destroy();
//       valueChart.current?.destroy();
//     };
//   }, [data]);

//   if (loading) return <PageLoading />;

//   const s = data?.summary || {};

//   const QUICK = [
//     { icon: "🔍", title: "Classify HSN",      sub: "AI-powered HS code",    page: "hsn"       },
//     { icon: "💰", title: "Calculate Duty",    sub: "Taxes & landed cost",    page: "duty"      },
//     { icon: "📦", title: "New Shipment",      sub: "Book & track cargo",     page: "shipments" },
//     { icon: "📄", title: "Upload Document",   sub: "OCR extraction",         page: "documents" },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Stat cards */}
//       <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
//         <StatCard label="Total Shipments"  value={s.total_shipments}         sub="Portfolio"     />
//         <StatCard label="Active Shipments" value={s.active_shipments}        sub="In progress"   />
//         <StatCard label="Total Value (USD)"value={`$${(s.total_value_usd/1e6).toFixed(2)}M`} sub="All time" />
//         <StatCard label="Compliance Rate"  value={`${s.compliance_rate}%`}   sub="This month" up />
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         <Card className="xl:col-span-2" title="Shipment Trends" sub="Monthly shipment volume">
//           <div className="h-56"><canvas ref={trendRef} /></div>
//         </Card>
//         <Card title="Value by Month" sub="USD distribution">
//           <div className="h-56"><canvas ref={valueRef} /></div>
//         </Card>
//       </div>

//       {/* Quick actions */}
//       <Card title="Quick Actions">
//         <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
//           {QUICK.map((q) => (
//             <button key={q.page} onClick={() => onNav(q.page)}
//               className="flex flex-col items-start gap-1 p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition text-left">
//               <span className="text-2xl">{q.icon}</span>
//               <span className="font-semibold text-sm text-gray-800">{q.title}</span>
//               <span className="text-xs text-gray-400">{q.sub}</span>
//             </button>
//           ))}
//         </div>
//       </Card>
//     </div>
//   );
// }

// export function StatCard({ label, value, sub, up }) {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 p-5">
//       <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">{label}</p>
//       <p className="text-3xl font-extrabold tracking-tight text-gray-900">{value ?? "—"}</p>
//       <p className={`text-xs mt-1 ${up ? "text-green-600" : "text-gray-400"}`}>{sub}</p>
//     </div>
//   );
// }

// export function Card({ title, sub, children, className = "" }) {
//   return (
//     <div className={`bg-white rounded-2xl border border-gray-100 p-5 ${className}`}>
//       {(title || sub) && (
//         <div className="mb-4">
//           {title && <p className="font-bold text-gray-900">{title}</p>}
//           {sub   && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
//         </div>
//       )}
//       {children}
//     </div>
//   );
// }

// export function PageLoading() {
//   return (
//     <div className="flex items-center justify-center h-64">
//       <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
//     </div>
//   );
// }

import { useEffect, useState } from "react";

// ─── Icon primitive ───────────────────────────────────────────────────────────
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

// ─── Sparkline ────────────────────────────────────────────────────────────────
const Sparkline = ({ data = [], color = "#3b82f6", height = 40 }) => {
  if (!data.length) return null;
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

// ─── Status Badge ─────────────────────────────────────────────────────────────
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

// ─── Risk Indicator ───────────────────────────────────────────────────────────
const RiskDot = ({ level }) => {
  const c = { low: "bg-emerald-400", medium: "bg-amber-400", high: "bg-rose-500" };
  return <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${c[level] || "bg-gray-300"}`} />;
};

// ─── Exports ──────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const SHIPMENT_TREND = [42, 58, 51, 74, 63, 89];

const RECENT_SHIPMENTS = [
  { id: "SH-20481", origin: "Mumbai",  dest: "Hamburg",    status: "In Transit",   value: "$48,200", date: "Dec 18", risk: "low"    },
  { id: "SH-20480", origin: "Chennai", dest: "Rotterdam",  status: "Customs Hold", value: "$92,750", date: "Dec 17", risk: "high"   },
  { id: "SH-20479", origin: "Delhi",   dest: "Dubai",      status: "Delivered",    value: "$31,400", date: "Dec 16", risk: "low"    },
  { id: "SH-20478", origin: "Kolkata", dest: "Singapore",  status: "Processing",   value: "$67,100", date: "Dec 15", risk: "medium" },
  { id: "SH-20477", origin: "Pune",    dest: "London",     status: "Delivered",    value: "$24,850", date: "Dec 14", risk: "low"    },
];

const ALERTS = [
  { type: "warning", msg: "SH-20480 flagged for customs review",           time: "2h ago" },
  { type: "info",    msg: "3 HS codes pending AI review",                  time: "4h ago" },
  { type: "success", msg: "Duty updated for EU tariff changes",            time: "6h ago" },
  { type: "warning", msg: "Doc expiry: Certificate of Origin #1082",       time: "1d ago" },
];

const QUICK = [
  { icon: "Cpu",     label: "Classify HSN",    sub: "AI-powered HS code",  page: "hsn",       color: "#6366f1", bg: "#eef2ff" },
  { icon: "Dollar",  label: "Calculate Duty",  sub: "Taxes & landed cost", page: "duty",      color: "#3b82f6", bg: "#eff6ff" },
  { icon: "Package", label: "New Shipment",    sub: "Book & track cargo",  page: "shipments", color: "#10b981", bg: "#ecfdf5" },
  { icon: "File",    label: "Upload Document", sub: "OCR extraction",      page: "documents", color: "#f59e0b", bg: "#fffbeb" },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
export default function Analytics({ onNav }) {
  const STAT_CARDS = [
    { label: "Total Shipments",  value: "1,284", sub: "+12.4%", up: true, icon: "Box",      color: "#3b82f6", bg: "#eff6ff", sparkData: [40, 55, 48, 72, 61, 89] },
    { label: "Active Shipments", value: "47",    sub: "+3 today", up: true, icon: "TrendUp", color: "#6366f1", bg: "#eef2ff", sparkData: [20, 28, 24, 35, 30, 47] },
    { label: "Portfolio Value",  value: "$8.4M", sub: "+18.2%", up: true, icon: "BarChart",  color: "#10b981", bg: "#ecfdf5", sparkData: [12, 18, 15, 24, 21, 31] },
    { label: "Compliance Rate",  value: "97.8%", sub: "+1.2%",  up: true, icon: "Shield",   color: "#f59e0b", bg: "#fffbeb", sparkData: [94, 96, 93, 97, 95, 98] },
  ];

  return (
    <div className="p-6 space-y-5 min-h-screen" style={{ background: "#f8fafc" }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">Last updated: Dec 18, 2024 · 09:41 AM</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          API Online
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((sc) => <StatCard key={sc.label} {...sc} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Bar chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-bold text-slate-900 text-sm">Shipment Trends</p>
              <p className="text-xs text-slate-400 mt-0.5">Monthly volume — last 6 months</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">↑ 41.3% vs prior period</span>
          </div>
          <div className="flex items-end gap-3 h-44">
            {MONTHS.map((m, i) => {
              const pct = (SHIPMENT_TREND[i] / Math.max(...SHIPMENT_TREND)) * 100;
              const isLast = i === MONTHS.length - 1;
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500">{SHIPMENT_TREND[i]}</span>
                  <div className="w-full rounded-t-xl relative group cursor-default transition-all duration-300"
                    style={{
                      height: `${pct * 0.75}%`,
                      background: isLast
                        ? "linear-gradient(180deg, #3b82f6 0%, #6366f1 100%)"
                        : "#e2e8f0",
                    }}>
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-800 text-white
                                    text-[10px] font-semibold px-2 py-1 rounded-lg opacity-0
                                    group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10 shadow-lg">
                      {m}: {SHIPMENT_TREND[i]} shipments
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">{m}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance gauge */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <p className="font-bold text-slate-900 text-sm">Compliance Score</p>
          <p className="text-xs text-slate-400 mt-0.5 mb-4">Regulatory adherence</p>
          <div className="flex flex-col items-center">
            <svg width="160" height="100" viewBox="0 0 160 100">
              <path d="M 20 90 A 60 60 0 0 1 140 90" fill="none" stroke="#f1f5f9" strokeWidth="14" strokeLinecap="round" />
              <path d="M 20 90 A 60 60 0 0 1 140 90" fill="none" stroke="url(#cg)" strokeWidth="14" strokeLinecap="round"
                strokeDasharray="188.5" strokeDashoffset={188.5 * (1 - 0.978)} />
              <defs>
                <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <text x="80" y="82" textAnchor="middle" fontSize="22" fontWeight="800" fill="#0f172a" fontFamily="inherit">97.8%</text>
            </svg>
            <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 -mt-1">
              <Icon d={Icons.ArrowUp} size={10} /> +1.2% from last month
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

      {/* Shipments + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <div>
              <p className="font-bold text-slate-900 text-sm">Recent Shipments</p>
              <p className="text-xs text-slate-400 mt-0.5">Latest 5 shipments</p>
            </div>
            <button onClick={() => onNav?.("shipments")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg">
              View all <Icon d={Icons.ChevronR} size={12} />
            </button>
          </div>

          {/* Table head */}
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-5 py-2.5 bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            <span>ID</span>
            <span>Route</span>
            <span>Value</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-slate-50">
            {RECENT_SHIPMENTS.map((sh) => (
              <div key={sh.id} className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-slate-50/60 transition">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon d={Icons.Package} size={13} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{sh.id}</p>
                    <p className="text-[10px] text-slate-400">{sh.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <RiskDot level={sh.risk} />
                  <p className="text-xs text-slate-500 truncate">{sh.origin} → {sh.dest}</p>
                </div>
                <p className="text-sm font-semibold text-slate-700 tabular-nums">{sh.value}</p>
                <StatusBadge status={sh.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 text-sm">Active Alerts</p>
              <p className="text-xs text-slate-400 mt-0.5">Requires attention</p>
            </div>
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">{ALERTS.length}</span>
          </div>
          <div className="flex-1 divide-y divide-slate-50">
            {ALERTS.map((a, i) => {
              const cfg = {
                warning: { bg: "bg-amber-50", iconKey: "Alert", iconCls: "text-amber-500", dot: "bg-amber-400" },
                info:    { bg: "bg-blue-50",  iconKey: "Bell",  iconCls: "text-blue-500",  dot: "bg-blue-400"  },
                success: { bg: "bg-emerald-50", iconKey: "Check", iconCls: "text-emerald-500", dot: "bg-emerald-400" },
              }[a.type];
              return (
                <div key={i} className="flex gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                    <Icon d={Icons[cfg.iconKey]} size={13} className={cfg.iconCls} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{a.msg}</p>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Icon d={Icons.Clock} size={9} /> {a.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-3 border-t border-slate-50">
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition">
              View all alerts <Icon d={Icons.ChevronR} size={12} />
            </button>
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