
import { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";
const Icon = ({ d, size = 16, className = "", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={style}>{d}</svg>
);

const SearchIcon = <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>;
const ChevronL = <polyline points="15 18 9 12 15 6"/>;
const ChevronR = <polyline points="9 18 15 12 9 6"/>;
const PackageIcon = <><path d="M4 6h16v12c0 .6-.4 1-1 1H5c-.6 0-1-.4-1-1V6z"/><path d="M8 4v4"/><path d="M16 4v4"/></>;
const MapPinIcon = <><path d="M12 22c-2 0-8-5.4-8-10c0-4.4 3.6-8 8-8s8 3.6 8 8c0 4.6-6 10-8 10z"/><circle cx="12" cy="12" r="3"/></>;
const ClockIcon = <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>;
const TruckIcon = <><path d="M1 3h15v13H1z"/><path d="M16 8h4l2 3v3h-6V8z"/><circle cx="5.5" cy="16.5" r="2.5"/><circle cx="15.5" cy="16.5" r="2.5"/></>;
const CheckIcon = <><polyline points="20 6 9 17 4 12"/></>;
const XIcon = <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>;

// ─── Constants ─────────────────────────────────────────────────────────────────
const COUNTRIES = [
  { code: "IN", label: "India 🇮🇳" },
  { code: "US", label: "United States 🇺🇸" },
  { code: "UK", label: "United Kingdom 🇬🇧" },
  { code: "CN", label: "China 🇨🇳" },
  { code: "AE", label: "UAE 🇦🇪" },
  { code: "SG", label: "Singapore 🇸🇬" },
  { code: "DE", label: "Germany 🇩🇪" },
  { code: "FR", label: "France 🇫🇷" },
  { code: "JP", label: "Japan 🇯🇵" },
  { code: "AU", label: "Australia 🇦🇺" },
];

const STATUS_CONFIG = {
  booked: { label: "Booked", color: "#3b82f6", bg: "#eff6ff", icon: "📋", step: 0 },
  in_transit: { label: "In Transit", color: "#f59e0b", bg: "#fffbeb", icon: "🚚", step: 1 },
  customs_clearance: { label: "Customs Clearance", color: "#8b5cf6", bg: "#f5f3ff", icon: "🛃", step: 2 },
  out_for_delivery: { label: "Out for Delivery", color: "#06b6d4", bg: "#ecfeff", icon: "📮", step: 3 },
  delivered: { label: "Delivered", color: "#10b981", bg: "#ecfdf5", icon: "✅", step: 4 },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "#fef2f2", icon: "❌", step: -1 },
};

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

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.booked;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: config.bg, color: config.color }}>
      <span>{config.icon}</span>
      {config.label}
    </span>
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

