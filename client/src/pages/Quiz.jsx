import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import Navbar from '../components/Navbar';

/* ─── Data ───────────────────────────────────────────────── */
const AQ_QUESTIONS = [
  { id: 'A1_Score',  text: 'I prefer to do things with others rather than on my own.',                       reverse: true,  trait: 'Social Preference',    emoji: '👥' },
  { id: 'A2_Score',  text: 'I prefer to do things the same way over and over again.',                        reverse: false, trait: 'Routine',              emoji: '🔁' },
  { id: 'A3_Score',  text: 'If I try to imagine something, I find it very easy to create a picture in my mind.', reverse: true,  trait: 'Imagination',         emoji: '🎨' },
  { id: 'A4_Score',  text: 'I frequently get so strongly absorbed in one thing that I lose sight of other things.', reverse: false, trait: 'Attention Focus',      emoji: '🎯' },
  { id: 'A5_Score',  text: 'I often notice small sounds when others do not.',                                reverse: false, trait: 'Sensory Processing',   emoji: '👂' },
  { id: 'A6_Score',  text: 'I usually notice car number plates or similar strings of information.',          reverse: false, trait: 'Detail Focus',         emoji: '🔍' },
  { id: 'A7_Score',  text: "Other people say what I've said is impolite, even though I think it's polite.",  reverse: false, trait: 'Social Communication', emoji: '💬' },
  { id: 'A8_Score',  text: "When I'm reading a story, I can easily imagine what the characters might look like.", reverse: true,  trait: 'Vivid Imagery',       emoji: '📖' },
  { id: 'A9_Score',  text: 'I am fascinated by dates.',                                                     reverse: false, trait: 'Pattern Thinking',     emoji: '📅' },
  { id: 'A10_Score', text: "In a social group, I can easily keep track of several different people's conversations.", reverse: true,  trait: 'Multi-tasking',       emoji: '🗣️' },
];

const META_FIELDS = [
  { id: 'age',       label: 'How old are you?',                                  type: 'number', placeholder: '25', hint: 'Enter your age (10–100)', emoji: '🎂' },
  { id: 'gender',    label: 'What is your gender?',                               type: 'select', emoji: '⚧️',
    options: [{ v: 'm', l: 'Male', icon: '♂' }, { v: 'f', l: 'Female', icon: '♀' }, { v: 'other', l: 'Other / Prefer not to say', icon: '⚧' }] },
  { id: 'ethnicity', label: 'What is your ethnicity?',                            type: 'select', emoji: '🌍',
    options: [
      { v: 'White-European', l: 'White / European' }, { v: 'Asian', l: 'Asian' },
      { v: 'South Asian', l: 'South Asian' }, { v: 'Latino', l: 'Latino / Hispanic' },
      { v: 'Black', l: 'Black / African' }, { v: 'Middle Eastern', l: 'Middle Eastern' },
      { v: 'Others', l: 'Other / Prefer not to say' },
    ]},
  { id: 'jundice',   label: 'Were you born with jaundice?',                       type: 'yesno', emoji: '🏥' },
  { id: 'austim',    label: 'Has anyone in your immediate family been diagnosed with ASD?', type: 'yesno', emoji: '🧬' },
  { id: 'relation',  label: 'Who is completing this screening?',                  type: 'select', emoji: '👤',
    options: [
      { v: 'Self', l: 'Myself' }, { v: 'Parent', l: 'Parent / Guardian' },
      { v: 'Relative', l: 'Relative' }, { v: 'Health care professional', l: 'Healthcare Professional' },
      { v: 'Others', l: 'Other' },
    ]},
];

const AQ_OPTIONS = [
  { label: 'Definitely Agree',  shortKey: '1', value: 1, agrees: true,  icon: '✓✓' },
  { label: 'Slightly Agree',    shortKey: '2', value: 1, agrees: true,  icon: '✓'  },
  { label: 'Slightly Disagree', shortKey: '3', value: 0, agrees: false, icon: '✗'  },
  { label: 'Definitely Disagree', shortKey: '4', value: 0, agrees: false, icon: '✗✗' },
];

const TRAIT_COLORS = {
  'Social Preference': '#A78BFA', 'Routine': '#67E8F9', 'Imagination': '#FCD34D',
  'Attention Focus': '#6EE7B7', 'Sensory Processing': '#F9A8D4', 'Detail Focus': '#A78BFA',
  'Social Communication': '#67E8F9', 'Vivid Imagery': '#FCD34D', 'Pattern Thinking': '#6EE7B7',
  'Multi-tasking': '#F9A8D4',
};
const traitColor = (t) => TRAIT_COLORS[t] || '#A78BFA';

