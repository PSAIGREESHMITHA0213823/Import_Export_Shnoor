
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ShnoorLogo from "../components/ShnoorLogo";

const ROLES = [
  { value: "importer", label: "Importer",  desc: "Import goods" },
  { value: "exporter", label: "Exporter",  desc: "Export goods" },
  { value: "broker",   label: "Broker",    desc: "Customs broker" },
  { value: "admin",    label: "Admin",     desc: "Platform admin" },
];

const FEATURES = [
  ["AI HSN Classification",  "Instant HS code prediction with 99.2% accuracy"],
  ["Smart Duty Calculator",  "Real-time duty, IGST, and landed cost computation"],
  ["Risk Assessment Engine", "AI-driven credit and compliance risk scoring"],
  ["Document Intelligence",  "OCR extraction from invoices with high confidence"],
];



function Field({ label, half, children }) {
  return (
    <div style={{ marginBottom: 16, flex: half ? "1 1 calc(50% - 8px)" : "1 1 100%" }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 7 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Alert({ type, children }) {
  const isSuccess = type === "success";
  return (
    <div style={{ background: isSuccess ? "rgba(60,180,100,0.1)" : "rgba(220,60,60,0.1)", border: `1px solid ${isSuccess ? "rgba(60,180,100,0.3)" : "rgba(220,60,60,0.3)"}`, color: isSuccess ? "#7DEBA0" : "#FF8080", fontSize: 13, borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  padding: "12px 15px",
  fontSize: 13.5,
  color: "#fff",
  outline: "none",
  transition: "border-color 0.2s, background 0.2s",
  fontFamily: "inherit",
};

const onFocusIn  = (e) => { e.target.style.borderColor = "rgba(200,160,80,0.6)"; e.target.style.background = "rgba(255,255,255,0.07)"; };
const onFocusOut = (e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.background = "rgba(255,255,255,0.05)"; };

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "", last_name: "", username: "",
    email: "", company_name: "", phone: "",
    password: "", role: "importer",
  });
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const { first_name, last_name, username, email, company_name, phone, password, role } = form;
    if (!first_name || !last_name || !username || !email || !company_name || !phone || !password) {
      setError("Please fill in all required fields."); return;
    }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    try {
      await register({ username, email, password, full_name: `${first_name} ${last_name}`, company_name, phone, role });
      setSuccess("Account created successfully! Redirecting to your dashboard…");
      setTimeout(() => navigate("/dashboard"), 1400);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", fontFamily: "'DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* ── LEFT PANEL ── */}
      <div style={{ background: "linear-gradient(160deg,#06121F 0%,#0C2040 55%,#07161F 100%)", padding: "48px 56px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize: "44px 44px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(200,160,80,0.09) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", left: "-5%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(200,160,80,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 2 }}>
          <ShnoorLogo size={82} />
          <div>
            <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "0.14em" }}>SHNOOR™</div>
            <div style={{ fontSize: 8, color: "#C8A050", letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 2 }}>INTERNATIONAL LLC</div>
          </div>
        </div>

        {/* Hero */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(200,160,80,0.1)", border: "1px solid rgba(200,160,80,0.25)", borderRadius: 100, padding: "5px 16px", marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8A050", animation: "shnPulse 2s infinite" }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: "#C8A050", letterSpacing: "0.18em", textTransform: "uppercase" }}>Join 500+ Enterprises</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(30px,3.2vw,46px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 18, letterSpacing: "-0.01em" }}>
            Start Trading<br />
            <span style={{ color: "#C8A050" }}>Smarter</span><br />
            Today
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.85, maxWidth: 360, marginBottom: 36 }}>
            Join thousands of importers, exporters and customs brokers using AI to streamline cross-border trade.
          </p>

          {/* Feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {FEATURES.map(([title, desc]) => (
              <div key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(200,160,80,0.12)", border: "1px solid rgba(200,160,80,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C8A050" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
                  <span style={{ color: "#fff", fontWeight: 600 }}>{title}</span> — {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust bar */}
        <div style={{ display: "flex", gap: 0, position: "relative", zIndex: 2 }}>
          {[["500+","Enterprises"],["200+","Countries"],["99.2%","Accuracy"]].map(([n, l], i) => (
            <div key={l} style={{ flex: 1, borderTop: "1px solid rgba(200,160,80,0.25)", paddingTop: 16, paddingRight: i < 2 ? 24 : 0 }}>
              <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 20, fontWeight: 800, color: "#C8A050" }}>{n}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,transparent,#C8A050,transparent)" }} />
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ background: "#060E1A", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "48px 32px", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 460, paddingBottom: 32 }}>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: "-0.01em" }}>
              Create account
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>
              Already have one?{" "}
              <Link to="/login" style={{ color: "#C8A050", fontWeight: 600, textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
              >
                Sign in →
              </Link>
            </p>
          </div>

          {error   && <Alert type="error">{error}</Alert>}
          {success && <Alert type="success">{success}</Alert>}

          <form onSubmit={handleSubmit}>
            {/* Name row */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Field label="First name" half>
                <input style={inputStyle} placeholder="Priya" value={form.first_name} onChange={set("first_name")} onFocus={onFocusIn} onBlur={onFocusOut} />
              </Field>
              <Field label="Last name" half>
                <input style={inputStyle} placeholder="Sharma" value={form.last_name} onChange={set("last_name")} onFocus={onFocusIn} onBlur={onFocusOut} />
              </Field>
            </div>

            <Field label="Username">
              <input style={inputStyle} placeholder="priya_sharma" value={form.username} onChange={set("username")} autoComplete="username" onFocus={onFocusIn} onBlur={onFocusOut} />
            </Field>

            <Field label="Email address">
              <input style={inputStyle} type="email" placeholder="priya@company.com" value={form.email} onChange={set("email")} onFocus={onFocusIn} onBlur={onFocusOut} />
            </Field>

            <Field label="Company name">
              <input style={inputStyle} placeholder="Sharma Exports Pvt. Ltd." value={form.company_name} onChange={set("company_name")} onFocus={onFocusIn} onBlur={onFocusOut} />
            </Field>

            {/* Phone + Password row */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Field label="Phone" half>
                <input style={inputStyle} placeholder="+91 9876543210" value={form.phone} onChange={set("phone")} onFocus={onFocusIn} onBlur={onFocusOut} />
              </Field>
              <Field label="Password" half>
                <div style={{ position: "relative" }}>
                  <input
                    style={{ ...inputStyle, paddingRight: 42 }}
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={set("password")}
                    autoComplete="new-password"
                    onFocus={onFocusIn}
                    onBlur={onFocusOut}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 14, padding: 2 }}>
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </Field>
            </div>

            {/* Role selector */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
                I am a …
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {ROLES.map((r) => {
                  const active = form.role === r.value;
                  return (
                    <label
                      key={r.value}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        gap: 6, padding: "16px 12px", borderRadius: 12,
                        border: active ? "1.5px solid #C8A050" : "1px solid rgba(255,255,255,0.1)",
                        background: active ? "rgba(200,160,80,0.1)" : "rgba(255,255,255,0.03)",
                        cursor: "pointer", transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = "rgba(200,160,80,0.35)"; }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                    >
                      <input type="radio" name="role" value={r.value} checked={active} onChange={set("role")} style={{ display: "none" }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: active ? "#C8A050" : "rgba(255,255,255,0.7)" }}>{r.label}</span>
                      <span style={{ fontSize: 11, color: active ? "rgba(200,160,80,0.65)" : "rgba(255,255,255,0.35)" }}>{r.desc}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "14px", background: loading ? "rgba(200,160,80,0.4)" : "linear-gradient(135deg,#C8A050,#A07828)", color: "#060E1A", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: "0.02em", boxShadow: "0 4px 18px rgba(200,160,80,0.28)", transition: "all 0.2s" }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 26px rgba(200,160,80,0.4)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(200,160,80,0.28)"; }}
            >
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.28)", marginTop: 18, lineHeight: 1.7 }}>
            By creating an account you agree to Shnoor International's{" "}
            <a href="#" style={{ color: "rgba(200,160,80,0.6)", textDecoration: "none" }}>Terms of Service</a>
            {" "}and{" "}
            <a href="#" style={{ color: "rgba(200,160,80,0.6)", textDecoration: "none" }}>Privacy Policy</a>.
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