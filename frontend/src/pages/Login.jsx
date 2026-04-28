// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const DEMO_ACCOUNTS = [
//   { label: "admin / admin123",       username: "admin",     password: "admin123"  },
//   { label: "demo / demo123",         username: "demo",      password: "demo123"   },
//   { label: "exporter1 / export123",  username: "exporter1", password: "export123" },
//   { label: "broker1 / broker123",    username: "broker1",   password: "broker123" },
// ];

// export default function Login() {
//   const { login, loading } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm]   = useState({ username: "", password: "" });
//   const [error, setError] = useState("");

//   const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

//   const fill = (u, p) => setForm({ username: u, password: p });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     if (!form.username || !form.password) { setError("Enter username and password."); return; }
//     try {
//       await login(form.username, form.password);
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
//       {/* Left panel */}
//       <div className="hidden lg:flex flex-col justify-between bg-[#1a3a6b] p-12 relative overflow-hidden">
//         {/* Decorative circles */}
//         <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full border-[60px] border-white/[0.04]" />
//         <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full border-[40px] border-white/[0.04]" />

//         {/* Brand */}
//         <div className="flex items-center gap-3 z-10">
//           <div className="w-9 h-9 bg-[#c8992a] rounded-lg flex items-center justify-center">
//             <BrandIcon />
//           </div>
//           <span className="text-white text-xl font-bold tracking-tight">TradeLint</span>
//         </div>

//         {/* Hero */}
//         <div className="z-10">
//           <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tighter mb-5">
//             AI-Powered<br />
//             <span className="text-[#c8992a]">Trade Intelligence</span><br />
//             Platform
//           </h1>
//           <p className="text-white/60 text-base leading-relaxed max-w-sm">
//             Classify HSN codes, calculate duties, track shipments and assess trade risk — all in one unified platform.
//           </p>
//         </div>

//         {/* Stats */}
//         <div className="flex gap-10 z-10">
//           {[["99.2%","HSN Accuracy"],["50+","Countries"],["Real-time","Risk Alerts"]].map(([n,l]) => (
//             <div key={l} className="border-t border-white/20 pt-4">
//               <div className="text-white text-2xl font-bold">{n}</div>
//               <div className="text-white/40 text-xs uppercase tracking-widest mt-1">{l}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right panel */}
//       <div className="flex items-center justify-center p-8 bg-[#f4f2ee]">
//         <div className="w-full max-w-sm">
//           <h2 className="text-3xl font-extrabold tracking-tight mb-1">Welcome back</h2>
//           <p className="text-sm text-gray-500 mb-6">
//             No account?{" "}
//             <Link to="/register" className="text-blue-600 font-medium hover:underline">
//               Create one free
//             </Link>
//           </p>

//           {/* Demo chips */}
//           <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5">
//             <p className="text-xs font-medium text-blue-800 mb-2">Demo accounts — click to fill:</p>
//             <div className="flex flex-wrap gap-2">
//               {DEMO_ACCOUNTS.map((a) => (
//                 <button
//                   key={a.username}
//                   onClick={() => fill(a.username, a.password)}
//                   className="text-xs px-3 py-1 rounded-full bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
//                 >
//                   {a.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Field label="Username">
//               <input
//                 className="input-base"
//                 type="text"
//                 placeholder="e.g. admin"
//                 value={form.username}
//                 onChange={set("username")}
//                 autoComplete="username"
//               />
//             </Field>

//             <Field label="Password">
//               <input
//                 className="input-base"
//                 type="password"
//                 placeholder="••••••••"
//                 value={form.password}
//                 onChange={set("password")}
//                 autoComplete="current-password"
//               />
//             </Field>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 bg-[#1a3a6b] text-white rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-60 transition"
//             >
//               {loading ? "Signing in…" : "Sign In"}
//             </button>
//           </form>

//           <div className="flex items-center gap-3 my-5">
//             <div className="flex-1 h-px bg-gray-200" />
//             <span className="text-xs text-gray-400">or</span>
//             <div className="flex-1 h-px bg-gray-200" />
//           </div>

