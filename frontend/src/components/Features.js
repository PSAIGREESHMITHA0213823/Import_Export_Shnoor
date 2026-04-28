// import React, { useEffect, useRef, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   FaSearch, FaCalculator, FaShieldAlt, FaShip, FaFileAlt, FaChartLine,
//   FaCheckCircle, FaGlobe, FaClock, FaTruck, FaDollarSign, FaUserCheck,
//   FaArrowRight
// } from 'react-icons/fa';

// const useReveal = (threshold = 0.15) => {
//   const ref = useRef(null);
//   const [visible, setVisible] = useState(false);
//   useEffect(() => {
//     const obs = new IntersectionObserver(([e]) => { 
//       if (e.isIntersecting) { 
//         setVisible(true); 
//         obs.disconnect(); 
//       } 
//     }, { threshold });
//     if (ref.current) obs.observe(ref.current);
//     return () => obs.disconnect();
//   }, [threshold]);
//   return [ref, visible];
// };

// const reveal = (visible, delay = 0) => ({
//   opacity: visible ? 1 : 0,
//   transform: visible ? "translateY(0)" : "translateY(36px)",
//   transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
// });

// const featuresList = [
//   { icon: FaSearch, title: "AI HSN Classification", desc: "Machine learning predicts HSN codes with 95%+ accuracy. Supports 20,000+ product categories.", color: "#E8A020" },
//   { icon: FaCalculator, title: "Smart Duty Calculator", desc: "Real-time duty calculation across 200+ countries including anti-dumping and trade agreements.", color: "#E8A020" },
//   { icon: FaShieldAlt, title: "Risk Assessment", desc: "AI-powered risk scoring based on payment history, supplier credibility, and delay patterns.", color: "#E8A020" },
//   { icon: FaShip, title: "Shipment Tracking", desc: "End-to-end visibility with GPS updates, port monitoring, and predictive ETA alerts.", color: "#E8A020" },
//   { icon: FaFileAlt, title: "Document Intelligence", desc: "OCR extraction with fraud detection and compliance verification for all trade documents.", color: "#E8A020" },
//   { icon: FaChartLine, title: "Analytics Dashboard", desc: "Comprehensive trade analytics with shipment trends, duty expenses, and risk heatmaps.", color: "#E8A020" },
//   { icon: FaGlobe, title: "Global Coverage", desc: "Real-time tariff data and customs regulations for 200+ countries.", color: "#E8A020" },
//   { icon: FaClock, title: "Real-time Updates", desc: "Live updates on duty changes, regulation updates, and shipment status.", color: "#E8A020" },
//   { icon: FaUserCheck, title: "Compliance Engine", desc: "Automated compliance checks with customs regulations and trade agreements.", color: "#E8A020" },
// ];

// const Img = ({ src, alt, style }) => {
//   const [loaded, setLoaded] = useState(false);
//   return (
//     <div style={{ position: "relative", overflow: "hidden", ...style }}>
//       {!loaded && <div style={{ position: "absolute", inset: 0, background: "rgba(13,33,68,0.4)" }} />}
//       <img 
//         src={src} 
//         alt={alt} 
//         onLoad={() => setLoaded(true)}
//         style={{ 
//           width: "100%", 
//           height: "100%", 
//           objectFit: "cover", 
//           opacity: loaded ? 1 : 0, 
//           transition: "opacity 0.5s" 
//         }} 
//       />
//     </div>
//   );
// };

// function Features() {
//   const [heroVisible, setHeroVisible] = useState(false);
//   const [featuresRef, featuresVisible] = useReveal();
//   const [ctaRef, ctaVisible] = useReveal();

//   useEffect(() => { 
//     const t = setTimeout(() => setHeroVisible(true), 100); 
//     return () => clearTimeout(t); 
//   }, []);

//   return (
//     <div style={{ paddingTop: 80, background: "#0D1E38" }}>

