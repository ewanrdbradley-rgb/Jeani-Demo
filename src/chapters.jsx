/* ══════════════════════════════════════════════════════════════════
   CHAPTERS: the scroll narrative.

   Each chapter pairs a pinned visual (a phone, a chart, a radar) with
   panels of copy that scroll past it. The pinned visual swaps as each
   panel crosses the middle of the viewport, so scrolling drives the
   product tour rather than a tab bar.
══════════════════════════════════════════════════════════════════ */
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Grain, Contours, Backplate, Reveal,
  Eyebrow, Display, Lede, Glass, Chapter, useIsMobile,
} from './brand.jsx'
import { C, F, EASE, JOINTS, APP_STORE_URL } from './tokens.js'
import {
  Phone, Shot, SignalGrid, MovementToday, RadarPlot, RadarLegend,
  RadarScreen, ChatScreen,
} from './screens.jsx'

/* ── A panel that reports when it crosses the middle of the screen ── */
function Panel({ index, onActive, children, first = false }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-50% 0px -50% 0px' })
  useEffect(() => { if (inView) onActive(index) }, [inView, index, onActive])
  return (
    <div ref={ref} style={{ minHeight:'88vh',display:'flex',flexDirection:'column',
      justifyContent:'center',paddingTop: first ? '10vh' : '6vh',paddingBottom:'6vh' }}>
      <motion.div
        initial={{ opacity:0, y:30 }}
        animate={inView ? { opacity:1, y:0 } : { opacity:0.25, y:12 }}
        transition={{ duration:0.6, ease:EASE }}>
        {children}
      </motion.div>
    </div>
  )
}

/* ── Pinned-visual chapter layout ────────────────────────────────── */
function PinnedChapter({ id, visuals, panels, visualSide = 'left', background }) {
  const [active, setActive] = useState(0)
  const mobile = useIsMobile()
  const onActive = useCallback(i => setActive(i), [])

  if (mobile) {
    return (
      <Chapter id={id} style={{ position:'relative' }}>
        {background}
        <div style={{ position:'relative',zIndex:6,padding:'0 22px' }}>
          {panels.map((p, i) => (
            <div key={i} style={{ paddingTop: i === 0 ? '9vh' : '5vh',paddingBottom:'5vh' }}>
              <Reveal>{p}</Reveal>
              {visuals[i] && (
                <Reveal delay={0.12} style={{ display:'flex',justifyContent:'center',marginTop:34 }}>
                  {visuals[i]}
                </Reveal>
              )}
            </div>
          ))}
        </div>
      </Chapter>
    )
  }

  const visualCol = (
    <div style={{ position:'relative' }}>
      <div style={{ position:'sticky',top:0,height:'100vh',display:'flex',
        alignItems:'center',justifyContent:'center',paddingTop:56 }}>
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity:0, y:34, scale:0.96 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-24, scale:0.97 }}
            transition={{ duration:0.5, ease:EASE }}>
            {visuals[Math.min(active, visuals.length - 1)]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )

  const panelCol = (
    <div style={{ padding: visualSide === 'left' ? '0 6vw 0 3vw' : '0 3vw 0 6vw' }}>
      {panels.map((p, i) => (
        <Panel key={i} index={i} onActive={onActive} first={i === 0}>{p}</Panel>
      ))}
    </div>
  )

  return (
    <Chapter id={id} style={{ position:'relative' }}>
      {background}
      <div style={{ position:'relative',zIndex:6,display:'grid',
        gridTemplateColumns:'minmax(380px, 0.9fr) 1.1fr',maxWidth:1520,margin:'0 auto' }}>
        {visualSide === 'left' ? <>{visualCol}{panelCol}</> : <>{panelCol}{visualCol}</>}
      </div>
    </Chapter>
  )
}

