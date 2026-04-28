// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   FaMailBulk, FaPhone, FaMapMarkerAlt, FaClock, FaCheckCircle, 
//   FaPaperPlane, FaLinkedin, FaTwitter, FaFacebook, FaArrowRight
// } from 'react-icons/fa';

// const useReveal = (threshold = 0.15) => {
//   const ref = React.useRef(null);
//   const [visible, setVisible] = useState(false);
//   React.useEffect(() => {
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

// const contactInfo = [
//   { icon: FaMailBulk, label: "Email Us", value: "info@shnoor.com", href: "mailto:info@shnoor.com" },
//   { icon: FaMailBulk, label: "Procurement", value: "proc@shnoor.com", href: "mailto:proc@shnoor.com" },
//   { icon: FaPhone, label: "Phone", value: "+91-9429694298", href: "tel:+919429694298" },
//   { icon: FaClock, label: "Business Hours", value: "Mon-Fri: 10 AM - 7 PM IST", href: null },
// ];

// const offices = [
//   { flag: "🇺🇸", city: "Odessa, USA", address: "10009 Mount Tabor Road, Odessa Missouri, USA", role: "Global Headquarters" },
//   { flag: "🇴🇲", city: "Muscat, Oman", address: "Sultanate of Oman", role: "Middle East Hub" },
//   { flag: "🌍", city: "East Africa", address: "Kigali, Rwanda (Coming 2026)", role: "Expanding Operations" },
// ];

// function Contact() {
//   const [heroVisible, setHeroVisible] = useState(false);
//   const [formSent, setFormSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
//   const [infoRef, infoVisible] = useReveal();
//   const [formRef, formVisible] = useReveal();
//   const [officesRef, officesVisible] = useReveal();

//   useEffect(() => { 
//     const t = setTimeout(() => setHeroVisible(true), 100); 
//     return () => clearTimeout(t); 
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       setFormSent(true);
//       setForm({ name: "", email: "", company: "", message: "" });
//       setTimeout(() => setFormSent(false), 5000);
//     }, 1000);
//   };

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
//                 Get In Touch
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
//               Let's Start a<br /><span style={{ color: "#E8A020" }}>Conversation</span>
//             </h1>
//             <p style={{ 
//               fontSize: 16, 
//               color: "rgba(255,255,255,0.65)", 
//               lineHeight: 1.9, 
//               maxWidth: 600, 
//               margin: "0 auto",
//               textAlign: "center"
//             }}>
//               Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Contact Info Cards */}
//       <section ref={infoRef} style={{ background: "#0D1E38", padding: "60px 5%" }}>
//         <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 24 }}>
//           {contactInfo.map((info, i) => (
//             <div 
//               key={i} 
//               style={{ 
//                 ...reveal(infoVisible, i * 0.1), 
//                 background: "rgba(255,255,255,0.05)", 
//                 border: "1px solid rgba(255,255,255,0.1)", 
//                 borderRadius: 16, 
//                 padding: "32px",
//                 textAlign: "center",
//                 transition: "all 0.3s"
//               }}
//               onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = "#E8A020"; }}
//               onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
//             >
//               <div style={{ 
//                 width: 56, 
//                 height: 56, 
//                 borderRadius: 12, 
//                 background: "rgba(232,160,32,0.15)", 
//                 display: "flex", 
//                 alignItems: "center", 
//                 justifyContent: "center", 
//                 margin: "0 auto 16px",
//                 border: "1px solid rgba(232,160,32,0.3)"
//               }}>
//                 <info.icon size={24} color="#E8A020" />
//               </div>
//               <div style={{ fontSize: 11, fontWeight: 700, color: "#E8A020", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
//                 {info.label}
//               </div>
//               {info.href ? (
//                 <a href={info.href} style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, textDecoration: "none", transition: "color 0.2s" }}
//                   onMouseEnter={e => e.target.style.color = "#E8A020"}
//                   onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.75)"}>
//                   {info.value}
//                 </a>
//               ) : (
//                 <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>{info.value}</div>
//               )}
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Contact Form & Map */}
//       <section ref={formRef} style={{ background: "#0A1628", padding: "80px 5%" }}>
//         <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          
//           {/* Contact Form */}
//           <div style={{ ...reveal(formVisible), background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "40px" }}>
//             <h2 style={{ fontFamily: "Georgia,serif", fontSize: 28, fontWeight: 800, color: "#FFF", marginBottom: 8 }}>Send us a <span style={{ color: "#E8A020" }}>Message</span></h2>
//             <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 28 }}>Our team responds to all enquiries within 24 business hours.</p>
            
