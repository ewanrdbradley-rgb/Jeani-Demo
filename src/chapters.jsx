/* ══════════════════════════════════════════════════════════════════
   CHAPTERS: the scroll narrative.

   Paper ground throughout. Dark appears in exactly two forms: full-bleed
   photography between chapters, and the DataPanel wrapping anything that
   shows real app numbers. Copy is one headline and one supporting line
   per panel; the screens and the numbers carry the rest.
══════════════════════════════════════════════════════════════════ */
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Grain, Reveal, Eyebrow, Display, Lede, ChapterMark,
  DataPanel, Card, Chapter, useIsMobile,
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
    <div ref={ref} style={{ minHeight:'84vh',display:'flex',flexDirection:'column',
      justifyContent:'center',paddingTop: first ? '12vh' : '6vh',paddingBottom:'6vh' }}>
      <motion.div
        initial={{ opacity:0, y:26 }}
        animate={inView ? { opacity:1, y:0 } : { opacity:0.3, y:10 }}
        transition={{ duration:0.6, ease:EASE }}>
        {children}
      </motion.div>
    </div>
  )
}

/* ── Pinned-visual chapter layout ────────────────────────────────── */
function PinnedChapter({ id, visuals, panels, visualSide = 'left', tone = 'paper' }) {
  const [active, setActive] = useState(0)
  const mobile = useIsMobile()
  const onActive = useCallback(i => setActive(i), [])

  if (mobile) {
    return (
      <Chapter id={id} tone={tone}>
        <div style={{ padding:'0 22px' }}>
          {panels.map((p, i) => (
            <div key={i} style={{ paddingTop: i === 0 ? '10vh' : '6vh',paddingBottom:'2vh' }}>
              <Reveal>{p}</Reveal>
              {visuals[i] && (
                <Reveal delay={0.1} style={{ display:'flex',justifyContent:'center',marginTop:30 }}>
                  {visuals[i]}
                </Reveal>
              )}
            </div>
          ))}
          <div style={{ height:'6vh' }} />
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
            initial={{ opacity:0, y:28, scale:0.97 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-20, scale:0.98 }}
            transition={{ duration:0.45, ease:EASE }}>
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
    <Chapter id={id} tone={tone}>
      <div style={{ display:'grid',gridTemplateColumns:'minmax(360px, 0.85fr) 1.15fr',
        maxWidth:1440,margin:'0 auto' }}>
        {visualSide === 'left' ? <>{visualCol}{panelCol}</> : <>{panelCol}{visualCol}</>}
      </div>
    </Chapter>
  )
}

/* ══════════════════════════════════════════════════════════════════
   INTERLUDE: full-bleed photograph, the dark beat between chapters.
   Headline only. The captions that used to sit here were the wordiest
   part of the page and said the least.
══════════════════════════════════════════════════════════════════ */
function Interlude({ image, pos = 'center 45%', eyebrow, line, italic, align = 'left' }) {
  const ref = useRef(null)
  const mobile = useIsMobile()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section ref={ref} style={{ position:'relative',width:'100%',overflow:'hidden',
      height: mobile ? '52vh' : 'min(56vh, 500px)',minHeight: mobile ? 300 : 380 }}>
      <motion.img src={image} alt="" aria-hidden="true"
        style={{ position:'absolute',left:0,right:0,top:'-8%',height:'116%',width:'100%',
          objectFit:'cover',objectPosition:pos,y }} />
      <div style={{ position:'absolute',inset:0,background:`${C.navy}4d` }} />
      <div style={{ position:'absolute',inset:0,
        background: align === 'center'
          ? 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(5,6,15,0.55) 0%, rgba(5,6,15,0.15) 100%)'
          : 'linear-gradient(90deg, rgba(5,6,15,0.72) 0%, rgba(5,6,15,0.2) 55%, transparent 88%)' }} />
      <Grain op={0.08} />

      <div style={{ position:'relative',zIndex:6,height:'100%',display:'flex',flexDirection:'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',justifyContent:'center',
        textAlign: align === 'center' ? 'center' : 'left',
        padding: mobile ? '0 22px' : '0 6vw',maxWidth:1440,margin:'0 auto' }}>
        <Reveal>
          <Eyebrow color={C.sand}>{eyebrow}</Eyebrow>
          <div style={{ fontFamily:F.display,fontWeight:700,fontSize:'clamp(26px, 3.2vw, 50px)',
            lineHeight:1.06,letterSpacing:'-0.028em',color:'#fff',marginTop:12,
            maxWidth: align === 'center' ? '22ch' : '17ch' }}>
            {line}{italic && <> <span style={{ fontStyle:'italic',color:C.sand }}>{italic}</span></>}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export const InterludeLab = () => (
  <Interlude image="/run-mountain.jpg" pos="center 42%"
    eyebrow="Measured where you move"
    line="No lab, no force plate," italic="no appointment." />
)

export const InterludeEarly = () => (
  <Interlude image="/run-bridge.jpg" pos="center 38%" align="center"
    eyebrow="Before it hurts"
    line="Injuries show up in the data" italic="weeks before you feel them." />
)

export const InterludeMorning = () => (
  <Interlude image="/run-lake.jpg" pos="center 52%"
    eyebrow="Every morning"
    line="One number, and one thing" italic="to do about it." />
)

/* ══════════════════════════════════════════════════════════════════
   00 · HERO
══════════════════════════════════════════════════════════════════ */
export function Hero() {
  const mobile = useIsMobile()
  return (
    <section id="top" style={{ position:'relative',width:'100%',background:C.paper,
      paddingTop: mobile ? 96 : 132,paddingBottom: mobile ? 56 : 96 }}>
      <div style={{ maxWidth:1440,margin:'0 auto',padding: mobile ? '0 22px' : '0 6vw',
        display:'grid',gridTemplateColumns: mobile ? '1fr' : '1.02fr 0.98fr',
        gap: mobile ? 40 : 64,alignItems:'center' }}>

        <div>
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, ease:EASE }}>
            <Eyebrow>Movement is Medicine</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.08, duration:0.85, ease:EASE }}
            style={{ fontFamily:F.display,fontWeight:700,fontSize:'clamp(40px, 5.6vw, 84px)',
              lineHeight:0.99,letterSpacing:'-0.038em',color:C.navy,marginTop:18,maxWidth:'13ch' }}>
            Not just how much you move.
            <span style={{ fontStyle:'italic',color:C.blueInk }}> How well.</span>
          </motion.h1>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ delay:0.28, duration:0.8 }}>
            <Lede style={{ marginTop:22,fontSize:'clamp(16px,1.3vw,19px)' }}>
              One score for movement quality, read from the watch already on your wrist.
            </Lede>

            <div style={{ display:'flex',gap:12,marginTop:30,flexWrap:'wrap' }}>
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer"
                style={{ display:'inline-flex',alignItems:'center',gap:9,padding:'14px 26px',
                  borderRadius:14,background:C.navy,color:C.paper,textDecoration:'none',
                  fontFamily:F.body,fontSize:15,fontWeight:700 }}>
                <svg width="15" height="18" viewBox="0 0 24 24" fill={C.paper} aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Start free trial
              </a>
              <a href="#motion"
                style={{ display:'inline-flex',alignItems:'center',padding:'14px 24px',borderRadius:14,
                  border:`1px solid ${C.line}`,color:C.navy,textDecoration:'none',
                  fontFamily:F.body,fontSize:15,fontWeight:600 }}>
                See how it works
              </a>
            </div>

            <div style={{ display:'grid',gridTemplateColumns:'repeat(3, 1fr)',
              gap: mobile ? 10 : 28,marginTop:38,maxWidth:440 }}>
              {[['6', 'signals'], ['1', 'sensor'], ['0', 'extra kit']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily:F.display,fontSize: mobile ? 30 : 38,fontWeight:700,
                    color:C.navy,lineHeight:1 }}>{n}</div>
                  <div style={{ fontFamily:F.body,fontSize: mobile ? 10 : 11.5,letterSpacing:1.4,
                    textTransform:'uppercase',color:C.inkMute,marginTop:5 }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* The one dark object on the opening screen */}
        <motion.div
          initial={{ opacity:0, y:26, scale:0.98 }} animate={{ opacity:1, y:0, scale:1 }}
          transition={{ delay:0.15, duration:0.9, ease:EASE }}
          style={{ position:'relative',borderRadius:26,overflow:'hidden',
            aspectRatio: mobile ? '4 / 3' : '4 / 4.6',
            boxShadow:'0 30px 70px rgba(17,35,120,0.26)' }}>
          <video autoPlay muted loop playsInline poster="/hero-motion3.jpg"
            style={{ position:'absolute',inset:0,width:'100%',height:'100%',
              objectFit:'cover',objectPosition:'center 62%' }}>
            <source src="/vid-intro-main.mp4" type="video/mp4" />
          </video>
          <div style={{ position:'absolute',inset:0,background:`${C.navy}3d` }} />
          <Grain op={0.08} />
        </motion.div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════
   01 · MOTION
