import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

/* ── Brand ──────────────────────────────────────────────────────── */
const C = { blue: '#112378', sand: '#fbeccf', amber: '#F5A000', green: '#00E87B' }

/* ── Noise grain overlay ─────────────────────────────────────────── */
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`
const Grain = ({ op = 0.1, blend = 'overlay' }) => (
  <div style={{ position:'absolute',inset:0,pointerEvents:'none',zIndex:5,backgroundImage:NOISE,backgroundRepeat:'repeat',backgroundSize:'160px',opacity:op,mixBlendMode:blend }} />
)
const Orb = ({ color, size=500, x='50%', y='50%', op=0.4 }) => (
  <div style={{ position:'absolute',left:x,top:y,transform:'translate(-50%,-50%)',width:size,height:size,borderRadius:'50%',background:`radial-gradient(circle,${color} 0%,transparent 68%)`,opacity:op,filter:'blur(55px)',pointerEvents:'none',zIndex:1 }} />
)

/* ── Running silhouette SVG paths ────────────────────────────────── */
function RunnerSVG({ width = 320, opacity = 0.07, color = '#fff', flip = false, style = {} }) {
  return (
    <svg viewBox="0 0 200 340" width={width} style={{ position:'absolute', opacity, ...style }}
      transform={flip ? 'scale(-1,1)' : undefined}>
      {/* Head */}
      <circle cx="130" cy="42" r="22" fill={color} />
      {/* Torso leaning forward */}
      <path d="M130 64 L108 148" stroke={color} strokeWidth="18" strokeLinecap="round" fill="none" />
      {/* Left arm back */}
      <path d="M122 90 L80 130" stroke={color} strokeWidth="12" strokeLinecap="round" fill="none" />
      {/* Right arm forward */}
      <path d="M118 88 L155 52" stroke={color} strokeWidth="12" strokeLinecap="round" fill="none" />
      {/* Left leg forward stride */}
      <path d="M108 148 L75 230 L55 310" stroke={color} strokeWidth="16" strokeLinecap="round" fill="none" />
      {/* Right leg back */}
      <path d="M108 148 L148 215 L175 295" stroke={color} strokeWidth="16" strokeLinecap="round" fill="none" />
      {/* Left foot */}
      <path d="M55 310 L30 318" stroke={color} strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Right foot */}
      <path d="M175 295 L200 300" stroke={color} strokeWidth="10" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/* ── Motion trail lines (speed lines) ───────────────────────────── */
function SpeedLines({ count = 8, color = 'rgba(255,255,255,0.04)', style = {} }) {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', ...style }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          position:'absolute', left: 0, right: 0,
          top: `${8 + i * 11}%`, height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${color} 40%, transparent 100%)`,
          transform: `rotate(-${1 + i * 0.3}deg)`,
          opacity: 0.6 + i * 0.04,
        }} />
      ))}
    </div>
  )
}

/* ── TOP NAV BAR ─────────────────────────────────────────────────── */
const TABS = [
  { id: 'app',     label: 'THE APP',       icon: '◆' },
  { id: 'science', label: 'THE SCIENCE',   icon: '⬡' },
  { id: 'how',     label: 'HOW IT WORKS',  icon: '◎' },
  { id: 'plans',   label: 'PLANS',         icon: '◈' },
]