//             <form onSubmit={handleSubmit}>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
//                 <input 
//                   type="text" 
//                   placeholder="Your Name *" 
//                   value={form.name}
//                   onChange={(e) => setForm({...form, name: e.target.value})}
//                   required
//                   style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#FFF", fontSize: 14 }}
//                 />
//                 <input 
//                   type="email" 
//                   placeholder="Email Address *" 
//                   value={form.email}
//                   onChange={(e) => setForm({...form, email: e.target.value})}
//                   required
//                   style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#FFF", fontSize: 14 }}
//                 />
//               </div>
//               <input 
//                 type="text" 
//                 placeholder="Company Name" 
//                 value={form.company}
//                 onChange={(e) => setForm({...form, company: e.target.value})}
//                 style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, marginBottom: 16, color: "#FFF", fontSize: 14 }}
//               />
//               <textarea 
//                 rows={5} 
//                 placeholder="How can we help you? *"
//                 value={form.message}
//                 onChange={(e) => setForm({...form, message: e.target.value})}
//                 required
//                 style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, marginBottom: 20, color: "#FFF", fontSize: 14, resize: "vertical" }}
//               ></textarea>
//               <button type="submit" disabled={loading} style={{
//                 width: "100%",
//                 background: loading ? "rgba(232,160,32,0.5)" : "linear-gradient(135deg, #E8A020, #C8820A)",
//                 color: "#0D1E38",
//                 border: "none",
//                 borderRadius: 10,
//                 padding: "14px",
//                 fontSize: 15,
//                 fontWeight: 700,
//                 cursor: loading ? "not-allowed" : "pointer",
//                 transition: "all 0.3s",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: 8,
//               }}>
//                 {loading ? "Sending..." : "Send Message"} <FaPaperPlane size={14} />
//               </button>
//               {formSent && (
//                 <div style={{ marginTop: 16, padding: "12px", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, color: "#10B981" }}>
//                   <FaCheckCircle /> Thank you! We'll get back to you soon.
//                 </div>
//               )}
//             </form>
//           </div>

//           {/* Map */}
//           <div style={{ ...reveal(formVisible, 0.15), position: "relative", borderRadius: 20, overflow: "hidden", height: 500 }}>
//             <iframe
//               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24841.675949393743!2d-93.98364854620831!3d38.99004492145609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0bfc8c9b6a2a1%3A0x7c5b5a8e6b2e5c4d!2sOdessa%2C%20MO%2064076%2C%20USA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
//               width="100%"
//               height="100%"
//               style={{ border: 0 }}
//               allowFullScreen=""
//               loading="lazy"
//               title="SHNOOR Location"
//             ></iframe>
//             <div style={{ position: "absolute", bottom: 20, left: 20, background: "#0D1E38", padding: "12px 20px", borderRadius: 12, border: "1px solid rgba(232,160,32,0.3)" }}>
//               <p style={{ color: "#FFF", fontSize: 14, margin: 0 }}>📍 10009 Mount Tabor Road, Odessa, Missouri, USA</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Offices Section */}
//       <section ref={officesRef} style={{ background: "#0D1E38", padding: "80px 5%" }}>
//         <div style={{ maxWidth: 1240, margin: "0 auto" }}>
//           <div style={{ textAlign: "center", marginBottom: 48, ...reveal(officesVisible) }}>
//             <div style={{ 
//               display: "inline-flex", 
//               gap: 8, 
//               alignItems: "center", 
//               background: "rgba(232,160,32,0.1)", 
//               border: "1px solid rgba(232,160,32,0.2)", 
//               borderRadius: 100, 
//               padding: "5px 16px", 
//               marginBottom: 16 
//             }}>
//               <span style={{ fontSize: 10, fontWeight: 700, color: "#E8A020", letterSpacing: "0.18em", textTransform: "uppercase" }}>
//                 Our Presence
//               </span>
//             </div>
//             <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,3.5vw,44px)", color: "#FFF", fontWeight: 800, marginBottom: 14 }}>
//               Global <span style={{ color: "#E8A020" }}>Offices</span>
//             </h2>
//             <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
//               Operating across North America, the Middle East, and East Africa.
//             </p>
//           </div>