/* ══════════════════════════════════════════════════════════════════
   INTERLUDE: a full-bleed photograph between chapters.

   These are the breathers. Each carries a small eyebrow and one
   sub-headline set well below chapter scale, so the big display
   statements stay reserved for the chapters themselves.
══════════════════════════════════════════════════════════════════ */
function Interlude({ image, pos = 'center 45%', eyebrow, line, italic, caption, align = 'left' }) {
  const ref = useRef(null)
  const mobile = useIsMobile()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-9%', '9%'])

  const justify = align === 'center' ? 'center' : 'flex-start'

  return (
    <section ref={ref} style={{ position:'relative',width:'100%',overflow:'hidden',
      height: mobile ? '58vh' : 'min(60vh, 540px)',minHeight: mobile ? 340 : 400 }}>
      <motion.img src={image} alt="" aria-hidden="true"
        style={{ position:'absolute',left:0,right:0,top:'-9%',height:'118%',width:'100%',
          objectFit:'cover',objectPosition:pos,y }} />

      {/* Brand wash: navy over the photograph, dark at both edges so the
          chapters above and below bleed into it rather than butting up. */}
      <div style={{ position:'absolute',inset:0,background:`${C.navy}5c` }} />
      <div style={{ position:'absolute',inset:0,
        background:`linear-gradient(180deg, ${C.night} 0%, rgba(5,6,15,0.28) 26%, rgba(5,6,15,0.4) 62%, ${C.night} 100%)` }} />
      <div style={{ position:'absolute',inset:0,
        background: align === 'center'
          ? 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(5,6,15,0.5) 0%, transparent 75%)'
          : 'linear-gradient(90deg, rgba(5,6,15,0.72) 0%, rgba(5,6,15,0.25) 48%, transparent 82%)' }} />
      <Contours op={0.08} cy="50%" />

      <div style={{ position:'relative',zIndex:6,height:'100%',display:'flex',flexDirection:'column',
        alignItems:justify,justifyContent:'center',textAlign: align === 'center' ? 'center' : 'left',
        padding: mobile ? '0 22px' : '0 6vw',maxWidth:1520,margin:'0 auto' }}>
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          {/* Deliberately smaller than a chapter headline */}
          <div style={{ fontFamily:F.display,fontWeight:700,fontSize:'clamp(24px, 2.9vw, 44px)',
            lineHeight:1.1,letterSpacing:'-0.022em',color:'#fff',marginTop:14,
            // Centred bands get a wider measure so the line breaks fall evenly
            maxWidth: align === 'center' ? '26ch' : '19ch' }}>
            {line}{italic && <> <span style={{ fontStyle:'italic',color:C.sand }}>{italic}</span></>}
          </div>
          {caption && (
            <div style={{ fontFamily:F.body,fontSize:'clamp(13px, 1.05vw, 15px)',lineHeight:1.7,
              color:'rgba(255,255,255,0.6)',marginTop:16,maxWidth:'42ch',
              marginLeft: align === 'center' ? 'auto' : 0,marginRight: align === 'center' ? 'auto' : 0 }}>
              {caption}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}

export const InterludeLab = () => (
  <Interlude image="/run-mountain.jpg" pos="center 42%"
    eyebrow="Measured where you move"
    line="No lab, no force plate," italic="no appointment."
    caption="Gait labs see you once. Jeani sees the hill you actually ran, in the shoes you actually wore, on the morning you were actually tired." />
)

export const InterludeEarly = () => (
  <Interlude image="/run-bridge.jpg" pos="center 38%" align="center"
    eyebrow="Before it hurts"
    line="Injuries announce themselves" italic="long before you feel them."
    caption="The signal is a small, steady asymmetry building over weeks. It is very hard to notice, and very easy to measure." />
)

export const InterludeMorning = () => (
  <Interlude image="/run-lake.jpg" pos="center 52%"
    eyebrow="Every morning"
    line="One number, and one thing" italic="to do about it."
    caption="No dashboard to interpret, no charts to cross-reference. Open the app, read the score, go." />
)

/* ── Shared chapter heading ──────────────────────────────────────── */
function Heading({ n, kicker, title, italic, lede, accent = C.sand }) {
  return (
    <>
      <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:20 }}>
        <span style={{ fontFamily:F.display,fontSize:15,fontWeight:700,color:accent,opacity:0.8 }}>{n}</span>
        <span style={{ width:44,height:1,background:accent,opacity:0.4 }} />
        <Eyebrow color={accent}>{kicker}</Eyebrow>
      </div>
      <Display>
        {title}
        {italic && (
          <>
            <br />
            <span style={{ fontStyle:'italic',color:accent }}>{italic}</span>
          </>
        )}
      </Display>
      {lede && <Lede style={{ marginTop:24 }}>{lede}</Lede>}
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════
   00 · HERO
══════════════════════════════════════════════════════════════════ */
export function Hero() {
  const ref = useRef(null)
  const mobile = useIsMobile()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y     = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const fade  = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.14])

  return (
    <section ref={ref} id="top"
      style={{ position:'relative',width:'100%',height:'100svh',minHeight:620,overflow:'hidden' }}>
      <motion.div style={{ position:'absolute',inset:0,y,scale }}>
        <video autoPlay muted loop playsInline poster="/hero-motion3.jpg"
          style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 62%' }}>
          <source src="/vid-intro-main.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Navy wash, per the brand ground */}
      <div style={{ position:'absolute',inset:0,background:`${C.navy}85` }} />
      <div style={{ position:'absolute',inset:0,
        background:`radial-gradient(ellipse 74% 62% at 50% 52%, transparent 0%, rgba(5,6,15,0.72) 100%)` }} />
      <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'42%',
        background:`linear-gradient(0deg, ${C.night} 2%, transparent 100%)` }} />
      <Contours op={0.1} />

      <motion.div style={{ position:'relative',zIndex:8,height:'100%',display:'flex',flexDirection:'column',
        alignItems:'center',justifyContent:'center',textAlign:'center',padding:'0 24px',opacity:fade }}>
        <motion.img src="/logos/Jeani Wordmark White.png" alt="Jeani"
          initial={{ opacity:0, y:16, scale:0.92 }} animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:1.2, ease:EASE }}
          style={{ height:'clamp(38px, 4.6vw, 62px)',marginBottom:'clamp(24px,3.4vw,40px)',
            filter:'drop-shadow(0 0 60px rgba(255,255,255,0.2))' }} />

        <motion.h1
          initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.45, duration:1, ease:EASE }}
          style={{ fontFamily:F.display,fontWeight:700,fontSize:'clamp(36px, 6.2vw, 92px)',
            lineHeight:1.02,letterSpacing:'-0.032em',color:'#fff',maxWidth:16 + 'ch' }}>
          Not just how much<br />you move.
          <span style={{ fontStyle:'italic',color:C.sand }}> How well.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9, duration:0.9 }}
          style={{ fontFamily:F.body,fontSize:'clamp(14px,1.35vw,18px)',color:'rgba(255,255,255,0.68)',
            marginTop:'clamp(18px,2.2vw,28px)',maxWidth:'46ch',lineHeight:1.7 }}>
          Jeani reads how your body actually moves, from the watch already on your wrist,
          and turns it into one number you can act on every morning.
        </motion.p>

        {/* Proof strip */}
        <motion.div
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.15, duration:0.8 }}
          /* A three column grid rather than a wrapping flex row: on a phone
             the row broke 2 + 1 and read as a mistake. */
          style={{ display:'grid',gridTemplateColumns:'repeat(3, 1fr)',
            gap:'clamp(8px,2vw,52px)',marginTop:'clamp(26px,3.2vw,42px)',
            width:'100%',maxWidth:520 }}>
          {[['6', 'signals'], ['1', 'sensor'], ['0', 'extra kit']].map(([n, l]) => (
            <div key={l} style={{ display:'flex',flexDirection: mobile ? 'column' : 'row',
              alignItems: mobile ? 'center' : 'baseline',justifyContent:'center',gap: mobile ? 2 : 8 }}>
              <span style={{ fontFamily:F.display,fontSize:'clamp(26px,2.8vw,38px)',fontWeight:700,color:C.sand }}>{n}</span>
              <span style={{ fontFamily:F.body,fontSize: mobile ? 10 : 12,letterSpacing: mobile ? 1.2 : 2,
                textTransform:'uppercase',textAlign:'center',color:'rgba(255,255,255,0.45)' }}>{l}</span>
            </div>
          ))}
        </motion.div>

        <motion.a href="#motion"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5, duration:0.8 }}
          style={{ position:'absolute',bottom:'clamp(24px,4vh,52px)',left:'50%',transform:'translateX(-50%)',
            display:'flex',flexDirection:'column',alignItems:'center',gap:10,textDecoration:'none' }}>
          <span style={{ fontFamily:F.body,fontSize:10.5,letterSpacing:3,textTransform:'uppercase',
            color:'rgba(255,255,255,0.5)' }}>Scroll to explore</span>
          <motion.span animate={{ y:[0, 8, 0] }} transition={{ duration:1.9, repeat:Infinity, ease:'easeInOut' }}
            style={{ width:1,height:34,background:`linear-gradient(180deg, ${C.sand}, transparent)` }} />
        </motion.a>
      </motion.div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════
   01 · MOTION