function TopNav({ active, onChange }) {
  return (
    <div style={{
      position:'absolute', top:0, left:0, right:0, height:62, zIndex:50,
      background:'rgba(3,5,18,0.85)', backdropFilter:'blur(24px)',
      borderBottom:'1px solid rgba(255,255,255,0.08)',
      display:'flex', alignItems:'center', padding:'0 24px', gap:0,
    }}>
      {/* Logo */}
      <img src="/logos/Jeani Wordmark White.png" style={{ height:22, marginRight:40, opacity:0.95, flexShrink:0 }} alt="Jeani" />

      {/* Tabs */}
      <div style={{ display:'flex', flex:1, gap:4 }}>
        {TABS.map(t => {
          const isActive = t.id === active
          return (
            <button key={t.id} onClick={() => onChange(t.id)}
              style={{
                padding:'10px 22px', borderRadius:30, border:'none', cursor:'pointer',
                background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                borderBottom: isActive ? `2px solid ${C.sand}` : '2px solid transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.42)',
                fontSize:11, fontFamily:'HostGrotesk', fontWeight: isActive ? 700 : 500,
                letterSpacing:1.8, transition:'all 0.22s', display:'flex', alignItems:'center', gap:7,
              }}>
              <span style={{ fontSize:10, opacity: isActive ? 1 : 0.6 }}>{t.icon}</span>
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Close / restart */}
      <button style={{ width:32,height:32,borderRadius:'50%',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.45)',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}
        title="Return to intro">
        ✕
      </button>
    </div>
  )
}

/* ── Bottom tab bar inside phone ────────────────────────────────── */
function AppTabBar({ active = 'home' }) {
  const tabs = [
    { id:'home',      icon:'⌂', label:'Home' },
    { id:'motion',    icon:'▶', label:'Motion' },
    { id:'body',      icon:'◈', label:'Body' },
    { id:'spotlight', icon:'⊕', label:'Spotlight' },
  ]
  const isActive = id => id === active || (active === 'goal' && id === 'motion')
  return (
    <div style={{ position:'absolute',bottom:0,left:0,right:0,height:76,background:'rgba(0,0,0,0.8)',backdropFilter:'blur(20px)',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',zIndex:20 }}>
      {tabs.map(t => {
        const on = isActive(t.id)
        return (
          <div key={t.id} style={{ flex:1, display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3 }}>
            <div style={{ padding:'6px 14px',borderRadius:22,background:on?'rgba(255,255,255,0.14)':'transparent',transition:'all 0.2s' }}>
              <span style={{ fontSize:on?20:17,color:on?'#fff':'rgba(255,255,255,0.35)' }}>{t.icon}</span>
            </div>
            <span style={{ fontSize:10,color:on?'#fff':'rgba(255,255,255,0.3)',fontFamily:'HostGrotesk',fontWeight:on?600:400 }}>{t.label}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ── Phone frame ─────────────────────────────────────────────────── */
function Phone({ id, children }) {
  return (
    <motion.div key={id}
      initial={{ y:70, opacity:0, scale:0.96 }}
      animate={{ y:0, opacity:1, scale:1 }}
      exit={{ y:-40, opacity:0, scale:0.97 }}
      transition={{ duration:0.65, ease:[0.22,1,0.36,1] }}
      style={{
        width:320, height:640,
        borderRadius:50,
        background:'#06080f',
        position:'relative',
        boxShadow:'0 70px 140px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.14), 0 0 0 2px rgba(255,255,255,0.04)',
        flexShrink:0,
      }}>
      {/* Side buttons */}
      {[{side:'left',top:114,h:34},{side:'left',top:162,h:58},{side:'left',top:234,h:58},{side:'right',top:160,h:78}].map((b,i) => (
        <div key={i} style={{ position:'absolute',[b.side]:b.side==='left'?-3:-3,top:b.top,width:3,height:b.h,background:'rgba(255,255,255,0.14)',borderRadius:b.side==='left'?'2px 0 0 2px':'0 2px 2px 0' }} />
      ))}
      {/* Screen */}
      <div style={{ position:'absolute',inset:8,borderRadius:44,overflow:'hidden',background:'#000' }}>
        {/* Dynamic island */}
        <div style={{ position:'absolute',top:10,left:'50%',transform:'translateX(-50%)',width:116,height:32,background:'#000',borderRadius:20,zIndex:30,display:'flex',alignItems:'center',justifyContent:'center',gap:10 }}>
          <div style={{ width:9,height:9,borderRadius:'50%',background:'#1a1a1a',border:'1px solid #2a2a2a' }} />
          <div style={{ width:11,height:11,borderRadius:'50%',background:'#111',border:'1px solid #222' }} />
        </div>
        {children}
      </div>
      {/* Glass reflection */}
      <div style={{ position:'absolute',inset:8,borderRadius:44,background:'linear-gradient(135deg,rgba(255,255,255,0.07) 0%,transparent 45%)',pointerEvents:'none',zIndex:10 }} />
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   PHONE SCREENS
═══════════════════════════════════════════════════════════════════ */

function HomeScreen() {
  return (
    <div style={{ width:'100%',height:'100%',position:'relative',overflow:'hidden',background:'#0a1428' }}>
      {/* Sky-mountain bg */}
      <div style={{ position:'absolute',inset:0,background:'linear-gradient(180deg,#7aaad4 0%,#4e80b8 18%,#1e4480 40%,#0a1e4e 65%,#050e28 100%)' }} />
      {/* Mountain shape */}
      <svg viewBox="0 0 320 200" style={{ position:'absolute',bottom:'25%',left:0,width:'100%',opacity:0.35 }}>
        <polygon points="0,200 80,70 140,120 200,40 270,90 320,200" fill="#0d2050" />
        <polygon points="0,200 50,100 110,150 180,60 240,110 320,200" fill="#0a1a40" />
      </svg>
      <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'40%',background:'linear-gradient(0deg,rgba(5,10,25,0.98) 0%,transparent 100%)' }} />

      <div style={{ position:'relative',zIndex:2,padding:'48px 16px 80px',display:'flex',flexDirection:'column',gap:11 }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:2 }}>
          <span style={{ fontFamily:'CrimsonPro,serif',fontSize:26,fontWeight:700,color:'#fff',lineHeight:1 }}>J·</span>
          <div style={{ width:32,height:32,borderRadius:'50%',border:'1.5px solid rgba(255,255,255,0.28)',background:'rgba(255,255,255,0.05)',backdropFilter:'blur(8px)' }} />
        </div>

        {/* Score card */}
        <div style={{ background:'rgba(17,35,120,0.52)',backdropFilter:'blur(22px)',borderRadius:22,padding:'18px 20px 16px',border:'1px solid rgba(255,255,255,0.12)',textAlign:'center' }}>
          <div style={{ fontSize:72,fontFamily:'CrimsonPro,serif',fontWeight:700,color:C.amber,lineHeight:0.9,letterSpacing:-2 }}>74</div>
          <div style={{ fontSize:22,fontFamily:'CrimsonPro,serif',fontStyle:'italic',color:'rgba(255,255,255,0.9)',marginTop:5 }}>Motion</div>
          <div style={{ height:1,background:'rgba(255,255,255,0.1)',margin:'12px 0' }} />
          <div style={{ fontSize:11.5,color:'rgba(255,255,255,0.62)',lineHeight:1.65 }}>You're at 74/100 — solid and ready to push. Your left hamstring is up +45.</div>
          <div style={{ marginTop:12,display:'inline-block',padding:'6px 18px',borderRadius:20,border:'1px solid rgba(255,255,255,0.2)',background:'rgba(255,255,255,0.08)',fontSize:10,color:'rgba(255,255,255,0.7)',letterSpacing:1 }}>LEARN MORE</div>
        </div>

        {/* Two cards */}
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
          {/* Daily Recap */}
          <div style={{ background:'rgba(17,35,120,0.48)',backdropFilter:'blur(16px)',borderRadius:18,padding:'14px',border:'1px solid rgba(255,255,255,0.09)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:7,marginBottom:9 }}>
              <div style={{ width:27,height:27,borderRadius:'50%',border:'1.5px solid rgba(255,255,255,0.22)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12 }}>▶</div>
              <div>
                <div style={{ fontSize:11,color:'#fff',fontWeight:700 }}>Daily Recap</div>
                <div style={{ fontSize:9.5,color:'rgba(255,255,255,0.4)' }}>June 7</div>
              </div>
            </div>
            <div style={{ height:1,background:'rgba(255,255,255,0.07)',marginBottom:8 }} />
            <div style={{ fontSize:11,color:C.amber }}>🔥 8 day streak</div>
          </div>
          {/* Spotlight card */}
          <div style={{ background:'rgba(17,35,120,0.48)',backdropFilter:'blur(16px)',borderRadius:18,padding:'14px',border:'1px solid rgba(255,255,255,0.09)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:8 }}>
              <span style={{ fontSize:14 }}>⊕</span>
              <div style={{ fontSize:11,color:'#fff',fontWeight:700 }}>Spotlight</div>
            </div>
            <div style={{ fontSize:11,color:'rgba(255,255,255,0.65)',marginBottom:6 }}>Left Hamstring</div>
            <svg width="100%" height="28" viewBox="0 0 100 28">
              <polyline points="0,26 18,20 38,9 58,7 78,9 100,8" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinejoin="round" />
              <circle cx="100" cy="8" r="3.5" fill={C.green} />
            </svg>
            <div style={{ fontSize:13,color:C.green,fontWeight:700,marginTop:3 }}>+45 pts ↗</div>
          </div>
        </div>

        {/* Log activity */}
        <div style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',backdropFilter:'blur(10px)',borderRadius:16,padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <div style={{ width:26,height:26,borderRadius:'50%',border:'1.5px solid rgba(255,255,255,0.28)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,color:'rgba(255,255,255,0.55)' }}>+</div>
            <span style={{ fontSize:13,color:'rgba(255,255,255,0.65)',fontWeight:500 }}>Log Activity</span>
          </div>
          <span style={{ fontSize:16,color:'rgba(255,255,255,0.25)' }}>›</span>
        </div>

        {/* Motion Goal */}
        <div style={{ background:'rgba(0,0,0,0.4)',backdropFilter:'blur(10px)',borderRadius:16,padding:'10px 16px',textAlign:'center',border:'1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize:8.5,color:'rgba(255,255,255,0.28)',letterSpacing:3,marginBottom:2 }}>MOTION GOAL</div>
          <div style={{ fontSize:18,color:'#fff',fontWeight:700 }}>Today</div>
        </div>
      </div>
      <AppTabBar active="home" />
    </div>
  )
}

function MotionScreen() {
  const metrics = [
    {label:'Joint Changes',value:82,color:C.green},
    {label:'Symmetry',value:78,color:C.green},
    {label:'Mobility',value:62,color:C.amber},
    {label:'Movement Diversity',value:55,color:C.amber},
    {label:'Step Volume',value:48,color:C.amber},
  ]
  const pts=[78,80,75,73,79,74,74], days=['Wed','Thu','Fri','Sat','Sun','Mon','Tue']
  const W=288,H=80,minV=68,maxV=86
  const coords = pts.map((v,i)=>`${(i/(pts.length-1))*W},${H-((v-minV)/(maxV-minV))*H}`)
  return (
    <div style={{ width:'100%',height:'100%',position:'relative',overflow:'auto',background:'#050300' }}>
      <div style={{ position:'absolute',inset:0,background:'linear-gradient(180deg,#c8942a 0%,#8a5e18 22%,#3a2808 50%,#100900 100%)' }} />
      <svg viewBox="0 0 320 220" style={{ position:'absolute',bottom:'28%',left:0,width:'100%',opacity:0.3 }}>
        <polygon points="0,220 60,80 120,130 190,30 260,100 320,220" fill="#2a1a04" />
      </svg>
      <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'45%',background:'linear-gradient(0deg,rgba(5,3,0,1) 0%,transparent 100%)' }} />
      <div style={{ position:'relative',zIndex:2,padding:'48px 16px 84px',minHeight:'100%' }}>
        <div style={{ fontSize:9,color:'rgba(255,255,255,0.35)',letterSpacing:2,marginBottom:6 }}>TODAY</div>
        <div style={{ fontSize:24,fontFamily:'CrimsonPro,serif',fontWeight:700,color:'#fff',marginBottom:4 }}>Motion Score</div>
        <div style={{ fontSize:84,fontFamily:'CrimsonPro,serif',fontWeight:700,color:C.amber,lineHeight:0.88,letterSpacing:-3,marginBottom:16 }}>74</div>
        <div style={{ background:'rgba(255,255,255,0.05)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:20,padding:'16px 17px',marginBottom:12 }}>
          <div style={{ fontSize:11.5,color:'rgba(255,255,255,0.45)',fontStyle:'italic',marginBottom:13 }}>What is Motion? ∨</div>
          {metrics.map((m,i)=>(
            <div key={m.label} style={{ marginBottom:i<metrics.length-1?11:0 }}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4 }}>
                <span style={{ fontSize:12,color:'rgba(255,255,255,0.78)' }}>{m.label}</span>
                <span style={{ fontSize:10,color:'rgba(255,255,255,0.28)' }}>ⓘ</span>
              </div>
              <div style={{ height:5,background:'rgba(255,255,255,0.09)',borderRadius:3,overflow:'hidden' }}>
                <motion.div initial={{width:0}} animate={{width:`${m.value}%`}} transition={{delay:i*0.1+0.3,duration:0.9,ease:'easeOut'}}
                  style={{ height:'100%',background:m.color,borderRadius:3 }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex',gap:7,marginBottom:12 }}>
          {['7 Days','30 Days','90 Days'].map((t,i)=>(
            <div key={t} style={{ flex:1,background:i===0?'rgba(255,255,255,0.18)':'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:22,padding:'7px 0',textAlign:'center',fontSize:11,color:'#fff',fontFamily:'HostGrotesk' }}>{t}</div>
          ))}
        </div>
        <div style={{ background:'rgba(255,255,255,0.05)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:20,padding:'16px 16px 12px',marginBottom:12 }}>
          <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow:'visible',marginBottom:8 }}>
            <defs><linearGradient id="ag" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={C.amber} stopOpacity="0.4"/><stop offset="100%" stopColor={C.amber}/></linearGradient></defs>
            <polyline points={coords.join(' ')} fill="none" stroke="url(#ag)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
            {coords.map((c,i)=>{ const [x,y]=c.split(',').map(Number); return <circle key={i} cx={x} cy={y} r="4.5" fill={C.amber}/> })}
          </svg>
          <div style={{ display:'flex',justifyContent:'space-between' }}>
            {days.map(d=><span key={d} style={{ fontSize:9,color:'rgba(255,255,255,0.3)',fontFamily:'HostGrotesk' }}>{d}</span>)}
          </div>
        </div>
        <div style={{ background:'rgba(255,255,255,0.05)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:20,padding:'14px 17px' }}>
          {[['Average','76'],['Highest','81'],['Lowest','73'],['Change','–4']].map(([k,v])=>(
            <div key={k} style={{ display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:13 }}>
              <span style={{ color:'rgba(255,255,255,0.5)' }}>{k}</span>
              <span style={{ color:'#fff',fontWeight:700,fontFamily:'CrimsonPro,serif' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <AppTabBar active="motion" />
    </div>
  )
}

function GoalScreen() {
  const [pct,setPct]=useState(0)
  useEffect(()=>{
    const t=setTimeout(()=>{ let v=0; const iv=setInterval(()=>{ v+=1; setPct(Math.min(v,74)); if(v>=74)clearInterval(iv) },15); return ()=>clearInterval(iv) },600)
    return ()=>clearTimeout(t)
  },[])
  return (
    <div style={{ width:'100%',height:'100%',position:'relative',background:'#030610',display:'flex',flexDirection:'column' }}>
      <div style={{ position:'absolute',inset:0,background:'linear-gradient(180deg,#1e2e60 0%,#0e1840 35%,#060e25 70%,#020610 100%)' }} />
      <div style={{ position:'absolute',top:'8%',left:'50%',transform:'translateX(-50%)',width:260,height:260,borderRadius:'50%',background:`radial-gradient(circle,rgba(30,60,180,0.35) 0%,transparent 70%)`,filter:'blur(30px)' }} />
      <div style={{ position:'relative',zIndex:2,padding:'50px 16px 82px',display:'flex',flexDirection:'column',gap:14,flex:1 }}>
        <div style={{ textAlign:'center',marginBottom:4 }}>
          <div style={{ fontSize:9,color:'rgba(255,255,255,0.28)',letterSpacing:3 }}>MOTION GOAL</div>
          <div style={{ fontSize:24,color:'#fff',fontWeight:700 }}>Today</div>
        </div>
        <div style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center' }}>
          <div style={{ fontSize:100,fontFamily:'CrimsonPro,serif',fontWeight:700,color:'#fff',lineHeight:1,letterSpacing:-4 }}>{pct}%</div>
          <div style={{ marginTop:18,width:'65%',height:4,background:'rgba(255,255,255,0.1)',borderRadius:2,position:'relative' }}>
            <motion.div animate={{width:`${pct}%`}} transition={{duration:0.05}}
              style={{ height:'100%',background:`linear-gradient(90deg,${C.blue},${C.green})`,borderRadius:2 }} />
            <motion.div animate={{left:`${pct}%`}} transition={{duration:0.05}}
              style={{ position:'absolute',top:'50%',transform:'translate(-50%,-50%)',width:12,height:12,borderRadius:'50%',background:'#fff',boxShadow:`0 0 10px ${C.green}` }} />
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
            {['M','T','W','T','F','S','S'].map(d=><div key={d} style={{ textAlign:'center',fontSize:9,color:'rgba(255,255,255,0.22)',fontFamily:'HostGrotesk' }}>{d}</div>)}
            {Array.from({length:28}).map((_,i)=>(
              <div key={i} style={{ aspectRatio:'1',borderRadius:4,background:i<22?`rgba(0,232,123,${0.1+(i%5)*0.07})`:'rgba(255,255,255,0.04)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,color:'rgba(255,255,255,0.18)' }}>{i+10}</div>
            ))}
          </div>
        </div>
      </div>
      <AppTabBar active="goal" />
    </div>
  )
}

function SpotlightScreen() {
  const pts=[5,28,55,61,58,57,57], days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const W=290,H=88
  const coords=pts.map((v,i)=>`${(i/(pts.length-1))*W},${H-((v+5)/70)*H}`)
  return (
    <div style={{ width:'100%',height:'100%',position:'relative',overflow:'auto',background:'#060100' }}>
      <div style={{ position:'absolute',inset:0,background:'linear-gradient(160deg,#7a2000 0%,#4a1000 28%,#180600 58%,#050100 100%)' }} />
      <div style={{ position:'absolute',top:'5%',right:'-10%',width:280,height:340,background:'linear-gradient(160deg,rgba(160,70,20,0.28) 0%,transparent 70%)',filter:'blur(40px)' }} />
      <div style={{ position:'relative',zIndex:2,padding:'48px 16px 84px',minHeight:'100%' }}>
        <div style={{ fontSize:33,fontFamily:'CrimsonPro,serif',fontWeight:700,color:'#fff',marginBottom:12 }}>Spotlight</div>
        <div style={{ background:'rgba(0,0,0,0.38)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'12px 14px',fontSize:12,color:'rgba(255,255,255,0.58)',lineHeight:1.68,marginBottom:14 }}>
          Based on your recent movement patterns and symptoms, Jeani has identified these areas as potential weak points to keep an eye on.
        </div>
        <div style={{ background:'rgba(255,255,255,0.05)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:22,padding:'18px 18px 16px' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14 }}>
            <div>
              <div style={{ fontSize:19,color:'#fff',fontWeight:700,marginBottom:4 }}>Left Hamstring</div>
              <div style={{ fontSize:12,color:C.green,fontWeight:600 }}>Improving</div>
            </div>
            <div style={{ fontSize:30,color:C.green,fontWeight:700,fontFamily:'CrimsonPro,serif' }}>+45 ↑</div>
          </div>
          <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow:'visible',marginBottom:8 }}>
            <defs>
              <filter id="gg"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <linearGradient id="greenFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.green} stopOpacity="0.2"/>
                <stop offset="100%" stopColor={C.green} stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* Fill area */}
            <path d={`M ${coords.join(' L ')} L ${W},${H} L 0,${H} Z`} fill="url(#greenFill)" />
            <polyline points={coords.join(' ')} fill="none" stroke={C.green} strokeWidth="2.5" strokeLinejoin="round" filter="url(#gg)"/>
            {coords.map((c,i)=>{ const [x,y]=c.split(',').map(Number); return <circle key={i} cx={x} cy={y} r="4.5" fill={C.green}/> })}
          </svg>
          <div style={{ display:'flex',justifyContent:'space-between',marginBottom:14 }}>
            {days.map(d=><span key={d} style={{ fontSize:9,color:'rgba(255,255,255,0.3)',fontFamily:'HostGrotesk' }}>{d}</span>)}
          </div>
          <div style={{ height:1,background:'rgba(255,255,255,0.07)',marginBottom:14 }} />
          <div style={{ fontSize:9.5,color:'rgba(255,255,255,0.28)',letterSpacing:2,marginBottom:8 }}>ⓘ ABOUT</div>
          <div style={{ fontSize:12,color:'rgba(255,255,255,0.62)',lineHeight:1.7,marginBottom:12 }}>The muscles along the back of your thigh. They bend your knee and drive your hips through each stride.</div>
          <div style={{ fontSize:9.5,color:'rgba(255,255,255,0.28)',letterSpacing:2,marginBottom:8 }}>⟡ STRETCH IT</div>
          {['Seated forward fold','Standing toe-touch','Lying single-leg stretch with a strap'].map(s=>(
            <div key={s} style={{ fontSize:12,color:'rgba(255,255,255,0.62)',paddingLeft:12,marginBottom:6 }}>• {s}</div>
          ))}
        </div>
      </div>
      <AppTabBar active="spotlight" />
    </div>
  )
}

function BodyScreen() {
  const zones=[
    {label:'Left Hamstring',status:'Improving',color:C.green,score:'+45',bar:82},
    {label:'Right Knee',status:'Watch closely',color:C.amber,score:'–12',bar:38},
    {label:'Lower Back',status:'Stable',color:'rgba(255,255,255,0.45)',score:'0',bar:60},
    {label:'Left Shoulder',status:'Improving',color:C.green,score:'+8',bar:70},
    {label:'Right Hip',status:'Needs attention',color:'#ff6b6b',score:'–23',bar:28},
    {label:'Right Ankle',status:'Stable',color:'rgba(255,255,255,0.45)',score:'+2',bar:58},
  ]
  return (
    <div style={{ width:'100%',height:'100%',position:'relative',overflow:'auto',background:'#020410' }}>
      <div style={{ position:'absolute',inset:0,background:'linear-gradient(180deg,#0c1838 0%,#060e28 45%,#020410 100%)' }} />
      <div style={{ position:'relative',zIndex:2,padding:'48px 16px 84px',minHeight:'100%' }}>
        <div style={{ fontSize:30,fontFamily:'CrimsonPro,serif',fontWeight:700,color:'#fff',marginBottom:4 }}>Body</div>
        <div style={{ fontSize:11.5,color:'rgba(255,255,255,0.32)',marginBottom:18 }}>Your movement map — updated daily</div>
        {zones.map((z,i)=>(
          <motion.div key={z.label} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.08}}
            style={{ background:'rgba(255,255,255,0.05)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:'14px 16px',marginBottom:9 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8 }}>
              <div>
                <div style={{ fontSize:13.5,color:'#fff',fontWeight:600 }}>{z.label}</div>
                <div style={{ fontSize:11,color:z.color,marginTop:2 }}>{z.status}</div>
              </div>
              <div style={{ fontSize:22,color:z.color,fontWeight:700,fontFamily:'CrimsonPro,serif' }}>{z.score}</div>
            </div>
            <div style={{ height:4,background:'rgba(255,255,255,0.07)',borderRadius:2,overflow:'hidden' }}>
              <div style={{ width:`${z.bar}%`,height:'100%',background:z.color,borderRadius:2 }} />
            </div>
          </motion.div>
        ))}
      </div>
      <AppTabBar active="body" />
    </div>
  )
}

function ChatScreen() {
  const msgs=[
    {from:'user',text:'Why is my left hamstring flagged?'},
    {from:'jeani',text:'Your left hamstring jumped +45 points this week — great progress, but rapid gains can indicate compensation elsewhere. Worth watching over the next few days.'},
    {from:'user',text:'What should I do today?'},
    {from:'jeani',text:'Motion score 74 — you\'re ready to push. A moderate run works well today. Add a hamstring stretch routine afterwards to balance the load.'},
  ]
  const [shown,setShown]=useState(0)
  useEffect(()=>{
    if(shown>=msgs.length) return
    const t=setTimeout(()=>setShown(s=>s+1),shown===0?400:1200)
    return ()=>clearTimeout(t)
  },[shown])
  return (
    <div style={{ width:'100%',height:'100%',position:'relative',background:'#030610',display:'flex',flexDirection:'column' }}>
      <div style={{ position:'absolute',inset:0,background:'linear-gradient(180deg,#0a1030 0%,#060a22 50%,#020610 100%)' }} />
      <div style={{ position:'relative',zIndex:2,padding:'50px 0 76px',display:'flex',flexDirection:'column',flex:1 }}>
        <div style={{ padding:'0 16px 14px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',gap:11 }}>
          <div style={{ width:38,height:38,borderRadius:'50%',background:`linear-gradient(135deg,${C.blue},#1a40c0)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontFamily:'CrimsonPro,serif',fontWeight:700,color:'#fff' }}>J</div>
          <div>
            <div style={{ fontSize:15,color:'#fff',fontWeight:700 }}>Ask Jeani</div>
            <div style={{ display:'flex',alignItems:'center',gap:5 }}>
              <div style={{ width:6,height:6,borderRadius:'50%',background:C.green,boxShadow:`0 0 7px ${C.green}` }} />
              <span style={{ fontSize:10,color:'rgba(255,255,255,0.38)' }}>Active now</span>
            </div>
          </div>
        </div>
        <div style={{ flex:1,overflowY:'auto',padding:'14px 16px',display:'flex',flexDirection:'column',gap:12 }}>
          {msgs.slice(0,shown).map((m,i)=>(
            <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.3}}
              style={{ alignSelf:m.from==='user'?'flex-end':'flex-start',maxWidth:'80%',background:m.from==='user'?'rgba(17,35,120,0.7)':'rgba(255,255,255,0.07)',backdropFilter:'blur(10px)',border:`1px solid ${m.from==='user'?'rgba(60,90,200,0.4)':'rgba(255,255,255,0.08)'}`,borderRadius:m.from==='user'?'18px 18px 4px 18px':'18px 18px 18px 4px',padding:'10px 14px',fontSize:12,color:'#fff',lineHeight:1.68 }}>
              {m.text}
            </motion.div>
          ))}
          {shown<msgs.length&&shown>0&&(
            <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ alignSelf:'flex-start',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'18px 18px 18px 4px',padding:'10px 16px' }}>
              <div style={{ display:'flex',gap:4 }}>
                {[0,1,2].map(i=><motion.div key={i} animate={{y:[0,-5,0]}} transition={{duration:0.6,repeat:Infinity,delay:i*0.14}} style={{ width:6,height:6,borderRadius:'50%',background:'rgba(255,255,255,0.38)' }} />)}
              </div>
            </motion.div>
          )}
        </div>
        <div style={{ padding:'0 16px' }}>
          <div style={{ background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:30,padding:'10px 16px',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
            <span style={{ fontSize:12,color:'rgba(255,255,255,0.26)' }}>Ask anything about your movement…</span>
            <div style={{ width:30,height:30,borderRadius:'50%',background:C.sand,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:C.blue,fontWeight:700,flexShrink:0 }}>↑</div>
          </div>
        </div>
      </div>
      <AppTabBar active="chat" />
    </div>
  )
}

function StreakScreen() {
  const days=['M','T','W','T','F','S','S']
  return (
    <div style={{ width:'100%',height:'100%',position:'relative',overflow:'auto',background:'#0a0200' }}>
      <div style={{ position:'absolute',inset:0,background:'linear-gradient(180deg,#3a1000 0%,#1a0800 40%,#070200 100%)' }} />
      <div style={{ position:'absolute',top:'8%',left:'18%',width:220,height:220,borderRadius:'50%',background:`radial-gradient(circle,${C.amber}55 0%,transparent 70%)`,filter:'blur(45px)' }} />
      <div style={{ position:'relative',zIndex:2,padding:'50px 16px 84px',minHeight:'100%' }}>
        <div style={{ textAlign:'center',marginBottom:18 }}>
          <div style={{ fontSize:50,lineHeight:1 }}>🔥</div>
          <div style={{ fontSize:90,fontFamily:'CrimsonPro,serif',fontWeight:700,color:C.amber,lineHeight:0.88,letterSpacing:-4,marginTop:8 }}>8</div>
          <div style={{ fontSize:16,color:'rgba(255,255,255,0.5)',marginTop:6 }}>day streak</div>
        </div>
        <div style={{ background:'rgba(255,255,255,0.05)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,padding:'16px 18px',marginBottom:14 }}>
          <div style={{ fontSize:9.5,color:'rgba(255,255,255,0.28)',letterSpacing:2,marginBottom:12 }}>THIS WEEK</div>
          <div style={{ display:'flex',justifyContent:'space-between' }}>
            {days.map((d,i)=>(
              <div key={i} style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:6 }}>
                <div style={{ width:32,height:32,borderRadius:'50%',background:i<6?C.amber:'rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:i<6?'#000':'rgba(255,255,255,0.18)',boxShadow:i<6?`0 0 14px ${C.amber}66`:'none',fontWeight:700 }}>{i<6?'✓':''}</div>
                <span style={{ fontSize:10,color:'rgba(255,255,255,0.32)',fontFamily:'HostGrotesk' }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background:`rgba(245,160,0,0.08)`,border:`1px solid rgba(245,160,0,0.18)`,borderRadius:18,padding:'16px 18px',textAlign:'center',marginBottom:14 }}>
          <div style={{ fontSize:14.5,color:C.amber,fontStyle:'italic',fontFamily:'CrimsonPro,serif',lineHeight:1.5 }}>"Consistency is the only metric that compounds."</div>
        </div>
        <div style={{ background:'rgba(255,255,255,0.05)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,padding:'16px 18px' }}>
          <div style={{ display:'flex',justifyContent:'space-around' }}>
            {[['Best streak','14 days'],['This month','22 / 31'],['All time','8 🔥']].map(([k,v])=>(
              <div key={k} style={{ textAlign:'center' }}>
                <div style={{ fontSize:17,color:'#fff',fontWeight:700,fontFamily:'CrimsonPro,serif' }}>{v}</div>
                <div style={{ fontSize:10,color:'rgba(255,255,255,0.28)',marginTop:3 }}>{k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AppTabBar active="streak" />
    </div>
  )
}

const SCREENS = { home:HomeScreen,motion:MotionScreen,goal:GoalScreen,spotlight:SpotlightScreen,body:BodyScreen,chat:ChatScreen,streak:StreakScreen }

/* ═══════════════════════════════════════════════════════════════════
   THE APP SECTION
═══════════════════════════════════════════════════════════════════ */
const FEATURES = [
  { id:'home',      label:'Home',         tagline:'Your daily motion, at a glance.',                              grad:'/gradients/Track Grad-08.png', base:'#020810', orb1:'#0d2a80', orb2:C.amber },
  { id:'motion',    label:'Motion Score', tagline:'Five dimensions of how your body moves.',                     grad:'/gradients/Track Grad-09.png', base:'#040a04', orb1:'#1a4a0a', orb2:C.amber },
  { id:'goal',      label:'Motion Goal',  tagline:'A daily target built around you.',                            grad:'/gradients/Track Grad-10.png', base:'#020810', orb1:'#062840', orb2:C.green },
  { id:'spotlight', label:'Spotlight',    tagline:'Finds what needs attention before you feel it.',              grad:'/gradients/Track Grad-11.png', base:'#080200', orb1:'#6b1800', orb2:C.green },
  { id:'body',      label:'Body',         tagline:'A complete picture of your physical self.',                   grad:'/gradients/Track Grad-13.png', base:'#020510', orb1:'#0d1e60', orb2:C.sand },
  { id:'chat',      label:'Ask Jeani',    tagline:'Your personal movement coach, always on.',                   grad:'/gradients/Track Grad-14.png', base:'#030210', orb1:'#100860', orb2:C.sand },
  { id:'streak',    label:'Streak',       tagline:'Consistency is the only metric that compounds.',             grad:'/gradients/Track Grad-08.png', base:'#080200', orb1:'#7a2800', orb2:C.amber },
]

function TheApp() {
  const [idx,setIdx]=useState(0)
  const feat=FEATURES[idx]
  const Screen=SCREENS[feat.id]

  return (
    <div style={{ width:'100%',height:'100%',position:'relative',overflow:'hidden',background:feat.base }}>
      {/* Background imagery */}
      <img src={feat.grad} alt="" style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.38,mixBlendMode:'screen',zIndex:0 }} />
      <Orb color={feat.orb1} size={620} x="32%" y="42%" op={0.52} />
      <Orb color={feat.orb2} size={270} x="74%" y="68%" op={0.16} />

      {/* Speed lines — movement feel */}
      <SpeedLines count={10} color="rgba(255,255,255,0.025)" />

      {/* Runner silhouettes */}
      <RunnerSVG width={260} opacity={0.055} color="#fff"
        style={{ bottom:60, right:80, zIndex:2 }} />
      <RunnerSVG width={160} opacity={0.035} color="#fff" flip
        style={{ bottom:120, left:20, zIndex:2 }} />

      <Grain op={0.11} blend="overlay" />

      {/* ─ Left panel: feature label + nav ─ */}
      <div style={{ position:'absolute',left:0,top:0,bottom:0,width:180,zIndex:10,display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 0 0 28px',background:'linear-gradient(90deg,rgba(0,0,0,0.55) 0%,transparent 100%)' }}>
        <AnimatePresence mode="wait">
          <motion.div key={feat.id} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:12}} transition={{duration:0.35}}
            style={{ marginBottom:32 }}>
            <div style={{ fontSize:11,color:'rgba(255,255,255,0.4)',letterSpacing:2.5,marginBottom:8,fontFamily:'HostGrotesk' }}>FEATURE</div>
            <div style={{ fontFamily:'CrimsonPro,serif',fontSize:36,fontWeight:700,color:'#fff',lineHeight:1.05,letterSpacing:-0.5 }}>{feat.label}</div>
            <div style={{ fontFamily:'CrimsonPro,serif',fontStyle:'italic',fontSize:13,color:'rgba(255,255,255,0.48)',marginTop:8,lineHeight:1.5 }}>{feat.tagline}</div>
          </motion.div>
        </AnimatePresence>

        {/* Feature list */}
        <div style={{ display:'flex',flexDirection:'column',gap:4 }}>
          {FEATURES.map((f,i)=>(
            <button key={f.id} onClick={()=>setIdx(i)}
              style={{ display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:10,border:'none',cursor:'pointer',background:i===idx?'rgba(255,255,255,0.12)':'transparent',textAlign:'left',transition:'all 0.2s',borderLeft:`3px solid ${i===idx?C.sand:'transparent'}` }}>
              <div style={{ width:6,height:6,borderRadius:'50%',background:i===idx?C.sand:'rgba(255,255,255,0.25)',flexShrink:0,transition:'all 0.2s' }} />
              <span style={{ fontSize:11,color:i===idx?'#fff':'rgba(255,255,255,0.38)',fontFamily:'HostGrotesk',fontWeight:i===idx?700:400,letterSpacing:0.3 }}>{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─ Phone centred ─ */}
      <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:8,paddingLeft:180 }}>
        <AnimatePresence mode="wait">
          <Phone key={feat.id} id={feat.id}><Screen /></Phone>
        </AnimatePresence>
      </div>

      {/* ─ Prev / Next ─ */}
      {idx>0&&(
        <button onClick={()=>setIdx(i=>i-1)}
          style={{ position:'absolute',bottom:28,right:120,zIndex:20,width:44,height:44,borderRadius:'50%',background:'rgba(255,255,255,0.09)',border:'1px solid rgba(255,255,255,0.18)',color:'#fff',fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(10px)' }}>‹</button>
      )}
      {idx<FEATURES.length-1&&(
        <button onClick={()=>setIdx(i=>i+1)}
          style={{ position:'absolute',bottom:28,right:68,zIndex:20,width:44,height:44,borderRadius:'50%',background:'rgba(255,255,255,0.09)',border:'1px solid rgba(255,255,255,0.18)',color:'#fff',fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(10px)' }}>›</button>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   THE SCIENCE SECTION
═══════════════════════════════════════════════════════════════════ */
function TheScience() {
  const stats=[
    {num:'5',label:'Movement Dimensions',desc:'Joint Changes · Symmetry · Mobility · Movement Diversity · Step Volume'},
    {num:'⌚',label:'Apple Watch Integration',desc:'Real-time biometric data, always with you on your wrist'},
    {num:'STAB',label:'Science & Technical Advisory Board',desc:'Amy Arendelle · Jacob Rothman · Dr. Blake Boggess'},
  ]
  return (
    <div style={{ width:'100%',height:'100%',background:'#f0ebe0',display:'flex',flexDirection:'column',position:'relative',overflow:'hidden' }}>
      <Grain op={0.05} blend="multiply" />
      <div style={{ flex:1,display:'flex',zIndex:1 }}>
        {/* Left image panel */}
        <div style={{ width:'40%',position:'relative',overflow:'hidden',display:'flex',alignItems:'flex-end',padding:44 }}>
          <img src="/team-prize.jpg" alt="Jeani team" style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'top center' }} />
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(17,35,120,0.2) 0%,rgba(5,10,40,0.88) 100%)' }} />
          <Grain op={0.12} blend="overlay" />
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7}} style={{ position:'relative',zIndex:4 }}>
            <img src="/logos/Jeani Wordmark White.png" style={{ height:30,marginBottom:20 }} alt="Jeani" />
            <div style={{ fontFamily:'CrimsonPro,serif',fontStyle:'italic',fontSize:15,color:'rgba(255,255,255,0.82)',lineHeight:1.75 }}>
              "Built with leading movement scientists and physicians to deliver insights athletes and everyday movers can actually trust."
            </div>
          </motion.div>
        </div>
        {/* Right content */}
        <div style={{ flex:1,padding:'50px 52px 28px',display:'flex',flexDirection:'column' }}>
          <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}}>
            <div style={{ fontFamily:'CrimsonPro,serif',fontSize:46,fontWeight:700,color:C.blue,lineHeight:1.05,marginBottom:14 }}>Critically acclaimed.<br />Backed by science.</div>
            <div style={{ fontSize:14,color:'#666',lineHeight:1.78,marginBottom:34,maxWidth:460 }}>Jeani combines clinical-grade movement analysis with personalised AI coaching — turning daily data into decisions that protect your body and elevate your performance.</div>
          </motion.div>
          <div style={{ display:'flex',flexDirection:'column',gap:13 }}>
            {stats.map((s,i)=>(
              <motion.div key={s.label} initial={{opacity:0,x:22}} animate={{opacity:1,x:0}} transition={{delay:i*0.13}}
                style={{ background:C.blue,borderRadius:18,padding:'18px 24px',display:'flex',gap:20,alignItems:'center',position:'relative',overflow:'hidden' }}>
                <Grain op={0.08} blend="overlay" />
                <div style={{ fontFamily:'CrimsonPro,serif',fontSize:22,fontWeight:700,color:C.sand,minWidth:52,lineHeight:1 }}>{s.num}</div>
                <div style={{ position:'relative',zIndex:1 }}>
                  <div style={{ fontSize:12,color:C.sand,fontWeight:700,marginBottom:4 }}>{s.label}</div>
                  <div style={{ fontSize:11,color:'rgba(251,236,207,0.58)',lineHeight:1.5 }}>{s.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background:C.blue,padding:'15px 52px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'relative',overflow:'hidden',zIndex:1 }}>
        <Grain op={0.1} blend="overlay" />
        <div style={{ fontFamily:'CrimsonPro,serif',fontStyle:'italic',fontSize:15,color:C.sand,position:'relative',zIndex:1 }}>Accurate by design — Jeani reads movement where it matters most.</div>
        <img src="/logos/Jeani Wordmark Sand White.png" style={{ height:22,position:'relative',zIndex:1 }} alt="Jeani" />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   HOW IT WORKS SECTION
═══════════════════════════════════════════════════════════════════ */
function HowItWorks() {
  const steps=[
    {num:'01',title:'Download Jeani',desc:'Available on the App Store. Set up your profile and movement baseline in minutes.',icon:'📱'},
    {num:'02',title:'Sync Apple Watch',desc:'Jeani connects to Apple Watch and reads your movement in real time — no extra hardware required.',icon:'⌚'},
    {num:'03',title:'Get Your Score',desc:'Every day: Motion score, Spotlight insights, and a personalised goal — so you always know where you stand.',icon:'◆'},
  ]
  return (
    <div style={{ width:'100%',height:'100%',background:'#050a18',position:'relative',overflow:'hidden',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'36px 60px' }}>
      <img src="/gradients/Track Grad-09.png" alt="" style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.34,mixBlendMode:'screen' }} />

      {/* Movement silhouettes */}
      <RunnerSVG width={340} opacity={0.05} color="#fff" style={{ right:-20,bottom:-20,zIndex:2 }} />
      <RunnerSVG width={220} opacity={0.035} color="#fff" flip style={{ left:20,top:60,zIndex:2 }} />
      <SpeedLines count={12} color="rgba(255,255,255,0.02)" />

      <Orb color="#112378" size={700} x="50%" y="55%" op={0.48} />
      <Grain op={0.12} blend="overlay" />

      <motion.div initial={{opacity:0,y:-18}} animate={{opacity:1,y:0}} style={{ textAlign:'center',marginBottom:48,position:'relative',zIndex:4 }}>
        <div style={{ fontFamily:'CrimsonPro,serif',fontSize:50,fontWeight:700,color:'#fff',lineHeight:1 }}>How it works</div>
        <div style={{ fontSize:14,color:'rgba(255,255,255,0.38)',marginTop:10 }}>From download to daily insight — three steps.</div>
      </motion.div>
      <div style={{ display:'flex',gap:22,width:'100%',maxWidth:900,position:'relative',zIndex:4 }}>
        {steps.map((s,i)=>(
          <motion.div key={s.num} initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:i*0.18}}
            style={{ flex:1,background:'rgba(255,255,255,0.04)',backdropFilter:'blur(20px)',borderRadius:26,padding:32,border:'1px solid rgba(255,255,255,0.08)',position:'relative',overflow:'hidden' }}>
            <Grain op={0.07} blend="overlay" />
            <div style={{ fontSize:36,marginBottom:16 }}>{s.icon}</div>
            <div style={{ fontFamily:'CrimsonPro,serif',fontSize:13,color:C.sand,fontWeight:600,marginBottom:8,letterSpacing:1.5 }}>{s.num}</div>
            <div style={{ fontFamily:'CrimsonPro,serif',fontSize:26,fontWeight:700,color:'#fff',marginBottom:14,lineHeight:1.1 }}>{s.title}</div>
            <div style={{ fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.78 }}>{s.desc}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8}}
        style={{ marginTop:38,display:'flex',alignItems:'center',gap:12,position:'relative',zIndex:4 }}>
        <span style={{ fontSize:18 }}>⌚</span>
        <span style={{ fontSize:12,color:'rgba(255,255,255,0.3)',letterSpacing:0.4 }}>Requires Apple Watch Series 4 or later · iOS 16+</span>
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   PLANS SECTION
═══════════════════════════════════════════════════════════════════ */
function Plans() {
  const [billing,setBilling]=useState('monthly')
  const free=['Motion Score (daily)','Motion Goal tracker','7-day history','Apple Watch sync','Basic insights']
  const pro=['Everything in Free','Spotlight — muscle insights','Ask Jeani (AI coach)','90-day history','Streak tracking & milestones','Priority support']
  return (
    <div style={{ width:'100%',height:'100%',background:'#f0ebe0',position:'relative',overflow:'hidden',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'36px 60px' }}>
      <Grain op={0.06} blend="multiply" />

      <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} style={{ textAlign:'center',marginBottom:34,position:'relative',zIndex:1 }}>
        <div style={{ fontFamily:'CrimsonPro,serif',fontSize:50,fontWeight:700,color:C.blue,lineHeight:1 }}>Movement is Medicine.</div>
        <div style={{ fontSize:14,color:'#999',marginTop:10 }}>Choose the plan that moves with you.</div>
        <div style={{ display:'flex',marginTop:22,background:'rgba(17,35,120,0.08)',borderRadius:30,padding:4,width:'fit-content',margin:'22px auto 0' }}>
          {['monthly','annual'].map(b=>(
            <button key={b} onClick={()=>setBilling(b)}
              style={{ padding:'9px 26px',borderRadius:26,border:'none',cursor:'pointer',fontSize:12,fontFamily:'HostGrotesk',fontWeight:600,transition:'all 0.25s',background:billing===b?C.blue:'transparent',color:billing===b?'#fff':'#888' }}>
              {b==='monthly'?'Monthly':<span>Annual <span style={{ marginLeft:6,background:C.green,color:'#000',fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:10,verticalAlign:'middle' }}>SAVE 17%</span></span>}
            </button>
          ))}
        </div>
      </motion.div>

      <div style={{ display:'flex',gap:22,width:'100%',maxWidth:700,alignItems:'flex-start',position:'relative',zIndex:1 }}>
        <motion.div initial={{opacity:0,x:-26}} animate={{opacity:1,x:0}} transition={{delay:0.2}}
          style={{ flex:1,background:'#fff',borderRadius:28,padding:32,border:'1.5px solid rgba(17,35,120,0.1)',boxShadow:'0 4px 30px rgba(0,0,0,0.07)',position:'relative',overflow:'hidden' }}>
          <Grain op={0.04} blend="multiply" />
          <div style={{ fontFamily:'CrimsonPro,serif',fontSize:30,fontWeight:700,color:C.blue,marginBottom:8 }}>Free</div>
          <div style={{ fontSize:46,fontFamily:'CrimsonPro,serif',color:C.blue,fontWeight:700,lineHeight:1,marginBottom:26 }}>$0</div>
          {free.map(f=>(
            <div key={f} style={{ display:'flex',gap:11,alignItems:'center',marginBottom:13 }}>
              <div style={{ width:18,height:18,borderRadius:'50%',background:`${C.blue}12`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:C.blue,flexShrink:0 }}>✓</div>
              <span style={{ fontSize:13,color:'#555' }}>{f}</span>
            </div>
          ))}
          <button style={{ width:'100%',marginTop:26,padding:'14px',borderRadius:14,border:`2px solid ${C.blue}`,background:'transparent',color:C.blue,fontSize:14,fontWeight:700,fontFamily:'HostGrotesk',cursor:'pointer' }}>Get Started</button>
        </motion.div>

        <motion.div initial={{opacity:0,x:26}} animate={{opacity:1,x:0}} transition={{delay:0.32}}
          style={{ flex:1,background:C.blue,borderRadius:28,padding:32,boxShadow:'0 14px 52px rgba(17,35,120,0.35)',position:'relative',overflow:'hidden' }}>
          <img src="/gradients/Track Grad-08.png" alt="" style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.28,mixBlendMode:'screen' }} />
          <Orb color="#1a40c0" size={280} x="85%" y="15%" op={0.38} />
          <Grain op={0.1} blend="overlay" />
          <div style={{ position:'relative',zIndex:1 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8 }}>
              <div style={{ fontFamily:'CrimsonPro,serif',fontSize:30,fontWeight:700,color:C.sand }}>Pro</div>
              <div style={{ background:C.amber,borderRadius:20,padding:'4px 14px',fontSize:10,color:'#000',fontWeight:700 }}>POPULAR</div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={billing} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} transition={{duration:0.2}}>
                <div style={{ fontSize:46,fontFamily:'CrimsonPro,serif',color:C.sand,fontWeight:700,lineHeight:1 }}>
                  {billing==='monthly'?'$9.99':'$99.99'}
                  <span style={{ fontSize:16,fontWeight:400,color:'rgba(251,236,207,0.48)' }}>{billing==='monthly'?'/mo':'/yr'}</span>
                </div>
                <div style={{ fontSize:11,color:'rgba(251,236,207,0.38)',marginBottom:26,marginTop:4 }}>
                  {billing==='monthly'?'First month free':'$8.33/mo · first month free'}
                </div>
              </motion.div>
            </AnimatePresence>
            {pro.map(f=>(
              <div key={f} style={{ display:'flex',gap:11,alignItems:'center',marginBottom:13 }}>
                <div style={{ width:18,height:18,borderRadius:'50%',background:`${C.sand}20`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:C.sand,flexShrink:0 }}>✓</div>
                <span style={{ fontSize:13,color:C.sand }}>{f}</span>
              </div>
            ))}
            <button style={{ width:'100%',marginTop:26,padding:'14px',borderRadius:14,border:'none',background:C.sand,color:C.blue,fontSize:14,fontWeight:700,fontFamily:'HostGrotesk',cursor:'pointer' }}>Go Pro</button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   INTRO
═══════════════════════════════════════════════════════════════════ */
function Particles() {
  const p=useRef(Array.from({length:55},()=>({x:Math.random()*100,y:Math.random()*100,s:Math.random()*2+0.5,d:Math.random()*5+3,dl:Math.random()*4})))
  return (
    <div style={{ position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none' }}>
      {p.current.map((pt,i)=>(
        <motion.div key={i} animate={{y:[0,-20,0],opacity:[0.1,0.5,0.1]}} transition={{duration:pt.d,repeat:Infinity,delay:pt.dl,ease:'easeInOut'}}
          style={{ position:'absolute',left:`${pt.x}%`,top:`${pt.y}%`,width:pt.s,height:pt.s,borderRadius:'50%',background:'rgba(251,236,207,0.5)' }} />
      ))}
    </div>
  )
}

function Intro({ onDone }) {
  useEffect(()=>{ const t=setTimeout(onDone,4000); return ()=>clearTimeout(t) },[onDone])
  return (
    <motion.div exit={{opacity:0,transition:{duration:0.9}}}
      style={{ position:'fixed',inset:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',background:'#03050f' }}>
      {/* Brand image bg */}
      <img src="/brand-movement.png" alt="" style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.6 }} />
      <div style={{ position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(3,5,15,0.5) 0%,rgba(3,5,15,0.75) 100%)' }} />

      <Orb color="#0d2080" size={800} x="38%" y="55%" op={0.65} />
      <Orb color={C.amber} size={300} x="70%" y="58%" op={0.14} />
      <Grain op={0.16} blend="overlay" />

      {/* Runner silhouettes in intro */}
      <RunnerSVG width={380} opacity={0.07} color="#fff" style={{ right:40, bottom:0, zIndex:2 }} />
      <RunnerSVG width={200} opacity={0.04} color="#fff" flip style={{ left:60, bottom:40, zIndex:2 }} />
      <SpeedLines count={14} color="rgba(255,255,255,0.018)" />
      <Particles />

      <div style={{ position:'relative',zIndex:5,textAlign:'center' }}>
        <motion.img src="/logos/Jeani Wordmark White.png" alt="Jeani"
          initial={{opacity:0,scale:0.84,y:14}} animate={{opacity:1,scale:1,y:0}} transition={{duration:1.2,ease:[0.22,1,0.36,1]}}
          style={{ height:72,marginBottom:28,filter:'drop-shadow(0 0 50px rgba(255,255,255,0.14))' }} />
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.7,duration:0.9}}
          style={{ fontFamily:'CrimsonPro,serif',fontStyle:'italic',fontSize:26,color:C.sand,letterSpacing:0.3,textShadow:'0 0 50px rgba(251,236,207,0.22)' }}>
          Movement is Medicine.
        </motion.div>
        <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:1.1,duration:0.7}}
          style={{ fontSize:12,color:'rgba(255,255,255,0.38)',marginTop:10,letterSpacing:1 }}>
          10 · 20 · 2025 — Starting the movement.
        </motion.div>
        <motion.button initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.9,duration:0.5}} onClick={onDone}
          style={{ marginTop:50,background:'rgba(251,236,207,0.07)',border:'1px solid rgba(251,236,207,0.2)',color:'rgba(251,236,207,0.68)',borderRadius:30,padding:'12px 38px',fontSize:11,fontFamily:'HostGrotesk',cursor:'pointer',letterSpacing:2.5,backdropFilter:'blur(10px)' }}>
          EXPLORE
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [showIntro,setShowIntro]=useState(true)
  const [activeTab,setActiveTab]=useState('app')
  const sections={ app:TheApp, science:TheScience, how:HowItWorks, plans:Plans }
  const Section=sections[activeTab]

  return (
    <div style={{ width:'100vw',height:'100vh',overflow:'hidden',display:'flex',flexDirection:'column',background:'#000' }}>
      <AnimatePresence>{showIntro&&<Intro onDone={()=>setShowIntro(false)} />}</AnimatePresence>

      {/* TOP NAV */}
      <div style={{ position:'relative',zIndex:50,flexShrink:0 }}>
        <div style={{ height:62,background:'rgba(3,5,18,0.88)',backdropFilter:'blur(24px)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',padding:'0 24px',gap:0 }}>
          <img src="/logos/Jeani Wordmark White.png" style={{ height:22,marginRight:44,opacity:0.95,flexShrink:0 }} alt="Jeani" />
          <div style={{ display:'flex',flex:1,gap:4 }}>
            {TABS.map(t=>{
              const on=t.id===activeTab
              return (
                <button key={t.id} onClick={()=>setActiveTab(t.id)}
                  style={{ padding:'10px 24px',borderRadius:30,border:'none',cursor:'pointer',background:on?'rgba(255,255,255,0.11)':'transparent',borderBottom:on?`2px solid ${C.sand}`:'2px solid transparent',color:on?'#fff':'rgba(255,255,255,0.4)',fontSize:11,fontFamily:'HostGrotesk',fontWeight:on?700:500,letterSpacing:1.8,transition:'all 0.22s',display:'flex',alignItems:'center',gap:8 }}>
                  <span style={{ fontSize:10,opacity:on?1:0.55 }}>{t.icon}</span>{t.label}
                </button>
              )
            })}
          </div>
          <button onClick={()=>setShowIntro(true)}
            style={{ width:32,height:32,borderRadius:'50%',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.42)',fontSize:15,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex:1,overflow:'hidden',position:'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.32}}
            style={{ position:'absolute',inset:0 }}>
            <Section />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