//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
//             {offices.map((office, i) => (
//               <div 
//                 key={i} 
//                 style={{ 
//                   ...reveal(officesVisible, i * 0.1), 
//                   background: "rgba(255,255,255,0.05)", 
//                   border: "1px solid rgba(255,255,255,0.1)", 
//                   borderRadius: 16, 
//                   padding: "32px",
//                   textAlign: "center",
//                   transition: "all 0.3s"
//                 }}
//                 onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = "#E8A020"; }}
//                 onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
//               >
//                 <div style={{ fontSize: 48, marginBottom: 16 }}>{office.flag}</div>
//                 <h3 style={{ fontSize: 20, fontWeight: 700, color: "#FFF", marginBottom: 8 }}>{office.city}</h3>
//                 <p style={{ fontSize: 12, color: "#E8A020", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{office.role}</p>
//                 <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{office.address}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section style={{ position: "relative", overflow: "hidden", padding: 0 }}>
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
//             textAlign: "center"
//           }}>
//             <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,52px)", color: "#FFF", fontWeight: 800, marginBottom: 18 }}>
//               Ready to Transform Your <span style={{ color: "#E8A020" }}>Business</span>?
//             </h2>
//             <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.85 }}>
//               Get in touch with our team to discuss how SHNOOR can help your business grow.
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
//                 Get Started
//               </Link>
//               <Link to="/services" style={{ 
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
//                 Explore Services
//               </Link>
//             </div>
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

// export default Contact;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMailBulk, FaPhone, FaMapMarkerAlt, FaClock, FaCheckCircle, 
  FaPaperPlane, FaLinkedin, FaTwitter, FaFacebook, FaArrowRight
} from 'react-icons/fa';
import Navbar from './Navbar';
import Footer from './Footer';

