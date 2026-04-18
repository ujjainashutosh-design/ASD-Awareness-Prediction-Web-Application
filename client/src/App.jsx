import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import { Login, Signup } from './pages/Auth';
import Quiz from './pages/Quiz';
import ResultsPage from './pages/ResultsPage';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import NotFound from './pages/NotFound';

/* ─── Scroll to top on route change ──────────────────────── */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

/* ── Page transition wrapper ─────────────────────────────── */
function PageWrapper({ children }) {
  const { pathname } = useLocation();
  return (
    <div key={pathname} style={{ animation: 'pageIn 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
      {children}
      <style>{`@keyframes pageIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

/* ─── Protected route ─────────────────────────────────────── */
function ProtectedRoute({ children }) {
  const { isAuth, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, animation: 'pulse-glow 2s ease-in-out infinite' }}>🧠</div>
      <div className="loading-dots">
        <span /><span /><span />
      </div>
      <style>{`
        @keyframes pulse-glow {
          0%,100%{box-shadow:0 0 20px rgba(124,58,237,0.3);}
          50%{box-shadow:0 0 50px rgba(124,58,237,0.7);}
        }
        @keyframes bounceDot {
          0%,80%,100%{transform:scale(0);opacity:0.3;}
          40%{transform:scale(1);opacity:1;}
        }
        .loading-dots{display:inline-flex;gap:5px;align-items:center;}
        .loading-dots span{width:7px;height:7px;background:#A78BFA;border-radius:50%;animation:bounceDot 1.2s ease-in-out infinite;}
        .loading-dots span:nth-child(2){animation-delay:0.2s;}
        .loading-dots span:nth-child(3){animation-delay:0.4s;}
      `}</style>
    </div>
  );
  return isAuth ? children : <Navigate to="/login" replace />;
}

/* ─── App ─────────────────────────────────────────────────── */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/quiz" element={
            <ProtectedRoute>
              <PageWrapper><Quiz /></PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/results/:id" element={
            <ProtectedRoute>
              <PageWrapper><ResultsPage /></PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <PageWrapper><Dashboard /></PageWrapper>
            </ProtectedRoute>
          } />
          {/* 404 */}
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
