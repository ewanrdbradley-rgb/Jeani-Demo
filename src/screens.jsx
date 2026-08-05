/* ══════════════════════════════════════════════════════════════════
   SCREENS: the phone shell, coded in-app screens, and the interactive
   data widgets that sit beside them in the narrative.

   Screens are coded rather than screenshotted wherever the visitor
   should be able to poke at them (Radar, the six signals, the day
   chart). Static screenshots live in public/screenshots.
══════════════════════════════════════════════════════════════════ */
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Grain, useIsMobile } from './brand.jsx'
import { C, F, EASE, SIGNALS, JOINTS, DAY } from './tokens.js'

/* ── Phone frame ─────────────────────────────────────────────────── */
export function Phone({ children, width = 300, style }) {
  const h = width * 2.06
  return (
    <div style={{ width,height:h,borderRadius:width*0.155,background:'#06080f',position:'relative',flexShrink:0,
      boxShadow:`0 40px 90px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.18)`,
      ...style }}>
      {/* Side buttons */}
      <div style={{ position:'absolute',left:-3,top:'17%',width:3,height:'5%',background:'rgba(255,255,255,0.15)',borderRadius:'2px 0 0 2px' }} />
      <div style={{ position:'absolute',left:-3,top:'25%',width:3,height:'9%',background:'rgba(255,255,255,0.15)',borderRadius:'2px 0 0 2px' }} />
      <div style={{ position:'absolute',left:-3,top:'36%',width:3,height:'9%',background:'rgba(255,255,255,0.15)',borderRadius:'2px 0 0 2px' }} />
      <div style={{ position:'absolute',right:-3,top:'25%',width:3,height:'12%',background:'rgba(255,255,255,0.15)',borderRadius:'0 2px 2px 0' }} />
      {/* Screen */}
      <div style={{ position:'absolute',inset:width*0.026,borderRadius:width*0.135,overflow:'hidden',background:'#000' }}>
        <div style={{ position:'absolute',top:width*0.033,left:'50%',transform:'translateX(-50%)',
          width:width*0.37,height:width*0.1,background:'#000',borderRadius:width*0.06,zIndex:30 }} />
        {children}
      </div>
      {/* Glass reflection */}
      <div style={{ position:'absolute',inset:width*0.026,borderRadius:width*0.135,pointerEvents:'none',zIndex:10,
        background:'linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 42%)' }} />
    </div>
  )
}

/* Screenshot inside a phone, with a graceful fallback if the file is missing */
export function Shot({ src, alt = '' }) {
  const [err, setErr] = useState(false)
  if (err) return <div style={{ width:'100%',height:'100%',background:C.navyDeep }} />
  return <img src={src} alt={alt} onError={() => setErr(true)}
    style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'top center',display:'block' }} />
}


const bandColor = v => (v >= 70 ? C.green : v >= 50 ? C.amber : C.red)

