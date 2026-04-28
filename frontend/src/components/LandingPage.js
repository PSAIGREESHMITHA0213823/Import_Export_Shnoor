// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   FaChartLine, FaShieldAlt, FaGlobe, FaRocket, 
//   FaClipboardCheck, FaUsers, FaArrowRight, FaCheckCircle,
//   FaSearch, FaCalculator, FaShip, FaFileAlt
// } from 'react-icons/fa';

// function LandingPage() {
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const stats = [
//     { number: "500+", label: "Enterprise Clients" },
//     { number: "50M+", label: "Trade Records" },
//     { number: "200+", label: "Countries Covered" },
//     { number: "99.9%", label: "Data Accuracy" }
//   ];

//   const features = [
//     { icon: FaSearch, title: "HSN Classification", desc: "AI-powered product classification with 95% accuracy", color: "from-blue-500 to-cyan-500" },
//     { icon: FaShieldAlt, title: "Risk Assessment", desc: "Real-time risk scoring based on payment history", color: "from-purple-500 to-pink-500" },
//     { icon: FaCalculator, title: "Duty Calculator", desc: "Accurate customs duty calculation for 200+ countries", color: "from-green-500 to-emerald-500" },
//     { icon: FaShip, title: "Shipment Tracking", desc: "End-to-end tracking with real-time updates", color: "from-orange-500 to-red-500" },
//     { icon: FaFileAlt, title: "Document Intelligence", desc: "Automated OCR and document validation", color: "from-indigo-500 to-purple-500" },
//     { icon: FaChartLine, title: "Analytics Dashboard", desc: "Comprehensive trade analytics and insights", color: "from-teal-500 to-cyan-500" }
//   ];

//   const roles = [
//     { role: "Importers", icon: FaUsers, color: "bg-blue-500", features: ["HS Code Finder", "Duty Calculator", "Supplier Risk"] },
//     { role: "Exporters", icon: FaGlobe, color: "bg-green-500", features: ["Market Insights", "Buyer Analytics", "Compliance Check"] },
//     { role: "Brokers", icon: FaClipboardCheck, color: "bg-purple-500", features: ["Client Management", "Document Processing", "Customs Filing"] },
//     { role: "Admin", icon: FaShieldAlt, color: "bg-red-500", features: ["User Management", "System Analytics", "Compliance Reports"] }
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navigation - Fixed with scroll effect */}
//       <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center">
//               <div className="gradient-bg rounded-xl p-2">
//                 <FaGlobe className="text-white text-xl" />
//               </div>
//               <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//                 TradeLint
//               </span>
//             </div>
//             <div className="hidden md:flex space-x-8">
//               <a href="#features" className="text-gray-700 hover:text-primary transition">Features</a>
//               <a href="#solutions" className="text-gray-700 hover:text-primary transition">Solutions</a>
//               <a href="#pricing" className="text-gray-700 hover:text-primary transition">Pricing</a>
//               <a href="#contact" className="text-gray-700 hover:text-primary transition">Contact</a>
//             </div>
//             <div className="flex space-x-3">
//               <Link to="/login" className="px-5 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition">
//                 Sign In
//               </Link>
//               <Link to="/register" className="px-5 py-2 gradient-bg text-white rounded-lg hover:opacity-90 transition">
//                 Get Started
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="pt-32 pb-20 px-4 gradient-bg relative overflow-hidden">
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="max-w-7xl mx-auto text-center relative z-10">
//           <div className="animate-fadeIn">
//             <div className="inline-block bg-white/20 backdrop-blur rounded-full px-5 py-2 mb-6">
//               <span className="text-white text-sm font-semibold">✨ A smarter way to access Trade Intelligence</span>
//             </div>
//             <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
//               Innovative Supply Chain
//               <br />
//               Intelligence Platform
//             </h1>
//             <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
//               Advanced global trade data analysis for importers, exporters, and brokers worldwide.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link to="/register" className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2">
//                 Get Started <FaArrowRight />
//               </Link>
//               <a href="#demo" className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition">
//                 Watch Demo
//               </a>
//             </div>
//             <div className="mt-12 flex flex-wrap justify-center gap-8 text-white">
//               <div className="flex items-center gap-2"><FaCheckCircle className="text-green-400" /> 200+ Countries</div>
//               <div className="flex items-center gap-2"><FaCheckCircle className="text-green-400" /> Real-time Data</div>
//               <div className="flex items-center gap-2"><FaCheckCircle className="text-green-400" /> AI-Powered Insights</div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//             {stats.map((stat, i) => (
//               <div key={i} className="group">
//                 <div className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:scale-105 transition-transform">
//                   {stat.number}
//                 </div>
//                 <div className="text-gray-600">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="text-center mb-12">
//             <div className="inline-block bg-primary/10 rounded-full px-4 py-1 mb-4">
//               <span className="text-primary text-sm font-semibold">POWERFUL FEATURES</span>
//             </div>
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Powerful Features for Global Trade
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Everything you need to manage your import/export operations
//             </p>
//           </div>
          
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {features.map((feature, i) => (
//               <div key={i} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//                 <div className={`bg-gradient-to-r ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-5`}>
//                   <feature.icon className="text-white text-2xl" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
//                 <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Solutions for Every Role Section */}
//       <section id="solutions" className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="text-center mb-12">
//             <div className="inline-block bg-primary/10 rounded-full px-4 py-1 mb-4">
//               <span className="text-primary text-sm font-semibold">ROLE-BASED SOLUTIONS</span>
//             </div>
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Solutions for Every Role
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Tailored dashboards for your specific needs
//             </p>
//           </div>
          
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {roles.map((item, i) => (
//               <div key={i} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
//                 <div className={`${item.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
//                   <item.icon className="text-white text-2xl" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-3">{item.role}</h3>
//                 <ul className="text-gray-600 space-y-2">
//                   {item.features.map((f, j) => (
//                     <li key={j} className="text-sm">✓ {f}</li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="text-center mb-12">
//             <div className="inline-block bg-primary/10 rounded-full px-4 py-1 mb-4">
//               <span className="text-primary text-sm font-semibold">HOW IT WORKS</span>
//             </div>
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Simple 3-Step Process
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Get started with TradeLint in minutes
//             </p>
//           </div>
          
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               { step: "01", title: "Upload Documents", desc: "Upload your invoices, bills of lading, and customs documents" },
//               { step: "02", title: "AI Processing", desc: "Our AI extracts data and classifies products automatically" },
//               { step: "03", title: "Get Insights", desc: "Receive duty calculations, risk scores, and tracking updates" }
//             ].map((step, i) => (
//               <div key={i} className="text-center">
//                 <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
//                   {step.step}
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
//                 <p className="text-gray-600">{step.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 gradient-bg">
//         <div className="max-w-4xl mx-auto text-center px-4">
//           <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
//             Ready to Transform Your Trade Operations?
//           </h2>
//           <p className="text-xl text-white/90 mb-8">
//             Join thousands of businesses using TradeLint for global trade intelligence
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link to="/register" className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transition">
//               Start Free Trial
//             </Link>
//             <Link to="/contact" className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition">
//               Contact Sales
//             </Link>
//           </div>
//           <p className="text-white/70 mt-6 text-sm">No credit card required • Free 14-day trial</p>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="grid md:grid-cols-4 gap-8">
//             <div>
//               <div className="flex items-center mb-4">
//                 <div className="gradient-bg rounded-lg p-2">
//                   <FaGlobe className="text-white" />
//                 </div>
//                 <span className="ml-2 text-xl font-bold">TradeLint</span>
//               </div>
//               <p className="text-gray-400 text-sm">AI-Powered Import Export Intelligence Platform</p>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4">Product</h4>
//               <ul className="space-y-2 text-gray-400 text-sm">
//                 <li><a href="#features" className="hover:text-white">Features</a></li>
//                 <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
//                 <li><a href="#demo" className="hover:text-white">Demo</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4">Company</h4>
//               <ul className="space-y-2 text-gray-400 text-sm">
//                 <li><a href="#about" className="hover:text-white">About Us</a></li>
//                 <li><a href="#contact" className="hover:text-white">Contact</a></li>
//                 <li><a href="#blog" className="hover:text-white">Blog</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4">Legal</h4>
//               <ul className="space-y-2 text-gray-400 text-sm">
//                 <li><a href="#privacy" className="hover:text-white">Privacy Policy</a></li>
//                 <li><a href="#terms" className="hover:text-white">Terms of Service</a></li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
//             <p>&copy; 2024 TradeLint. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>

//       {/* CSS Animations - Add to your global.css */}
//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.8s ease-out;
//         }
//         .gradient-bg {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//         }
//         .bg-primary {
//           background-color: #667eea;
//         }
//         .text-primary {
//           color: #667eea;
//         }
//         .border-primary {
//           border-color: #667eea;
//         }
//         .from-primary {
//           --tw-gradient-from: #667eea;
//         }
//         .to-secondary {
//           --tw-gradient-to: #764ba2;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default LandingPage;


import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  FaGlobe, FaShip, FaCalculator, FaShieldAlt, FaChartLine, 
  FaFileAlt, FaUsers, FaArrowRight, FaCheckCircle, FaStar,
  FaSearch, FaTruck, FaClock, FaUserCheck, FaChartBar
} from "react-icons/fa";

// Custom hook for scroll reveal animations
const useReveal = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { 
      if (e.isIntersecting) { 
        setVisible(true); 
        obs.disconnect(); 
      } 
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

const reveal = (visible, delay = 0) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(36px)",
  transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
});

const Img = ({ src, alt, style }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ position: "relative", overflow: "hidden", ...style }}>
      {!loaded && <div style={{ position: "absolute", inset: 0, background: "rgba(13,33,68,0.4)" }} />}
      <img 
        src={src} 
        alt={alt} 
        onLoad={() => setLoaded(true)}
        style={{ 
          width: "100%", 
          height: "100%", 
          objectFit: "cover", 
          opacity: loaded ? 1 : 0, 
          transition: "opacity 0.5s" 
        }} 
      />
    </div>
  );
};

const ParallaxStrip = ({ images }) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setOffset(rect.top * 0.18);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div ref={ref} style={{ overflow: "hidden", display: "flex", gap: 16, height: 280 }}>
      {images.map((src, i) => (
        <div key={i} style={{ flex: 1, overflow: "hidden", borderRadius: 14, position: "relative" }}>
          <img 
            src={src} 
            alt="" 
            style={{ 
              width: "100%", 
              height: "120%", 
              objectFit: "cover", 
              transform: `translateY(${offset * (i % 2 === 0 ? 1 : -1)}px)`, 
              transition: "transform 0.05s linear" 
            }} 
          />
        </div>
      ))}
    </div>
  );
};

