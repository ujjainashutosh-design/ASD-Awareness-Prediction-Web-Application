import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About ASD' },
  ];
  const authLinks = [
    { to: '/quiz', label: '🧠 Take Quiz' },
    { to: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? '10px 0' : '18px 0',
        background: scrolled ? 'rgba(8,8,16,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Spectrum top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2 }} className="spectrum-bar" />

        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(124,58,237,0.4)',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#F1F0FF', letterSpacing: '-0.02em' }}>
              Spectrum<span style={{ color: '#A78BFA' }}>Sense</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
            {links.map(l => (
              <Link key={l.to} to={l.to} className="nav-link" style={{ color: location.pathname === l.to ? '#fff' : undefined }}>
                {l.label}
              </Link>
            ))}
            {isAuth && authLinks.map(l => (
              <Link key={l.to} to={l.to} className="nav-link" style={{ color: location.pathname === l.to ? '#fff' : undefined }}>{l.label}</Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
            {isAuth ? (
              <>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 100, padding: '6px 14px 6px 8px',
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#fff',
                  }}>{user?.name?.[0]?.toUpperCase()}</div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>{user?.name?.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} style={{
                  background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                  padding: '6px 12px', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer',
                  transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                }} onMouseEnter={e => { e.target.style.color='#fff'; e.target.style.borderColor='rgba(239,68,68,0.4)'; }}
                   onMouseLeave={e => { e.target.style.color='rgba(255,255,255,0.4)'; e.target.style.borderColor='rgba(255,255,255,0.1)'; }}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost" style={{ padding: '8px 20px', fontSize: 13 }}>Sign in</Link>
                <Link to="/signup" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            display: 'none', background: 'none', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'white',
          }} className="mobile-menu-btn" aria-label="Menu">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? <><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></>
                : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(8,8,16,0.97)', backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column', padding: '96px 32px 32px',
          gap: 4,
        }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={{
              fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
              color: 'rgba(241,240,255,0.8)', textDecoration: 'none',
              padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
              transition: 'color 0.2s',
            }} onMouseEnter={e => e.target.style.color='#A78BFA'}
               onMouseLeave={e => e.target.style.color='rgba(241,240,255,0.8)'}>
              {l.label}
            </Link>
          ))}
          {isAuth && authLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={{
              fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
              color: 'rgba(241,240,255,0.8)', textDecoration: 'none',
              padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>{l.label}</Link>
          ))}
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {isAuth ? (
              <button onClick={handleLogout} className="btn-ghost" style={{ width: '100%' }}>Sign Out</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>Sign In</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
