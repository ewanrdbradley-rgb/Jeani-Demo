/* ══════════════════════════════════════════════════════════════════
   BRAND: shared surfaces and editorial primitives.
   Colours, fonts and data live in tokens.js.

   The page is paper, so these default to navy-on-sand. The two dark
   contexts, full-bleed photography and the DataPanel, pass their own
   light colours in.
══════════════════════════════════════════════════════════════════ */
import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
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

/* ── Film grain: brand book p.6 calls for grain on the brand surfaces ── */
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`

/* Local grain, for small surfaces only. Blending a repeating texture over a
   very tall element is expensive to repaint on scroll. */
export const Grain = ({ op = 0.11, blend = 'overlay', z = 5 }) => (
  <div style={{ position:'absolute',inset:0,pointerEvents:'none',zIndex:z,
    backgroundImage:NOISE,backgroundRepeat:'repeat',backgroundSize:'160px',
    opacity:op,mixBlendMode:blend }} />
)

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
export const Eyebrow = ({ children, color = C.navy, style }) => (
  <div style={{ fontFamily:F.body,fontSize:11,fontWeight:700,letterSpacing:2.8,
    textTransform:'uppercase',color,...style }}>{children}</div>
)

export const Display = ({ children, size = 'clamp(34px, 4.6vw, 68px)', color = C.navy, style }) => (
  <h2 style={{ fontFamily:F.display,fontWeight:700,fontSize:size,lineHeight:1.03,
    letterSpacing:'-0.03em',color,...style }}>{children}</h2>
)

export const Lede = ({ children, color = C.inkSoft, style }) => (
  <p style={{ fontFamily:F.body,fontSize:'clamp(15px, 1.15vw, 17.5px)',lineHeight:1.62,
    color,maxWidth:'46ch',...style }}>{children}</p>
)

/* A short caps label with a hairline, used to open a chapter */
export const ChapterMark = ({ n, children, color = C.navy }) => (
  <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:18 }}>
    <span style={{ fontFamily:F.display,fontSize:12,fontWeight:700,color,opacity:0.55 }}>{n}</span>
    <span style={{ width:28,height:1,background:color,opacity:0.3 }} />
    <Eyebrow color={color}>{children}</Eyebrow>
  </div>
)

/* ── DataPanel ──────────────────────────────────────────────────────
   Anything showing real app numbers sits on one of these. Keeping the
   product's own dark UI inside a dark panel is what stops the paper page
   from looking like a generic light marketing template. */
export const DataPanel = ({ children, style, pad = 24, radius = 24 }) => (
  <div style={{ position:'relative',overflow:'hidden',borderRadius:radius,padding:pad,
    background:`linear-gradient(165deg, ${C.navyDeep} 0%, #070c26 55%, ${C.night} 100%)`,
    boxShadow:'0 24px 60px rgba(17,35,120,0.22)', ...style }}>
    <Grain op={0.09} z={1} />
    <div style={{ position:'relative',zIndex:2 }}>{children}</div>
  </div>
)

/* A light card, for copy and lists that stay on paper */
export const Card = ({ children, style, pad = 24, radius = 20 }) => (
  <div style={{ background:'rgba(255,255,255,0.55)',border:`1px solid ${C.line}`,
    borderRadius:radius,padding:pad,position:'relative',...style }}>
    {children}
  </div>
)

/* ── Section wrapper ─────────────────────────────────────────────── */
export function Chapter({ id, children, style, tone = 'paper' }) {
  const bg = tone === 'deep' ? C.paperDeep : tone === 'none' ? 'transparent' : C.paper
  return (
    <section id={id} style={{ position:'relative',width:'100%',background:bg,...style }}>
      {children}
    </section>
  )
}
