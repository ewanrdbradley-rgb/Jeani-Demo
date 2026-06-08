import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

// ─── Brand ───────────────────────────────────────────────────────
const C = {
  blue: '#112378',
  sand: '#fbeccf',
  amber: '#F5A000',
  green: '#00E87B',
}

const TABS = ['THE APP', 'THE SCIENCE', 'HOW IT WORKS', 'PLANS']

// ─── Grainy noise overlay — applied over every section ────────────
// SVG feTurbulence approach: renders as a semi-transparent grain layer
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

function GrainOverlay({ opacity = 0.08, blendMode = 'overlay' }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '200px 200px',
      opacity,
      mixBlendMode: blendMode,
    }} />
  )
}

// ─── Radial glow orb ──────────────────────────────────────────────
function GlowOrb({ color, size = 400, x = '50%', y = '40%', opacity = 0.35 }) {
  return (
    <div style={{
      position: 'absolute', pointerEvents: 'none', zIndex: 1,
      left: x, top: y, transform: 'translate(-50%,-50%)',
      width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity, filter: 'blur(40px)',
    }} />
  )
}

// ─── Feature definitions ──────────────────────────────────────────
const FEATURES = [
  {
    id: 'home', label: 'Home', icon: '◆',
    baseBg: '#030810',
    gradImg: '/gradients/Track Grad-08.png',
    orbColor: '#1a40c0', orbColor2: C.amber,
    accent: C.amber,
  },
  {
    id: 'motion', label: 'Motion', icon: '▶',
    baseBg: '#040a04',
    gradImg: '/gradients/Track Grad-09.png',
    orbColor: '#2a5a10', orbColor2: C.amber,
    accent: C.amber,
  },
  {
    id: 'goal', label: 'Motion Goal', icon: '◎',
    baseBg: '#030810',
    gradImg: '/gradients/Track Grad-10.png',
    orbColor: '#0a3050', orbColor2: C.green,
    accent: C.green,
  },
  {
    id: 'spotlight', label: 'Spotlight', icon: '⊕',
    baseBg: '#080300',
    gradImg: '/gradients/Track Grad-11.png',
    orbColor: '#6b2000', orbColor2: C.green,
    accent: C.green,
  },
  {
    id: 'body', label: 'Body', icon: '◈',
    baseBg: '#030510',
    gradImg: '/gradients/Track Grad-13.png',
    orbColor: '#112378', orbColor2: C.sand,
    accent: C.sand,
  },
  {
    id: 'chat', label: 'Ask Jeani', icon: '◉',
    baseBg: '#040210',
    gradImg: '/gradients/Track Grad-14.png',
    orbColor: '#1a0a5a', orbColor2: C.sand,
    accent: C.sand,
  },
  {
    id: 'streak', label: 'Streak', icon: '🔥',
    baseBg: '#0a0300',
    gradImg: '/gradients/Track Grad-08.png',
    orbColor: '#8b3000', orbColor2: C.amber,
    accent: C.amber,
  },
]

// ─── Metric bar ───────────────────────────────────────────────────
function MetricBar({ label, value, color, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.4 }} style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', fontFamily: 'HostGrotesk', marginBottom: 3 }}>{label}</div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ delay: delay + 0.2, duration: 0.9, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: 2 }} />
      </div>
    </motion.div>
  )
}

// ─── Phone frame ──────────────────────────────────────────────────
function PhoneMockup({ children }) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: 228, height: 445,
        borderRadius: 40,
        border: '1.5px solid rgba(255,255,255,0.18)',
        background: '#080c1a',
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.85), 0 0 0 0.5px rgba(255,255,255,0.06), inset 0 0 0 0.5px rgba(255,255,255,0.04)',
        position: 'relative', flexShrink: 0,
      }}>
      {/* Dynamic island */}
      <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 90, height: 26, background: '#000', borderRadius: 20, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1a1a1a', border: '1px solid #333' }} />
      </div>
      <div style={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</div>
    </motion.div>
  )
}