══════════════════════════════════════════════════════════════════ */
export function MotionChapter() {
  const mobile = useIsMobile()
  const bg = (
    <>
      <div style={{ position:'absolute',inset:0,background:`linear-gradient(180deg, ${C.night} 0%, #070c28 40%, ${C.night} 100%)` }} />
      <div style={{ position:'absolute',top:'8%',left:'-8%',width:'55%',height:'50%',borderRadius:'50%',
        background:`radial-gradient(ellipse at center, ${C.electric}22 0%, ${C.electric}0a 45%, transparent 72%)` }} />
      <Contours op={0.09} cy="35%" />
    </>
  )

  return (
    <PinnedChapter
      id="motion"
      background={bg}
      visualSide="left"
      visuals={[
        <Phone key="a" width={302}><Shot src="/screenshots/home.jpg" alt="Jeani home screen" /></Phone>,
        <Phone key="b" width={302}><Shot src="/screenshots/motion.jpg" alt="Motion score screen" /></Phone>,
        <Phone key="c" width={302}><Shot src="/screenshots/motion-chart.jpg" alt="Motion history chart" /></Phone>,
      ]}
      panels={[
        <>
          <Heading n="01" kicker="Motion" title="One number for" italic="movement quality."
            lede="Step counts tell you that you moved. They say nothing about how well. Motion is a single 0 to 100 score, rebuilt nightly from six independent readings of your gait, so you open the app to an answer rather than a dashboard." />
          <div style={{ display:'flex',flexDirection: mobile ? 'column' : 'row',
            alignItems: mobile ? 'flex-start' : 'baseline',gap: mobile ? 6 : 18,marginTop:36 }}>
            <span style={{ fontFamily:F.display,fontSize: mobile ? 72 : 88,fontWeight:700,color:C.ice,lineHeight:0.85 }}>72</span>
            <div>
              <div style={{ fontFamily:F.body,fontSize:13,letterSpacing:2.4,textTransform:'uppercase',color:'rgba(255,255,255,0.42)' }}>
                Today
              </div>
              <div style={{ fontFamily:F.display,fontStyle:'italic',fontSize:21,color:C.sand,marginTop:4 }}>
                Strong day. Room to push.
              </div>
            </div>
          </div>
        </>,
        <>
          <Eyebrow color={C.electric}>The six signals</Eyebrow>
          <Display size="clamp(30px, 3.4vw, 50px)" style={{ marginTop:14,marginBottom:12 }}>
            Six readings, blended nightly<br />into one number.
          </Display>
          <Lede style={{ marginBottom:30 }}>
            Every signal comes from the same wrist accelerometer, and each one answers a
            different question. Tap any of them to see what it measures.
          </Lede>
          <SignalGrid />
        </>,
        <>
          <Eyebrow color={C.green}>Movement today</Eyebrow>
          <Display size="clamp(30px, 3.4vw, 50px)" style={{ marginTop:14,marginBottom:12 }}>
            See the shape<br />of your day.
          </Display>
          <Lede style={{ marginBottom:26 }}>
            Motion is not one moment, it is a pattern. Jeani plots every hour so a hard
            morning and a still afternoon read as two different days, not one average.
          </Lede>
          <Glass pad={24}>
            <MovementToday />
          </Glass>
        </>,
      ]}
    />
  )
}

