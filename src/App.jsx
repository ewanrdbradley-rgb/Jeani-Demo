import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

// ─── Brand colours ────────────────────────────────────────────────
const C = {
  blue: '#112378',
  sand: '#fbeccf',
  amber: '#F5A000',
  green: '#00E87B',
  white: '#ffffff',
}

// ─── Right-nav tabs ───────────────────────────────────────────────
const TABS = ['THE APP', 'THE SCIENCE', 'HOW IT WORKS', 'PLANS']

// ─── App feature sub-screens ──────────────────────────────────────
const FEATURES = [
  { id: 'home', label: 'Home', icon: '◆', bg: 'linear-gradient(160deg,#0d1a5e 0%,#1a3a8f 50%,#0a2255 100%)', accent: C.amber },
  { id: 'motion', label: 'Motion', icon: '▶', bg: 'linear-gradient(160deg,#1a2a0a 0%,#2d4a10 40%,#3d5f1a 100%)', accent: C.amber },
  { id: 'goal', label: 'Motion Goal', icon: '◎', bg: 'linear-gradient(160deg,#0a1a2e 0%,#0d2040 50%,#071530 100%)', accent: C.green },
  { id: 'spotlight', label: 'Spotlight', icon: '⊕', bg: 'linear-gradient(160deg,#2a1000 0%,#4a1a08 50%,#1a0a00 100%)', accent: C.green },
  { id: 'body', label: 'Body', icon: '◈', bg: 'linear-gradient(160deg,#101840 0%,#1a2860 50%,#0c1430 100%)', accent: C.sand },
  { id: 'chat', label: 'Ask Jeani', icon: '◉', bg: 'linear-gradient(160deg,#112378 0%,#0d1a60 50%,#080f3a 100%)', accent: C.sand },
  { id: 'streak', label: 'Streak', icon: '🔥', bg: 'linear-gradient(160deg,#3a1a00 0%,#6b3000 50%,#2a1000 100%)', accent: C.amber },
]

// ─── Animated metric bar ──────────────────────────────────────────
function MetricBar({ label, value, color, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.4 }} style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: 11, color: 'rgba(255,255,255,0.75)', fontFamily: 'HostGrotesk' }}>
        <span>{label}</span>
      </div>
      <div style={{ height: 5, background: 'rgba(255,255,255,0.12)', borderRadius: 3, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: 3 }} />
      </div>
    </motion.div>
  )
}

// ─── Phone mockup wrapper ─────────────────────────────────────────
function PhoneMockup({ children }) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: [40, 0, -4, 0], opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      style={{
        width: 230, height: 440, borderRadius: 38, border: '6px solid rgba(255,255,255,0.22)',
        background: 'rgba(10,15,40,0.92)', overflow: 'hidden',
        boxShadow: '0 36px 90px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.07)',
        position: 'relative', flexShrink: 0,
      }}>
      <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 60, height: 14, background: '#000', borderRadius: 10, zIndex: 10 }} />
      <div style={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</div>
    </motion.div>
  )
}

// ─── HOME mockup ──────────────────────────────────────────────────
function HomeMockup() {
  return (
    <div style={{ padding: '28px 12px 12px', height: '100%', display: 'flex', flexDirection: 'column', gap: 8, background: 'linear-gradient(180deg,rgba(17,35,120,0.95) 0%,rgba(8,12,40,0.98) 100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <img src="/logos/Jeani J White.png" style={{ height: 22 }} alt="J" />
        <div style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.35)' }} />
      </div>
      <div style={{ background: 'rgba(17,35,120,0.7)', borderRadius: 16, padding: '14px 12px', textAlign: 'center' }}>
        <div style={{ fontSize: 54, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: C.amber, lineHeight: 1 }}>74</div>
        <div style={{ fontSize: 17, fontFamily: 'CrimsonPro, serif', fontStyle: 'italic', color: '#fff', marginTop: 2 }}>Motion</div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '8px 0' }} />
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.72)', lineHeight: 1.5 }}>You're at 74/100 — solid and ready to push. Your left hamstring is up +45.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ background: 'rgba(17,35,120,0.6)', borderRadius: 12, padding: 10 }}>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>▶ Daily Recap</div>
          <div style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>June 7</div>
          <div style={{ fontSize: 9, color: C.amber, marginTop: 4 }}>🔥 8 day streak</div>
        </div>
        <div style={{ background: 'rgba(17,35,120,0.6)', borderRadius: 12, padding: 10 }}>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.45)', marginBottom: 2 }}>⊕ Spotlight</div>
          <div style={{ fontSize: 9, color: '#fff' }}>Left Hamstring</div>
          <div style={{ fontSize: 12, color: C.green, marginTop: 4, fontWeight: 700 }}>+45 pts ↗</div>
        </div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>+</span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>Log Activity</span>
      </div>
      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: '8px 12px', textAlign: 'center' }}>
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', letterSpacing: 2 }}>MOTION GOAL</div>
        <div style={{ fontSize: 15, color: '#fff', fontWeight: 700 }}>Today</div>
      </div>
    </div>
  )
}

