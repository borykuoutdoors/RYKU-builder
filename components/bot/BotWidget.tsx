'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id:      string
  role:    'user' | 'bot'
  content: string
  ts:      Date
}

// ── Context-aware quick prompts ───────────────────────────────────────────────

const CONTEXT_PROMPTS: Record<string, string[]> = {
  '/build':      [
    'Stay within my build budget',
    'Best RTT options under $3k',
    'Recommend a suspension setup',
  ],
  '/gear':       [
    'Compare roof rack options',
    'Find a recovery winch under $1k',
    'What fits a 2025 Toyota 4Runner?',
  ],
  '/installers': [
    'Find installers near Denver',
    'Who specializes in suspension installs?',
    'Get a quote estimate for my build',
  ],
  '/dashboard':  [
    'Review my saved builds',
    'What should I prioritize next?',
    'Track my build budget',
  ],
  '/pricing':    [
    'What does RYKU Pro include?',
    'Is Pro worth it for me?',
    'What\'s the difference between plans?',
  ],
  '/':           [
    'Build me a weekend rig under $10k',
    'Find certified installers near me',
    'Recommend a suspension setup',
    'What RTTs are compatible with my vehicle?',
  ],
}

function getPrompts(pathname: string): string[] {
  const prefixes = Object.keys(CONTEXT_PROMPTS).filter(k => k !== '/')
  const match = prefixes.find(p => pathname.startsWith(p))
  return match ? CONTEXT_PROMPTS[match] : CONTEXT_PROMPTS['/']
}

// ── Mock response engine ──────────────────────────────────────────────────────
// Future: replace implementation with OpenAI / Claude API call

type ResponseEntry = [RegExp, string | string[]]

const RESPONSE_PATTERNS: ResponseEntry[] = [
  [
    /\b(hello|hi|hey|what can you|help me|start|begin)\b/i,
    'Mission ready. I\'m BŌT — your BŌRYKU Overland Technician. Tell me about your rig and build goals and I\'ll dial in the right gear, find installers, and keep you on budget.\n\nWhat\'s the mission?',
  ],
  [
    /budget|spend|afford|cost|price|cheap/i,
    [
      'The highest-impact mods in order: suspension → tires → recovery → lighting → shelter. Prioritize in that sequence and you\'ll get the most capability per dollar.\n\nWhat\'s your ceiling and current build stage?',
      'I can help you stay on budget. What\'s your vehicle platform and how much are you working with? I\'ll map out the best sequence of builds.',
    ],
  ],
  [
    /rtt|rooftop.?tent|roof.?tent|sleeping/i,
    'Found RTT options across the range:\n\n• **Roofnest Condor XL** — $3,200 · Best aerodynamics\n• **iKamper Skycamp 3.0** — $3,800 · Most interior space\n• **ARB Simpson III** — $2,600 · Most durable\n• **Tepui Hybox** — $1,800 · Best entry-level\n\nAll ship within 2 weeks. Want me to filter by vehicle clearance or your budget ceiling?',
  ],
  [
    /suspension|lift|level|coilover|shock|spring|bilstein|emu|king\b/i,
    'For overland use, a 2–3 inch lift with quality coilovers is the sweet spot. Enough clearance for 33–35 inch tires without killing highway manners.\n\nTop options:\n• **Bilstein 5100** — $680 · Best value, bolt-on\n• **Old Man Emu BP-51** — $1,800 · Premium adjustability\n• **King OEM Replacement** — $2,400 · Top tier\n\nWhat\'s your vehicle year, make, and model? I\'ll verify fitment.',
  ],
  [
    /roof.?rack|cargo.?rack|platform.?rack/i,
    'For a clean, modular setup the **Front Runner Slimline II** and **Rhino-Rack Pioneer Platform** are the go-tos. Both support RTT mounting, lighting bars, and recovery gear.\n\nPrice range: $480–$1,200 depending on platform size.\n\nWhat\'s your vehicle? I\'ll confirm compatibility.',
  ],
  [
    /installer|install|shop|mechanic|fabricat|quote/i,
    'I can connect you with certified RYKU network installers. Rocky Mountain Rigs in Denver has a **5.0 rating** and **1-week lead time** — one of the best in the network.\n\nWant me to filter by your location and specific services needed?',
  ],
  [
    /winch|recovery.?gear|snatch|tow/i,
    'For most builds, 9,500–12,000 lb is the practical range. The **Warn Zeon 10-S** and **Warn VR EVO 10-S** are the most proven options.\n\nKey spec: **synthetic rope** over steel cable — safer, lighter, UV-resistant.\n\nBudget range: $800–$1,400.',
  ],
  [
    /light|lighting|led|light.?bar|spot|flood|baja|rigid|kc\b/i,
    'Lighting transforms trail capability at night. For a complete setup: a **30–40 inch curved LED bar** paired with **spot/flood combo pods** covers most scenarios.\n\nTop brands in the RYKU catalog: Baja Designs, KC HiLiTES, Rigid Industries.\n\nAre you mounting on the roof, bumper, or both?',
  ],
  [
    /compatible|fit|work.?with|clearance|match/i,
    'Compatibility depends on your vehicle year, make, and trim. Once you set your build profile, I cross-reference the full RYKU catalog and flag anything that doesn\'t fit — no more surprise returns.\n\nWhat\'s your rig? Year / Make / Model.',
  ],
  [
    /4runner|tacoma|tundra|toyota/i,
    'Toyotas are the most popular build platform in the RYKU network — bulletproof reliability and the deepest aftermarket ecosystem.\n\nThe 4Runner and Tacoma have more RYKU-verified fitments than any other platform.\n\nAre you building for weekenders, expeditions, or daily driver + trail?',
  ],
  [
    /bronco|ford.{0,12}(ranger|f-150|f150|truck)/i,
    'Bronco builds are one of the fastest-growing categories in the RYKU network. Strong aftermarket support especially for 4th gen+ platforms.\n\nAre you working with a 2-door Bronco, 4-door, or Bronco Sport?',
  ],
  [
    /jeep|wrangler|gladiator/i,
    'Jeep Wranglers have the deepest aftermarket of any platform. You have more options than any other build.\n\nCommon build sequence: lift → bumpers → recovery → 35s → lockers.\n\nWhere are you in that sequence?',
  ],
  [
    /pro|subscription|upgrade|plan|pricing/i,
    'RYKU Pro unlocks unlimited builds, PDF export, full installer access, build history, and monthly Supply Drop giveaway entries.\n\n**$12.99/mo** or **$10.39/mo** billed annually — 7-day free trial, no credit card required.\n\nWant me to walk you through what\'s included for your build stage?',
  ],
  [
    /\b(tire|tires|wheel|wheels)\b/i,
    'Tire sizing depends on your lift and clearance. For a 2–3 inch lift, 33–35 inch tires are the proven sweet spot on most platforms — capable off-road without rubbing or gearing compromise.\n\nFor overland, look at: **BFG KO2**, **Toyo Open Country AT3**, or **Falken Wildpeak AT3W**. All solid on-road / off-road balance.',
  ],
  [
    /\b(battery|power|solar|dual.?battery|electrical)\b/i,
    'A solid power system is the backbone of camp life. Start with a **100–200Ah lithium auxiliary battery**, a **DC-DC charger** to charge from alternator, and optionally a **200W+ solar** for extended off-grid.\n\nVictron, Renogy, and REDARC are the RYKU-verified brands for electrical systems.',
  ],
]

