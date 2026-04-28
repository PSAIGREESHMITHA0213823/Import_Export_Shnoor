// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";

// function PrivateRoute({ children }) {
//   const token = localStorage.getItem("tl_token");
//   return token ? children : <Navigate to="/login" replace />;
// }

// function PublicRoute({ children }) {
//   const token = localStorage.getItem("tl_token");
//   return token ? <Navigate to="/dashboard" replace /> : children;
// }

// function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/"          element={<Navigate to="/login" replace />} />
//       <Route path="/login"     element={<PublicRoute><Login /></PublicRoute>} />
//       <Route path="/register"  element={<PublicRoute><Register /></PublicRoute>} />
//       <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
//       <Route path="*"          element={<Navigate to="/login" replace />} />
//     </Routes>
//   );
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <AppRoutes />
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./components/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import AboutPage from './components/About';
import Footer from './components/Footer';
import ContactPage from './components/Contact';
import FeaturesPage from './components/Features';


function PrivateRoute({ children }) {
  const token = localStorage.getItem("tl_token");
  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("tl_token");
  return token ? <Navigate to="/dashboard" replace /> : children;
}

// Pages that show the Navbar (public marketing pages)
function WithNavbar({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Landing page — shown at "/" */}
      <Route
        path="/"
        element={
          <WithNavbar>
            <LandingPage />
          </WithNavbar>
        }
      />
      // Inside your Routes:
<Route path="/about" element={<AboutPage />} />
<Route path="/contact" element={<ContactPage />} />
<Route path="/features" element={<FeaturesPage />} />
<Route path="/footer" element={<Footer />} />
{/* 
<Route path="/footer" element={<TermsPage />} /> */}
      {/* Auth pages — no Navbar, redirect to dashboard if already logged in */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected dashboard */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Catch-all → landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}