const useReveal = (threshold = 0.15) => {
  const ref = React.useRef(null);
  const [visible, setVisible] = useState(false);
  React.useEffect(() => {
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

const contactInfo = [
  { icon: FaMailBulk, label: "Email Us", value: "info@tradelint.com", href: "mailto:info@tradelint.com" },
  { icon: FaMailBulk, label: "Procurement", value: "proc@tradelint.com", href: "mailto:proc@tradelint.com" },
  { icon: FaPhone, label: "Phone", value: "+91-9876543210", href: "tel:+919876543210" },
  { icon: FaClock, label: "Business Hours", value: "Mon-Fri: 9 AM - 6 PM IST", href: null },
];

const offices = [
  { flag: "🇮🇳", city: "Mumbai, India", address: "TradeLint Tower, Andheri East, Mumbai - 400093", role: "Global Headquarters" },
  { flag: "🇦🇪", city: "Dubai, UAE", address: "Dubai Silicon Oasis, Dubai - UAE", role: "Middle East Hub" },
  { flag: "🇸🇬", city: "Singapore", address: "Marina Bay Financial Centre, Singapore", role: "Asia Pacific Hub" },
  { flag: "🇬🇧", city: "London, UK", address: "Canary Wharf, London - E14 5AB", role: "European Office" },
];

function Contact() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [infoRef, infoVisible] = useReveal();
  const [formRef, formVisible] = useReveal();
  const [officesRef, officesVisible] = useReveal();

  useEffect(() => { 
    const t = setTimeout(() => setHeroVisible(true), 100); 
    return () => clearTimeout(t); 
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFormSent(true);
      setForm({ name: "", email: "", company: "", message: "" });
      setTimeout(() => setFormSent(false), 5000);
    }, 1000);
  };

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
                  Get In Touch
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
                Let's Start a<br /><span style={{ color: "#E8A020" }}>Conversation</span>
              </h1>
              <p style={{ 
                fontSize: 16, 
                color: "rgba(255,255,255,0.65)", 
                lineHeight: 1.9, 
                maxWidth: 600, 
                margin: "0 auto",
                textAlign: "center"
              }}>
                Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section ref={infoRef} style={{ background: "#0D1E38", padding: "60px 5%" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 24 }}>
            {contactInfo.map((info, i) => (
              <div 
                key={i} 
                style={{ 
                  ...reveal(infoVisible, i * 0.1), 
                  background: "rgba(255,255,255,0.05)", 
                  border: "1px solid rgba(255,255,255,0.1)", 
                  borderRadius: 16, 
                  padding: "32px",
                  textAlign: "center",
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
                  margin: "0 auto 16px",
                  border: "1px solid rgba(232,160,32,0.3)"
                }}>
                  <info.icon size={24} color="#E8A020" />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#E8A020", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                  {info.label}
                </div>
                {info.href ? (
                  <a href={info.href} style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "#E8A020"}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.75)"}>
                    {info.value}
                  </a>
                ) : (
                  <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>{info.value}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form & Map */}
        <section ref={formRef} style={{ background: "#0A1628", padding: "80px 5%" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            
            {/* Contact Form */}
            <div style={{ ...reveal(formVisible), background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "40px" }}>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: 28, fontWeight: 800, color: "#FFF", marginBottom: 8 }}>Send us a <span style={{ color: "#E8A020" }}>Message</span></h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 28 }}>Our team responds to all enquiries within 24 business hours.</p>
              
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <input 
                    type="text" 
                    placeholder="Your Name *" 
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    required
                    style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#FFF", fontSize: 14, outline: "none", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = "#E8A020"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address *" 
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    required
                    style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#FFF", fontSize: 14, outline: "none", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = "#E8A020"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Company Name" 
                  value={form.company}
                  onChange={(e) => setForm({...form, company: e.target.value})}
                  style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, marginBottom: 16, color: "#FFF", fontSize: 14, outline: "none", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "#E8A020"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
                />
                <textarea 
                  rows={5} 
                  placeholder="How can we help you? *"
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  required
                  style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, marginBottom: 20, color: "#FFF", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "inherit", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "#E8A020"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
                ></textarea>
                <button type="submit" disabled={loading} style={{
                  width: "100%",
                  background: loading ? "rgba(232,160,32,0.5)" : "linear-gradient(135deg, #E8A020, #C8820A)",
                  color: "#0D1E38",
                  border: "none",
                  borderRadius: 10,
                  padding: "14px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}>
                  {loading ? "Sending..." : "Send Message"} <FaPaperPlane size={14} />
                </button>
                {formSent && (
                  <div style={{ marginTop: 16, padding: "12px", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, color: "#10B981" }}>
                    <FaCheckCircle /> Thank you! We'll get back to you soon.
                  </div>
                )}
              </form>
            </div>

            {/* Map */}
            <div style={{ ...reveal(formVisible, 0.15), position: "relative", borderRadius: 20, overflow: "hidden", height: "100%", minHeight: 500 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241316.6432981437!2d72.741099!3d19.082197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="TradeLint Location"
              ></iframe>
              <div style={{ position: "absolute", bottom: 20, left: 20, background: "#0D1E38", padding: "12px 20px", borderRadius: 12, border: "1px solid rgba(232,160,32,0.3)" }}>
                <p style={{ color: "#FFF", fontSize: 14, margin: 0 }}>📍 TradeLint Tower, Andheri East, Mumbai - 400093</p>
              </div>
            </div>
          </div>
        </section>

        {/* Offices Section */}
        <section ref={officesRef} style={{ background: "#0D1E38", padding: "80px 5%" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48, ...reveal(officesVisible) }}>
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
                  Our Presence
                </span>
              </div>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,3.5vw,44px)", color: "#FFF", fontWeight: 800, marginBottom: 14 }}>
                Global <span style={{ color: "#E8A020" }}>Offices</span>
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
                Operating across India, Middle East, Asia Pacific, and Europe.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
              {offices.map((office, i) => (
                <div 
                  key={i} 
                  style={{ 
                    ...reveal(officesVisible, i * 0.1), 
                    background: "rgba(255,255,255,0.05)", 
                    border: "1px solid rgba(255,255,255,0.1)", 
                    borderRadius: 16, 
                    padding: "32px",
                    textAlign: "center",
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = "#E8A020"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  <div style={{ fontSize: 48, marginBottom: 16 }}>{office.flag}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#FFF", marginBottom: 8 }}>{office.city}</h3>
                  <p style={{ fontSize: 12, color: "#E8A020", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{office.role}</p>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{office.address}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ position: "relative", overflow: "hidden", padding: 0 }}>
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
              textAlign: "center"
            }}>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,52px)", color: "#FFF", fontWeight: 800, marginBottom: 18 }}>
                Ready to Transform Your <span style={{ color: "#E8A020" }}>Trade Operations</span>?
              </h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.85 }}>
                Get in touch with our team to discuss how TradeLint can help your business grow.
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
                  Get Started
                </Link>
                <Link to="/features" style={{ 
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
                  Explore Features
                </Link>
              </div>
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

export default Contact;