// ─── HOME mockup ──────────────────────────────────────────────────
function HomeMockup() {
  return (
    <div style={{ padding: '50px 13px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 9, background: 'linear-gradient(180deg,#0d1440 0%,#060a20 100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <img src="/logos/Jeani J White.png" style={{ height: 24 }} alt="J" />
        <div style={{ width: 24, height: 24, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.25)' }} />
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '16px 14px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
        <div style={{ fontSize: 58, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: C.amber, lineHeight: 1 }}>74</div>
        <div style={{ fontSize: 18, fontFamily: 'CrimsonPro, serif', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>Motion</div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '10px 0' }} />
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>74/100 — solid and ready to push.<br/>Left hamstring up +45.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 11 }}>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', marginBottom: 5 }}>▶ Daily Recap</div>
          <div style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>June 7</div>
          <div style={{ fontSize: 9, color: C.amber, marginTop: 5 }}>🔥 8 day streak</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 11 }}>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>⊕ Spotlight</div>
          <div style={{ fontSize: 10, color: '#fff' }}>Left Hamstring</div>
          <div style={{ fontSize: 13, color: C.green, marginTop: 5, fontWeight: 700 }}>+45 pts ↗</div>
        </div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>+</span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>Log Activity</span>
      </div>
      <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 14, padding: '9px 13px', textAlign: 'center' }}>
        <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.25)', letterSpacing: 2.5 }}>MOTION GOAL</div>
        <div style={{ fontSize: 15, color: '#fff', fontWeight: 700 }}>Today</div>
      </div>
    </div>
  )
}

// ─── MOTION mockup ────────────────────────────────────────────────
function MotionMockup() {
  const metrics = [
    { label: 'Joint Changes', value: 82, color: C.green },
    { label: 'Symmetry', value: 78, color: C.green },
    { label: 'Mobility', value: 62, color: C.amber },
    { label: 'Movement Diversity', value: 55, color: C.amber },
    { label: 'Step Volume', value: 48, color: C.amber },
  ]
  const pts = [78, 80, 75, 73, 79, 74, 74]
  const w = 188, h = 55
  const coords = pts.map((v, i) => `${(i / (pts.length - 1)) * w},${h - ((v - 68) / 20) * h}`)
  return (
    <div style={{ padding: '50px 13px 14px', height: '100%', background: 'linear-gradient(180deg,#060e04 0%,#030703 100%)', overflowY: 'auto' }}>
      <div style={{ fontSize: 13, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: '#fff', marginBottom: 2 }}>Motion Score</div>
      <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>Today</div>
      <div style={{ fontSize: 50, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: C.amber, lineHeight: 1, marginBottom: 12 }}>74</div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 12, marginBottom: 9 }}>
        {metrics.map((m, i) => <MetricBar key={m.label} {...m} delay={i * 0.09} />)}
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 9 }}>
        {['7 Days', '30 Days', '90 Days'].map((t, i) => (
          <div key={t} style={{ flex: 1, background: i === 0 ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.04)', borderRadius: 20, padding: '4px 0', textAlign: 'center', fontSize: 8, color: '#fff', border: '1px solid rgba(255,255,255,0.06)' }}>{t}</div>
        ))}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '12px 12px 8px' }}>
        <svg width={w} height={h} style={{ display: 'block', overflow: 'visible', marginBottom: 8 }}>
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={C.amber} stopOpacity="0.5" />
              <stop offset="100%" stopColor={C.amber} stopOpacity="1" />
            </linearGradient>
          </defs>
          <polyline points={coords.join(' ')} fill="none" stroke="url(#lineGrad)" strokeWidth="1.5" strokeLinejoin="round" />
          {coords.map((c, i) => {
            const [x, y] = c.split(',').map(Number)
            return <circle key={i} cx={x} cy={y} r="2.5" fill={C.amber} />
          })}
        </svg>
        {[['Average', '76'], ['Highest', '81'], ['Lowest', '73'], ['Change', '–4']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.5)', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span>{k}</span><span style={{ color: '#fff', fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── GOAL mockup ──────────────────────────────────────────────────
function GoalMockup() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      let v = 0
      const iv = setInterval(() => { v += 2; setPct(Math.min(v, 74)); if (v >= 74) clearInterval(iv) }, 18)
      return () => clearInterval(iv)
    }, 500)
    return () => clearTimeout(t)
  }, [])
  return (
    <div style={{ padding: '50px 12px 14px', height: '100%', background: 'linear-gradient(180deg,#040810 0%,#020508 100%)', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.28)', letterSpacing: 2.5 }}>MOTION GOAL</div>
        <div style={{ fontSize: 18, color: '#fff', fontWeight: 700 }}>Today</div>
      </div>
      <div style={{ textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ fontSize: 60, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{pct}%</div>
        <div style={{ marginTop: 12, width: '80%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
          <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.05 }}
            style={{ height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 2 }} />
        </div>
      </div>
      <div style={{ background: 'rgba(0,232,123,0.08)', border: `1px solid rgba(0,232,123,0.2)`, borderRadius: 14, padding: '10px 12px' }}>
        <div style={{ fontSize: 10, color: C.green, fontStyle: 'italic', fontWeight: 600, marginBottom: 3 }}>⚡ you've got motion</div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)' }}>just <span style={{ color: C.green, fontWeight: 700 }}>26%</span> from your daily goal</div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 7.5, color: 'rgba(255,255,255,0.28)', marginBottom: 7 }}>
          <span>LAST 30 DAYS</span><span>May 10 – Jun 8</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: '1', borderRadius: 3, background: i < 22 ? `rgba(0,232,123,${0.12 + (i % 4) * 0.12})` : 'rgba(255,255,255,0.04)', fontSize: 6, color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {i + 10}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── SPOTLIGHT mockup ─────────────────────────────────────────────
