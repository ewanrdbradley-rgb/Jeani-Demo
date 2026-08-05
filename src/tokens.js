/* ══════════════════════════════════════════════════════════════════
   TOKENS and DATA: no components in here, so editing a colour or a
   number hot-reloads cleanly instead of remounting the page.

   Palette is the Jeani Brand Principles book (p.5): Deep Blue, Black,
   Sand White, White. The electric/ice pair is the in-app accent ramp,
   used only inside phone screens and data so the app reads as the app.
   There is no cyan in the brand.
══════════════════════════════════════════════════════════════════ */

/* The page is paper. Dark is reserved for two things: full-bleed
   photography, and anything showing real app data (the phone, the radar,
   the day chart). That split is the whole visual system: the site speaks in
   navy on sand, the product speaks in its own dark UI. */
export const C = {
  // Grounds
  paper:     '#F7EEDD',  // default page ground, sand lightened for large areas
  paperDeep: '#EEE0C6',  // alternate band, for rhythm between paper sections
  sand:      '#FBECCF',  // Sand White, brand book p.5, used on dark
  white:     '#FFFFFF',

  // Ink
  navy:      '#112378',  // Deep Blue, headlines and rules
  navyDeep:  '#0a1447',
  ink:       '#141A3A',  // body copy on paper, softer than pure navy
  inkSoft:   '#5A6180',
  inkMute:   '#9A9DB0',
  line:      'rgba(17,35,120,0.16)',

  // Dark surfaces (photo bands, data panels, phone screens)
  night:     '#05060f',

  // In-app accent ramp, legible on the dark panels
  electric:  '#5C8DFF',
  ice:       '#D6E4FF',
  green:     '#00E87B',
  amber:     '#F5A000',
  red:       '#FF6B6B',

  // The same semantics darkened enough to read on paper
  greenInk:  '#00815A',
  amberInk:  '#A96B00',
  redInk:    '#C2403F',
  blueInk:   '#2C4ED4',
}

/* Host Grotesk throughout, display and body alike. The brand book (p.4)
   names Crimson Pro as the primary heading face; the demo deliberately runs
   all-sans instead. Crimson Pro is still declared in index.css, so putting
   it back is a one-line change here. */
export const F = {
  display: "'HostGrotesk', system-ui, sans-serif",
  body:    "'HostGrotesk', system-ui, sans-serif",
}

export const EASE = [0.22, 1, 0.36, 1]

export const APP_STORE_URL = 'https://apps.apple.com/us/app/jeani/id6742083552'

/* ── The six Motion signals ──────────────────────────────────────────
   Labels and blurbs are lifted verbatim from MotionSubscore in
   JEANI/Models/SupabaseModels.swift so the demo and the app agree.
   If the app's wording changes, change it here too. */
export const SIGNALS = [
  { key:'joints',     label:'Joints',     value:68, blurb:'day-to-day change in joint strain' },
  { key:'balance',    label:'Balance',    value:67, blurb:'how evenly left and right share the load' },
  { key:'mobility',   label:'Mobility',   value:64, blurb:'walking quality from your watch' },
  { key:'variety',    label:'Variety',    value:72, blurb:'how varied your movement was' },
  { key:'volume',     label:'Volume',     value:41, blurb:'how much you moved overall' },
  { key:'smoothness', label:'Smoothness', value:79, blurb:'how fluid your movement is' },
]

/* ── Injury Radar joints ─────────────────────────────────────────────
   angle is degrees anticlockwise from east, so the six axes sit as a
   hexagon: hips top, knees mid, ankles bottom. */
export const JOINTS = [
  { key:'lhip',   label:'L Hip',   value:85, angle:120, status:'clear' },
  { key:'rhip',   label:'R Hip',   value:88, angle:60,  status:'clear' },
  { key:'lknee',  label:'L Knee',  value:91, angle:180, status:'clear' },
  { key:'rknee',  label:'R Knee',  value:89, angle:0,   status:'clear' },
  { key:'lankle', label:'L Ankle', value:93, angle:240, status:'clear' },
  { key:'rankle', label:'R Ankle', value:85, angle:300, status:'watch' },
]

/* ── Movement Today, the day curve on the app's home card ─────────── */
export const DAY = [
  { t:'12am', v:0.02 }, { t:'3am', v:0.02 }, { t:'5am', v:0.03 }, { t:'6am', v:0.45 },
  { t:'7am', v:1.00 },  { t:'8am', v:0.46 }, { t:'9am', v:0.63 }, { t:'10am', v:0.50 },
  { t:'11am', v:0.30 }, { t:'12pm', v:0.22 }, { t:'1pm', v:0.34 }, { t:'2pm', v:0.34 },
  { t:'3pm', v:0.16 },  { t:'4pm', v:0.10 },
]