const Counter = ({ val, label, visible, delay }) => (
  <div style={{ ...reveal(visible, delay) }}>
    <div style={{ fontSize: "clamp(22px,2.5vw,34px)", fontWeight: 900, color: "#E8A020", fontFamily: "Georgia,serif" }}>
      {val}
    </div>
    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", marginTop: 4, textTransform: "uppercase" }}>
      {label}
    </div>
  </div>
);

const FlagPin = ({ code }) => (
  <div style={{ 
    width: 36, height: 36, borderRadius: "50%", 
    background: "linear-gradient(135deg,#E8A020,#C8820A)", 
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 
  }}>
    <FaGlobe size={16} color="#0D1E38" />
  </div>
);

const stats = [
  { val: "200+", label: "Countries Served" },
  { val: "4.9★", label: "Client Rating" },
  { val: "50M+", label: "Trade Records" },
  { val: "2024", label: "Platform Launched" },
];

const services = [
  { 
    Icon: FaSearch, 
    title: "AI HSN Classification", 
    desc: "Our ML models predict HSN codes with 95%+ accuracy — reducing classification errors, saving duty costs, and speeding up customs clearance.", 
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80" 
  },
  { 
    Icon: FaCalculator, 
    title: "Smart Duty Calculator", 
    desc: "Real-time customs duty calculation across 200+ countries — including basic customs duty, IGST, anti-dumping charges, social welfare surcharge.", 
    img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80" 
  },
  { 
    Icon: FaShieldAlt, 
    title: "Risk Assessment Engine", 
    desc: "AI-powered risk scoring based on client payment history, supplier credibility, and shipment delay patterns.", 
    img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80" 
  },
  { 
    Icon: FaShip, 
    title: "Shipment Tracking", 
    desc: "End-to-end real-time shipment visibility with GPS updates, port/customs status monitoring, delay prediction, and proactive ETA alerts.", 
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80" 
  },
  { 
    Icon: FaFileAlt, 
    title: "Document Intelligence", 
    desc: "OCR-powered extraction from invoices, bills of lading, and packing lists. NLP extracts product details, quantities, origin, and value.", 
    img: "https://content.cloudthat.com/resources/wp-content/uploads/2024/01/Transforming-Documents-into-Actionable-Data-with-Azure-AI-Document-Intelligence.webp" 
  },
  { 
    Icon: FaChartLine, 
    title: "Analytics Dashboard", 
    desc: "Comprehensive trade analytics — shipment trends, duty expenses, risk heatmaps, payment insights, and HSN accuracy reports.", 
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80" 
  },
];

