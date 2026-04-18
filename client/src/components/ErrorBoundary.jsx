import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        minHeight: '100vh', background: '#080810',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
          {/* Icon */}
          <div style={{ fontSize: 64, marginBottom: 24, animation: 'float 4s ease-in-out infinite' }}>⚡</div>

          {/* Heading */}
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800, fontSize: 'clamp(24px, 5vw, 36px)',
            color: '#F1F0FF', marginBottom: 12, letterSpacing: '-0.02em',
          }}>
            Something went wrong
          </h1>
          <p style={{ color: 'rgba(241,240,255,0.4)', fontSize: 15, lineHeight: 1.75, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
            An unexpected error occurred in SpectrumSense. This has been noted. Please refresh the page to continue.
          </p>

          {/* Error detail (dev mode) */}
          {import.meta.env.DEV && this.state.error && (
            <details style={{
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 12, padding: '14px 18px', marginBottom: 28, textAlign: 'left',
            }}>
              <summary style={{ color: '#F87171', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>
                Error Details (dev only)
              </summary>
              <pre style={{ color: 'rgba(248,113,113,0.7)', fontSize: 12, overflow: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 28px', borderRadius: 100,
                background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                border: 'none', color: '#fff', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                boxShadow: '0 0 30px rgba(124,58,237,0.4)',
              }}
            >
              🔄 Refresh Page
            </button>
            <a href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 100,
              background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(241,240,255,0.65)', fontSize: 14, fontWeight: 500,
              cursor: 'pointer', textDecoration: 'none', fontFamily: 'Inter, sans-serif',
            }}>
              🏠 Go Home
            </a>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%,100%{transform:translateY(0);}
            50%{transform:translateY(-14px);}
          }
        `}</style>
      </div>
    );
  }
}
