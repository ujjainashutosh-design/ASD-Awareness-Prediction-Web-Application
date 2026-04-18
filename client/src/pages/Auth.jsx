import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

function AuthLayout({ children, title, subtitle, accentColor = '#7C3AED' }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      {/* Orbs */}
      <div className="orb" style={{ width: 500, height: 500, top: '-10%', right: '-10%', background: `${accentColor}22`, animation: 'float 9s ease-in-out infinite' }} />
      <div className="orb" style={{ width: 300, height: 300, bottom: '-5%', left: '-5%', background: 'rgba(6,182,212,0.15)', animation: 'float 7s 2s ease-in-out infinite' }} />
      {/* Top bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 10 }} className="spectrum-bar" />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', justifyContent: 'center', marginBottom: 40 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(124,58,237,0.45)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 19, color: '#F1F0FF', letterSpacing: '-0.02em' }}>
            Spectrum<span style={{ color: '#A78BFA' }}>Sense</span>
          </span>
        </Link>

        {/* Card */}
        <div style={{ background: 'rgba(15,15,30,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '40px 36px', backdropFilter: 'blur(40px)', boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.08)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${accentColor}, #06B6D4)` }} />
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 26, color: '#F1F0FF', marginBottom: 6, letterSpacing: '-0.02em' }}>{title}</h1>
          <p style={{ color: 'rgba(241,240,255,0.4)', fontSize: 14, marginBottom: 32 }}>{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

function InputRow({ icon, label, type, value, onChange, placeholder, extra }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(241,240,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }}>{icon}</div>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          className="input-field" required style={{ paddingLeft: 44 }} />
        {extra}
      </div>
    </div>
  );
}

function ErrorBox({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, color: '#F87171', fontSize: 13 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      {msg}
    </div>
  );
}

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { const { token, user } = await api.login(form); login(token, user); navigate('/dashboard'); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const EyeIcon = () => (
    <button type="button" onClick={() => setShowPw(s => !s)}
      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 4, transition: 'color 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.7)'}
      onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.3)'}>
      {showPw
        ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
    </button>
  );

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to view your screening history">
      <ErrorBox msg={error} />
      <form onSubmit={submit}>
        <InputRow label="Email" type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="you@example.com"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} />
        <InputRow label="Password" type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} placeholder="Your password"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
          extra={<EyeIcon />} />

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15, marginTop: 8, justifyContent: 'center' }}>
          {loading ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />Signing in...</span>
            : 'Sign In'}
        </button>
      </form>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 24 }}>
        No account?{' '}
        <Link to="/signup" style={{ color: '#A78BFA', textDecoration: 'none', fontWeight: 600 }}
          onMouseEnter={e => e.target.style.textDecoration='underline'}
          onMouseLeave={e => e.target.style.textDecoration='none'}>Create one free →</Link>
      </p>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: 12, marginTop: 16 }}>Screening results are stored locally and never shared.</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AuthLayout>
  );
}

export function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const pwLen = form.password.length;
  const strength = pwLen === 0 ? 0 : pwLen < 6 ? 1 : pwLen < 10 ? 2 : 3;
  const strengthColor = ['', '#EF4444', '#F59E0B', '#10B981'][strength];
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'][strength];

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError(''); setLoading(true);
    try { const { token, user } = await api.register(form); login(token, user); navigate('/quiz'); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const EyeIcon = () => (
    <button type="button" onClick={() => setShowPw(s => !s)}
      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 4, transition: 'color 0.2s' }}>
      {showPw
        ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
    </button>
  );

  return (
    <AuthLayout title="Create your account" subtitle="Free access to AI-powered ASD screening" accentColor="#10B981">
      <ErrorBox msg={error} />
      <form onSubmit={submit}>
        <InputRow label="Full Name" type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Your name"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
        <InputRow label="Email" type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="you@example.com"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} />

        {/* Password with strength */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(241,240,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} placeholder="Min. 6 characters" className="input-field" required style={{ paddingLeft: 44 }} />
            <EyeIcon />
          </div>
          {form.password && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
              <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, transition: 'background 0.3s', background: i <= strength ? strengthColor : 'rgba(255,255,255,0.1)' }} />
                ))}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: strengthColor, letterSpacing: '0.05em' }}>{strengthLabel}</span>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15, marginTop: 4, justifyContent: 'center', background: loading ? undefined : 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}>
          {loading
            ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />Creating account...</span>
            : 'Create Account & Start Screening →'}
        </button>
      </form>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20, flexWrap: 'wrap' }}>
        {['Free Forever', 'No Credit Card', 'Anonymous'].map(t => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            {t}
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 24 }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#A78BFA', textDecoration: 'none', fontWeight: 600 }}
          onMouseEnter={e => e.target.style.textDecoration='underline'}
          onMouseLeave={e => e.target.style.textDecoration='none'}>Sign in →</Link>
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AuthLayout>
  );
}
