'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useBuildStore } from '@/store/buildStore'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id:      string
  role:    'user' | 'bot'
  content: string
  ts:      Date
}

type BotMode   = 'chat' | 'recon'
type ReconStep = 'idle' | 'vehicle' | 'mission' | 'budget' | 'complete'

interface ReconData {
  vehicle?: string
  mission?: string
  budget?:  number
}

// ─── Mission allocation engine ────────────────────────────────────────────────

type MissionId =
  | 'OVERLAND' | 'EXPEDITION' | 'CAMPING' | 'TACTICAL'
  | 'RECOVERY' | 'WORK TRUCK' | 'DAILY ADVENTURE'

interface AllocRow {
  category: string
  pct:      number
  note:     string
}

const MISSION_ALLOC: Record<MissionId, AllocRow[]> = {
  OVERLAND: [
    { category: 'Suspension',  pct: 0.25, note: 'Lift + coilovers — backbone of off-road capability' },
    { category: 'Roof Rack',   pct: 0.10, note: 'Modular platform for RTT + gear mounting' },
    { category: 'RTT',         pct: 0.28, note: 'Hardshell recommended for overland use' },
    { category: 'Recovery',    pct: 0.09, note: 'Winch + boards + straps — non-negotiable' },
    { category: 'Lighting',    pct: 0.10, note: '40" LED bar + bumper pods' },
    { category: 'Storage',     pct: 0.13, note: 'Drawer system + dry bags' },
  ],
  EXPEDITION: [
    { category: 'Suspension',  pct: 0.20, note: 'Load-rated lift for heavy gear' },
    { category: 'Roof Rack',   pct: 0.10, note: 'Extended platform rack' },
    { category: 'RTT',         pct: 0.22, note: 'Full-size tent with annex' },
    { category: 'Electrical',  pct: 0.14, note: 'Dual battery + 200W solar + DC-DC charger' },
    { category: 'Recovery',    pct: 0.10, note: 'Full recovery system' },
    { category: 'Storage',     pct: 0.14, note: 'Integrated cargo management' },
    { category: 'Lighting',    pct: 0.05, note: 'Camp lighting' },
  ],
  CAMPING: [
    { category: 'RTT',         pct: 0.38, note: 'Premium softshell or hardshell tent' },
    { category: 'Kitchen',     pct: 0.18, note: 'Slide-out camp kitchen or drop-fridge' },
    { category: 'Power',       pct: 0.16, note: 'Aux battery + solar — keeps fridge running' },
    { category: 'Storage',     pct: 0.14, note: 'Cargo bins + drawer system' },
    { category: 'Lighting',    pct: 0.09, note: 'Camp + interior ambient lighting' },
  ],
  TACTICAL: [
    { category: 'Armor',       pct: 0.30, note: 'Steel bumpers + rock sliders + skid plates' },
    { category: 'Recovery',    pct: 0.22, note: 'Winch + full recovery kit' },
    { category: 'Suspension',  pct: 0.24, note: 'Heavy-duty lift with long-travel' },
    { category: 'Lighting',    pct: 0.12, note: 'Full-perimeter lighting for night ops' },
    { category: 'Storage',     pct: 0.07, note: 'Secure weapon-grade storage' },
  ],
  RECOVERY: [
    { category: 'Winch',       pct: 0.32, note: 'Warn 10,000 lb+ with synthetic rope' },
    { category: 'Recovery Kit',pct: 0.25, note: 'Snatch block, shackles, boards, straps' },
    { category: 'Suspension',  pct: 0.18, note: 'High-clearance lift + skid plates' },
    { category: 'Armor',       pct: 0.15, note: 'Skid plates + rock sliders' },
    { category: 'Lighting',    pct: 0.07, note: 'Work lights for night recovery' },
  ],
  'WORK TRUCK': [
    { category: 'Tool Storage',pct: 0.30, note: 'Under-rail toolboxes + organizers' },
    { category: 'Rack System', pct: 0.25, note: 'Ladder rack + cargo basket' },
    { category: 'Lighting',    pct: 0.18, note: 'Work lights + bed flood lights' },
    { category: 'Towing',      pct: 0.15, note: 'Hitch + brake controller + mirrors' },
    { category: 'Protection',  pct: 0.07, note: 'Running boards + bed liner' },
  ],
  'DAILY ADVENTURE': [
    { category: 'Wheels & Tires',pct: 0.28, note: 'All-terrain tires — biggest day-to-day impact' },
    { category: 'Suspension',    pct: 0.22, note: 'Light leveling kit or mild lift' },
    { category: 'Roof Rack',     pct: 0.14, note: 'Low-profile crossbars or platform' },
    { category: 'Lighting',      pct: 0.18, note: 'Bumper pods + fog upgrades' },
    { category: 'Recovery',      pct: 0.10, note: 'Basic recovery essentials' },
  ],
}

function generateReconPlan(vehicle: string, mission: string, budget: number): string {
  const key = mission.toUpperCase() as MissionId
  const rows = MISSION_ALLOC[key] ?? MISSION_ALLOC.OVERLAND
  const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

  let allocated = 0
  const lines = rows.map(r => {
    const amt = Math.round(budget * r.pct)
    allocated += amt
    return `**${r.category}** — ${fmt(amt)}\n${r.note}`
  })
  const remaining = budget - allocated

  return [
    `RECON COMPLETE — ${vehicle.toUpperCase()}`,
    `Mission: **${mission.toUpperCase()}** · Budget: **${fmt(budget)}**`,
    '',
    '─── RECOMMENDED ALLOCATION ───',
    '',
    ...lines,
    '',
    `**Remaining / Contingency** — ${fmt(remaining)}`,
    '',
    '─────────────────────────────',
    `Total accounted: **${fmt(allocated)}** of **${fmt(budget)}**`,
    '',
    'Want me to deep-dive any category, suggest specific products, or find installers for this build?',
  ].join('\n')
}

// ─── Build context (live from store) ─────────────────────────────────────────

function useBuildContext() {
  const vehicle   = useBuildStore(s => s.vehicle)
  const year      = useBuildStore(s => s.year)
  const trim      = useBuildStore(s => s.trim)
  const purposes  = useBuildStore(s => s.purposes)
  const budget    = useBuildStore(s => s.budget)
  const items     = useBuildStore(s => s.items)
  const buildName = useBuildStore(s => s.buildName)
  const gearTotal = useBuildStore(s => s.gearTotal)
  const buildTotal= useBuildStore(s => s.buildTotal)

  const total     = buildTotal()
  const gear      = gearTotal()
  const remaining = budget - total
  const itemCount = Object.keys(items).length

  // Derive categories present in build
  const categories = Array.from(new Set(
    Object.values(items).map((i: any) => i.category).filter(Boolean)
  )) as string[]

  // Categories typically needed but missing (overland reference set)
  const CORE_CATS = ['Suspension', 'Recovery', 'Lighting', 'Roof Racks', 'Rooftop Tents', 'Electrical']
  const missing   = CORE_CATS.filter(c => !categories.includes(c))

  return {
    hasVehicle: !!vehicle,
    vehicleName: vehicle ? `${year} ${vehicle.name} ${trim}`.trim() : null,
    buildName,
    budget,
    total,
    gear,
    remaining,
    itemCount,
    categories,
    missing,
    pctUsed: budget > 0 ? Math.round((total / budget) * 100) : 0,
    isOverBudget: remaining < 0,
  }
}