// ─── MOTION SCORE mockup ──────────────────────────────────────────
function MotionMockup() {
  const metrics = [
    { label: 'Joint Changes', value: 82, color: C.green },
    { label: 'Symmetry', value: 78, color: C.green },
    { label: 'Mobility', value: 62, color: C.amber },
    { label: 'Movement Diversity', value: 55, color: C.amber },
    { label: 'Step Volume', value: 48, color: C.amber },
  ]
  const pts = [78, 80, 75, 73, 79, 74, 74]
  const w = 190, h = 60
  const coords = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * w
    const y = h - ((v - 68) / (88 - 68)) * h
    return `${x},${y}`
  })
  return (
    <div style={{ padding: '28px 12px 12px', height: '100%', background: 'linear-gradient(180deg,rgba(20,35,10,0.97) 0%,rgba(8,15,5,0.99) 100%)', overflowY: 'auto' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 2, fontFamily: 'CrimsonPro, serif' }}>Motion Score</div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>Today</div>
      <div style={{ fontSize: 46, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: C.amber, lineHeight: 1, marginBottom: 10 }}>74</div>
      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 10, marginBottom: 8 }}>
        {metrics.map((m, i) => <MetricBar key={m.label} {...m} delay={i * 0.1} />)}
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        {['7 Days', '30 Days', '90 Days'].map((t, i) => (
          <div key={t} style={{ flex: 1, background: i === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)', borderRadius: 20, padding: '4px 0', textAlign: 'center', fontSize: 8, color: '#fff' }}>{t}</div>
        ))}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 10, marginBottom: 8 }}>
        <svg width={w} height={h} style={{ display: 'block', marginBottom: 6, overflow: 'visible' }}>
          <polyline points={coords.join(' ')} fill="none" stroke={C.amber} strokeWidth="1.5" strokeLinejoin="round" />
          {coords.map((c, i) => {
            const [x, y] = c.split(',').map(Number)
            return <circle key={i} cx={x} cy={y} r="2.5" fill={C.amber} />
          })}
        </svg>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 10 }}>
        {[['Average', '76'], ['Highest', '81'], ['Lowest', '73'], ['Change', '-4']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.65)', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span>{k}</span><span style={{ color: '#fff', fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MOTION GOAL mockup ───────────────────────────────────────────
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
    <div style={{ padding: '28px 10px 12px', height: '100%', background: 'linear-gradient(180deg,rgba(8,15,30,0.97) 0%,rgba(5,10,20,0.99) 100%)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', letterSpacing: 2 }}>MOTION GOAL</div>
        <div style={{ fontSize: 17, color: '#fff', fontWeight: 700 }}>Today</div>
      </div>
      <div style={{ textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 56, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: '#fff' }}>{pct}%</div>
      </div>
      <div style={{ background: 'rgba(17,35,120,0.6)', borderRadius: 12, padding: 10 }}>
        <div style={{ fontSize: 10, color: C.green, fontStyle: 'italic', fontWeight: 600 }}>⚡ you've got motion</div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>just <span style={{ color: C.green, fontWeight: 700 }}>26%</span> from your daily goal</div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 7.5, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
          <span>LAST 30 DAYS</span><span>May 10 – Jun 8</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: '1', borderRadius: 3, background: i < 22 ? `rgba(0,232,123,${0.15 + (i % 3) * 0.15})` : 'rgba(255,255,255,0.05)', fontSize: 6, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
  const w = 185, h = 68
  const coords = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * w
    const y = h - ((v - 0) / 65) * h
    return `${x},${y}`
  })
  return (
    <div style={{ padding: '28px 10px 12px', height: '100%', background: 'linear-gradient(180deg,rgba(40,15,5,0.97) 0%,rgba(15,5,0,0.99) 100%)', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 20, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: '#fff' }}>Spotlight</div>
      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: 8, fontSize: 8.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
        Based on your recent movement patterns and symptoms, Jeani has identified these areas as potential weak points.
      </div>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: 12, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>Left Hamstring</div>
            <div style={{ fontSize: 9, color: C.green }}>Improving</div>
          </div>
          <div style={{ fontSize: 18, color: C.green, fontWeight: 700 }}>+45 ↑</div>
        </div>
        <svg width={w} height={h} style={{ display: 'block', marginBottom: 10, overflow: 'visible' }}>
          <polyline points={coords.join(' ')} fill="none" stroke={C.green} strokeWidth="2" strokeLinejoin="round" />
          {coords.map((c, i) => {
            const [x, y] = c.split(',').map(Number)
            return <circle key={i} cx={x} cy={y} r="3" fill={C.green} />
          })}
        </svg>
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', marginBottom: 6, letterSpacing: 1 }}>ABOUT</div>
        <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, marginBottom: 8 }}>The muscles along the back of your thigh. They bend your knee and drive your hips through each stride.</div>
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 4 }}>STRETCH IT</div>
        {['Seated forward fold', 'Standing toe-touch', 'Lying single-leg stretch'].map(s => (
          <div key={s} style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.65)', paddingLeft: 8, marginBottom: 3 }}>• {s}</div>
        ))}
      </div>
    </div>
  )
}

