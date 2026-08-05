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
    // Only the numbered chapters are observed. The hero, the photo bands and
    // the watch interlude are deliberately left out: if they could win, the
    // rail would show no active chapter and, on mobile, no label at all.
    CHAPTERS.forEach(c => {
      const el = document.getElementById(c.id)
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

  /* The rail turns opaque once the hero is three quarters gone. Driven by an
     observer on the hero rather than a scroll handler: no state update on
     every scroll frame, and nothing to go stale if a scroll event is missed.
     A -25% top margin makes the hero stop intersecting at exactly 0.75vh. */
  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return
    const obs = new IntersectionObserver(
      ([e]) => setSolid(!e.isIntersecting),
      { rootMargin: '-25% 0px 0px 0px', threshold: 0 },
    )
    obs.observe(hero)
    return () => obs.disconnect()
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

        {/* minWidth:0 matters: a flex item defaults to min-width:auto and will
            refuse to shrink below its content, which pushed this rail wider
            than the viewport on a phone and shunted 04 and 05 off-screen. */}
        {/* minWidth:0 matters: a flex item defaults to min-width:auto and will
            refuse to shrink below its content, which pushed this rail wider
            than the viewport on a phone and shunted 04 and 05 off-screen. */}
        <nav ref={navRef} className="no-bar" style={{ display:'flex',gap:mobile ? 2 : 4,flex:1,
          minWidth:0,overflowX:'auto',alignItems:'center',justifyContent:'flex-start' }}>
          {CHAPTERS.map(c => {
            const on = active === c.id
            // On a phone every chapter is a number and exactly one spells
            // itself out, so all five fit. Before any chapter is reached the
            // first one carries the label, so the rail never reads as a row
            // of bare digits.
            const showLabel = !mobile || c.id === (active || CHAPTERS[0].id)
            return (
              <a key={c.id} href={`#${c.id}`} data-chip={c.id}
                aria-label={c.label} aria-current={on ? 'true' : undefined}
                style={{ display:'flex',alignItems:'center',gap: showLabel ? 6 : 0,
                  textDecoration:'none',flexShrink:0,
                  padding: mobile ? '6px 8px' : '7px 14px',borderRadius:20,
                  background: on ? 'rgba(251,236,207,0.12)' : 'transparent',
                  transition:'background 0.25s' }}>
                <span style={{ fontFamily:F.display,fontSize: mobile ? 10.5 : 11,fontWeight:700,
                  color: on ? C.sand : 'rgba(255,255,255,0.34)' }}>{c.n}</span>
                {showLabel && (
                  <span style={{ fontFamily:F.body,fontSize: mobile ? 10 : 11.5,fontWeight: on ? 700 : 500,
                    letterSpacing: mobile ? 0.8 : 1.4,textTransform:'uppercase',whiteSpace:'nowrap',
                    color: on ? '#fff' : 'rgba(255,255,255,0.5)',transition:'color 0.25s' }}>
                    {c.label}
                  </span>
                )}
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