// ─── Create Tab ────────────────────────────────────────────────────────────────
function CreateTab({ onCreated }) {
  const [form, setForm] = useState({
    origin_country: "IN",
    origin_port: "",
    destination_country: "US",
    destination_port: "",
    product_description: "",
    hsn_code: "",
    quantity: "",
    weight: "",
    product_value: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [lastShipment, setLastShipment] = useState(null);

  const updateField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLastShipment(null);

    const required = ["origin_port", "destination_port", "product_description", "hsn_code", "quantity", "weight", "product_value"];
    const missing = required.filter(f => !form[f].toString().trim());
    if (missing.length) {
      setError(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        quantity: parseInt(form.quantity),
        weight: parseFloat(form.weight),
        product_value: parseFloat(form.product_value),
      };
      const result = await api.createShipment(payload);
      setSuccess(`Shipment booked successfully! Tracking ID: ${result.tracking_id}`);
      setLastShipment(result);
      onCreated?.();
      
      // Reset form
      setForm({
        origin_country: "IN",
        origin_port: "",
        destination_country: "US",
        destination_port: "",
        product_description: "",
        hsn_code: "",
        quantity: "",
        weight: "",
        product_value: "",
      });
    } catch (err) {
      setError(err.message || "Failed to create shipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Create New Shipment" sub="Book international cargo movement">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Origin Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">1</div>
            <span className="text-sm font-semibold text-slate-700">Origin Details</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Origin Country" required>
              <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
                value={form.origin_country} onChange={updateField("origin_country")}>
                {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Origin Port" required>
              <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
                placeholder="e.g., JNPT Mumbai, Nhava Sheva" value={form.origin_port} onChange={updateField("origin_port")} />
            </Field>
          </div>
        </div>

        {/* Destination Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">2</div>
            <span className="text-sm font-semibold text-slate-700">Destination Details</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Destination Country" required>
              <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
                value={form.destination_country} onChange={updateField("destination_country")}>
                {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Destination Port" required>
              <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
                placeholder="e.g., Port of Los Angeles" value={form.destination_port} onChange={updateField("destination_port")} />
            </Field>
          </div>
        </div>

        {/* Product Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">3</div>
            <span className="text-sm font-semibold text-slate-700">Product Information</span>
          </div>
          <Field label="Product Description" required>
            <textarea rows={2} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition resize-none" 
              placeholder="Describe the goods being shipped..." value={form.product_description} onChange={updateField("product_description")} />
          </Field>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <Field label="HSN Code" required>
              <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
                placeholder="84713000" value={form.hsn_code} onChange={updateField("hsn_code")} />
            </Field>
            <Field label="Quantity" required>
              <input type="number" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
                placeholder="Units" value={form.quantity} onChange={updateField("quantity")} />
            </Field>
            <Field label="Weight (kg)" required>
              <input type="number" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
                placeholder="Total kg" value={form.weight} onChange={updateField("weight")} />
            </Field>
          </div>
          <Field label="Product Value (USD)" required>
            <input type="number" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" 
              placeholder="Declared value" value={form.product_value} onChange={updateField("product_value")} />
          </Field>
        </div>

        {error && <Alert type="error" onClose={() => setError("")}>{error}</Alert>}
        {success && <Alert type="success" onClose={() => setSuccess("")}>{success}</Alert>}

        {lastShipment && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Shipment Created</p>
            <p className="text-sm text-slate-700 mt-1">
              Tracking ID: <span className="font-mono font-bold text-blue-700">{lastShipment.tracking_id}</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">Use this ID to track your shipment</p>
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl font-bold hover:from-blue-800 hover:to-indigo-800 disabled:opacity-60 transition-all shadow-sm">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Booking Shipment...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Icon d={PackageIcon} size={16} />
              Book Shipment
            </span>
          )}
        </button>
      </form>
    </Card>
  );
}

// ─── Track Tab ─────────────────────────────────────────────────────────────────
function TrackTab() {
  const [trackingId, setTrackingId] = useState("");
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      setError("Please enter a tracking ID");
      return;
    }
    setLoading(true);
    setError("");
    setShipment(null);
    try {
      const result = await api.trackShipment(trackingId.trim());
      setShipment(result);
    } catch (err) {
      setError(err.message || "Shipment not found. Please check the tracking ID.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleTrack();
  };

  const getCurrentStep = () => {
    if (!shipment) return -1;
    return STATUS_CONFIG[shipment.status]?.step ?? 0;
  };

  const timelineSteps = [
    { key: "booked", label: "Booked", description: "Shipment confirmed" },
    { key: "in_transit", label: "In Transit", description: "On the way" },
    { key: "customs_clearance", label: "Customs", description: "Customs processing" },
    { key: "out_for_delivery", label: "Out for Delivery", description: "Final mile" },
    { key: "delivered", label: "Delivered", description: "Successfully delivered" },
  ];

  const currentStep = getCurrentStep();

  return (
    <Card title="Track Shipment" sub="Real-time tracking with live updates">
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon d={SearchIcon} size={14} />
          </div>
          <input
            type="text"
            placeholder="Enter tracking ID (e.g., TRK123456789)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
          />
        </div>
        <button
          onClick={handleTrack}
          disabled={loading}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl text-sm font-semibold hover:shadow-md disabled:opacity-60 transition"
        >
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Track"}
        </button>
      </div>

      {error && <Alert type="error" onClose={() => setError("")}>{error}</Alert>}

      {shipment ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Tracking ID</p>
                <p className="text-xl font-mono font-bold text-slate-800">{shipment.tracking_id}</p>
              </div>
              <StatusBadge status={shipment.status} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
              <div>
                <p className="text-xs text-slate-400">Route</p>
                <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  <span>{shipment.origin_country}</span>
                  <span className="text-slate-400">→</span>
                  <span>{shipment.destination_country}</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Product</p>
                <p className="text-sm text-slate-700 truncate">{shipment.product_description}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Quantity / Weight</p>
                <p className="text-sm text-slate-700">{shipment.quantity} units · {shipment.weight} kg</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Estimated Delivery</p>
                <p className="text-sm font-semibold text-blue-600">{shipment.estimated_arrival || "To be updated"}</p>
              </div>
            </div>
          </div>

          {shipment.status !== "cancelled" ? (
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" style={{ height: `calc(100% - 32px)` }} />
              <div className="space-y-6">
                {timelineSteps.map((step, idx) => {
                  const isCompleted = currentStep >= idx;
                  const isCurrent = currentStep === idx;
                  return (
                    <div key={step.key} className="relative flex gap-4">
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                        ${isCompleted ? "bg-emerald-500" : isCurrent ? "bg-blue-500 animate-pulse" : "bg-slate-200"}`}>
                        {isCompleted ? (
                          <Icon d={CheckIcon} size={18} className="text-white" />
                        ) : (
                          <div className={`w-2 h-2 rounded-full ${isCurrent ? "bg-white" : "bg-slate-400"}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className={`font-semibold ${isCompleted || isCurrent ? "text-slate-800" : "text-slate-400"}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                        {isCurrent && shipment.current_location && (
                          <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                            <Icon d={MapPinIcon} size={10} />
                            {shipment.current_location}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-rose-50 rounded-xl">
              <span className="text-4xl mb-2 block">❌</span>
              <p className="font-semibold text-rose-700">Shipment Cancelled</p>
              <p className="text-xs text-rose-500 mt-1">This shipment has been cancelled</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <Icon d={TruckIcon} size={28} className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">Enter a tracking ID to track your shipment</p>
          <p className="text-xs text-slate-400 mt-1">Example: TRK123456789, SHP987654321</p>
        </div>
      )}
    </Card>
  );
}

// ─── History Tab ───────────────────────────────────────────────────────────────
function HistoryTab({ refresh }) {
  const [shipments, setShipments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.listShipments();
      const allShipments = data.shipments || [];
      setTotal(allShipments.length);
      const start = page * PAGE_SIZE;
      setShipments(allShipments.slice(start, start + PAGE_SIZE));
    } catch (err) {
      setError(err.message || "Failed to load shipments");
      setShipments([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments, refresh]);

  const filtered = search.trim()
    ? shipments.filter(s =>
        s.tracking_id?.toLowerCase().includes(search.toLowerCase()) ||
        s.product_description?.toLowerCase().includes(search.toLowerCase()) ||
        s.hsn_code?.includes(search) ||
        s.shipment_id?.toLowerCase().includes(search.toLowerCase())
      )
    : shipments;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <Card title="Shipment History" sub={`${total} total shipments`}>
      <div className="relative mb-4">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
          <Icon d={SearchIcon} size={14} />
        </div>
        <input
          type="text"
          placeholder="Search by tracking ID, product, or HSN code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
        />
      </div>

      {error && <Alert type="error" onClose={() => setError("")}>{error}</Alert>}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <Icon d={PackageIcon} size={28} className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">
            {search ? "No matching shipments found" : "No shipments yet"}
          </p>
          {!search && <p className="text-xs text-slate-400 mt-1">Create your first shipment using the Create tab</p>}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider pb-3 pl-1 pr-4">Tracking ID</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">Route</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">Product</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">Status</th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((s) => (
                <tr key={s.shipment_id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 pl-1 pr-4">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                      {s.tracking_id}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-xs text-slate-600">{s.origin_country} → {s.destination_country}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <p className="text-xs text-slate-600 max-w-[180px] truncate" title={s.product_description}>
                      {s.product_description}
                    </p>
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Icon d={ClockIcon} size={11} />
                      {s.created_at ? new Date(s.created_at).toLocaleDateString("en-IN") : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && !search && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400">Page {page + 1} of {totalPages} · {total} records</p>
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
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function Shipments() {
  const [activeTab, setActiveTab] = useState("create");
  const [refreshKey, setRefreshKey] = useState(0);

  const tabs = [
    { id: "create", label: "Create Shipment", icon: PackageIcon },
    { id: "track", label: "Track Shipment", icon: SearchIcon },
    { id: "history", label: "History", icon: ClockIcon },
  ];

  return (
    <div className="p-6 space-y-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <div className="mb-2">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Icon d={TruckIcon} size={22} />
          Shipment Manager
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage international cargo shipments and track in real-time</p>
      </div>

      <div className="flex gap-1 p-1 bg-white border border-slate-200 rounded-xl w-fit shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Icon d={tab.icon} size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "create" && <CreateTab onCreated={() => setRefreshKey(k => k + 1)} />}
      {activeTab === "track" && <TrackTab />}
      {activeTab === "history" && <HistoryTab refresh={refreshKey} />}
    </div>
  );
}