// ─── BODY mockup ──────────────────────────────────────────────────
function BodyMockup() {
  const zones = [
    { label: 'Left Hamstring', status: 'Improving', color: C.green, score: '+45' },
    { label: 'Right Knee', status: 'Watch closely', color: C.amber, score: '-12' },
    { label: 'Lower Back', status: 'Stable', color: 'rgba(255,255,255,0.45)', score: '0' },
    { label: 'Left Shoulder', status: 'Improving', color: C.green, score: '+8' },
    { label: 'Right Hip', status: 'Needs attention', color: '#ff6b6b', score: '-23' },
  ]
  return (
    <div style={{ padding: '28px 10px 12px', height: '100%', background: 'linear-gradient(180deg,rgba(10,15,40,0.97) 0%,rgba(5,8,20,0.99) 100%)', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 20, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: '#fff' }}>Body</div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)' }}>Your movement map — updated daily</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {zones.map((z, i) => (
          <motion.div key={z.label} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '9px 11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>{z.label}</div>
              <div style={{ fontSize: 8.5, color: z.color }}>{z.status}</div>
            </div>
            <div style={{ fontSize: 14, color: z.color, fontWeight: 700 }}>{z.score}</div>
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
    { from: 'jeani', text: 'Your left hamstring jumped +45 points this week — impressive, but rapid gains can mean your body is compensating. Worth watching.' },
    { from: 'user', text: 'What should I do today?' },
    { from: 'jeani', text: 'Motion score 74 — you\'re ready to push. Try a moderate run, and add a hamstring stretch routine after.' },
  ]
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (shown >= messages.length) return
    const t = setTimeout(() => setShown(s => s + 1), shown === 0 ? 400 : 1000)
    return () => clearTimeout(t)
  }, [shown])
  return (
    <div style={{ padding: '28px 10px 12px', height: '100%', background: 'linear-gradient(180deg,rgba(17,35,120,0.97) 0%,rgba(8,12,50,0.99) 100%)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
        <img src="/logos/Jeani J White.png" style={{ height: 18 }} alt="J" />
        <span style={{ fontSize: 12, color: '#fff', fontWeight: 700, fontFamily: 'CrimsonPro, serif' }}>Ask Jeani</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, overflowY: 'auto' }}>
        {messages.slice(0, shown).map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            style={{
              alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%',
              background: m.from === 'user' ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.3)',
              borderRadius: m.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              padding: '8px 11px', fontSize: 8.5, color: '#fff', lineHeight: 1.55,
            }}>
            {m.text}
          </motion.div>
        ))}
      </div>
      <div style={{ marginTop: 10, background: 'rgba(255,255,255,0.09)', borderRadius: 20, padding: '7px 13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.35)' }}>Ask anything…</span>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: C.sand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: C.blue, fontWeight: 700 }}>↑</div>
      </div>
    </div>
  )
}