// ─── Context-aware quick prompts ──────────────────────────────────────────────

const QUICK_ACTIONS = [
  'Build me an overland setup under $10,000',
  'Recommend a Tacoma build',
  'Analyze my current build',
  'Compare RTT options',
  'Find compatible roof racks',
  'Help me stay within budget',
  'Find installers for my build',
]

const CONTEXT_PROMPTS: Record<string, string[]> = {
  '/build': [
    'Analyze my current build',
    'Help me stay within budget',
    'What am I missing from this build?',
    'Find installers for my build',
  ],
  '/gear': [
    'Compare roof rack options',
    'Find a recovery winch under $1k',
    'What fits a 2024 Toyota 4Runner?',
    'Best RTT options under $3k',
  ],
  '/installers': [
    'Find installers near me',
    'Who specializes in suspension installs?',
    'Get a quote estimate for my build',
    'What install categories does my build need?',
  ],
  '/community': [
    'Recommend a Tacoma build',
    'What makes a great overland setup?',
    'How should I spec a $15K expedition rig?',
  ],
  '/garage': [
    'Analyze my current build',
    'What should I prioritize next?',
    'Help me stay within budget',
  ],
  '/pricing': [
    'What does BŌRYKU Pro include?',
    'Is Pro worth it for my build stage?',
    'What\'s the difference between plans?',
  ],
  '/': [
    'Build me an overland setup under $10k',
    'Recommend a Tacoma build',
    'Compare RTT options',
    'Find compatible roof racks',
  ],
}

function getPrompts(pathname: string): string[] {
  const prefixes = Object.keys(CONTEXT_PROMPTS).filter(k => k !== '/')
  const match = prefixes.find(p => pathname.startsWith(p))
  return match ? CONTEXT_PROMPTS[match] : CONTEXT_PROMPTS['/']
}

// ─── Response engine ──────────────────────────────────────────────────────────
// Future: replace with OpenAI / Claude API call

type ResponseEntry = [RegExp, string | string[]]

