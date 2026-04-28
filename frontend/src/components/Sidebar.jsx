// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// /* ── Icons ── */
// function BrandIcon() {
//   return (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//       <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" />
//       <rect x="14" y="3" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.5)" />
//       <rect x="3" y="14" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.5)" />
//       <rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" />
//     </svg>
//   );
// }

// const icon = (d) =>
//   function Icon({ className = "w-5 h-5" }) {
//     return (
//       <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//         {d}
//       </svg>
//     );
//   };

// // Define all icons
// const GridIcon   = icon(<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>);
// const SearchIcon = icon(<><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>);
// const DollarIcon = icon(<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>);
// const AlertIcon  = icon(<><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>);
// const BoxIcon    = icon(<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>);
// const FileIcon   = icon(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>);
// const UsersIcon  = icon(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>);
// const LogoutIcon = icon(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>);
// const PaymentIcon = icon(<><path d="M20 12V8h-2M20 4h-2M4 4H2v2M2 8v2M22 12h-2M22 16h-2M4 20H2v-2M2 16v-2"/><path d="M7 12h10"/><path d="M12 7v10"/><circle cx="12" cy="12" r="10"/></>);

// // NAV with Payments added
// const NAV = [
//   {
//     section: "Overview",
//     items: [{ id: "analytics", label: "Analytics", icon: GridIcon }],
//   },
//   {
//     section: "Tools",
//     items: [
//       { id: "hsn",  label: "HSN Classifier",  icon: SearchIcon, badge: "AI" },
//       { id: "duty", label: "Duty Calculator",  icon: DollarIcon },
//       { id: "risk", label: "Risk Assessment",  icon: AlertIcon  },
//     ],
//   },
//   {
//     section: "Operations",
//     items: [
//       { id: "shipments",  label: "Shipments",  icon: BoxIcon  },
//       { id: "documents",  label: "Documents",  icon: FileIcon },
//       { id: "payments",   label: "Payments",   icon: PaymentIcon }, // Added Payments
//     ],
//   },
//   {
//     section: "Admin",
//     items: [{ id: "users", label: "User Management", icon: UsersIcon }],
//   },
// ];

// export default function Sidebar({ active, onNav }) {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const initials = (user?.full_name || user?.username || "?")
//     .split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

//   const handleLogout = () => { logout(); navigate("/login"); };

//   return (
//     <aside className="w-60 min-h-screen bg-[#1a3a6b] flex flex-col fixed top-0 left-0 bottom-0 z-50">
//       {/* Brand */}
//       <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
//         <div className="w-8 h-8 bg-[#c8992a] rounded-lg flex items-center justify-center flex-shrink-0">
//           <BrandIcon />
//         </div>
//         <span className="text-white text-lg font-bold tracking-tight">TradeLint</span>
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
//         {NAV.map(({ section, items }) => (
//           <div key={section}>
//             <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest px-2 pt-4 pb-1">
//               {section}
//             </p>
//             {items.map(({ id, label, icon: Icon, badge }) => (
//               <button
//                 key={id}
//                 onClick={() => onNav(id)}
//                 className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition
//                   ${active === id
//                     ? "bg-white/[0.14] text-white"
//                     : "text-white/60 hover:bg-white/[0.07] hover:text-white"
//                   }`}
//               >
//                 <Icon className="w-4 h-4 flex-shrink-0" />
//                 <span className="flex-1 text-left">{label}</span>
//                 {badge && (
//                   <span className="text-[10px] font-semibold bg-[#c8992a] text-white px-2 py-0.5 rounded-full">
//                     {badge}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>
//         ))}
//       </nav>

//       {/* User footer */}
//       <div className="border-t border-white/10 px-3 py-4">
//         <div className="flex items-center gap-2.5 px-2">
//           <div className="w-8 h-8 rounded-full bg-[#c8992a] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
//             {initials}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-white text-sm font-medium truncate">{user?.full_name || user?.username}</p>
//             <p className="text-white/40 text-xs capitalize">{user?.role}</p>
//           </div>
//           <button onClick={handleLogout} title="Sign out" className="text-white/30 hover:text-white transition p-1">
//             <LogoutIcon className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// }

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ShnoorLogo from "../components/ShnoorLogo";

/* ── Icon factory ────────────────────────────────────────────────────── */
const Ico = ({ d, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.8}
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    {d}
  </svg>
);

const I = {
  Grid:    <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  Search:  <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>,
  Dollar:  <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
  Alert:   <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  Box:     <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>,
  File:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  Users:   <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  Logout:  <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  Payment: <><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
  Cpu:     <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></>,
  Shield:  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  Settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  ChevR:   <polyline points="9 18 15 12 9 6"/>,
  Bell:    <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
};

