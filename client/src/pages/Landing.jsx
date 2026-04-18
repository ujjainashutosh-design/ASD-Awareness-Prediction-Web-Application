import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';

gsap.registerPlugin(ScrollTrigger);

/* ─── Count-up hook ─────────────────────────────────────── */
function useCountUp(target, duration = 2200, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4); // quartic ease-out
      setVal(Math.round(ease * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return val;
}

/* ─── Stat Card ──────────────────────────────────────────── */
function StatCard({ color, value, suffix, label, desc }) {
  const ref = useRef();
  const [active, setActive] = useState(false);
  const count = useCountUp(value, 2200, active);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      background: 'rgba(15,15,30,0.85)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20, padding: '40px 28px', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
      backdropFilter: 'blur(20px)',
      transition: 'transform 0.3s, box-shadow 0.3s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 24px 60px rgba(0,0,0,0.4), 0 0 40px ${color}18`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* top accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: '20px 20px 0 0', boxShadow: `0 0 24px ${color}90` }} />
      {/* glow orb */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: `${color}0A`, filter: 'blur(30px)' }} />
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 58, lineHeight: 1, color, marginBottom: 8, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 40px ${color}70`, letterSpacing: '-0.02em' }}>
        {count}{suffix}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.7 }}>{desc}</div>
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────── */
const STATS = [
  { color: '#A78BFA', value: 1,   suffix: '',   label: 'in 36 children',  desc: 'In the US are diagnosed with ASD' },
  { color: '#22D3EE', value: 85,  suffix: '%',  label: 'detected late',   desc: 'After age 4 — missing critical early support' },
  { color: '#FCD34D', value: 700, suffix: 'K+', label: 'new diagnoses',   desc: 'Adults newly diagnosed each year globally' },
  { color: '#34D399', value: 93,  suffix: '%',  label: 'model accuracy',  desc: 'Random Forest AI trained on clinical records' },
];

const STEPS = [
  {
    num: '01', color: '#A78BFA',
    emoji: '📋',
    title: 'Answer 10 Questions',
    desc: 'Evidence-based AQ-10 questions covering social communication, behavioral patterns, and sensory experiences. Takes under 4 minutes.',
    detail: 'Validated by clinical researchers worldwide',
  },
  {
    num: '02', color: '#22D3EE',
    emoji: '🤖',
    title: 'AI Analyzes Instantly',
    desc: 'Our Random Forest model, trained on 705 peer-reviewed clinical records, analyzes your responses across 21 validated features.',
    detail: '93% accuracy on held-out test data',
  },
  {
    num: '03', color: '#34D399',
    emoji: '📊',
    title: 'Get Your Full Report',
    desc: 'Receive an AQ score, probability breakdown, trait analysis, and clear, personalized next steps — all in a beautiful dashboard.',
    detail: 'Saved securely for future reference',
  },
];

const TRAITS = [
  ['Social Communication', '#A78BFA'],
  ['Pattern Recognition', '#67E8F9'],
  ['Repetitive Behaviors', '#FCD34D'],
  ['Sensory Sensitivities', '#6EE7B7'],
  ['Attention to Detail', '#F9A8D4'],
  ['Theory of Mind', '#A78BFA'],
  ['Routine Preference', '#67E8F9'],
  ['Special Interests', '#FCD34D'],
  ['Emotional Regulation', '#6EE7B7'],
  ['Eye Contact Comfort', '#F9A8D4'],
];

/* ─── Landing ────────────────────────────────────────────── */
export default function Landing() {
  const heroRef    = useRef();
  const headRef    = useRef();
  const subRef     = useRef();
  const ctaRef     = useRef();
  const trustRef   = useRef();
  const scrollRef  = useRef();
  const statsSecRef = useRef();
  const statsTitleRef = useRef();
  const statsGridRef = useRef();
  const howRef     = useRef();
  const timelineRef = useRef();
  const stepsRef   = useRef([]);
  const researchRef = useRef();
  const traitsRef  = useRef();
  const ctaSectionRef = useRef();
  const orb1Ref = useRef();
  const orb2Ref = useRef();
  const orb3Ref = useRef();

  useEffect(() => {
    // Defer until after first paint so all DOM refs are valid
    const raf = requestAnimationFrame(() => {
    const ctx = gsap.context(() => {

      /* ── HERO entrance ─────────────────────── */
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from(headRef.current,   { y: 60, opacity: 0, duration: 1.0, clearProps: 'all' })
        .from(subRef.current,    { y: 36, opacity: 0, duration: 0.85, clearProps: 'all' }, '-=0.55')
        .from(ctaRef.current,    { y: 26, opacity: 0, duration: 0.75, clearProps: 'all' }, '-=0.45')
        .from(trustRef.current,  { y: 18, opacity: 0, duration: 0.65, clearProps: 'all' }, '-=0.4')
        .from(scrollRef.current, { opacity: 0, duration: 0.9, clearProps: 'all' }, '-=0.2');

      /* ── Orbs — parallax on scroll ─────────── */
      gsap.to(orb1Ref.current, {
        y: -160, ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
      });
      gsap.to(orb2Ref.current, {
        y: -100, ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 2 },
      });
      gsap.to(orb3Ref.current, {
        y: -60, ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
      });

      /* ── STATS section ─────────────────────── */
      gsap.from(statsTitleRef.current, {
        y: 48, opacity: 0, duration: 0.85, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: statsSecRef.current, start: 'top 82%', toggleActions: 'play none none none' },
      });
      // Use Array.from to safely iterate HTMLCollection
      Array.from(statsGridRef.current.children).forEach((child, i) => {
        gsap.from(child, {
          y: 56, opacity: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out', clearProps: 'all',
          scrollTrigger: { trigger: statsGridRef.current, start: 'top 82%', toggleActions: 'play none none none' },
        });
      });

      /* ── HOW IT WORKS — staggered steps ────── */
      if (timelineRef.current) {
        gsap.from(howRef.current, {
          y: 38, opacity: 0, duration: 0.8, ease: 'power3.out', clearProps: 'all',
          scrollTrigger: { trigger: howRef.current, start: 'top 84%', toggleActions: 'play none none none' },
        });

        stepsRef.current.forEach((el, i) => {
          if (!el) return;
          gsap.from(el, {
            x: -56, opacity: 0, duration: 0.85, ease: 'power3.out', clearProps: 'all',
            scrollTrigger: { trigger: el, start: 'top 87%', toggleActions: 'play none none none' },
          });
        });

        /* Connector line draw animation */
        const lines = timelineRef.current.querySelectorAll('.tl-line');
        lines.forEach(line => {
          gsap.from(line, {
            scaleY: 0, transformOrigin: 'top center', duration: 0.75, ease: 'power2.out',
            scrollTrigger: { trigger: line, start: 'top 87%', toggleActions: 'play none none none' },
          });
        });
      }

      /* ── RESEARCH block ────────────────────── */
      if (researchRef.current) {
        Array.from(researchRef.current.children).forEach((child, i) => {
          gsap.from(child, {
            y: 46, opacity: 0, duration: 0.85, delay: i * 0.15, ease: 'power3.out', clearProps: 'all',
            scrollTrigger: { trigger: researchRef.current, start: 'top 82%', toggleActions: 'play none none none' },
          });
        });
      }

      /* ── TRAITS chips ──────────────────────── */
      if (traitsRef.current) {
        Array.from(traitsRef.current.children).forEach((chip, i) => {
          gsap.from(chip, {
            scale: 0.7, opacity: 0, duration: 0.45, delay: i * 0.035,
            ease: 'back.out(1.7)', clearProps: 'all',
            scrollTrigger: { trigger: traitsRef.current, start: 'top 87%', toggleActions: 'play none none none' },
          });
        });
      }

      /* ── FINAL CTA ─────────────────────────── */
      if (ctaSectionRef.current) {
        gsap.from(ctaSectionRef.current, {
          y: 40, opacity: 0, duration: 0.9,
          ease: 'power3.out', clearProps: 'all',
          scrollTrigger: {
            trigger: ctaSectionRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
            onEnter: () => gsap.set(ctaSectionRef.current, { clearProps: 'all' }),
          },
        });
      }

    ScrollTrigger.refresh();

    }); // end gsap.context
    }); // end requestAnimationFrame

    // Safety fallback: after 2s, force-clear any stuck GSAP opacity:0 states
    const fallbackTimer = setTimeout(() => {
      document.querySelectorAll('[style*="opacity: 0"]').forEach(el => {
        if (el.style.opacity === '0') el.style.opacity = '';
      });
    }, 2500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallbackTimer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      {/* ═══════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: 96, paddingBottom: 96 }}>

        {/* BG Gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.32) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 80% 85%, rgba(6,182,212,0.10) 0%, transparent 60%), var(--dark)' }} />

        {/* Orbs */}
        <div ref={orb1Ref} className="orb" style={{ width: 520, height: 520, top: '10%', left: '8%', background: 'rgba(124,58,237,0.17)', animation: 'float 10s ease-in-out infinite' }} />
        <div ref={orb2Ref} className="orb" style={{ width: 360, height: 360, top: '35%', right: '6%', background: 'rgba(6,182,212,0.12)', animation: 'float 7.5s 2s ease-in-out infinite' }} />
        <div ref={orb3Ref} className="orb" style={{ width: 250, height: 250, bottom: '18%', left: '38%', background: 'rgba(245,158,11,0.09)', animation: 'float 8.5s 1s ease-in-out infinite' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 820, margin: '0 auto', padding: '0 32px', width: '100%' }}>

          {/* Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
            <div className="badge badge-purple" style={{ gap: 8, padding: '8px 20px', fontSize: 12 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34D399', display: 'inline-block', boxShadow: '0 0 10px #34D399', animation: 'pulse-glow 2s ease-in-out infinite' }} />
              AI-Powered · Research-Backed · 93% Accurate
            </div>
          </div>

          {/* Headline */}
          <h1 ref={headRef} className="hero-title" style={{ fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 32, color: '#F1F0FF', textAlign: 'center' }}>
            Understanding{' '}
            <span style={{ background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 45%, #22D3EE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Autism</span>
            <br />
            <span style={{ color: 'rgba(241,240,255,0.55)', fontWeight: 700, fontSize: '0.75em' }}>Starts With Awareness</span>
          </h1>

          {/* Sub */}
          <p ref={subRef} style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(241,240,255,0.48)', maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.8, textAlign: 'center' }}>
            A free, research-backed screening tool trained on clinical data — to help you understand autism spectrum traits for yourself or someone you care about.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 52 }}>
            <Link to="/signup" className="btn-primary" style={{ padding: '15px 36px', fontSize: 15, boxShadow: '0 0 40px rgba(124,58,237,0.45)' }}>
              Take Free Screening
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link to="/about" className="btn-ghost" style={{ padding: '15px 36px', fontSize: 15 }}>Learn About ASD</Link>
          </div>

          {/* Trust row */}
          <div ref={trustRef} style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', width: '100%', margin: '0 auto' }}>
            {['Free & Anonymous', 'Research-Backed (Springer 2020)', 'Results in 3 minutes'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.32)', fontSize: 13 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div ref={scrollRef} style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>Scroll</span>
          <div style={{ position: 'relative', width: 20, height: 32, border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 100, display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
            <div style={{ width: 4, height: 8, borderRadius: 100, background: 'rgba(255,255,255,0.3)', animation: 'scrollBounce 2s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════════════════ */}
      <section ref={statsSecRef} style={{ padding: '100px 0', background: 'var(--dark-alt)', position: 'relative', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: 0, inset: '0 0 auto', height: 1, background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4), transparent)' }} />
        <div className="container">
          <div ref={statsTitleRef} style={{ textAlign: 'center', marginBottom: 72 }}>
            <div className="badge badge-purple" style={{ marginBottom: 18 }}>The Reality</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              ASD By The Numbers
            </h2>
            <p style={{ color: 'rgba(241,240,255,0.35)', marginTop: 12, fontSize: 15 }}>
              Why early awareness and screening matter more than ever
            </p>
          </div>
          <div ref={statsGridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {STATS.map((s, i) => <StatCard key={i} {...s} />)}
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0', height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS — Timeline
      ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '112px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle bg grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div className="container">
          {/* Header */}
          <div ref={howRef} style={{ textAlign: 'center', marginBottom: 80 }}>
            <div className="badge badge-purple" style={{ marginBottom: 18 }}>Simple Process</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 16, textAlign: 'center' }}>
              How It Works
            </h2>
            <p style={{ color: 'rgba(241,240,255,0.38)', fontSize: 16, maxWidth: 440, margin: '0 auto' }}>
              Three science-backed steps from question to clarity
            </p>
          </div>

          {/* Timeline */}
          <div ref={timelineRef} style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>
            {STEPS.map((step, i) => (
              <div key={i}>
                {/* Step card */}
                <div ref={el => stepsRef.current[i] = el} style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 28, alignItems: 'flex-start', marginBottom: 0 }}>
                  {/* Left: number + line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                      background: `linear-gradient(135deg, ${step.color}22, ${step.color}08)`,
                      border: `2px solid ${step.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 20, color: step.color,
                      boxShadow: `0 0 24px ${step.color}20`,
                      position: 'relative', zIndex: 1,
                    }}>
                      {step.num}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="tl-line" style={{ width: 2, flexGrow: 1, minHeight: 80, background: `linear-gradient(to bottom, ${step.color}50, ${STEPS[i + 1].color}20)`, marginTop: 8 }} />
                    )}
                  </div>

                  {/* Right: content */}
                  <div style={{
                    background: 'rgba(15,15,30,0.85)',
                    border: `1px solid rgba(255,255,255,0.07)`,
                    borderLeft: `3px solid ${step.color}60`,
                    borderRadius: '0 18px 18px 0',
                    padding: '28px 32px',
                    marginBottom: i < STEPS.length - 1 ? 0 : 0,
                    backdropFilter: 'blur(20px)',
                    position: 'relative', overflow: 'hidden',
                    transition: 'box-shadow 0.3s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.35), inset 0 0 30px ${step.color}08`}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    {/* Glow */}
                    <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: `${step.color}08`, filter: 'blur(24px)', pointerEvents: 'none' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                      <span style={{ fontSize: 28 }}>{step.emoji}</span>
                      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 22, color: '#F1F0FF', letterSpacing: '-0.01em' }}>
                        {step.title}
                      </h3>
                    </div>
                    <p style={{ color: 'rgba(241,240,255,0.5)', fontSize: 15, lineHeight: 1.75, marginBottom: 16 }}>{step.desc}</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 14px', background: `${step.color}10`, border: `1px solid ${step.color}25`, borderRadius: 100 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={step.color} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ fontSize: 12, color: step.color, fontWeight: 600 }}>{step.detail}</span>
                    </div>

                    {/* Spacer so line flows properly */}
                    {i < STEPS.length - 1 && <div style={{ height: 32 }} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SPECTRUM BAND
      ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', background: 'var(--dark-alt)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, inset: '0 0 auto', height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge badge-purple" style={{ marginBottom: 20 }}>What is Autism?</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(26px, 4vw, 48px)', fontWeight: 800, marginBottom: 20, letterSpacing: '-0.02em' }}>
            Every Mind on the{' '}
            <span style={{ background: 'linear-gradient(135deg, #A78BFA, #7C3AED, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Spectrum is Unique
            </span>
          </h2>
          <p style={{ color: 'rgba(241,240,255,0.45)', fontSize: 16, lineHeight: 1.8, maxWidth: 600, margin: '0 auto 48px' }}>
            ASD is a neurodevelopmental condition affecting social communication, behavior, and sensory processing. It exists on a spectrum — no two autistic individuals are the same. Early detection opens doors to support and a better life.
          </p>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ height: 10, borderRadius: 100, background: 'linear-gradient(90deg, #7C3AED, #4F46E5, #06B6D4, #10B981, #F59E0B)', boxShadow: '0 0 30px rgba(124,58,237,0.3)', marginBottom: 14 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {['Social', 'Sensory', 'Communication', 'Behavior', 'Cognition', 'Emotion'].map(t => (
                <span key={t} style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontWeight: 600, letterSpacing: '0.05em' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          RESEARCH BLOCK
      ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '112px 0', position: 'relative' }}>
        <div className="container">
          <div ref={researchRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>
            {/* Left */}
            <div>
              <div className="badge badge-gold" style={{ marginBottom: 22 }}>Research Foundation</div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, marginBottom: 20, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                Built on Peer-Reviewed{' '}
                <span style={{ background: 'linear-gradient(135deg, #A78BFA, #7C3AED, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Clinical Data
                </span>
              </h2>
              <p style={{ color: 'rgba(241,240,255,0.48)', lineHeight: 1.82, fontSize: 15, marginBottom: 28 }}>
                Trained on the UCI ASD Screening Adult Dataset — peer-reviewed in <em>Cognitive Computation</em> (Springer, 2020). Features 705 clinically-validated records and 21 features including the gold-standard AQ-10 instrument.
              </p>
              {/* Citation */}
              <div style={{ borderRadius: 14, padding: '18px 22px', background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.18)', borderLeft: '3px solid #7C3AED', marginBottom: 28 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Springer 2020</div>
                <div style={{ fontSize: 15, color: 'rgba(241,240,255,0.8)', fontStyle: 'italic', fontFamily: "'Playfair Display', serif", marginBottom: 6, lineHeight: 1.5 }}>
                  "Predicting Autism Spectrum Disorder Using Machine Learning"
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Cognitive Computation · Springer Nature</div>
              </div>
              {/* Mini stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[['705', 'Records'], ['93%', 'Accuracy'], ['21', 'Features']].map(([n, l]) => (
                  <div key={l} style={{ textAlign: 'center', padding: '16px 8px', background: 'rgba(124,58,237,0.07)', borderRadius: 14, border: '1px solid rgba(124,58,237,0.15)' }}>
                    <div style={{ background: 'linear-gradient(135deg, #A78BFA, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 26 }}>{n}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — disclaimer card */}
            <div style={{ background: 'rgba(15,15,30,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '36px 32px', backdropFilter: 'blur(24px)' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(124,58,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: '#A78BFA' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 20, color: '#F1F0FF', marginBottom: 8 }}>Important Disclaimer</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 20, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Please read before proceeding</p>
              <p style={{ color: 'rgba(241,240,255,0.52)', fontSize: 14, lineHeight: 1.82, marginBottom: 18 }}>
                SpectrumSense is a <strong style={{ color: '#F1F0FF' }}>screening aid, not a diagnostic tool</strong>. Results are based on statistical patterns from clinical data and should not replace professional medical evaluation.
              </p>
              <p style={{ color: 'rgba(241,240,255,0.42)', fontSize: 14, lineHeight: 1.82, marginBottom: 28 }}>
                If your results indicate high ASD trait likelihood, consult a licensed psychologist or neuropsychologist for formal assessment.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Privacy Protected', 'Anonymous Results', 'No Medical Records'].map(t => (
                  <div key={t} style={{ padding: '6px 14px', borderRadius: 100, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#34D399', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TRAITS — AQ-10 Chips
      ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '88px 0', background: 'var(--dark-alt)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, inset: '0 0 auto', height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge badge-purple" style={{ marginBottom: 20 }}>AQ-10 Instrument</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>
            What We Screen For
          </h2>
          <p style={{ color: 'rgba(241,240,255,0.38)', fontSize: 15, marginBottom: 52 }}>
            Based on the validated Autism Quotient instrument used worldwide in clinical settings
          </p>
          <div ref={traitsRef} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 700, margin: '0 auto' }}>
            {TRAITS.map(([trait, color]) => (
              <div key={trait}
                style={{ padding: '10px 20px', borderRadius: 100, background: `${color}0E`, border: `1px solid ${color}28`, color, fontSize: 14, fontWeight: 500, transition: 'all 0.25s', cursor: 'default', letterSpacing: '0.01em' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}22`; e.currentTarget.style.background = `${color}18`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = `${color}0E`; }}
              >
                {trait}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Radial glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(124,58,237,0.18) 0%, transparent 70%)' }} />
        {/* Grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div ref={ctaSectionRef} style={{ textAlign: 'center', width: '100%' }}>
            {/* Brain icon */}
            <div style={{ width: 84, height: 84, borderRadius: 26, margin: '0 auto 36px', background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 70px rgba(124,58,237,0.55)', animation: 'pulse-glow 3s ease-in-out infinite' }}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
              </svg>
            </div>

            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(34px, 6.5vw, 76px)', fontWeight: 800, marginBottom: 22, lineHeight: 1.08, letterSpacing: '-0.03em' }}>
              Your Story{' '}
              <span style={{ background: 'linear-gradient(135deg, #A78BFA, #7C3AED, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Starts Here
              </span>
            </h2>

            <p style={{ color: 'rgba(241,240,255,0.4)', fontSize: 17, marginBottom: 48, maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.78 }}>
              Join thousands who've gained clarity about their neurodivergent traits. Free, anonymous, and research-backed.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
              <Link to="/signup" className="btn-primary" style={{ padding: '16px 44px', fontSize: 16, boxShadow: '0 0 60px rgba(124,58,237,0.55)' }}>
                Begin Free Screening
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <Link to="/about" className="btn-ghost" style={{ padding: '16px 44px', fontSize: 16 }}>Learn More</Link>
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: 28, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginTop: 8 }}>
              {[['🔐', 'Privacy First'], ['⚡', 'Instant Results'], ['🎓', 'Research-Backed'], ['💚', 'Always Free']].map(([icon, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.32)', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 15 }}>{icon}</span>{label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════ */}
      <footer style={{ background: '#050509', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '44px 0' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: 'rgba(241,240,255,0.6)', fontSize: 15 }}>SpectrumSense</span>
          </div>
          {/* Links */}
          <div style={{ display: 'flex', gap: 28 }}>
            {[['/', 'Home'], ['/about', 'About ASD'], ['/signup', 'Screening'], ['/login', 'Sign In']].map(([to, label]) => (
              <Link key={to} to={to} style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.28)'}>{label}</Link>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>© 2025 SpectrumSense · For awareness purposes only · Not medical advice</p>
        </div>
      </footer>

      {/* ── scroll bounce keyframe ─────────────────────────── */}
      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50%       { transform: translateY(8px); opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}
