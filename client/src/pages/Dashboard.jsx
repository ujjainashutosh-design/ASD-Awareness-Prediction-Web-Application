import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import Navbar from '../components/Navbar';

/* ─── Helpers ────────────────────────────────────────────── */
const fmt = (iso) => new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtFull = (iso) => new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

/* ─── Animated Counter ───────────────────────────────────── */
function Counter({ target, duration = 900, suffix = '' }) {
  const [val, setVal] = useState(0);
  const rafRef = useRef();
  useEffect(() => {
    if (target === 0 || target === '—') { setVal(target); return; }
    const num = parseFloat(target);
    if (isNaN(num)) { setVal(target); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Number.isInteger(num) ? Math.round(ease * num) : (ease * num).toFixed(1));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return <>{val}{suffix}</>;
}

/* ─── SVG Line/Area Chart ────────────────────────────────── */
function LineChart({ data, width = 600, height = 180 }) {
  const [hovered, setHovered] = useState(null);
  const [animate, setAnimate] = useState(false);
  const pathRef = useRef();
  const svgRef = useRef();

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  if (!data || data.length < 2) return null;

  const PAD = { top: 20, right: 24, bottom: 44, left: 36 };
  const W = width - PAD.left - PAD.right;
  const H = height - PAD.top - PAD.bottom;

  const scores = data.map(d => d.score);
  const minS = Math.max(0, Math.min(...scores) - 1);
  const maxS = Math.min(10, Math.max(...scores) + 1);

  const xScale = (i) => (i / (data.length - 1)) * W;
  const yScale = (v) => H - ((v - minS) / (maxS - minS)) * H;

  // Build smooth path
  const points = data.map((d, i) => [xScale(i), yScale(d.score)]);
  const smooth = (pts) => {
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cp1x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * 0.45;
      const cp1y = pts[i][1];
      const cp2x = pts[i + 1][0] - (pts[i + 1][0] - pts[i][0]) * 0.45;
      const cp2y = pts[i + 1][1];
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i + 1][0]} ${pts[i + 1][1]}`;
    }
    return d;
  };

  const linePath = smooth(points);
  const areaPath = linePath + ` L ${points[points.length - 1][0]} ${H} L ${points[0][0]} ${H} Z`;

  // Y-axis gridlines
  const yTicks = [0, 3, 6, 10].filter(v => v >= minS && v <= maxS);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </linearGradient>
          <clipPath id="chart-clip">
            <rect x="0" y="0" width={W} height={H + 2} />
          </clipPath>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <g transform={`translate(${PAD.left},${PAD.top})`}>
          {/* Y gridlines */}
          {yTicks.map(v => (
            <g key={v}>
              <line x1={0} y1={yScale(v)} x2={W} y2={yScale(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
              <text x={-8} y={yScale(v) + 4} textAnchor="end" fill="rgba(255,255,255,0.25)" fontSize="10" fontFamily="Inter, sans-serif">{v}</text>
            </g>
          ))}

          {/* Threshold line (6) */}
          {6 >= minS && 6 <= maxS && (
            <line x1={0} y1={yScale(6)} x2={W} y2={yScale(6)} stroke="rgba(239,68,68,0.35)" strokeWidth="1.5" strokeDasharray="6 3" />
          )}

          {/* Area fill */}
          <path d={areaPath} fill="url(#area-grad)" clipPath="url(#chart-clip)"
            style={{ opacity: animate ? 1 : 0, transition: 'opacity 0.8s ease' }} />

          {/* Line */}
          <path
            ref={pathRef}
            d={linePath}
            fill="none"
            stroke="url(#line-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            clipPath="url(#chart-clip)"
            style={{
              strokeDasharray: animate ? '0' : '2000',
              strokeDashoffset: animate ? '0' : '2000',
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)',
            }}
          />

          {/* Data points + hover zones */}
          {points.map(([x, y], i) => {
            const d = data[i];
            const isHigh = d.prediction === 'YES';
            const isHov = hovered === i;
            return (
              <g key={i}>
                {/* Invisible hover zone */}
                <rect
                  x={x - (W / data.length) / 2} y={0} width={W / data.length} height={H}
                  fill="transparent"
                  onMouseEnter={() => setHovered(i)}
                  style={{ cursor: 'pointer' }}
                />
                {/* Point */}
                <circle cx={x} cy={y} r={isHov ? 7 : 4.5} fill={isHigh ? '#EF4444' : '#10B981'}
                  stroke="rgba(8,8,24,0.9)" strokeWidth="2"
                  style={{ transition: 'r 0.15s', filter: isHov ? `drop-shadow(0 0 8px ${isHigh ? '#EF4444' : '#10B981'})` : 'none' }} />
              </g>
            );
          })}

          {/* Hover tooltip */}
          {hovered !== null && (() => {
            const [x, y] = points[hovered];
            const d = data[hovered];
            const isHigh = d.prediction === 'YES';
            const TW = 130, TH = 54;
            const tx = Math.max(0, Math.min(x - TW / 2, W - TW));
            const ty = y - TH - 14;
            return (
              <g>
                <line x1={x} y1={0} x2={x} y2={H} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <rect x={tx} y={Math.max(0, ty)} width={TW} height={TH} rx="8" fill="rgba(15,15,34,0.96)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <text x={tx + TW / 2} y={Math.max(0, ty) + 18} textAnchor="middle" fill={isHigh ? '#F87171' : '#34D399'} fontSize="13" fontWeight="800" fontFamily="Space Grotesk, sans-serif">
                  AQ: {d.score}/10 · {Math.round(d.probability * 100)}%
                </text>
                <text x={tx + TW / 2} y={Math.max(0, ty) + 34} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="Inter, sans-serif">
                  {fmt(d.createdAt)}
                </text>
                <text x={tx + TW / 2} y={Math.max(0, ty) + 48} textAnchor="middle" fill={isHigh ? '#F87171' : '#34D399'} fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif">
                  {isHigh ? 'High Likelihood' : 'Low Likelihood'}
                </text>
              </g>
            );
          })()}

          {/* X-axis labels */}
          {data.map((d, i) => {
            if (data.length > 8 && i % 2 !== 0) return null;
            return (
              <text key={i} x={xScale(i)} y={H + 18} textAnchor="middle" fill="rgba(255,255,255,0.22)" fontSize="10" fontFamily="Inter, sans-serif">
                {new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </text>
            );
          })}
        </g>

        {/* Threshold label */}
        {6 >= minS && 6 <= maxS && (
          <text x={PAD.left + W + 4} y={PAD.top + yScale(6) + 4} fill="rgba(239,68,68,0.55)" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="700">AQ≥6</text>
        )}
      </svg>
    </div>
  );
}

/* ─── Donut Chart ────────────────────────────────────────── */
function DonutChart({ high, low, animate }) {
  const [displayHigh, setDisplayHigh] = useState(0);
  const rafRef = useRef();

  useEffect(() => {
    if (!animate || high + low === 0) return;
    let start = null;
    const dur = 900;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayHigh(Math.round(ease * high));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate, high, low]);

  const total = high + low;
  if (total === 0) return <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 13, padding: 20 }}>No data yet</div>;

  const CX = 80, CY = 80, R = 60, STROKE = 14;
  const CIRCUM = 2 * Math.PI * R;
  const highFrac = displayHigh / total;
  const highArc = highFrac * CIRCUM;
  const GAP = 4;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        <defs>
          <filter id="donut-glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={STROKE} />
        {/* Low arc (green, full circle first) */}
        {low > 0 && (
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#10B981" strokeWidth={STROKE}
            strokeDasharray={`${CIRCUM - highArc - GAP} ${highArc + GAP}`}
            strokeDashoffset={-(highArc + GAP / 2)}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${CX}px ${CY}px`, transition: 'stroke-dasharray 0.9s cubic-bezier(0.16,1,0.3,1)', filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.6))' }}
          />
        )}
        {/* High arc (red) */}
        {displayHigh > 0 && (
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#EF4444" strokeWidth={STROKE}
            strokeDasharray={`${highArc - GAP / 2} ${CIRCUM - highArc + GAP / 2}`}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${CX}px ${CY}px`, transition: 'stroke-dasharray 0.9s cubic-bezier(0.16,1,0.3,1)', filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.6))' }}
          />
        )}
        {/* Center */}
        <text x={CX} y={CY - 8} textAnchor="middle" fill="#F1F0FF" fontSize="22" fontWeight="800" fontFamily="Space Grotesk, sans-serif">{total}</text>
        <text x={CX} y={CY + 10} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="Inter, sans-serif" letterSpacing="0.06em">TOTAL</text>
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[[`${high}`, '#EF4444', 'High Likelihood', `${total ? Math.round(high / total * 100) : 0}%`],
          [`${low}`, '#10B981', 'Low Likelihood', `${total ? Math.round(low / total * 100) : 0}%`]].map(([count, color, label, pct]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}80`, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 22, color }}>{count}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{pct}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Bar Chart (AQ distribution) ───────────────────────── */