const FALLBACK_RESPONSES = [
  'Good question. Tell me more about your vehicle and build goals — I\'ll pull the most relevant options from the RYKU catalog.',
  'Let me cross-reference the RYKU network. What\'s your vehicle platform and current build stage?',
  'I\'m on it. To dial in the right options, what\'s your rig and are you building for weekenders, expeditions, or daily use?',
]

async function getBotResponse(input: string): Promise<string> {
  await new Promise(r => setTimeout(r, 700 + Math.random() * 900))
  for (const [pattern, response] of RESPONSE_PATTERNS) {
    if (pattern.test(input)) {
      return Array.isArray(response)
        ? response[Math.floor(Math.random() * response.length)]
        : response
    }
  }
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
}

// ── Safe markdown-lite renderer ───────────────────────────────────────────────
function renderContent(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
}

// ── Global styles injection ───────────────────────────────────────────────────
const BOT_STYLE_ID = 'ryku-bot-styles'

function injectBotStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(BOT_STYLE_ID)) return
  const el = document.createElement('style')
  el.id = BOT_STYLE_ID
  el.textContent = `
    @keyframes bot-ring-pulse {
      0%   { opacity: 0.6;  transform: translate(-50%, -50%) scale(1); }
      70%  { opacity: 0;    transform: translate(-50%, -50%) scale(2.4); }
      100% { opacity: 0;    transform: translate(-50%, -50%) scale(2.4); }
    }
    @keyframes bot-glow-idle {
      0%, 100% { box-shadow: 0 0 14px rgba(255,170,40,0.50), 0 8px 28px rgba(0,0,0,0.55); }
      50%       { box-shadow: 0 0 34px rgba(255,170,40,0.85), 0 8px 28px rgba(0,0,0,0.55); }
    }
    @keyframes bot-dot {
      0%, 60%, 100% { opacity: 0.18; transform: scale(0.72); }
      30%           { opacity: 1;    transform: scale(1); }
    }
    .bot-fab-glow    { animation: bot-glow-idle 2.8s ease-in-out infinite; }
    .bot-dot-1 { animation: bot-dot 1.35s ease-in-out 0s    infinite; }
    .bot-dot-2 { animation: bot-dot 1.35s ease-in-out 0.18s infinite; }
    .bot-dot-3 { animation: bot-dot 1.35s ease-in-out 0.36s infinite; }
    .bot-msg-content strong { color: #FFC857; font-weight: 600; }
    .bot-scroll::-webkit-scrollbar       { width: 3px; }
    .bot-scroll::-webkit-scrollbar-track { background: transparent; }
    .bot-scroll::-webkit-scrollbar-thumb { background: rgba(255,85,31,0.2); border-radius: 4px; }
    .bot-prompt-btn:hover {
      background: rgba(255,85,31,0.1) !important;
      border-color: rgba(255,85,31,0.45) !important;
      color: #FF6B35 !important;
    }
    @media (max-width: 500px) {
      .bot-panel {
        width: calc(100vw - 20px) !important;
        right: 10px !important;
        bottom: calc(var(--status-h, 46px) + 74px) !important;
        height: min(540px, calc(100dvh - 160px)) !important;
      }
    }
  `
  document.head.appendChild(el)
}