function SpotlightMockup() {
  const pts = [5, 28, 55, 61, 58, 57, 57]
  const w = 185, h = 65
  const coords = pts.map((v, i) => `${(i / (pts.length - 1)) * w},${h - ((v - 0) / 65) * h}`)
  return (
    <div style={{ padding: '50px 12px 14px', height: '100%', background: 'linear-gradient(180deg,#100500 0%,#060200 100%)', display: 'flex', flexDirection: 'column', gap: 9 }}>
      <div style={{ fontSize: 22, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: '#fff' }}>Spotlight</div>
      <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: 9, fontSize: 8.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, border: '1px solid rgba(255,255,255,0.06)' }}>
        Based on your recent movement patterns and symptoms, Jeani has identified these areas as potential weak points.
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 13, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>Left Hamstring</div>
            <div style={{ fontSize: 9, color: C.green, marginTop: 2 }}>Improving</div>
          </div>
          <div style={{ fontSize: 20, color: C.green, fontWeight: 700, fontFamily: 'CrimsonPro, serif' }}>+45 ↑</div>
        </div>
        <svg width={w} height={h} style={{ display: 'block', marginBottom: 11, overflow: 'visible' }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <polyline points={coords.join(' ')} fill="none" stroke={C.green} strokeWidth="2" strokeLinejoin="round" filter="url(#glow)" />
          {coords.map((c, i) => { const [x, y] = c.split(',').map(Number); return <circle key={i} cx={x} cy={y} r="3" fill={C.green} /> })}
        </svg>
        <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.28)', letterSpacing: 1.5, marginBottom: 6 }}>ABOUT</div>
        <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 9 }}>The muscles along the back of your thigh. They bend your knee and drive your hips through each stride.</div>
        <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.28)', letterSpacing: 1.5, marginBottom: 5 }}>STRETCH IT</div>
        {['Seated forward fold', 'Standing toe-touch', 'Lying single-leg stretch'].map(s => (
          <div key={s} style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.6)', paddingLeft: 9, marginBottom: 3.5 }}>• {s}</div>
        ))}
      </div>
    </div>
  )
}

