import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import ShnoorLogo from './ShnoorLogo';
import { themes } from './theme';

const ThemeDot = ({ themeKey, current, onChange }) => {
  const th = themes[themeKey];
  return (
    <button onClick={() => onChange(themeKey)} title={th.label} style={{
      width: 20, height: 20, borderRadius: "50%", cursor: "pointer",
      background: `linear-gradient(135deg, ${th.swatch[0]}, ${th.swatch[1]})`,
      border: current === themeKey ? "2px solid #E8A020" : "2px solid rgba(128,128,128,0.3)",
      outline: current === themeKey ? "2px solid rgba(232,160,32,0.3)" : "none",
      outlineOffset: 2,
      transform: current === themeKey ? "scale(1.25)" : "scale(1)",
      transition: "all 0.2s", flexShrink: 0,
      padding: 0,
    }} />
  );
};

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const location = useLocation();
  const t = themes[currentTheme];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: scrolled ? t.navBg : 'transparent',
      backdropFilter: scrolled ? 'none' : 'blur(10px)',
      borderBottom: scrolled ? `1px solid ${t.border}` : '1px solid transparent',
      zIndex: 1000,
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <ShnoorLogo size={48} />
          <div>
            <div style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: '20px',
              fontWeight: 800,
              color: '#FFF',
              letterSpacing: '0.12em',
              lineHeight: 1.2,
            }}>SHNOOR™</div>
            <div style={{
              fontSize: '8px',
              color: '#E8A020',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginTop: '2px',
            }}>INTERNATIONAL LLC</div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '28px',
        }} className="desktop-menu">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                textDecoration: 'none',
                color: isActive(link.path) ? '#E8A020' : 'rgba(255,255,255,0.75)',
                fontWeight: isActive(link.path) ? 700 : 500,
                fontSize: '14px',
                transition: 'color 0.3s',
                position: 'relative',
                paddingBottom: '4px',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#E8A020'}
              onMouseLeave={e => e.currentTarget.style.color = isActive(link.path) ? '#E8A020' : 'rgba(255,255,255,0.75)'}
            >
              {link.name}
              {isActive(link.path) && (
                <div style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: '0',
                  right: '0',
                  height: '2px',
                  background: '#E8A020',
                  borderRadius: '2px',
                }} />
              )}
            </Link>
          ))}
          
          {/* THEME SWITCHER - HERE */}
          <div style={{ display: 'flex', gap: 8, marginLeft: '8px' }}>
            {Object.keys(themes).map(k => (
              <ThemeDot key={k} themeKey={k} current={currentTheme} onChange={setCurrentTheme} />
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginLeft: '8px' }}>
            <Link to="/login" style={{
              background: 'transparent',
              border: '2px solid #E8A020',
              color: '#E8A020',
              padding: '8px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E8A020'; e.currentTarget.style.color = '#0D1E38'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#E8A020'; }}>
              Sign In
            </Link>
            <Link to="/register" style={{
              background: 'linear-gradient(135deg, #E8A020, #C8820A)',
              color: '#0D1E38',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(232,160,32,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#FFF',
          }}
          className="mobile-menu-btn"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          background: '#060E1C',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }} className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                padding: '12px 0',
                textDecoration: 'none',
                color: isActive(link.path) ? '#E8A020' : 'rgba(255,255,255,0.75)',
                fontWeight: isActive(link.path) ? 700 : 500,
                fontSize: '15px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Theme Switcher in Mobile Menu */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {Object.keys(themes).map(k => (
              <ThemeDot key={k} themeKey={k} current={currentTheme} onChange={setCurrentTheme} />
            ))}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <Link to="/login" style={{
              background: 'transparent',
              border: '2px solid #E8A020',
              color: '#E8A020',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: 600,
              textAlign: 'center',
              textDecoration: 'none',
            }} onClick={() => setIsOpen(false)}>
              Sign In
            </Link>
            <Link to="/register" style={{
              background: 'linear-gradient(135deg, #E8A020, #C8820A)',
              color: '#0D1E38',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: 600,
              textAlign: 'center',
              textDecoration: 'none',
            }} onClick={() => setIsOpen(false)}>
              Get Started
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;