// ── BŌT hex icon SVG ──────────────────────────────────────────────────────────
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

// ── Component ─────────────────────────────────────────────────────────────────
export default function BotWidget() {
  if (typeof window !== 'undefined') injectBotStyles()

  const [open,      setOpen]      = useState(false)
  const [messages,  setMessages]  = useState<Message[]>([])
  const [input,     setInput]     = useState('')
  const [typing,    setTyping]    = useState(false)
  const [unread,    setUnread]    = useState(false)
  const [showLabel, setShowLabel] = useState(false)

  const pathname  = usePathname() ?? '/'
  const endRef    = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)
  const prompts   = getPrompts(pathname)
  const hasMsg    = messages.length > 0

  // Auto-scroll to latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // Focus input when opened, clear unread
  useEffect(() => {
    if (open) {
      setUnread(false)
      setShowLabel(false)
      setTimeout(() => inputRef.current?.focus(), 320)
    }
  }, [open])

  // Show intro label 3 s after mount, hide after 7 s
  useEffect(() => {
    const t1 = setTimeout(() => setShowLabel(true),  3000)
    const t2 = setTimeout(() => setShowLabel(false), 8000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const send = useCallback(async (text: string) => {
    const t = text.trim()
    if (!t || typing) return

    setMessages(m => [...m, { id: `u${Date.now()}`, role: 'user', content: t, ts: new Date() }])
    setInput('')
    setTyping(true)

    const reply = await getBotResponse(t)
    setTyping(false)
    setMessages(m => [...m, { id: `b${Date.now()}`, role: 'bot', content: reply, ts: new Date() }])
    if (!open) setUnread(true)
  }, [typing, open])

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

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
              width: 380, height: 560,
              zIndex: 350,
              display: 'flex', flexDirection: 'column',
              background: 'linear-gradient(168deg, #070404 0%, #0c0808 55%, #0a0a0d 100%)',
              border: '1px solid rgba(255,85,31,0.22)',
              borderRadius: 12, overflow: 'hidden',
              boxShadow: [
                '0 0 0 1px rgba(255,85,31,0.06)',
                '0 28px 80px rgba(0,0,0,0.82)',
                '0 0 55px rgba(255,85,31,0.06)',
              ].join(','),
            }}
          >
            {/* Top edge glow line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg,transparent,rgba(255,85,31,0.55) 50%,transparent)',
              pointerEvents: 'none',
            }} />

            {/* Ambient interior bloom */}
            <div style={{
              position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
              width: 240, height: 120, borderRadius: '50%',
              background: 'radial-gradient(ellipse,rgba(255,85,31,0.06) 0%,transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div style={{
              flexShrink: 0, padding: '13px 14px',
              background: 'rgba(255,85,31,0.032)',
              borderBottom: '1px solid rgba(255,85,31,0.1)',
              display: 'flex', alignItems: 'center', gap: 11,
              position: 'relative', zIndex: 1,
            }}>
              {/* Animated avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <motion.div
                  animate={{ boxShadow: [
                    '0 0 8px rgba(255,85,31,0.18)',
                    '0 0 20px rgba(255,85,31,0.45)',
                    '0 0 8px rgba(255,85,31,0.18)',
                  ]}}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'linear-gradient(135deg,rgba(255,85,31,0.16),rgba(255,200,87,0.08))',
                    border: '1.5px solid rgba(255,85,31,0.42)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <BotHexIcon size={21} />
                </motion.div>
                {/* Online indicator */}
                <div style={{
                  position: 'absolute', bottom: 1, right: 1,
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#22c55e', border: '1.5px solid #070404',
                  boxShadow: '0 0 5px rgba(34,197,94,0.65)',
                }} />
              </div>

              {/* Name + tagline */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span className="font-bebas" style={{ fontSize: 17, color: '#fff', letterSpacing: '0.07em', lineHeight: 1 }}>
                    BŌT
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '7.5px',
                    color: 'rgba(102,255,255,0.82)',
                    border: '1px solid rgba(102,255,255,0.2)', borderRadius: 2,
                    padding: '1px 5px', letterSpacing: '0.14em',
                  }}>
                    ONLINE
                  </span>
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '8px',
                  color: 'rgba(255,255,255,0.28)', letterSpacing: '0.05em', marginTop: 2,
                }}>
                  BŌRYKU Overland Technician · Ready for the next mission.
                </div>
              </div>

              {/* Actions: clear + close */}
              <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                {hasMsg && (
                  <button
                    onClick={() => setMessages([])}
                    title="Clear conversation"
                    aria-label="Clear conversation"
                    style={{
                      width: 26, height: 26, background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%',
                      color: 'rgba(255,255,255,0.28)', cursor: 'pointer', fontSize: 13,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.14s',
                    }}
                    onMouseEnter={e => { Object.assign(e.currentTarget.style, { color: 'rgba(255,85,31,0.75)', borderColor: 'rgba(255,85,31,0.3)' }) }}
                    onMouseLeave={e => { Object.assign(e.currentTarget.style, { color: 'rgba(255,255,255,0.28)', borderColor: 'rgba(255,255,255,0.08)' }) }}
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
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
                    color: 'rgba(255,255,255,0.38)', cursor: 'pointer', fontSize: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.14s',
                  }}
                  onMouseEnter={e => { Object.assign(e.currentTarget.style, { background: 'rgba(255,85,31,0.1)', color: '#fff', borderColor: 'rgba(255,85,31,0.35)' }) }}
                  onMouseLeave={e => { Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.38)', borderColor: 'rgba(255,255,255,0.1)' }) }}
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
                /* ── Welcome / empty state ── */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Greeting bubble */}
                  <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                      background: 'rgba(255,85,31,0.1)', border: '1px solid rgba(255,85,31,0.28)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <BotHexIcon size={14} dim />
                    </div>
                    <div style={{
                      flex: 1, padding: '11px 13px',
                      background: 'rgba(28,28,28,0.9)',
                      border: '1px solid rgba(255,85,31,0.15)',
                      borderLeft: '2px solid rgba(255,85,31,0.5)',
                      borderRadius: '10px 10px 10px 2px',
                    }}>
                      <p className="font-rajdhani" style={{ color: 'rgba(243,237,226,0.88)', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
                        Mission ready. I&apos;m <strong style={{ color: '#FFC857' }}>BŌT</strong> — your
                        BŌRYKU Overland Technician. I can help you build a rig, discover gear, find
                        installers, manage your budget, or navigate the platform.
                      </p>
                      <p className="font-rajdhani" style={{ color: 'rgba(243,237,226,0.42)', fontSize: 12, margin: '7px 0 0', lineHeight: 1.5 }}>
                        What&apos;s the mission?
                      </p>
                    </div>
                  </div>

                  {/* Quick-start prompts */}
                  <div style={{ paddingLeft: 35 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>
                      QUICK START
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {prompts.map(p => (
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
                      {msg.role === 'bot' && (
                        <div style={{
                          width: 26, height: 26, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                          background: 'rgba(255,85,31,0.1)', border: '1px solid rgba(255,85,31,0.28)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <BotHexIcon size={14} dim />
                        </div>
                      )}
                      <div style={{
                        maxWidth: '78%', padding: '10px 13px',
                        borderRadius: msg.role === 'user'
                          ? '10px 10px 2px 10px'
                          : '10px 10px 10px 2px',
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, #FF551F 0%, #FF7A4A 100%)'
                          : 'rgba(28,28,28,0.9)',
                        border: msg.role === 'bot'
                          ? '1px solid rgba(255,85,31,0.15)' : 'none',
                        borderLeft: msg.role === 'bot'
                          ? '2px solid rgba(255,85,31,0.5)' : undefined,
                        color: msg.role === 'user'
                          ? '#0d0704' : 'rgba(243,237,226,0.88)',
                        fontFamily: 'var(--font-tactical)',
                        fontSize: 12.5, lineHeight: 1.62, letterSpacing: '0.02em',
                      }}>
                        <div
                          className="bot-msg-content"
                          dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                        />
                        <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: '8px', opacity: 0.38, letterSpacing: '0.06em' }}>
                          {msg.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {typing && (
                    <motion.div
                      initial={{ opacity: 0, y: 7 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ display: 'flex', alignItems: 'flex-end', gap: 9 }}
                    >
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(255,85,31,0.1)', border: '1px solid rgba(255,85,31,0.28)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <BotHexIcon size={14} dim />
                      </div>
                      <div style={{
                        padding: '12px 16px',
                        background: 'rgba(28,28,28,0.9)',
                        border: '1px solid rgba(255,85,31,0.15)',
                        borderLeft: '2px solid rgba(255,85,31,0.5)',
                        borderRadius: '10px 10px 10px 2px',
                        display: 'flex', gap: 5, alignItems: 'center',
                      }}>
                        <div className="bot-dot-1" style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF551F' }} />
                        <div className="bot-dot-2" style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF551F' }} />
                        <div className="bot-dot-3" style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF551F' }} />
                      </div>
                    </motion.div>
                  )}
                  <div ref={endRef} />
                </>
              )}
            </div>

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
                placeholder="Message BŌT… (Enter to send)"
                rows={1}
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,85,31,0.2)',
                  borderRadius: 6, color: '#fff',
                  fontFamily: 'var(--font-tactical)', fontSize: '12px',
                  padding: '9px 12px', outline: 'none', resize: 'none',
                  letterSpacing: '0.02em', lineHeight: 1.5, boxSizing: 'border-box',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  opacity: typing ? 0.55 : 1,
                }}
                onFocus={e => { Object.assign(e.currentTarget.style, { borderColor: 'rgba(255,85,31,0.55)', boxShadow: '0 0 0 3px rgba(255,85,31,0.08)' }) }}
                onBlur={e => { Object.assign(e.currentTarget.style, { borderColor: 'rgba(255,85,31,0.2)', boxShadow: 'none' }) }}
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
                    ? 'linear-gradient(135deg, #FF551F, #FFC857)'
                    : 'rgba(255,255,255,0.06)',
                  cursor: input.trim() && !typing ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: input.trim() && !typing ? 1 : 0.36,
                  transition: 'background 0.18s, opacity 0.18s',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14.5 8L2 14l2.8-6L2 2l12.5 6z"
                    fill={input.trim() && !typing ? '#0d0704' : '#fff'} opacity="0.85"/>
                </svg>
              </motion.button>
            </div>

            {/* Footer */}
            <div style={{
              flexShrink: 0, padding: '5px 13px 9px', textAlign: 'center',
              fontFamily: 'var(--font-mono)', fontSize: '7.5px',
              color: 'rgba(255,255,255,0.12)', letterSpacing: '0.08em',
            }}>
              BŌT · Mock responses · OpenAI &amp; Claude integration ready
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Action Button ──────────────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(var(--status-h) + 18px)',
        right: 24, zIndex: 350,
      }}>
        {/* Pulsing ring (idle only) */}
        {!open && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 56, height: 56, borderRadius: '50%',
            border: '2px solid rgba(255,85,31,0.5)',
            animation: 'bot-ring-pulse 2.6s ease-out infinite',
            pointerEvents: 'none',
          }} />
        )}

        {/* "Ask BŌT" intro label */}
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
                pointerEvents: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              ASK BŌT
              {/* Arrow */}
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

        {/* FAB button */}
        <motion.button
          className={!open ? 'bot-fab-glow' : ''}
          onClick={() => setOpen(p => !p)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          style={{
            width: 56, height: 56, borderRadius: '50%', border: 'none',
            background: open
              ? 'rgba(8,5,5,0.97)'
              : 'linear-gradient(135deg, #FF551F 0%, #FFC857 100%)',
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
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0, scale: 0.55 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.55 }}
                transition={{ duration: 0.18 }}
                style={{ color: '#FF551F', fontSize: 18, lineHeight: 1, display: 'flex', alignItems: 'center' }}
              >
                ✕
              </motion.span>
            ) : (
              <motion.div
                key="icon"
                initial={{ rotate: 90, opacity: 0, scale: 0.55 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.55 }}
                transition={{ duration: 0.18 }}
              >
                <BotHexIcon size={26} color="#000" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unread notification dot */}
          {unread && !open && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
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