══════════════════════════════════════════════════════════════════ */
export function MotionChapter() {
  const mobile = useIsMobile()
  return (
    <PinnedChapter
      id="motion"
      visualSide="left"
      visuals={[
        <Phone key="a" width={mobile ? 268 : 300}><Shot src="/screenshots/home.jpg" alt="Jeani home screen" /></Phone>,
        <Phone key="b" width={mobile ? 268 : 300}><Shot src="/screenshots/motion.jpg" alt="Motion score screen" /></Phone>,
        <Phone key="c" width={mobile ? 268 : 300}><Shot src="/screenshots/motion-chart.jpg" alt="Motion history" /></Phone>,
      ]}
      panels={[
        <>
          <ChapterMark n="01">Motion</ChapterMark>
          <Display>One number for<br /><span style={{ fontStyle:'italic',color:C.blueInk }}>movement quality.</span></Display>
          <Lede style={{ marginTop:20 }}>
            Step counts say you moved. Motion says how well, on a single 0 to 100 scale.
          </Lede>
          <div style={{ display:'flex',alignItems:'baseline',gap:16,marginTop:34 }}>
            <span style={{ fontFamily:F.display,fontSize: mobile ? 68 : 84,fontWeight:700,
              color:C.navy,lineHeight:0.85,letterSpacing:'-0.04em' }}>72</span>
            <div>
              <div style={{ fontFamily:F.body,fontSize:11,letterSpacing:2,
                textTransform:'uppercase',color:C.inkMute }}>Today</div>
              <div style={{ fontFamily:F.display,fontSize:18,fontWeight:600,
                color:C.greenInk,marginTop:3 }}>Strong day</div>
            </div>
          </div>
        </>,
        <>
          <Eyebrow>The six signals</Eyebrow>
          <Display size="clamp(28px, 3vw, 44px)" style={{ marginTop:12,marginBottom:14 }}>
            Six readings, blended nightly.
          </Display>
          <Lede style={{ marginBottom:24 }}>
            Each answers a different question about your gait. Tap one to see what it measures.
          </Lede>
          <DataPanel pad={mobile ? 18 : 24}><SignalGrid /></DataPanel>
        </>,
        <>
          <Eyebrow>Movement today</Eyebrow>
          <Display size="clamp(28px, 3vw, 44px)" style={{ marginTop:12,marginBottom:14 }}>
            The shape of your day.
          </Display>
          <Lede style={{ marginBottom:24 }}>
            A hard morning and a still afternoon are two different days, not one average.
          </Lede>
          <DataPanel pad={mobile ? 18 : 24}><MovementToday /></DataPanel>
        </>,
      ]}
    />
  )
}