// ─── BODY mockup ──────────────────────────────────────────────────
function BodyMockup() {
  const zones = [
    { label: 'Left Hamstring', status: 'Improving', color: C.green, score: '+45' },
    { label: 'Right Knee', status: 'Watch closely', color: C.amber, score: '–12' },
    { label: 'Lower Back', status: 'Stable', color: 'rgba(255,255,255,0.4)', score: '0' },
    { label: 'Left Shoulder', status: 'Improving', color: C.green, score: '+8' },
    { label: 'Right Hip', status: 'Needs attention', color: '#ff6b6b', score: '–23' },
  ]
  return (
    <div style={{ padding: '50px 12px 14px', height: '100%', background: 'linear-gradient(180deg,#040614 0%,#020310 100%)', display: 'flex', flexDirection: 'column', gap: 9 }}>
      <div style={{ fontSize: 22, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: '#fff' }}>Body</div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>Your movement map — updated daily</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {zones.map((z, i) => (
          <motion.div key={z.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.09 }}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>{z.label}</div>
              <div style={{ fontSize: 8.5, color: z.color, marginTop: 2 }}>{z.status}</div>
            </div>
            <div style={{ fontSize: 15, color: z.color, fontWeight: 700, fontFamily: 'CrimsonPro, serif' }}>{z.score}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── CHAT mockup ──────────────────────────────────────────────────
function ChatMockup() {
  const messages = [
    { from: 'user', text: 'Why is my left hamstring flagged?' },
    { from: 'jeani', text: 'Your left hamstring jumped +45 points this week — impressive, but rapid gains can signal compensation. Worth watching over the next few days.' },
    { from: 'user', text: 'What should I do today?' },
    { from: 'jeani', text: 'Motion score 74 — you\'re ready to push. A moderate run works, but add a hamstring stretch routine after to balance the load.' },
  ]
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (shown >= messages.length) return
    const t = setTimeout(() => setShown(s => s + 1), shown === 0 ? 400 : 1100)
    return () => clearTimeout(t)
  }, [shown])
  return (
    <div style={{ padding: '50px 11px 14px', height: '100%', background: 'linear-gradient(180deg,#08102a 0%,#040818 100%)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <img src="/logos/Jeani J White.png" style={{ height: 19 }} alt="J" />
        <span style={{ fontSize: 13, color: '#fff', fontWeight: 700, fontFamily: 'CrimsonPro, serif' }}>Ask Jeani</span>
        <div style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
        {messages.slice(0, shown).map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            style={{
              alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%',
              background: m.from === 'user' ? 'rgba(17,35,120,0.5)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${m.from === 'user' ? 'rgba(17,35,120,0.8)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: m.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              padding: '8px 11px', fontSize: 8.5, color: '#fff', lineHeight: 1.6,
            }}>
            {m.text}
          </motion.div>
        ))}
      </div>
      <div style={{ marginTop: 11, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.28)' }}>Ask anything…</span>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.sand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: C.blue, fontWeight: 700 }}>↑</div>
      </div>
    </div>
  )
}

// ─── STREAK mockup ────────────────────────────────────────────────
function StreakMockup() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  return (
    <div style={{ padding: '50px 12px 14px', height: '100%', background: 'linear-gradient(180deg,#120500 0%,#060200 100%)', display: 'flex', flexDirection: 'column', gap: 11 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, lineHeight: 1 }}>🔥</div>
        <div style={{ fontSize: 54, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: C.amber, lineHeight: 1 }}>8</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>day streak</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 13 }}>
        <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.28)', letterSpacing: 2, marginBottom: 10 }}>THIS WEEK</div>
        <div style={{ display: 'flex', gap: 7, justifyContent: 'space-between' }}>
          {days.map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: i < 6 ? C.amber : 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: i < 6 ? '#000' : 'rgba(255,255,255,0.2)', boxShadow: i < 6 ? `0 0 10px ${C.amber}55` : 'none' }}>
                {i < 6 ? '✓' : ''}
              </div>
              <span style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.35)' }}>{d}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: 'rgba(245,160,0,0.08)', border: `1px solid rgba(245,160,0,0.18)`, borderRadius: 14, padding: '13px 14px', textAlign: 'center' }}>
        <div style={{ fontSize: 11.5, color: C.amber, fontWeight: 600, fontStyle: 'italic', fontFamily: 'CrimsonPro, serif', lineHeight: 1.5 }}>
          "Consistency is the only metric that compounds."
        </div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '11px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {[['Best', '14 days'], ['This month', '22/31'], ['All time', '8 🔥']].map(([k, v]) => (
            <div key={k} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#fff', fontWeight: 700, fontFamily: 'CrimsonPro, serif' }}>{v}</div>
              <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>{k}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const MOCKUPS = { home: HomeMockup, motion: MotionMockup, goal: GoalMockup, spotlight: SpotlightMockup, body: BodyMockup, chat: ChatMockup, streak: StreakMockup }

