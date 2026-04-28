import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DEMO_ACCOUNTS = [
  { label: "admin / admin123",       username: "admin",     password: "admin123"  },
  { label: "demo / demo123",         username: "demo",      password: "demo123"   },
  { label: "exporter1 / export123",  username: "exporter1", password: "export123" },
  { label: "broker1 / broker123",    username: "broker1",   password: "broker123" },
];

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]   = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const fill = (u, p) => setForm({ username: u, password: p });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) { setError("Enter username and password."); return; }
    try {
      await login(form.username, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between bg-[#1a3a6b] p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full border-[60px] border-white/[0.04]" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full border-[40px] border-white/[0.04]" />

        {/* Brand */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-9 h-9 bg-[#c8992a] rounded-lg flex items-center justify-center">
            <BrandIcon />
          </div>
          <span className="text-white text-xl font-bold tracking-tight">TradeLint</span>
        </div>

        {/* Hero */}
        <div className="z-10">
          <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tighter mb-5">
            AI-Powered<br />
            <span className="text-[#c8992a]">Trade Intelligence</span><br />
            Platform
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            Classify HSN codes, calculate duties, track shipments and assess trade risk — all in one unified platform.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-10 z-10">
          {[["99.2%","HSN Accuracy"],["50+","Countries"],["Real-time","Risk Alerts"]].map(([n,l]) => (
            <div key={l} className="border-t border-white/20 pt-4">
              <div className="text-white text-2xl font-bold">{n}</div>
              <div className="text-white/40 text-xs uppercase tracking-widest mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8 bg-[#f4f2ee]">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-extrabold tracking-tight mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">
            No account?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Create one free
            </Link>
          </p>

          {/* Demo chips */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5">
            <p className="text-xs font-medium text-blue-800 mb-2">Demo accounts — click to fill:</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.username}
                  onClick={() => fill(a.username, a.password)}
                  className="text-xs px-3 py-1 rounded-full bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Username">
              <input
                className="input-base"
                type="text"
                placeholder="e.g. admin"
                value={form.username}
                onChange={set("username")}
                autoComplete="username"
              />
            </Field>

            <Field label="Password">
              <input
                className="input-base"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set("password")}
                autoComplete="current-password"
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1a3a6b] text-white rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-60 transition"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-500">
            New to TradeLint?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Create account
            </Link>
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