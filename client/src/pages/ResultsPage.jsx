import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import Navbar from '../components/Navbar';

/* ─── Animated SVG Gauge ─────────────────────────────────── */
function Gauge({ prob, isHigh, animate }) {
  const [displayProb, setDisplayProb] = useState(0);
  const rafRef = useRef();

  useEffect(() => {
    if (!animate) return;
    let start = null;
    const duration = 1400;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayProb(ease * prob);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate, prob]);

  const R = 88, CX = 110, CY = 110;
  const startAngle = -215, sweepAngle = 250;
  const toRad = (d) => (d * Math.PI) / 180;
  const polarToXY = (angle, r) => ({
    x: CX + r * Math.cos(toRad(angle)),
    y: CY + r * Math.sin(toRad(angle)),
  });
  const describeArc = (startA, endA) => {
    const s = polarToXY(startA, R), e = polarToXY(endA, R);
    const large = endA - startA > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const fillEnd = startAngle + sweepAngle * displayProb;
  const color = isHigh ? '#EF4444' : '#10B981';
  const gradId = isHigh ? 'gauge-red' : 'gauge-green';

  return (
    <svg width="220" height="185" viewBox="0 0 220 185">
      <defs>
        <linearGradient id="gauge-red" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
        <linearGradient id="gauge-green" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      {/* Background track */}
      <path d={describeArc(startAngle, startAngle + sweepAngle)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="13" strokeLinecap="round" />
      {/* Filled arc */}
      {displayProb > 0.005 && (
        <path
          d={describeArc(startAngle, fillEnd)}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="13"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 12px ${color}90)` }}
        />
      )}
      {/* Needle dot */}
      {displayProb > 0.01 && (() => {
        const pt = polarToXY(fillEnd, R);
        return <circle cx={pt.x} cy={pt.y} r="6" fill={color} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />;
      })()}
      {/* Center text */}
      <text x={CX} y={CY - 6} textAnchor="middle" fill={color} fontSize="42" fontWeight="800" fontFamily="Space Grotesk, sans-serif" letterSpacing="-1">
        {Math.round(displayProb * 100)}
      </text>
      <text x={CX} y={CY + 14} textAnchor="middle" fill={color} fontSize="13" fontFamily="Space Grotesk, sans-serif" fontWeight="700">
        %
      </text>
      <text x={CX} y={CY + 34} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11" fontFamily="Inter, sans-serif" letterSpacing="0.05em">
        PROBABILITY
      </text>
    </svg>
  );
}

/* ─── Animated Bar ───────────────────────────────────────── */
function AnimBar({ value, color, label, animate, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setWidth(value * 100), delay);
    return () => clearTimeout(t);
  }, [animate, value, delay]);
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: 'rgba(241,240,255,0.55)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 16, color }}>{Math.round(value * 100)}%</span>
      </div>
      <div style={{ height: 9, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${width}%`, background: color, borderRadius: 100, transition: `width 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`, boxShadow: `0 0 12px ${color}70` }} />
      </div>
    </div>
  );
}

/* ─── AQ Breakdown Bar ───────────────────────────────────── */
const AQ_LABELS = [
  'Social Preference', 'Routine', 'Imagination', 'Attention Focus',
  'Sensory Processing', 'Detail Focus', 'Social Communication',
  'Vivid Imagery', 'Pattern Thinking', 'Multi-tasking',
];
const TRAIT_COLORS = {
  'Social Preference': '#A78BFA', 'Routine': '#67E8F9', 'Imagination': '#FCD34D',
  'Attention Focus': '#6EE7B7', 'Sensory Processing': '#F9A8D4', 'Detail Focus': '#A78BFA',
  'Social Communication': '#67E8F9', 'Vivid Imagery': '#FCD34D', 'Pattern Thinking': '#6EE7B7',
  'Multi-tasking': '#F9A8D4',
};

/* ─── Main Results Page ──────────────────────────────────── */
export default function ResultsPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    api.getResult(id, token)
      .then(r => { setResult(r); setTimeout(() => setAnimate(true), 300); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  /* ── Loading ── */
  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
      <div style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, animation: 'pulse-glow 1.5s ease-in-out infinite' }}>🧠</div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#A78BFA', fontSize: 16, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 6 }}>Analyzing your responses...</p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Our AI model is processing your data</p>
      </div>
      <div style={{ width: 48, height: 48, border: '3px solid rgba(124,58,237,0.15)', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'rspin 0.85s linear infinite' }} />
      <style>{`@keyframes rspin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  /* ── Error ── */
  if (error || !result) return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 20, textAlign: 'center' }}>
      <div style={{ fontSize: 52 }}>⚠️</div>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#F1F0FF' }}>Result Not Found</h2>
      <p style={{ color: '#F87171', fontSize: 14 }}>{error || 'This result may have been deleted or does not belong to your account.'}</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
        <Link to="/dashboard" className="btn-primary" style={{ padding: '12px 28px' }}>📊 Dashboard</Link>
        <Link to="/quiz" className="btn-ghost" style={{ padding: '12px 28px' }}>🔄 Retake</Link>
      </div>
    </div>
  );

  const isHigh = result.prediction === 'YES';
  const probHigh = result.probability ?? 0;
  const probLow = result.probability_no ?? (1 - probHigh);
  const aqAnswers = Array.from({ length: 10 }, (_, i) => ({
    label: AQ_LABELS[i] || `Q${i+1}`,
    score: result.answers?.[`A${i + 1}_Score`] ?? 0,
    color: TRAIT_COLORS[AQ_LABELS[i]] || '#A78BFA',
  }));
  const score = result.score ?? aqAnswers.reduce((s, a) => s + a.score, 0);

  const nextSteps = isHigh ? [
    { color: '#7C3AED', emoji: '🧠', title: 'Seek Professional Assessment', desc: 'Consult a licensed neuropsychologist or psychiatrist for a formal ASD evaluation.' },
    { color: '#06B6D4', emoji: '📚', title: 'Learn About ASD', desc: 'Understanding autism traits helps you navigate available support and resources.' },
    { color: '#10B981', emoji: '🤝', title: 'Connect with Community', desc: 'Autism Society of America and local support groups offer invaluable peer support.' },
  ] : [
    { color: '#10B981', emoji: '✅', title: 'Low Likelihood — Stay Curious', desc: "Low scores don't rule out other neurodivergent conditions like ADHD or dyslexia." },
    { color: '#7C3AED', emoji: '🔍', title: 'Explore Neurodiversity', desc: 'ADHD, dyslexia, and similar traits may share characteristics with ASD.' },
    { color: '#06B6D4', emoji: '💬', title: 'Professional Consultation', desc: 'If concerns persist, a professional evaluation provides full clarity.' },
  ];

  const dateStr = result.createdAt ? new Date(result.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Today';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)' }}>
      <Navbar />

      {/* ── Color bar top ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: isHigh ? 'linear-gradient(90deg, #F59E0B, #EF4444)' : 'linear-gradient(90deg, #10B981, #06B6D4)', zIndex: 200 }} />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '104px 20px 72px' }}>

        {/* ══════════════════════════════════════════
            HERO RESULT CARD
        ══════════════════════════════════════════ */}
        <div style={{
          background: 'rgba(10,10,24,0.97)',
          border: `1px solid ${isHigh ? 'rgba(239,68,68,0.22)' : 'rgba(16,185,129,0.22)'}`,
          borderRadius: 26, padding: '44px 36px', marginBottom: 18, textAlign: 'center',
          position: 'relative', overflow: 'hidden',
          boxShadow: `0 36px 90px rgba(0,0,0,0.5), 0 0 80px ${isHigh ? 'rgba(239,68,68,0.07)' : 'rgba(16,185,129,0.07)'}`,
        }}>
          {/* Top accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: isHigh ? 'linear-gradient(90deg, #F59E0B, #EF4444)' : 'linear-gradient(90deg, #10B981, #06B6D4)' }} />
          {/* Radial glow */}
          <div style={{ position: 'absolute', inset: 0, background: isHigh ? 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(239,68,68,0.08), transparent)' : 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(16,185,129,0.08), transparent)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Date */}
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 20, fontWeight: 500 }}>{dateStr}</div>

            {/* Status badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700,
              padding: '9px 22px', borderRadius: 100, marginBottom: 32,
              background: isHigh ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
              border: `1px solid ${isHigh ? 'rgba(239,68,68,0.35)' : 'rgba(16,185,129,0.35)'}`,
              color: isHigh ? '#F87171' : '#34D399',
            }}>
              <span>{isHigh ? '⚠️' : '✅'}</span>
              {isHigh ? 'High Likelihood of ASD Traits Detected' : 'Low Likelihood of ASD Traits'}
            </div>

            {/* Gauge + Score side by side on desktop */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap', marginBottom: 28 }}>
              {/* Gauge */}
              <Gauge prob={probHigh} isHigh={isHigh} animate={animate} />

              {/* Score display */}
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>AQ Score</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 72, lineHeight: 1, color: isHigh ? '#EF4444' : '#10B981', letterSpacing: '-0.03em', textShadow: `0 0 40px ${isHigh ? 'rgba(239,68,68,0.5)' : 'rgba(16,185,129,0.5)'}` }}>
                  {score}
                  <span style={{ fontSize: 28, color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>/10</span>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(241,240,255,0.4)', marginTop: 8 }}>
                  {isHigh ? 'Clinical threshold: ≥ 6' : 'Below clinical threshold (6)'}
                </div>
                {/* Model accuracy bar */}
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Model</span>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} style={{ width: 9, height: 22, borderRadius: 3, background: i < Math.round((result.model_accuracy || 0.93) * 5) ? '#7C3AED' : 'rgba(255,255,255,0.07)', transition: `background 0.3s ${i * 80}ms` }} />
                    ))}
                  </div>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: '#A78BFA' }}>{Math.round((result.model_accuracy || 0.93) * 100)}%</span>
                </div>
              </div>
            </div>

            <p style={{ color: 'rgba(241,240,255,0.42)', fontSize: 15, maxWidth: 520, margin: '0 auto', lineHeight: 1.78 }}>
              {isHigh
                ? `Your AQ score of ${score}/10 and ${Math.round(probHigh * 100)}% probability indicates significant ASD trait patterns. A clinical evaluation is recommended for formal diagnosis.`
                : `Your AQ score of ${score}/10 and ${Math.round(probLow * 100)}% "no-traits" probability suggests low likelihood of ASD. No immediate clinical concern — though professional consultation is always an option.`}
            </p>

            {result.fallback && (
              <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '5px 14px' }}>
                <span>🔁</span> Rule-based fallback (ML service offline)
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            ANALYSIS GRID
        ══════════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>

          {/* AQ Trait Breakdown */}
          <div style={{ background: 'rgba(10,10,24,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 22, padding: '28px 26px' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 17, color: '#F1F0FF', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              🧩 Trait Breakdown
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, marginBottom: 24, fontWeight: 500 }}>Which AQ-10 traits contributed to your score</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {aqAnswers.map(({ label, score: s, color }, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: s ? color : 'rgba(255,255,255,0.25)', fontWeight: s ? 600 : 400, transition: 'color 0.3s' }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: s ? color : 'rgba(255,255,255,0.15)' }}>{s ? '+1' : '0'}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: animate ? `${s * 100}%` : '0%', background: s ? `linear-gradient(90deg, ${color}80, ${color})` : 'transparent', borderRadius: 100, transition: `width 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms`, boxShadow: s ? `0 0 8px ${color}60` : 'none' }} />
                  </div>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 14, marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>Total AQ Score</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 24, color: '#F1F0FF' }}>
                  {score}<span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>/10</span>
                </span>
              </div>
            </div>
          </div>

          {/* Probability Breakdown */}
          <div style={{ background: 'rgba(10,10,24,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 22, padding: '28px 26px' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 17, color: '#F1F0FF', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              📊 Probability Analysis
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, marginBottom: 28, fontWeight: 500 }}>AI model output from Random Forest classifier</p>

            <AnimBar value={probHigh} color="#EF4444" label="ASD Traits Present" animate={animate} delay={200} />
            <AnimBar value={probLow}  color="#10B981" label="No ASD Traits" animate={animate} delay={400} />

            {/* Cutoff marker */}
            <div style={{ position: 'relative', height: 24, marginTop: 8, marginBottom: 8 }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', fontSize: 10, color: 'rgba(255,255,255,0.25)', background: 'rgba(10,10,24,0.95)', padding: '2px 8px', borderRadius: 100, whiteSpace: 'nowrap', fontWeight: 600 }}>50% threshold</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', marginTop: 16 }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', textAlign: 'center', lineHeight: 1.65 }}>
                Clinical AQ cutoff: score ≥ 6 warrants evaluation<br />
                Model trained on 705 clinically-validated records
              </p>
            </div>

            {/* Mini stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 16 }}>
              {[['🎯', `${score}/10`, 'AQ Score'], ['🤖', `${Math.round((result.model_accuracy || 0.93) * 100)}%`, 'Accuracy'], ['🧬', isHigh ? 'YES' : 'NO', 'Prediction']].map(([icon, val, lbl]) => (
                <div key={lbl} style={{ textAlign: 'center', padding: '13px 8px', background: 'rgba(124,58,237,0.06)', borderRadius: 12, border: '1px solid rgba(124,58,237,0.12)' }}>
                  <div style={{ fontSize: 16, marginBottom: 5 }}>{icon}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 18, color: '#F1F0FF' }}>{val}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 3, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            WHAT TO DO NEXT
        ══════════════════════════════════════════ */}
        <div style={{ background: 'rgba(10,10,24,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 22, padding: '30px 26px', marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 18, color: '#F1F0FF', marginBottom: 24 }}>
            What To Do Next
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {nextSteps.map((s, i) => (
              <div key={i} style={{
                borderRadius: 16, padding: '22px 20px',
                background: `${s.color}0A`, border: `1px solid ${s.color}20`,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.3), 0 0 24px ${s.color}18`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: 30, marginBottom: 14 }}>{s.emoji}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: '#F1F0FF', marginBottom: 8, lineHeight: 1.3 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(241,240,255,0.4)', lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            DISCLAIMER
        ══════════════════════════════════════════ */}
        <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: 16, padding: '18px 22px', marginBottom: 36, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
          <p style={{ fontSize: 13, color: 'rgba(241,240,255,0.48)', lineHeight: 1.75, margin: 0 }}>
            <strong style={{ color: '#F1F0FF' }}>Medical Disclaimer:</strong> This screening is for <strong style={{ color: '#FCD34D' }}>informational purposes only</strong> and does not constitute a medical diagnosis. ASD can only be formally diagnosed by a qualified healthcare professional through comprehensive clinical assessment. If you have concerns, please consult a licensed psychologist or psychiatrist.
          </p>
        </div>

        {/* ══════════════════════════════════════════
            ACTIONS
        ══════════════════════════════════════════ */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/dashboard" className="btn-primary" style={{ padding: '14px 32px', fontSize: 15 }}>
            📊 View Dashboard
          </Link>
          <Link to="/quiz" className="btn-ghost" style={{ padding: '14px 32px', fontSize: 15 }}>
            🔄 Retake Screening
          </Link>
          <a href="https://link.springer.com/article/10.1007/s12559-020-09743-3" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: '14px 32px', fontSize: 15 }}>
            📄 Research Paper
          </a>
        </div>
      </div>
    </div>
  );
}
