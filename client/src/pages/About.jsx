import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Section({ children, alt }) {
  return (
    <section style={{ padding: '88px 0', background: alt ? 'var(--dark-alt)' : 'var(--dark)', position: 'relative' }}>
      {children}
    </section>
  );
}

const MYTHS = [
  { myth: 'Autism is caused by vaccines', fact: 'Extensive independent research across millions of children shows no link between vaccines and autism.' },
  { myth: 'All autistic people look or act the same', fact: 'ASD is a spectrum — presentation varies enormously. It\'s invisible in many people.' },
  { myth: 'Autism is a disease that needs to be cured', fact: 'Many autistic people view autism as a natural variation of human neurology, not a disease.' },
  { myth: 'Autistic people lack empathy', fact: 'Many autistic people feel deep empathy — they may simply process and express it differently.' },
];

const SIGNS = [
  { icon: '💬', text: 'Difficulty with social communication and interaction' },
  { icon: '🔄', text: 'Restricted or repetitive behaviors and interests' },
  { icon: '👂', text: 'Sensory sensitivities — over or under responsive' },
  { icon: '📋', text: 'Strong preference for routines and structure' },
  { icon: '🔍', text: 'Intense focus on specific topics or hobbies' },
  { icon: '🤔', text: 'Challenges with reading social cues and body language' },
];