const TOTAL = AQ_QUESTIONS.length + META_FIELDS.length;

/* ─── Components ─────────────────────────────────────────── */
function Spinner() {
  return (
    <span style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'qspin 0.7s linear infinite', verticalAlign: 'middle' }} />
  );
}

/* ─── Quiz Intro Screen ──────────────────────────────────── */
function IntroScreen({ onStart }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 40px' }}>
        <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
          {/* Brain icon */}
          <div style={{ width: 90, height: 90, borderRadius: 28, background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 36px', boxShadow: '0 0 70px rgba(124,58,237,0.5)', fontSize: 38, animation: 'pulse-glow 3s ease-in-out infinite' }}>
            🧠
          </div>

          <div className="badge badge-purple" style={{ marginBottom: 22, fontSize: 12 }}>
            AQ-10 Validated · Research-Backed
          </div>

          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 5vw, 44px)', color: '#F1F0FF', letterSpacing: '-0.025em', marginBottom: 16, lineHeight: 1.1 }}>
            ASD Awareness<br />
            <span style={{ background: 'linear-gradient(135deg, #A78BFA, #7C3AED, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Screening
            </span>
          </h1>

          <p style={{ color: 'rgba(241,240,255,0.48)', fontSize: 16, lineHeight: 1.78, marginBottom: 40, maxWidth: 440, margin: '0 auto 40px' }}>
            16 questions across two sections — 10 AQ-10 diagnostic questions and 6 background questions. Takes about <strong style={{ color: '#F1F0FF' }}>3–4 minutes</strong>.
          </p>

          {/* What to expect */}
          <div style={{ background: 'rgba(15,15,30,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '24px 28px', marginBottom: 36, textAlign: 'left' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 18 }}>What to expect</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['📋', '10 AQ-10 Questions', 'Answer honestly based on your natural tendencies'],
                ['👤', '6 Background Questions', 'Age, gender, and family history for model accuracy'],
                ['🤖', 'Instant AI Analysis', 'Random Forest model with 93% accuracy'],
                ['📊', 'Detailed Report', 'Score, probability breakdown, and personalized next steps'],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#F1F0FF', marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 14, padding: '14px 18px', marginBottom: 36, display: 'flex', gap: 12, textAlign: 'left' }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
            <p style={{ fontSize: 13, color: 'rgba(241,240,255,0.5)', lineHeight: 1.65, margin: 0 }}>
              <strong style={{ color: '#A78BFA' }}>Tip:</strong> Answer based on what feels naturally true for you most of the time — not what you think is the "right" answer. You can use keyboard keys <kbd style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, padding: '1px 6px', fontSize: 11 }}>1</kbd>–<kbd style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, padding: '1px 6px', fontSize: 11 }}>4</kbd> to answer quickly.
            </p>
          </div>

          <button onClick={onStart} className="btn-primary" style={{ padding: '15px 44px', fontSize: 16, width: '100%', maxWidth: 320, boxShadow: '0 0 40px rgba(124,58,237,0.4)', justifyContent: 'center' }}>
            Begin Screening
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>

          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 18 }}>
            Your results are stored privately and linked to your account only.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Quiz Component ────────────────────────────────── */