/* ── Nav config ──────────────────────────────────────────────────────── */
const NAV = [
  {
    section: "Overview",
    items: [
      { id: "analytics", label: "Analytics",   icon: "Grid"    },
    ],
  },
  {
    section: "Tools",
    items: [
      { id: "hsn",  label: "HSN Classifier",  icon: "Cpu",    badge: "AI" },
      { id: "duty", label: "Duty Calculator", icon: "Dollar"              },
      { id: "risk", label: "Risk Assessment", icon: "Shield"              },
    ],
  },
  {
    section: "Operations",
    items: [
      { id: "shipments", label: "Shipments",  icon: "Box"     },
      { id: "documents", label: "Documents",  icon: "File"    },
      { id: "payments",  label: "Payments",   icon: "Payment" },
    ],
  },
  {
    section: "Admin",
    items: [
      { id: "users",    label: "User Management", icon: "Users"    },
      { id: "settings", label: "Settings",        icon: "Settings" },
    ],
  },
];

/* ── Sidebar ─────────────────────────────────────────────────────────── */
export default function Sidebar({ active, onNav }) {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const initials = (user?.full_name || user?.username || "?")
    .split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside
      style={{
        width: "256px",
        background: "linear-gradient(160deg, #0b1628 0%, #111e38 60%, #132044 100%)",
        borderRight: "1px solid rgba(255,255,255,0.055)",
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 24px rgba(0,0,0,0.25)",
      }}
    >

      {/* ── Brand ──────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "20px 20px 18px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Shnoor logo */}
        <ShnoorLogo size={38} />

        {/* Company text */}
        <div style={{ minWidth: 0 }}>
          <p style={{
            color: "#ffffff",
            fontSize: "0.9375rem",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            Shnoor International
          </p>
          <p style={{
            color: "rgba(255,255,255,0.28)",
            fontSize: "0.6rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginTop: "2px",
          }}>
            Trade &amp; Compliance
          </p>
        </div>
      </div>

      {/* ── Nav ────────────────────────────────────────────────────────── */}
      <nav style={{
        flex: 1, padding: "8px 10px", overflowY: "auto",
      }}>
        {NAV.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: "4px" }}>
            <p style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              padding: "16px 10px 6px",
            }}>
              {section}
            </p>

            {items.map(({ id, label, icon, badge }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => onNav(id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    marginBottom: "1px",
                    transition: "all 0.15s ease",
                    background: isActive
                      ? "rgba(59,130,246,0.16)"
                      : "transparent",
                    color: isActive
                      ? "#ffffff"
                      : "rgba(255,255,255,0.42)",
                    textAlign: "left",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(255,255,255,0.42)";
                    }
                  }}
                >
                  {/* Active left bar */}
                  {isActive && (
                    <span style={{
                      position: "absolute", left: 0,
                      top: "50%", transform: "translateY(-50%)",
                      width: "3px", height: "18px",
                      borderRadius: "0 3px 3px 0",
                      background: "linear-gradient(180deg,#60a5fa,#818cf8)",
                    }} />
                  )}

                  {/* Icon */}
                  <Ico d={I[icon]} size={15}
                    className={isActive ? "text-blue-400" : ""}
                    style={{ color: isActive ? "#60a5fa" : "inherit", flexShrink: 0 }}
                  />

                  {/* Label */}
                  <span style={{
                    flex: 1, fontSize: "0.8125rem",
                    fontWeight: isActive ? 600 : 500,
                  }}>
                    {label}
                  </span>

                  {/* AI badge */}
                  {badge && (
                    <span style={{
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: "999px",
                      background: "rgba(99,102,241,0.28)",
                      color: "#a5b4fc",
                      letterSpacing: "0.04em",
                    }}>
                      {badge}
                    </span>
                  )}

                  {/* Chevron for active */}
                  {isActive && (
                    <Ico d={I.ChevR} size={12}
                      style={{ color: "rgba(96,165,250,0.5)", flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Alert strip ────────────────────────────────────────────────── */}
      <div style={{
        margin: "0 10px 10px",
        padding: "10px 12px",
        borderRadius: "10px",
        background: "rgba(59,130,246,0.1)",
        border: "1px solid rgba(59,130,246,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px" }}>
          <Ico d={I.Bell} size={12} style={{ color: "#60a5fa", flexShrink: 0 }} />
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#93c5fd" }}>
            4 Active Alerts
          </span>
        </div>
        <p style={{
          fontSize: "0.68rem",
          color: "rgba(255,255,255,0.35)",
          lineHeight: 1.5,
        }}>
          SH-20480 requires customs review
        </p>
      </div>

      {/* ── User footer ────────────────────────────────────────────────── */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "12px 12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 4px" }}>
          {/* Avatar */}
          <div style={{
            width: "32px", height: "32px",
            borderRadius: "10px",
            background: "linear-gradient(135deg,#3b82f6,#6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff",
            fontSize: "0.7rem",
            fontWeight: 700,
            flexShrink: 0,
          }}>
            {initials}
          </div>

          {/* Name + role */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              color: "#fff",
              fontSize: "0.8125rem",
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {user?.full_name || user?.username || "User"}
            </p>
            <p style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.68rem",
              textTransform: "capitalize",
            }}>
              {user?.role || "Member"}
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              background: "none", border: "none", padding: "6px",
              borderRadius: "8px", cursor: "pointer",
              color: "rgba(255,255,255,0.25)",
              transition: "all 0.15s ease",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              e.currentTarget.style.color = "rgba(255,255,255,0.75)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "rgba(255,255,255,0.25)";
            }}
          >
            <Ico d={I.Logout} size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}