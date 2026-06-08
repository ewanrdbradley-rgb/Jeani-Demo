import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

const C = { blue: '#112378', sand: '#fbeccf', amber: '#F5A000', green: '#00E87B' }

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

function Grain({ opacity = 0.1, blend = 'overlay' }) {
  return <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5, backgroundImage: NOISE_SVG, backgroundRepeat: 'repeat', backgroundSize: '180px', opacity, mixBlendMode: blend }} />
}

function Orb({ color, size = 500, x = '50%', y = '50%', opacity = 0.4 }) {
  return <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', width: size, height: size, borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, transparent 68%)`, opacity, filter: 'blur(50px)', pointerEvents: 'none', zIndex: 1 }} />
}

const TABS = ['THE APP', 'THE SCIENCE', 'HOW IT WORKS', 'PLANS']

// ─── Feature config ───────────────────────────────────────────────
const FEATURES = [
  {
    id: 'home', label: 'Home', tagline: 'Your daily motion, at a glance.',
    grad: '/gradients/Track Grad-08.png', base: '#020810',
    orb1: '#0d2a80', orb2: '#F5A000',
    screenshot: '/screenshots/home.png',
  },
  {
    id: 'motion', label: 'Motion Score', tagline: 'Five dimensions of how your body moves.',
    grad: '/gradients/Track Grad-09.png', base: '#040a04',
    orb1: '#1a4a0a', orb2: '#F5A000',
    screenshot: '/screenshots/motion.png',
  },
  {
    id: 'goal', label: 'Motion Goal', tagline: 'A daily target built around you.',
    grad: '/gradients/Track Grad-10.png', base: '#020810',
    orb1: '#062840', orb2: '#00E87B',
    screenshot: '/screenshots/goal.png',
  },
  {
    id: 'spotlight', label: 'Spotlight', tagline: 'Jeani finds what needs your attention before you feel it.',
    grad: '/gradients/Track Grad-11.png', base: '#080200',
    orb1: '#6b1800', orb2: '#00E87B',
    screenshot: '/screenshots/spotlight.png',
  },
  {
    id: 'body', label: 'Body', tagline: 'A complete picture of your physical self.',
    grad: '/gradients/Track Grad-13.png', base: '#020510',
    orb1: '#0d1e60', orb2: '#fbeccf',
    screenshot: '/screenshots/body.png',
  },
  {
    id: 'chat', label: 'Ask Jeani', tagline: 'Your personal movement coach, always on.',
    grad: '/gradients/Track Grad-14.png', base: '#030210',
    orb1: '#100860', orb2: '#fbeccf',
    screenshot: null,
  },
  {
    id: 'streak', label: 'Streak', tagline: 'Consistency is the only metric that compounds.',
    grad: '/gradients/Track Grad-08.png', base: '#080200',
    orb1: '#7a2800', orb2: '#F5A000',
    screenshot: null,
  },
]

