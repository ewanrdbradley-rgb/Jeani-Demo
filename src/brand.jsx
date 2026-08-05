/* ══════════════════════════════════════════════════════════════════
   BRAND: the photographic backdrop, liquid glass surfaces, and the
   editorial type primitives.

   One fixed backdrop runs the whole page and crossfades between images
   as you scroll. Chapters lay a scrim over it so copy stays legible;
   the interlude bands thin that scrim so the photograph reads clearly.
══════════════════════════════════════════════════════════════════ */
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { C, F, EASE } from './tokens.js'

/* ── Viewport ────────────────────────────────────────────────────── */
export function useIsMobile(bp = 900) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth < bp)
  useEffect(() => {
    const fn = () => setM(window.innerWidth < bp)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [bp])
  return m
}

/* ── Film grain, brand book p.6 ──────────────────────────────────── */
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`

export const Grain = ({ op = 0.1, blend = 'overlay', z = 5 }) => (
  <div style={{ position:'absolute',inset:0,pointerEvents:'none',zIndex:z,
    backgroundImage:NOISE,backgroundRepeat:'repeat',backgroundSize:'160px',
    opacity:op,mixBlendMode:blend }} />
)

/* ══════════════════════════════════════════════════════════════════
   PHOTO BACKDROP
   Fixed behind everything, so the whole demo happens on one continuous
   photographic ground. Only opacity animates, which keeps it cheap.
══════════════════════════════════════════════════════════════════ */
const BACKDROPS = [
  { src: '/run-mountain.jpg', pos: 'center 40%' },
  { src: '/run-bridge.jpg',   pos: 'center 35%' },
  { src: '/run-lake.jpg',     pos: 'center 50%' },
]

export function PhotoBackdrop() {
  const { scrollYProgress } = useScroll()
  // Each image owns a stretch of the page and crossfades into the next
  const o1 = useTransform(scrollYProgress, [0, 0.30, 0.42], [1, 1, 0])
  const o2 = useTransform(scrollYProgress, [0.30, 0.42, 0.66, 0.78], [0, 1, 1, 0])
  const o3 = useTransform(scrollYProgress, [0.66, 0.78, 1], [0, 1, 1])
  const ops = [o1, o2, o3]

  return (
    <div aria-hidden="true" style={{ position:'fixed',inset:0,zIndex:0,overflow:'hidden',background:C.night }}>
      {BACKDROPS.map((b, i) => (
        <motion.div key={b.src}
          style={{ position:'absolute',inset:0,opacity:ops[i],
            backgroundImage:`url(${b.src})`,backgroundSize:'cover',
            backgroundPosition:b.pos,backgroundRepeat:'no-repeat' }} />
      ))}
      {/* Brand wash so the photography reads as Jeani rather than stock */}
      <div style={{ position:'absolute',inset:0,background:`${C.navy}59` }} />
      <Grain op={0.09} />
    </div>
  )
}

/* A scrim laid over the backdrop by content sections, so copy stays
   readable. Interludes pass a lighter strength to let the photo through. */
export const Scrim = ({ strength = 'full' }) => {
  const map = {
    full:  'linear-gradient(180deg, rgba(5,6,15,0.82) 0%, rgba(5,6,15,0.74) 50%, rgba(5,6,15,0.82) 100%)',
    mid:   'linear-gradient(180deg, rgba(5,6,15,0.62) 0%, rgba(5,6,15,0.5) 50%, rgba(5,6,15,0.62) 100%)',
    light: 'linear-gradient(180deg, rgba(5,6,15,0.5) 0%, rgba(5,6,15,0.22) 50%, rgba(5,6,15,0.5) 100%)',
  }
  return <div aria-hidden="true" style={{ position:'absolute',inset:0,zIndex:0,background:map[strength] }} />
}

/* ══════════════════════════════════════════════════════════════════
   LIQUID GLASS
   Translucent fill, saturated blur of whatever is behind, a bright
   hairline edge and a specular sheen across the top.
══════════════════════════════════════════════════════════════════ */
export function Glass({ children, style, pad = 22, radius = 22, tone = 'base', sheen = true }) {
  const fill = tone === 'soft' ? C.glassFillSoft : C.glassFill
  const edge = tone === 'soft' ? C.glassEdgeSoft : C.glassEdge
  return (
    <div style={{ position:'relative',overflow:'hidden',borderRadius:radius,padding:pad,
      background:fill,backdropFilter:C.glassBlur,WebkitBackdropFilter:C.glassBlur,
      border:`1px solid ${edge}`,
      boxShadow:'0 18px 44px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.22)',
      ...style }}>
      {sheen && (
        <div aria-hidden="true" style={{ position:'absolute',inset:0,pointerEvents:'none',zIndex:1,
          background:'linear-gradient(160deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 34%, transparent 62%)' }} />
      )}
      <div style={{ position:'relative',zIndex:2 }}>{children}</div>
    </div>
  )
}

/* ── Scroll reveal ───────────────────────────────────────────────── */
export function Reveal({ children, delay = 0, y = 22, once = true, style }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-10% 0px -10% 0px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      style={style}>
      {children}
    </motion.div>
  )
}

/* ── Editorial type ──────────────────────────────────────────────── */
export const Eyebrow = ({ children, color = C.sand, style }) => (
  <div style={{ fontFamily:F.body,fontSize:11,fontWeight:700,letterSpacing:2.8,
    textTransform:'uppercase',color,...style }}>{children}</div>
)

export const Display = ({ children, size = 'clamp(30px, 3.9vw, 56px)', color = C.text, style }) => (
  <h2 style={{ fontFamily:F.display,fontWeight:700,fontSize:size,lineHeight:1.06,
    letterSpacing:'-0.03em',color,textShadow:'0 2px 24px rgba(0,0,0,0.4)',...style }}>{children}</h2>
)

export const Lede = ({ children, color = C.textSoft, style }) => (
  <p style={{ fontFamily:F.body,fontSize:'clamp(15px, 1.15vw, 17.5px)',lineHeight:1.66,
    color,maxWidth:'52ch',textShadow:'0 1px 12px rgba(0,0,0,0.35)',...style }}>{children}</p>
)

/* Chapter number, rule and label: the demo's step marker */
export const ChapterMark = ({ n, children, color = C.sand }) => (
  <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:16 }}>
    <span style={{ fontFamily:F.display,fontSize:12,fontWeight:700,color,opacity:0.75 }}>{n}</span>
    <span style={{ width:26,height:1,background:color,opacity:0.4 }} />
    <Eyebrow color={color}>{children}</Eyebrow>
  </div>
)

/* ── Section wrapper ─────────────────────────────────────────────── */
export function Chapter({ id, children, style, scrim = 'full' }) {
  return (
    <section id={id} style={{ position:'relative',width:'100%',...style }}>
      <Scrim strength={scrim} />
      <div style={{ position:'relative',zIndex:2 }}>{children}</div>
    </section>
  )
}
