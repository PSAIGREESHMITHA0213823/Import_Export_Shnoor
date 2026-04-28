
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUsers, FaGlobe, FaChartLine, FaRocket, FaTrophy, FaHandshake,
  FaArrowRight, FaCheckCircle, FaStar, FaAward, FaLightbulb, FaBullseye
} from 'react-icons/fa';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

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

const stats = [
  { val: "500+", label: "Enterprise Clients", suffix: "" },
  { val: "50M+", label: "Trade Records", suffix: "" },
  { val: "200+", label: "Countries", suffix: "" },
  { val: "99.9%", label: "Accuracy", suffix: "%" },
];

const values = [
  { icon: FaHandshake, title: "Integrity", desc: "We operate with transparency and honesty in every transaction, building trust that lasts generations." },
  { icon: FaRocket, title: "Innovation", desc: "Constantly evolving our AI models to deliver cutting-edge solutions that redefine global trade." },
  { icon: FaUsers, title: "Client First", desc: "Your success is our success. We're committed to your growth and long-term partnership." },
  { icon: FaTrophy, title: "Excellence", desc: "Striving for perfection in every solution we deliver, from document processing to customs compliance." },
  { icon: FaLightbulb, title: "Agility", desc: "Adapting quickly to changing trade regulations and market conditions to keep you ahead." },
  { icon: FaBullseye, title: "Impact", desc: "Measurable results — saving millions in duties and countless hours in manual processing." },
];

function About() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [storyRef, storyVisible] = useReveal();
  const [statsRef, statsVisible] = useReveal();
  const [valuesRef, valuesVisible] = useReveal();
  const [leadershipRef, leadershipVisible] = useReveal();
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
                  Our Story
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
                Revolutionizing <span style={{ color: "#E8A020" }}>Global Trade</span>
              </h1>
              <p style={{ 
                fontSize: 16, 
                color: "rgba(255,255,255,0.65)", 
                lineHeight: 1.9, 
                maxWidth: 700, 
                margin: "0 auto",
                textAlign: "center"
              }}>
                We're on a mission to transform global trade through AI-powered intelligence,
                making import-export operations seamless, transparent, and efficient for businesses worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section ref={storyRef} style={{ background: "#0D1E38", padding: "90px 5%" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
            <div style={{ position: "relative", height: 500, ...reveal(storyVisible) }}>
              <Img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80" 
                alt="TradeLint Team" 
                style={{ borderRadius: 16, height: "100%", border: "2px solid rgba(232,160,32,0.2)" }} 
              />
              <Img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80" 
                alt="AI Dashboard" 
                style={{ position: "absolute", bottom: 24, right: -28, width: "48%", height: 170, borderRadius: 12, border: "2px solid rgba(232,160,32,0.2)", boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }} 
              />
              <div style={{ 
                position: "absolute", 
                bottom: -16, 
                left: 20, 
                background: "#0D1E38", 
                border: "1px solid rgba(232,160,32,0.3)", 
                borderRadius: 12, 
                padding: "14px 20px", 
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)", 
                display: "flex", 
                gap: 10, 
                alignItems: "center" 
              }}>
                <div style={{ 
                  width: 36, height: 36, borderRadius: "50%", 
                  background: "linear-gradient(135deg,#E8A020,#C8820A)", 
                  display: "flex", alignItems: "center", justifyContent: "center" 
                }}>
                  <FaStar size={16} color="#0D1E38" />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "#E8A020", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Trusted By</div>
                  <div style={{ fontSize: 13, color: "#FFF", fontWeight: 600 }}>500+ Enterprises Worldwide</div>
                </div>
              </div>
            </div>

            <div style={{ ...reveal(storyVisible, 0.15) }}>
              <div style={{ 
                display: "inline-flex", 
                gap: 8, 
                alignItems: "center", 
                background: "rgba(232,160,32,0.1)", 
                border: "1px solid rgba(232,160,32,0.2)", 
                borderRadius: 100, 
                padding: "5px 16px", 
                marginBottom: 18 
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#E8A020", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  A smarter way to access Trade Intelligence
                </span>
              </div>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,3vw,42px)", color: "#FFF", fontWeight: 800, marginBottom: 18, lineHeight: 1.2 }}>
                Innovative Supply Chain <br /><span style={{ color: "#E8A020" }}>Intelligence Platform</span>
              </h2>
              <div style={{ width: 48, height: 3, background: "linear-gradient(90deg,#E8A020,transparent)", borderRadius: 2, marginBottom: 24 }} />
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, marginBottom: 16, textAlign: "justify" }}>
                Founded in 2020, TradeLint emerged from a simple observation: global trade was fragmented, 
                manual, and inefficient. Importers and exporters struggled with complex HSN codes, 
                unpredictable duties, and scattered documentation.
              </p>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, marginBottom: 16, textAlign: "justify" }}>
                We built TradeLint to solve these challenges. Our AI-powered platform automates the entire 
                import-export workflow — from document processing to duty calculation to shipment tracking.
              </p>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, marginBottom: 32, textAlign: "justify" }}>
                Today, over 500 enterprises trust TradeLint to navigate global trade with confidence, 
                saving millions in duties and countless hours in manual processing.
              </p>
              <Link to="/register" style={{ 
                background: "linear-gradient(135deg,#C8820A,#E8A020)", 
                color: "#0D1E38", 
                border: "none", 
                borderRadius: 10, 
                padding: "13px 28px", 
                fontSize: 14, 
                fontWeight: 700, 
                cursor: "pointer", 
                display: "inline-flex", 
                alignItems: "center", 
                gap: 8, 
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(232,160,32,0.3)" 
              }}>
                Start Free Trial <FaArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} style={{ background: "#0A1628", padding: "60px 5%" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 40, textAlign: "center" }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ ...reveal(statsVisible, i * 0.1) }}>
                <div style={{ fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 900, color: "#E8A020", fontFamily: "Georgia,serif", marginBottom: 8 }}>
                  {stat.val}
                </div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section ref={valuesRef} style={{ background: "#0D1E38", padding: "90px 5%" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56, ...reveal(valuesVisible) }}>
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
                  Core Values
                </span>
              </div>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,3.5vw,44px)", color: "#FFF", fontWeight: 800, marginBottom: 14 }}>
                What Drives <span style={{ color: "#E8A020" }}>Us</span>
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
                Our principles guide every decision, every product, and every client interaction.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 32 }}>
              {values.map((value, i) => (
                <div 
                  key={i} 
                  style={{ 
                    ...reveal(valuesVisible, i * 0.08), 
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
                    borderRadius: "50%", 
                    background: "rgba(232,160,32,0.15)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    marginBottom: 20,
                    border: "1px solid rgba(232,160,32,0.3)"
                  }}>
                    <value.icon size={28} color="#E8A020" />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#FFF", marginBottom: 12 }}>{value.title}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{value.desc}</p>
                </div>
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

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </>
  );
}

export default About;