export default function About() {
  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 200 }} className="spectrum-bar" />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{ paddingTop: 140, paddingBottom: 96, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.22) 0%, transparent 60%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
          <div style={{ width: 64, height: 64, margin: '0 auto 28px', borderRadius: 18, background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(124,58,237,0.4)', fontSize: 28 }}>
            🧠
          </div>
          <h1 className="fade-in-1" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(36px, 7vw, 68px)', letterSpacing: '-0.03em', color: '#F1F0FF', marginBottom: 22, lineHeight: 1.1 }}>
            About Autism{' '}<br /><span style={{ background: 'linear-gradient(135deg, #A78BFA, #7C3AED, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Spectrum Disorder</span>
          </h1>
          <p className="fade-in-2" style={{ fontSize: 17, color: 'rgba(241,240,255,0.5)', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
            Autism Spectrum Disorder is a complex neurodevelopmental condition. Understanding it is the first step to awareness, acceptance, and meaningful support.
          </p>
        </div>
      </section>

      {/* ── What is ASD ──────────────────────────────────── */}
      <Section alt>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }} className="divider" />
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center' }}>
            <div>
              <div className="badge badge-purple" style={{ marginBottom: 20 }}>Definition</div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 4vw, 40px)', color: '#F1F0FF', marginBottom: 20, letterSpacing: '-0.02em' }}>
                What is Autism Spectrum Disorder?
              </h2>
              <p style={{ color: 'rgba(241,240,255,0.5)', lineHeight: 1.85, fontSize: 15, marginBottom: 16 }}>
                ASD is a lifelong neurological condition affecting how a person thinks, feels, communicates, and experiences the world. It is characterized by differences in social communication, behavior, and sensory processing.
              </p>
              <p style={{ color: 'rgba(241,240,255,0.45)', lineHeight: 1.85, fontSize: 15 }}>
                The word <em>"spectrum"</em> reflects the wide variation — from highly independent individuals to those requiring significant daily support. Traits can be subtle or pronounced, changing across different contexts and life stages.
              </p>
            </div>
            <div style={{ background: 'rgba(15,15,30,0.92)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px 24px' }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: '#F1F0FF', marginBottom: 22 }}>Common Signs of ASD</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {SIGNS.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${['#A78BFA','#67E8F9','#FCD34D','#6EE7B7','#F9A8D4','#A78BFA'][i]}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                    <p style={{ fontSize: 14, color: 'rgba(241,240,255,0.6)', lineHeight: 1.55 }}>{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Myths vs Facts ───────────────────────────────── */}
      <Section>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }} className="divider" />
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge badge-gold" style={{ marginBottom: 18 }}>Clearing Misconceptions</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 4vw, 44px)', letterSpacing: '-0.02em' }}>Myths vs. Facts</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {MYTHS.map(({ myth, fact }, i) => (
              <div key={i} style={{ background: 'rgba(15,15,30,0.92)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ padding: '18px 22px', background: 'rgba(239,68,68,0.06)', borderBottom: '1px solid rgba(239,68,68,0.12)' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F87171', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', padding: '3px 10px', borderRadius: 100, flexShrink: 0, marginTop: 1 }}>MYTH</span>
                    <p style={{ fontSize: 14, color: 'rgba(241,240,255,0.55)', fontStyle: 'italic', lineHeight: 1.6 }}>"{myth}"</p>
                  </div>
                </div>
                <div style={{ padding: '18px 22px' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#34D399', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '3px 10px', borderRadius: 100, flexShrink: 0, marginTop: 1 }}>FACT</span>
                    <p style={{ fontSize: 14, color: 'rgba(241,240,255,0.7)', lineHeight: 1.65 }}>{fact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Research ─────────────────────────────────────── */}
      <Section alt>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }} className="divider" />
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge badge-purple" style={{ marginBottom: 18 }}>Our Data</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 4vw, 44px)', letterSpacing: '-0.02em' }}>The Research Behind SpectrumSense</h2>
          </div>
          <div style={{ background: 'rgba(15,15,30,0.92)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '36px 32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center' }}>
              <div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 22, color: '#F1F0FF', marginBottom: 16 }}>UCI ASD Screening Adult Dataset</h3>
                <p style={{ color: 'rgba(241,240,255,0.5)', lineHeight: 1.8, fontSize: 14, marginBottom: 24 }}>
                  Peer-reviewed dataset of 705 adult ASD screenings, published by researchers at the University of California. Includes AQ-10 responses and demographic information validated in clinical settings.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
                  {[['705', 'Records'], ['93%', 'Accuracy'], ['21', 'Features'], ['AQ-10', 'Instrument']].map(([n, l]) => (
                    <div key={l} style={{ textAlign: 'center', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 12, padding: '14px 8px' }}>
                      <div style={{ background: 'linear-gradient(135deg, #A78BFA, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 20 }}>{n}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{l}</div>
                    </div>
                  ))}
                </div>
                <a href="https://link.springer.com/article/10.1007/s12559-020-09743-3" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#A78BFA', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.textDecoration='underline'}
                  onMouseLeave={e => e.target.style.textDecoration='none'}>
                  📄 Read the Springer Research Paper →
                </a>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>Methodology</div>
                {[
                  '10 AQ standardized questions (AQ-10 instrument)',
                  'Demographics: age, gender, ethnicity',
                  'Medical history: jaundice, family ASD history',
                  'Context: who completed the screening',
                  'Random Forest classifier — 200 decision trees',
                  'Balanced class weighting for accuracy',
                  'Rule-based fallback for robustness',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 13 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: 'rgba(241,240,255,0.5)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Resources ────────────────────────────────────── */}
      <Section>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }} className="divider" />
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 4vw, 40px)', letterSpacing: '-0.02em', marginBottom: 12 }}>Get Support & Resources</h2>
            <p style={{ color: 'rgba(241,240,255,0.35)', fontSize: 15 }}>Organizations for autistic individuals and their families</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 56 }}>
            {[
              { emoji: '🏛️', name: 'Autism Society of America', desc: 'Largest autism advocacy organization in the US', url: 'https://autismsociety.org', color: '#7C3AED' },
              { emoji: '✊', name: 'Autistic Self Advocacy Network', desc: 'Run by and for autistic people', url: 'https://autisticadvocacy.org', color: '#06B6D4' },
              { emoji: '❤️', name: 'Autism Speaks', desc: 'Research, resources and family support', url: 'https://autismspeaks.org', color: '#10B981' },
            ].map(({ emoji, name, desc, url, color }) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                style={{ background: 'rgba(15,15,30,0.92)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px 24px', textDecoration: 'none', color: 'inherit', display: 'block', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.border=`1px solid ${color}40`; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 20px 60px rgba(0,0,0,0.35), 0 0 30px ${color}15`; }}
                onMouseLeave={e => { e.currentTarget.style.border='1px solid rgba(255,255,255,0.07)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}15`, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>{emoji}</div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: '#F1F0FF', marginBottom: 8 }}>{name}</h3>
                <p style={{ fontSize: 13, color: 'rgba(241,240,255,0.4)', lineHeight: 1.6, marginBottom: 16 }}>{desc}</p>
                <span style={{ fontSize: 13, fontWeight: 600, color, display: 'flex', alignItems: 'center', gap: 6 }}>Visit website →</span>
              </a>
            ))}
          </div>

          {/* Final CTA */}
          <div style={{ textAlign: 'center', background: 'rgba(15,15,30,0.92)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 24, padding: '52px 32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(124,58,237,0.1), transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 4vw, 40px)', marginBottom: 16, letterSpacing: '-0.02em' }}>
                Ready to Take the Screening?
              </h2>
              <p style={{ color: 'rgba(241,240,255,0.4)', fontSize: 15, marginBottom: 32, maxWidth: 420, margin: '0 auto 32px' }}>Free, anonymous, and research-backed. Results in under 5 minutes.</p>
              <Link to="/signup" className="btn-primary" style={{ padding: '14px 36px', fontSize: 15 }}>
                Start Free Screening
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <footer style={{ background: '#050509', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2025 SpectrumSense · For awareness & screening purposes only · Not medical advice</p>
      </footer>
    </div>
  );
}