/* ══════════════════════════════════════════════════════════════════
   02 · INJURY RADAR
══════════════════════════════════════════════════════════════════ */
export function RadarChapter() {
  const [probe, setProbe] = useState(null)

  const bg = (
    <>
      <div style={{ position:'absolute',inset:0,background:C.night }} />
      <img src="/run-race.jpg" alt="" style={{ position:'absolute',inset:0,width:'100%',height:'100%',
        objectFit:'cover',opacity:0.2 }} />
      <div style={{ position:'absolute',inset:0,background:`linear-gradient(180deg, ${C.night} 0%, ${C.navyDeep}cc 45%, ${C.night} 100%)` }} />
      <Contours op={0.11} cy="45%" color={C.electric} />
    </>
  )

  return (
    <PinnedChapter
      id="radar"
      background={bg}
      visualSide="right"
      visuals={[
        <Phone key="a" width={302} glow={C.electric}><RadarScreen /></Phone>,
        <Glass key="b" pad={30} radius={28} style={{ width:400 }}>
          <div style={{ display:'flex',justifyContent:'center' }}>
            <RadarPlot size={320} />
          </div>
          <div style={{ marginTop:26,display:'flex',justifyContent:'center' }}><RadarLegend /></div>
        </Glass>,
        <Phone key="c" width={302} glow={C.amber}><RadarScreen /></Phone>,
      ]}
      panels={[
        <>
          <Heading n="02" kicker="Injury Radar" title="See the load," italic="before injury."
            accent={C.electric}
            lede="Radar maps strain across six joints, hip to ankle, on both sides. It replaced the 3D body view because a shape you can read in one second beats an anatomy model you have to rotate." />
        </>,
        <>
          <Eyebrow color={C.electric}>Six joints, both sides</Eyebrow>
          <Display size="clamp(30px, 3.4vw, 50px)" style={{ marginTop:14,marginBottom:12 }}>
            Asymmetry shows up<br />as a dent.
          </Display>
          <Lede style={{ marginBottom:26 }}>
            A balanced week draws an even hexagon. When one joint starts carrying more than
            its share, that corner pulls in and Jeani flags it while it is still a trend
            rather than a symptom.
          </Lede>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10 }}>
            {JOINTS.map((j, i) => (
              <motion.div key={j.key}
                initial={{ opacity:0, x:14 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                transition={{ delay:i * 0.07, duration:0.5, ease:EASE }}
                onMouseEnter={() => setProbe(j.key)} onMouseLeave={() => setProbe(null)}
                style={{ display:'flex',alignItems:'center',justifyContent:'space-between',
                  padding:'11px 14px',borderRadius:13,
                  border:`1px solid ${j.status === 'watch' ? `${C.amber}66` : 'rgba(214,228,255,0.13)'}`,
                  background: probe === j.key ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                  transition:'background 0.2s' }}>
                <span style={{ display:'flex',alignItems:'center',gap:9 }}>
                  <span style={{ width:6,height:6,borderRadius:'50%',
                    background: j.status === 'watch' ? C.amber : C.electric }} />
                  <span style={{ fontFamily:F.body,fontSize:13.5,color:'rgba(255,255,255,0.78)' }}>{j.label}</span>
                </span>
                <span style={{ fontFamily:F.display,fontSize:19,fontWeight:700,
                  color: j.status === 'watch' ? C.amber : C.ice }}>{j.value}</span>
              </motion.div>
            ))}
          </div>
        </>,
        <>
          <Eyebrow color={C.amber}>Fatigue and recovery</Eyebrow>
          <Display size="clamp(30px, 3.4vw, 50px)" style={{ marginTop:14,marginBottom:12 }}>
            Know what to fix<br />this week.
          </Display>
          <Lede style={{ marginBottom:26 }}>
            Radar pairs joint load with two whole-body readings, so you can tell the
            difference between a body that needs rest and one that needs work.
          </Lede>
          <div style={{ display:'flex',gap:14,flexWrap:'wrap' }}>
            {[['Fatigue', 24, '-6', C.green, 'Accumulated strain. Lower is better.'],
              ['Recovery', 71, '-5', C.electric, 'How ready you are to load again.']].map(([k, v, d, col, note]) => (
              <Glass key={k} pad={22} style={{ flex:'1 1 210px' }}>
                <div style={{ fontFamily:F.body,fontSize:10.5,letterSpacing:2.2,textTransform:'uppercase',
                  color:'rgba(255,255,255,0.42)' }}>{k}</div>
                <div style={{ display:'flex',alignItems:'baseline',gap:10,marginTop:8 }}>
                  <span style={{ fontFamily:F.display,fontSize:52,fontWeight:700,color:col,lineHeight:0.9 }}>{v}</span>
                  <span style={{ fontFamily:F.body,fontSize:13,color:'rgba(255,255,255,0.4)' }}>{d}</span>
                </div>
                <div style={{ fontFamily:F.body,fontSize:12.5,color:'rgba(255,255,255,0.45)',marginTop:10,lineHeight:1.55 }}>
                  {note}
                </div>
              </Glass>
            ))}
          </div>
        </>,
      ]}
    />
  )
}