const SUBCOPY = {
  home: 'Your daily motion, at a glance.',
  motion: 'Five dimensions of how your body moves.',
  goal: 'A daily target built around you.',
  spotlight: 'Jeani finds what needs your attention before you feel it.',
  body: 'A complete picture of your physical self.',
  chat: 'Your personal movement coach, always on.',
  streak: 'Consistency is the only metric that compounds.',
}

// ─── THE APP ──────────────────────────────────────────────────────
function TheApp() {
  const [active, setActive] = useState(0)
  const feat = FEATURES[active]
  const Mockup = MOCKUPS[feat.id]

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      {/* Left sub-nav */}
      <div style={{ width: 98, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3, padding: '0 10px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(16px)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        {FEATURES.map((f, i) => (
          <button key={f.id} onClick={() => setActive(i)}
            style={{ background: i === active ? 'rgba(255,255,255,0.08)' : 'transparent', border: 'none', cursor: 'pointer', borderRadius: 8, padding: '8px 6px', color: i === active ? '#fff' : 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'HostGrotesk', fontWeight: i === active ? 600 : 400, textAlign: 'left', transition: 'all 0.2s', borderLeft: `2px solid ${i === active ? C.sand : 'transparent'}` }}>
            <span style={{ marginRight: 5, fontSize: 8 }}>{f.icon}</span>{f.label}
          </button>
        ))}
      </div>

      {/* Main panel */}
      <AnimatePresence mode="wait">
        <motion.div key={feat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
          style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: feat.baseBg }}>

          {/* Track Grad image background — blended */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img src={feat.gradImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45, mixBlendMode: 'screen' }} />
          </div>

          {/* Orbs */}
          <GlowOrb color={feat.orbColor} size={500} x="40%" y="35%" opacity={0.5} />
          <GlowOrb color={feat.orbColor2} size={260} x="70%" y="65%" opacity={0.2} />

          {/* Grain */}
          <GrainOverlay opacity={0.12} blendMode="overlay" />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 40px', gap: 18 }}>
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 42, fontWeight: 700, color: '#fff', letterSpacing: -1, lineHeight: 1, textShadow: '0 2px 30px rgba(0,0,0,0.8)' }}>{feat.label}</div>
            </motion.div>

            <PhoneMockup><Mockup /></PhoneMockup>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
              style={{ fontFamily: 'CrimsonPro, serif', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.55)', textAlign: 'center' }}>
              {SUBCOPY[feat.id]}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── THE SCIENCE ──────────────────────────────────────────────────
function TheScience() {
  const stats = [
    { num: '5', label: '5 Movement Dimensions', desc: 'Joint Changes · Symmetry · Mobility · Movement Diversity · Step Volume' },
    { num: '⌚', label: 'Apple Watch Integration', desc: 'Real-time biometric data, always with you on your wrist' },
    { num: 'STAB', label: 'Science & Technical Advisory Board', desc: 'Amy Arendelle · Jacob Rothman · Dr. Blake Boggess' },
  ]
  return (
    <div style={{ width: '100%', height: '100%', background: '#f2ede4', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay opacity={0.05} blendMode="multiply" />
      <div style={{ flex: 1, display: 'flex', zIndex: 1 }}>
        {/* Left */}
        <div style={{ width: '38%', background: '#060c20', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: 40 }}>
          <img src="/gradients/Track Grad-10.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, mixBlendMode: 'screen' }} />
          <GlowOrb color="#1a40c0" size={400} x="50%" y="40%" opacity={0.55} />
          <GrainOverlay opacity={0.13} blendMode="overlay" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ position: 'relative', zIndex: 4 }}>
            <img src="/logos/Jeani Wordmark White.png" style={{ height: 30, marginBottom: 22 }} alt="Jeani" />
            <div style={{ fontFamily: 'CrimsonPro, serif', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
              "Built with leading movement scientists and physicians to deliver insights athletes and everyday movers can actually trust."
            </div>
          </motion.div>
        </div>

        {/* Right */}
        <div style={{ flex: 1, padding: '48px 52px 28px', display: 'flex', flexDirection: 'column' }}>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 42, fontWeight: 700, color: C.blue, lineHeight: 1.05, marginBottom: 14 }}>
              Critically acclaimed.<br />Backed by science.
            </div>
            <div style={{ fontSize: 13, color: '#666', lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
              Jeani combines clinical-grade movement analysis with personalised AI coaching — turning daily data into decisions that protect your body and elevate your performance.
            </div>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.14, duration: 0.5 }}
                style={{ background: C.blue, borderRadius: 16, padding: '16px 22px', display: 'flex', gap: 20, alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <GrainOverlay opacity={0.08} blendMode="overlay" />
                <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 22, fontWeight: 700, color: C.sand, minWidth: 48, lineHeight: 1 }}>{s.num}</div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 11, color: C.sand, fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: 'rgba(251,236,207,0.6)', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ background: C.blue, padding: '15px 52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', zIndex: 1 }}>
        <GrainOverlay opacity={0.1} blendMode="overlay" />
        <div style={{ fontFamily: 'CrimsonPro, serif', fontStyle: 'italic', fontSize: 14, color: C.sand, position: 'relative', zIndex: 1 }}>
          Accurate by design — Jeani reads movement where it matters most.
        </div>
        <img src="/logos/Jeani Wordmark Sand White.png" style={{ height: 20, position: 'relative', zIndex: 1 }} alt="Jeani" />
      </div>
    </div>
  )
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: '01', title: 'Download Jeani', desc: 'Available on the App Store. Set up your profile and movement baseline in minutes.', icon: '📱' },
    { num: '02', title: 'Sync Apple Watch', desc: 'Jeani connects to Apple Watch and reads your movement in real time — no extra hardware required.', icon: '⌚' },
    { num: '03', title: 'Get Your Score', desc: 'Every day: Motion score, Spotlight insights, and a personalised goal — so you always know where you stand.', icon: '◆' },
  ]
  return (
    <div style={{ width: '100%', height: '100%', background: '#050a18', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 60px' }}>
      <img src="/gradients/Track Grad-09.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35, mixBlendMode: 'screen' }} />
      <GlowOrb color="#112378" size={600} x="50%" y="50%" opacity={0.5} />
      <GrainOverlay opacity={0.12} blendMode="overlay" />

      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 48, position: 'relative', zIndex: 4 }}>
        <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 44, fontWeight: 700, color: '#fff', lineHeight: 1 }}>How it works</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>From download to daily insight — three steps.</div>
      </motion.div>

      <div style={{ display: 'flex', gap: 22, width: '100%', maxWidth: 860, position: 'relative', zIndex: 4 }}>
        {steps.map((s, i) => (
          <motion.div key={s.num} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.18, duration: 0.6 }}
            style={{ flex: 1, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', borderRadius: 24, padding: 30, border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}>
            <GrainOverlay opacity={0.07} blendMode="overlay" />
            <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
            <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 12, color: C.sand, fontWeight: 600, marginBottom: 7, letterSpacing: 1 }}>{s.num}</div>
            <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 12, lineHeight: 1.1 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{s.desc}</div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 4 }}>
        <span style={{ fontSize: 16 }}>⌚</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 0.5 }}>Requires Apple Watch Series 4 or later · iOS 16+</span>
      </motion.div>
    </div>
  )
}