// ─── Bottom tab bar (appears in all phone mockups) ─────────────────
function BottomTabs({ active = 'home' }) {
  const tabs = [
    { id: 'home', icon: '⌂', label: 'Home' },
    { id: 'motion', icon: '▶', label: 'Motion' },
    { id: 'body', icon: '◈', label: 'Body' },
    { id: 'spotlight', icon: '⊕', label: 'Spotlight' },
  ]
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 72, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', zIndex: 20 }}>
      {tabs.map(t => {
        const isActive = t.id === active || (active === 'goal' && t.id === 'motion')
        return (
          <div key={t.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ width: isActive ? 44 : 'auto', background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: 22, padding: isActive ? '6px 12px' : '6px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: isActive ? 18 : 16, color: isActive ? '#fff' : 'rgba(255,255,255,0.4)' }}>{t.icon}</span>
            </div>
            <span style={{ fontSize: 10, color: isActive ? '#fff' : 'rgba(255,255,255,0.35)', fontFamily: 'HostGrotesk', fontWeight: isActive ? 600 : 400 }}>{t.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Screenshot phone — shows real image if available ─────────────
function ScreenshotPhone({ src, fallback: Fallback, activeTab }) {
  const [failed, setFailed] = useState(false)
  if (src && !failed) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <img
          src={src}
          alt=""
          onError={() => setFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
        />
        <BottomTabs active={activeTab} />
      </div>
    )
  }
  return <Fallback />
}

// ─── HOME screen ──────────────────────────────────────────────────
function HomeScreen() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: 'linear-gradient(180deg, #6090c0 0%, #4070a8 25%, #1a3060 60%, #080f28 100%)', display: 'flex', flexDirection: 'column' }}>
      {/* Sky/mountain photo simulation */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #7aadd4 0%, #5b8fc0 20%, #2a5088 40%, #112060 70%, #060e20 100%)', opacity: 0.9 }} />
      {/* Mountain silhouette */}
      <div style={{ position: 'absolute', bottom: '30%', left: 0, right: 0, height: '45%', background: 'linear-gradient(180deg, transparent 0%, rgba(10,25,60,0.8) 60%, rgba(5,12,30,0.95) 100%)' }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '52px 16px 80px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontFamily: 'CrimsonPro, serif', fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1 }}>J<span style={{ fontSize: 10, verticalAlign: 'super', color: 'rgba(255,255,255,0.5)' }}>·</span></span>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>◉</span>
          </div>
        </div>

        {/* Main score card */}
        <div style={{ background: 'rgba(17,35,120,0.55)', backdropFilter: 'blur(20px)', borderRadius: 22, padding: '20px 20px 18px', border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
          <div style={{ fontSize: 76, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: C.amber, lineHeight: 0.9, letterSpacing: -2 }}>74</div>
          <div style={{ fontSize: 22, fontFamily: 'CrimsonPro, serif', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>Motion</div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '12px 0' }} />
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>You're at 74/100 today — solid and ready to push. Your left hamstring is up +45, so you can load with more confidence.</div>
          <button style={{ marginTop: 12, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '7px 18px', color: 'rgba(255,255,255,0.8)', fontSize: 11, fontFamily: 'HostGrotesk', cursor: 'pointer', letterSpacing: 0.5 }}>
            LEARN MORE
          </button>
        </div>

        {/* Two-col cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'rgba(17,35,120,0.5)', backdropFilter: 'blur(16px)', borderRadius: 18, padding: '14px 14px 12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 12 }}>▶</span>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>Daily Recap</div>
                <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.45)' }}>June 7</div>
              </div>
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 8 }} />
            <div style={{ fontSize: 11, color: C.amber }}>🔥 8 day streak</div>
          </div>
          <div style={{ background: 'rgba(17,35,120,0.5)', backdropFilter: 'blur(16px)', borderRadius: 18, padding: '14px 14px 12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 13 }}>⊕</span>
              <div style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>Spotlight</div>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>Left Hamstring</div>
            {/* Mini chart */}
            <svg width="100%" height="30" viewBox="0 0 100 30">
              <polyline points="0,28 20,22 40,10 60,8 80,10 100,9" fill="none" stroke={C.green} strokeWidth="2" strokeLinejoin="round" />
              <circle cx="100" cy="9" r="3" fill={C.green} />
            </svg>
            <div style={{ fontSize: 13, color: C.green, fontWeight: 700, marginTop: 2 }}>+45 pts ↗</div>
          </div>
        </div>

        {/* Log activity */}
        <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 16, padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>+</span>
            </div>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Log Activity</span>
          </div>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>›</span>
        </div>

        {/* Motion goal peek */}
        <div style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)', borderRadius: 16, padding: '10px 16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 2 }}>MOTION GOAL</div>
          <div style={{ fontSize: 18, color: '#fff', fontWeight: 700 }}>Today</div>
        </div>
      </div>

      <BottomTabs active="home" />
    </div>
  )
}

// ─── MOTION SCORE screen ──────────────────────────────────────────
function MotionScreen() {
  const metrics = [
    { label: 'Joint Changes', value: 82, color: C.green },
    { label: 'Symmetry', value: 78, color: C.green },
    { label: 'Mobility', value: 62, color: C.amber },
    { label: 'Movement Diversity', value: 55, color: C.amber },
    { label: 'Step Volume', value: 48, color: C.amber },
  ]
  const pts = [78, 80, 75, 73, 79, 74, 74]
  const days = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue']
  const svgW = 290, svgH = 80
  const minV = 68, maxV = 86
  const coords = pts.map((v, i) => `${(i / (pts.length - 1)) * svgW},${svgH - ((v - minV) / (maxV - minV)) * svgH}`)

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'auto', background: 'linear-gradient(180deg, #b0883a 0%, #7a5520 25%, #3a2808 55%, #0a0800 100%)' }}>
      {/* Mountain bg simulation */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #c89a42 0%, #8a6028 20%, #4a3010 40%, #181005 70%, #050300 100%)' }} />
      <div style={{ position: 'absolute', bottom: '30%', left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg, transparent 0%, rgba(5,3,0,0.9) 100%)' }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '50px 16px 80px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⊞</div>
        </div>
        <div style={{ fontSize: 22, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: '#fff' }}>Motion Score</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Today</div>
        <div style={{ fontSize: 80, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: C.amber, lineHeight: 0.9, letterSpacing: -3 }}>74</div>

        <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', marginBottom: 12 }}>What is Motion? <span style={{ color: 'rgba(255,255,255,0.3)' }}>∨</span></div>
          {metrics.map((m, i) => (
            <div key={m.label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{m.label}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>ⓘ</span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${m.value}%` }} transition={{ delay: i * 0.1 + 0.3, duration: 0.9, ease: 'easeOut' }}
                  style={{ height: '100%', background: m.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {['7 Days', '30 Days', '90 Days'].map((t, i) => (
            <div key={t} style={{ flex: 1, background: i === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, padding: '7px 0', textAlign: 'center', fontSize: 11, color: '#fff', fontFamily: 'HostGrotesk' }}>{t}</div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '16px 18px' }}>
          <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: 'visible', marginBottom: 8 }}>
            <defs>
              <linearGradient id="ambGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={C.amber} stopOpacity="0.5" />
                <stop offset="100%" stopColor={C.amber} />
              </linearGradient>
            </defs>
            <polyline points={coords.join(' ')} fill="none" stroke="url(#ambGrad)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {coords.map((c, i) => { const [x, y] = c.split(',').map(Number); return <circle key={i} cx={x} cy={y} r="4" fill={C.amber} /> })}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {days.map(d => <span key={d} style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: 'HostGrotesk' }}>{d}</span>)}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '16px 18px' }}>
          {[['Average', '76'], ['Highest', '81'], ['Lowest', '73'], ['Change', '–4']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 13 }}>
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>{k}</span>
              <span style={{ color: '#fff', fontWeight: 700, fontFamily: 'CrimsonPro, serif' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <BottomTabs active="motion" />
    </div>
  )
}

// ─── MOTION GOAL screen ───────────────────────────────────────────
function GoalScreen() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      let v = 0
      const iv = setInterval(() => { v += 1; setPct(Math.min(v, 74)); if (v >= 74) clearInterval(iv) }, 16)
      return () => clearInterval(iv)
    }, 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#060c20', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #2a3a6a 0%, #141e4a 30%, #080e28 70%, #020610 100%)', opacity: 0.95 }} />
      {/* Blurred city/mountain bg */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 20%, rgba(60,80,160,0.4) 0%, transparent 60%)' }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '52px 16px 80px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 3 }}>MOTION GOAL</div>
          <div style={{ fontSize: 24, color: '#fff', fontWeight: 700 }}>Today</div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 96, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: -4 }}>{pct}%</div>
          {/* Progress dot */}
          <div style={{ marginTop: 20, width: '60%', height: 3, background: 'rgba(255,255,255,0.12)', borderRadius: 2, position: 'relative' }}>
            <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.05 }}
              style={{ height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 2 }} />
            <motion.div animate={{ left: `${pct}%` }} transition={{ duration: 0.05 }}
              style={{ position: 'absolute', top: '50%', transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: '#fff', boxShadow: `0 0 8px ${C.green}` }} />
          </div>
        </div>

        <div style={{ background: 'rgba(17,35,120,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(100,130,255,0.2)', borderRadius: 18, padding: '14px 18px' }}>
          <div style={{ fontSize: 14, color: C.green, fontStyle: 'italic', fontWeight: 600, marginBottom: 4 }}>⚡ you've got motion</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>just <span style={{ color: C.green, fontWeight: 700, fontSize: 16 }}>{100 - pct}%</span> from your daily goal</div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5 }}>LAST 30 DAYS</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>May 10 – Jun 8</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
            {['M','T','W','T','F','S','S'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 9, color: 'rgba(255,255,255,0.25)', marginBottom: 3, fontFamily: 'HostGrotesk' }}>{d}</div>
            ))}
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} style={{ aspectRatio: '1', borderRadius: 4, background: i < 22 ? `rgba(0,232,123,${0.1 + (i % 5) * 0.08})` : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>
                {i + 10}
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomTabs active="goal" />
    </div>
  )
}

// ─── SPOTLIGHT screen ─────────────────────────────────────────────
function SpotlightScreen() {
  const pts = [5, 28, 55, 61, 58, 57, 57]
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const svgW = 300, svgH = 90
  const coords = pts.map((v, i) => `${(i / (pts.length - 1)) * svgW},${svgH - ((v + 5) / 70) * svgH}`)

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'auto', background: '#080200' }}>
      {/* Red rock bg simulation */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #8a2800 0%, #5a1800 30%, #1a0800 60%, #080200 100%)', opacity: 0.9 }} />
      <div style={{ position: 'absolute', top: '5%', left: '10%', right: '-10%', height: '60%', background: 'linear-gradient(160deg, rgba(180,80,30,0.3) 0%, transparent 70%)', filter: 'blur(30px)' }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '50px 16px 80px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: '100%' }}>
        <div style={{ fontSize: 32, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: '#fff' }}>Spotlight</div>

        <div style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '12px 14px', fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>
          Based on your recent movement patterns and symptoms, Jeani has identified these areas as potential weak points to keep an eye on.
        </div>

        <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '18px 18px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 18, color: '#fff', fontWeight: 700, marginBottom: 4 }}>Left Hamstring</div>
              <div style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>Improving</div>
            </div>
            <div style={{ fontSize: 28, color: C.green, fontWeight: 700, fontFamily: 'CrimsonPro, serif' }}>+45 ↑</div>
          </div>

          <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: 'visible', marginBottom: 6 }}>
            <defs>
              <filter id="gGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Y-axis labels */}
            {[61, 28, -5].map((v, i) => (
              <text key={i} x="-4" y={svgH - ((v + 5) / 70) * svgH + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.3)" fontFamily="HostGrotesk">{v}</text>
            ))}
            <polyline points={coords.join(' ')} fill="none" stroke={C.green} strokeWidth="2.5" strokeLinejoin="round" filter="url(#gGlow)" />
            {coords.map((c, i) => { const [x, y] = c.split(',').map(Number); return <circle key={i} cx={x} cy={y} r="4" fill={C.green} /> })}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            {days.map(d => <span key={d} style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'HostGrotesk' }}>{d}</span>)}
          </div>
          <div style={{ textAlign: 'right', fontSize: 18, color: C.green, fontWeight: 700, fontFamily: 'CrimsonPro, serif', marginBottom: 14 }}>+45 ↗</div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 14 }} />

          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 8 }}>ⓘ ABOUT</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 12 }}>The muscles along the back of your thigh. They bend your knee and drive your hips through each stride.</div>

          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 8 }}>⟡ STRETCH IT</div>
          {['Seated forward fold', 'Standing toe-touch', 'Lying single-leg stretch with a strap'].map(s => (
            <div key={s} style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', paddingLeft: 12, marginBottom: 6 }}>• {s}</div>
          ))}
        </div>
      </div>
      <BottomTabs active="spotlight" />
    </div>
  )
}

// ─── BODY screen ──────────────────────────────────────────────────
function BodyScreen() {
  const zones = [
    { label: 'Left Hamstring', status: 'Improving', color: C.green, score: '+45', bar: 82 },
    { label: 'Right Knee', status: 'Watch closely', color: C.amber, score: '–12', bar: 38 },
    { label: 'Lower Back', status: 'Stable', color: 'rgba(255,255,255,0.5)', score: '0', bar: 60 },
    { label: 'Left Shoulder', status: 'Improving', color: C.green, score: '+8', bar: 70 },
    { label: 'Right Hip', status: 'Needs attention', color: '#ff6b6b', score: '–23', bar: 28 },
    { label: 'Right Ankle', status: 'Stable', color: 'rgba(255,255,255,0.5)', score: '+2', bar: 58 },
  ]
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'auto', background: '#020410' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0d1840 0%, #060e28 40%, #020410 100%)' }} />
      <div style={{ position: 'relative', zIndex: 2, padding: '50px 16px 80px', minHeight: '100%' }}>
        <div style={{ fontSize: 30, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: '#fff', marginBottom: 4 }}>Body</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 18 }}>Your movement map — updated daily</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {zones.map((z, i) => (
            <motion.div key={z.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{z.label}</div>
                  <div style={{ fontSize: 11, color: z.color, marginTop: 2 }}>{z.status}</div>
                </div>
                <div style={{ fontSize: 20, color: z.color, fontWeight: 700, fontFamily: 'CrimsonPro, serif' }}>{z.score}</div>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${z.bar}%`, height: '100%', background: z.color, borderRadius: 2 }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <BottomTabs active="body" />
    </div>
  )
}

// ─── CHAT screen ──────────────────────────────────────────────────
function ChatScreen() {
  const messages = [
    { from: 'user', text: 'Why is my left hamstring flagged?' },
    { from: 'jeani', text: 'Your left hamstring jumped +45 points this week — impressive progress, but rapid gains can sometimes indicate your body is compensating for another area. Worth keeping an eye on over the next few days.' },
    { from: 'user', text: 'What should I do today?' },
    { from: 'jeani', text: 'Motion score 74 — you\'re in solid shape and ready to push. A moderate run works well. Just add a hamstring stretch routine afterwards to balance the load.' },
  ]
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (shown >= messages.length) return
    const t = setTimeout(() => setShown(s => s + 1), shown === 0 ? 400 : 1200)
    return () => clearTimeout(t)
  }, [shown])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#04060f', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0a1030 0%, #060a20 50%, #020610 100%)' }} />
      <div style={{ position: 'relative', zIndex: 2, padding: '52px 0 72px', display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
        {/* Chat header */}
        <div style={{ padding: '0 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${C.blue}, #1a40c0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: '#fff' }}>J</div>
          <div>
            <div style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>Ask Jeani</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Active now</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.slice(0, shown).map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              style={{
                alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%',
                background: m.from === 'user' ? 'rgba(17,35,120,0.7)' : 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${m.from === 'user' ? 'rgba(60,90,200,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: m.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '10px 14px', fontSize: 12, color: '#fff', lineHeight: 1.65,
              }}>
              {m.text}
            </motion.div>
          ))}
          {shown < messages.length && shown > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px 18px 18px 4px', padding: '10px 16px' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: '0 16px', marginTop: 'auto' }}>
          <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 28, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>Ask anything about your movement…</span>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.sand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: C.blue, fontWeight: 700, flexShrink: 0 }}>↑</div>
          </div>
        </div>
      </div>
      <BottomTabs active="chat" />
    </div>
  )
}

// ─── STREAK screen ────────────────────────────────────────────────
function StreakScreen() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'auto', background: '#0c0200' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #3a1000 0%, #1a0800 40%, #080200 100%)' }} />
      <div style={{ position: 'absolute', top: '10%', left: '20%', width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${C.amber}55 0%, transparent 70%)`, filter: 'blur(40px)' }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '52px 16px 80px', display: 'flex', flexDirection: 'column', gap: 16, minHeight: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 52, lineHeight: 1 }}>🔥</div>
          <div style={{ fontSize: 88, fontFamily: 'CrimsonPro, serif', fontWeight: 700, color: C.amber, lineHeight: 0.9, letterSpacing: -4, marginTop: 8 }}>8</div>
          <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', marginTop: 6 }}>day streak</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '16px 18px' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 12 }}>THIS WEEK</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {days.map((d, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: i < 6 ? C.amber : 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: i < 6 ? '#000' : 'rgba(255,255,255,0.2)', boxShadow: i < 6 ? `0 0 12px ${C.amber}66` : 'none', fontWeight: 700 }}>
                  {i < 6 ? '✓' : ''}
                </div>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'HostGrotesk' }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: `rgba(245,160,0,0.08)`, border: `1px solid rgba(245,160,0,0.2)`, borderRadius: 18, padding: '16px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: C.amber, fontStyle: 'italic', fontFamily: 'CrimsonPro, serif', lineHeight: 1.5 }}>"Consistency is the only metric that compounds."</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {[['Best streak', '14 days'], ['This month', '22 / 31'], ['All time', '8 🔥']].map(([k, v]) => (
              <div key={k} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, color: '#fff', fontWeight: 700, fontFamily: 'CrimsonPro, serif' }}>{v}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomTabs active="streak" />
    </div>
  )
}

const SCREENS = {
  home: HomeScreen, motion: MotionScreen, goal: GoalScreen,
  spotlight: SpotlightScreen, body: BodyScreen, chat: ChatScreen, streak: StreakScreen,
}

// ─── Large phone frame ────────────────────────────────────────────
function PhoneFrame({ featureId, screenshot }) {
  const Screen = SCREENS[featureId]
  const [useScreenshot, setUseScreenshot] = useState(!!screenshot)

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -30, opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: 340, height: 680,
        borderRadius: 52,
        background: '#080c18',
        position: 'relative',
        flexShrink: 0,
        boxShadow: '0 60px 120px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.12), 0 0 0 2px rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.06)',
      }}>
      {/* Side buttons */}
      <div style={{ position: 'absolute', left: -3, top: 120, width: 3, height: 36, background: 'rgba(255,255,255,0.15)', borderRadius: '2px 0 0 2px' }} />
      <div style={{ position: 'absolute', left: -3, top: 170, width: 3, height: 60, background: 'rgba(255,255,255,0.15)', borderRadius: '2px 0 0 2px' }} />
      <div style={{ position: 'absolute', left: -3, top: 244, width: 3, height: 60, background: 'rgba(255,255,255,0.15)', borderRadius: '2px 0 0 2px' }} />
      <div style={{ position: 'absolute', right: -3, top: 170, width: 3, height: 80, background: 'rgba(255,255,255,0.15)', borderRadius: '0 2px 2px 0' }} />

      {/* Screen area */}
      <div style={{ position: 'absolute', inset: 8, borderRadius: 46, overflow: 'hidden', background: '#000' }}>
        {/* Dynamic island */}
        <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 120, height: 34, background: '#000', borderRadius: 20, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1a1a1a', border: '1px solid #2a2a2a' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#111', border: '1px solid #222' }} />
        </div>

        {screenshot && useScreenshot ? (
          <img src={screenshot} alt="" onError={() => setUseScreenshot(false)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
        ) : (
          <Screen />
        )}
      </div>

      {/* Screen reflection */}
      <div style={{ position: 'absolute', inset: 8, borderRadius: 46, background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 10 }} />
    </motion.div>
  )
}

// ─── THE APP section ──────────────────────────────────────────────
function TheApp() {
  const [activeIdx, setActiveIdx] = useState(0)
  const feat = FEATURES[activeIdx]
  const canPrev = activeIdx > 0
  const canNext = activeIdx < FEATURES.length - 1

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: feat.base }}>
      {/* Track grad background */}
      <img src={feat.grad} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4, mixBlendMode: 'screen', zIndex: 0 }} />
      <Orb color={feat.orb1} size={600} x="35%" y="40%" opacity={0.55} />
      <Orb color={feat.orb2} size={280} x="75%" y="65%" opacity={0.18} />
      <Grain opacity={0.11} blend="overlay" />

      {/* Feature name — top centre */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 52, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 28, zIndex: 10 }}>
        <AnimatePresence mode="wait">
          <motion.div key={feat.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.35 }}
            style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 48, fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: -1.5, textShadow: '0 4px 40px rgba(0,0,0,0.6)' }}>{feat.label}</div>
            <div style={{ fontFamily: 'CrimsonPro, serif', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>{feat.tagline}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next arrows */}
      {canPrev && (
        <button onClick={() => setActiveIdx(i => i - 1)}
          style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 20, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          ‹
        </button>
      )}
      {canNext && (
        <button onClick={() => setActiveIdx(i => i + 1)}
          style={{ position: 'absolute', right: 78, top: '50%', transform: 'translateY(-50%)', zIndex: 20, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          ›
        </button>
      )}

      {/* Phone — centred */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 8, paddingTop: 100, paddingBottom: 60, paddingRight: 52 }}>
        <AnimatePresence mode="wait">
          <PhoneFrame key={feat.id} featureId={feat.id} screenshot={feat.screenshot} />
        </AnimatePresence>
      </div>

      {/* Feature dots — bottom */}
      <div style={{ position: 'absolute', bottom: 20, left: 0, right: 52, display: 'flex', justifyContent: 'center', gap: 8, zIndex: 10 }}>
        {FEATURES.map((f, i) => (
          <button key={f.id} onClick={() => setActiveIdx(i)}
            style={{ width: i === activeIdx ? 24 : 6, height: 6, borderRadius: 3, background: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.25)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s' }} />
        ))}
      </div>
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
    <div style={{ width: '100%', height: '100%', background: '#f0ebe0', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <Grain opacity={0.05} blend="multiply" />
      <div style={{ flex: 1, display: 'flex', zIndex: 1 }}>
        <div style={{ width: '38%', background: '#060c20', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: 44 }}>
          <img src="/gradients/Track Grad-10.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45, mixBlendMode: 'screen' }} />
          <Orb color="#1030a0" size={500} x="50%" y="40%" opacity={0.6} />
          <Grain opacity={0.14} blend="overlay" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ position: 'relative', zIndex: 4 }}>
            <img src="/logos/Jeani Wordmark White.png" style={{ height: 32, marginBottom: 24 }} alt="Jeani" />
            <div style={{ fontFamily: 'CrimsonPro, serif', fontStyle: 'italic', fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75 }}>
              "Built with leading movement scientists and physicians to deliver insights athletes and everyday movers can actually trust."
            </div>
          </motion.div>
        </div>
        <div style={{ flex: 1, padding: '52px 56px 28px' }}>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 46, fontWeight: 700, color: C.blue, lineHeight: 1.05, marginBottom: 14 }}>Critically acclaimed.<br />Backed by science.</div>
            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.75, marginBottom: 36, maxWidth: 460 }}>Jeani combines clinical-grade movement analysis with personalised AI coaching — turning daily data into decisions that protect your body and elevate your performance.</div>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.13 }}
                style={{ background: C.blue, borderRadius: 18, padding: '18px 24px', display: 'flex', gap: 22, alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <Grain opacity={0.08} blend="overlay" />
                <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 22, fontWeight: 700, color: C.sand, minWidth: 52, lineHeight: 1 }}>{s.num}</div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 12, color: C.sand, fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(251,236,207,0.6)', lineHeight: 1.55 }}>{s.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: C.blue, padding: '16px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', zIndex: 1 }}>
        <Grain opacity={0.1} blend="overlay" />
        <div style={{ fontFamily: 'CrimsonPro, serif', fontStyle: 'italic', fontSize: 15, color: C.sand, position: 'relative', zIndex: 1 }}>Accurate by design — Jeani reads movement where it matters most.</div>
        <img src="/logos/Jeani Wordmark Sand White.png" style={{ height: 22, position: 'relative', zIndex: 1 }} alt="Jeani" />
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
    <div style={{ width: '100%', height: '100%', background: '#050a18', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 64px' }}>
      <img src="/gradients/Track Grad-09.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35, mixBlendMode: 'screen' }} />
      <Orb color="#112378" size={700} x="50%" y="55%" opacity={0.5} />
      <Grain opacity={0.12} blend="overlay" />
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 52, position: 'relative', zIndex: 4 }}>
        <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 48, fontWeight: 700, color: '#fff', lineHeight: 1 }}>How it works</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 10 }}>From download to daily insight — three steps.</div>
      </motion.div>
      <div style={{ display: 'flex', gap: 24, width: '100%', maxWidth: 900, position: 'relative', zIndex: 4 }}>
        {steps.map((s, i) => (
          <motion.div key={s.num} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.18 }}
            style={{ flex: 1, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', borderRadius: 26, padding: 32, border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}>
            <Grain opacity={0.07} blend="overlay" />
            <div style={{ fontSize: 36, marginBottom: 16 }}>{s.icon}</div>
            <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 13, color: C.sand, fontWeight: 600, marginBottom: 8, letterSpacing: 1.5 }}>{s.num}</div>
            <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 14, lineHeight: 1.1 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>{s.desc}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 4 }}>
        <span style={{ fontSize: 18 }}>⌚</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>Requires Apple Watch Series 4 or later · iOS 16+</span>
      </motion.div>
    </div>
  )
}

// ─── PLANS ────────────────────────────────────────────────────────
function Plans() {
  const [billing, setBilling] = useState('monthly')
  const free = ['Motion Score (daily)', 'Motion Goal tracker', '7-day history', 'Apple Watch sync', 'Basic insights']
  const pro = ['Everything in Free', 'Spotlight — muscle insights', 'Ask Jeani (AI coach)', '90-day history', 'Streak tracking & milestones', 'Priority support']
  return (
    <div style={{ width: '100%', height: '100%', background: '#f0ebe0', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 64px' }}>
      <Grain opacity={0.06} blend="multiply" />
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 36, position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 48, fontWeight: 700, color: C.blue, lineHeight: 1 }}>Movement is Medicine.</div>
        <div style={{ fontSize: 14, color: '#999', marginTop: 10 }}>Choose the plan that moves with you.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 22, background: 'rgba(17,35,120,0.08)', borderRadius: 30, padding: 4, width: 'fit-content', margin: '22px auto 0' }}>
          {['monthly', 'annual'].map(b => (
            <button key={b} onClick={() => setBilling(b)}
              style={{ padding: '9px 24px', borderRadius: 26, border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'HostGrotesk', fontWeight: 600, transition: 'all 0.25s', background: billing === b ? C.blue : 'transparent', color: billing === b ? '#fff' : '#888' }}>
              {b === 'monthly' ? 'Monthly' : (
                <span>Annual <span style={{ marginLeft: 6, background: C.green, color: '#000', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10, verticalAlign: 'middle' }}>SAVE 17%</span></span>
              )}
            </button>
          ))}
        </div>
      </motion.div>
      <div style={{ display: 'flex', gap: 24, width: '100%', maxWidth: 700, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, x: -26 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          style={{ flex: 1, background: '#fff', borderRadius: 28, padding: 32, border: '1.5px solid rgba(17,35,120,0.1)', boxShadow: '0 4px 30px rgba(0,0,0,0.07)', position: 'relative', overflow: 'hidden' }}>
          <Grain opacity={0.04} blend="multiply" />
          <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 30, fontWeight: 700, color: C.blue, marginBottom: 8 }}>Free</div>
          <div style={{ fontSize: 44, fontFamily: 'CrimsonPro, serif', color: C.blue, fontWeight: 700, lineHeight: 1, marginBottom: 26 }}>$0</div>
          {free.map(f => (
            <div key={f} style={{ display: 'flex', gap: 11, alignItems: 'center', marginBottom: 13 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: `${C.blue}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: C.blue, flexShrink: 0 }}>✓</div>
              <span style={{ fontSize: 13, color: '#555' }}>{f}</span>
            </div>
          ))}
          <button style={{ width: '100%', marginTop: 26, padding: '14px', borderRadius: 14, border: `2px solid ${C.blue}`, background: 'transparent', color: C.blue, fontSize: 14, fontWeight: 700, fontFamily: 'HostGrotesk', cursor: 'pointer' }}>Get Started</button>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.32 }}
          style={{ flex: 1, background: C.blue, borderRadius: 28, padding: 32, boxShadow: '0 14px 52px rgba(17,35,120,0.35)', position: 'relative', overflow: 'hidden' }}>
          <img src="/gradients/Track Grad-08.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.28, mixBlendMode: 'screen' }} />
          <Orb color="#1a40c0" size={300} x="85%" y="15%" opacity={0.4} />
          <Grain opacity={0.1} blend="overlay" />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontFamily: 'CrimsonPro, serif', fontSize: 30, fontWeight: 700, color: C.sand }}>Pro</div>
              <div style={{ background: C.amber, borderRadius: 20, padding: '4px 14px', fontSize: 10, color: '#000', fontWeight: 700 }}>POPULAR</div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={billing} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
                <div style={{ fontSize: 44, fontFamily: 'CrimsonPro, serif', color: C.sand, fontWeight: 700, lineHeight: 1 }}>
                  {billing === 'monthly' ? '$9.99' : '$99.99'}
                  <span style={{ fontSize: 16, fontWeight: 400, color: 'rgba(251,236,207,0.5)' }}>{billing === 'monthly' ? '/mo' : '/yr'}</span>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(251,236,207,0.4)', marginBottom: 26, marginTop: 4 }}>
                  {billing === 'monthly' ? 'First month free' : '$8.33/mo · first month free'}
                </div>
              </motion.div>
            </AnimatePresence>
            {pro.map(f => (
              <div key={f} style={{ display: 'flex', gap: 11, alignItems: 'center', marginBottom: 13 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: `${C.sand}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: C.sand, flexShrink: 0 }}>✓</div>
                <span style={{ fontSize: 13, color: C.sand }}>{f}</span>
              </div>
            ))}
            <button style={{ width: '100%', marginTop: 26, padding: '14px', borderRadius: 14, border: 'none', background: C.sand, color: C.blue, fontSize: 14, fontWeight: 700, fontFamily: 'HostGrotesk', cursor: 'pointer' }}>Go Pro</button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Particles ────────────────────────────────────────────────────
function Particles() {
  const p = useRef(Array.from({ length: 55 }, () => ({ x: Math.random() * 100, y: Math.random() * 100, s: Math.random() * 2 + 0.5, d: Math.random() * 5 + 3, dl: Math.random() * 4 })))
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {p.current.map((pt, i) => (
        <motion.div key={i} animate={{ y: [0, -20, 0], opacity: [0.1, 0.5, 0.1] }} transition={{ duration: pt.d, repeat: Infinity, delay: pt.dl, ease: 'easeInOut' }}
          style={{ position: 'absolute', left: `${pt.x}%`, top: `${pt.y}%`, width: pt.s, height: pt.s, borderRadius: '50%', background: 'rgba(251,236,207,0.5)' }} />
      ))}
    </div>
  )
}

// ─── INTRO ────────────────────────────────────────────────────────
function Intro({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3800); return () => clearTimeout(t) }, [onDone])
  return (
    <motion.div exit={{ opacity: 0, transition: { duration: 0.9 } }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#03050f' }}>
      <img src="/gradients/Track Grad-08.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55, mixBlendMode: 'screen' }} />
      <Orb color="#0d2080" size={800} x="40%" y="55%" opacity={0.65} />
      <Orb color={C.amber} size={320} x="72%" y="58%" opacity={0.16} />
      <Grain opacity={0.16} blend="overlay" />
      <Particles />
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center' }}>
        <motion.img src="/logos/Jeani Wordmark White.png" alt="Jeani" initial={{ opacity: 0, scale: 0.85, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 72, marginBottom: 30, filter: 'drop-shadow(0 0 50px rgba(255,255,255,0.15))' }} />
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.9 }}
          style={{ fontFamily: 'CrimsonPro, serif', fontStyle: 'italic', fontSize: 26, color: C.sand, letterSpacing: 0.3, textShadow: '0 0 50px rgba(251,236,207,0.25)' }}>
          Movement is Medicine.
        </motion.div>
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.5 }} onClick={onDone}
          style={{ marginTop: 52, background: 'rgba(251,236,207,0.07)', border: '1px solid rgba(251,236,207,0.18)', color: 'rgba(251,236,207,0.65)', borderRadius: 30, padding: '12px 36px', fontSize: 11, fontFamily: 'HostGrotesk', cursor: 'pointer', letterSpacing: 2.5, backdropFilter: 'blur(10px)' }}>
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
      <div style={{ width: 54, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(255,255,255,0.05)', zIndex: 50, flexShrink: 0 }}>
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            style={{ flex: 1, background: i === activeTab ? 'rgba(17,35,120,0.65)' : 'transparent', border: 'none', borderLeft: i === activeTab ? `2px solid ${C.sand}` : '2px solid transparent', cursor: 'pointer', transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 8.5, fontFamily: 'HostGrotesk', fontWeight: i === activeTab ? 700 : 400, letterSpacing: 2, color: i === activeTab ? C.sand : 'rgba(255,255,255,0.28)', transition: 'all 0.25s' }}>
              {tab}
            </span>
          </button>
        ))}
        <div style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => setShowIntro(true)}
            style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
