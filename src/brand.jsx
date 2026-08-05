/* ══════════════════════════════════════════════════════════════════
   BRAND: shared surfaces and editorial primitives.
   Colours, fonts and data live in tokens.js.
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

/* ── Film grain: brand book p.6 calls for heavy grain on every surface ── */
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`

/* Local grain, for small surfaces only. Blending a repeating texture over a
   very tall element is expensive to repaint on scroll, so page-level grain
   is handled once by PageGrain below rather than per section. */
export const Grain = ({ op = 0.11, blend = 'overlay', z = 5 }) => (
  <div style={{ position:'absolute',inset:0,pointerEvents:'none',zIndex:z,
    backgroundImage:NOISE,backgroundRepeat:'repeat',backgroundSize:'160px',
    opacity:op,mixBlendMode:blend }} />
)

/* One viewport-sized grain layer over the whole document. Costs a single
   composited layer instead of one per chapter. */
export const PageGrain = ({ op = 0.075 }) => (
  <div aria-hidden="true" style={{ position:'fixed',inset:0,pointerEvents:'none',zIndex:200,
    backgroundImage:NOISE,backgroundRepeat:'repeat',backgroundSize:'160px',
    opacity:op,mixBlendMode:'overlay' }} />
)

/* ── Contour arcs: the faint concentric rings from the brand backplate ── */
export function Contours({ op = 0.16, color = C.sand, cx = '50%', cy = '55%' }) {
  return (
    <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:2,opacity:op }}
      preserveAspectRatio="none" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={`${8 + i * 8}%`} ry={`${6 + i * 7}%`}
          fill="none" stroke={color} strokeWidth="0.6" strokeOpacity={0.5 - i * 0.045} />
      ))}
    </svg>
  )
}

/* ── Backplate: deep navy sinking to black with sand glows breaking through ── */
export function Backplate({ glow = C.sand, contours = true, children, style }) {
  return (
    <div style={{ position:'relative',overflow:'hidden',
      background:`linear-gradient(165deg, ${C.navyDeep} 0%, #060a24 45%, ${C.night} 100%)`, ...style }}>
      {/* Soft glows are drawn as gradients rather than blurred boxes: a large
          filter: blur() repaints the whole area on every scroll frame. */}
      <div style={{ position:'absolute',top:'-20%',left:'12%',width:'55%',height:'70%',
        background:`radial-gradient(ellipse at center, ${glow}26 0%, ${glow}0d 45%, transparent 72%)`,zIndex:1 }} />
      <div style={{ position:'absolute',bottom:'-25%',right:'5%',width:'50%',height:'65%',
        background:`radial-gradient(ellipse at center, ${C.electric}24 0%, ${C.electric}0c 45%, transparent 74%)`,zIndex:1 }} />
      {contours && <Contours />}
      <div style={{ position:'relative',zIndex:6 }}>{children}</div>
    </div>
  )
}

/* ── Scroll reveal ───────────────────────────────────────────────── */
export function Reveal({ children, delay = 0, y = 26, once = true, style }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-12% 0px -12% 0px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.75, delay, ease: EASE }}
      style={style}>
      {children}
    </motion.div>
  )
}

/* ── Editorial type ──────────────────────────────────────────────── */
export const Eyebrow = ({ children, color = C.sand, style }) => (
  <div style={{ fontFamily:F.body,fontSize:11,fontWeight:700,letterSpacing:3.4,
    textTransform:'uppercase',color,opacity:0.75,...style }}>{children}</div>
)

export const Display = ({ children, size = 'clamp(38px, 5.4vw, 82px)', color = '#fff', style }) => (
  /* Leading is looser and tracking tighter than the old serif setting:
     Host Grotesk has a taller x-height, so 0.98 collided on two-line heads. */
  <h2 style={{ fontFamily:F.display,fontWeight:700,fontSize:size,lineHeight:1.04,
    letterSpacing:'-0.028em',color,...style }}>{children}</h2>
)

export const Lede = ({ children, color = 'rgba(255,255,255,0.62)', style }) => (
  <p style={{ fontFamily:F.body,fontSize:'clamp(15px, 1.25vw, 18px)',lineHeight:1.72,
    color,maxWidth:'52ch',...style }}>{children}</p>
)

/* ── Glass card: dark glass with cool border, per the app's surfaces ── */
export const Glass = ({ children, style, pad = 22, radius = 22 }) => (
  <div style={{ background:'rgba(140,160,220,0.09)',border:'1px solid rgba(214,228,255,0.14)',
    borderRadius:radius,padding:pad,position:'relative',overflow:'hidden',...style }}>
    <div style={{ position:'relative',zIndex:2 }}>{children}</div>
  </div>
)

/* ── Section wrapper: every chapter is a scroll anchor ──────────── */
export function Chapter({ id, children, style }) {
  return <section id={id} style={{ position:'relative',width:'100%',...style }}>{children}</section>
}
