/* ══════════════════════════════════════════════════════════════════
   CHAPTERS: the walkthrough.

   The demo steps through the app one feature at a time. Every headline
   states plainly what the feature does; the supporting line says what
   the number or screen actually means. Nothing here should need
   decoding.
══════════════════════════════════════════════════════════════════ */
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Grain, Reveal, Eyebrow, Display, Lede, ChapterMark,
  Glass, Chapter, Scrim, useIsMobile,
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
function PinnedChapter({ id, visuals, panels, visualSide = 'left' }) {
  const [active, setActive] = useState(0)
  const mobile = useIsMobile()
  const onActive = useCallback(i => setActive(i), [])

  if (mobile) {
    return (
      <Chapter id={id}>
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
    <Chapter id={id}>
      <div style={{ display:'grid',gridTemplateColumns:'minmax(360px, 0.85fr) 1.15fr',
        maxWidth:1440,margin:'0 auto' }}>
        {visualSide === 'left' ? <>{visualCol}{panelCol}</> : <>{panelCol}{visualCol}</>}
      </div>
    </Chapter>
  )
}

/* ══════════════════════════════════════════════════════════════════
   INTERLUDE: the scrim thins so the backdrop photograph reads clearly,
   carrying one plain statement between chapters.
══════════════════════════════════════════════════════════════════ */
function Interlude({ eyebrow, line, align = 'left' }) {
  const mobile = useIsMobile()
  return (
    <section style={{ position:'relative',width:'100%',
      height: mobile ? '46vh' : 'min(48vh, 420px)',minHeight: mobile ? 270 : 330 }}>
      <Scrim strength="light" />
      <div style={{ position:'relative',zIndex:2,height:'100%',display:'flex',flexDirection:'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',justifyContent:'center',
        textAlign: align === 'center' ? 'center' : 'left',
        padding: mobile ? '0 22px' : '0 6vw',maxWidth:1440,margin:'0 auto' }}>
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <div style={{ fontFamily:F.display,fontWeight:700,fontSize:'clamp(24px, 3vw, 46px)',
            lineHeight:1.08,letterSpacing:'-0.028em',color:'#fff',marginTop:12,
            maxWidth: align === 'center' ? '24ch' : '20ch',
            textShadow:'0 2px 26px rgba(0,0,0,0.55)' }}>
            {line}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export const InterludeLab = () => (
  <Interlude eyebrow="Where the data comes from"
    line="Measured on the run, not in a lab." />
)

export const InterludeEarly = () => (
  <Interlude align="center" eyebrow="Why it matters"
    line="Most injuries build for weeks before you feel them." />
)

export const InterludeMorning = () => (
  <Interlude eyebrow="Every morning"
    line="One number, and one thing to do about it." />
)

/* ══════════════════════════════════════════════════════════════════
   00 · HERO
══════════════════════════════════════════════════════════════════ */
export function Hero() {
  const mobile = useIsMobile()
  return (
    <section id="top" style={{ position:'relative',width:'100%',overflow:'hidden',
      minHeight: mobile ? '92vh' : '100vh',display:'flex',alignItems:'center' }}>
      <video autoPlay muted loop playsInline poster="/hero-motion3.jpg"
        style={{ position:'absolute',inset:0,width:'100%',height:'100%',
          objectFit:'cover',objectPosition:'center 62%' }}>
        <source src="/vid-intro-main.mp4" type="video/mp4" />
      </video>
      <div style={{ position:'absolute',inset:0,background:`${C.navy}5c` }} />
      <div style={{ position:'absolute',inset:0,
        background:'linear-gradient(100deg, rgba(5,6,15,0.86) 0%, rgba(5,6,15,0.55) 46%, rgba(5,6,15,0.3) 100%)' }} />
      <Grain op={0.09} />

      <div style={{ position:'relative',zIndex:6,width:'100%',maxWidth:1440,margin:'0 auto',
        padding: mobile ? '110px 22px 64px' : '120px 6vw 80px' }}>
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7, ease:EASE }}>
          <Eyebrow>Product walkthrough</Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.08, duration:0.85, ease:EASE }}
          style={{ fontFamily:F.display,fontWeight:700,fontSize:'clamp(38px, 5.4vw, 80px)',
            lineHeight:1.0,letterSpacing:'-0.038em',color:'#fff',marginTop:16,maxWidth:'14ch',
            textShadow:'0 3px 34px rgba(0,0,0,0.5)' }}>
          Not just how much you move.
          <span style={{ fontStyle:'italic',color:C.sand }}> How well.</span>
        </motion.h1>

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:0.28, duration:0.8 }}>
          <Lede style={{ marginTop:20,fontSize:'clamp(16px,1.3vw,19px)' }}>
            This is a walkthrough of the Jeani app, feature by feature: what each screen
            shows you, and what it tells you about how your body is moving.
          </Lede>

          <div style={{ display:'flex',gap:12,marginTop:28,flexWrap:'wrap' }}>
            <a href="#motion"
              style={{ display:'inline-flex',alignItems:'center',gap:9,padding:'14px 26px',
                borderRadius:14,background:C.sand,color:C.navy,textDecoration:'none',
                fontFamily:F.body,fontSize:15,fontWeight:700 }}>
              Start the walkthrough
            </a>
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex',alignItems:'center',gap:9,padding:'14px 24px',
                borderRadius:14,border:`1px solid ${C.glassEdge}`,background:C.glassFill,
                backdropFilter:C.glassBlur,WebkitBackdropFilter:C.glassBlur,
                color:'#fff',textDecoration:'none',fontFamily:F.body,fontSize:15,fontWeight:600 }}>
              <svg width="14" height="17" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Get the app
            </a>
          </div>

          {/* The approach in one line: hardware you own, raw sensor data, insight out */}
          <Glass pad={mobile ? 14 : 18} radius={18}
            style={{ marginTop:34,display:'inline-block',maxWidth:'100%' }}>
            <div style={{ display:'flex',alignItems:'center',gap: mobile ? 8 : 14,flexWrap:'wrap' }}>
              {[
                ['⌚', 'The watch you own'],
                ['〰', 'Raw accelerometer data'],
                ['✓', 'Movement insights'],
              ].map(([icon, label], i, arr) => (
                <div key={label} style={{ display:'flex',alignItems:'center',gap: mobile ? 8 : 14 }}>
                  <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                    <span style={{ width: mobile ? 26 : 30,height: mobile ? 26 : 30,borderRadius:'50%',
                      flexShrink:0,background:'rgba(255,255,255,0.14)',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize: mobile ? 12 : 14,color:'#fff' }}>{icon}</span>
                    <span style={{ fontFamily:F.body,fontSize: mobile ? 11.5 : 13.5,fontWeight:600,
                      color:C.textSoft,whiteSpace:'nowrap' }}>{label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <span aria-hidden="true" style={{ fontFamily:F.body,fontSize: mobile ? 13 : 15,
                      color:C.sand,opacity:0.8 }}>→</span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ fontFamily:F.body,fontSize: mobile ? 11 : 12.5,color:C.textMute,
              marginTop:10,lineHeight:1.5 }}>
              No new hardware. Jeani reads the accelerometer in your Apple Watch and turns it
              into six movement signals.
            </div>
          </Glass>
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
        // One pinned screenshot carries the whole chapter; the signal grid and
        // day chart are live widgets, so extra phones added nothing.
        <Phone key="a" width={mobile ? 268 : 300}><Shot src="/screenshots/motion.jpg" alt="Motion score screen" /></Phone>,
      ]}
      panels={[
        <>
          <ChapterMark n="01">Motion</ChapterMark>
          <Display>Your movement quality, scored out of 100.</Display>
          {/* The score bubble sits directly under the headline, flush with its
              left edge and spanning the copy column, so the two read as one unit */}
          <Glass pad={mobile ? 16 : 20} radius={18} style={{ marginTop:22,maxWidth:'46ch' }}>
            <div style={{ display:'flex',alignItems:'center',gap:18 }}>
              <span style={{ fontFamily:F.display,fontSize: mobile ? 52 : 62,fontWeight:700,
                color:C.ice,lineHeight:0.85,letterSpacing:'-0.04em' }}>72</span>
              <div>
                <div style={{ fontFamily:F.body,fontSize:10.5,letterSpacing:2,
                  textTransform:'uppercase',color:C.textMute }}>Today</div>
                <div style={{ fontFamily:F.display,fontSize:17,fontWeight:600,
                  color:C.green,marginTop:3 }}>Strong day</div>
              </div>
            </div>
          </Glass>
          <Lede style={{ marginTop:20 }}>
            Every night Jeani rebuilds this number from six readings of how you actually moved.
            You open the app in the morning and know whether to push or hold back.
          </Lede>
        </>,
        <>
          <Eyebrow>What goes into the score</Eyebrow>
          <Display size="clamp(26px, 2.9vw, 42px)" style={{ marginTop:12,marginBottom:14 }}>
            Six signals, all measured from your wrist.
          </Display>
          <Lede style={{ marginBottom:22 }}>
            Each one tracks a different part of your gait. Tap any signal to see what it measures.
          </Lede>
          <SignalGrid />
        </>,
        <>
          <Eyebrow>Movement through the day</Eyebrow>
          <Display size="clamp(26px, 2.9vw, 42px)" style={{ marginTop:12,marginBottom:14 }}>
            When you moved, and how hard.
          </Display>
          <Lede style={{ marginBottom:22 }}>
            Jeani plots every hour, so a hard morning followed by a still afternoon does not
            average out into a meaningless number.
          </Lede>
          <Glass pad={mobile ? 18 : 24}><MovementToday /></Glass>
        </>,
      ]}
    />
  )
}