/* ══════════════════════════════════════════════════════════════════
   02 · INJURY RADAR
══════════════════════════════════════════════════════════════════ */
export function RadarChapter() {
  const mobile = useIsMobile()
  const [probe, setProbe] = useState(null)

  return (
    <PinnedChapter
      id="radar"
      visualSide="right"
      visuals={[
        <Phone key="a" width={mobile ? 268 : 300}><RadarScreen /></Phone>,
        <DataPanel key="b" pad={mobile ? 20 : 30} radius={28} style={{ width: mobile ? '100%' : 380 }}>
          <div style={{ display:'flex',justifyContent:'center' }}>
            <RadarPlot size={mobile ? 260 : 300} />
          </div>
          <div style={{ marginTop:22,display:'flex',justifyContent:'center' }}><RadarLegend /></div>
        </DataPanel>,
        <Phone key="c" width={mobile ? 268 : 300}><RadarScreen /></Phone>,
      ]}
      panels={[
        <>
          <ChapterMark n="02">Injury Radar</ChapterMark>
          <Display>See the load,<br /><span style={{ fontStyle:'italic',color:C.blueInk }}>before injury.</span></Display>
          <Lede style={{ marginTop:20 }}>
            Strain across six joints, hip to ankle, on both sides at once.
          </Lede>
        </>,
        <>
          <Eyebrow>Six joints, both sides</Eyebrow>
          <Display size="clamp(28px, 3vw, 44px)" style={{ marginTop:12,marginBottom:14 }}>
            Asymmetry shows up as a dent.
          </Display>
          <Lede style={{ marginBottom:24 }}>
            A balanced week draws an even hexagon. Jeani flags the corner that pulls in.
          </Lede>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(148px,1fr))',gap:9 }}>
            {JOINTS.map((j, i) => {
              const watch = j.status === 'watch'
              return (
                <motion.div key={j.key}
                  initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay:i * 0.05, duration:0.4, ease:EASE }}
                  onMouseEnter={() => setProbe(j.key)} onMouseLeave={() => setProbe(null)}
                  style={{ display:'flex',alignItems:'center',justifyContent:'space-between',
                    padding:'11px 14px',borderRadius:12,
                    border:`1px solid ${watch ? `${C.amberInk}66` : C.line}`,
                    background: probe === j.key ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.45)',
                    transition:'background 0.2s' }}>
                  <span style={{ display:'flex',alignItems:'center',gap:9 }}>
                    <span style={{ width:6,height:6,borderRadius:'50%',
                      background: watch ? C.amberInk : C.blueInk }} />
                    <span style={{ fontFamily:F.body,fontSize:13.5,color:C.ink }}>{j.label}</span>
                  </span>
                  <span style={{ fontFamily:F.display,fontSize:18,fontWeight:700,
                    color: watch ? C.amberInk : C.navy }}>{j.value}</span>
                </motion.div>
              )
            })}
          </div>
        </>,
        <>
          <Eyebrow>Fatigue and recovery</Eyebrow>
          <Display size="clamp(28px, 3vw, 44px)" style={{ marginTop:12,marginBottom:14 }}>
            Know what to fix this week.
          </Display>
          <Lede style={{ marginBottom:24 }}>
            Two whole-body readings tell rest apart from work.
          </Lede>
          <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
            {[['Fatigue', 24, 'Accumulated strain. Lower is better.', C.greenInk],
              ['Recovery', 71, 'How ready you are to load again.', C.blueInk]].map(([k, v, note, col]) => (
              <Card key={k} pad={20} style={{ flex:'1 1 200px' }}>
                <div style={{ fontFamily:F.body,fontSize:10.5,letterSpacing:2,
                  textTransform:'uppercase',color:C.inkMute }}>{k}</div>
                <div style={{ fontFamily:F.display,fontSize:46,fontWeight:700,color:col,
                  lineHeight:0.95,marginTop:6,letterSpacing:'-0.03em' }}>{v}</div>
                <div style={{ fontFamily:F.body,fontSize:12.5,color:C.inkSoft,marginTop:8,lineHeight:1.5 }}>
                  {note}
                </div>
              </Card>
            ))}
          </div>
        </>,
      ]}
    />
  )
}