const RESPONSE_PATTERNS: ResponseEntry[] = [
  [
    /\b(hello|hi|hey|what can you|help me|start|begin|mission)\b/i,
    'Mission ready. I\'m BŌT — your BŌRYKU Overland Technician.\n\nI can help you:\n• **Spec a full build** with budget allocation (RECON mode)\n• **Analyze your current build** for gaps and upgrades\n• **Check compatibility** — tires, tents, racks, winches\n• **Track your budget** in real time\n• **Find installers** matched to your build needs\n\nWhat\'s the mission?',
  ],

  // RECON trigger
  [
    /\b(recon|build me|spec me|recommend.*build|plan.*build|setup.*under|rig under|overland.*setup|expedition.*setup|camping.*setup)\b/i,
    'RECON MODE ENGAGED.\n\nLet\'s spec your build from scratch. I\'ll generate a full allocation across all categories.\n\n**Step 1 of 3 — What\'s your rig?**\nYear · Make · Model · Trim\n\nExample: "2024 Toyota 4Runner TRD Pro"',
  ],

  // Build analysis trigger
  [
    /\b(analyze|analysis|review.*build|check.*build|what.*missing|assess|audit)\b/i,
    '__ANALYZE_BUILD__',
  ],

  // Budget tracking
  [
    /\b(budget|remaining|how much|left|overspend|over budget|afford|cost|spend)\b/i,
    '__BUDGET_STATUS__',
  ],

  // Installer assistant
  [
    /\b(install|installer|shop|mechanic|fabricat|quote|who can|find.*shop)\b/i,
    '__INSTALLER_RECO__',
  ],

  // RTT
  [
    /\brtt|rooftop.?tent|roof.?tent|sleeping|hardshell|softshell\b/i,
    'RTT options across the range:\n\n• **Roofnest Condor XL** — $3,200 · Best aerodynamics, fast deploy\n• **iKamper Skycamp 3.0** — $3,800 · Most interior space, 4-person\n• **ARB Simpson III** — $2,600 · Most durable, expedition-proven\n• **Tepui Hybox** — $1,800 · Best entry-level, hybrid design\n• **James Baroud Evasion** — $4,100 · Premium European spec\n\n**Hardshell** recommended for regular use — faster setup, better aerodynamics, longer lifespan.\n\nWant me to filter by vehicle clearance or your budget ceiling?',
  ],

  // Suspension
  [
    /\b(suspension|lift|leveling|coilover|shock|spring|bilstein|emu|king|fox)\b/i,
    'For overland use, a **2–3 inch lift with quality coilovers** is the proven sweet spot — enough clearance for 33–35" tires without killing highway manners or wearing out your CV joints.\n\nTop options by tier:\n\n• **Bilstein 5100** — $680 · Best value, bolt-on fitment\n• **Old Man Emu BP-51** — $1,800 · Adjustable, expedition-rated\n• **Fox 2.5 Performance Elite** — $2,600 · Trail-ready, rebuildable\n• **King OEM Replacement** — $3,200 · Top tier, race-proven\n\nWhat\'s your vehicle year, make, and model? I\'ll verify fitment and check clearance for your target tire size.',
  ],

  // Roof racks
  [
    /\b(roof.?rack|cargo.?rack|platform.?rack|rack.*system)\b/i,
    'For a clean, modular setup:\n\n• **Front Runner Slimline II** — $680–$1,100 · Most popular, huge accessory ecosystem\n• **Rhino-Rack Pioneer Platform** — $520–$900 · Good value, wide compatibility\n• **ARB Base Rack** — $780–$1,200 · Expedition-grade, load-rated\n• **Thule Caprock** — $460–$780 · Clean OEM look, entry overland\n\nAll support RTT mounting, lighting bars, and recovery gear.\n\nWhat\'s your vehicle? I\'ll confirm compatibility and max load rating.',
  ],

  // Recovery / winch
  [
    /\b(winch|recovery.?gear|snatch|tow.?strap|hi.?lift|board)\b/i,
    'Recovery essentials, in priority order:\n\n1. **Winch** — Warn Zeon 10-S ($1,200) or Warn VR EVO 10-S ($820). Always spec **synthetic rope** — lighter, safer, UV-resistant.\n2. **Recovery Boards** — MAXTRAX MKII ($320) or Traction Boards ($140). Non-negotiable.\n3. **Snatch Strap** — 30\' at 30,000 lb min. $80–$120.\n4. **Shackles** — 3/4" bow shackles × 2. $40.\n5. **Hi-Lift Jack** — 60" cast iron. $120.\n\nFor most builds, budget **$800–$1,400** for a complete recovery kit.',
  ],

  // Lighting
  [
    /\b(light|lighting|led|led.?bar|spot|flood|baja|rigid|kc.?hi)\b/i,
    'For maximum trail capability:\n\n**Tier 1 — Light Bar** (roof or bumper)\n• Baja Designs OnX6 40" — $980 · Top performer\n• KC HiLiTES C-Series 40" — $720 · Best value\n• Rigid Industries E-Series 40" — $840 · Proven design\n\n**Tier 2 — Pods** (ditch, A-pillar, or bumper)\n• Baja Designs Squadron Pro × 2 — $480\n• Rigid Dually D2 × 2 — $320\n\nFull setup (bar + pods): **$800–$1,600**\n\nAre you mounting on the roof, bumper, or both? I\'ll recommend the right combination.',
  ],

  // Compatibility
  [
    /\b(compatible|fit|work.?with|clearance|match|will.*fit|does.*fit)\b/i,
    'Compatibility depends on your vehicle year, make, and trim — even a single model year can have different mounting points and clearance specs.\n\nOnce you set your build profile, I cross-reference the BŌRYKU catalog and flag anything that won\'t fit — no surprise returns.\n\nWhat\'s your rig? **Year / Make / Model / Trim** — and what are you trying to fit?',
  ],

  // Vehicle-specific: Toyota
  [
    /\b(4runner|tacoma|tundra|toyota|trd)\b/i,
    'Toyotas are the most popular build platform in the BŌRYKU network — bulletproof reliability and the deepest aftermarket ecosystem.\n\n**4Runner** — Best trail platform. 5th gen TRD Pro is the gold standard.\n**Tacoma** — Most popular truck build. 3rd gen DCSB is the go-to canvas.\n**Tundra** — Ideal for heavy expedition builds. More payload, larger footprint.\n\nAll three have more BŌRYKU-verified fitments than any other platform.\n\nAre you building for weekenders, expeditions, or daily driver + trail?',
  ],

  // Vehicle-specific: Ford
  [
    /\b(bronco|f-150|f150|ford|ranger|raptor)\b/i,
    'Ford platforms are some of the most capable build bases in the network:\n\n**Bronco 4-door** — Incredible off-road geometry. Most popular 4-door SUV build right now.\n**F-150 Raptor** — Factory-wide body, Fox shocks, best long-travel desert truck.\n**Ranger** — Mid-size sweet spot. Great clearance-to-daily ratio.\n\nFord aftermarket has expanded massively since 2021. Strong compatibility across brands.\n\nWhat\'s your specific model and year? I\'ll pull the top build paths.',
  ],

  // Vehicle-specific: Jeep
  [
    /\b(jeep|wrangler|gladiator|jl|jk|jku)\b/i,
    'Jeep Wranglers have the deepest aftermarket of any platform — if you want to build it, parts exist.\n\n**Standard build path:**\n2" lift → 33s → lockers → bumpers → recovery gear → 35s + regear\n\n**JL/JLU** — Best factory off-road, strongest Dana 44 axles\n**JK** — Cheapest to build, massive used parts market\n**Gladiator** — Best of both: Wrangler capability + truck bed\n\nWhere are you in the build sequence?',
  ],

  // Vehicle-specific: RAM/Chevy
  [
    /\b(ram|1500|2500|trx|chevy|chevrolet|colorado|zr2|silverado)\b/i,
    'Great truck platforms for overland and expedition builds:\n\n**RAM TRX** — Factory supercharged beast. Best long-travel truck OEM.\n**Chevy Colorado ZR2** — Best mid-size off-road truck, Multimatic DSSV shocks.\n**RAM 2500** — Heavy expedition builds, max payload, diesel torque.\n\nAll have solid aftermarket support. What\'s your target build category?',
  ],

  // Electrical / power
  [
    /\b(battery|power|solar|dual.?battery|electrical|redarc|victron|renogy)\b/i,
    'A solid power system is the backbone of camp life. Recommended stack:\n\n1. **100–200Ah Lithium Auxiliary Battery** — $400–$900\n2. **DC-DC Charger** — charges aux from alternator while driving. $180–$380\n3. **200W+ Solar Panel** — for extended off-grid. $200–$500\n4. **400W Inverter** — powers devices, tools, medical equipment\n\n**BŌRYKU-verified brands:** Victron, REDARC, Renogy, Battle Born, Dragonfly Energy\n\nFor a complete setup: **$800–$2,200** depending on capacity targets.',
  ],

  // Tires/wheels
  [
    /\b(tire|tires|wheel|wheels|33s|35s|all.terrain|mud.terrain)\b/i,
    'Tire sizing depends on your lift and wheel well clearance:\n\n• **Stock or 1–2" lift** → 275/70R17 (~32.2") — no rub\n• **2–3" lift** → 285/70R17 (~33.0") — sweet spot\n• **3–4" lift** → 285/75R17 (~34.8") — capable off-road, minor regear needed\n• **4"+ lift** → 315/70R17 (~35.0") — max capable, regear recommended\n\n**Best all-terrain options:**\n• BFGoodrich KO2 — most proven, road/trail balance\n• Toyo Open Country AT3 — quietest ride\n• Falken Wildpeak AT3W — best value\n\nWhat\'s your current lift height and rim size?',
  ],

  // Pricing / subscription
  [
    /\b(pro|subscription|upgrade|plan|pricing|worth)\b/i,
    'BŌRYKU Pro unlocks the full platform:\n\n• **Unlimited Builds** — no limit on saved configurations\n• **Advanced AI Recommendations** — smarter BŌT responses\n• **Installer Quote Requests** — direct shop communication\n• **PDF Build Exports** — shareable build sheets\n• **Build History** — track every change\n• **Vehicle Garage** — manage multiple rigs\n\n**$12.99/mo** or **$10.39/mo** billed annually — includes 7-day free trial.\n\nWant me to walk through what Pro unlocks for your specific build stage?',
  ],
]

const FALLBACK = [
  'Good question. Tell me your vehicle platform and build goals — I\'ll pull the most relevant options from the BŌRYKU catalog.',
  'I\'m on it. What\'s your rig and are you building for weekenders, expeditions, or daily use?',
  'Let me cross-reference the BŌRYKU network. What\'s your vehicle year, make, and model?',
]