/* ══════════════════════════════════════════════════════════════════
   02 · MOVEMENT GOAL
══════════════════════════════════════════════════════════════════ */
export function GoalChapter() {
  const mobile = useIsMobile()
  return (
    <PinnedChapter
      id="goal"
      visualSide="right"
      visuals={[
        <Phone key="a" width={mobile ? 268 : 300}>
          <Shot src="/screenshots/goal-achieved.jpg" alt="Daily Motion Goal screen showing 100 percent achieved" />
        </Phone>,
      ]}
      panels={[
        <>
          <ChapterMark n="02">Movement Goal</ChapterMark>
          <Display>A daily goal, built from your score.</Display>
          <Lede style={{ marginTop:18 }}>
            Each day Jeani sets a motion target sized to your recent scores. Hit 100 percent
            and the day counts; miss it and tomorrow&rsquo;s goal adjusts so it stays reachable.
          </Lede>
        </>,
        <>
          <Eyebrow>Streaks</Eyebrow>
          <Display size="clamp(26px, 2.9vw, 42px)" style={{ marginTop:12,marginBottom:14 }}>
            Consistency, counted day by day.
          </Display>
          <Lede style={{ marginBottom:22 }}>
            Every completed goal extends your streak. The app records when you hit it and how
            long you have kept it going.
          </Lede>
          <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
            {[['Goal achieved', '100%', C.green],
              ['Achieved at', '11:12 am', C.ice],
              ['Streak', '8 days', C.amber]].map(([k, v, col]) => (
              <Glass key={k} pad={18} radius={18} tone="soft" style={{ flex:'1 1 140px' }}>
                <div style={{ fontFamily:F.body,fontSize:10.5,letterSpacing:2,
                  textTransform:'uppercase',color:C.textMute }}>{k}</div>
                <div style={{ fontFamily:F.display,fontSize: mobile ? 26 : 32,fontWeight:700,
                  color:col,lineHeight:1,marginTop:8,letterSpacing:'-0.02em' }}>{v}</div>
              </Glass>
            ))}
          </div>
        </>,
      ]}
    />
  )
}