const testimonials = [
  { 
    name: "Rajesh Kumar", 
    role: "Import Manager, Mumbai Tech Corp", 
    text: "TradeLint transformed our import operations completely. Their AI HSN classification engine is incredibly accurate — we've reduced clearance time by 60%.",
    rating: 5 
  },
  { 
    name: "Omar Al-Rashid", 
    role: "VP Operations, Dubai Logistics", 
    text: "The duty calculator is a game-changer for cross-border trade. We now know landed costs before shipping. A true partner in global trade.",
    rating: 5 
  },
  { 
    name: "Sarah Mitchell", 
    role: "Logistics Director, Missouri MedTech", 
    text: "Document processing is seamless. The OCR + NLP extraction pulls data with 98% accuracy. Compliance alerts give us complete confidence.",
    rating: 5 
  },
];

const globalOffices = [
  { city: "Mumbai, India", role: "Global Headquarters", flag: "IN" },
  { city: "Dubai, UAE", role: "Regional Hub — GCC", flag: "AE" },
  { city: "Singapore", role: "Asia Pacific Hub", flag: "SG" },
  { city: "London, UK", role: "European Office", flag: "UK" },
];

const stripImages = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80",
  "https://images.unsplash.com/photo-1488229297570-58520851e868?w=500&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80",
  "https://images.unsplash.com/photo-1565728744382-61accd4aa148?w=500&q=80",
];