/* ══════════════════════════════════════════════════════════════════
   03 · SPOTLIGHT + ASK JEANI
══════════════════════════════════════════════════════════════════ */
export function SpotlightChapter() {
  const bg = (
    <>
      <div style={{ position:'absolute',inset:0,background:`linear-gradient(180deg, ${C.night} 0%, #0d0a1e 50%, ${C.night} 100%)` }} />
      <div style={{ position:'absolute',top:'20%',right:'-6%',width:'50%',height:'55%',borderRadius:'50%',
        background:`radial-gradient(ellipse at center, ${C.sand}1c 0%, ${C.sand}09 45%, transparent 72%)` }} />
      <Contours op={0.08} cy="50%" />
    </>
  )

  // Mirrors the Spotlight screenshot sitting beside it, so the coded card and
  // the phone never disagree on which area is flagged.
  const STRETCHES = ['Seated forward fold', 'Standing toe-touch', 'Lying single-leg stretch with a strap']

  return (
    <PinnedChapter
      id="spotlight"
      background={bg}
      visualSide="left"
      visuals={[
        <Phone key="a" width={302} glow={C.sand}><Shot src="/screenshots/spotlight.jpg" alt="Spotlight screen" /></Phone>,
        <Phone key="b" width={302} glow={C.sand}><Shot src="/screenshots/spotlight.jpg" alt="Spotlight detail" /></Phone>,
        <Phone key="c" width={302} glow={C.electric}><ChatScreen /></Phone>,
      ]}
      panels={[
        <>
          <Heading n="03" kicker="Spotlight" title="The one thing" italic="worth your attention."
            lede="Six joints and six signals is a lot to hold in your head. Spotlight picks the single area most worth working on this week and tells you why, in the order that matters." />
        </>,
        <>
          <Eyebrow>This week</Eyebrow>
          <Display size="clamp(30px, 3.4vw, 50px)" style={{ marginTop:14,marginBottom:20 }}>
            Left Hamstring.
          </Display>
          <Glass pad={26}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18 }}>
              <div>
                <div style={{ fontFamily:F.display,fontSize:26,fontWeight:700,color:'#fff' }}>Left Hamstring</div>
                <div style={{ fontFamily:F.body,fontSize:13,color:C.green,marginTop:2 }}>Improving</div>
              </div>
              <div style={{ fontFamily:F.display,fontSize:34,fontWeight:700,color:C.green }}>+45</div>
            </div>
            <div style={{ fontFamily:F.body,fontSize:14,color:'rgba(255,255,255,0.55)',lineHeight:1.7,marginBottom:20 }}>
              The muscles along the back of your thigh. They bend your knee and drive your hips
              through each stride, so a change here shows up in everything from your gait to your top speed.
            </div>
            <div style={{ fontFamily:F.body,fontSize:10.5,letterSpacing:2.2,textTransform:'uppercase',
              color:'rgba(255,255,255,0.4)',marginBottom:12 }}>Stretch it</div>
            <div style={{ display:'flex',flexDirection:'column',gap:9 }}>
              {STRETCHES.map((s, i) => (
                <motion.div key={s}
                  initial={{ opacity:0, x:12 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                  transition={{ delay:i * 0.1, duration:0.45 }}
                  style={{ display:'flex',alignItems:'center',gap:12 }}>
                  <span style={{ width:22,height:22,borderRadius:'50%',flexShrink:0,
                    background:`${C.sand}1a`,border:`1px solid ${C.sand}44`,color:C.sand,
                    fontFamily:F.body,fontSize:10.5,display:'flex',alignItems:'center',justifyContent:'center' }}>
                    {i + 1}
                  </span>
                  <span style={{ fontFamily:F.body,fontSize:14.5,color:'rgba(255,255,255,0.75)' }}>{s}</span>
                </motion.div>
              ))}
            </div>
          </Glass>
        </>,
        <>
          <Eyebrow color={C.electric}>Ask Jeani</Eyebrow>
          <Display size="clamp(30px, 3.4vw, 50px)" style={{ marginTop:14,marginBottom:12 }}>
            Every number,<br />explained in plain words.
          </Display>
          <Lede>
            Ask why a joint is flagged, or what to do about it. Jeani answers from your own
            seven days of data, not from a generic training article. No score is a dead end.
          </Lede>
        </>,
      ]}
    />
  )
}

