import React, { useState } from 'react';

const WHATSAPP_NUMBER = "9041914601"; 
const WHATSAPP_MESSAGE = "Hello! I'm interested in TradeLint's trade intelligence platform. Can you help me?";

function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <>
      <style>{`
        @keyframes waBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes waPulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes waFadeOut {
          0%, 70% { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }
      `}</style>

      <div style={{
        position: "fixed",
        bottom: 28,
        right: 28, // ✅ moved to right
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexDirection: "row",
      }}>
        
        {/* Tooltip bubble */}
        {showTooltip && (
          <div
            style={{
              background: "#FFF",
              color: "#1a1a1a",
              fontSize: 13,
              fontWeight: 600,
              padding: "10px 14px",
              borderRadius: 12,
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              whiteSpace: "nowrap",
              position: "relative",
              animation: "waFadeOut 4s ease forwards",
              maxWidth: 220,
              lineHeight: 1.4,
            }}
          >
            Chat with us on WhatsApp!



            {/* Close button */}
            <span
              onClick={() => setShowTooltip(false)}
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                width: 18,
                height: 18,
                background: "#aaa",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                color: "#fff",
                cursor: "pointer",
                lineHeight: 1,
                fontWeight: 900,
              }}
            >
              ✕
            </span>
          </div>
        )}

        {/* Main button */}
        <div style={{ position: "relative" }}>
          {/* Pulse ring */}
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "#25D366",
            animation: "waPulseRing 2s ease-out infinite",
            zIndex: 0,
          }} />

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label="Chat on WhatsApp"
            style={{
              position: "relative",
              zIndex: 1,
              width: 58,
              height: 58,
              borderRadius: "50%",
              background: hovered
                ? "linear-gradient(135deg, #1ebe5d, #128C7E)"
                : "linear-gradient(135deg, #25D366, #128C7E)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: hovered
                ? "0 8px 32px rgba(37,211,102,0.55)"
                : "0 4px 20px rgba(37,211,102,0.4)",
              transition: "all 0.3s ease",
              transform: hovered ? "scale(1.12)" : "scale(1)",
              animation: hovered ? "none" : "waBounce 2.5s ease-in-out infinite",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            {/* WhatsApp SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              width="32"
              height="32"
              fill="#FFF"
            >
              <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.64 4.64 1.853 6.64L2.667 29.333l6.907-1.813A13.28 13.28 0 0 0 16.004 29.333C23.36 29.333 29.333 23.36 29.333 16S23.36 2.667 16.004 2.667zm0 24.267a11.013 11.013 0 0 1-5.653-1.56l-.4-.24-4.107 1.08 1.093-4-.267-.413A11.04 11.04 0 0 1 4.96 16c0-6.08 4.96-11.04 11.04-11.04S27.04 9.92 27.04 16s-4.96 11.04-11.04 11.04l.004-.107zM22.4 18.96c-.347-.173-2.053-1.013-2.373-1.12-.32-.12-.56-.173-.8.173-.24.347-.907 1.12-1.107 1.36-.2.24-.413.267-.76.093-.347-.173-1.467-.547-2.787-1.733-1.027-.92-1.72-2.053-1.92-2.4-.2-.347-.02-.533.147-.707.16-.16.347-.413.52-.613.173-.2.227-.347.347-.587.12-.24.06-.44-.027-.613-.08-.173-.8-1.92-1.093-2.64-.293-.693-.587-.6-.8-.613h-.68c-.24 0-.627.093-.96.44-.32.347-1.24 1.213-1.24 2.947s1.267 3.413 1.44 3.653c.173.24 2.48 3.787 6.013 5.307.84.36 1.493.573 2.013.733.84.267 1.613.227 2.213.14.68-.107 2.08-.853 2.373-1.68.293-.827.293-1.533.213-1.68-.08-.173-.32-.253-.667-.44z" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}

export default WhatsAppButton;
