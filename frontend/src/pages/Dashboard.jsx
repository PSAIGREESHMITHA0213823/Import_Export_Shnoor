
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Analytics from "./Analytics";
import HSNClassifier from "./HSNClassifier";
import DutyCalculator from "./DutyCalculator";
import RiskAssessment from "./RiskAssessment";
import Shipments from "./Shipments";
import Documents from "./Documents";
import UserManagement from "./UserManagement";
import PaymentHistory from "./PaymentHistory";

const PAGE_TITLES = {
  analytics: "Analytics Dashboard",
  hsn: "HSN Classifier",
  duty: "Duty Calculator",
  risk: "Risk Assessment",
  shipments: "Shipments",
  documents: "Documents",
  users: "User Management",
  payments: "Payment History",
};

export default function Dashboard() {
  const [page, setPage] = useState("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const handleNav = (newPage) => {
    setPage(newPage);
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderPage = () => {
    switch (page) {
      case "analytics": return <Analytics onNav={handleNav} />;
      case "hsn": return <HSNClassifier />;
      case "duty": return <DutyCalculator />;
      case "risk": return <RiskAssessment />;
      case "shipments": return <Shipments />;
      case "documents": return <Documents />;
      case "users": return <UserManagement />;
      case "payments": return <PaymentHistory user={user} />;
      default: return <Analytics onNav={handleNav} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0ede8]">

      {/* Desktop Sidebar (SCROLL ENABLED) */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-30 w-60 overflow-y-auto">
        <Sidebar active={page} onNav={handleNav} />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar (SCROLL ENABLED) */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          md:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar active={page} onNav={handleNav} />
      </div>

      {/* Main Layout */}
      <div className="flex-1 md:ml-60 flex flex-col h-screen overflow-hidden">

        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 bg-[#f0ede8] border-b border-black/10 px-4 py-3 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-black/10 transition"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <span className="font-semibold text-gray-800 text-sm truncate">
            {PAGE_TITLES[page] ?? "Dashboard"}
          </span>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 p-2 overflow-y-auto">
          {renderPage()}
        </main>

      </div>
    </div>
  );
}