import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { value: "importer", label: "Importer", icon: "📦" },
  { value: "exporter", label: "Exporter", icon: "🚢" },
  { value: "broker",   label: "Broker",   icon: "🤝" },
  { value: "admin",    label: "Admin",    icon: "⚙️" },
];

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "", last_name: "", username: "",
    email: "", company_name: "", phone: "",
    password: "", role: "importer",
  });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    const { first_name, last_name, username, email, company_name, phone, password, role } = form;
    if (!first_name || !last_name || !username || !email || !company_name || !phone || !password) {
      setError("Please fill in all fields."); return;
    }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    try {
      await register({ username, email, password, full_name: `${first_name} ${last_name}`, company_name, phone, role });
      setSuccess("Account created! Redirecting…");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between bg-[#1a3a6b] p-12 relative overflow-hidden">
        <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full border-[60px] border-white/[0.04]" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full border-[40px] border-white/[0.04]" />

        <div className="flex items-center gap-3 z-10">
          <div className="w-9 h-9 bg-[#c8992a] rounded-lg flex items-center justify-center">
            <BrandIcon />
          </div>
          <span className="text-white text-xl font-bold tracking-tight">TradeLint</span>
        </div>

        <div className="z-10">
          <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tighter mb-5">
            Start Trading<br />
            <span className="text-[#c8992a]">Smarter</span><br />
            Today
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            Join thousands of importers, exporters and customs brokers using AI to streamline cross-border trade.
          </p>
        </div>

        <div className="z-10 space-y-3">
          {[
            ["AI HSN Classification", "Instant HS code prediction with 99%+ accuracy"],
            ["Duty Calculator", "Real-time duty, IGST, and landed cost computation"],
            ["Risk Assessment", "AI-driven credit and compliance risk scoring"],
            ["Document OCR", "Extract invoice data automatically with high confidence"],
          ].map(([title, desc]) => (
            <div key={title} className="flex gap-3 items-start">
              <div className="w-2 h-2 bg-[#c8992a] rounded-full mt-1.5 flex-shrink-0" />
              <p className="text-white/70 text-sm leading-relaxed">
                <span className="text-white font-medium">{title}</span> — {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-start justify-center p-8 bg-[#f4f2ee] overflow-y-auto">
        <div className="w-full max-w-md py-4">
          <h2 className="text-3xl font-extrabold tracking-tight mb-1">Create account</h2>
          <p className="text-sm text-gray-500 mb-6">
            Already have one?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>

          {error && <Alert type="error">{error}</Alert>}
          {success && <Alert type="success">{success}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name">
                <input className="input-base" placeholder="Priya" value={form.first_name} onChange={set("first_name")} />
              </Field>
              <Field label="Last name">
                <input className="input-base" placeholder="Sharma" value={form.last_name} onChange={set("last_name")} />
              </Field>
            </div>

            <Field label="Username">
              <input className="input-base" placeholder="priya_sharma" value={form.username} onChange={set("username")} autoComplete="username" />
            </Field>

            <Field label="Email address">
              <input className="input-base" type="email" placeholder="priya@company.com" value={form.email} onChange={set("email")} />
            </Field>

            <Field label="Company name">
              <input className="input-base" placeholder="Sharma Exports Pvt. Ltd." value={form.company_name} onChange={set("company_name")} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone">
                <input className="input-base" placeholder="+91 9876543210" value={form.phone} onChange={set("phone")} />
              </Field>
              <Field label="Password">
                <input className="input-base" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} autoComplete="new-password" />
              </Field>
            </div>

            <Field label="I am a …">
              <div className="grid grid-cols-2 gap-2 mt-1">
                {ROLES.map((r) => (
                  <label
                    key={r.value}
                    className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border cursor-pointer text-sm transition
                      ${form.role === r.value
                        ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                      }`}
                  >
                    <input type="radio" name="role" value={r.value} checked={form.role === r.value}
                      onChange={set("role")} className="sr-only" />
                    <span className="text-lg">{r.icon}</span>
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1a3a6b] text-white rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-60 transition"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            By creating an account you agree to TradeLint's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5 tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function Alert({ type, children }) {
  const styles = type === "success"
    ? "bg-green-50 border-green-200 text-green-700"
    : "bg-red-50 border-red-200 text-red-700";
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm mb-4 ${styles}`}>{children}</div>
  );
}

function BrandIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.5)" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.5)" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" />
    </svg>
  );
}