//           <p className="text-center text-sm text-gray-500">
//             New to TradeLint?{" "}
//             <Link to="/register" className="text-blue-600 font-medium hover:underline">
//               Create account
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Field({ label, children }) {
//   return (
//     <div>
//       <label className="block text-xs font-medium text-gray-600 mb-1.5 tracking-wide">{label}</label>
//       {children}
//     </div>
//   );
// }

// function BrandIcon() {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//       <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" />
//       <rect x="14" y="3" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.5)" />
//       <rect x="3" y="14" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.5)" />
//       <rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" />
//     </svg>
//   );
// }


import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DEMO_ACCOUNTS = [
  { label: "admin / admin123",      username: "admin",     password: "admin123"  },
  { label: "demo / demo123",        username: "demo",      password: "demo123"   },
  { label: "exporter1 / export123", username: "exporter1", password: "export123" },
  { label: "broker1 / broker123",   username: "broker1",   password: "broker123" },
];

function BrandMark({ size = 40 }) {
  return (
    <div style={{
      width: size, height: size,
      background: "linear-gradient(135deg,#C8A050,#A07828)",
      borderRadius: size * 0.22,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
        <rect x="3"  y="3"  width="7" height="7" rx="1.5" fill="white" />
        <rect x="14" y="3"  width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.5)" />
        <rect x="3"  y="14" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.5)" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" />
      </svg>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  padding: "13px 16px",
  fontSize: 14,
  color: "#fff",
  outline: "none",
  transition: "border-color 0.2s, background 0.2s",
  fontFamily: "inherit",
};

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]   = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const fill = (u, p) => setForm({ username: u, password: p });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) { setError("Please enter your username and password."); return; }
    try {
      await login(form.username, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", fontFamily: "'DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* ── LEFT PANEL ── */}
      <div style={{
        background: "linear-gradient(160deg,#06121F 0%,#0C2040 55%,#07161F 100%)",
        padding: "48px 56px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Grid texture */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize: "44px 44px", pointerEvents: "none" }} />
        {/* Gold glow */}
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(200,160,80,0.09) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "20%", left: "-5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(200,160,80,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 2 }}>
          <BrandMark size={42} />
          <div>
            <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "0.14em" }}>SHNOOR™</div>
            <div style={{ fontSize: 8, color: "#C8A050", letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 2 }}>INTERNATIONAL LLC</div>
          </div>
        </div>

        {/* Hero text */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(200,160,80,0.1)", border: "1px solid rgba(200,160,80,0.25)", borderRadius: 100, padding: "5px 16px", marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8A050", animation: "shnPulse 2s infinite" }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: "#C8A050", letterSpacing: "0.18em", textTransform: "uppercase" }}>AI-Powered Trade Intelligence</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(32px,3.5vw,50px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 18, letterSpacing: "-0.01em" }}>
            AI-Powered<br />
            <span style={{ color: "#C8A050" }}>Trade Intelligence</span><br />
            Platform
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.85, maxWidth: 380 }}>
            Classify HSN codes, calculate duties, track shipments and assess trade risk — all in one unified platform built for global trade professionals.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 36, position: "relative", zIndex: 2 }}>
          {[["99.2%","HSN Accuracy"],["200+","Countries"],["Real-time","Risk Alerts"]].map(([n, l]) => (
            <div key={l} style={{ borderTop: "1px solid rgba(200,160,80,0.3)", paddingTop: 16 }}>
              <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 22, fontWeight: 800, color: "#C8A050" }}>{n}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 5 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Decorative image strip */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,transparent,#C8A050,transparent)" }} />
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ background: "#060E1A", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 32px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 34, fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: "-0.01em" }}>
              Welcome back
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>
              No account?{" "}
              <Link to="/register" style={{ color: "#C8A050", fontWeight: 600, textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
              >
                Create one free →
              </Link>
            </p>
          </div>

          {/* Demo chips */}
          <div style={{ background: "rgba(200,160,80,0.06)", border: "1px solid rgba(200,160,80,0.18)", borderRadius: 12, padding: "14px 16px", marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(200,160,80,0.8)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
              Demo accounts — click to fill
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.username}
                  onClick={() => fill(a.username, a.password)}
                  style={{ fontSize: 11, padding: "5px 12px", borderRadius: 100, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(200,160,80,0.25)", color: "rgba(200,160,80,0.85)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(200,160,80,0.15)"; e.currentTarget.style.borderColor = "#C8A050"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(200,160,80,0.25)"; }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(220,60,60,0.1)", border: "1px solid rgba(220,60,60,0.3)", color: "#FF8080", fontSize: 13, borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Field label="Username">
              <input
                style={inputStyle}
                type="text"
                placeholder="e.g. admin"
                value={form.username}
                onChange={set("username")}
                autoComplete="username"
                onFocus={(e) => { e.target.style.borderColor = "rgba(200,160,80,0.6)"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
              />
            </Field>

            <Field label="Password">
              <div style={{ position: "relative" }}>
                <input
                  style={{ ...inputStyle, paddingRight: 46 }}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set("password")}
                  autoComplete="current-password"
                  onFocus={(e) => { e.target.style.borderColor = "rgba(200,160,80,0.6)"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 2 }}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </Field>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24, marginTop: -8 }}>
              <a href="#" style={{ fontSize: 12, color: "rgba(200,160,80,0.7)", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C8A050")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(200,160,80,0.7)")}
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "14px", background: loading ? "rgba(200,160,80,0.4)" : "linear-gradient(135deg,#C8A050,#A07828)", color: "#060E1A", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: "0.02em", boxShadow: "0 4px 18px rgba(200,160,80,0.3)", transition: "all 0.2s" }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 26px rgba(200,160,80,0.42)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(200,160,80,0.3)"; }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "28px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            New to Shnoor?{" "}
            <Link to="/register" style={{ color: "#C8A050", fontWeight: 600, textDecoration: "none" }}>
              Create account
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shnPulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="padding: 48px 56px"] { display: none !important; }
        }
      `}</style>
    </div>
  );
}