/* ══════════════════════════════════════════════════════════════════
   INTERLUDE · THE WATCH
══════════════════════════════════════════════════════════════════ */
export function WatchInterlude() {
  const mobile = useIsMobile()
  return (
    <Chapter id="watch">
      <Backplate glow={C.sand} style={{ padding: mobile ? '84px 22px' : '120px 6vw' }}>
        <div style={{ maxWidth:1240,margin:'0 auto',display:'grid',
          gridTemplateColumns: mobile ? '1fr' : '1.05fr 0.95fr',gap: mobile ? 52 : 70,alignItems:'center' }}>
          <Reveal>
            <Eyebrow>Apple Watch</Eyebrow>
            <Display size="clamp(32px, 4.2vw, 64px)" style={{ marginTop:16 }}>
              Works with the watch<br /><span style={{ fontStyle:'italic',color:C.sand }}>you already own.</span>
            </Display>
            <Lede style={{ marginTop:22 }}>
              No chest strap, no footpod, no lab. Triaxial accelerometry from one wrist sensor,
              captured while you walk and run in the real world, is enough to estimate six joints
              on both sides of your body.
            </Lede>
            <div style={{ display:'flex',gap:30,marginTop:32,flexWrap:'wrap' }}>
              {[['Series 6', 'or later'], ['iOS 16', 'and up'], ['Nightly', 'rescored']].map(([a, b]) => (
                <div key={a}>
                  <div style={{ fontFamily:F.display,fontSize:24,fontWeight:700,color:C.sand }}>{a}</div>
                  <div style={{ fontFamily:F.body,fontSize:12,letterSpacing:1.6,textTransform:'uppercase',
                    color:'rgba(255,255,255,0.4)',marginTop:3 }}>{b}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15} style={{ display:'flex',justifyContent:'center',alignItems:'center' }}>
            <div style={{ position:'relative',display:'flex',justifyContent:'center' }}>
              {/* Halo behind the render so the cut-out product shot sits on the
                  backplate rather than floating flat on it. */}
              <div aria-hidden="true" style={{ position:'absolute',inset:'-18% -14%',
                background:`radial-gradient(ellipse at center, ${C.sand}1f 0%, ${C.electric}14 42%, transparent 72%)` }} />
              <motion.img
                src="/watch-render.png"
                alt="Jeani on Apple Watch, showing a daily goal of 73 percent"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                /* The watch is only 454px wide in the source render, so it is
                   held near that size to stay sharp on 2x displays. A higher
                   resolution export would let this sit larger. */
                style={{ position:'relative',zIndex:2,width: mobile ? 'min(215px, 58vw)' : 'min(300px, 23vw)',
                  height:'auto',display:'block',
                  filter:'drop-shadow(0 34px 60px rgba(0,0,0,0.55))' }} />
            </div>
          </Reveal>
        </div>
      </Backplate>
    </Chapter>
  )
}

/* ══════════════════════════════════════════════════════════════════
   04 · THE SCIENCE: sand chapter, for contrast against the dark
══════════════════════════════════════════════════════════════════ */
export function ScienceChapter() {
  const mobile = useIsMobile()

  const PILLARS = [
    {
      label: 'Six movement signals',
      sub: 'Joints · Balance · Mobility · Variety · Volume · Smoothness',
      detail: 'Each signal is derived independently from wrist accelerometry, then blended nightly. Because they are independent, a drop in one is diagnostic rather than noise.',
    },
    {
      label: 'One sensor, six joints',
      sub: 'Hip, knee and ankle, bilaterally, every session',
      detail: 'Triaxial accelerometry and gait proxy extraction give six joint-specific estimates from a single wrist sensor, measured in real-world conditions instead of a gait lab.',
    },
    {
      label: 'Science and technical advisors',
      sub: 'Amy Arundale · Jacob Rothman · Dr. Blake Boggess · Dr. Brinnae Bent',
      detail: 'Methodology consistent with published clinical and sports science research, built with movement scientists so the numbers hold up to the people who will question them.',
    },
  ]

  return (
    <Chapter id="science" style={{ background:C.sand,color:'#0a0e20',position:'relative',overflow:'hidden' }}>
      <Grain op={0.05} blend="multiply" />
      <div style={{ position:'relative',zIndex:6,maxWidth:1320,margin:'0 auto',
        padding: mobile ? '84px 22px' : '128px 6vw' }}>

        <div style={{ display:'grid',gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: mobile ? 40 : 70,alignItems:'end',marginBottom: mobile ? 52 : 80 }}>
          <Reveal>
            <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:20 }}>
              <span style={{ fontFamily:F.display,fontSize:15,fontWeight:700,color:C.navy }}>04</span>
              <span style={{ width:44,height:1,background:C.navy,opacity:0.35 }} />
              <Eyebrow color={C.navy} style={{ opacity:1 }}>The science</Eyebrow>
            </div>
            <Display color="#0a0e20" size="clamp(34px, 4.6vw, 70px)">
              Real-world movement intelligence.
              <br /><span style={{ fontStyle:'italic',color:C.navy }}>Clinically grounded.</span>
            </Display>
          </Reveal>
          <Reveal delay={0.12}>
            <Lede color="#4a4a5a">
              Gait analysis has always meant a lab, a force plate and an appointment. Jeani
              takes the same underlying measures and derives them from the accelerometer you
              are already wearing, every day, for free.
            </Lede>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(3, 1fr)',
              gap: mobile ? 10 : 36,marginTop:30 }}>
              {[['6', 'joint estimates'], ['3', 'axes of motion'], ['0', 'extra hardware']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily:F.display,fontSize: mobile ? 34 : 46,fontWeight:700,color:C.navy,lineHeight:1 }}>{n}</div>
                  <div style={{ fontFamily:F.body,fontSize: mobile ? 9.5 : 11.5,letterSpacing: mobile ? 0.9 : 1.8,
                    textTransform:'uppercase',color:'#7a7a8a',marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div style={{ display:'grid',gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',gap:18 }}>
          {PILLARS.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.12}>
              <div style={{ background:C.navy,borderRadius:24,padding:'32px 28px',height:'100%',
                position:'relative',overflow:'hidden' }}>
                <Grain op={0.08} />
                <div style={{ position:'relative',zIndex:2 }}>
                  <div style={{ fontFamily:F.display,fontSize:15,fontWeight:700,color:C.sand,opacity:0.5,marginBottom:18 }}>
                    0{i + 1}
                  </div>
                  <div style={{ fontFamily:F.display,fontSize:26,fontWeight:700,color:C.sand,lineHeight:1.15,marginBottom:10 }}>
                    {p.label}
                  </div>
                  <div style={{ fontFamily:F.body,fontSize:12.5,color:'rgba(251,236,207,0.5)',marginBottom:16,lineHeight:1.6 }}>
                    {p.sub}
                  </div>
                  <div style={{ fontFamily:F.body,fontSize:14,color:'rgba(251,236,207,0.82)',lineHeight:1.72 }}>
                    {p.detail}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* The one photograph in the sand chapter, so the science does not
            read as a wall of type between two dark image sections. */}
        <Reveal delay={0.18}>
          <div style={{ marginTop: mobile ? 34 : 52,borderRadius:24,overflow:'hidden',position:'relative',
            height: mobile ? 260 : 320 }}>
            <img src="/run-race.jpg" alt="" aria-hidden="true"
              style={{ position:'absolute',inset:0,width:'100%',height:'100%',
                objectFit:'cover',objectPosition:'center 38%' }} />
            <div style={{ position:'absolute',inset:0,background:`${C.navy}70` }} />
            <div style={{ position:'absolute',inset:0,
              background:`linear-gradient(90deg, rgba(5,6,15,0.8) 0%, rgba(5,6,15,0.3) 55%, transparent 100%)` }} />
            <Grain op={0.1} />
            <div style={{ position:'relative',zIndex:6,height:'100%',display:'flex',flexDirection:'column',
              justifyContent:'center',padding: mobile ? '0 24px' : '0 44px',maxWidth:'62ch' }}>
              <Eyebrow>Real-world conditions</Eyebrow>
              <div style={{ fontFamily:F.display,fontWeight:700,fontSize:'clamp(22px, 2.4vw, 36px)',
                lineHeight:1.1,color:'#fff',marginTop:12 }}>
                Validated against the research,<br />
                <span style={{ fontStyle:'italic',color:C.sand }}>measured on the road.</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <div style={{ marginTop: mobile ? 30 : 40,paddingTop:26,borderTop:`1px solid ${C.navy}22`,
            display:'flex',alignItems:'center',justifyContent:'space-between',gap:20,flexWrap:'wrap' }}>
            <div style={{ fontFamily:F.display,fontStyle:'italic',fontSize:'clamp(16px,1.6vw,21px)',color:C.navy }}>
              Accurate by design. Jeani reads movement where it matters most.
            </div>
            <img src="/logos/Jeani Wordmark Blue.png" alt="Jeani" style={{ height:22,opacity:0.8 }} />
          </div>
        </Reveal>
      </div>
    </Chapter>
  )
}

/* ══════════════════════════════════════════════════════════════════
   05 · PLANS
══════════════════════════════════════════════════════════════════ */
export function PlansChapter() {
  const [billing, setBilling] = useState('annual')
  const mobile = useIsMobile()

  const FEATURES = [
    'Motion score, rebuilt nightly from six signals',
    'Injury Radar across six joints, both sides',
    'Spotlight, the one area worth fixing this week',
    'Ask Jeani, an AI coach reading your own data',
    'Movement goal, streaks and monthly progress',
    '90 days of movement history',
    'Apple Watch integration, no extra hardware',
  ]

  const price  = billing === 'monthly' ? '$9.99' : '$99.99'
  const period = billing === 'monthly' ? '/month' : '/year'
  const sub    = billing === 'monthly' ? null : "That's $8.33 a month, billed annually"

  return (
    <Chapter id="plans" style={{ position:'relative',overflow:'hidden' }}>
      <img src="/run-dusk.jpg" alt="" style={{ position:'absolute',inset:0,width:'100%',height:'100%',
        objectFit:'cover',objectPosition:'center 40%' }} />
      <div style={{ position:'absolute',inset:0,background:`${C.navy}9e` }} />
      <div style={{ position:'absolute',inset:0,background:`linear-gradient(180deg, ${C.night} 0%, rgba(5,6,15,0.68) 40%, ${C.night} 100%)` }} />
      <Contours op={0.1} cy="40%" />

      <div style={{ position:'relative',zIndex:6,maxWidth:1240,margin:'0 auto',
        padding: mobile ? '84px 22px' : '128px 6vw' }}>
        <div style={{ display:'grid',gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',gap: mobile ? 44 : 76,alignItems:'center' }}>

          <Reveal>
            <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:20 }}>
              <span style={{ fontFamily:F.display,fontSize:15,fontWeight:700,color:C.sand,opacity:0.8 }}>05</span>
              <span style={{ width:44,height:1,background:C.sand,opacity:0.4 }} />
              <Eyebrow>Plans</Eyebrow>
            </div>
            <Display size="clamp(36px, 5vw, 76px)">
              Movement<br /><span style={{ fontStyle:'italic',color:C.sand }}>is Medicine.</span>
            </Display>
            <Lede style={{ marginTop:24 }}>
              Two weeks free, then one plan with everything in it. No tiers, no add-ons,
              nothing held back for a higher price.
            </Lede>
            <div style={{ display:'flex',flexDirection:'column',gap:11,marginTop:34 }}>
              {FEATURES.map((f, i) => (
                <motion.div key={f}
                  initial={{ opacity:0, x:-12 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                  transition={{ delay:i * 0.06, duration:0.45 }}
                  style={{ display:'flex',gap:12,alignItems:'flex-start' }}>
                  <span style={{ width:19,height:19,borderRadius:'50%',flexShrink:0,marginTop:2,
                    background:`${C.sand}1c`,border:`1px solid ${C.sand}44`,color:C.sand,fontSize:10,
                    display:'flex',alignItems:'center',justifyContent:'center' }}>✓</span>
                  <span style={{ fontFamily:F.body,fontSize:14.5,color:'rgba(255,255,255,0.72)',lineHeight:1.55 }}>{f}</span>
                </motion.div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <Glass pad={mobile ? 26 : 38} radius={28}>
              <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:C.green,
                borderRadius:30,padding:'7px 16px',marginBottom:26 }}>
                <span style={{ fontFamily:F.body,fontSize:12.5,fontWeight:700,color:'#000' }}>
                  ✦ 2-week free trial included
                </span>
              </div>

              <div style={{ display:'flex',background:'rgba(255,255,255,0.08)',borderRadius:30,padding:4,
                width:'fit-content',marginBottom:26 }}>
                {['monthly', 'annual'].map(b => (
                  <button key={b} onClick={() => setBilling(b)}
                    style={{ padding:'10px 22px',borderRadius:26,border:'none',cursor:'pointer',
                      fontFamily:F.body,fontSize:12.5,fontWeight:600,transition:'all 0.25s',
                      background: billing === b ? C.sand : 'transparent',
                      color: billing === b ? C.navy : 'rgba(255,255,255,0.55)',
                      display:'flex',alignItems:'center',gap:8 }}>
                    {b === 'monthly' ? 'Monthly' : (
                      <>Annual <span style={{ background:C.green,color:'#000',fontSize:9,fontWeight:700,
                        padding:'2px 8px',borderRadius:10 }}>SAVE 17%</span></>
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={billing}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                  transition={{ duration:0.22 }} style={{ marginBottom:30 }}>
                  <div style={{ display:'flex',alignItems:'baseline',gap:8 }}>
                    <span style={{ fontFamily:F.display,fontSize:'clamp(48px,5vw,72px)',fontWeight:700,
                      color:'#fff',lineHeight:1,letterSpacing:'-0.038em' }}>{price}</span>
                    <span style={{ fontFamily:F.body,fontSize:17,color:'rgba(255,255,255,0.45)' }}>{period}</span>
                  </div>
                  {sub && <div style={{ fontFamily:F.body,fontSize:13,color:'rgba(255,255,255,0.45)',marginTop:6 }}>{sub}</div>}
                  <div style={{ fontFamily:F.body,fontSize:13,color:C.green,fontWeight:600,marginTop:8 }}>
                    ✓ First fourteen days free
                  </div>
                </motion.div>
              </AnimatePresence>

              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer"
                style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:10,width:'100%',
                  padding:'17px',borderRadius:16,background:C.sand,color:C.navy,textDecoration:'none',
                  fontFamily:F.body,fontSize:16,fontWeight:700,letterSpacing:0.2,
                  boxShadow:`0 14px 44px ${C.sand}2e` }}>
                <svg width="17" height="20" viewBox="0 0 24 24" fill={C.navy} aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Start your free trial
              </a>
              <div style={{ textAlign:'center',fontFamily:F.body,fontSize:12,
                color:'rgba(255,255,255,0.4)',marginTop:14 }}>
                Cancel any time · No commitment
              </div>
            </Glass>
          </Reveal>
        </div>
      </div>
    </Chapter>
  )
}

/* ══════════════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════════ */
export function Footer() {
  return (
    <footer style={{ background:'#03040c',borderTop:'1px solid rgba(214,228,255,0.09)',
      padding:'40px 6vw',position:'relative',overflow:'hidden' }}>
      <div style={{ position:'relative',zIndex:2,maxWidth:1240,margin:'0 auto',display:'flex',
        alignItems:'center',justifyContent:'space-between',gap:20,flexWrap:'wrap' }}>
        <img src="/logos/Jeani Wordmark White.png" alt="Jeani" style={{ height:22,opacity:0.85 }} />
        <div style={{ fontFamily:F.display,fontStyle:'italic',fontSize:15,color:'rgba(255,255,255,0.45)' }}>
          Movement is Medicine.
        </div>
        <div style={{ fontFamily:F.body,fontSize:12,color:'rgba(255,255,255,0.3)' }}>
          © 2026 Jeani Health
        </div>
      </div>
    </footer>
  )
}
