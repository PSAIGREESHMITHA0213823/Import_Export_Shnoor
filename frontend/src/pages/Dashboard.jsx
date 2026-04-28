
import { useState } from "react";
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
  hsn:       "HSN Classifier",
  duty:      "Duty Calculator",
  risk:      "Risk Assessment",
  shipments: "Shipments",
  documents: "Documents",
  users:     "User Management",
  payments:  "Payment History",
};

export default function Dashboard() {
  const [page, setPage] = useState("analytics");
  const { user } = useAuth();

  const renderPage = () => {
    switch (page) {
      case "analytics": return <Analytics onNav={setPage} />;
      case "hsn":       return <HSNClassifier />;
      case "duty":      return <DutyCalculator />;
      case "risk":      return <RiskAssessment />;
      case "shipments": return <Shipments />;
      case "documents": return <Documents />;
      case "users":     return <UserManagement />;
      case "payments":  return <PaymentHistory user={user} />;
      default:          return <Analytics onNav={setPage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f0ede8]">
      <Sidebar active={page} onNav={setPage} />

      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-40">
          <h1 className="font-bold text-gray-900 tracking-tight">{PAGE_TITLES[page]}</h1>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            API Online
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}