/* ══════════════════════════════════════════════════════════════════
   03 · INJURY RADAR
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
        <Glass key="b" pad={mobile ? 20 : 28} radius={26} style={{ width: mobile ? '100%' : 372 }}>
          <div style={{ display:'flex',justifyContent:'center' }}>
            <RadarPlot size={mobile ? 258 : 296} />
          </div>
          <div style={{ marginTop:20,display:'flex',justifyContent:'center' }}><RadarLegend /></div>
        </Glass>,
      ]}
      panels={[
        <>
          <ChapterMark n="03">Injury Radar</ChapterMark>
          <Display>Strain on each joint, before it becomes an injury.</Display>
          <Lede style={{ marginTop:18 }}>
            Jeani estimates how much load your hips, knees and ankles are each carrying, left
            and right, and flags any joint that starts taking more than its share.
          </Lede>
        </>,
        <>
          <Eyebrow>Reading the radar</Eyebrow>
          <Display size="clamp(26px, 2.9vw, 42px)" style={{ marginTop:12,marginBottom:14 }}>
            Every joint scored, left against right.
          </Display>
          <Lede style={{ marginBottom:22 }}>
            A balanced week fills the shape evenly. When one side works harder than the other
            its score drops, that corner pulls in, and Jeani marks the joint to watch.
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
                    padding:'11px 14px',borderRadius:13,
                    border:`1px solid ${watch ? `${C.amber}88` : C.glassEdgeSoft}`,
                    background: probe === j.key ? 'rgba(255,255,255,0.16)' : C.glassFillSoft,
                    backdropFilter:C.glassBlur,WebkitBackdropFilter:C.glassBlur,
                    boxShadow:'inset 0 1px 0 rgba(255,255,255,0.14)',
                    transition:'background 0.2s' }}>
                  <span style={{ display:'flex',alignItems:'center',gap:9 }}>
                    <span style={{ width:6,height:6,borderRadius:'50%',
                      background: watch ? C.amber : C.electric }} />
                    <span style={{ fontFamily:F.body,fontSize:13.5,color:C.textSoft }}>{j.label}</span>
                  </span>
                  <span style={{ fontFamily:F.display,fontSize:18,fontWeight:700,
                    color: watch ? C.amber : C.ice }}>{j.value}</span>
                </motion.div>
              )
            })}
          </div>
        </>,
        <>
          <Eyebrow>Whole-body load</Eyebrow>
          <Display size="clamp(26px, 2.9vw, 42px)" style={{ marginTop:12,marginBottom:14 }}>
            Fatigue and recovery, side by side.
          </Display>
          <Lede style={{ marginBottom:22 }}>
            Fatigue is the strain you have built up. Recovery is how ready you are to train
            again. Read together, they tell rest apart from work.
          </Lede>
          <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
            {[['Fatigue', 24, 'Strain carried into today. Lower is better.', C.green],
              ['Recovery', 71, 'How ready you are to load again.', C.electric]].map(([k, v, note, col]) => (
              <Glass key={k} pad={20} radius={18} tone="soft" style={{ flex:'1 1 200px' }}>
                <div style={{ fontFamily:F.body,fontSize:10.5,letterSpacing:2,
                  textTransform:'uppercase',color:C.textMute }}>{k}</div>
                <div style={{ fontFamily:F.display,fontSize:44,fontWeight:700,color:col,
                  lineHeight:0.95,marginTop:6,letterSpacing:'-0.03em' }}>{v}</div>
                <div style={{ fontFamily:F.body,fontSize:12.5,color:C.textSoft,marginTop:8,lineHeight:1.5 }}>
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
   03 · SPOTLIGHT
══════════════════════════════════════════════════════════════════ */
export function SpotlightChapter() {
  const mobile = useIsMobile()
  const STRETCHES = ['Seated forward fold', 'Standing toe-touch', 'Lying single-leg stretch with a strap']

  return (
    <PinnedChapter
      id="spotlight"
      visualSide="left"
      visuals={[
        <Phone key="a" width={mobile ? 268 : 300}><Shot src="/screenshots/spotlight.jpg" alt="Spotlight screen" /></Phone>,
        <Phone key="b" width={mobile ? 268 : 300}><ChatScreen /></Phone>,
      ]}
      panels={[
        <>
          <ChapterMark n="04">Spotlight</ChapterMark>
          <Display>The one area to work on this week.</Display>
          <Lede style={{ marginTop:18,marginBottom:22 }}>
            Rather than handing you six joints and six signals to interpret, Jeani picks the
            single area most worth your attention, shows the trend that triggered it, and
            gives you stretches aimed at that specific area.
          </Lede>
          <Glass pad={mobile ? 20 : 24}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16 }}>
              <div>
                <div style={{ fontFamily:F.display,fontSize:21,fontWeight:700,color:'#fff' }}>Left Hamstring</div>
                <div style={{ fontFamily:F.body,fontSize:12.5,color:C.green,marginTop:2 }}>Improving over 7 days</div>
              </div>
              <div style={{ fontFamily:F.display,fontSize:28,fontWeight:700,color:C.green }}>+45</div>
            </div>
            <div style={{ fontFamily:F.body,fontSize:10.5,letterSpacing:2,textTransform:'uppercase',
              color:C.textMute,marginBottom:10 }}>Recommended stretches</div>
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              {STRETCHES.map((s, i) => (
                <motion.div key={s}
                  initial={{ opacity:0, x:8 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                  transition={{ delay:i * 0.08, duration:0.4 }}
                  style={{ display:'flex',alignItems:'center',gap:11 }}>
                  <span style={{ width:20,height:20,borderRadius:'50%',flexShrink:0,
                    background:'rgba(255,255,255,0.14)',color:'#fff',fontFamily:F.body,
                    fontSize:10.5,fontWeight:700,
                    display:'flex',alignItems:'center',justifyContent:'center' }}>{i + 1}</span>
                  <span style={{ fontFamily:F.body,fontSize:14,color:C.textSoft }}>{s}</span>
                </motion.div>
              ))}
            </div>
          </Glass>
        </>,
        <>
          <Eyebrow>Ask Jeani</Eyebrow>
          <Display size="clamp(26px, 2.9vw, 42px)" style={{ marginTop:12,marginBottom:14 }}>
            Ask why, and get a plain answer.
          </Display>
          <Lede>
            Every score links to a chat that can explain it. Answers are drawn from your own
            seven days of data, not from a generic training article.
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
    <Chapter id="watch" scrim="mid">
      <div style={{ maxWidth:1200,margin:'0 auto',padding: mobile ? '76px 22px' : '108px 6vw',
        display:'grid',gridTemplateColumns: mobile ? '1fr' : '1fr 0.85fr',
        gap: mobile ? 36 : 60,alignItems:'center' }}>
        <Reveal>
          <Eyebrow>What you need</Eyebrow>
          <Display size="clamp(28px, 3.5vw, 50px)" style={{ marginTop:14 }}>
            Works with the Apple Watch you already own.
          </Display>
          <Lede style={{ marginTop:16 }}>
            Jeani reads triaxial accelerometer data from your wrist while you walk and run.
            No chest strap, no footpod, no lab visit.
          </Lede>
          <Glass pad={mobile ? 16 : 20} radius={18} tone="soft" style={{ marginTop:26,display:'inline-block' }}>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap: mobile ? 12 : 30 }}>
              {[['Series 6', 'or later'], ['iOS 16', 'and up'], ['Nightly', 'rescored']].map(([a, b]) => (
                <div key={a}>
                  <div style={{ fontFamily:F.display,fontSize: mobile ? 16 : 20,fontWeight:700,color:'#fff' }}>{a}</div>
                  <div style={{ fontFamily:F.body,fontSize: mobile ? 9 : 10.5,letterSpacing:1.3,
                    textTransform:'uppercase',color:C.textMute,marginTop:3 }}>{b}</div>
                </div>
              ))}
            </div>
          </Glass>
        </Reveal>

        <Reveal delay={0.12} style={{ display:'flex',justifyContent:'center' }}>
          <motion.img src="/watch-render.png"
            alt="Jeani on Apple Watch, showing a daily goal of 73 percent"
            animate={{ y: [0, -9, 0] }}
            transition={{ duration:6.5, repeat:Infinity, ease:'easeInOut' }}
            /* Held near its native 454px width to stay sharp on 2x screens */
            style={{ width: mobile ? 'min(210px, 56vw)' : 'min(290px, 24vw)',height:'auto',display:'block',
              filter:'drop-shadow(0 30px 50px rgba(0,0,0,0.55))' }} />
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
    { n:'01', label:'Six signals per day',
      sub:'Joints · Balance · Mobility · Variety · Volume · Smoothness',
      detail:'Each is derived independently from the same wrist data, so a drop in one points at a specific problem rather than general noise.' },
    { n:'02', label:'Six joint estimates',
      sub:'Hip, knee and ankle, left and right',
      detail:'Triaxial accelerometry and gait proxy extraction turn one wrist sensor into per-joint load estimates, measured in real-world conditions.' },
    { n:'03', label:'Built with movement scientists',
      sub:'Amy Arundale · Jacob Rothman · Dr. Blake Boggess · Dr. Brinnae Bent',
      detail:'The methodology follows published clinical and sports science research on gait and joint loading.' },
  ]

  return (
    <Chapter id="science">
      <div style={{ maxWidth:1280,margin:'0 auto',padding: mobile ? '76px 22px' : '108px 6vw' }}>
        <div style={{ display:'grid',gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: mobile ? 26 : 56,alignItems:'end',marginBottom: mobile ? 34 : 56 }}>
          <Reveal>
            <ChapterMark n="05">The science</ChapterMark>
            <Display>How the numbers are produced.</Display>
          </Reveal>
          <Reveal delay={0.1}>
            <Lede>
              Gait analysis used to mean a lab, a force plate and an appointment. Jeani derives
              the same underlying measures from the accelerometer you already wear.
            </Lede>
          </Reveal>
        </div>

        <div style={{ display:'grid',gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',gap:14 }}>
          {PILLARS.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.1}>
              <Glass pad={mobile ? 22 : 26} style={{ height:'100%' }}>
                <div style={{ fontFamily:F.display,fontSize:12,fontWeight:700,color:C.sand,
                  opacity:0.6,marginBottom:14 }}>{p.n}</div>
                <div style={{ fontFamily:F.display,fontSize:19,fontWeight:700,color:'#fff',
                  lineHeight:1.2,marginBottom:8,letterSpacing:'-0.02em' }}>{p.label}</div>
                <div style={{ fontFamily:F.body,fontSize:12,color:C.textMute,marginBottom:12,lineHeight:1.5 }}>
                  {p.sub}
                </div>
                <div style={{ fontFamily:F.body,fontSize:13.5,color:C.textSoft,lineHeight:1.6 }}>
                  {p.detail}
                </div>
              </Glass>
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
    'Motion score, rebuilt every night',
    'Injury Radar across six joints',
    'Spotlight, one area each week',
    'Ask Jeani, reading your own data',
    'Streaks and 90 days of history',
    'Apple Watch, no extra hardware',
  ]

  const price  = billing === 'monthly' ? '$9.99' : '$99.99'
  const period = billing === 'monthly' ? '/month' : '/year'
  const sub    = billing === 'monthly' ? null : '$8.33 a month, billed annually'

  return (
    <Chapter id="plans">
      <div style={{ maxWidth:1200,margin:'0 auto',padding: mobile ? '76px 22px 84px' : '108px 6vw 124px',
        display:'grid',gridTemplateColumns: mobile ? '1fr' : '1fr 0.9fr',
        gap: mobile ? 34 : 60,alignItems:'center' }}>

        <Reveal>
          <ChapterMark n="06">Plans</ChapterMark>
          <Display>Try the full app free for two weeks.</Display>
          <Lede style={{ marginTop:16 }}>
            Everything in this walkthrough is included. One plan, no tiers, nothing held back.
          </Lede>
          <div style={{ display:'grid',gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
            gap:'9px 18px',marginTop:26 }}>
            {FEATURES.map((f, i) => (
              <motion.div key={f}
                initial={{ opacity:0, x:-8 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                transition={{ delay:i * 0.05, duration:0.4 }}
                style={{ display:'flex',gap:9,alignItems:'flex-start' }}>
                <span style={{ width:17,height:17,borderRadius:'50%',flexShrink:0,marginTop:2,
                  background:'rgba(255,255,255,0.16)',color:'#fff',fontSize:9,
                  display:'flex',alignItems:'center',justifyContent:'center' }}>✓</span>
                <span style={{ fontFamily:F.body,fontSize:14,color:C.textSoft,lineHeight:1.45 }}>{f}</span>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <Glass pad={mobile ? 26 : 32} radius={26}>
            <div style={{ display:'inline-flex',background:'rgba(255,255,255,0.1)',
              borderRadius:30,padding:4,marginBottom:22 }}>
              {['monthly', 'annual'].map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  style={{ padding:'9px 18px',borderRadius:26,border:'none',cursor:'pointer',
                    fontFamily:F.body,fontSize:12.5,fontWeight:600,transition:'all 0.22s',
                    background: billing === b ? C.sand : 'transparent',
                    color: billing === b ? C.navy : C.textSoft }}>
                  {b === 'monthly' ? 'Monthly' : 'Annual · save 17%'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={billing}
                initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
                transition={{ duration:0.2 }} style={{ marginBottom:22 }}>
                <div style={{ display:'flex',alignItems:'baseline',gap:7 }}>
                  <span style={{ fontFamily:F.display,fontSize:'clamp(42px,4.2vw,58px)',fontWeight:700,
                    color:'#fff',lineHeight:1,letterSpacing:'-0.04em' }}>{price}</span>
                  <span style={{ fontFamily:F.body,fontSize:16,color:C.textMute }}>{period}</span>
                </div>
                {sub && <div style={{ fontFamily:F.body,fontSize:13,color:C.textMute,marginTop:6 }}>{sub}</div>}
                <div style={{ fontFamily:F.body,fontSize:13,color:C.green,fontWeight:600,marginTop:8 }}>
                  First fourteen days free
                </div>
              </motion.div>
            </AnimatePresence>

            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer"
              style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:9,width:'100%',
                padding:'16px',borderRadius:14,background:C.sand,color:C.navy,textDecoration:'none',
                fontFamily:F.body,fontSize:15.5,fontWeight:700 }}>
              <svg width="15" height="18" viewBox="0 0 24 24" fill={C.navy} aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Start your free trial
            </a>
            <div style={{ textAlign:'center',fontFamily:F.body,fontSize:12,color:C.textMute,marginTop:12 }}>
              Cancel any time
            </div>
          </Glass>
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
    <footer style={{ position:'relative',padding:'34px 6vw',overflow:'hidden' }}>
      <div style={{ position:'absolute',inset:0,background:'rgba(5,6,15,0.9)' }} />
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