/** Interactive six-signal grid: click a signal to read what it measures. */
export function SignalGrid({ compact = false }) {
  const [sel, setSel] = useState('joints')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const active = SIGNALS.find(s => s.key === sel)
  // Three across is too tight to fit a label and a two-digit score on a phone
  const narrow = useIsMobile(560)

  return (
    <div ref={ref}>
      <div style={{ display:'grid',
        gridTemplateColumns:`repeat(${narrow ? 2 : 3}, minmax(0, 1fr))`,gap:compact ? 8 : 12 }}>
        {SIGNALS.map((s, i) => {
          const on = s.key === sel
          const col = bandColor(s.value)
          return (
            <motion.button key={s.key}
              onClick={() => setSel(s.key)}
              initial={{ opacity:0, y:18 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.55, ease: EASE }}
              style={{ textAlign:'left',cursor:'pointer',padding:compact ? '12px 14px' : '16px 18px',
                borderRadius:16,border:`1px solid ${on ? `${col}99` : C.glassEdgeSoft}`,
                background: on ? `${col}1f` : C.glassFillSoft,
                backdropFilter:C.glassBlur,WebkitBackdropFilter:C.glassBlur,
                boxShadow:'inset 0 1px 0 rgba(255,255,255,0.16)',
                transition:'background 0.25s, border-color 0.25s' }}>
              <div style={{ display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:9 }}>
                <span style={{ fontFamily:F.body,fontSize:compact ? 13 : 15,fontWeight:600,
                  color: on ? '#fff' : 'rgba(255,255,255,0.72)' }}>{s.label}</span>
                <span style={{ fontFamily:F.display,fontSize:compact ? 20 : 24,fontWeight:700,color:col,lineHeight:1 }}>
                  {s.value}
                </span>
              </div>
              <div style={{ height:3,borderRadius:2,background:'rgba(255,255,255,0.1)',overflow:'hidden' }}>
                <motion.div
                  initial={{ width:0 }}
                  animate={inView ? { width:`${s.value}%` } : {}}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.9, ease: EASE }}
                  style={{ height:'100%',background:col,borderRadius:2 }} />
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Blurb for the selected signal */}
      <div style={{ marginTop:18,minHeight:52,display:'flex',alignItems:'center',gap:14 }}>
        <div style={{ width:3,alignSelf:'stretch',borderRadius:2,background:bandColor(active.value) }} />
        <AnimatePresence mode="wait">
          <motion.div key={active.key}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
            transition={{ duration:0.28 }}>
            <div style={{ fontFamily:F.display,fontSize:22,fontWeight:700,color:'#fff',lineHeight:1.15 }}>
              {active.label}
            </div>
            <div style={{ fontFamily:F.body,fontSize:14.5,color:'rgba(255,255,255,0.62)',marginTop:3 }}>
              {active.blurb.charAt(0).toUpperCase() + active.blurb.slice(1)}.
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MOVEMENT TODAY: the day curve from the app's home card
══════════════════════════════════════════════════════════════════ */

export function MovementToday({ height = 200 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const [hover, setHover] = useState(null)
  const W = 560, H = height, PADX = 34, PADY = 22

  const pt = (d, i) => ({
    x: PADX + (i / (DAY.length - 1)) * (W - PADX * 2),
    y: PADY + (1 - d.v) * (H - PADY * 2),
  })
  const pts = DAY.map(pt)
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const area = `${path} L${pts.at(-1).x},${H - PADY} L${pts[0].x},${H - PADY} Z`

  return (
    <div ref={ref} style={{ position:'relative',width:'100%' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%',height:'auto',display:'block',overflow:'visible' }}>
        <defs>
          <linearGradient id="dayfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.green} stopOpacity="0.3" />
            <stop offset="100%" stopColor={C.green} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Bands */}
        {[['High', 0], ['Mid', 0.5], ['Low', 1]].map(([lab, f]) => {
          const y = PADY + f * (H - PADY * 2)
          return (
            <g key={lab}>
              <line x1={PADX} y1={y} x2={W - PADX} y2={y} stroke="rgba(255,255,255,0.11)" strokeWidth="1" />
              <text x={0} y={y + 4} fill="rgba(255,255,255,0.4)" fontSize="12" fontFamily={F.body}>{lab}</text>
            </g>
          )
        })}

        {/* Now marker */}
        <line x1={pts.at(-1).x} y1={PADY - 8} x2={pts.at(-1).x} y2={H - PADY}
          stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="4 4" />
        <text x={pts.at(-1).x - 8} y={PADY - 2} textAnchor="end"
          fill="rgba(255,255,255,0.6)" fontSize="12" fontFamily={F.body}>4:04pm</text>

        {/* Area + line */}
        <motion.path d={area} fill="url(#dayfill)"
          initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}} transition={{ delay:0.9, duration:0.8 }} />
        <motion.path d={path} fill="none" stroke={C.green} strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength:0 }} animate={inView ? { pathLength:1 } : {}}
          transition={{ duration:1.6, ease:EASE }} />

        {/* Points */}
        {pts.map((p, i) => (
          <motion.circle key={i} cx={p.x} cy={p.y} r={hover === i ? 6 : 4}
            fill={hover === i ? '#fff' : C.night} stroke={C.green} strokeWidth="2"
            initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}}
            transition={{ delay: 0.5 + i * 0.06, duration:0.3 }}
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            style={{ cursor:'pointer' }} />
        ))}

        {/* Live pulse on the latest reading */}
        {inView && (
          <motion.circle cx={pts.at(-1).x} cy={pts.at(-1).y} r="4" fill="none" stroke={C.green}
            animate={{ r:[4, 16], opacity:[0.7, 0] }}
            transition={{ duration:2, repeat:Infinity, ease:'easeOut' }} />
        )}

        {/* Axis */}
        {[0, 4, 8, 13].map(i => (
          <text key={i} x={pts[i].x} y={H - 2} fill="rgba(255,255,255,0.4)" fontSize="12"
            fontFamily={F.body} textAnchor="middle">{DAY[i].t}</text>
        ))}
      </svg>

      {hover !== null && (
        <div style={{ position:'absolute',left:`${(pts[hover].x / W) * 100}%`,top:`${(pts[hover].y / H) * 100}%`,
          transform:'translate(-50%,-150%)',background:'rgba(5,6,15,0.94)',border:`1px solid ${C.green}55`,
          borderRadius:9,padding:'5px 10px',fontSize:12,fontFamily:F.body,whiteSpace:'nowrap',pointerEvents:'none' }}>
          {DAY[hover].t} · {Math.round(DAY[hover].v * 100)}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   INJURY RADAR: coded, because the visitor should be able to probe it
══════════════════════════════════════════════════════════════════ */

const STATUS = {
  clear:    { color:C.electric, label:'Clear' },
  watch:    { color:C.amber,    label:'Watch' },
  elevated: { color:C.red,      label:'Elevated' },
}

/** Polar joint-load plot. `interactive` adds hover probing and labels. */
export function RadarPlot({ size = 260, interactive = true, showLabels = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [hover, setHover] = useState(null)
  const cx = size / 2, cy = size / 2, R = size * 0.33

  const at = (angle, r) => {
    const a = (angle * Math.PI) / 180
    return { x: cx + Math.cos(a) * r, y: cy - Math.sin(a) * r }
  }
  // Draw order runs around the hexagon so the polygon does not self-cross
  const ring = [...JOINTS].sort((a, b) => b.angle - a.angle)
  const poly = ring.map(j => {
    const p = at(j.angle, R * (j.value / 100))
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`
  }).join(' ')

  return (
    <div ref={ref} style={{ position:'relative',width:size,height:size }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width:'100%',height:'100%',overflow:'visible' }}>
        <defs>
          <radialGradient id="radarfill">
            <stop offset="0%" stopColor={C.ice} stopOpacity="0.5" />
            <stop offset="100%" stopColor={C.electric} stopOpacity="0.22" />
          </radialGradient>
        </defs>

        {/* Graticule */}
        {[0.35, 0.6, 0.85, 1].map(f => (
          <circle key={f} cx={cx} cy={cy} r={R * f} fill="none"
            stroke="rgba(214,228,255,0.22)" strokeWidth="0.8" />
        ))}
        {JOINTS.map(j => {
          const p = at(j.angle, R)
          return <line key={j.key} x1={cx} y1={cy} x2={p.x} y2={p.y}
            stroke="rgba(214,228,255,0.18)" strokeWidth="0.8" />
        })}

        {/* Load shape */}
        <motion.polygon points={poly} fill="url(#radarfill)" stroke={C.ice} strokeWidth="2"
          strokeLinejoin="round"
          initial={{ opacity:0, scale:0.6 }} animate={inView ? { opacity:1, scale:1 } : {}}
          transition={{ duration:1, ease:EASE, delay:0.2 }}
          style={{ originX:`${cx}px`, originY:`${cy}px` }} />

        {/* Joint nodes */}
        {JOINTS.map((j, i) => {
          const p = at(j.angle, R * (j.value / 100))
          const st = STATUS[j.status]
          const on = hover === j.key
          return (
            <g key={j.key}>
              {j.status !== 'clear' && inView && (
                <motion.circle cx={p.x} cy={p.y} r="5" fill="none" stroke={st.color}
                  animate={{ r:[5, 15], opacity:[0.8, 0] }}
                  transition={{ duration:2.2, repeat:Infinity, ease:'easeOut' }} />
              )}
              <motion.circle cx={p.x} cy={p.y} r={on ? 7.5 : 5.4}
                fill={st.color} stroke={C.night} strokeWidth="1.6"
                initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}}
                transition={{ delay:0.6 + i * 0.08, duration:0.35 }}
                onMouseEnter={() => interactive && setHover(j.key)}
                onMouseLeave={() => interactive && setHover(null)}
                style={{ cursor: interactive ? 'pointer' : 'default' }} />
            </g>
          )
        })}

        {/* Axis labels */}
        {showLabels && JOINTS.map(j => {
          const p = at(j.angle, R * 1.34)
          const anchor = Math.abs(Math.cos((j.angle * Math.PI) / 180)) < 0.2
            ? 'middle' : (Math.cos((j.angle * Math.PI) / 180) > 0 ? 'start' : 'end')
          return (
            <text key={j.key} x={p.x} y={p.y + 4} textAnchor={anchor}
              fill={hover === j.key ? '#fff' : 'rgba(255,255,255,0.5)'}
              fontSize={size * 0.043} fontFamily={F.body}>{j.label}</text>
          )
        })}
      </svg>

      {/* Probe readout */}
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:6 }}
            transition={{ duration:0.2 }}
            style={{ position:'absolute',left:'50%',bottom:-6,transform:'translateX(-50%)',
              background:'rgba(5,6,15,0.95)',border:`1px solid ${STATUS[JOINTS.find(j => j.key === hover).status].color}66`,
              borderRadius:11,padding:'7px 14px',whiteSpace:'nowrap',pointerEvents:'none',
              display:'flex',alignItems:'center',gap:9 }}>
            {(() => {
              const j = JOINTS.find(x => x.key === hover)
              return (
                <>
                  <span style={{ width:7,height:7,borderRadius:'50%',background:STATUS[j.status].color }} />
                  <span style={{ fontFamily:F.body,fontSize:13,color:'#fff' }}>{j.label}</span>
                  <span style={{ fontFamily:F.display,fontSize:16,fontWeight:700,color:STATUS[j.status].color }}>{j.value}</span>
                  <span style={{ fontFamily:F.body,fontSize:11.5,color:'rgba(255,255,255,0.45)',letterSpacing:1,textTransform:'uppercase' }}>
                    {STATUS[j.status].label}
                  </span>
                </>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function RadarLegend() {
  return (
    <div style={{ display:'flex',gap:18,flexWrap:'wrap' }}>
      {Object.values(STATUS).map(s => (
        <div key={s.label} style={{ display:'flex',alignItems:'center',gap:7 }}>
          <span style={{ width:7,height:7,borderRadius:'50%',background:s.color }} />
          <span style={{ fontFamily:F.body,fontSize:12.5,color:'rgba(255,255,255,0.5)' }}>{s.label}</span>
        </div>
      ))}
    </div>
  )
}

/* In-phone tab bar: mirrors the app's four tabs */
function TabBar({ active = 'radar' }) {
  const tabs = [
    { id:'home', label:'Home', d:'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z' },
    { id:'motion', label:'Motion', d:'M13 2 4 14h6l-1 8 9-12h-6z' },
    { id:'radar', label:'Radar', d:'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0 M12 12 19 7' },
    { id:'spotlight', label:'Spotlight', d:'M12 3v3m0 12v3M3 12h3m12 0h3M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0' },
  ]
  return (
    <div style={{ position:'absolute',bottom:0,left:0,right:0,height:64,background:'rgba(4,6,20,0.9)',
      backdropFilter:'blur(20px)',borderTop:'1px solid rgba(214,228,255,0.1)',display:'flex',zIndex:20 }}>
      {tabs.map(t => {
        const on = t.id === active
        return (
          <div key={t.id} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke={on ? C.ice : 'rgba(255,255,255,0.34)'} strokeWidth="1.7" strokeLinejoin="round">
              <path d={t.d} />
            </svg>
            <span style={{ fontSize:9,fontFamily:F.body,fontWeight:on ? 600 : 400,
              color:on ? C.ice : 'rgba(255,255,255,0.32)' }}>{t.label}</span>
          </div>
        )
      })}
    </div>
  )
}

/** Full Injury Radar screen, live inside the phone frame. */
export function RadarScreen() {
  return (
    <div style={{ width:'100%',height:'100%',position:'relative',overflow:'hidden',background:C.night }}>
      <img src="/run-dusk.jpg" alt="" style={{ position:'absolute',inset:0,width:'100%',height:'100%',
        objectFit:'cover',opacity:0.4 }} />
      <div style={{ position:'absolute',inset:0,background:`linear-gradient(180deg, ${C.navyDeep}dd 0%, #04061acc 55%, ${C.night} 100%)` }} />
      <Grain op={0.1} z={1} />

      <div style={{ position:'relative',zIndex:3,height:'100%',padding:'52px 16px 70px',display:'flex',flexDirection:'column',gap:10 }}>
        <div>
          <div style={{ fontFamily:F.display,fontSize:23,fontWeight:700,color:'#fff' }}>Injury Radar</div>
          <div style={{ display:'flex',alignItems:'center',gap:6,marginTop:4 }}>
            <span style={{ width:6,height:6,borderRadius:'50%',background:C.amber }} />
            <span style={{ fontFamily:F.body,fontSize:11,color:'rgba(255,255,255,0.55)' }}>1 area to watch</span>
          </div>
        </div>

        <div style={{ background:'rgba(255,255,255,0.06)',border:'1px solid rgba(214,228,255,0.12)',
          borderRadius:12,padding:'9px 12px',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <span style={{ fontFamily:F.display,fontStyle:'italic',fontSize:12.5,color:'rgba(255,255,255,0.62)' }}>
            What is the Radar?
          </span>
          <span style={{ fontSize:11,color:'rgba(255,255,255,0.4)' }}>⌄</span>
        </div>

        <div style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center' }}>
          <RadarPlot size={210} interactive={false} />
        </div>

        <div style={{ display:'flex',gap:8 }}>
          {[['FATIGUE', 24, '-6'], ['RECOVERY', 71, '-5']].map(([k, v, d]) => (
            <div key={k} style={{ flex:1,background:'rgba(255,255,255,0.055)',border:'1px solid rgba(214,228,255,0.12)',
              borderRadius:13,padding:'10px 12px',textAlign:'center' }}>
              <div style={{ fontFamily:F.body,fontSize:8.5,letterSpacing:1.6,color:'rgba(255,255,255,0.42)' }}>{k}</div>
              <div style={{ fontFamily:F.display,fontSize:26,fontWeight:700,color:C.ice,lineHeight:1.1 }}>{v}</div>
              <div style={{ fontFamily:F.body,fontSize:9.5,color:'rgba(255,255,255,0.35)' }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="radar" />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   ASK JEANI: live conversation
══════════════════════════════════════════════════════════════════ */
const CONVO = [
  { from:'user',  text:'Why is my right ankle flagged?' },
  { from:'jeani', text:'Your right ankle sits at 85 while the rest of your chain is 88 or above, and it has drifted down three days running. Nothing alarming yet, which is exactly why it is worth a look now.' },
  { from:'user',  text:'What should I do today?' },
  { from:'jeani', text:'Motion is 72 and Smoothness is your strongest signal at 79, so you have room to push. Take the run, then give the ankle five minutes of calf and soleus work afterwards.' },
  { from:'user',  text:'Is my Volume score a problem?' },
  { from:'jeani', text:'It is the one to watch at 41. You moved well when you moved, just not often enough. Two short walks would lift it more than one hard session.' },
]

/* Hoisted so it is a stable component type: defining it inside ChatScreen
   would remount every avatar on each message tick. */
const Avatar = ({ size = 26 }) => (
  <div style={{ width:size,height:size,borderRadius:'50%',flexShrink:0,
    background:`linear-gradient(135deg, ${C.navy}, ${C.electric})`,
    display:'flex',alignItems:'center',justifyContent:'center' }}>
    <img src="/logos/Jeani J White.png" style={{ height:size * 0.5 }} alt="" />
  </div>
)

export function ChatScreen() {
  const [shown, setShown] = useState(0)
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)
  const rootRef = useRef(null)

  // Runs unconditionally rather than gating on an in-view check: if the
  // observer never fires the conversation would sit empty forever, and a few
  // timers cost far less than that failure mode.
  useEffect(() => {
    if (shown >= CONVO.length) {
      const t = setTimeout(() => setShown(0), 4200)
      return () => clearTimeout(t)
    }
    if (CONVO[shown].from === 'jeani') {
      setTyping(true)
      const t = setTimeout(() => { setTyping(false); setShown(s => s + 1) }, 1700)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setShown(s => s + 1), shown === 0 ? 800 : 700)
    return () => clearTimeout(t)
  }, [shown])

  // Scroll the message list itself, never scrollIntoView: that walks up and
  // scrolls every ancestor, which drags the whole page back to this phone on
  // every message tick and makes the site feel like it will not scroll.
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [shown, typing])

  return (
    <div ref={rootRef} style={{ width:'100%',height:'100%',display:'flex',flexDirection:'column',
      background:`linear-gradient(180deg, #0a1030 0%, ${C.night} 100%)` }}>
      <div style={{ height:48,flexShrink:0 }} />
      <div style={{ padding:'0 16px 12px',borderBottom:'1px solid rgba(214,228,255,0.09)',
        display:'flex',alignItems:'center',gap:11,flexShrink:0 }}>
        <Avatar size={38} />
        <div>
          <div style={{ fontFamily:F.display,fontSize:15,fontWeight:700,color:'#fff' }}>Ask Jeani</div>
          <div style={{ display:'flex',alignItems:'center',gap:5,marginTop:1 }}>
            <span style={{ width:6,height:6,borderRadius:'50%',background:C.green,boxShadow:`0 0 7px ${C.green}` }} />
            <span style={{ fontSize:10,color:'rgba(255,255,255,0.45)',fontFamily:F.body }}>
              {typing ? 'Typing…' : 'Active now'}
            </span>
          </div>
        </div>
      </div>

      <div ref={listRef} style={{ flex:1,overflowY:'auto',overscrollBehavior:'contain',padding:'14px 14px 8px',display:'flex',flexDirection:'column',gap:10 }}>
        <div style={{ textAlign:'center' }}>
          <span style={{ fontSize:9,color:'rgba(255,255,255,0.3)',background:'rgba(255,255,255,0.06)',
            borderRadius:20,padding:'4px 12px',fontFamily:F.body }}>Reading your last 7 days</span>
        </div>

        {CONVO.slice(0, shown).map((m, i) => (
          <motion.div key={i}
            initial={{ opacity:0, y:10, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
            transition={{ duration:0.28, ease:'easeOut' }}
            style={{ alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',maxWidth:'84%',
              display:'flex',flexDirection: m.from === 'jeani' ? 'row' : 'row-reverse',
              alignItems:'flex-end',gap:7 }}>
            {m.from === 'jeani' && <Avatar />}
            <div style={{ background: m.from === 'user' ? `linear-gradient(135deg, ${C.navy}, #1a35a0)` : 'rgba(255,255,255,0.08)',
              border:`1px solid ${m.from === 'user' ? 'rgba(92,141,255,0.4)' : 'rgba(214,228,255,0.1)'}`,
              borderRadius: m.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              padding:'10px 13px',fontSize:11.5,color:'#fff',lineHeight:1.65,fontFamily:F.body }}>
              {m.text}
            </div>
          </motion.div>
        ))}

        {typing && (
          <motion.div initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }}
            style={{ alignSelf:'flex-start',display:'flex',alignItems:'flex-end',gap:7 }}>
            <Avatar />
            <div style={{ background:'rgba(255,255,255,0.08)',border:'1px solid rgba(214,228,255,0.1)',
              borderRadius:'18px 18px 18px 4px',padding:'12px 16px',display:'flex',gap:5 }}>
              {[0, 1, 2].map(i => (
                <motion.span key={i} animate={{ y:[0, -5, 0] }}
                  transition={{ duration:0.55, repeat:Infinity, delay:i * 0.15, ease:'easeInOut' }}
                  style={{ width:6,height:6,borderRadius:'50%',background:'rgba(255,255,255,0.45)' }} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div style={{ padding:'10px 14px 14px',flexShrink:0 }}>
        <div style={{ background:'rgba(255,255,255,0.07)',border:'1px solid rgba(214,228,255,0.12)',
          borderRadius:28,padding:'10px 14px',display:'flex',alignItems:'center',gap:10 }}>
          <span style={{ flex:1,fontSize:11.5,color:'rgba(255,255,255,0.3)',fontFamily:F.body }}>
            Ask anything about your movement…
          </span>
          <span style={{ width:28,height:28,borderRadius:'50%',background:C.ice,display:'flex',
            alignItems:'center',justifyContent:'center',fontSize:13,color:C.navy,fontWeight:700 }}>↑</span>
        </div>
      </div>
    </div>
  )
}