//       {/* Hero Section */}
//       <section style={{ 
//         background: "linear-gradient(135deg, #0A1628 0%, #1A3A5C 100%)", 
//         padding: "80px 5%", 
//         textAlign: "center",
//         position: "relative",
//         overflow: "hidden"
//       }}>
//         <div style={{ 
//           position: "absolute", 
//           inset: 0, 
//           opacity: 0.04, 
//           backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.3) 1px,transparent 1px)", 
//           backgroundSize: "40px 40px" 
//         }} />
//         <div style={{ position: "relative", zIndex: 2 }}>
//           <div style={reveal(heroVisible)}>
//             <div style={{ 
//               display: "inline-flex", 
//               gap: 8, 
//               alignItems: "center", 
//               background: "rgba(232,160,32,0.15)", 
//               border: "1px solid rgba(232,160,32,0.3)", 
//               borderRadius: 100, 
//               padding: "6px 16px", 
//               marginBottom: 24 
//             }}>
//               <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#E8A020", animation: "pulse 2s infinite" }} />
//               <span style={{ fontSize: 11, fontWeight: 700, color: "#E8A020", letterSpacing: "0.18em", textTransform: "uppercase" }}>
//                 Enterprise Features
//               </span>
//             </div>
//             <h1 style={{ 
//               fontFamily: "Georgia,'Times New Roman',serif", 
//               fontSize: "clamp(34px,4.5vw,64px)", 
//               color: "#FFF", 
//               fontWeight: 900, 
//               lineHeight: 1.1, 
//               marginBottom: 22 
//             }}>
//               Powerful <span style={{ color: "#E8A020" }}>Features</span>
//             </h1>
//             <p style={{ 
//               fontSize: 16, 
//               color: "rgba(255,255,255,0.65)", 
//               lineHeight: 1.9, 
//               maxWidth: 700, 
//               margin: "0 auto",
//               textAlign: "center"
//             }}>
//               Everything you need to automate and optimize your import-export operations.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Features Grid */}
//       <section ref={featuresRef} style={{ background: "#0D1E38", padding: "90px 5%" }}>
//         <div style={{ maxWidth: 1240, margin: "0 auto" }}>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))", gap: 32 }}>
//             {featuresList.map((feature, i) => (
//               <div 
//                 key={i} 
//                 style={{ 
//                   ...reveal(featuresVisible, i * 0.05), 
//                   background: "rgba(255,255,255,0.05)", 
//                   border: "1px solid rgba(255,255,255,0.1)", 
//                   borderRadius: 16, 
//                   padding: "32px 28px",
//                   transition: "all 0.3s"
//                 }}
//                 onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = "#E8A020"; }}
//                 onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
//               >
//                 <div style={{ 
//                   width: 56, 
//                   height: 56, 
//                   borderRadius: 12, 
//                   background: "rgba(232,160,32,0.15)", 
//                   display: "flex", 
//                   alignItems: "center", 
//                   justifyContent: "center", 
//                   marginBottom: 20,
//                   border: "1px solid rgba(232,160,32,0.3)"
//                 }}>
//                   <feature.icon size={28} color="#E8A020" />
//                 </div>
//                 <h3 style={{ fontSize: 18, fontWeight: 700, color: "#FFF", marginBottom: 12 }}>{feature.title}</h3>
//                 <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{feature.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Countries Coverage */}
//       <section style={{ background: "#0A1628", padding: "80px 5%" }}>
//         <div style={{ maxWidth: 1240, margin: "0 auto", textAlign: "center" }}>
//           <div style={{ 
//             display: "inline-flex", 
//             gap: 8, 
//             alignItems: "center", 
//             background: "rgba(232,160,32,0.1)", 
//             border: "1px solid rgba(232,160,32,0.2)", 
//             borderRadius: 100, 
//             padding: "5px 16px", 
//             marginBottom: 20 
//           }}>
//             <span style={{ fontSize: 10, fontWeight: 700, color: "#E8A020", letterSpacing: "0.18em", textTransform: "uppercase" }}>
//               Global Coverage
//             </span>
//           </div>
//           <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,3.5vw,44px)", color: "#FFF", fontWeight: 800, marginBottom: 16 }}>
//             Covering <span style={{ color: "#E8A020" }}>200+ Countries</span>
//           </h2>
//           <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.8 }}>
//             Real-time tariff data, customs regulations, and trade agreements for every major trading nation.
//           </p>
//           <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20 }}>
//             {["🇺🇸", "🇬🇧", "🇩🇪", "🇫🇷", "🇯🇵", "🇨🇳", "🇮🇳", "🇦🇪", "🇸🇬", "🇦🇺", "🇨🇦", "🇧🇷", "🇲🇽", "🇰🇷", "🇮🇹", "🇪🇸"].map((flag, i) => (
//               <span key={i} style={{ fontSize: 40, transition: "transform 0.3s", cursor: "default", display: "inline-block" }}
//                 onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
//                 onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
//                 {flag}
//               </span>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section ref={ctaRef} style={{ position: "relative", overflow: "hidden", padding: 0 }}>
//         <div style={{ 
//           background: "linear-gradient(135deg,#0D2144,#152E58)", 
//           height: 400, 
//           display: "flex", 
//           alignItems: "center", 
//           justifyContent: "center",
//           position: "relative"
//         }}>
//           <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(13,33,68,0.93),rgba(26,58,106,0.85))" }} />
//           <div style={{ 
//             position: "relative", 
//             display: "flex", 
//             flexDirection: "column", 
//             alignItems: "center", 
//             justifyContent: "center", 
//             padding: "0 5%", 
//             textAlign: "center", 
//             ...reveal(ctaVisible) 
//           }}>
//             <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,52px)", color: "#FFF", fontWeight: 800, marginBottom: 18 }}>
//               Ready to Transform Your <span style={{ color: "#E8A020" }}>Trade Operations</span>?
//             </h2>
//             <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.85 }}>
//               Join 500+ enterprises using TradeLint for AI-powered import-export intelligence.
//             </p>
//             <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
//               <Link to="/register" style={{ 
//                 background: "linear-gradient(135deg,#C8820A,#E8A020)", 
//                 color: "#0D1E38", 
//                 border: "none", 
//                 borderRadius: 10, 
//                 padding: "15px 36px", 
//                 fontSize: 15, 
//                 fontWeight: 700, 
//                 cursor: "pointer", 
//                 textDecoration: "none",
//                 boxShadow: "0 4px 24px rgba(232,160,32,0.4)" 
//               }}>
//                 Start Free Trial
//               </Link>
//               <Link to="/contact" style={{ 
//                 background: "rgba(255,255,255,0.1)", 
//                 color: "#FFF", 
//                 border: "1px solid rgba(255,255,255,0.25)", 
//                 borderRadius: 10, 
//                 padding: "15px 36px", 
//                 fontSize: 15, 
//                 fontWeight: 600, 
//                 cursor: "pointer", 
//                 textDecoration: "none",
//                 backdropFilter: "blur(8px)" 
//               }}>
//                 Contact Sales
//               </Link>
//             </div>
//             <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 24 }}>
//               No credit card required • Free 14-day trial
//             </p>
//           </div>
//         </div>
//       </section>

