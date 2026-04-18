import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

/* Animated glitch text effect */
function GlitchText({ children }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 900,
        fontSize: 'clamp(80px, 20vw, 160px)',
        letterSpacing: '-0.05em',
        lineHeight: 1,
        background: 'linear-gradient(135deg, #A78BFA, #7C3AED, #22D3EE)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'block',
        animation: 'glitch-main 4s ease-in-out infinite',
      }}>
        {children}
      </span>
    </span>
  );
}

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(timer); navigate('/'); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, background: 'rgba(124,58,237,0.06)', borderRadius: '50%', filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 300, height: 300, background: 'rgba(6,182,212,0.05)', borderRadius: '50%', filter: 'blur(100px)' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', maxWidth: 560, animation: 'pageIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards' }}>

          {/* 404 Number */}
          <GlitchText>404</GlitchText>

          {/* Icon */}
          <div style={{ fontSize: 52, margin: '24px 0 20px', animation: 'float 4s ease-in-out infinite' }}>🔭</div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800, fontSize: 'clamp(22px, 4vw, 32px)',
            color: '#F1F0FF', marginBottom: 14, letterSpacing: '-0.02em',
          }}>
            Page Not Found
          </h1>

          <p style={{ color: 'rgba(241,240,255,0.42)', fontSize: 16, lineHeight: 1.75, marginBottom: 40, maxWidth: 400, margin: '0 auto 40px' }}>
            The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
          </p>

          {/* Countdown bar */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', marginBottom: 10, fontWeight: 500 }}>
              Redirecting to home in <span style={{ color: '#A78BFA', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{countdown}s</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 100, overflow: 'hidden', maxWidth: 200, margin: '0 auto' }}>
              <div style={{
                height: '100%',
                width: `${(countdown / 10) * 100}%`,
                background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
                borderRadius: 100,
                transition: 'width 1s linear',
                boxShadow: '0 0 8px rgba(124,58,237,0.6)',
              }} />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/" className="btn-primary" style={{ padding: '13px 28px' }}>
              🏠 Go Home
            </Link>
            <Link to="/quiz" className="btn-ghost" style={{ padding: '13px 28px' }}>
              🧠 Take Screening
            </Link>
            <button onClick={() => window.history.back()} className="btn-ghost" style={{ padding: '13px 28px' }}>
              ← Go Back
            </button>
          </div>

          {/* Quick links */}
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 18, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Quick links</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About ASD' },
                { to: '/login', label: 'Sign In' },
                { to: '/signup', label: 'Get Started' },
                { to: '/dashboard', label: 'Dashboard' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} style={{
                  padding: '6px 14px', borderRadius: 100,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  fontSize: 13, color: 'rgba(241,240,255,0.5)',
                  textDecoration: 'none', transition: 'all 0.2s',
                  fontWeight: 500,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.12)'; e.currentTarget.style.color = '#A78BFA'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(241,240,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pageIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes glitch-main {
          0%, 90%, 100% { filter: none; }
          92%  { filter: drop-shadow(-3px 0 0 rgba(6,182,212,0.7)); }
          94%  { filter: drop-shadow(3px 0 0 rgba(124,58,237,0.7)); }
          96%  { filter: drop-shadow(-2px 0 0 rgba(239,68,68,0.5)); }
          98%  { filter: none; }
        }
      `}</style>
    </div>
  );
}
