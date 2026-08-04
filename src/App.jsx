/* ══════════════════════════════════════════════════════════════════
   JEANI DEMO: one continuous scroll, five chapters, sticky rail.
══════════════════════════════════════════════════════════════════ */
import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import './index.css'
import { useIsMobile, PageGrain } from './brand.jsx'
import { C, F, APP_STORE_URL } from './tokens.js'
import {
  Hero, MotionChapter, RadarChapter, SpotlightChapter,
  WatchInterlude, ScienceChapter, PlansChapter, Footer,
  InterludeLab, InterludeEarly, InterludeMorning,
} from './chapters.jsx'

const CHAPTERS = [
  { id:'motion',    n:'01', label:'Motion' },
  { id:'radar',     n:'02', label:'Radar' },
  { id:'spotlight', n:'03', label:'Spotlight' },
  { id:'science',   n:'04', label:'Science' },
  { id:'plans',     n:'05', label:'Plans' },
]

/* Which chapter owns the middle of the viewport right now */
function useActiveChapter() {
  const [active, setActive] = useState(null)
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        const hit = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    const ids = ['top', ...CHAPTERS.map(c => c.id), 'watch']
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])
  return active
}

function Rail() {
  const active = useActiveChapter()
  const mobile = useIsMobile()
  const [solid, setSolid] = useState(false)
  const navRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > window.innerHeight * 0.75)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* On narrow screens the five chapters do not all fit, so keep the current
     one scrolled into the rail rather than letting it drift off the edge. */
  useEffect(() => {
    const nav = navRef.current
    if (!nav || !active) return
    const chip = nav.querySelector(`[data-chip="${active}"]`)
    if (!chip) return
    const left = chip.offsetLeft - (nav.clientWidth - chip.offsetWidth) / 2
    nav.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [active])

  return (
    <div style={{ position:'fixed',top:0,left:0,right:0,zIndex:90,
      background: solid ? 'rgba(4,5,14,0.86)' : 'transparent',
      backdropFilter: solid ? 'blur(22px)' : 'none',
      WebkitBackdropFilter: solid ? 'blur(22px)' : 'none',
      borderBottom: `1px solid ${solid ? 'rgba(214,228,255,0.1)' : 'transparent'}`,
      transition:'background 0.4s, border-color 0.4s' }}>

      <div style={{ height: mobile ? 52 : 56,display:'flex',alignItems:'center',
        gap:mobile ? 14 : 30,padding: mobile ? '0 18px' : '0 26px',maxWidth:1520,margin:'0 auto' }}>

        <a href="#top" style={{ display:'flex',alignItems:'center',flexShrink:0 }}>
          <img src="/logos/Jeani Wordmark White.png" alt="Jeani"
            style={{ height: mobile ? 18 : 21,opacity:0.95 }} />
        </a>

        <nav ref={navRef} className="no-bar" style={{ display:'flex',gap:mobile ? 6 : 4,flex:1,
          overflowX:'auto',alignItems:'center',
          // Fades the trailing chip when the rail overflows, so it reads as scrollable
          maskImage: mobile ? 'linear-gradient(90deg, #000 84%, transparent 100%)' : 'none',
          WebkitMaskImage: mobile ? 'linear-gradient(90deg, #000 84%, transparent 100%)' : 'none' }}>
          {CHAPTERS.map(c => {
            const on = active === c.id
            return (
              <a key={c.id} href={`#${c.id}`} data-chip={c.id}
                style={{ display:'flex',alignItems:'center',gap:7,textDecoration:'none',flexShrink:0,
                  padding: mobile ? '6px 11px' : '7px 14px',borderRadius:20,
                  background: on ? 'rgba(251,236,207,0.12)' : 'transparent',
                  transition:'background 0.25s' }}>
                <span style={{ fontFamily:F.display,fontSize:11,fontWeight:700,
                  color: on ? C.sand : 'rgba(255,255,255,0.3)' }}>{c.n}</span>
                <span style={{ fontFamily:F.body,fontSize: mobile ? 11 : 11.5,fontWeight: on ? 700 : 500,
                  letterSpacing:1.4,textTransform:'uppercase',
                  color: on ? '#fff' : 'rgba(255,255,255,0.42)',transition:'color 0.25s' }}>
                  {c.label}
                </span>
              </a>
            )
          })}
        </nav>

        {!mobile && (
          <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer"
            style={{ flexShrink:0,padding:'9px 20px',borderRadius:22,background:C.sand,color:C.navy,
              textDecoration:'none',fontFamily:F.body,fontSize:12,fontWeight:700,letterSpacing:0.4 }}>
            Free trial
          </a>
        )}
      </div>

      {/* Scroll progress */}
      <motion.div style={{ height:2,background:`linear-gradient(90deg, ${C.electric}, ${C.sand})`,
        transformOrigin:'0%',scaleX:bar }} />
    </div>
  )
}

export default function App() {
  return (
    <div style={{ background:C.night,position:'relative' }}>
      <Rail />
      <Hero />
      <MotionChapter />
      <InterludeLab />
      <RadarChapter />
      <InterludeEarly />
      <SpotlightChapter />
      <InterludeMorning />
      <WatchInterlude />
      <ScienceChapter />
      <PlansChapter />
      <Footer />
      <PageGrain />
    </div>
  )
}