/* ══════════════════════════════════════════════════════════════════
   03 · SPOTLIGHT
══════════════════════════════════════════════════════════════════ */
export function SpotlightChapter() {
  const mobile = useIsMobile()
  const STRETCHES = ['Seated forward fold', 'Standing toe-touch', 'Lying single-leg stretch with a strap']

  return (
    <PinnedChapter
      id="spotlight"
      visualSide="left"
      tone="deep"
      visuals={[
        <Phone key="a" width={mobile ? 268 : 300}><Shot src="/screenshots/spotlight.jpg" alt="Spotlight screen" /></Phone>,
        <Phone key="b" width={mobile ? 268 : 300}><Shot src="/screenshots/spotlight.jpg" alt="Spotlight detail" /></Phone>,
        <Phone key="c" width={mobile ? 268 : 300}><ChatScreen /></Phone>,
      ]}
      panels={[
        <>
          <ChapterMark n="03">Spotlight</ChapterMark>
          <Display>The one thing<br /><span style={{ fontStyle:'italic',color:C.blueInk }}>worth your attention.</span></Display>
          <Lede style={{ marginTop:20 }}>
            Six joints and six signals, narrowed to the single area to work on this week.
          </Lede>
        </>,
        <>
          <Eyebrow>This week</Eyebrow>
          <Display size="clamp(28px, 3vw, 44px)" style={{ marginTop:12,marginBottom:20 }}>
            Left Hamstring.
          </Display>
          <Card pad={mobile ? 20 : 26}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16 }}>
              <div>
                <div style={{ fontFamily:F.display,fontSize:22,fontWeight:700,color:C.navy }}>Left Hamstring</div>
                <div style={{ fontFamily:F.body,fontSize:12.5,color:C.greenInk,marginTop:2 }}>Improving</div>
              </div>
              <div style={{ fontFamily:F.display,fontSize:30,fontWeight:700,color:C.greenInk }}>+45</div>
            </div>
            <div style={{ fontFamily:F.body,fontSize:10.5,letterSpacing:2,textTransform:'uppercase',
              color:C.inkMute,marginBottom:10 }}>Stretch it</div>
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              {STRETCHES.map((s, i) => (
                <motion.div key={s}
                  initial={{ opacity:0, x:8 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                  transition={{ delay:i * 0.08, duration:0.4 }}
                  style={{ display:'flex',alignItems:'center',gap:11 }}>
                  <span style={{ width:20,height:20,borderRadius:'50%',flexShrink:0,
                    background:`${C.navy}12`,color:C.navy,fontFamily:F.body,fontSize:10.5,fontWeight:700,
                    display:'flex',alignItems:'center',justifyContent:'center' }}>{i + 1}</span>
                  <span style={{ fontFamily:F.body,fontSize:14,color:C.ink }}>{s}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </>,
        <>
          <Eyebrow>Ask Jeani</Eyebrow>
          <Display size="clamp(28px, 3vw, 44px)" style={{ marginTop:12,marginBottom:14 }}>
            Every number, in plain words.
          </Display>
          <Lede>
            Answers come from your own seven days of data, not a generic training article.
          </Lede>
        </>,
      ]}
    />
  )
}

/* ══════════════════════════════════════════════════════════════════
   THE WATCH
══════════════════════════════════════════════════════════════════ */
export function WatchInterlude() {
  const mobile = useIsMobile()
  return (
    <Chapter id="watch">
      <div style={{ maxWidth:1200,margin:'0 auto',padding: mobile ? '76px 22px' : '112px 6vw',
        display:'grid',gridTemplateColumns: mobile ? '1fr' : '1fr 0.85fr',
        gap: mobile ? 36 : 64,alignItems:'center' }}>
        <Reveal>
          <Eyebrow>Apple Watch</Eyebrow>
          <Display size="clamp(30px, 3.8vw, 56px)" style={{ marginTop:14 }}>
            Works with the watch<br /><span style={{ fontStyle:'italic',color:C.blueInk }}>you already own.</span>
          </Display>
          <Lede style={{ marginTop:18 }}>
            One wrist sensor, measured while you walk and run. No chest strap, no footpod, no lab.
          </Lede>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',
            gap: mobile ? 10 : 26,marginTop:30,maxWidth:420 }}>
            {[['Series 6', 'or later'], ['iOS 16', 'and up'], ['Nightly', 'rescored']].map(([a, b]) => (
              <div key={a}>
                <div style={{ fontFamily:F.display,fontSize: mobile ? 17 : 21,fontWeight:700,color:C.navy }}>{a}</div>
                <div style={{ fontFamily:F.body,fontSize: mobile ? 9.5 : 11,letterSpacing:1.3,
                  textTransform:'uppercase',color:C.inkMute,marginTop:3 }}>{b}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12} style={{ display:'flex',justifyContent:'center' }}>
          <motion.img src="/watch-render.png"
            alt="Jeani on Apple Watch, showing a daily goal of 73 percent"
            animate={{ y: [0, -9, 0] }}
            transition={{ duration:6.5, repeat:Infinity, ease:'easeInOut' }}
            /* Held near its native 454px width to stay sharp on 2x screens */
            style={{ width: mobile ? 'min(210px, 56vw)' : 'min(290px, 24vw)',height:'auto',display:'block',
              filter:'drop-shadow(0 26px 44px rgba(17,35,120,0.3))' }} />
        </Reveal>
      </div>
    </Chapter>
  )
}

/* ══════════════════════════════════════════════════════════════════
   04 · THE SCIENCE
══════════════════════════════════════════════════════════════════ */
export function ScienceChapter() {
  const mobile = useIsMobile()

  const PILLARS = [
    { n:'01', label:'Six movement signals',
      sub:'Joints · Balance · Mobility · Variety · Volume · Smoothness',
      detail:'Each is derived independently, so a drop in one is diagnostic rather than noise.' },
    { n:'02', label:'One sensor, six joints',
      sub:'Hip, knee and ankle, bilaterally',
      detail:'Triaxial accelerometry and gait proxy extraction, measured in real-world conditions.' },
    { n:'03', label:'Built with movement scientists',
      sub:'Amy Arundale · Jacob Rothman · Dr. Blake Boggess · Dr. Brinnae Bent',
      detail:'Methodology consistent with published clinical and sports science research.' },
  ]

  return (
    <Chapter id="science" tone="deep">
      <div style={{ maxWidth:1280,margin:'0 auto',padding: mobile ? '76px 22px' : '112px 6vw' }}>
        <div style={{ display:'grid',gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: mobile ? 28 : 60,alignItems:'end',marginBottom: mobile ? 40 : 64 }}>
          <Reveal>
            <ChapterMark n="04">The science</ChapterMark>
            <Display>Real-world movement intelligence.</Display>
          </Reveal>
          <Reveal delay={0.1}>
            <Lede>
              Gait analysis used to mean a lab and an appointment. Jeani derives the same measures
              from the accelerometer you already wear.
            </Lede>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap: mobile ? 10 : 28,marginTop:26 }}>
              {[['6', 'joint estimates'], ['3', 'axes of motion'], ['0', 'extra hardware']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily:F.display,fontSize: mobile ? 30 : 40,fontWeight:700,
                    color:C.navy,lineHeight:1,letterSpacing:'-0.03em' }}>{n}</div>
                  <div style={{ fontFamily:F.body,fontSize: mobile ? 9.5 : 11,letterSpacing:1.3,
                    textTransform:'uppercase',color:C.inkMute,marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div style={{ display:'grid',gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',gap:14 }}>
          {PILLARS.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.1}>
              <Card pad={mobile ? 22 : 26} style={{ height:'100%',background:'rgba(255,255,255,0.6)' }}>
                <div style={{ fontFamily:F.display,fontSize:12,fontWeight:700,color:C.navy,
                  opacity:0.45,marginBottom:14 }}>{p.n}</div>
                <div style={{ fontFamily:F.display,fontSize:20,fontWeight:700,color:C.navy,
                  lineHeight:1.2,marginBottom:8,letterSpacing:'-0.02em' }}>{p.label}</div>
                <div style={{ fontFamily:F.body,fontSize:12,color:C.inkMute,marginBottom:12,lineHeight:1.5 }}>
                  {p.sub}
                </div>
                <div style={{ fontFamily:F.body,fontSize:14,color:C.inkSoft,lineHeight:1.6 }}>
                  {p.detail}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
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
    'Motion score, rebuilt nightly',
    'Injury Radar across six joints',
    'Spotlight, one area a week',
    'Ask Jeani, reading your own data',
    'Streaks and 90-day history',
    'Apple Watch, no extra hardware',
  ]

  const price  = billing === 'monthly' ? '$9.99' : '$99.99'
  const period = billing === 'monthly' ? '/month' : '/year'
  const sub    = billing === 'monthly' ? null : "$8.33 a month, billed annually"

  return (
    <Chapter id="plans">
      <div style={{ maxWidth:1200,margin:'0 auto',padding: mobile ? '76px 22px 84px' : '112px 6vw 128px',
        display:'grid',gridTemplateColumns: mobile ? '1fr' : '1fr 0.9fr',
        gap: mobile ? 36 : 64,alignItems:'center' }}>

        <Reveal>
          <ChapterMark n="05">Plans</ChapterMark>
          <Display>Movement<br /><span style={{ fontStyle:'italic',color:C.blueInk }}>is Medicine.</span></Display>
          <Lede style={{ marginTop:18 }}>
            Two weeks free, then one plan with everything in it.
          </Lede>
          <div style={{ display:'grid',gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
            gap:'9px 18px',marginTop:28 }}>
            {FEATURES.map((f, i) => (
              <motion.div key={f}
                initial={{ opacity:0, x:-8 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                transition={{ delay:i * 0.05, duration:0.4 }}
                style={{ display:'flex',gap:9,alignItems:'flex-start' }}>
                <span style={{ width:17,height:17,borderRadius:'50%',flexShrink:0,marginTop:2,
                  background:`${C.navy}14`,color:C.navy,fontSize:9,
                  display:'flex',alignItems:'center',justifyContent:'center' }}>✓</span>
                <span style={{ fontFamily:F.body,fontSize:14,color:C.ink,lineHeight:1.45 }}>{f}</span>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div style={{ background:C.white,border:`1px solid ${C.line}`,borderRadius:26,
            padding: mobile ? 26 : 34,boxShadow:'0 24px 60px rgba(17,35,120,0.1)' }}>
            <div style={{ display:'inline-flex',background:`${C.navy}0d`,borderRadius:30,padding:4,marginBottom:24 }}>
              {['monthly', 'annual'].map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  style={{ padding:'9px 18px',borderRadius:26,border:'none',cursor:'pointer',
                    fontFamily:F.body,fontSize:12.5,fontWeight:600,transition:'all 0.22s',
                    background: billing === b ? C.navy : 'transparent',
                    color: billing === b ? C.paper : C.inkSoft }}>
                  {b === 'monthly' ? 'Monthly' : 'Annual · save 17%'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={billing}
                initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
                transition={{ duration:0.2 }} style={{ marginBottom:24 }}>
                <div style={{ display:'flex',alignItems:'baseline',gap:7 }}>
                  <span style={{ fontFamily:F.display,fontSize:'clamp(44px,4.4vw,62px)',fontWeight:700,
                    color:C.navy,lineHeight:1,letterSpacing:'-0.04em' }}>{price}</span>
                  <span style={{ fontFamily:F.body,fontSize:16,color:C.inkMute }}>{period}</span>
                </div>
                {sub && <div style={{ fontFamily:F.body,fontSize:13,color:C.inkMute,marginTop:6 }}>{sub}</div>}
                <div style={{ fontFamily:F.body,fontSize:13,color:C.greenInk,fontWeight:600,marginTop:8 }}>
                  First fourteen days free
                </div>
              </motion.div>
            </AnimatePresence>

            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer"
              style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:9,width:'100%',
                padding:'16px',borderRadius:14,background:C.navy,color:C.paper,textDecoration:'none',
                fontFamily:F.body,fontSize:15.5,fontWeight:700 }}>
              <svg width="15" height="18" viewBox="0 0 24 24" fill={C.paper} aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Start your free trial
            </a>
            <div style={{ textAlign:'center',fontFamily:F.body,fontSize:12,color:C.inkMute,marginTop:12 }}>
              Cancel any time
            </div>
          </div>
        </Reveal>
      </div>
    </Chapter>
  )
}

/* ══════════════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════════ */
export function Footer() {
  return (
    <footer style={{ background:C.navy,padding:'36px 6vw',position:'relative',overflow:'hidden' }}>
      <Grain op={0.07} />
      <div style={{ position:'relative',zIndex:2,maxWidth:1200,margin:'0 auto',display:'flex',
        alignItems:'center',justifyContent:'space-between',gap:18,flexWrap:'wrap' }}>
        <img src="/logos/Jeani Wordmark White.png" alt="Jeani" style={{ height:20,opacity:0.9 }} />
        <div style={{ fontFamily:F.display,fontStyle:'italic',fontSize:14,color:C.sand,opacity:0.8 }}>
          Movement is Medicine.
        </div>
        <div style={{ fontFamily:F.body,fontSize:12,color:'rgba(251,236,207,0.5)' }}>
          © 2026 Jeani Health
        </div>
      </div>
    </footer>
  )
}