//       <style>{`
//         @keyframes pulse { 
//           0%, 100% { opacity: 1; } 
//           50% { opacity: 0.4; } 
//         }
//       `}</style>
//     </div>
//   );
// }

// export default Features;


import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, FaCalculator, FaShieldAlt, FaShip, FaFileAlt, FaChartLine,
  FaCheckCircle, FaGlobe, FaClock, FaTruck, FaDollarSign, FaUserCheck,
  FaArrowRight
} from 'react-icons/fa';
import Navbar from './Navbar';
import Footer from './Footer';

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

const featuresList = [
  { icon: FaSearch, title: "AI HSN Classification", desc: "Machine learning predicts HSN codes with 95%+ accuracy. Supports 20,000+ product categories.", color: "#E8A020" },
  { icon: FaCalculator, title: "Smart Duty Calculator", desc: "Real-time duty calculation across 200+ countries including anti-dumping and trade agreements.", color: "#E8A020" },
  { icon: FaShieldAlt, title: "Risk Assessment", desc: "AI-powered risk scoring based on payment history, supplier credibility, and delay patterns.", color: "#E8A020" },
  { icon: FaShip, title: "Shipment Tracking", desc: "End-to-end visibility with GPS updates, port monitoring, and predictive ETA alerts.", color: "#E8A020" },
  { icon: FaFileAlt, title: "Document Intelligence", desc: "OCR extraction with fraud detection and compliance verification for all trade documents.", color: "#E8A020" },
  { icon: FaChartLine, title: "Analytics Dashboard", desc: "Comprehensive trade analytics with shipment trends, duty expenses, and risk heatmaps.", color: "#E8A020" },
  { icon: FaGlobe, title: "Global Coverage", desc: "Real-time tariff data and customs regulations for 200+ countries.", color: "#E8A020" },
  { icon: FaClock, title: "Real-time Updates", desc: "Live updates on duty changes, regulation updates, and shipment status.", color: "#E8A020" },
  { icon: FaUserCheck, title: "Compliance Engine", desc: "Automated compliance checks with customs regulations and trade agreements.", color: "#E8A020" },
];

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