export default function Quiz() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [direction, setDirection] = useState(1); // 1=forward, -1=backward
  const [animating, setAnimating] = useState(false);
  const [meta, setMeta] = useState({
    age: '', gender: 'm', ethnicity: 'Others',
    jundice: 'no', austim: 'no', relation: 'Self',
    used_app_before: 'no', contry_of_res: 'India',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef();

  const isAQ = step < AQ_QUESTIONS.length;
  const metaIdx = step - AQ_QUESTIONS.length;
  const progress = (step / TOTAL) * 100;
  const currentQ = isAQ ? AQ_QUESTIONS[step] : null;
  const currentMeta = !isAQ ? META_FIELDS[metaIdx] : null;
  const aqScore = Object.values(answers).reduce((s, v) => s + v, 0);

  const canNext = isAQ
    ? selected !== null
    : currentMeta?.type === 'number'
      ? meta[currentMeta.id] !== '' && !isNaN(Number(meta[currentMeta.id])) && Number(meta[currentMeta.id]) >= 10 && Number(meta[currentMeta.id]) <= 100
      : true;

  /* ── Card slide animation ── */
  const slideCard = (dir, cb) => {
    if (animating) return;
    setAnimating(true);
    setDirection(dir);
    // Exit animation
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${dir > 0 ? '-60px' : '60px'})`;
      cardRef.current.style.opacity = '0';
    }
    setTimeout(() => {
      cb();
      setAnimating(false);
      if (cardRef.current) {
        cardRef.current.style.transition = 'none';
        cardRef.current.style.transform = `translateX(${dir > 0 ? '60px' : '-60px'})`;
        cardRef.current.style.opacity = '0';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (cardRef.current) {
              cardRef.current.style.transition = 'transform 0.38s cubic-bezier(0.16,1,0.3,1), opacity 0.38s ease';
              cardRef.current.style.transform = 'translateX(0)';
              cardRef.current.style.opacity = '1';
            }
          });
        });
      }
    }, 280);
  };

  const handleNext = useCallback(async () => {
    if (!canNext || animating) return;
    if (isAQ) {
      const q = AQ_QUESTIONS[step];
      let score = AQ_OPTIONS[selected].value;
      if (q.reverse) score = score === 1 ? 0 : 1;
      slideCard(1, () => {
        setAnswers(p => ({ ...p, [q.id]: score }));
        setSelected(null);
        setStep(s => s + 1);
      });
    } else if (step < TOTAL - 1) {
      slideCard(1, () => setStep(s => s + 1));
    } else {
      // Submit
      setLoading(true); setError('');
      try {
        const payload = {
          ...answers,
          age: parseInt(meta.age) || 25,
          gender: meta.gender, ethnicity: meta.ethnicity,
          jundice: meta.jundice, austim: meta.austim,
          relation: meta.relation,
          used_app_before: 'no',
          contry_of_res: 'India',
        };
        const result = await api.predict(payload, token);
        navigate(`/results/${result.id}`);
      } catch (err) {
        setError(err.message || 'Submission failed. Please try again.');
        setLoading(false);
      }
    }
  }, [canNext, animating, isAQ, step, selected, answers, meta, token, navigate]);

  const handleBack = useCallback(() => {
    if (step <= 0 || animating) return;
    slideCard(-1, () => {
      setSelected(null);
      setStep(s => s - 1);
    });
  }, [step, animating]);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    const handler = (e) => {
      if (!started) return;
      if (e.key === 'ArrowRight' || e.key === 'Enter') { if (canNext) handleNext(); return; }
      if (e.key === 'ArrowLeft' || e.key === 'Backspace') { if (step > 0) handleBack(); return; }
      if (isAQ && ['1', '2', '3', '4'].includes(e.key)) {
        setSelected(parseInt(e.key) - 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [started, isAQ, canNext, handleNext, handleBack, step]);

  if (!started) return <IntroScreen onStart={() => setStarted(true)} />;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* ── Global progress bar ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 3, background: 'rgba(255,255,255,0.05)' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #7C3AED, #06B6D4)', transition: 'width 0.55s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 0 14px rgba(124,58,237,0.8)' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 40px' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>

          {/* ── Header Row ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                {isAQ
                  ? `AQ-10 Question ${step + 1} of ${AQ_QUESTIONS.length}`
                  : `Profile ${metaIdx + 1} of ${META_FIELDS.length}`}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(241,240,255,0.6)', fontWeight: 500 }}>
                {isAQ ? 'ASD Screening · AQ-10 Validated Instrument' : 'Background Information'}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 30, color: '#F1F0FF', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {Math.round(progress)}<span style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>%</span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 3, fontWeight: 600 }}>COMPLETE</div>
            </div>
          </div>

          {/* ── Step indicator dots ── */}
          <div style={{ display: 'flex', gap: 3, marginBottom: 32 }}>
            {Array.from({ length: TOTAL }, (_, i) => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i < step ? '#7C3AED' : i === step ? '#A78BFA' : 'rgba(255,255,255,0.07)',
                transition: 'background 0.35s',
                boxShadow: i === step ? '0 0 10px rgba(167,139,250,0.6)' : 'none',
              }} />
            ))}
          </div>

          {/* ── Main Card ── */}
          <div ref={cardRef} style={{
            background: 'rgba(12,12,28,0.95)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24, padding: '36px 32px',
            backdropFilter: 'blur(48px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(124,58,237,0.07)',
            position: 'relative', overflow: 'hidden',
            transition: 'transform 0.38s cubic-bezier(0.16,1,0.3,1), opacity 0.38s ease',
          }}>
            {/* Top accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: isAQ
                ? `linear-gradient(90deg, ${traitColor(currentQ?.trait)}, #06B6D4)`
                : 'linear-gradient(90deg, #10B981, #7C3AED)',
            }} />

            {/* Error */}
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '13px 16px', marginBottom: 24, color: '#F87171', fontSize: 13, display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                {error}
              </div>
            )}

            {/* ── AQ Question ── */}
            {isAQ && currentQ && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                  <span style={{ fontSize: 22 }}>{currentQ.emoji}</span>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 13px', borderRadius: 100, background: `${traitColor(currentQ.trait)}14`, color: traitColor(currentQ.trait), border: `1px solid ${traitColor(currentQ.trait)}30` }}>
                    {currentQ.trait}
                  </div>
                </div>

                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(18px,3.5vw, 23px)', color: '#F1F0FF', marginBottom: 32, lineHeight: 1.5, letterSpacing: '-0.01em' }}>
                  "{currentQ.text}"
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {AQ_OPTIONS.map((opt, i) => {
                    const isSel = selected === i;
                    const selColor = opt.agrees ? '#7C3AED' : '#475569';
                    return (
                      <button key={i} onClick={() => setSelected(i)} style={{
                        borderRadius: 14, padding: '18px 16px', textAlign: 'left', cursor: 'pointer',
                        background: isSel ? `${selColor}1A` : 'rgba(255,255,255,0.025)',
                        border: `1.5px solid ${isSel ? `${selColor}70` : 'rgba(255,255,255,0.07)'}`,
                        transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                        boxShadow: isSel ? `0 0 24px ${selColor}20` : 'none',
                        transform: isSel ? 'scale(1.015)' : 'scale(1)',
                        position: 'relative', overflow: 'hidden',
                      }}
                        onMouseEnter={e => { if (!isSel) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; } }}
                        onMouseLeave={e => { if (!isSel) { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; } }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {/* Radio dot */}
                          <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, border: `2px solid ${isSel ? selColor : 'rgba(255,255,255,0.18)'}`, background: isSel ? selColor : 'transparent', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isSel && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: isSel ? '#F1F0FF' : 'rgba(241,240,255,0.5)', transition: 'color 0.2s', lineHeight: 1.3 }}>
                              {opt.label}
                            </div>
                          </div>
                          {/* Keyboard hint */}
                          <kbd style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '2px 6px', fontFamily: 'monospace', flexShrink: 0 }}>
                            {opt.shortKey}
                          </kbd>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div style={{ marginTop: 20, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
                  <span>💡</span>
                  Answer based on what feels naturally true for you <em>most of the time</em>. Press <kbd style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 3, padding: '0 5px', fontSize: 10 }}>Enter</kbd> or <kbd style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 3, padding: '0 5px', fontSize: 10 }}>→</kbd> to advance.
                </div>
              </>
            )}

            {/* ── Meta Fields ── */}
            {!isAQ && currentMeta && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                  <span style={{ fontSize: 26 }}>{currentMeta.emoji}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#34D399', marginBottom: 4 }}>
                      {metaIdx < 2 ? 'Demographics' : metaIdx < 4 ? 'Medical History' : 'Context'}
                    </div>
                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(17px,3.5vw,22px)', color: '#F1F0FF', lineHeight: 1.35, letterSpacing: '-0.01em', margin: 0 }}>
                      {currentMeta.label}
                    </h2>
                  </div>
                </div>

                {/* Number input */}
                {currentMeta.type === 'number' && (
                  <div style={{ textAlign: 'center' }}>
                    <input
                      type="number" min={10} max={100}
                      value={meta[currentMeta.id]}
                      onChange={e => setMeta(p => ({ ...p, [currentMeta.id]: e.target.value }))}
                      placeholder={currentMeta.placeholder}
                      autoFocus
                      style={{ width: '100%', maxWidth: 200, padding: '22px 16px', textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 48, color: '#F1F0FF', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 18, outline: 'none', transition: 'border 0.2s, box-shadow 0.2s', display: 'block', margin: '0 auto' }}
                      onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.6)'; e.target.style.boxShadow = '0 0 0 4px rgba(124,58,237,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                    />
                    {currentMeta.hint && <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, marginTop: 14 }}>{currentMeta.hint}</p>}
                  </div>
                )}

                {/* Select options */}
                {currentMeta.type === 'select' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
                    {currentMeta.options.map(opt => {
                      const sel = meta[currentMeta.id] === opt.v;
                      return (
                        <button key={opt.v} onClick={() => setMeta(p => ({ ...p, [currentMeta.id]: opt.v }))} style={{
                          padding: '14px 16px', borderRadius: 13, textAlign: 'left', cursor: 'pointer',
                          background: sel ? 'rgba(124,58,237,0.16)' : 'rgba(255,255,255,0.025)',
                          border: `1.5px solid ${sel ? 'rgba(124,58,237,0.55)' : 'rgba(255,255,255,0.07)'}`,
                          transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: 10,
                          boxShadow: sel ? '0 0 20px rgba(124,58,237,0.15)' : 'none',
                        }}
                          onMouseEnter={e => { if (!sel) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                          onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
                        >
                          <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${sel ? '#7C3AED' : 'rgba(255,255,255,0.2)'}`, background: sel ? '#7C3AED' : 'transparent', transition: 'all 0.18s', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {sel && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: sel ? '#F1F0FF' : 'rgba(241,240,255,0.48)' }}>{opt.l}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Yes/No */}
                {currentMeta.type === 'yesno' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[{ v: 'yes', l: 'Yes', color: '#10B981', icon: '✓' }, { v: 'no', l: 'No', color: '#64748B', icon: '✗' }].map(opt => {
                      const sel = meta[currentMeta.id] === opt.v;
                      return (
                        <button key={opt.v} onClick={() => setMeta(p => ({ ...p, [currentMeta.id]: opt.v }))} style={{
                          padding: '32px 20px', borderRadius: 18, textAlign: 'center', cursor: 'pointer',
                          background: sel ? `${opt.color}16` : 'rgba(255,255,255,0.025)',
                          border: `1.5px solid ${sel ? `${opt.color}55` : 'rgba(255,255,255,0.07)'}`,
                          transition: 'all 0.2s',
                          boxShadow: sel ? `0 0 28px ${opt.color}20` : 'none',
                          transform: sel ? 'scale(1.02)' : 'scale(1)',
                        }}>
                          <div style={{ fontSize: 28, marginBottom: 10, color: sel ? opt.color : 'rgba(255,255,255,0.2)', transition: 'all 0.2s' }}>{opt.icon}</div>
                          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 24, color: sel ? opt.color : 'rgba(241,240,255,0.35)', transition: 'color 0.2s' }}>{opt.l}</div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Navigation Row ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
            {/* Back */}
            <button onClick={handleBack} disabled={step === 0} style={{
              display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
              color: step === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.42)',
              fontSize: 14, fontWeight: 500, cursor: step === 0 ? 'not-allowed' : 'pointer',
              padding: '10px 14px', borderRadius: 10, transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
            }}
              onMouseEnter={e => { if (step > 0) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; } }}
              onMouseLeave={e => { e.currentTarget.style.color = step === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.42)'; e.currentTarget.style.background = 'none'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>

            {/* Live AQ pill */}
            {isAQ && Object.keys(answers).length > 0 && (
              <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)', borderRadius: 100, padding: '7px 18px', fontSize: 13, color: '#A78BFA', fontWeight: 700 }}>
                AQ: {aqScore} / {Object.keys(answers).length}
              </div>
            )}

            {/* Next / Submit */}
            <button onClick={handleNext} disabled={!canNext || loading} className="btn-primary" style={{
              padding: '12px 30px', fontSize: 14,
              opacity: !canNext ? 0.3 : 1,
              cursor: !canNext ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s',
              boxShadow: canNext ? '0 0 24px rgba(124,58,237,0.35)' : 'none',
            }}>
              {loading ? <><Spinner /> &nbsp;Analyzing...</>
                : step === TOTAL - 1 ? <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Get Results
                </> : <>
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </>}
            </button>
          </div>

          {/* Keyboard hint */}
          <div style={{ textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>
            Use <kbd style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 4, padding: '1px 6px', fontSize: 10 }}>←</kbd> <kbd style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 4, padding: '1px 6px', fontSize: 10 }}>→</kbd> or <kbd style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 4, padding: '1px 6px', fontSize: 10 }}>Enter</kbd> to navigate · <kbd style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 4, padding: '1px 6px', fontSize: 10 }}>1–4</kbd> to answer
          </div>
        </div>
      </div>

      <style>{`@keyframes qspin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
