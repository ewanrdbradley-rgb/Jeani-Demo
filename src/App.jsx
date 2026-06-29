import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

const C = { blue: '#112378', sand: '#fbeccf', amber: '#F5A000', green: '#00E87B' }

/* ── Mobile detection hook ───────────────────────────────────────── */
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mobile
}

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`
const Grain = ({ op = 0.1, blend = 'overlay' }) => (
  <div style={{ position:'absolute',inset:0,pointerEvents:'none',zIndex:5,backgroundImage:NOISE,backgroundRepeat:'repeat',backgroundSize:'160px',opacity:op,mixBlendMode:blend }} />
)

/* ── Video background with photo fallback ────────────────────────── */
function BgVideo({ src, fallbackImg, pos = 'center center' }) {
  return (
    <>
      {/* Video layer */}
      <video key={src} autoPlay muted loop playsInline
        style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:pos }}>
        <source src={src} type="video/mp4" />
      </video>
      {/* Photo fallback sits behind (z-index -1) */}
      <img src={fallbackImg} alt=""
        style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:pos,zIndex:-1 }} />
    </>
  )
}

/* ── BgImage — fallback always rendered underneath, primary on top ── */
function BgImage({ primary, fallback, pos = 'center center' }) {
  const [primaryFailed, setPrimaryFailed] = useState(false)
  return (
    <>
      {/* Fallback always visible as base layer */}
      <img src={fallback} alt=""
        style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:pos }} />
      {/* Primary sits on top — hidden if it fails to load */}
      {!primaryFailed && (
        <img src={primary} alt=""
          onError={() => setPrimaryFailed(true)}
          style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:pos }} />
      )}
    </>
  )
}

/* ── Top nav ─────────────────────────────────────────────────────── */
const TABS = [
  { id:'app',     label:'THE APP',      icon:'◆' },
  { id:'science', label:'THE SCIENCE',  icon:'⬡' },
  { id:'how',     label:'HOW IT WORKS', icon:'◎' },
  { id:'plans',   label:'PLANS',        icon:'◈' },
]

function TopNav({ active, onChange, onReset, mobile }) {
  if (mobile) {
    // Mobile: logo bar at top + bottom tab bar
    return (
      <>
        {/* Mobile top bar — logo only */}
        <div style={{ height:52,background:'rgba(3,5,18,0.95)',backdropFilter:'blur(24px)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px',flexShrink:0,position:'relative',zIndex:50 }}>
          <img src="/logos/Jeani Wordmark White.png" style={{ height:20,opacity:0.95 }} alt="Jeani" />
          <button onClick={onReset}
            style={{ width:30,height:30,borderRadius:'50%',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.14)',color:'rgba(255,255,255,0.45)',fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
        </div>
        {/* Mobile bottom tab bar */}
        <div style={{ position:'fixed',bottom:0,left:0,right:0,height:64,background:'rgba(3,5,18,0.97)',backdropFilter:'blur(24px)',borderTop:'1px solid rgba(255,255,255,0.08)',display:'flex',zIndex:100 }}>
          {TABS.map(t => {
            const on = t.id === active
            return (
              <button key={t.id} onClick={() => onChange(t.id)}
                style={{ flex:1,border:'none',cursor:'pointer',background:'transparent',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,borderTop:on?`2px solid ${C.sand}`:'2px solid transparent',transition:'all 0.2s' }}>
                <span style={{ fontSize:16 }}>{t.icon}</span>
                <span style={{ fontSize:9,fontFamily:'HostGrotesk',fontWeight:on?700:400,color:on?C.sand:'rgba(255,255,255,0.38)',letterSpacing:1 }}>{t.label}</span>
              </button>
            )
          })}
        </div>
      </>
    )
  }
  // Desktop
  return (
    <div style={{ height:62,background:'rgba(3,5,18,0.92)',backdropFilter:'blur(24px)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',padding:'0 28px',gap:0,flexShrink:0,position:'relative',zIndex:50 }}>
      <img src="/logos/Jeani Wordmark White.png" style={{ height:22,marginRight:48,opacity:0.95,flexShrink:0 }} alt="Jeani" />
      <div style={{ display:'flex',flex:1,gap:2 }}>
        {TABS.map(t => {
          const on = t.id === active
          return (
            <button key={t.id} onClick={() => onChange(t.id)}
              style={{ padding:'11px 26px',borderRadius:8,border:'none',borderBottom:on?`2px solid ${C.sand}`:'2px solid transparent',cursor:'pointer',background:on?'rgba(255,255,255,0.1)':'transparent',color:on?'#fff':'rgba(255,255,255,0.4)',fontSize:11,fontFamily:'HostGrotesk',fontWeight:on?700:500,letterSpacing:2,transition:'all 0.2s',display:'flex',alignItems:'center',gap:8,whiteSpace:'nowrap' }}>
              {t.label}
            </button>
          )
        })}
      </div>
      <button onClick={onReset}
        style={{ width:32,height:32,borderRadius:'50%',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.14)',color:'rgba(255,255,255,0.45)',fontSize:15,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>✕</button>
    </div>
  )
}

/* ── Phone frame ─────────────────────────────────────────────────── */
function Phone({ children, id }) {
  return (
    <motion.div key={id}
      initial={{ y:60,opacity:0,scale:0.96 }}
      animate={{ y:0,opacity:1,scale:1 }}
      exit={{ y:-30,opacity:0,scale:0.97 }}
      transition={{ duration:0.65,ease:[0.22,1,0.36,1] }}
      style={{ width:310,height:640,borderRadius:50,background:'#06080f',position:'relative',flexShrink:0,
        boxShadow:'0 70px 140px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.16), 0 0 0 3px rgba(255,255,255,0.04)' }}>
      {/* Buttons */}
      <div style={{ position:'absolute',left:-3,top:114,width:3,height:34,background:'rgba(255,255,255,0.15)',borderRadius:'2px 0 0 2px' }} />
      <div style={{ position:'absolute',left:-3,top:162,width:3,height:58,background:'rgba(255,255,255,0.15)',borderRadius:'2px 0 0 2px' }} />
      <div style={{ position:'absolute',left:-3,top:234,width:3,height:58,background:'rgba(255,255,255,0.15)',borderRadius:'2px 0 0 2px' }} />
      <div style={{ position:'absolute',right:-3,top:160,width:3,height:80,background:'rgba(255,255,255,0.15)',borderRadius:'0 2px 2px 0' }} />
      {/* Screen */}
      <div style={{ position:'absolute',inset:8,borderRadius:44,overflow:'hidden',background:'#000' }}>
        <div style={{ position:'absolute',top:10,left:'50%',transform:'translateX(-50%)',width:116,height:32,background:'#000',borderRadius:20,zIndex:30 }} />
        {children}
      </div>
      {/* Reflection */}
      <div style={{ position:'absolute',inset:8,borderRadius:44,background:'linear-gradient(135deg,rgba(255,255,255,0.07) 0%,transparent 45%)',pointerEvents:'none',zIndex:10 }} />
    </motion.div>
  )
}

/* ── Screenshot display (with coded fallback) ───────────────────── */
function ScreenShot({ src, fallbackBg = '#06080f', children }) {
  const [err, setErr] = useState(false)
  if (src && !err) {
    return (
      <img src={src} alt="" onError={() => setErr(true)}
        style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'top center',display:'block' }} />
    )
  }
  return (
    <div style={{ width:'100%',height:'100%',background:fallbackBg,display:'flex',alignItems:'center',justifyContent:'center' }}>
      {children}
    </div>
  )
}

/* ── In-phone tab bar ────────────────────────────────────────────── */
function AppTabBar({ active = 'home' }) {
  const tabs = [{id:'home',icon:'⌂',label:'Home'},{id:'motion',icon:'▶',label:'Motion'},{id:'body',icon:'◈',label:'Body'},{id:'spotlight',icon:'⊕',label:'Spotlight'}]
  return (
    <div style={{ position:'absolute',bottom:0,left:0,right:0,height:76,background:'rgba(0,0,0,0.82)',backdropFilter:'blur(20px)',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',zIndex:20 }}>
      {tabs.map(t => {
        const on = t.id === active || (active === 'goal' && t.id === 'motion')
        return (
          <div key={t.id} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3 }}>
            <div style={{ padding:'6px 14px',borderRadius:22,background:on?'rgba(255,255,255,0.14)':'transparent' }}>
              <span style={{ fontSize:on?20:17,color:on?'#fff':'rgba(255,255,255,0.32)' }}>{t.icon}</span>
            </div>
            <span style={{ fontSize:10,color:on?'#fff':'rgba(255,255,255,0.28)',fontFamily:'HostGrotesk',fontWeight:on?600:400 }}>{t.label}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ── Goal screen (no screenshot available) ───────────────────────── */
function GoalScreen() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      let v = 0; const iv = setInterval(() => { v += 1; setPct(Math.min(v,74)); if(v>=74)clearInterval(iv) }, 15)
      return () => clearInterval(iv)
    }, 600)
    return () => clearTimeout(t)
  }, [])
  return (
    <div style={{ width:'100%',height:'100%',background:'linear-gradient(180deg,#1e2e60 0%,#0e1840 35%,#040e25 100%)',display:'flex',flexDirection:'column',position:'relative' }}>
      <div style={{ position:'absolute',top:'10%',left:'50%',transform:'translateX(-50%)',width:260,height:260,borderRadius:'50%',background:'radial-gradient(circle,rgba(30,60,180,0.4) 0%,transparent 70%)',filter:'blur(35px)' }} />
      <div style={{ position:'relative',zIndex:2,padding:'48px 16px 84px',display:'flex',flexDirection:'column',gap:14,flex:1 }}>
        <div style={{ textAlign:'center',marginBottom:4 }}>
          <div style={{ fontSize:9,color:'rgba(255,255,255,0.28)',letterSpacing:3 }}>MOVEMENT GOAL</div>
          <div style={{ fontSize:24,color:'#fff',fontWeight:700 }}>Today</div>
        </div>
        <div style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center' }}>
          <div style={{ fontSize:100,fontFamily:'CrimsonPro,serif',fontWeight:700,color:'#fff',lineHeight:1,letterSpacing:-4 }}>{pct}%</div>
          <div style={{ marginTop:18,width:'65%',height:4,background:'rgba(255,255,255,0.1)',borderRadius:2,position:'relative' }}>
            <motion.div animate={{width:`${pct}%`}} transition={{duration:0.05}} style={{ height:'100%',background:`linear-gradient(90deg,${C.blue},${C.green})`,borderRadius:2 }} />
            <motion.div animate={{left:`${pct}%`}} transition={{duration:0.05}} style={{ position:'absolute',top:'50%',transform:'translate(-50%,-50%)',width:12,height:12,borderRadius:'50%',background:'#fff',boxShadow:`0 0 10px ${C.green}` }} />
          </div>
        </div>
        <div style={{ background:'rgba(17,35,120,0.55)',backdropFilter:'blur(20px)',border:'1px solid rgba(80,120,255,0.2)',borderRadius:18,padding:'14px 18px' }}>
          <div style={{ fontSize:14,color:C.green,fontStyle:'italic',fontWeight:600,marginBottom:4 }}>⚡ you've got motion</div>
          <div style={{ fontSize:12,color:'rgba(255,255,255,0.6)' }}>just <span style={{ color:C.green,fontWeight:700,fontSize:16 }}>{100-pct}%</span> from your daily goal</div>
        </div>
        <div>
          <div style={{ display:'flex',justifyContent:'space-between',marginBottom:7 }}>
            <span style={{ fontSize:9.5,color:'rgba(255,255,255,0.28)',letterSpacing:1.5 }}>LAST 30 DAYS</span>
            <span style={{ fontSize:9.5,color:'rgba(255,255,255,0.28)' }}>May 10 – Jun 8</span>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4 }}>
            {['M','T','W','T','F','S','S'].map(d => <div key={d} style={{ textAlign:'center',fontSize:9,color:'rgba(255,255,255,0.22)',fontFamily:'HostGrotesk' }}>{d}</div>)}
            {Array.from({length:28}).map((_,i) => (
              <div key={i} style={{ aspectRatio:'1',borderRadius:4,background:i<22?`rgba(0,232,123,${0.1+(i%5)*0.07})`:'rgba(255,255,255,0.04)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,color:'rgba(255,255,255,0.18)' }}>{i+10}</div>
            ))}
          </div>
        </div>
      </div>
      <AppTabBar active="goal" />
    </div>
  )
}

function StreakScreen() {
  const days = ['M','T','W','T','F','S','S']
  const [litDays, setLitDays] = useState(0)
  const [countUp, setCountUp] = useState(0)

  // Animate streak number counting up
  useEffect(() => {
    let v = 0
    const iv = setInterval(() => {
      v += 1; setCountUp(Math.min(v, 8))
      if (v >= 8) clearInterval(iv)
    }, 80)
    return () => clearInterval(iv)
  }, [])

  // Light up day dots one by one
  useEffect(() => {
    if (litDays >= 6) return
    const t = setTimeout(() => setLitDays(d => d + 1), litDays === 0 ? 400 : 180)
    return () => clearTimeout(t)
  }, [litDays])

  return (
    <div style={{ width:'100%',height:'100%',position:'relative',overflow:'hidden',background:'#06030a' }}>

      {/* Background — deep amber/dark gradient like real app screens */}
      <div style={{ position:'absolute',inset:0,background:'linear-gradient(160deg,#1a0a00 0%,#0e0500 35%,#04020a 100%)' }} />

      {/* Ambient glows */}
      <div style={{ position:'absolute',top:'-5%',left:'50%',transform:'translateX(-50%)',width:280,height:280,borderRadius:'50%',background:`radial-gradient(circle,${C.amber}44 0%,transparent 68%)`,filter:'blur(40px)',zIndex:1 }} />
      <div style={{ position:'absolute',top:'25%',left:'10%',width:160,height:160,borderRadius:'50%',background:`radial-gradient(circle,rgba(245,90,0,0.2) 0%,transparent 70%)`,filter:'blur(30px)',zIndex:1 }} />

      {/* Content — no scroll, fills frame, no footer */}
      <div style={{ position:'relative',zIndex:2,width:'100%',height:'100%',padding:'52px 18px 22px',display:'flex',flexDirection:'column',gap:14 }}>

        {/* Hero — flame + counter */}
        <div style={{ textAlign:'center',flex:'0 0 auto' }}>
          <motion.div
            animate={{ scale:[1,1.08,1] }}
            transition={{ duration:1.8,repeat:Infinity,ease:'easeInOut' }}
            style={{ fontSize:52,lineHeight:1,marginBottom:4 }}>
            🔥
          </motion.div>
          <motion.div
            initial={{ opacity:0,scale:0.7 }}
            animate={{ opacity:1,scale:1 }}
            transition={{ duration:0.6,ease:[0.22,1,0.36,1] }}
            style={{ fontSize:96,fontFamily:'CrimsonPro,serif',fontWeight:700,color:C.amber,lineHeight:0.85,letterSpacing:-4 }}>
            {countUp}
          </motion.div>
          <motion.div
            initial={{ opacity:0,y:6 }}
            animate={{ opacity:1,y:0 }}
            transition={{ delay:0.4,duration:0.5 }}
            style={{ fontSize:14,color:'rgba(255,255,255,0.55)',marginTop:8,letterSpacing:0.5 }}>
            day streak
          </motion.div>
        </div>

        {/* This week */}
        <motion.div
          initial={{ opacity:0,y:12 }}
          animate={{ opacity:1,y:0 }}
          transition={{ delay:0.3,duration:0.5 }}
          style={{ background:'rgba(255,255,255,0.05)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,padding:'14px 16px' }}>
          <div style={{ fontSize:9,color:'rgba(255,255,255,0.3)',letterSpacing:2.5,marginBottom:11,fontFamily:'HostGrotesk' }}>THIS WEEK</div>
          <div style={{ display:'flex',justifyContent:'space-between' }}>
            {days.map((d,i) => (
              <div key={i} style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:5 }}>
                <motion.div
                  initial={{ scale:0.5,opacity:0 }}
                  animate={i < litDays
                    ? { scale:1, opacity:1, background:C.amber }
                    : { scale:1, opacity:1, background:'rgba(255,255,255,0.07)' }
                  }
                  transition={{ duration:0.3, delay: i < litDays ? 0 : 0 }}
                  style={{
                    width:34, height:34, borderRadius:'50%',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:13, color: i < litDays ? '#000' : 'rgba(255,255,255,0.2)',
                    fontWeight:700,
                    boxShadow: i < litDays ? `0 0 18px ${C.amber}88` : 'none',
                  }}>
                  {i < litDays ? '✓' : ''}
                </motion.div>
                <span style={{ fontSize:9.5,color:'rgba(255,255,255,0.3)',fontFamily:'HostGrotesk' }}>{d}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity:0,y:12 }}
          animate={{ opacity:1,y:0 }}
          transition={{ delay:0.5,duration:0.5 }}
          style={{ background:'rgba(245,160,0,0.07)',border:'1px solid rgba(245,160,0,0.2)',borderRadius:18,padding:'14px 16px',textAlign:'center' }}>
          <div style={{ fontSize:13.5,color:C.amber,fontStyle:'italic',fontFamily:'CrimsonPro,serif',lineHeight:1.55 }}>
            "Consistency is the only metric that compounds."
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity:0,y:12 }}
          animate={{ opacity:1,y:0 }}
          transition={{ delay:0.65,duration:0.5 }}
          style={{ background:'rgba(255,255,255,0.05)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,padding:'14px 18px' }}>
          <div style={{ display:'flex',justifyContent:'space-around' }}>
            {[['Best streak','14 days'],['This month','22 / 31'],['All time','8 🔥']].map(([k,v],i) => (
              <motion.div key={k}
                initial={{ opacity:0,y:8 }}
                animate={{ opacity:1,y:0 }}
                transition={{ delay:0.7 + i*0.1,duration:0.4 }}
                style={{ textAlign:'center' }}>
                <div style={{ fontSize:17,color:'#fff',fontWeight:700,fontFamily:'CrimsonPro,serif' }}>{v}</div>
                <div style={{ fontSize:9.5,color:'rgba(255,255,255,0.3)',marginTop:3,fontFamily:'HostGrotesk' }}>{k}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Progress bar — days left in month */}
        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:0.8,duration:0.5 }}
          style={{ padding:'0 2px' }}>
          <div style={{ display:'flex',justifyContent:'space-between',marginBottom:6 }}>
            <span style={{ fontSize:9.5,color:'rgba(255,255,255,0.3)',fontFamily:'HostGrotesk' }}>MONTHLY PROGRESS</span>
            <span style={{ fontSize:9.5,color:C.amber,fontFamily:'HostGrotesk',fontWeight:600 }}>22 / 31 days</span>
          </div>
          <div style={{ height:5,background:'rgba(255,255,255,0.08)',borderRadius:3,overflow:'hidden' }}>
            <motion.div
              initial={{ width:0 }}
              animate={{ width:'71%' }}
              transition={{ delay:0.9,duration:1,ease:'easeOut' }}
              style={{ height:'100%',background:`linear-gradient(90deg,rgba(245,160,0,0.7),${C.amber})`,borderRadius:3 }}
            />
          </div>
        </motion.div>

      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   CHAT SCREEN — live animated conversation inside the phone frame
══════════════════════════════════════════════════════════════════ */
function ChatScreen() {
  const CONVERSATION = [
    { from:'user',  text:'Why is my left hamstring flagged?' },
    { from:'jeani', text:"Your left hamstring jumped +45 points this week — impressive progress, but rapid gains can sometimes mean your body is compensating for another area. Worth keeping an eye on." },
    { from:'user',  text:'What should I do today?' },
    { from:'jeani', text:"Motion score 74 — you're in solid shape and ready to push. A moderate run works great. Just add a hamstring stretch routine after to balance the load." },
    { from:'user',  text:'How does my symmetry look?' },
    { from:'jeani', text:"Symmetry is 78 — green. Left and right sides are moving well together. That's one reason you can load with confidence today." },
  ]

  const [shown, setShown] = useState(0)
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (shown >= CONVERSATION.length) {
      // Restart after a pause
      const t = setTimeout(() => setShown(0), 4000)
      return () => clearTimeout(t)
    }
    const next = CONVERSATION[shown]
    const isJeani = next.from === 'jeani'
    // Show typing indicator for Jeani, then reveal message
    if (isJeani) {
      setTyping(true)
      const t1 = setTimeout(() => {
        setTyping(false)
        setShown(s => s + 1)
      }, 1600)
      return () => clearTimeout(t1)
    } else {
      const delay = shown === 0 ? 800 : 700
      const t2 = setTimeout(() => setShown(s => s + 1), delay)
      return () => clearTimeout(t2)
    }
  }, [shown])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [shown, typing])

  return (
    <div style={{ width:'100%',height:'100%',background:'linear-gradient(180deg,#080e28 0%,#050a1c 100%)',display:'flex',flexDirection:'column',position:'relative' }}>

      {/* Status bar */}
      <div style={{ height:48,flexShrink:0 }} />

      {/* Header */}
      <div style={{ padding:'0 16px 12px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',gap:11,flexShrink:0 }}>
        <div style={{ width:40,height:40,borderRadius:'50%',background:`linear-gradient(135deg,${C.blue},#2040c0)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
          <img src="/logos/Jeani J White.png" style={{ height:20 }} alt="J" />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15,color:'#fff',fontWeight:700,fontFamily:'CrimsonPro,serif' }}>Ask Jeani</div>
          <div style={{ display:'flex',alignItems:'center',gap:5,marginTop:1 }}>
            <div style={{ width:6,height:6,borderRadius:'50%',background:C.green,boxShadow:`0 0 7px ${C.green}` }} />
            <span style={{ fontSize:10,color:'rgba(255,255,255,0.45)',fontFamily:'HostGrotesk' }}>
              {typing ? 'Typing…' : 'Active now'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1,overflowY:'auto',padding:'14px 14px 8px',display:'flex',flexDirection:'column',gap:10 }}>

        {/* Context chip */}
        <div style={{ textAlign:'center',marginBottom:4 }}>
          <span style={{ fontSize:9,color:'rgba(255,255,255,0.28)',background:'rgba(255,255,255,0.06)',borderRadius:20,padding:'4px 12px',fontFamily:'HostGrotesk' }}>
            Based on your motion data · Jun 7
          </span>
        </div>

        {CONVERSATION.slice(0, shown).map((m, i) => (
          <motion.div key={i}
            initial={{ opacity:0, y:10, scale:0.97 }}
            animate={{ opacity:1, y:0, scale:1 }}
            transition={{ duration:0.28, ease:'easeOut' }}
            style={{
              alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
              maxWidth:'82%',
              display:'flex',
              flexDirection: m.from === 'jeani' ? 'row' : 'row-reverse',
              alignItems:'flex-end',
              gap:7,
            }}>
            {m.from === 'jeani' && (
              <div style={{ width:26,height:26,borderRadius:'50%',background:`linear-gradient(135deg,${C.blue},#2040c0)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginBottom:1 }}>
                <img src="/logos/Jeani J White.png" style={{ height:13 }} alt="J" />
              </div>
            )}
            <div style={{
              background: m.from === 'user'
                ? `linear-gradient(135deg,${C.blue},#1a35a0)`
                : 'rgba(255,255,255,0.08)',
              backdropFilter:'blur(8px)',
              border: `1px solid ${m.from === 'user' ? 'rgba(40,70,200,0.5)' : 'rgba(255,255,255,0.09)'}`,
              borderRadius: m.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              padding:'10px 13px',
              fontSize:12,
              color:'#fff',
              lineHeight:1.65,
            }}>
              {m.text}
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <motion.div initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }}
            style={{ alignSelf:'flex-start',display:'flex',alignItems:'flex-end',gap:7 }}>
            <div style={{ width:26,height:26,borderRadius:'50%',background:`linear-gradient(135deg,${C.blue},#2040c0)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
              <img src="/logos/Jeani J White.png" style={{ height:13 }} alt="J" />
            </div>
            <div style={{ background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'18px 18px 18px 4px',padding:'12px 16px' }}>
              <div style={{ display:'flex',gap:5,alignItems:'center' }}>
                {[0,1,2].map(i => (
                  <motion.div key={i}
                    animate={{ y:[0,-5,0] }}
                    transition={{ duration:0.55,repeat:Infinity,delay:i*0.15,ease:'easeInOut' }}
                    style={{ width:6,height:6,borderRadius:'50%',background:'rgba(255,255,255,0.45)' }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ padding:'10px 14px 14px',flexShrink:0 }}>
        <div style={{ background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:28,padding:'10px 14px',display:'flex',alignItems:'center',gap:10 }}>
          <span style={{ flex:1,fontSize:12,color:'rgba(255,255,255,0.28)',fontFamily:'HostGrotesk' }}>Ask anything about your movement…</span>
          <div style={{ width:30,height:30,borderRadius:'50%',background:C.sand,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <span style={{ fontSize:13,color:C.blue,fontWeight:700,lineHeight:1 }}>↑</span>
          </div>
        </div>
      </div>

    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   FEATURES config
══════════════════════════════════════════════════════════════════ */
// Blue overtone — consistent across every feature background
const BLUE_TINT = 'rgba(17,35,120,0.52)'

// New photo slots — save these files to public/ to activate:
// run-mountain.jpg → 3 trail runners on Alpine hillside (warm, golden)
// run-race.jpg     → race start, many runners, motion blur (warm tones)
// run-dusk.jpg     → two silhouette runners at dusk (already very blue)
// run-road.jpg     → two runners on road, forest + sign
// run-lake.jpg     → two runners by lake, open sky
// run-forest.jpg   → two runners on forest path

const FEATURES = [
  {
    id: 'home',
    label: 'Home',
    tagline: 'Your daily motion, at a glance.',
    desc: 'Every morning Jeani gives you a Motion score from 0–100, surfaces your top Spotlight insight, and shows you exactly what to focus on today.',
    screenshot: '/screenshots/home.png',
    screenVideo: '/screen-home.mp4',
    bgPhoto: '/run-lake.jpg',      // two runners by lake, open sky
    bgFallback: '/run-lake.jpg',
    bgPos: 'center 45%',
    accent: C.amber,
  },
  {
    id: 'motion',
    label: 'Motion Score',
    tagline: 'Five dimensions of how your body moves.',
    desc: 'Joint Changes, Symmetry, Mobility, Movement Diversity, and Step Volume — combined into a single daily score that tells the real story of how you\'re moving.',
    screenshot: '/screenshots/motion.png',
    bgPhoto: '/run-mountain.jpg',  // 3 Alpine trail runners
    bgFallback: '/run-mountain.jpg',
    bgPos: 'center 50%',
    accent: C.amber,
  },
  {
    id: 'goal',
    label: 'Movement Goal',
    tagline: 'A daily target built around you.',
    desc: 'Your Movement Goal adapts to your score and history. Hit it consistently and your streak builds — miss it and Jeani recalibrates so tomorrow feels achievable.',
    screenshot: '/screenshots/goal-achieved.png',
    bgPhoto: '/run-dusk.jpg',      // two silhouettes at dusk — deep blue
    bgFallback: '/run-dusk.jpg',
    bgPos: 'center 50%',
    accent: C.green,
  },
  {
    id: 'spotlight',
    label: 'Spotlight',
    tagline: 'Finds what needs attention before you feel it.',
    desc: 'Jeani analyses your joint data daily and surfaces the one area most at risk — complete with a trend chart, context, and personalised stretch recommendations.',
    screenshot: '/screenshots/spotlight.png',
    bgPhoto: '/run-race.jpg',      // race start blur, warm motion
    bgFallback: '/run-race.jpg',
    bgPos: 'center 40%',
    accent: C.green,
  },
  {
    id: 'chat',
    label: 'Ask Jeani',
    tagline: 'Your personal movement coach, always on.',
    desc: 'Ask anything about your score, your joints, or your training. Jeani answers with context from your actual data — not generic advice.',
    screenshot: null,              // uses live ChatScreen component
    bgPhoto: '/run-bridge.jpg',
    bgFallback: '/run-bridge.jpg',
    bgPos: 'center 40%',
    accent: C.sand,
  },
  {
    id: 'streak',
    label: 'Streak',
    tagline: 'Consistency is the only metric that compounds.',
    desc: 'Your streak tracks daily goal completion. Eight days. Thirty days. The data shows consistent movers recover faster and stay injury-free longer.',
    screenshot: null,
    bgPhoto: '/run-mountain.jpg',  // back to mountain for variety
    bgFallback: '/run-mountain.jpg',
    bgPos: 'center 60%',
    accent: C.amber,
  },
]

const FALLBACK_SCREENS = { goal: GoalScreen, streak: StreakScreen, chat: ChatScreen }

/* ══════════════════════════════════════════════════════════════════
   THE APP SECTION
══════════════════════════════════════════════════════════════════ */
function PhoneContent({ feat, FallbackScreen }) {
  return feat.screenVideo ? (
    <video key={feat.screenVideo} autoPlay muted loop playsInline
      style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'top',display:'block' }}>
      <source src={feat.screenVideo} type="video/mp4" />
    </video>
  ) : feat.screenshot ? (
    <ScreenShot src={feat.screenshot}>{FallbackScreen && <FallbackScreen />}</ScreenShot>
  ) : FallbackScreen ? <FallbackScreen /> : null
}

function TheApp() {
  const [idx, setIdx] = useState(0)
  const mobile = useIsMobile()
  const feat = FEATURES[idx]
  const FallbackScreen = FALLBACK_SCREENS[feat.id]

  if (mobile) {
    return (
      <div style={{ minHeight:'100%',position:'relative',background:'#020810',paddingBottom:80 }}>
        {/* Full-bleed bg */}
        <div style={{ position:'fixed',inset:0,zIndex:0,pointerEvents:'none' }}>
          <BgImage primary={feat.bgPhoto} fallback={feat.bgFallback} pos={feat.bgPos} />
          <div style={{ position:'absolute',inset:0,background:BLUE_TINT }} />
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(2,5,18,0.65) 0%,rgba(2,5,18,0.5) 100%)' }} />
          <Grain op={0.13} blend="overlay" />
        </div>

        <div style={{ position:'relative',zIndex:1,padding:'20px 20px 0' }}>
          {/* Feature label */}
          <AnimatePresence mode="wait">
            <motion.div key={feat.id} initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
              style={{ marginBottom:16 }}>
              <div style={{ fontSize:9,color:feat.accent,letterSpacing:3,fontFamily:'HostGrotesk',fontWeight:600,marginBottom:6 }}>JEANI APP</div>
              <div style={{ fontFamily:'CrimsonPro,serif',fontSize:30,fontWeight:700,color:'#fff',lineHeight:1.1 }}>{feat.label}</div>
              <div style={{ fontFamily:'CrimsonPro,serif',fontStyle:'italic',fontSize:14,color:'rgba(255,255,255,0.55)',marginTop:6,lineHeight:1.5 }}>{feat.tagline}</div>
            </motion.div>
          </AnimatePresence>

          {/* Horizontal scrollable feature pills */}
          <div style={{ display:'flex',gap:8,overflowX:'auto',paddingBottom:12,WebkitOverflowScrolling:'touch',msOverflowStyle:'none',scrollbarWidth:'none' }}>
            {FEATURES.map((f,i) => (
              <button key={f.id} onClick={() => setIdx(i)}
                style={{ flexShrink:0,padding:'7px 14px',borderRadius:20,border:`1px solid ${i===idx?feat.accent:'rgba(255,255,255,0.2)'}`,background:i===idx?`${feat.accent}22`:'rgba(255,255,255,0.06)',color:i===idx?feat.accent:'rgba(255,255,255,0.55)',fontSize:11,fontFamily:'HostGrotesk',fontWeight:i===idx?700:400,cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.2s' }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Phone — scaled to fit mobile width */}
          <div style={{ display:'flex',justifyContent:'center',marginTop:8 }}>
            <AnimatePresence mode="wait">
              <motion.div key={feat.id}
                initial={{ y:30,opacity:0 }} animate={{ y:0,opacity:1 }} exit={{ y:-20,opacity:0 }}
                transition={{ duration:0.5,ease:[0.22,1,0.36,1] }}
                style={{ width:'min(260px, 80vw)',aspectRatio:'9/19.5',borderRadius:40,background:'#06080f',position:'relative',
                  boxShadow:'0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.14)' }}>
                {/* Buttons */}
                <div style={{ position:'absolute',left:-2,top:'18%',width:2,height:24,background:'rgba(255,255,255,0.15)',borderRadius:'2px 0 0 2px' }} />
                <div style={{ position:'absolute',right:-2,top:'25%',width:2,height:36,background:'rgba(255,255,255,0.15)',borderRadius:'0 2px 2px 0' }} />
                {/* Screen */}
                <div style={{ position:'absolute',inset:7,borderRadius:34,overflow:'hidden',background:'#000' }}>
                  <div style={{ position:'absolute',top:8,left:'50%',transform:'translateX(-50%)',width:80,height:22,background:'#000',borderRadius:14,zIndex:30 }} />
                  <PhoneContent feat={feat} FallbackScreen={FallbackScreen} />
                </div>
                {/* Reflection */}
                <div style={{ position:'absolute',inset:7,borderRadius:34,background:'linear-gradient(135deg,rgba(255,255,255,0.06) 0%,transparent 45%)',pointerEvents:'none',zIndex:10 }} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.p key={feat.id+'d'} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
              style={{ fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.7,marginTop:16,textAlign:'center' }}>
              {feat.desc}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // ── Desktop layout ──
  return (
    <div style={{ width:'100%',height:'100%',position:'relative',overflow:'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div key={feat.id + '-bg'} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.55 }}
          style={{ position:'absolute',inset:0,zIndex:0 }}>
          <BgImage primary={feat.bgPhoto} fallback={feat.bgFallback} pos={feat.bgPos} />
          <div style={{ position:'absolute',inset:0,background:BLUE_TINT }} />
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(2,5,18,0.78) 0%,rgba(2,5,18,0.45) 35%,rgba(2,5,18,0.15) 100%)' }} />
          <Grain op={0.13} blend="overlay" />
        </motion.div>
      </AnimatePresence>
      <div style={{ position:'absolute',left:0,top:0,bottom:0,width:300,zIndex:10,display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 0 0 36px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={feat.id} initial={{ opacity:0,x:-16 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:16 }} transition={{ duration:0.38 }}
            style={{ marginBottom:36 }}>
            <div style={{ fontSize:9.5,color:feat.accent,letterSpacing:3,marginBottom:10,fontFamily:'HostGrotesk',fontWeight:600 }}>JEANI APP</div>
            <div style={{ fontFamily:'CrimsonPro,serif',fontSize:42,fontWeight:700,color:'#fff',lineHeight:1.05,letterSpacing:-1 }}>{feat.label}</div>
            <div style={{ fontFamily:'CrimsonPro,serif',fontStyle:'italic',fontSize:16,color:'rgba(255,255,255,0.55)',marginTop:10,lineHeight:1.5,maxWidth:240 }}>{feat.tagline}</div>
            <div style={{ fontSize:13,color:'rgba(255,255,255,0.42)',marginTop:14,lineHeight:1.68,maxWidth:260 }}>{feat.desc}</div>
          </motion.div>
        </AnimatePresence>
        <div style={{ display:'flex',flexDirection:'column',gap:2 }}>
          {FEATURES.map((f,i) => (
            <button key={f.id} onClick={() => setIdx(i)}
              style={{ display:'flex',alignItems:'center',gap:12,padding:'9px 12px',borderRadius:10,border:'none',cursor:'pointer',background:i===idx?'rgba(255,255,255,0.1)':'transparent',textAlign:'left',transition:'all 0.2s',borderLeft:`3px solid ${i===idx?feat.accent:'transparent'}` }}>
              <div style={{ width:7,height:7,borderRadius:'50%',background:i===idx?feat.accent:'rgba(255,255,255,0.22)',flexShrink:0,transition:'all 0.2s' }} />
              <span style={{ fontSize:12,color:i===idx?'#fff':'rgba(255,255,255,0.35)',fontFamily:'HostGrotesk',fontWeight:i===idx?700:400 }}>{f.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:8,paddingLeft:300 }}>
        <AnimatePresence mode="wait">
          <Phone key={feat.id} id={feat.id}><PhoneContent feat={feat} FallbackScreen={FallbackScreen} /></Phone>
        </AnimatePresence>
      </div>
      <div style={{ position:'absolute',bottom:24,right:24,display:'flex',gap:10,zIndex:20 }}>
        <button onClick={() => setIdx(i => Math.max(0,i-1))} disabled={idx===0}
          style={{ width:44,height:44,borderRadius:'50%',background:idx===0?'rgba(255,255,255,0.04)':'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.18)',color:idx===0?'rgba(255,255,255,0.2)':'#fff',fontSize:22,cursor:idx===0?'default':'pointer',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(10px)',transition:'all 0.2s' }}>‹</button>
        <button onClick={() => setIdx(i => Math.min(FEATURES.length-1,i+1))} disabled={idx===FEATURES.length-1}
          style={{ width:44,height:44,borderRadius:'50%',background:idx===FEATURES.length-1?'rgba(255,255,255,0.04)':'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.18)',color:idx===FEATURES.length-1?'rgba(255,255,255,0.2)':'#fff',fontSize:22,cursor:idx===FEATURES.length-1?'default':'pointer',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(10px)',transition:'all 0.2s' }}>›</button>
      </div>
      <div style={{ position:'absolute',bottom:32,left:'50%',transform:'translateX(-50%)',display:'flex',gap:8,zIndex:20,paddingLeft:300 }}>
        {FEATURES.map((_,i) => (
          <button key={i} onClick={() => setIdx(i)}
            style={{ width:i===idx?24:6,height:6,borderRadius:3,background:i===idx?feat.accent:'rgba(255,255,255,0.22)',border:'none',cursor:'pointer',padding:0,transition:'all 0.3s' }} />
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   THE SCIENCE SECTION
══════════════════════════════════════════════════════════════════ */
function TheScience() {
  const mobile = useIsMobile()
  // SVG icons — large, fills the badge
  const IconMovement = () => (
    <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke={C.sand} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="3.5" r="1.5" fill={C.sand} stroke="none" />
      <path d="M12 6.5l-2 3.5 2.5 2-1.5 4" />
      <path d="M10 10l-2.5 1.5" />
      <path d="M11 16l-1.5 2.5" />
      <path d="M11 16l2 2" />
      <circle cx="10" cy="10" r="0.9" fill={C.sand} stroke="none" />
      <circle cx="12" cy="13" r="0.9" fill={C.sand} stroke="none" />
    </svg>
  )

  const IconApple = () => (
    <svg viewBox="0 0 24 24" width="36" height="36" fill={C.sand}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  )

  const IconScience = () => (
    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke={C.sand} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3c2 2 8 2 10 4s-2 6-4 8-8 2-10 4" />
      <path d="M17 3c-2 2-8 2-10 4s2 6 4 8 8 2 10 4" />
      <line x1="7.5" y1="6" x2="16.5" y2="6" strokeOpacity="0.45" />
      <line x1="5.5" y1="10" x2="18.5" y2="10" strokeOpacity="0.45" />
      <line x1="7.5" y1="14" x2="16.5" y2="14" strokeOpacity="0.45" />
      <line x1="5.5" y1="18" x2="18.5" y2="18" strokeOpacity="0.45" />
    </svg>
  )

  const pillars = [
    {
      Icon: IconMovement,
      label: '5 Movement Dimensions',
      sub: 'Joint Changes · Symmetry · Mobility · Movement Diversity · Step Volume',
      detail: 'Every session, Jeani derives six joint-specific estimates — hip, knee, and ankle bilaterally — from your wrist accelerometer. Statistically validated against published clinical research.',
    },
    {
      Icon: IconApple,
      label: 'Apple Watch Integration',
      sub: 'One sensor. Six joint estimates. Every session.',
      detail: 'Triaxial accelerometry captures motion across three axes during walking or running. No extra hardware. Compatible with any wrist-worn accelerometer, measured in real-world conditions.',
    },
    {
      Icon: IconScience,
      label: 'Science & Technical Advisors',
      sub: 'Amy Arundale · Jacob Rothman · Dr. Blake Boggess · Dr. Brinnae Bent',
      detail: 'Methodology consistent with published clinical and sports science research. Built with leading movement scientists to deliver insights athletes and everyday movers can actually trust.',
    },
  ]

  if (mobile) return (
    <div style={{ background:'#f0ebe0',minHeight:'100%',paddingBottom:20 }}>
      <Grain op={0.05} blend="multiply" />
      {/* Video banner */}
      <div style={{ position:'relative',height:200,overflow:'hidden' }}>
        <video autoPlay muted loop playsInline style={{ width:'100%',height:'100%',objectFit:'cover' }}><source src="/vid-science.mp4" type="video/mp4" /></video>
        <div style={{ position:'absolute',inset:0,background:'rgba(17,35,120,0.5)' }} />
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(180deg,transparent 30%,rgba(3,5,18,0.92) 100%)' }} />
        <div style={{ position:'absolute',bottom:20,left:20,right:20 }}>
          <img src="/logos/Jeani Wordmark White.png" style={{ height:22,marginBottom:10 }} alt="Jeani" />
          <div style={{ fontFamily:'CrimsonPro,serif',fontSize:22,fontWeight:700,color:'#fff',lineHeight:1.1 }}>From Your Joints, To Your Wrist.</div>
        </div>
      </div>
      <div style={{ padding:'20px 20px 0' }}>
        <div style={{ fontSize:10,color:C.blue,fontFamily:'HostGrotesk',fontWeight:700,letterSpacing:2,marginBottom:8 }}>THE SCIENCE BEHIND JEANI</div>
        <div style={{ fontFamily:'CrimsonPro,serif',fontSize:26,fontWeight:700,color:'#0a0e20',lineHeight:1.1,marginBottom:10 }}>Real-world movement intelligence. Clinically grounded.</div>
        <div style={{ fontSize:14,color:'#666',lineHeight:1.65,marginBottom:20 }}>Triaxial accelerometry and gait proxy extraction — six bilateral joint estimates per session. No lab. No extra hardware.</div>
        <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
          {pillars.map((p,i) => (
            <motion.div key={p.label} initial={{ opacity:0,x:16 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.1 }}
              style={{ background:C.blue,borderRadius:16,padding:'16px 18px',display:'flex',gap:16,alignItems:'center',position:'relative',overflow:'hidden' }}>
              <Grain op={0.08} blend="overlay" />
              <div style={{ width:52,height:52,borderRadius:14,background:'rgba(251,236,207,0.1)',border:'1px solid rgba(251,236,207,0.18)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}><p.Icon /></div>
              <div style={{ position:'relative',zIndex:1 }}>
                <div style={{ fontSize:15,color:C.sand,fontWeight:700,fontFamily:'CrimsonPro,serif',marginBottom:3 }}>{p.label}</div>
                <div style={{ fontSize:11,color:'rgba(251,236,207,0.5)',fontFamily:'HostGrotesk' }}>{p.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ width:'100%',height:'100%',display:'flex',flexDirection:'column',position:'relative',overflow:'hidden',background:'#f0ebe0' }}>
      <Grain op={0.05} blend="multiply" />

      <div style={{ flex:1,display:'flex',zIndex:1,overflow:'hidden' }}>

        {/* ── Left — hurdling video ── */}
        <div style={{ width:'34%',position:'relative',overflow:'hidden',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'36px 32px' }}>
          <video autoPlay muted loop playsInline
            style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center' }}>
            <source src="/vid-science.mp4" type="video/mp4" />
          </video>
          <div style={{ position:'absolute',inset:0,background:'rgba(17,35,120,0.50)' }} />
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(3,5,18,0.05) 0%,rgba(3,5,18,0.9) 100%)' }} />
          <Grain op={0.12} blend="overlay" />
          <motion.div initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.8 }}
            style={{ position:'relative',zIndex:4 }}>
            <img src="/logos/Jeani Wordmark White.png" style={{ height:30,marginBottom:22,opacity:0.9 }} alt="Jeani" />
            <div style={{ fontFamily:'CrimsonPro,serif',fontSize:38,fontWeight:700,color:'#fff',lineHeight:1.08,marginBottom:16 }}>
              From Your Joints,<br />To Your Wrist.
            </div>
            <div style={{ fontFamily:'CrimsonPro,serif',fontStyle:'italic',fontSize:18,color:'rgba(255,255,255,0.72)',lineHeight:1.6 }}>
              "One sensor. Six joint estimates. Every session."
            </div>
          </motion.div>
        </div>

        {/* ── Right — headline + three pillars ── */}
        <div style={{ flex:1,padding:'32px 44px 0px',display:'flex',flexDirection:'column',overflow:'hidden' }}>

          {/* Headline block */}
          <motion.div initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5 }}
            style={{ marginBottom:20,flexShrink:0 }}>
            <div style={{ fontSize:11,color:C.blue,fontFamily:'HostGrotesk',fontWeight:700,letterSpacing:2.5,marginBottom:10 }}>THE SCIENCE BEHIND JEANI</div>
            <div style={{ fontFamily:'CrimsonPro,serif',fontSize:38,fontWeight:700,color:'#0a0e20',lineHeight:1.06,marginBottom:12 }}>
              Real-world movement intelligence.<br />Clinically grounded.
            </div>
            <div style={{ fontSize:15,color:'#5a5a6a',lineHeight:1.65,maxWidth:500 }}>
              Triaxial accelerometry and gait proxy extraction — combined to give you six bilateral joint estimates per session. No lab. No extra hardware. Just your wrist.
            </div>
          </motion.div>

          {/* Three pillars — fill remaining height evenly */}
          <div style={{ display:'flex',flexDirection:'column',gap:10,flex:1,paddingBottom:14 }}>
            {pillars.map((p,i) => (
              <motion.div key={p.label}
                initial={{ opacity:0,x:24 }}
                animate={{ opacity:1,x:0 }}
                transition={{ delay:0.12 + i*0.12,duration:0.5,ease:[0.22,1,0.36,1] }}
                style={{ background:C.blue,borderRadius:18,padding:'16px 22px',display:'flex',gap:22,alignItems:'center',position:'relative',overflow:'hidden',flex:1 }}>
                <Grain op={0.08} blend="overlay" />

                {/* Icon badge — larger */}
                <div style={{ width:66,height:66,borderRadius:20,background:'rgba(251,236,207,0.1)',border:'1px solid rgba(251,236,207,0.18)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                  <p.Icon />
                </div>

                <div style={{ position:'relative',zIndex:1,flex:1 }}>
                  <div style={{ fontSize:19,color:C.sand,fontWeight:700,fontFamily:'CrimsonPro,serif',marginBottom:5,letterSpacing:0.1 }}>{p.label}</div>
                  <div style={{ fontSize:13,color:'rgba(251,236,207,0.5)',marginBottom:8,fontFamily:'HostGrotesk' }}>{p.sub}</div>
                  <div style={{ fontSize:14,color:'rgba(251,236,207,0.8)',lineHeight:1.6 }}>{p.detail}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div style={{ background:C.blue,padding:'13px 44px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'relative',overflow:'hidden',zIndex:1,flexShrink:0 }}>
        <Grain op={0.1} blend="overlay" />
        <div style={{ fontFamily:'CrimsonPro,serif',fontStyle:'italic',fontSize:14,color:C.sand,position:'relative',zIndex:1 }}>
          Accurate by design — Jeani reads movement where it matters most.
        </div>
        <img src="/logos/Jeani Wordmark Sand White.png" style={{ height:20,position:'relative',zIndex:1 }} alt="Jeani" />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   HOW IT WORKS SECTION
══════════════════════════════════════════════════════════════════ */
function HowItWorks() {
  const mobile = useIsMobile()
  const steps = [
    { num:'01', title:'Download Jeani', desc:'Find Jeani on the App Store. Create your profile, set your movement baseline, and you\'re ready to go — takes less than two minutes.', accent:C.amber },
    { num:'02', title:'Sync Your Apple Watch', desc:'Open Jeani on your Apple Watch and start moving. Jeani reads your wrist motion in real time — no chest strap, no footpod, no extra kit.', accent:C.green },
    { num:'03', title:'Get Your Score', desc:'After every session and every day, Jeani delivers your Motion score, Spotlight muscle insights, and a personalised Movement Goal — so you always know exactly where you stand.', accent:C.sand },
  ]

  if (mobile) return (
    <div style={{ minHeight:'100%',position:'relative',paddingBottom:20 }}>
      <img src="/run-mountain.jpg" alt="" style={{ position:'fixed',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 45%',zIndex:0,pointerEvents:'none' }} />
      <div style={{ position:'fixed',inset:0,background:'rgba(17,35,120,0.6)',zIndex:0,pointerEvents:'none' }} />
      <div style={{ position:'fixed',inset:0,background:'linear-gradient(180deg,rgba(3,5,18,0.55) 0%,rgba(3,5,18,0.72) 100%)',zIndex:0,pointerEvents:'none' }} />
      <div style={{ position:'relative',zIndex:1,padding:'24px 20px 0',textAlign:'center' }}>
        <div style={{ fontSize:10,color:C.sand,fontFamily:'HostGrotesk',fontWeight:700,letterSpacing:2.5,marginBottom:8,opacity:0.7 }}>THREE STEPS</div>
        <div style={{ fontFamily:'CrimsonPro,serif',fontSize:34,fontWeight:700,color:'#fff',lineHeight:1,marginBottom:8 }}>How it works</div>
        <div style={{ fontSize:14,color:'rgba(255,255,255,0.5)',fontFamily:'CrimsonPro,serif',fontStyle:'italic',marginBottom:24 }}>From download to daily insight.</div>
        <div style={{ display:'flex',flexDirection:'column',gap:12,textAlign:'left' }}>
          {steps.map((s,i) => (
            <motion.div key={s.num} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.15 }}
              style={{ background:'rgba(255,255,255,0.07)',backdropFilter:'blur(20px)',borderRadius:20,padding:'22px 20px',border:'1px solid rgba(255,255,255,0.12)',position:'relative',overflow:'hidden' }}>
              <Grain op={0.06} blend="overlay" />
              <div style={{ marginBottom:12 }}>
                <span style={{ fontFamily:'HostGrotesk',fontSize:10,fontWeight:700,color:s.accent,letterSpacing:2,background:`${s.accent}18`,border:`1px solid ${s.accent}40`,borderRadius:20,padding:'4px 12px' }}>STEP {s.num}</span>
              </div>
              <div style={{ fontFamily:'CrimsonPro,serif',fontSize:24,fontWeight:700,color:'#fff',lineHeight:1.1,marginBottom:10 }}>{s.title}</div>
              <div style={{ fontSize:14,color:'rgba(255,255,255,0.62)',lineHeight:1.7 }}>{s.desc}</div>
            </motion.div>
          ))}
        </div>
        <div style={{ marginTop:24,display:'flex',alignItems:'center',justifyContent:'center',gap:10 }}>
          <img src="/watch-main.png" alt="" style={{ height:32,borderRadius:6,border:'1px solid rgba(255,255,255,0.15)',objectFit:'cover',objectPosition:'top' }} />
          <span style={{ fontSize:12,color:'rgba(255,255,255,0.45)' }}>Apple Watch Series 6+ · iOS 16+</span>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ width:'100%',height:'100%',position:'relative',overflow:'hidden',display:'flex',flexDirection:'column' }}>

      {/* Full-bleed background — Ken Burns slow zoom+pan on the mountain runners */}
      <motion.img src="/run-mountain.jpg" alt=""
        initial={{ scale:1.08, x:20 }}
        animate={{ scale:1.18, x:-20 }}
        transition={{ duration:18, ease:'linear', repeat:Infinity, repeatType:'reverse' }}
        style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 45%',transformOrigin:'center center' }} />
      <div style={{ position:'absolute',inset:0,background:'rgba(17,35,120,0.60)' }} />
      <div style={{ position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(3,5,18,0.55) 0%,rgba(3,5,18,0.72) 100%)' }} />
      <Grain op={0.11} blend="overlay" />

      {/* Header */}
      <motion.div initial={{ opacity:0,y:-16 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.55 }}
        style={{ position:'relative',zIndex:4,textAlign:'center',padding:'36px 56px 0' }}>
        <div style={{ fontSize:11,color:C.sand,fontFamily:'HostGrotesk',fontWeight:700,letterSpacing:2.5,marginBottom:10,opacity:0.7 }}>THREE STEPS</div>
        <div style={{ fontFamily:'CrimsonPro,serif',fontSize:50,fontWeight:700,color:'#fff',lineHeight:1,marginBottom:10 }}>How it works</div>
        <div style={{ fontSize:16,color:'rgba(255,255,255,0.5)',fontFamily:'CrimsonPro,serif',fontStyle:'italic' }}>From download to daily insight.</div>
      </motion.div>

      {/* Steps + connectors */}
      <div style={{ position:'relative',zIndex:4,flex:1,display:'flex',alignItems:'center',padding:'28px 48px 0',gap:0 }}>
        {steps.map((s,i) => (
          <div key={s.num} style={{ display:'flex',alignItems:'center',flex:1,minWidth:0 }}>

            {/* Card */}
            <motion.div
              initial={{ opacity:0,y:32 }}
              animate={{ opacity:1,y:0 }}
              transition={{ delay:i*0.18,duration:0.6,ease:[0.22,1,0.36,1] }}
              style={{ flex:1,background:'rgba(255,255,255,0.07)',backdropFilter:'blur(28px)',borderRadius:26,border:'1px solid rgba(255,255,255,0.13)',display:'flex',flexDirection:'column',padding:'36px 30px 36px',position:'relative',overflow:'hidden' }}>
              <Grain op={0.06} blend="overlay" />

              {/* Step number */}
              <div style={{ marginBottom:20 }}>
                <span style={{ fontFamily:'HostGrotesk',fontSize:11,fontWeight:700,color:s.accent,letterSpacing:2.5,background:`${s.accent}18`,border:`1px solid ${s.accent}40`,borderRadius:20,padding:'5px 14px' }}>
                  STEP {s.num}
                </span>
              </div>

              {/* Large step numeral — decorative */}
              <div style={{ fontFamily:'CrimsonPro,serif',fontSize:96,fontWeight:700,color:s.accent,lineHeight:0.85,marginBottom:24,opacity:0.18,userSelect:'none',letterSpacing:-4 }}>
                {s.num}
              </div>

              {/* Title */}
              <div style={{ fontFamily:'CrimsonPro,serif',fontSize:30,fontWeight:700,color:'#fff',lineHeight:1.1,marginBottom:16 }}>{s.title}</div>

              {/* Description */}
              <div style={{ fontSize:15,color:'rgba(255,255,255,0.65)',lineHeight:1.75,flex:1 }}>{s.desc}</div>
            </motion.div>

            {/* Arrow connector between cards */}
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity:0,x:-8 }}
                animate={{ opacity:1,x:0 }}
                transition={{ delay:i*0.18 + 0.4,duration:0.4 }}
                style={{ flexShrink:0,padding:'0 14px',display:'flex',flexDirection:'column',alignItems:'center',gap:6 }}>
                <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                  <path d="M0 10 H26 M20 3 L29 10 L20 17" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Requirements footer */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
        style={{ position:'relative',zIndex:4,display:'flex',alignItems:'center',justifyContent:'center',gap:16,padding:'22px 56px 28px' }}>
        <img src="/watch-main.png" alt="" style={{ height:36,borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',objectFit:'cover',objectPosition:'top' }} />
        <div style={{ textAlign:'center' }}>
          <span style={{ fontSize:13,color:'rgba(255,255,255,0.5)',fontFamily:'HostGrotesk' }}>
            Requires <span style={{ color:'rgba(255,255,255,0.75)',fontWeight:600 }}>Apple Watch Series 6</span> or later
            &nbsp;·&nbsp;
            <span style={{ color:'rgba(255,255,255,0.75)',fontWeight:600 }}>iOS 16+</span>
          </span>
        </div>
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   PLANS SECTION
══════════════════════════════════════════════════════════════════ */
// ▼▼▼ PASTE YOUR REAL APP STORE URL HERE ▼▼▼
const APP_STORE_URL = 'https://apps.apple.com/us/app/jeani/id6742083552'
// ▲▲▲ Both "Start Free Trial" buttons (mobile + desktop) link here ▲▲▲

function Plans() {
  const [billing, setBilling] = useState('annual')
  const mobile = useIsMobile()

  const features = [
    'Motion Score — daily movement health rating',
    'Movement Goal — personalised daily target',
    'Spotlight — surface weak points before you feel them',
    'Ask Jeani — AI movement coach, always on',
    'Streak tracking & monthly progress',
    '90-day movement history',
    'Apple Watch integration — real-time data',
  ]

  const price    = billing === 'monthly' ? '$9.99'  : '$99.99'
  const period   = billing === 'monthly' ? '/month'  : '/year'
  const subPrice = billing === 'monthly' ? null      : '$8.33/month'


  if (mobile) return (
    <div style={{ minHeight:'100%',background:'#f0ebe0',position:'relative',paddingBottom:20 }}>
      <Grain op={0.05} blend="multiply" />
      {/* Banner */}
      <div style={{ position:'relative',height:160,overflow:'hidden' }}>
        <img src="/run-dusk.jpg" alt="" style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 40%' }} />
        <div style={{ position:'absolute',inset:0,background:'rgba(17,35,120,0.55)' }} />
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(180deg,transparent 30%,rgba(3,5,18,0.9) 100%)' }} />
        <div style={{ position:'absolute',bottom:16,left:20 }}>
          <div style={{ fontFamily:'CrimsonPro,serif',fontSize:26,fontWeight:700,color:'#fff',lineHeight:1.1 }}>Movement<br />is Medicine.</div>
        </div>
      </div>
      <div style={{ padding:'20px 20px 0',position:'relative',zIndex:1 }}>
        {/* Trial badge */}
        <div style={{ background:C.green,borderRadius:30,padding:'7px 16px',display:'inline-flex',alignItems:'center',gap:6,marginBottom:18 }}>
          <span style={{ fontSize:12,fontWeight:700,color:'#000',fontFamily:'HostGrotesk' }}>✦ 2-week free trial included</span>
        </div>
        <div style={{ fontFamily:'CrimsonPro,serif',fontSize:28,fontWeight:700,color:'#0a0e20',lineHeight:1,marginBottom:6 }}>Join the movement with Jeani</div>
        <div style={{ fontSize:14,color:'#666',marginBottom:20 }}>Full access. One simple plan.</div>
        {/* Toggle */}
        <div style={{ display:'flex',background:'rgba(17,35,120,0.08)',borderRadius:30,padding:3,width:'fit-content',marginBottom:20 }}>
          {['monthly','annual'].map(b => (
            <button key={b} onClick={() => setBilling(b)}
              style={{ padding:'9px 22px',borderRadius:26,border:'none',cursor:'pointer',fontSize:12,fontFamily:'HostGrotesk',fontWeight:600,transition:'all 0.25s',background:billing===b?C.blue:'transparent',color:billing===b?'#fff':'#888' }}>
              {b === 'monthly' ? 'Monthly' : <span>Annual <span style={{ marginLeft:4,background:C.green,color:'#000',fontSize:9,fontWeight:700,padding:'2px 6px',borderRadius:8 }}>-17%</span></span>}
            </button>
          ))}
        </div>
        {/* Price */}
        <div style={{ marginBottom:20 }}>
          <AnimatePresence mode="wait">
            <motion.div key={billing} initial={{ opacity:0,y:4 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-4 }} transition={{ duration:0.2 }}>
              <div style={{ display:'flex',alignItems:'baseline',gap:4 }}>
                <span style={{ fontFamily:'CrimsonPro,serif',fontSize:52,fontWeight:700,color:C.blue,lineHeight:1,letterSpacing:-2 }}>{price}</span>
                <span style={{ fontSize:16,color:'#888',fontFamily:'HostGrotesk' }}>{period}</span>
              </div>
              {subPrice && <div style={{ fontSize:13,color:'#888',marginTop:2 }}>That's {subPrice} billed annually</div>}
              <div style={{ fontSize:13,color:C.green,fontWeight:600,marginTop:4 }}>✓ First fourteen days free</div>
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Features */}
        <div style={{ display:'flex',flexDirection:'column',gap:9,marginBottom:22 }}>
          {features.map(f => (
            <div key={f} style={{ display:'flex',gap:10,alignItems:'flex-start' }}>
              <div style={{ width:18,height:18,borderRadius:'50%',background:`${C.blue}12`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:C.blue,flexShrink:0,marginTop:1 }}>✓</div>
              <span style={{ fontSize:13,color:'#444',lineHeight:1.5 }}>{f}</span>
            </div>
          ))}
        </div>
        <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" style={{ display:'block',textAlign:'center',width:'100%',padding:'16px',borderRadius:14,border:'none',background:C.blue,color:'#fff',fontSize:16,fontWeight:700,fontFamily:'HostGrotesk',cursor:'pointer',textDecoration:'none',boxSizing:'border-box' }}>Start Free Trial</a>
        <div style={{ textAlign:'center',fontSize:12,color:'#999',marginTop:10 }}>Cancel any time · No commitment</div>
      </div>
    </div>
  )

  return (
    <div style={{ width:'100%',height:'100%',position:'relative',overflow:'hidden',display:'flex' }}>

      {/* ── Left photo panel ── */}
      <div style={{ width:'40%',position:'relative',overflow:'hidden' }}>
        <motion.img src="/run-dusk.jpg" alt=""
          initial={{ scale:1.06 }} animate={{ scale:1.14 }}
          transition={{ duration:20,ease:'linear',repeat:Infinity,repeatType:'reverse' }}
          style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 40%' }} />
        <div style={{ position:'absolute',inset:0,background:'rgba(17,35,120,0.48)' }} />
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(3,5,18,0.1) 0%,rgba(3,5,18,0.85) 100%)' }} />
        <Grain op={0.12} blend="overlay" />
        <div style={{ position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'flex-start',justifyContent:'flex-end',padding:48,zIndex:2 }}>
          <img src="/logos/Jeani Wordmark White.png" style={{ height:28,marginBottom:24 }} alt="Jeani" />
          <div style={{ fontFamily:'CrimsonPro,serif',fontSize:44,fontWeight:700,color:'#fff',lineHeight:1.05,marginBottom:14 }}>
            Movement<br />is Medicine.
          </div>
          <div style={{ fontSize:15,color:'rgba(255,255,255,0.6)',lineHeight:1.7,maxWidth:280 }}>
            Try Jeani free for two weeks. No commitment. Cancel any time.
          </div>
        </div>
      </div>

      {/* ── Right — single subscription card ── */}
      <div style={{ flex:1,background:'#f0ebe0',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'36px 52px',position:'relative',overflow:'hidden' }}>
        <Grain op={0.05} blend="multiply" />

        <div style={{ width:'100%',maxWidth:480,position:'relative',zIndex:1 }}>

          {/* Trial banner */}
          <motion.div initial={{ opacity:0,y:-12 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5 }}
            style={{ background:C.green,borderRadius:30,padding:'8px 20px',display:'inline-flex',alignItems:'center',gap:8,marginBottom:22 }}>
            <span style={{ fontSize:13,fontWeight:700,color:'#000',fontFamily:'HostGrotesk' }}>✦ 2-week free trial included</span>
          </motion.div>

          {/* Heading */}
          <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1,duration:0.5 }}>
            <div style={{ fontFamily:'CrimsonPro,serif',fontSize:42,fontWeight:700,color:'#0a0e20',lineHeight:1,marginBottom:6 }}>
              Join the movement with Jeani
            </div>
            <div style={{ fontSize:15,color:'#666',marginBottom:28,lineHeight:1.6 }}>
              Full access to everything. One simple plan.
            </div>
          </motion.div>

          {/* Billing toggle */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
            style={{ display:'flex',background:'rgba(17,35,120,0.08)',borderRadius:30,padding:4,width:'fit-content',marginBottom:28 }}>
            {['monthly','annual'].map(b => (
              <button key={b} onClick={() => setBilling(b)}
                style={{ padding:'10px 28px',borderRadius:26,border:'none',cursor:'pointer',fontSize:12,fontFamily:'HostGrotesk',fontWeight:600,transition:'all 0.25s',background:billing===b?C.blue:'transparent',color:billing===b?'#fff':'#888',display:'flex',alignItems:'center',gap:7 }}>
                {b === 'monthly' ? 'Monthly' : (
                  <span style={{ display:'flex',alignItems:'center',gap:7 }}>
                    Annual
                    <span style={{ background:C.green,color:'#000',fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:10 }}>SAVE 17%</span>
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Price */}
          <motion.div initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.25 }}
            style={{ marginBottom:28 }}>
            <AnimatePresence mode="wait">
              <motion.div key={billing} initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }} transition={{ duration:0.2 }}>
                <div style={{ display:'flex',alignItems:'baseline',gap:6 }}>
                  <span style={{ fontFamily:'CrimsonPro,serif',fontSize:64,fontWeight:700,color:C.blue,lineHeight:1,letterSpacing:-2 }}>{price}</span>
                  <span style={{ fontSize:18,color:'#888',fontFamily:'HostGrotesk' }}>{period}</span>
                </div>
                {subPrice && (
                  <div style={{ fontSize:13,color:'#888',marginTop:4 }}>That's {subPrice} — billed annually</div>
                )}
                <div style={{ fontSize:13,color:C.green,fontWeight:600,marginTop:6,fontFamily:'HostGrotesk' }}>
                  ✓ First fourteen days free
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Feature list */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}
            style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px 20px',marginBottom:28 }}>
            {features.map((f,i) => (
              <div key={f} style={{ display:'flex',gap:9,alignItems:'flex-start' }}>
                <div style={{ width:18,height:18,borderRadius:'50%',background:`${C.blue}14`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:C.blue,flexShrink:0,marginTop:1 }}>✓</div>
                <span style={{ fontSize:13,color:'#444',lineHeight:1.5 }}>{f}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.a
            href={APP_STORE_URL} target="_blank" rel="noopener noreferrer"
            initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.45 }}
            style={{ display:'block',textAlign:'center',width:'100%',padding:'17px',borderRadius:16,border:'none',background:C.blue,color:'#fff',fontSize:16,fontWeight:700,fontFamily:'HostGrotesk',cursor:'pointer',boxShadow:'0 8px 32px rgba(17,35,120,0.28)',letterSpacing:0.3,textDecoration:'none',boxSizing:'border-box' }}>
            Start Free Trial
          </motion.a>
          <div style={{ textAlign:'center',fontSize:12,color:'#999',marginTop:12,fontFamily:'HostGrotesk' }}>
            Cancel any time · No commitment
          </div>

        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   INTRO
══════════════════════════════════════════════════════════════════ */
function Particles() {
  const p = useRef(Array.from({length:50},() => ({x:Math.random()*100,y:Math.random()*100,s:Math.random()*2+0.5,d:Math.random()*5+3,dl:Math.random()*4})))
  return (
    <div style={{ position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none' }}>
      {p.current.map((pt,i) => (
        <motion.div key={i} animate={{y:[0,-20,0],opacity:[0.1,0.5,0.1]}} transition={{duration:pt.d,repeat:Infinity,delay:pt.dl,ease:'easeInOut'}}
          style={{ position:'absolute',left:`${pt.x}%`,top:`${pt.y}%`,width:pt.s,height:pt.s,borderRadius:'50%',background:'rgba(251,236,207,0.5)' }} />
      ))}
    </div>
  )
}

function Intro({ onDone }) {
  // No auto-advance — user must press EXPLORE
  return (
    <motion.div exit={{ opacity:0,transition:{ duration:0.9 } }}
      style={{ position:'fixed',inset:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden' }}>

      {/* Discus video — rotated to landscape, fills full frame */}
      <video autoPlay muted loop playsInline
        style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 65%' }}>
        <source src="/vid-intro-main.mp4" type="video/mp4" />
      </video>
      {/* Photo fallback */}
      <img src="/hero-motion3.jpg" alt=""
        style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:-1 }} />

      {/* Blue haze — Jeani deep blue tint over the whole frame */}
      <div style={{ position:'absolute',inset:0,background:'rgba(17,35,120,0.52)' }} />
      {/* Radial centre glow — darker at edges, lighter behind text */}
      <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(17,35,120,0.1) 0%, rgba(3,5,18,0.55) 100%)' }} />
      {/* Bottom fade */}
      <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'30%',background:'linear-gradient(0deg,rgba(3,5,18,0.7) 0%,transparent 100%)' }} />

      <Grain op={0.1} blend="overlay" />
      <Particles />

      {/* Centre content */}
      <div style={{ position:'relative',zIndex:5,textAlign:'center',maxWidth:580 }}>
        <motion.img src="/logos/Jeani Wordmark White.png" alt="Jeani"
          initial={{ opacity:0,scale:0.85,y:14 }} animate={{ opacity:1,scale:1,y:0 }} transition={{ duration:1.2,ease:[0.22,1,0.36,1] }}
          style={{ height:70,marginBottom:28,filter:'drop-shadow(0 0 60px rgba(255,255,255,0.18))' }} />
        <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.7,duration:0.9 }}
          style={{ fontFamily:'CrimsonPro,serif',fontStyle:'italic',fontSize:28,color:C.sand,letterSpacing:0.3,textShadow:'0 2px 30px rgba(17,35,120,0.8)' }}>
          Movement is Medicine.
        </motion.div>
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1,duration:0.7 }}
          style={{ fontSize:12,color:'rgba(255,255,255,0.4)',marginTop:10,letterSpacing:1.5 }}>
          Starting the movement · 2026
        </motion.div>
        <motion.button
          initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:2,duration:0.5 }}
          onClick={onDone}
          style={{ marginTop:52,background:'rgba(17,35,120,0.4)',border:'1px solid rgba(251,236,207,0.3)',color:'rgba(251,236,207,0.9)',borderRadius:30,padding:'14px 44px',fontSize:11,fontFamily:'HostGrotesk',cursor:'pointer',letterSpacing:2.5,backdropFilter:'blur(12px)',boxShadow:'0 0 30px rgba(17,35,120,0.5)' }}>
          EXPLORE
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [activeTab, setActiveTab] = useState('app')
  const mobile = useIsMobile()
  const sections = { app:TheApp, science:TheScience, how:HowItWorks, plans:Plans }
  const Section = sections[activeTab]

  if (mobile) {
    return (
      <div style={{ minHeight:'100vh',display:'flex',flexDirection:'column',background:'#000' }}>
        <AnimatePresence>{showIntro && <Intro onDone={() => setShowIntro(false)} mobile />}</AnimatePresence>
        <TopNav active={activeTab} onChange={setActiveTab} onReset={() => setShowIntro(true)} mobile />
        {/* Scrollable content area with bottom padding for tab bar */}
        <div style={{ flex:1,paddingBottom:64 }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.25 }}>
              <Section />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // Desktop
  return (
    <div style={{ width:'100vw',height:'100vh',overflow:'hidden',display:'flex',flexDirection:'column',background:'#000' }}>
      <AnimatePresence>{showIntro && <Intro onDone={() => setShowIntro(false)} />}</AnimatePresence>
      <TopNav active={activeTab} onChange={setActiveTab} onReset={() => setShowIntro(true)} />
      <div style={{ flex:1,overflow:'hidden',position:'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
            style={{ position:'absolute',inset:0 }}>
            <Section />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