async function getPatternResponse(input: string): Promise<string | null> {
  for (const [pattern, response] of RESPONSE_PATTERNS) {
    if (pattern.test(input)) {
      if (Array.isArray(response)) return response[Math.floor(Math.random() * response.length)]
      return response as string
    }
  }
  return null
}

// ─── Markdown-lite renderer ───────────────────────────────────────────────────

function renderContent(text: string): string {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
}

// ─── Injected styles ──────────────────────────────────────────────────────────

const BOT_STYLE_ID = 'ryku-bot-styles-v2'

function injectBotStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(BOT_STYLE_ID)) return
  const el = document.createElement('style')
  el.id = BOT_STYLE_ID
  el.textContent = `
    @keyframes bot-ring-pulse {
      0%   { opacity: 0.6;  transform: translate(-50%,-50%) scale(1); }
      70%  { opacity: 0;    transform: translate(-50%,-50%) scale(2.4); }
      100% { opacity: 0;    transform: translate(-50%,-50%) scale(2.4); }
    }
    @keyframes bot-glow-idle {
      0%,100% { box-shadow: 0 0 14px rgba(255,170,40,0.50), 0 8px 28px rgba(0,0,0,0.55); }
      50%     { box-shadow: 0 0 34px rgba(255,170,40,0.85), 0 8px 28px rgba(0,0,0,0.55); }
    }
    @keyframes bot-dot {
      0%,60%,100% { opacity: 0.18; transform: scale(0.72); }
      30%         { opacity: 1;    transform: scale(1); }
    }
    .bot-fab-glow  { animation: bot-glow-idle 2.8s ease-in-out infinite; }
    .bot-dot-1 { animation: bot-dot 1.35s ease-in-out 0s    infinite; }
    .bot-dot-2 { animation: bot-dot 1.35s ease-in-out 0.18s infinite; }
    .bot-dot-3 { animation: bot-dot 1.35s ease-in-out 0.36s infinite; }
    .bot-msg-content strong { color: #FFC857; font-weight: 600; }
    .bot-scroll::-webkit-scrollbar       { width: 3px; }
    .bot-scroll::-webkit-scrollbar-track { background: transparent; }
    .bot-scroll::-webkit-scrollbar-thumb { background: rgba(255,85,31,0.2); border-radius: 4px; }
    .bot-prompt-btn:hover {
      background: rgba(255,85,31,0.10) !important;
      border-color: rgba(255,85,31,0.45) !important;
      color: #FF6B35 !important;
    }
    .bot-suggest-btn:hover {
      background: rgba(255,85,31,0.12) !important;
      border-color: rgba(255,85,31,0.40) !important;
      color: rgba(255,85,31,0.90) !important;
    }
    .bot-mode-btn:hover { opacity: 1 !important; }
    @media (max-width: 500px) {
      .bot-panel {
        width: calc(100vw - 20px) !important;
        right: 10px !important;
        bottom: calc(var(--status-h,46px) + 74px) !important;
        height: min(540px,calc(100dvh - 160px)) !important;
      }
    }
  `
  document.head.appendChild(el)
}

// ─── BŌT hex icon ─────────────────────────────────────────────────────────────

function BotHexIcon({ size = 24, dim = false, color }: { size?: number; dim?: boolean; color?: string }) {
  const c = color ?? (dim ? 'rgba(255,85,31,0.55)' : '#FF551F')
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
      <path d="M14 2.5L23.5 7.75v10.5L14 23.5 4.5 18.25V7.75L14 2.5z"
        stroke={c} strokeWidth="1.3" fill="none" opacity="0.65"/>
      <circle cx="10.5" cy="12" r="1.5" fill={c} opacity="0.9"/>
      <circle cx="17.5" cy="12" r="1.5" fill={c} opacity="0.9"/>
      <path d="M10.5 16.5c0 0 1.2 1.2 3.5 1.2s3.5-1.2 3.5-1.2"
        stroke={c} strokeWidth="1.3" strokeLinecap="round" opacity="0.8"/>
      <line x1="14" y1="2.5" x2="14" y2="5.8" stroke={c} strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>
      <circle cx="14" cy="7" r="1" fill={c} opacity="0.6"/>
    </svg>
  )
}

// ─── BotAvatar ─────────────────────────────────────────────────────────────────