// ─── STREAK mockup ────────────────────────────────────────────────
function StreakMockup() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  return (
    <div style={{ padding: '28px 10px 12px', height: '100%', background: 'linear-gradient(180deg,rgba(60,25,0,0.97) 0%,rgba(25,10,0,0.99) 100%)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 38 }}>🔥</div>
        <div style={{ fontSize: 50, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: C.amber, lineHeight: 1 }}>8</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>day streak</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: 12 }}>
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 9 }}>THIS WEEK</div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
          {days.map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: i < 6 ? C.amber : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: i < 6 ? '#000' : 'rgba(255,255,255,0.3)' }}>
                {i < 6 ? '✓' : ''}
              </div>
              <span style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.45)' }}>{d}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: 'rgba(245,160,0,0.12)', borderRadius: 12, padding: '11px 12px', textAlign: 'center', border: `1px solid rgba(245,160,0,0.2)` }}>
        <div style={{ fontSize: 11, color: C.amber, fontWeight: 600, fontStyle: 'italic', fontFamily: 'CrimsonPro, serif', lineHeight: 1.4 }}>
          "Consistency is the only metric that compounds."
        </div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '10px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {[['Best', '14 days'], ['This month', '22/31'], ['All time', '8 🔥']].map(([k, v]) => (
            <div key={k} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>{v}</div>
              <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.35)' }}>{k}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const MOCKUPS = { home: HomeMockup, motion: MotionMockup, goal: GoalMockup, spotlight: SpotlightMockup, body: BodyMockup, chat: ChatMockup, streak: StreakMockup }

// ─── THE APP section ──────────────────────────────────────────────
function TheApp() {
  const [active, setActive] = useState(0)
  const feat = FEATURES[active]
  const Mockup = MOCKUPS[feat.id]
  const subcopy = {
    home: 'Your daily motion, at a glance.',
    motion: 'Five dimensions of how your body moves.',
    goal: 'A daily target built around you.',
    spotlight: 'Jeani finds what needs your attention before you feel it.',
    body: 'A complete picture of your physical self.',
    chat: 'Your personal movement coach, always on.',
    streak: 'Consistency is the only metric that compounds.',
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      {/* Feature sub-nav */}
      <div style={{ width: 96, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, padding: '0 10px', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
        {FEATURES.map((f, i) => (
          <button key={f.id} onClick={() => setActive(i)}
            style={{ background: i === active ? 'rgba(255,255,255,0.13)' : 'transparent', border: 'none', cursor: 'pointer', borderRadius: 8, padding: '7px 6px', color: i === active ? '#fff' : 'rgba(255,255,255,0.38)', fontSize: 9, fontFamily: 'HostGrotesk', fontWeight: i === active ? 700 : 400, textAlign: 'left', transition: 'all 0.2s', borderLeft: `2px solid ${i === active ? C.sand : 'transparent'}` }}>
            <span style={{ marginRight: 5 }}>{f.icon}</span>{f.label}
          </button>
        ))}
      </div>

      {/* Main feature panel */}
      <AnimatePresence mode="wait">
        <motion.div key={feat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}
          style={{ flex: 1, background: feat.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '20px 40px' }}>
          <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 320, height: 320, borderRadius: '50%', background: `radial-gradient(circle, ${feat.accent}1a 0%, transparent 70%)`, pointerEvents: 'none' }} />
          <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 30, marginBottom: 6 }}>{feat.icon}</div>
            <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 38, fontWeight: 700, color: '#fff', letterSpacing: -0.5 }}>{feat.label}</div>
          </motion.div>
          <PhoneMockup><Mockup /></PhoneMockup>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.4 }}
            style={{ marginTop: 18, fontFamily: 'CrimsonPro, serif', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.65)', textAlign: 'center' }}>
            {subcopy[feat.id]}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── THE SCIENCE section ──────────────────────────────────────────
function TheScience() {
  const stats = [
    { num: '5', unit: '5 Movement Dimensions', desc: 'Joint Changes · Symmetry · Mobility · Movement Diversity · Step Volume' },
    { num: '⌚', unit: 'Apple Watch Integration', desc: 'Real-time biometric data, always with you on your wrist' },
    { num: 'STAB', unit: 'Science & Technical Advisory Board', desc: 'Amy Arendelle · Jacob Rothman · Dr. Blake Boggess' },
  ]
  return (
    <div style={{ width: '100%', height: '100%', background: '#f5f0e8', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ width: '36%', background: 'linear-gradient(160deg,#1a3060 0%,#0d1a40 100%)', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 36 }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'url(/gradients/Track Grad-10.png) center/cover' }} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ position: 'relative', zIndex: 1 }}>
            <img src="/logos/Jeani Wordmark White.png" style={{ height: 28, marginBottom: 20 }} alt="Jeani" />
            <div style={{ fontFamily: 'CrimsonPro, serif', fontStyle: 'italic', fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
              "Built with leading movement scientists and physicians to deliver insights athletes and everyday movers can actually trust."
            </div>
          </motion.div>
        </div>
        <div style={{ flex: 1, padding: '44px 48px 28px', display: 'flex', flexDirection: 'column' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 40, fontWeight: 700, color: C.blue, lineHeight: 1.1, marginBottom: 12 }}>
              Critically acclaimed.<br />Backed by science.
            </div>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.65, marginBottom: 30, maxWidth: 440 }}>
              Jeani combines clinical-grade movement analysis with personalised AI coaching — turning daily data into decisions that protect your body and elevate your performance.
            </div>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {stats.map((s, i) => (
              <motion.div key={s.unit} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15, duration: 0.5 }}
                style={{ background: C.blue, borderRadius: 14, padding: '15px 20px', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 24, fontWeight: 700, color: C.sand, minWidth: 50, lineHeight: 1 }}>{s.num}</div>
                <div>
                  <div style={{ fontSize: 11, color: C.sand, fontWeight: 700, marginBottom: 4 }}>{s.unit}</div>
                  <div style={{ fontSize: 10, color: 'rgba(251,236,207,0.65)', lineHeight: 1.45 }}>{s.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: C.blue, padding: '14px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'CrimsonPro, serif', fontStyle: 'italic', fontSize: 14, color: C.sand }}>
          Accurate by design — Jeani reads movement where it matters most.
        </div>
        <img src="/logos/Jeani Wordmark Sand White.png" style={{ height: 20 }} alt="Jeani" />
      </div>
    </div>
  )
}