// ─── PLANS ────────────────────────────────────────────────────────
function Plans() {
  const [billing, setBilling] = useState('monthly') // 'monthly' | 'annual'
  const free = ['Motion Score (daily)', 'Motion Goal tracker', '7-day history', 'Apple Watch sync', 'Basic insights']
  const pro = ['Everything in Free', 'Spotlight — muscle insights', 'Ask Jeani (AI coach)', '90-day history', 'Streak tracking & milestones', 'Priority support']
  const monthlyPrice = '$9.99'
  const annualPrice = '$99.99'
  const annualMonthly = '$8.33'

  return (
    <div style={{ width: '100%', height: '100%', background: '#f2ede4', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 60px' }}>
      <GrainOverlay opacity={0.06} blendMode="multiply" />

      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 32, position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 44, fontWeight: 700, color: C.blue }}>Movement is Medicine.</div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 8 }}>Choose the plan that moves with you.</div>

        {/* Billing toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 20, background: 'rgba(17,35,120,0.08)', borderRadius: 30, padding: 3, width: 'fit-content', margin: '20px auto 0' }}>
          {['monthly', 'annual'].map(b => (
            <button key={b} onClick={() => setBilling(b)}
              style={{ padding: '8px 22px', borderRadius: 26, border: 'none', cursor: 'pointer', fontSize: 11, fontFamily: 'HostGrotesk', fontWeight: 600, transition: 'all 0.25s', background: billing === b ? C.blue : 'transparent', color: billing === b ? '#fff' : '#888' }}>
              {b === 'monthly' ? 'Monthly' : 'Annual'}
              {b === 'annual' && <span style={{ marginLeft: 6, background: C.green, color: '#000', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>SAVE 17%</span>}
            </button>
          ))}
        </div>
      </motion.div>

      <div style={{ display: 'flex', gap: 22, width: '100%', maxWidth: 680, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        {/* Free */}
        <motion.div initial={{ opacity: 0, x: -26 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
          style={{ flex: 1, background: '#fff', borderRadius: 26, padding: 30, border: '1.5px solid rgba(17,35,120,0.1)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden' }}>
          <GrainOverlay opacity={0.04} blendMode="multiply" />
          <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 28, fontWeight: 700, color: C.blue, marginBottom: 6 }}>Free</div>
          <div style={{ fontSize: 38, fontFamily: 'CrimsonPro, serif', color: C.blue, fontWeight: 700, lineHeight: 1, marginBottom: 24 }}>$0</div>
          {free.map(f => (
            <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
              <div style={{ width: 17, height: 17, borderRadius: '50%', background: `${C.blue}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: C.blue, flexShrink: 0 }}>✓</div>
              <span style={{ fontSize: 12, color: '#555' }}>{f}</span>
            </div>
          ))}
          <button style={{ width: '100%', marginTop: 24, padding: '13px', borderRadius: 14, border: `2px solid ${C.blue}`, background: 'transparent', color: C.blue, fontSize: 13, fontWeight: 700, fontFamily: 'HostGrotesk', cursor: 'pointer' }}>
            Get Started
          </button>
        </motion.div>

        {/* Pro */}
        <motion.div initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.32, duration: 0.6 }}
          style={{ flex: 1, background: C.blue, borderRadius: 26, padding: 30, boxShadow: '0 12px 48px rgba(17,35,120,0.32)', position: 'relative', overflow: 'hidden' }}>
          <img src="/gradients/Track Grad-08.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, mixBlendMode: 'screen' }} />
          <GlowOrb color="#1a40c0" size={300} x="80%" y="20%" opacity={0.4} />
          <GrainOverlay opacity={0.1} blendMode="overlay" />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 28, fontWeight: 700, color: C.sand }}>Pro</div>
              <div style={{ background: C.amber, borderRadius: 20, padding: '3px 12px', fontSize: 9, color: '#000', fontWeight: 700 }}>POPULAR</div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={billing} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
                <div style={{ fontSize: 38, fontFamily: 'CrimsonPro, serif', color: C.sand, fontWeight: 700, lineHeight: 1 }}>
                  {billing === 'monthly' ? monthlyPrice : annualPrice}
                  <span style={{ fontSize: 15, fontWeight: 400, color: 'rgba(251,236,207,0.6)' }}>
                    {billing === 'monthly' ? '/mo' : '/yr'}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: 'rgba(251,236,207,0.45)', marginBottom: 24, marginTop: 4 }}>
                  {billing === 'monthly' ? 'First month free' : `${annualMonthly}/mo · first month free`}
                </div>
              </motion.div>
            </AnimatePresence>

            {pro.map(f => (
              <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                <div style={{ width: 17, height: 17, borderRadius: '50%', background: `${C.sand}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: C.sand, flexShrink: 0 }}>✓</div>
                <span style={{ fontSize: 12, color: C.sand }}>{f}</span>
              </div>
            ))}
            <button style={{ width: '100%', marginTop: 24, padding: '13px', borderRadius: 14, border: 'none', background: C.sand, color: C.blue, fontSize: 13, fontWeight: 700, fontFamily: 'HostGrotesk', cursor: 'pointer' }}>
              Go Pro
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Particles ────────────────────────────────────────────────────
function ParticleField() {
  const particles = useRef(
    Array.from({ length: 50 }, () => ({
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      dur: Math.random() * 5 + 3,
      delay: Math.random() * 4,
    }))
  )
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {particles.current.map((p, i) => (
        <motion.div key={i}
          animate={{ y: [0, -22, 0], opacity: [0.1, 0.55, 0.1] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, borderRadius: '50%', background: 'rgba(251,236,207,0.5)' }}
        />
      ))}
    </div>
  )
}

