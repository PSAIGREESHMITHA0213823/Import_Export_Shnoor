import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGlobe, FaShip, FaCalculator, FaShieldAlt, FaChartLine, 
  FaFileAlt, FaUsers, FaArrowRight, FaCheckCircle, FaStar,
  FaSearch, FaDollarSign, FaClock, FaTruck
} from 'react-icons/fa';

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
      {!loaded && <div style={{ position: "absolute", inset: 0, background: "#f0f0f0" }} />}
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
  { val: "200+", label: "Countries Served" },
  { val: "4.9★", label: "Client Rating" },
  { val: "50M+", label: "Trade Records" },
  { val: "500+", label: "Enterprise Clients" },
];

const services = [
  { 
    Icon: FaSearch, 
    title: "AI HSN Classification", 
    desc: "ML models predict HSN codes with 95%+ accuracy — reducing errors and speeding up customs clearance." 
  },
  { 
    Icon: FaCalculator, 
    title: "Smart Duty Calculator", 
    desc: "Real-time customs duty calculation across 200+ countries including anti-dumping and GST/VAT."
  },
  { 
    Icon: FaShieldAlt, 
    title: "Risk Assessment Engine", 
    desc: "AI-powered risk scoring based on payment history, supplier credibility, and shipment patterns."
  },
  { 
    Icon: FaShip, 
    title: "Shipment Tracking", 
    desc: "End-to-end real-time visibility with GPS updates, port monitoring, and ETA alerts."
  },
  { 
    Icon: FaFileAlt, 
    title: "Document Intelligence", 
    desc: "OCR-powered extraction with fraud detection and compliance verification for all trade documents."
  },
  { 
    Icon: FaChartLine, 
    title: "Analytics Dashboard", 
    desc: "Comprehensive trade analytics with shipment trends, duty expenses, and risk heatmaps."
  },
];

const testimonials = [
  { 
    name: "Rajesh Kumar", 
    role: "Import Manager, Mumbai", 
    text: "TradeLint transformed our import operations. The AI HSN classification reduced our clearance time by 60%.",
    rating: 5 
  },
  { 
    name: "Sarah Chen", 
    role: "Logistics Director, Singapore", 
    text: "The duty calculator is incredibly accurate. We've saved over $500,000 in customs duties.",
    rating: 5 
  },
  { 
    name: "Ahmed Al-Rashid", 
    role: "Customs Broker, Dubai", 
    text: "Best trade intelligence platform. Document processing is seamless and risk assessment is top-notch.",
    rating: 5 
  },
];

function Home() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [servicesRef, servicesVisible] = useReveal();
  const [aboutRef, aboutVisible] = useReveal();
  const [testimonialsRef, testimonialsVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();

  useEffect(() => { 
    const t = setTimeout(() => setHeroVisible(true), 100); 
    return () => clearTimeout(t); 
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content" style={reveal(heroVisible, 0)}>
            <div className="hero-badge">
              <span>✨ AI-Powered Trade Intelligence</span>
            </div>
            <h1 className="hero-title">
              Smart Import Export<br />
              <span className="highlight">Intelligence Platform</span>
            </h1>
            <p className="hero-description">
              Automate HSN classification, calculate duties instantly, assess risks, and track shipments globally — 
              all powered by advanced AI and real-time trade data covering 200+ countries.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn-primary btn-large">
                Get Started <FaArrowRight />
              </Link>
              <a href="#features" className="btn-outline btn-large">Watch Demo</a>
            </div>
            <div className="hero-stats">
              {stats.map((stat, i) => (
                <div key={i} className="stat-item" style={reveal(heroVisible, 0.2 + i * 0.1)}>
                  <div className="stat-value">{stat.val}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-image" style={reveal(heroVisible, 0.15)}>
            <div className="image-grid">
              <Img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80" alt="Global trade" className="img-1" />
              <Img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80" alt="Shipping" className="img-2" />
              <Img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80" alt="Analytics" className="img-3" />
              <Img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80" alt="Risk" className="img-4" />
            </div>
            <div className="floating-badge">
              <div className="badge-value">95%</div>
              <div className="badge-label">HSN ACCURACY</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} id="features" className="services-section">
        <div className="container">
          <div className="section-header" style={reveal(servicesVisible)}>
            <div className="section-badge">What We Offer</div>
            <h2 className="section-title">Comprehensive <span className="highlight">Trade Solutions</span></h2>
            <p className="section-subtitle">
              From AI classification to real-time tracking — everything you need to manage global trade operations.
            </p>
          </div>
          <div className="services-grid">
            {services.map((service, i) => (
              <div key={i} className="service-card" style={reveal(servicesVisible, i * 0.08)}>
                <div className="service-icon">
                  <service.Icon />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image" style={reveal(aboutVisible)}>
              <Img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80" alt="About TradeLint" />
              <div className="about-stats-card">
                <div className="stat-number">50M+</div>
                <div className="stat-desc">Trade Records Processed</div>
              </div>
            </div>
            <div className="about-content" style={reveal(aboutVisible, 0.15)}>
              <div className="section-badge">Why TradeLint</div>
              <h2 className="section-title">AI-Powered<br /><span className="highlight">Trade Automation</span></h2>
              <p className="about-text">
                TradeLint was built to solve the biggest challenges in global trade: complex HSN classification, 
                ever-changing duty structures, document fragmentation, and manual risk assessment.
              </p>
              <p className="about-text">
                Our platform serves importers, exporters, customs brokers, and trade enterprises across 200+ countries. 
                From OCR document extraction to predictive shipment tracking — we deliver enterprise-grade intelligence.
              </p>
              <Link to="/about" className="btn-primary">Learn More <FaArrowRight /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="testimonials-section">
        <div className="container">
          <div className="section-header" style={reveal(testimonialsVisible)}>
            <div className="section-badge">Client Voices</div>
            <h2 className="section-title">Trusted by <span className="highlight">500+ Enterprises</span></h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="testimonial-card" style={reveal(testimonialsVisible, i * 0.1)}>
                <div className="quote-icon">"</div>
                <div className="testimonial-stars">
                  {[...Array(testimonial.rating)].map((_, j) => <FaStar key={j} />)}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.name[0]}</div>
                  <div>
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="cta-section">
        <div className="container">
          <div className="cta-content" style={reveal(ctaVisible)}>
            <h2 className="cta-title">Ready to Transform Your <span className="highlight">Trade Operations</span>?</h2>
            <p className="cta-text">
              Join thousands of businesses using TradeLint for AI-powered import-export intelligence.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn-primary btn-large">Start Free Trial</Link>
              <Link to="/contact" className="btn-outline btn-large">Contact Sales</Link>
            </div>
            <p className="cta-note">No credit card required • Free 14-day trial</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;