// ─── HOW IT WORKS section ─────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: '01', title: 'Download Jeani', desc: 'Available on the App Store. Set up your profile and movement baseline in minutes.', icon: '📱' },
    { num: '02', title: 'Sync Your Apple Watch', desc: 'Jeani connects to Apple Watch and reads your movement data in real time — no extra hardware required.', icon: '⌚' },
    { num: '03', title: 'Get Your Score', desc: 'Every day you receive your Motion score, Spotlight insights, and a personalised goal — so you always know where you stand.', icon: '◆' },
  ]
  return (
    <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${C.blue} 0%, #0a1550 100%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 60px' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 44 }}>
        <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 42, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>How it works</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 8 }}>From download to daily insight — in three steps.</div>
      </motion.div>
      <div style={{ display: 'flex', gap: 22, width: '100%', maxWidth: 860 }}>
        {steps.map((s, i) => (
          <motion.div key={s.num} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2, duration: 0.6 }}
            style={{ flex: 1, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', borderRadius: 22, padding: 28, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 34, marginBottom: 14 }}>{s.icon}</div>
            <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 13, color: C.sand, fontWeight: 600, marginBottom: 6 }}>{s.num}</div>
            <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>{s.desc}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        style={{ marginTop: 38, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18 }}>⌚</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Requires Apple Watch Series 4 or later · iOS 16+</span>
      </motion.div>
    </div>
  )
}