// ─── INTRO ────────────────────────────────────────────────────────
function Intro({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div exit={{ opacity: 0, transition: { duration: 0.8 } }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#03050f' }}>

      {/* Track grad background */}
      <img src="/gradients/Track Grad-08.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55, mixBlendMode: 'screen' }} />

      {/* Orbs */}
      <GlowOrb color="#1a40c0" size={700} x="40%" y="50%" opacity={0.6} />
      <GlowOrb color={C.amber} size={300} x="70%" y="60%" opacity={0.18} />

      {/* Grain */}
      <GrainOverlay opacity={0.15} blendMode="overlay" />

      {/* Particles */}
      <ParticleField />

      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center' }}>
        <motion.img src="/logos/Jeani Wordmark White.png" alt="Jeani"
          initial={{ opacity: 0, scale: 0.85, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 68, marginBottom: 28, filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.2))' }} />
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.9 }}
          style={{ fontFamily: 'CrimsonPro, serif', fontStyle: 'italic', fontSize: 24, color: C.sand, letterSpacing: 0.5, textShadow: '0 0 40px rgba(251,236,207,0.3)' }}>
          Movement is Medicine.
        </motion.div>
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7, duration: 0.5 }}
          onClick={onDone}
          style={{ marginTop: 48, background: 'rgba(251,236,207,0.08)', border: '1px solid rgba(251,236,207,0.2)', color: 'rgba(251,236,207,0.7)', borderRadius: 30, padding: '11px 32px', fontSize: 11, fontFamily: 'HostGrotesk', cursor: 'pointer', letterSpacing: 2, backdropFilter: 'blur(8px)' }}>
          EXPLORE
        </motion.button>
      </div>
    </motion.div>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────────
export default function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const sections = [TheApp, TheScience, HowItWorks, Plans]
  const Section = sections[activeTab]

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex', background: '#000' }}>
      <AnimatePresence>{showIntro && <Intro onDone={() => setShowIntro(false)} />}</AnimatePresence>

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            style={{ position: 'absolute', inset: 0 }}>
            <Section />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right nav */}
      <div style={{ width: 54, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(255,255,255,0.05)', zIndex: 50, flexShrink: 0 }}>
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            style={{ flex: 1, background: i === activeTab ? 'rgba(17,35,120,0.6)' : 'transparent', border: 'none', borderLeft: i === activeTab ? `2px solid ${C.sand}` : '2px solid transparent', cursor: 'pointer', transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {i === activeTab && <div style={{ position: 'absolute', inset: 0, background: 'rgba(251,236,207,0.03)' }} />}
            <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', fontSize: 8.5, fontFamily: 'HostGrotesk', fontWeight: i === activeTab ? 700 : 400, letterSpacing: 1.8, color: i === activeTab ? C.sand : 'rgba(255,255,255,0.28)', transition: 'all 0.25s' }}>
              {tab}
            </span>
          </button>
        ))}
        <div style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => setShowIntro(true)}
            style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