function LandingPage() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [servRef, servVisible] = useReveal();
  const [aboutRef, aboutVisible] = useReveal();
  const [globalRef, globalVisible] = useReveal();
  const [testRef, testVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();

  useEffect(() => { 
    const t = setTimeout(() => setHeroVisible(true), 100); 
    return () => clearTimeout(t); 
  }, []);

  return (
    <div style={{ paddingTop: 80, background: "#0D1E38" }}>

      {/* Hero Section */}
      <section style={{ 
        background: "linear-gradient(135deg, #0A1628 0%, #1A3A5C 100%)", 
        minHeight: "94vh", 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        alignItems: "center", 
        padding: "60px 5%", 
        gap: 60,
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          opacity: 0.04, 
          backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.3) 1px,transparent 1px)", 
          backgroundSize: "40px 40px" 
        }} />
        <div style={{ 
          position: "absolute", 
          top: "20%", 
          right: "30%", 
          width: 600, 
          height: 600, 
          borderRadius: "50%", 
          background: "radial-gradient(circle,rgba(232,160,32,0.08) 0%,transparent 70%)",
          pointerEvents: "none" 
        }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ 
            ...reveal(heroVisible, 0), 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 8, 
            background: "rgba(232,160,32,0.15)", 
            border: "1px solid rgba(232,160,32,0.3)", 
            borderRadius: 100, 
            padding: "6px 16px", 
            marginBottom: 24 
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#E8A020", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#E8A020", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              AI-Powered Trade Intelligence
            </span>
          </div>
          <h1 style={{ 
            ...reveal(heroVisible, 0.1), 
            fontFamily: "Georgia,'Times New Roman',serif", 
            fontSize: "clamp(34px,4.5vw,64px)", 
            color: "#FFF", 
            fontWeight: 900, 
            lineHeight: 1.1, 
            marginBottom: 22 
          }}>
            A smarter way to access
            <br />
            <span style={{ color: "#E8A020" }}>Trade Intelligence</span>
          </h1>
          <p style={{ 
            ...reveal(heroVisible, 0.2), 
            fontSize: 16, 
            color: "rgba(255,255,255,0.65)", 
            lineHeight: 1.9, 
            maxWidth: 520, 
            marginBottom: 36,
            textAlign: "justify"
          }}>
            Innovative supply chain intelligence platform offering advanced global trade data analysis 
            for importers, exporters, and brokers worldwide.
          </p>
          <div style={{ ...reveal(heroVisible, 0.3), display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link to="/register" style={{ 
              background: "linear-gradient(135deg,#C8820A,#E8A020)", 
              color: "#0D1E38", 
              border: "none", 
              borderRadius: 10, 
              padding: "15px 32px", 
              fontSize: 14, 
              fontWeight: 700, 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(232,160,32,0.35)"
            }}>
              Get Started <FaArrowRight size={16} />
            </Link>
            <a href="#features" style={{ 
              background: "rgba(255,255,255,0.08)", 
              color: "#FFF", 
              border: "1px solid rgba(255,255,255,0.2)", 
              borderRadius: 10, 
              padding: "15px 32px", 
              fontSize: 14, 
              fontWeight: 600, 
              cursor: "pointer", 
              textDecoration: "none",
              backdropFilter: "blur(8px)" 
            }}>
              Watch Demo
            </a>
          </div>
          <div style={{ 
            ...reveal(heroVisible, 0.4), 
            display: "grid", 
            gridTemplateColumns: "repeat(4,1fr)", 
            gap: 24, 
            marginTop: 52, 
            paddingTop: 40, 
            borderTop: "1px solid rgba(255,255,255,0.1)" 
          }}>
            {stats.map((s, i) => <Counter key={i} val={s.val} label={s.label} visible={heroVisible} delay={0.45 + i * 0.08} />)}
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 2, height: 560, ...reveal(heroVisible, 0.2) }}>
          <Img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=700&q=80" 
            alt="Global trade data" 
            style={{ position: "absolute", top: 0, left: 0, width: "63%", height: 320, borderRadius: 16, border: "2px solid rgba(232,160,32,0.25)" }} 
          />
          <Img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=80" 
            alt="Shipping container" 
            style={{ position: "absolute", bottom: 60, left: 0, width: "46%", height: 210, borderRadius: 12, border: "2px solid rgba(232,160,32,0.15)" }} 
          />
          <Img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80" 
            alt="Trade analytics" 
            style={{ position: "absolute", top: 40, right: 0, width: "52%", height: 240, borderRadius: 12, border: "2px solid rgba(232,160,32,0.15)" }} 
          />
          <Img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80" 
            alt="AI dashboard" 
            style={{ position: "absolute", bottom: 0, right: 0, width: "50%", height: 190, borderRadius: 12, border: "2px solid rgba(232,160,32,0.15)" }} 
          />
          <div style={{ 
            position: "absolute", 
            bottom: 68, 
            left: "50%", 
            transform: "translateX(-50%)", 
            background: "rgba(13,30,56,0.92)", 
            border: "1px solid rgba(232,160,32,0.4)", 
            borderRadius: 12, 
            padding: "14px 20px", 
            backdropFilter: "blur(12px)", 
            whiteSpace: "nowrap", 
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)" 
          }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#E8A020", textAlign: "center" }}>95%</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", textAlign: "center", letterSpacing: "0.1em", marginTop: 2 }}>
              HSN ACCURACY
            </div>
          </div>
        </div>
      </section>

      {/* Parallax Strip */}
      <section style={{ background: "#0D1E38", padding: "60px 5% 0" }}>
        <ParallaxStrip images={stripImages} />
      </section>

      {/* Services Section */}
      <section ref={servRef} id="features" style={{ background: "#0D1E38", padding: "90px 5%" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56, ...reveal(servVisible) }}>
            <div style={{ 
              display: "inline-flex", 
              gap: 8, 
              alignItems: "center", 
              background: "rgba(232,160,32,0.1)", 
              border: "1px solid rgba(232,160,32,0.2)", 
              borderRadius: 100, 
              padding: "5px 16px", 
              marginBottom: 16 
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#E8A020", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                Powerful Features
              </span>
            </div>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,3.5vw,46px)", color: "#FFF", fontWeight: 800, marginBottom: 14 }}>
              Powerful Features for <span style={{ color: "#E8A020" }}>Global Trade</span>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 600, margin: "0 auto", lineHeight: 1.8, textAlign: "center" }}>
              Everything you need to manage your import/export operations
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 24 }}>
            {services.map((s, i) => (
              <div 
                key={i} 
                style={{ 
                  ...reveal(servVisible, i * 0.08), 
                  background: "rgba(255,255,255,0.05)", 
                  border: "1px solid rgba(255,255,255,0.1)", 
                  borderRadius: 16, 
                  overflow: "hidden", 
                  transition: "all 0.3s", 
                  cursor: "default" 
                }}
                onMouseEnter={e => { 
                  e.currentTarget.style.transform = "translateY(-6px)"; 
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.3)"; 
                  e.currentTarget.style.borderColor = "#E8A020"; 
                }}
                onMouseLeave={e => { 
                  e.currentTarget.style.transform = "translateY(0)"; 
                  e.currentTarget.style.boxShadow = "none"; 
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; 
                }}
              >
                <Img src={s.img} alt={s.title} style={{ height: 180 }} />
                <div style={{ padding: "24px 26px" }}>
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 12, 
                    background: "rgba(232,160,32,0.15)", 
                    border: "1px solid rgba(232,160,32,0.3)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    marginBottom: 16 
                  }}>
                    <s.Icon size={22} color="#E8A020" />
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#FFF", marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, textAlign: "justify" }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions for Every Role Section */}
      <section ref={aboutRef} style={{ background: "#0A1628", padding: "90px 5%" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56, ...reveal(aboutVisible) }}>
            <div style={{ 
              display: "inline-flex", 
              gap: 8, 
              alignItems: "center", 
              background: "rgba(232,160,32,0.1)", 
              border: "1px solid rgba(232,160,32,0.2)", 
              borderRadius: 100, 
              padding: "5px 16px", 
              marginBottom: 16 
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#E8A020", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                Solutions for Every Role
              </span>
            </div>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,3.5vw,44px)", color: "#FFF", fontWeight: 800, marginBottom: 14 }}>
              Solutions for <span style={{ color: "#E8A020" }}>Every Role</span>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
              Tailored dashboards for your specific needs
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
            {[
              { role: "Importers", icon: FaUsers, features: ["HS Code Finder", "Duty Calculator", "Supplier Risk"] },
              { role: "Exporters", icon: FaGlobe, features: ["Market Insights", "Buyer Analytics", "Compliance Check"] },
              { role: "Brokers", icon: FaFileAlt, features: ["Client Management", "Document Processing", "Customs Filing"] },
              { role: "Admin", icon: FaShieldAlt, features: ["User Management", "System Analytics", "Compliance Reports"] }
            ].map((item, i) => (
              <div 
                key={i} 
                style={{ 
                  ...reveal(aboutVisible, i * 0.1), 
                  background: "rgba(255,255,255,0.05)", 
                  border: "1px solid rgba(255,255,255,0.1)", 
                  borderRadius: 16, 
                  padding: "32px 24px", 
                  textAlign: "center",
                  transition: "all 0.3s"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = "#E8A020"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              >
                <div style={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: "50%", 
                  background: "rgba(232,160,32,0.15)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  margin: "0 auto 20px",
                  border: "1px solid rgba(232,160,32,0.3)"
                }}>
                  <item.icon size={28} color="#E8A020" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#FFF", marginBottom: 16 }}>{item.role}</h3>
                <ul style={{ listStyle: "none", padding: 0, color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 2 }}>
                  {item.features.map((f, j) => <li key={j}>✓ {f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section ref={globalRef} style={{ background: "#0D1E38", padding: "90px 5%" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56, ...reveal(globalVisible) }}>
            <div style={{ 
              display: "inline-flex", 
              gap: 8, 
              alignItems: "center", 
              background: "rgba(232,160,32,0.1)", 
              border: "1px solid rgba(232,160,32,0.2)", 
              borderRadius: 100, 
              padding: "5px 16px", 
              marginBottom: 16 
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#E8A020", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                Global Coverage
              </span>
            </div>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,3.5vw,44px)", color: "#FFF", fontWeight: 800, marginBottom: 14 }}>
              Operating Across <span style={{ color: "#E8A020" }}>200+ Countries</span>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
              Real-time tariff data, trade regulations, and customs intelligence for importers and exporters worldwide.
            </p>
          </div>

          <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: `1px solid rgba(232,160,32,0.2)`, marginBottom: 40, ...reveal(globalVisible, 0.1) }}>
            <div style={{ background: "#1A3A5C", height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <FaGlobe size={80} color="#E8A020" opacity={0.3} />
                <p style={{ color: "rgba(255,255,255,0.5)", marginTop: 20 }}>Interactive World Map</p>
              </div>
            </div>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,rgba(13,30,56,0.85) 0%,rgba(13,30,56,0.3) 60%,rgba(13,30,56,0.6) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 5%" }}>
              <div>
                <div style={{ fontSize: "clamp(22px,3vw,38px)", fontFamily: "Georgia,serif", color: "#FFF", fontWeight: 800, marginBottom: 8 }}>
                  Global Trade <span style={{ color: "#E8A020" }}>Intelligence</span>
                </div>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", maxWidth: 420, lineHeight: 1.8, textAlign: "justify" }}>
                  Real-time trade data, customs regulations, and AI-powered insights for every country you trade with.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {globalOffices.map((o, i) => (
              <div 
                key={i} 
                style={{ 
                  ...reveal(globalVisible, 0.1 + i * 0.07), 
                  background: "rgba(255,255,255,0.05)", 
                  border: "1px solid rgba(255,255,255,0.1)", 
                  borderRadius: 14, 
                  padding: "24px 22px", 
                  display: "flex", 
                  gap: 16, 
                  alignItems: "center" 
                }}
              >
                <FlagPin code={o.flag} />
                <div>
                  <div style={{ fontSize: 9, color: "#E8A020", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
                    {o.role}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#FFF" }}>{o.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testRef} style={{ background: "#0A1628", padding: "90px 5%" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52, ...reveal(testVisible) }}>
            <div style={{ 
              display: "inline-flex", 
              gap: 8, 
              alignItems: "center", 
              background: "rgba(232,160,32,0.1)", 
              border: "1px solid rgba(232,160,32,0.2)", 
              borderRadius: 100, 
              padding: "5px 16px", 
              marginBottom: 16 
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#E8A020", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                Client Voices
              </span>
            </div>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,3vw,42px)", color: "#FFF", fontWeight: 800 }}>
              Trusted by <span style={{ color: "#E8A020" }}>500+ Enterprises</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24 }}>
            {testimonials.map((tc, i) => (
              <div 
                key={i} 
                style={{ 
                  ...reveal(testVisible, i * 0.1), 
                  background: "rgba(255,255,255,0.05)", 
                  border: "1px solid rgba(255,255,255,0.1)", 
                  borderRadius: 16, 
                  padding: "36px 30px", 
                  position: "relative", 
                  overflow: "hidden" 
                }}
              >
                <div style={{ 
                  position: "absolute", 
                  top: 20, 
                  right: 24, 
                  fontSize: 64, 
                  color: "#E8A020", 
                  opacity: 0.12, 
                  fontFamily: "Georgia,serif", 
                  lineHeight: 1 
                }}>
                  "
                </div>
                <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
                  {[...Array(tc.rating)].map((_, j) => <FaStar key={j} style={{ color: "#E8A020", fontSize: 15 }} />)}
                </div>
                <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.85, marginBottom: 28, fontStyle: "italic", textAlign: "justify" }}>
                  "{tc.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ 
                    width: 46, 
                    height: 46, 
                    borderRadius: "50%", 
                    background: "linear-gradient(135deg,#C8820A,#E8A020)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: 18, 
                    color: "#0D1E38", 
                    fontWeight: 800 
                  }}>
                    {tc.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#FFF" }}>{tc.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{tc.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} style={{ position: "relative", overflow: "hidden", padding: 0 }}>
        <div style={{ 
          background: "linear-gradient(135deg,#0D2144,#152E58)", 
          height: 420, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          position: "relative"
        }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(13,33,68,0.93),rgba(26,58,106,0.85))" }} />
          <div style={{ 
            position: "relative", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: "0 5%", 
            textAlign: "center", 
            ...reveal(ctaVisible) 
          }}>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,52px)", color: "#FFF", fontWeight: 800, marginBottom: 18 }}>
              Ready to Transform Your <span style={{ color: "#E8A020" }}>Trade Operations</span>?
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.85 }}>
              Join thousands of businesses using TradeLint for AI-powered import-export intelligence.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/register" style={{ 
                background: "linear-gradient(135deg,#C8820A,#E8A020)", 
                color: "#0D1E38", 
                border: "none", 
                borderRadius: 10, 
                padding: "15px 36px", 
                fontSize: 15, 
                fontWeight: 700, 
                cursor: "pointer", 
                textDecoration: "none",
                boxShadow: "0 4px 24px rgba(232,160,32,0.4)" 
              }}>
                Start Free Trial
              </Link>
              <Link to="/contact" style={{ 
                background: "rgba(255,255,255,0.1)", 
                color: "#FFF", 
                border: "1px solid rgba(255,255,255,0.25)", 
                borderRadius: 10, 
                padding: "15px 36px", 
                fontSize: 15, 
                fontWeight: 600, 
                cursor: "pointer", 
                textDecoration: "none",
                backdropFilter: "blur(8px)" 
              }}>
                Contact Sales
              </Link>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 24 }}>
              No credit card required • Free 14-day trial
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse { 
          0%, 100% { opacity: 1; } 
          50% { opacity: 0.4; } 
        }
      `}</style>
    </div>
  );
}

export default LandingPage;