// ─── PLANS section ────────────────────────────────────────────────
function Plans() {
  const free = ['Motion Score (daily)', 'Motion Goal tracker', '7-day history', 'Apple Watch sync', 'Basic insights']
  const pro = ['Everything in Free', 'Spotlight — muscle insights', 'Ask Jeani (AI coach)', '90-day history', 'Streak tracking & milestones', 'Priority support']
  return (
    <div style={{ width: '100%', height: '100%', background: '#f5f0e8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 60px' }}>
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 38 }}>
        <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 42, fontWeight: 700, color: C.blue, lineHeight: 1 }}>Movement is Medicine.</div>
        <div style={{ fontSize: 13, color: '#777', marginTop: 8 }}>Choose the plan that moves with you.</div>
      </motion.div>
      <div style={{ display: 'flex', gap: 22, width: '100%', maxWidth: 680, alignItems: 'flex-start' }}>
        <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
          style={{ flex: 1, background: '#fff', borderRadius: 24, padding: 28, border: `2px solid ${C.blue}18`, boxShadow: '0 4px 24px rgba(17,35,120,0.07)' }}>
          <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 26, fontWeight: 700, color: C.blue, marginBottom: 4 }}>Free</div>
          <div style={{ fontSize: 34, fontFamily: 'CrimsonPro, serif', color: C.blue, fontWeight: 700, marginBottom: 22 }}>$0</div>
          {free.map(f => (
            <div key={f} style={{ display: 'flex', gap: 9, alignItems: 'center', marginBottom: 11 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: `${C.blue}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: C.blue, flexShrink: 0 }}>✓</div>
              <span style={{ fontSize: 12, color: '#444' }}>{f}</span>
            </div>
          ))}
          <button style={{ width: '100%', marginTop: 22, padding: '12px', borderRadius: 12, border: `2px solid ${C.blue}`, background: 'transparent', color: C.blue, fontSize: 13, fontWeight: 700, fontFamily: 'HostGrotesk', cursor: 'pointer' }}>
            Get Started
          </button>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          style={{ flex: 1, background: C.blue, borderRadius: 24, padding: 28, boxShadow: '0 10px 44px rgba(17,35,120,0.28)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 26, fontWeight: 700, color: C.sand }}>Pro</div>
            <div style={{ background: C.amber, borderRadius: 20, padding: '3px 11px', fontSize: 9, color: '#000', fontWeight: 700 }}>POPULAR</div>
          </div>
          <div style={{ fontSize: 34, fontFamily: 'CrimsonPro, serif', color: C.sand, fontWeight: 700, marginBottom: 4 }}>$9.99<span style={{ fontSize: 15, fontWeight: 400 }}>/mo</span></div>
          <div style={{ fontSize: 10, color: 'rgba(251,236,207,0.45)', marginBottom: 22 }}>First month free</div>
          {pro.map(f => (
            <div key={f} style={{ display: 'flex', gap: 9, alignItems: 'center', marginBottom: 11 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: `${C.sand}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: C.sand, flexShrink: 0 }}>✓</div>
              <span style={{ fontSize: 12, color: C.sand }}>{f}</span>
            </div>
          ))}
          <button style={{ width: '100%', marginTop: 22, padding: '12px', borderRadius: 12, border: 'none', background: C.sand, color: C.blue, fontSize: 13, fontWeight: 700, fontFamily: 'HostGrotesk', cursor: 'pointer' }}>
            Go Pro
          </button>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Particle field ───────────────────────────────────────────────
function ParticleField() {
  const particles = useRef(
    Array.from({ length: 55 }, () => ({
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      dur: Math.random() * 4 + 3,
      delay: Math.random() * 4,
    }))
  )
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {particles.current.map((p, i) => (
        <motion.div key={i}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.65, 0.15] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, borderRadius: '50%', background: 'rgba(251,236,207,0.55)' }}
        />
      ))}
    </div>
  )
}

// ─── INTRO ────────────────────────────────────────────────────────
function Intro({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3400)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <motion.div exit={{ opacity: 0, transition: { duration: 0.7 } }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <motion.div animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, #060c28, ${C.blue}, #1a4080, #0a2060, #060c28)`, backgroundSize: '300% 300%' }} />
      <ParticleField />
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <motion.img src="/logos/Jeani Wordmark White.png" alt="Jeani"
          initial={{ opacity: 0, scale: 0.82 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: 'easeOut' }}
          style={{ height: 64, marginBottom: 26 }} />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.9 }}
          style={{ fontFamily: 'CrimsonPro, serif', fontStyle: 'italic', fontSize: 24, color: C.sand, letterSpacing: 0.5 }}>
          Movement is Medicine.
        </motion.div>
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.5 }}
          onClick={onDone}
          style={{ marginTop: 44, background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.8)', borderRadius: 30, padding: '10px 30px', fontSize: 11, fontFamily: 'HostGrotesk', cursor: 'pointer', letterSpacing: 1.5 }}>
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
      <div style={{ width: 54, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(14px)', borderLeft: '1px solid rgba(255,255,255,0.07)', zIndex: 50, flexShrink: 0 }}>
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            style={{ flex: 1, background: i === activeTab ? 'rgba(17,35,120,0.75)' : 'transparent', border: 'none', borderLeft: i === activeTab ? `2px solid ${C.sand}` : '2px solid transparent', cursor: 'pointer', padding: '0', transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', fontSize: 8.5, fontFamily: 'HostGrotesk', fontWeight: i === activeTab ? 700 : 400, letterSpacing: 1.5, color: i === activeTab ? C.sand : 'rgba(255,255,255,0.35)', transition: 'all 0.25s' }}>
              {tab}
            </span>
          </button>
        ))}
        <div style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => setShowIntro(true)}
            style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.45)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