function BotAvatar() {
  return (
    <div style={{
      width: 26, height: 26, borderRadius: '50%', flexShrink: 0, marginTop: 2,
      background: 'rgba(255,85,31,0.1)', border: '1px solid rgba(255,85,31,0.28)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <BotHexIcon size={14} dim />
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BotWidget() {
  if (typeof window !== 'undefined') injectBotStyles()

  const [open,       setOpen]       = useState(false)
  const [messages,   setMessages]   = useState<Message[]>([])
  const [input,      setInput]      = useState('')
  const [typing,     setTyping]     = useState(false)
  const [unread,     setUnread]     = useState(false)
  const [showLabel,  setShowLabel]  = useState(false)
  const [mode,       setMode]       = useState<BotMode>('chat')
  const [reconStep,  setReconStep]  = useState<ReconStep>('idle')
  const [reconData,  setReconData]  = useState<ReconData>({})
  const [suggestions,setSuggestions]= useState<string[]>([])

  const pathname = usePathname() ?? '/'
  const endRef   = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const prompts  = getPrompts(pathname)
  const hasMsg   = messages.length > 0

  // Live build context
  const ctx = useBuildContext()

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  useEffect(() => {
    if (open) { setUnread(false); setShowLabel(false); setTimeout(() => inputRef.current?.focus(), 320) }
  }, [open])

  useEffect(() => {
    const t1 = setTimeout(() => setShowLabel(true),  3000)
    const t2 = setTimeout(() => setShowLabel(false), 8000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // ── Mode switch ──────────────────────────────────────────────────────────────
  function switchMode(m: BotMode) {
    setMode(m)
    setMessages([])
    setReconStep('idle')
    setReconData({})
    setSuggestions([])
    if (m === 'recon') {
      // Kick off RECON with a pre-filled first question
      setTimeout(() => {
        const pre = ctx.hasVehicle
          ? `RECON MODE ENGAGED.\n\nI can see you have a **${ctx.vehicleName}** in your build profile.\n\nShall I use this vehicle for the RECON plan? Reply **yes** or tell me a different rig.\n\nFormat: Year · Make · Model · Trim`
          : `RECON MODE ENGAGED.\n\nLet\'s spec your build from scratch. I\'ll generate a full allocation across all categories.\n\n**Step 1 of 3 — What\'s your rig?**\nYear · Make · Model · Trim\n\nExample: "2024 Toyota 4Runner TRD Pro"`
        pushBot(pre)
        setReconStep(ctx.hasVehicle ? 'vehicle' : 'vehicle')
        if (ctx.hasVehicle) setSuggestions(['Yes, use my current vehicle', 'Use a different vehicle'])
      }, 200)
    }
  }

  // ── Push a bot message ───────────────────────────────────────────────────────
  function pushBot(content: string, newSuggestions?: string[]) {
    setMessages(m => [...m, { id: `b${Date.now()}`, role: 'bot', content, ts: new Date() }])
    setSuggestions(newSuggestions ?? [])
  }

  // ── Resolve dynamic placeholders ─────────────────────────────────────────────
  function resolveSpecialToken(token: string): string {
    const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

    if (token === '__BUDGET_STATUS__') {
      if (!ctx.hasVehicle || ctx.budget === 0) {
        return 'I don\'t have your build profile loaded yet. Head to the **Build Planner** to set your vehicle and budget — I\'ll track every dollar in real time.'
      }
      const lines = [
        `Budget status for **${ctx.buildName}**:`,
        '',
        `• Total budget: **${fmt(ctx.budget)}**`,
        `• Gear added: **${fmt(ctx.total)}** (${ctx.pctUsed}% used)`,
        `• Remaining: **${fmt(ctx.remaining)}**${ctx.isOverBudget ? ' — ⚠️ OVER BUDGET' : ''}`,
        '',
        ctx.isOverBudget
          ? `You\'re over budget by **${fmt(Math.abs(ctx.remaining))}**. Want me to suggest swaps to bring it back in range?`
          : `You have **${fmt(ctx.remaining)}** left. ${ctx.remaining > 2000 ? 'Plenty of headroom. Want me to suggest what to add next?' : 'Getting close — want me to flag any lower-cost alternatives?'}`,
      ]
      return lines.join('\n')
    }

    if (token === '__ANALYZE_BUILD__') {
      if (!ctx.hasVehicle) {
        return 'I need your build data to run an analysis. Start the **Build Planner** — once you\'ve set your vehicle and added some gear, I\'ll give you a full diagnostic.'
      }
      if (ctx.itemCount === 0) {
        return `Your **${ctx.vehicleName}** is in the garage but you haven\'t added gear yet.\n\nHead to the **Build Planner → RECON step** to get recommendations, then come back and I\'ll analyze your full build.`
      }

      const lines: string[] = [
        `**BUILD ANALYSIS — ${ctx.buildName}**`,
        `Vehicle: ${ctx.vehicleName}`,
        '',
        '─── BUDGET OVERVIEW ───',
        `Budget: **${fmt(ctx.budget)}** · Spent: **${fmt(ctx.total)}** · Remaining: **${fmt(ctx.remaining)}**`,
        `Usage: **${ctx.pctUsed}%**${ctx.isOverBudget ? ' ⚠️ OVER BUDGET' : ctx.pctUsed > 85 ? ' — approaching limit' : ' — healthy headroom'}`,
        '',
        '─── CATEGORIES PRESENT ───',
      ]

      if (ctx.categories.length > 0) {
        ctx.categories.forEach(c => lines.push(`✓ ${c}`))
      } else {
        lines.push('None yet — add gear in the Build Planner')
      }

      if (ctx.missing.length > 0) {
        lines.push('', '─── GAPS DETECTED ───')
        ctx.missing.forEach(c => lines.push(`⚠ Missing: **${c}**`))
        lines.push('')
        lines.push('Priority recommendation: address **Recovery** first — it\'s a safety-critical gap.')
      }

      lines.push('', 'Want me to suggest specific products for any gap, or find installers for your current build?')
      return lines.join('\n')
    }

    if (token === '__INSTALLER_RECO__') {
      if (!ctx.hasVehicle || ctx.itemCount === 0) {
        return 'I can match you with BŌRYKU network installers based on your build. Add gear in the **Build Planner** first and I\'ll recommend the exact installer categories you need.'
      }

      const CAT_TO_SERVICE: Record<string, string> = {
        'Suspension':       'Suspension Specialist',
        'Wheels & Tires':   'Tire & Wheel Shop',
        'Roof Racks':       'Accessories Installer',
        'Rooftop Tents':    'RTT Installer',
        'Lighting':         'Lighting & Electrical',
        'Electrical':       'Electrical Systems Specialist',
        'Armor & Protection':'Armor & Fabrication Shop',
        'Recovery':         'Off-Road Accessories Shop',
      }

      const needed = ctx.categories
        .map(c => CAT_TO_SERVICE[c])
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i)

      const lines = [
        `**INSTALLER MATCH — ${ctx.buildName}**`,
        '',
        'Based on your current build, you need:',
        '',
        ...needed.map(s => `• **${s}`),
        '',
        'Head to the **Installers** step in your Build Planner — I\'ve pre-matched shops based on your gear categories.',
        '',
        ctx.categories.some(c => ['Suspension', 'Armor & Protection'].includes(c))
          ? '**Installation complexity: MODERATE–HIGH.** Suspension and armor work should be done by a certified shop.'
          : '**Installation complexity: MODERATE.** Most of your items can be installed by a general off-road accessories shop.',
      ]
      return lines.join('\n')
    }

    return FALLBACK[Math.floor(Math.random() * FALLBACK.length)]
  }

  // ── RECON flow handler ───────────────────────────────────────────────────────
  function handleReconInput(text: string): boolean {
    if (mode !== 'recon') return false

    const t = text.trim()

    if (reconStep === 'vehicle') {
      // Accept "yes" to use current vehicle
      const useExisting = /^(yes|yeah|yep|use.*current|same rig)/i.test(t) && ctx.hasVehicle
      const vehicle = useExisting ? ctx.vehicleName! : t

      setReconData(d => ({ ...d, vehicle }))
      setReconStep('mission')

      const missions: MissionId[] = ['OVERLAND','EXPEDITION','CAMPING','TACTICAL','RECOVERY','WORK TRUCK','DAILY ADVENTURE']
      pushBot(
        `Rig confirmed: **${vehicle}**\n\n**Step 2 of 3 — What\'s the primary mission?**\nSelect one or type it out:`,
        missions,
      )
      return true
    }

    if (reconStep === 'mission') {
      const missions = Object.keys(MISSION_ALLOC)
      const found = missions.find(m =>
        t.toUpperCase().includes(m.toUpperCase()) ||
        m.toUpperCase().includes(t.toUpperCase().split(/\s+/)[0])
      )
      const mission = found ?? t.toUpperCase()

      setReconData(d => ({ ...d, mission }))
      setReconStep('budget')
      pushBot(
        `Mission set: **${mission}**\n\n**Step 3 of 3 — What\'s your total build budget?**\nType a dollar amount — e.g. "12000" or "$15,000"`,
        ['$5,000', '$10,000', '$15,000', '$25,000'],
      )
      return true
    }

    if (reconStep === 'budget') {
      const num = parseFloat(t.replace(/[$,k]/gi, (m) => m.toLowerCase() === 'k' ? '000' : ''))
      if (isNaN(num) || num < 500) {
        pushBot('I need a valid budget amount. Try: "$12,000" or just "12000"')
        return true
      }

      const vehicle = reconData.vehicle ?? ctx.vehicleName ?? 'your rig'
      const mission = reconData.mission ?? 'OVERLAND'

      setReconData(d => ({ ...d, budget: num }))
      setReconStep('complete')
      setSuggestions([])

      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        const plan = generateReconPlan(vehicle, mission, num)
        pushBot(plan, [
          'Deep-dive suspension options',
          'Suggest specific products',
          'Find installers for this build',
          'Start a new RECON',
        ])
      }, 1400)

      return true
    }

    if (reconStep === 'complete') {
      if (/new recon|restart|different/i.test(t)) {
        setReconStep('vehicle')
        setReconData({})
        pushBot(
          'Starting fresh RECON.\n\n**Step 1 of 3 — What\'s your rig?**\nYear · Make · Model · Trim',
          ctx.hasVehicle ? ['Yes, use my current vehicle', 'Use a different vehicle'] : [],
        )
        return true
      }
      return false // Fall through to normal response engine
    }

    return false
  }

  // ── Main send handler ────────────────────────────────────────────────────────
  const send = useCallback(async (text: string) => {
    const t = text.trim()
    if (!t || typing) return

    setMessages(m => [...m, { id: `u${Date.now()}`, role: 'user', content: t, ts: new Date() }])
    setInput('')
    setSuggestions([])

    // RECON mode flow
    if (handleReconInput(t)) return

    setTyping(true)
    await new Promise(r => setTimeout(r, 700 + Math.random() * 800))

    let reply = await getPatternResponse(t)

    // Resolve special tokens (build-context-aware)
    if (reply && reply.startsWith('__')) {
      reply = resolveSpecialToken(reply)
    }

    // Check for RECON trigger in chat mode
    if (!reply && /\b(recon mode|start recon|build plan|spec.*build)\b/i.test(t)) {
      switchMode('recon')
      setTyping(false)
      return
    }

    if (!reply) reply = FALLBACK[Math.floor(Math.random() * FALLBACK.length)]

    setTyping(false)
    setMessages(m => [...m, { id: `b${Date.now()}`, role: 'bot', content: reply!, ts: new Date() }])
    if (!open) setUnread(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typing, open, mode, reconStep, reconData, ctx])

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  function clearConversation() {
    setMessages([])
    setReconStep('idle')
    setReconData({})
    setSuggestions([])
  }

  const isRecon = mode === 'recon'

  return (
    <>
      {/* ── Chat panel ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="bot-panel"
            key="bot-panel"
            initial={{ opacity: 0, scale: 0.85, y: 18, originX: '100%', originY: '100%' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 18 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: 'calc(var(--status-h) + 82px)',
              right: 24,
              width: 390, height: 580,
              zIndex: 350,
              display: 'flex', flexDirection: 'column',
              background: 'linear-gradient(168deg, #070404 0%, #0c0808 55%, #0a0a0d 100%)',
              border: `1px solid ${isRecon ? 'rgba(255,200,87,0.28)' : 'rgba(255,85,31,0.22)'}`,
              borderRadius: 12, overflow: 'hidden',
              boxShadow: [
                '0 0 0 1px rgba(255,85,31,0.06)',
                '0 28px 80px rgba(0,0,0,0.82)',
                isRecon ? '0 0 60px rgba(255,200,87,0.07)' : '0 0 55px rgba(255,85,31,0.06)',
              ].join(','),
              transition: 'border-color 0.30s, box-shadow 0.30s',
            }}
          >
            {/* Top edge glow */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: isRecon
                ? 'linear-gradient(90deg,transparent,rgba(255,200,87,0.60) 50%,transparent)'
                : 'linear-gradient(90deg,transparent,rgba(255,85,31,0.55) 50%,transparent)',
              pointerEvents: 'none', transition: 'background 0.30s',
            }} />

            {/* Interior bloom */}
            <div style={{
              position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
              width: 240, height: 120, borderRadius: '50%',
              background: isRecon
                ? 'radial-gradient(ellipse,rgba(255,200,87,0.05) 0%,transparent 70%)'
                : 'radial-gradient(ellipse,rgba(255,85,31,0.06) 0%,transparent 70%)',
              pointerEvents: 'none', transition: 'background 0.30s',
            }} />

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div style={{
              flexShrink: 0, padding: '12px 14px',
              background: 'rgba(255,85,31,0.028)',
              borderBottom: `1px solid ${isRecon ? 'rgba(255,200,87,0.12)' : 'rgba(255,85,31,0.10)'}`,
              display: 'flex', alignItems: 'center', gap: 10,
              position: 'relative', zIndex: 1,
            }}>
              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <motion.div
                  animate={{ boxShadow: isRecon
                    ? ['0 0 8px rgba(255,200,87,0.20)', '0 0 22px rgba(255,200,87,0.55)', '0 0 8px rgba(255,200,87,0.20)']
                    : ['0 0 8px rgba(255,85,31,0.18)', '0 0 20px rgba(255,85,31,0.45)', '0 0 8px rgba(255,85,31,0.18)'],
                  }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: isRecon
                      ? 'linear-gradient(135deg,rgba(255,200,87,0.14),rgba(255,85,31,0.08))'
                      : 'linear-gradient(135deg,rgba(255,85,31,0.16),rgba(255,200,87,0.08))',
                    border: `1.5px solid ${isRecon ? 'rgba(255,200,87,0.50)' : 'rgba(255,85,31,0.42)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.30s',
                  }}
                >
                  <BotHexIcon size={21} color={isRecon ? '#FFC857' : '#FF551F'} />
                </motion.div>
                <div style={{
                  position: 'absolute', bottom: 1, right: 1,
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#22c55e', border: '1.5px solid #070404',
                  boxShadow: '0 0 5px rgba(34,197,94,0.65)',
                }} />
              </div>

              {/* Name + mode */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span className="font-bebas" style={{ fontSize: 17, color: '#fff', letterSpacing: '0.07em', lineHeight: 1 }}>
                    BŌT
                  </span>
                  {/* Mode indicator */}
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '7.5px',
                    color: isRecon ? '#FFC857' : 'rgba(102,255,255,0.82)',
                    border: `1px solid ${isRecon ? 'rgba(255,200,87,0.28)' : 'rgba(102,255,255,0.2)'}`,
                    borderRadius: 2, padding: '1px 5px', letterSpacing: '0.14em',
                    transition: 'all 0.25s',
                  }}>
                    {isRecon ? 'RECON' : 'ONLINE'}
                  </span>
                  {/* Live build indicator */}
                  {ctx.hasVehicle && (
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '7px',
                      color: 'rgba(155,191,106,0.75)',
                      border: '1px solid rgba(155,191,106,0.18)',
                      borderRadius: 2, padding: '1px 5px', letterSpacing: '0.10em',
                    }}>
                      ◉ BUILD LIVE
                    </span>
                  )}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '8px',
                  color: 'rgba(255,255,255,0.28)', letterSpacing: '0.05em', marginTop: 2,
                }}>
                  {isRecon ? 'Build Recon Specialist · Generating allocation...' : 'BŌRYKU Overland Technician · Ready for the next mission.'}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 4, flexShrink: 0, alignItems: 'center' }}>
                {/* RECON mode toggle */}
                <button
                  className="bot-mode-btn"
                  onClick={() => switchMode(isRecon ? 'chat' : 'recon')}
                  title={isRecon ? 'Switch to Chat mode' : 'Switch to RECON mode'}
                  style={{
                    height: 26, padding: '0 8px',
                    background: isRecon ? 'rgba(255,200,87,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isRecon ? 'rgba(255,200,87,0.35)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 3, cursor: 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: '8px',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: isRecon ? '#FFC857' : 'rgba(255,255,255,0.28)',
                    transition: 'all 0.18s', opacity: 0.9,
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {isRecon ? 'CHAT' : 'RECON'}
                </button>

                {hasMsg && (
                  <button
                    onClick={clearConversation}
                    title="Clear conversation"
                    style={{
                      width: 26, height: 26, background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%',
                      color: 'rgba(255,255,255,0.28)', cursor: 'pointer', fontSize: 13,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.14s',
                    }}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, { color: 'rgba(255,85,31,0.75)', borderColor: 'rgba(255,85,31,0.3)' })}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, { color: 'rgba(255,255,255,0.28)', borderColor: 'rgba(255,255,255,0.08)' })}
                  >
                    ↺
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close BŌT"
                  style={{
                    width: 28, height: 28,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.10)', borderRadius: '50%',
                    color: 'rgba(255,255,255,0.38)', cursor: 'pointer', fontSize: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.14s',
                  }}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, { background: 'rgba(255,85,31,0.1)', color: '#fff', borderColor: 'rgba(255,85,31,0.35)' })}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.38)', borderColor: 'rgba(255,255,255,0.10)' })}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ── Messages ────────────────────────────────────────────────── */}
            <div
              className="bot-scroll"
              style={{ flex: 1, overflowY: 'auto', padding: '14px 13px', display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              {!hasMsg ? (
                /* ── Empty state ── */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Welcome bubble */}
                  <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                    <BotAvatar />
                    <div style={{
                      flex: 1, padding: '11px 13px',
                      background: 'rgba(28,28,28,0.9)',
                      border: '1px solid rgba(255,85,31,0.15)',
                      borderLeft: '2px solid rgba(255,85,31,0.5)',
                      borderRadius: '10px 10px 10px 2px',
                    }}>
                      <p className="font-rajdhani" style={{ color: 'rgba(243,237,226,0.88)', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
                        Mission ready. I&apos;m <strong style={{ color: '#FFC857' }}>BŌT</strong> — your BŌRYKU Overland Technician.
                        {ctx.hasVehicle && (
                          <> I can see your <strong style={{ color: '#FFC857' }}>{ctx.vehicleName}</strong> build is active.</>
                        )}
                      </p>
                      <p className="font-rajdhani" style={{ color: 'rgba(243,237,226,0.42)', fontSize: 12, margin: '6px 0 0', lineHeight: 1.5 }}>
                        {isRecon
                          ? 'RECON mode active — I\'ll guide you through a full build allocation.'
                          : 'Ask me anything about gear, builds, budget, or compatibility. Or switch to RECON for a guided build plan.'}
                      </p>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div style={{ paddingLeft: 35 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>
                      QUICK ACTIONS
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {(isRecon ? [
                        `Build me an overland setup under $10,000`,
                        `Recommend a Tacoma build`,
                        ctx.hasVehicle ? `Plan a build for my ${ctx.vehicleName}` : 'Plan a build for a 4Runner',
                      ] : QUICK_ACTIONS).map(p => (
                        <button
                          key={p}
                          className="bot-prompt-btn"
                          onClick={() => send(p)}
                          style={{
                            textAlign: 'left', padding: '7px 11px',
                            background: 'rgba(255,85,31,0.04)',
                            border: '1px solid rgba(255,85,31,0.2)',
                            borderRadius: 6, cursor: 'pointer',
                            fontFamily: 'var(--font-tactical)', fontSize: '11.5px',
                            color: 'rgba(255,85,31,0.8)', letterSpacing: '0.025em',
                            textTransform: 'none', transition: 'all 0.14s',
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    {/* Context-specific page prompts */}
                    {!isRecon && (
                      <>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', color: 'rgba(255,255,255,0.16)', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '14px 0 8px' }}>
                          ON THIS PAGE
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {prompts.filter(p => !QUICK_ACTIONS.includes(p)).map(p => (
                            <button
                              key={p}
                              className="bot-prompt-btn"
                              onClick={() => send(p)}
                              style={{
                                textAlign: 'left', padding: '6px 11px',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 6, cursor: 'pointer',
                                fontFamily: 'var(--font-tactical)', fontSize: '11px',
                                color: 'rgba(255,255,255,0.45)', letterSpacing: '0.025em',
                                textTransform: 'none', transition: 'all 0.14s',
                              }}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                /* ── Message list ── */
                <>
                  {messages.map(msg => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 9 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      style={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        gap: 9, alignItems: 'flex-start',
                      }}
                    >
                      {msg.role === 'bot' && <BotAvatar />}
                      <div style={{
                        maxWidth: '80%', padding: '10px 13px',
                        borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, #FF551F 0%, #FF7A4A 100%)'
                          : 'rgba(28,28,28,0.9)',
                        border: msg.role === 'bot' ? '1px solid rgba(255,85,31,0.15)' : 'none',
                        borderLeft: msg.role === 'bot' ? `2px solid ${isRecon ? 'rgba(255,200,87,0.55)' : 'rgba(255,85,31,0.5)'}` : undefined,
                        color: msg.role === 'user' ? '#0d0704' : 'rgba(243,237,226,0.88)',
                        fontFamily: 'var(--font-tactical)',
                        fontSize: 12.5, lineHeight: 1.62, letterSpacing: '0.02em',
                      }}>
                        <div className="bot-msg-content" dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }} />
                        <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: '8px', opacity: 0.38, letterSpacing: '0.06em' }}>
                          {msg.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {typing && (
                    <motion.div initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'flex-end', gap: 9 }}>
                      <BotAvatar />
                      <div style={{
                        padding: '12px 16px',
                        background: 'rgba(28,28,28,0.9)',
                        border: '1px solid rgba(255,85,31,0.15)',
                        borderLeft: `2px solid ${isRecon ? 'rgba(255,200,87,0.55)' : 'rgba(255,85,31,0.5)'}`,
                        borderRadius: '10px 10px 10px 2px',
                        display: 'flex', gap: 5, alignItems: 'center',
                      }}>
                        {['bot-dot-1','bot-dot-2','bot-dot-3'].map(cls => (
                          <div key={cls} className={cls} style={{ width: 6, height: 6, borderRadius: '50%', background: isRecon ? '#FFC857' : '#FF551F' }} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <div ref={endRef} />
                </>
              )}
            </div>

            {/* ── Suggestion chips (RECON flow / guided responses) ────────── */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div
                  key="suggestions"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    flexShrink: 0,
                    padding: '6px 13px 6px',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex', gap: 6, flexWrap: 'wrap',
                    background: 'rgba(255,200,87,0.015)',
                  }}
                >
                  {suggestions.map(s => (
                    <button
                      key={s}
                      className="bot-suggest-btn"
                      onClick={() => send(s)}
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '0.08em',
                        background: 'rgba(255,200,87,0.05)',
                        border: '1px solid rgba(255,200,87,0.22)',
                        color: 'rgba(255,200,87,0.7)',
                        padding: '5px 10px', borderRadius: 3, cursor: 'pointer',
                        transition: 'all 0.14s', whiteSpace: 'nowrap',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Input area ──────────────────────────────────────────────── */}
            <div style={{
              flexShrink: 0, padding: '10px 13px',
              borderTop: '1px solid rgba(255,85,31,0.09)',
              background: 'rgba(255,85,31,0.018)',
              display: 'flex', gap: 8, alignItems: 'flex-end',
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                disabled={typing}
                placeholder={isRecon ? 'Reply to BŌT…' : 'Message BŌT… (Enter to send)'}
                rows={1}
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isRecon ? 'rgba(255,200,87,0.22)' : 'rgba(255,85,31,0.2)'}`,
                  borderRadius: 6, color: '#fff',
                  fontFamily: 'var(--font-tactical)', fontSize: '12px',
                  padding: '9px 12px', outline: 'none', resize: 'none',
                  letterSpacing: '0.02em', lineHeight: 1.5, boxSizing: 'border-box',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  opacity: typing ? 0.55 : 1,
                }}
                onFocus={e => Object.assign(e.currentTarget.style, { borderColor: isRecon ? 'rgba(255,200,87,0.55)' : 'rgba(255,85,31,0.55)', boxShadow: '0 0 0 3px rgba(255,85,31,0.08)' })}
                onBlur={e => Object.assign(e.currentTarget.style, { borderColor: isRecon ? 'rgba(255,200,87,0.22)' : 'rgba(255,85,31,0.2)', boxShadow: 'none' })}
              />
              <motion.button
                whileHover={input.trim() && !typing ? { scale: 1.07 } : {}}
                whileTap={input.trim() && !typing ? { scale: 0.92 } : {}}
                onClick={() => send(input)}
                disabled={!input.trim() || typing}
                aria-label="Send message"
                style={{
                  width: 38, height: 38, flexShrink: 0, borderRadius: 6, border: 'none',
                  background: input.trim() && !typing
                    ? isRecon
                      ? 'linear-gradient(135deg, #FFC857, #FF551F)'
                      : 'linear-gradient(135deg, #FF551F, #FFC857)'
                    : 'rgba(255,255,255,0.06)',
                  cursor: input.trim() && !typing ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: input.trim() && !typing ? 1 : 0.36,
                  transition: 'background 0.18s, opacity 0.18s',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14.5 8L2 14l2.8-6L2 2l12.5 6z" fill={input.trim() && !typing ? '#0d0704' : '#fff'} opacity="0.85"/>
                </svg>
              </motion.button>
            </div>

            {/* Footer */}
            <div style={{
              flexShrink: 0, padding: '5px 13px 9px', textAlign: 'center',
              fontFamily: 'var(--font-mono)', fontSize: '7.5px',
              color: 'rgba(255,255,255,0.12)', letterSpacing: '0.08em',
            }}>
              BŌT · {isRecon ? 'RECON MODE · Build allocation engine' : 'Vehicle build co-pilot · OpenAI & Claude integration ready'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB ────────────────────────────────────────────────────────────── */}
      <div style={{ position: 'fixed', bottom: 'calc(var(--status-h) + 18px)', right: 24, zIndex: 350 }}>
        {!open && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 56, height: 56, borderRadius: '50%',
            border: '2px solid rgba(255,85,31,0.5)',
            animation: 'bot-ring-pulse 2.6s ease-out infinite',
            pointerEvents: 'none',
          }} />
        )}

        <AnimatePresence>
          {showLabel && !open && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              style={{
                position: 'absolute', right: 'calc(100% + 12px)', top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(6,4,4,0.92)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,85,31,0.28)', borderRadius: 5,
                padding: '6px 12px', whiteSpace: 'nowrap',
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                color: 'rgba(255,85,31,0.85)', letterSpacing: '0.12em',
                pointerEvents: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              ASK BŌT
              <div style={{
                position: 'absolute', right: -5, top: '50%',
                width: 8, height: 8,
                background: 'rgba(6,4,4,0.92)',
                border: '1px solid rgba(255,85,31,0.28)',
                borderLeft: 'none', borderBottom: 'none',
                transform: 'translateY(-50%) rotate(45deg)',
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className={!open ? 'bot-fab-glow' : ''}
          onClick={() => setOpen(p => !p)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          style={{
            width: 56, height: 56, borderRadius: '50%', border: 'none',
            background: open ? 'rgba(8,5,5,0.97)' : 'linear-gradient(135deg, #FF551F 0%, #FFC857 100%)',
            outline: `2px solid ${open ? 'rgba(255,85,31,0.38)' : 'rgba(255,200,87,0.38)'}`,
            outlineOffset: 2,
            cursor: 'pointer', position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label={open ? 'Close BŌT assistant' : 'Open BŌT assistant'}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0, scale: 0.55 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.55 }} transition={{ duration: 0.18 }} style={{ color: '#FF551F', fontSize: 18, lineHeight: 1, display: 'flex', alignItems: 'center' }}>
                ✕
              </motion.span>
            ) : (
              <motion.div key="icon" initial={{ rotate: 90, opacity: 0, scale: 0.55 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: -90, opacity: 0, scale: 0.55 }} transition={{ duration: 0.18 }}>
                <BotHexIcon size={26} color="#000" />
              </motion.div>
            )}
          </AnimatePresence>

          {unread && !open && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              style={{
                position: 'absolute', top: 2, right: 2,
                width: 12, height: 12, borderRadius: '50%',
                background: '#FF551F', border: '2.5px solid #050505',
                pointerEvents: 'none',
              }}
            />
          )}
        </motion.button>
      </div>
    </>
  )
}