function Features() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [featuresRef, featuresVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();

  useEffect(() => { 
    const t = setTimeout(() => setHeroVisible(true), 100); 
    return () => clearTimeout(t); 
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 80, background: "#0D1E38" }}>

        {/* Hero Section */}
        <section style={{ 
          background: "linear-gradient(135deg, #0A1628 0%, #1A3A5C 100%)", 
          padding: "80px 5%", 
          textAlign: "center",
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
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={reveal(heroVisible)}>
              <div style={{ 
                display: "inline-flex", 
                gap: 8, 
                alignItems: "center", 
                background: "rgba(232,160,32,0.15)", 
                border: "1px solid rgba(232,160,32,0.3)", 
                borderRadius: 100, 
                padding: "6px 16px", 
                marginBottom: 24 
              }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#E8A020", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#E8A020", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  Enterprise Features
                </span>
              </div>
              <h1 style={{ 
                fontFamily: "Georgia,'Times New Roman',serif", 
                fontSize: "clamp(34px,4.5vw,64px)", 
                color: "#FFF", 
                fontWeight: 900, 
                lineHeight: 1.1, 
                marginBottom: 22 
              }}>
                Powerful <span style={{ color: "#E8A020" }}>Features</span>
              </h1>
              <p style={{ 
                fontSize: 16, 
                color: "rgba(255,255,255,0.65)", 
                lineHeight: 1.9, 
                maxWidth: 700, 
                margin: "0 auto",
                textAlign: "center"
              }}>
                Everything you need to automate and optimize your import-export operations.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section ref={featuresRef} style={{ background: "#0D1E38", padding: "90px 5%" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))", gap: 32 }}>
              {featuresList.map((feature, i) => (
                <div 
                  key={i} 
                  style={{ 
                    ...reveal(featuresVisible, i * 0.05), 
                    background: "rgba(255,255,255,0.05)", 
                    border: "1px solid rgba(255,255,255,0.1)", 
                    borderRadius: 16, 
                    padding: "32px 28px",
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = "#E8A020"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  <div style={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: 12, 
                    background: "rgba(232,160,32,0.15)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    marginBottom: 20,
                    border: "1px solid rgba(232,160,32,0.3)"
                  }}>
                    <feature.icon size={28} color="#E8A020" />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#FFF", marginBottom: 12 }}>{feature.title}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Countries Coverage */}
        <section style={{ background: "#0A1628", padding: "80px 5%" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", textAlign: "center" }}>
            <div style={{ 
              display: "inline-flex", 
              gap: 8, 
              alignItems: "center", 
              background: "rgba(232,160,32,0.1)", 
              border: "1px solid rgba(232,160,32,0.2)", 
              borderRadius: 100, 
              padding: "5px 16px", 
              marginBottom: 20 
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#E8A020", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                Global Coverage
              </span>
            </div>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,3.5vw,44px)", color: "#FFF", fontWeight: 800, marginBottom: 16 }}>
              Covering <span style={{ color: "#E8A020" }}>200+ Countries</span>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.8 }}>
              Real-time tariff data, customs regulations, and trade agreements for every major trading nation.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20 }}>
              {["🇺🇸", "🇬🇧", "🇩🇪", "🇫🇷", "🇯🇵", "🇨🇳", "🇮🇳", "🇦🇪", "🇸🇬", "🇦🇺", "🇨🇦", "🇧🇷", "🇲🇽", "🇰🇷", "🇮🇹", "🇪🇸"].map((flag, i) => (
                <span key={i} style={{ fontSize: 40, transition: "transform 0.3s", cursor: "default", display: "inline-block" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                  {flag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} style={{ position: "relative", overflow: "hidden", padding: 0 }}>
          <div style={{ 
            background: "linear-gradient(135deg,#0D2144,#152E58)", 
            height: 400, 
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
                Join 500+ enterprises using TradeLint for AI-powered import-export intelligence.
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
      <Footer />
    </>
  );
}

export default Features;