function BarDistribution({ data, animate }) {
  const bins = Array.from({ length: 11 }, (_, i) => ({ score: i, count: 0 }));
  data.forEach(r => { if (r.score >= 0 && r.score <= 10) bins[r.score].count++; });
  const maxCount = Math.max(...bins.map(b => b.count), 1);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 80 }}>
      {bins.map(({ score, count }) => {
        const isHigh = score >= 6;
        const pct = (count / maxCount) * 100;
        return (
          <div key={score} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }} title={`Score ${score}: ${count} result${count !== 1 ? 's' : ''}`}>
            <div style={{
              width: '100%', height: `${animate ? pct : 0}%`, minHeight: count > 0 ? 4 : 0,
              background: isHigh ? 'linear-gradient(to top, #EF4444, #F97316)' : 'linear-gradient(to top, #7C3AED, #06B6D4)',
              borderRadius: '3px 3px 0 0', transition: `height 0.7s cubic-bezier(0.16,1,0.3,1) ${score * 40}ms`,
              boxShadow: count > 0 ? `0 0 10px ${isHigh ? 'rgba(239,68,68,0.4)' : 'rgba(124,58,237,0.4)'}` : 'none',
            }} />
            <span style={{ fontSize: 10, color: score >= 6 ? 'rgba(248,113,113,0.6)' : 'rgba(255,255,255,0.2)', fontWeight: 600 }}>{score}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── History Table ──────────────────────────────────────── */
function HistoryTable({ results }) {
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState(-1); // -1 = desc
  const [filterPred, setFilterPred] = useState('all');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 8;

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => -d);
    else { setSortBy(col); setSortDir(-1); }
    setPage(0);
  };

  const filtered = results.filter(r => filterPred === 'all' || r.prediction === filterPred);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date') return sortDir * (new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === 'score') return sortDir * (a.score - b.score);
    if (sortBy === 'prob') return sortDir * (a.probability - b.probability);
    return 0;
  });
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <span style={{ opacity: 0.2 }}>↕</span>;
    return <span style={{ color: '#A78BFA' }}>{sortDir > 0 ? '↑' : '↓'}</span>;
  };

  const thStyle = { padding: '12px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' };
  const tdStyle = { padding: '15px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' };

  if (results.length === 0) return (
    <div style={{ padding: '64px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 52, marginBottom: 18, opacity: 0.25 }}>🧠</div>
      <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: 28, fontSize: 15 }}>No screenings yet. Take your first one!</p>
      <Link to="/quiz" className="btn-primary" style={{ padding: '13px 30px' }}>🧠 Start Screening</Link>
    </div>
  );

  return (
    <>
      {/* Filter tabs + result count */}
      <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['all', 'All', results.length], ['YES', '⚠️ High', results.filter(r => r.prediction === 'YES').length], ['NO', '✅ Low', results.filter(r => r.prediction === 'NO').length]].map(([val, label, cnt]) => (
            <button key={val} onClick={() => { setFilterPred(val); setPage(0); }} style={{
              padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid',
              background: filterPred === val ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
              borderColor: filterPred === val ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.08)',
              color: filterPred === val ? '#A78BFA' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.2s',
            }}>{label} ({cnt})</button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', fontWeight: 500 }}>
          {sorted.length} result{sorted.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              <th style={thStyle}>Status</th>
              <th style={{ ...thStyle, textAlign: 'center' }} onClick={() => handleSort('score')}>AQ Score <SortIcon col="score" /></th>
              <th style={{ ...thStyle, textAlign: 'center' }} onClick={() => handleSort('prob')}>Probability <SortIcon col="prob" /></th>
              <th style={thStyle} onClick={() => handleSort('date')}>Date <SortIcon col="date" /></th>
              <th style={thStyle}>Method</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r, i) => {
              const isHigh = r.prediction === 'YES';
              return (
                <tr key={r.id} style={{ transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                  {/* Status */}
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, background: isHigh ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', flexShrink: 0 }}>
                        {isHigh ? '⚠️' : '✅'}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 13, color: isHigh ? '#F87171' : '#34D399', whiteSpace: 'nowrap' }}>
                        {isHigh ? 'High' : 'Low'} Likelihood
                      </span>
                    </div>
                  </td>

                  {/* Score */}
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 3 }}>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 20, color: isHigh ? '#EF4444' : '#10B981' }}>{r.score}</span>
                      <div style={{ width: 40, height: 4, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(r.score / 10) * 100}%`, background: isHigh ? '#EF4444' : '#10B981', borderRadius: 100 }} />
                      </div>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>/ 10</span>
                    </div>
                  </td>

                  {/* Probability */}
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: isHigh ? '#F87171' : '#34D399' }}>
                      {Math.round(r.probability * 100)}%
                    </span>
                  </td>

                  {/* Date */}
                  <td style={tdStyle}>
                    <div style={{ fontSize: 13, color: 'rgba(241,240,255,0.55)', fontWeight: 500, whiteSpace: 'nowrap' }}>{fmt(r.createdAt)}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>{new Date(r.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>

                  {/* Method */}
                  <td style={tdStyle}>
                    <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 100, fontWeight: 600,
                      background: r.fallback ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                      color: r.fallback ? '#FCD34D' : '#34D399',
                      border: `1px solid ${r.fallback ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'}`,
                    }}>
                      {r.fallback ? '🔁 Rule-based' : '🤖 AI Model'}
                    </span>
                  </td>

                  {/* Action */}
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <Link to={`/results/${r.id}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 9,
                      background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
                      color: '#A78BFA', fontSize: 12, fontWeight: 600, textDecoration: 'none',
                      transition: 'all 0.18s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.22)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)'; }}
                    >
                      View
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{
            padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
            color: page === 0 ? 'rgba(255,255,255,0.2)' : '#F1F0FF', cursor: page === 0 ? 'not-allowed' : 'pointer',
            fontSize: 13, fontWeight: 500, transition: 'all 0.18s',
          }}>← Prev</button>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
            Page {page + 1} of {totalPages}
          </span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} style={{
            padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
            color: page >= totalPages - 1 ? 'rgba(255,255,255,0.2)' : '#F1F0FF', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
            fontSize: 13, fontWeight: 500, transition: 'all 0.18s',
          }}>Next →</button>
        </div>
      )}
    </>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────── */
export default function Dashboard() {
  const { user, token } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    api.getResults(token)
      .then(r => { setResults(r); setTimeout(() => setAnimate(true), 400); })
      .finally(() => setLoading(false));
  }, [token]);

  const highCount = results.filter(r => r.prediction === 'YES').length;
  const lowCount = results.length - highCount;
  const avgScore = results.length ? (results.reduce((s, r) => s + (r.score ?? 0), 0) / results.length).toFixed(1) : '—';
  const lastResult = results[results.length - 1];
  const trend = results.length >= 2 ? results[results.length - 1].score - results[results.length - 2].score : null;
  const chronological = [...results].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)' }}>
      <Navbar />
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 200, background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }} />

      <div style={{ maxWidth: 1020, margin: '0 auto', padding: '108px 20px 72px' }}>

        {/* ══ HEADER ══════════════════════════════════════════ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>Your Dashboard</p>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(26px, 5vw, 40px)', color: '#F1F0FF', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
              Welcome back,{' '}
              <span style={{ background: 'linear-gradient(135deg, #A78BFA, #7C3AED, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {user?.name?.split(' ')[0] || 'User'}
              </span> 👋
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 8 }}>
              {results.length === 0
                ? 'Start your first screening to see your analytics here.'
                : `You've completed ${results.length} screening${results.length !== 1 ? 's' : ''}. ${lastResult ? `Last screening: ${fmt(lastResult.createdAt)}.` : ''}`}
            </p>
          </div>
          <Link to="/quiz" className="btn-primary" style={{ padding: '13px 26px', fontSize: 14, flexShrink: 0, boxShadow: '0 0 32px rgba(124,58,237,0.4)' }}>
            🧠 New Screening
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>

        {/* ══ STAT CARDS ══════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { icon: '📊', label: 'Total Screenings', value: results.length, suffix: '', color: '#7C3AED', bar: null },
            { icon: '⚠️', label: 'High Likelihood', value: highCount, suffix: '', color: '#EF4444', bar: null },
            { icon: '✅', label: 'Low Likelihood', value: lowCount, suffix: '', color: '#10B981', bar: null },
            { icon: '📈', label: 'Avg AQ Score', value: avgScore, suffix: '/10', color: '#F59E0B', bar: null },
            ...(trend !== null ? [{ icon: trend > 0 ? '📉' : '📈', label: 'Score Trend', value: `${trend > 0 ? '+' : ''}${trend}`, suffix: '', color: trend > 0 ? '#EF4444' : '#10B981', bar: null }] : []),
          ].map(({ icon, label, value, suffix, color }) => (
            <div key={label} style={{
              background: 'rgba(12,12,28,0.95)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20, padding: '22px 20px', position: 'relative', overflow: 'hidden',
              transition: 'transform 0.25s, box-shadow 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.4), 0 0 24px ${color}18`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color, opacity: 0.75 }} />
              <div style={{ position: 'absolute', right: 16, top: 16, fontSize: 22, opacity: 0.15 }}>{icon}</div>
              <div style={{ fontSize: 19, marginBottom: 14 }}>{icon}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(26px,4vw,36px)', color, lineHeight: 1, letterSpacing: '-0.02em' }}>
                {animate && typeof value === 'number' ? <Counter target={value} /> : value}
                {suffix && <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>{suffix}</span>}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ══ CHARTS ROW ══════════════════════════════════════ */}
        {results.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: results.length >= 2 ? '1fr auto' : '1fr', gap: 16, marginBottom: 16, alignItems: 'stretch' }}>

            {/* Line chart — only if 2+ results */}
            {chronological.length >= 2 && (
              <div style={{ background: 'rgba(12,12,28,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 22, padding: '26px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 17, color: '#F1F0FF', marginBottom: 4 }}>
                      📈 AQ Score Over Time
                    </h2>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', fontWeight: 500 }}>Hover over data points for details</p>
                  </div>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    {[['rgba(239,68,68,0.5)', 'AQ ≥ 6 threshold'], ['url(#line-grad)', '— Score trend']].map(([c, l]) => (
                      <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                        <div style={{ width: 20, height: 2.5, background: c, borderRadius: 2 }} /> {l}
                      </div>
                    ))}
                  </div>
                </div>
                <LineChart data={chronological} />
              </div>
            )}

            {/* Donut + distribution — side panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: chronological.length >= 2 ? 240 : 'unset', width: chronological.length >= 2 ? 280 : '100%' }}>

              {/* Donut */}
              <div style={{ background: 'rgba(12,12,28,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 22, padding: '24px 20px', flex: 1 }}>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 15, color: '#F1F0FF', marginBottom: 20 }}>
                  🍩 Result Split
                </h2>
                <DonutChart high={highCount} low={lowCount} animate={animate} />
              </div>

              {/* Score distribution */}
              <div style={{ background: 'rgba(12,12,28,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 22, padding: '24px 20px' }}>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 15, color: '#F1F0FF', marginBottom: 6 }}>
                  📊 Score Distribution
                </h2>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginBottom: 16, fontWeight: 500 }}>AQ score frequency (0–10)</p>
                <BarDistribution data={results} animate={animate} />
                <div style={{ display: 'flex', gap: 14, marginTop: 12, justifyContent: 'center' }}>
                  {[['#EF4444', 'High (≥6)'], ['#7C3AED', 'Low (<6)']].map(([c, l]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} /> {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ HISTORY TABLE ═══════════════════════════════════ */}
        <div style={{ background: 'rgba(12,12,28,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 22, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '22px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 18, color: '#F1F0FF', marginBottom: 4 }}>
                🕐 Screening History
              </h2>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>Click column headers to sort · Filter by result type</p>
            </div>
            <Link to="/quiz" className="btn-ghost" style={{ padding: '9px 18px', fontSize: 13 }}>
              + New Screening
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: 56, textAlign: 'center' }}>
              <div style={{ width: 42, height: 42, border: '3px solid rgba(124,58,237,0.15)', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'dspin 0.85s linear infinite', margin: '0 auto 16px' }} />
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>Loading your results...</p>
              <style>{`@keyframes dspin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <HistoryTable results={results} />
          )}
        </div>

        {/* ══ RESOURCES ═══════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12 }}>
          {[
            { href: 'https://autismsociety.org', emoji: '🤝', title: 'Autism Society of America', desc: 'National advocacy & support resources' },
            { href: 'https://link.springer.com/article/10.1007/s12559-020-09743-3', emoji: '📄', title: 'Research Paper', desc: 'Springer 2020 clinical validation study' },
            { href: '/about', emoji: '📚', title: 'About ASD', desc: 'Learn about autism spectrum traits' },
            { href: 'https://www.autism.org.uk/advice-and-guidance/topics/diagnosis/before-diagnosis/getting-a-diagnosis-the-processes-explained', emoji: '🏥', title: 'Diagnosis Guide', desc: 'What happens during a formal assessment' },
          ].map(({ href, emoji, title, desc }) => (
            <a key={title} href={href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer"
              style={{ background: 'rgba(12,12,28,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', transition: 'all 0.22s', color: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: 26, flexShrink: 0 }}>{emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#F1F0FF', marginBottom: 3, lineHeight: 1.3 }}>{title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', lineHeight: 1.4 }}>{desc}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
