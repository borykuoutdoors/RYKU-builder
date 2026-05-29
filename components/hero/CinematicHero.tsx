'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import BtnColorful from '@/components/ui/BtnColorful'

// ─── SSR-safe deterministic pseudo-random ────────────────────────────────────
function lcg(s: number) {
  return ((1664525 * s + 1013904223) & 0x7fffffff) / 0x7fffffff
}

// Embers — distributed across full width
const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  id:     i,
  left:   4 + Math.round(lcg(i * 11 + 1) * 88),
  top:    25 + Math.round(lcg(i * 11 + 2) * 550) / 10,
  size:   parseFloat((0.7 + lcg(i * 11 + 3) * 1.4).toFixed(1)),
  op:     parseFloat((0.14 + lcg(i * 11 + 4) * 0.22).toFixed(2)),
  dur:    parseFloat((6 + lcg(i * 11 + 5) * 10).toFixed(1)),
  dly:    parseFloat((lcg(i * 11 + 6) * 10).toFixed(1)),
  driftX: Math.round((lcg(i * 11 + 7) - 0.5) * 36),
  rise:   Math.round(50 + lcg(i * 11 + 8) * 80),
}))

// ─── Geometric shape elements ─────────────────────────────────────────────────
function TechShapes({ show }: { show: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={show ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.6, delay: 1.2 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4, overflow: 'hidden' }}
    >
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cyanLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(102,255,255,0)" />
            <stop offset="50%"  stopColor="rgba(102,255,255,0.24)" />
            <stop offset="100%" stopColor="rgba(102,255,255,0)" />
          </linearGradient>
          <linearGradient id="orangeLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,85,31,0)" />
            <stop offset="50%"  stopColor="rgba(255,85,31,0.20)" />
            <stop offset="100%" stopColor="rgba(255,85,31,0)" />
          </linearGradient>
          <radialGradient id="hexGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(102,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(102,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Large hexagon ring — upper right */}
        <polygon
          points="1200,60 1310,120 1360,230 1310,340 1200,400 1090,340 1040,230 1090,120"
          fill="none" stroke="rgba(102,255,255,0.06)" strokeWidth="1"
        />
        <polygon
          points="1200,100 1290,150 1330,230 1290,310 1200,360 1110,310 1070,230 1110,150"
          fill="none" stroke="rgba(102,255,255,0.04)" strokeWidth="1"
        />
        <polygon
          points="1200,60 1310,120 1360,230 1310,340 1200,400 1090,340 1040,230 1090,120"
          fill="url(#hexGlow)"
        />

        {/* Small hexagon — upper left (balance) */}
        <polygon
          points="240,90 296,122 320,180 296,238 240,270 184,238 160,180 184,122"
          fill="none" stroke="rgba(102,255,255,0.04)" strokeWidth="1"
        />

        {/* Diagonal angular lines — right quadrant */}
        <line x1="900" y1="0" x2="1440" y2="320" stroke="url(#cyanLine)" strokeWidth="0.6" opacity="0.5" />
        <line x1="980" y1="0" x2="1440" y2="260" stroke="url(#cyanLine)" strokeWidth="0.4" opacity="0.3" />
        {/* Mirror — left quadrant */}
        <line x1="540" y1="0" x2="0"    y2="260" stroke="url(#cyanLine)" strokeWidth="0.4" opacity="0.3" />
        <line x1="460" y1="0" x2="0"    y2="320" stroke="url(#cyanLine)" strokeWidth="0.3" opacity="0.2" />

        {/* Horizontal scan lines — full width */}
        {[180, 360, 540, 720].map(y => (
          <line key={y} x1="0" y1={y} x2="1440" y2={y}
            stroke="rgba(102,255,255,0.03)" strokeWidth="0.5" />
        ))}
        {/* Vertical scan lines — symmetric */}
        {[240, 480, 720, 960, 1200].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="900"
            stroke="rgba(102,255,255,0.025)" strokeWidth="0.5" />
        ))}

        {/* Compass ring — right edge */}
        <circle cx="1390" cy="450" r="80" fill="none" stroke="rgba(102,255,255,0.05)" strokeWidth="1" />
        <circle cx="1390" cy="450" r="68" fill="none" stroke="rgba(102,255,255,0.03)" strokeWidth="0.5" />
        {Array.from({ length: 12 }, (_, i) => {
          const angle = i * 30 * Math.PI / 180
          const outer = 78, inner = i % 3 === 0 ? 68 : 72
          return (
            <line key={i}
              x1={1390 + outer * Math.cos(angle)} y1={450 + outer * Math.sin(angle)}
              x2={1390 + inner * Math.cos(angle)} y2={450 + inner * Math.sin(angle)}
              stroke="rgba(102,255,255,0.08)" strokeWidth={i % 3 === 0 ? 1.5 : 0.8}
            />
          )
        })}
        <line x1="1390" y1="374" x2="1390" y2="386" stroke="rgba(255,85,31,0.40)" strokeWidth="2" />

        {/* Small compass ring — left edge (balance) */}
        <circle cx="50" cy="450" r="48" fill="none" stroke="rgba(255,85,31,0.06)" strokeWidth="1" />
        {Array.from({ length: 8 }, (_, i) => {
          const angle = i * 45 * Math.PI / 180
          return (
            <line key={i}
              x1={50 + 46 * Math.cos(angle)} y1={450 + 46 * Math.sin(angle)}
              x2={50 + 38 * Math.cos(angle)} y2={450 + 38 * Math.sin(angle)}
              stroke="rgba(255,85,31,0.09)" strokeWidth={i % 2 === 0 ? 1.2 : 0.7}
            />
          )
        })}
        <line x1="50" y1="406" x2="50" y2="416" stroke="rgba(255,85,31,0.35)" strokeWidth="1.5" />

        {/* Corner bracket accents — lower corners */}
        <polyline points="1100,790 1200,790 1200,870"
          fill="none" stroke="rgba(255,85,31,0.11)" strokeWidth="1.5" />
        <polyline points="340,790 240,790 240,870"
          fill="none" stroke="rgba(255,85,31,0.09)" strokeWidth="1" />

        {/* Thin horizontal accent lines */}
        <line x1="0"    y1="200" x2="340" y2="200" stroke="url(#orangeLine)" strokeWidth="0.5" opacity="0.55" />
        <line x1="1100" y1="200" x2="1440" y2="200" stroke="url(#orangeLine)" strokeWidth="0.5" opacity="0.45" />

        {/* Tactical data dots — lower symmetry */}
        {[[680, 830], [720, 830], [760, 830], [680, 858], [720, 858]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.5"
            fill={i % 2 === 0 ? 'rgba(102,255,255,0.16)' : 'rgba(255,85,31,0.11)'}
          />
        ))}
        {[[760, 830], [760, 858]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.5" fill="rgba(102,255,255,0.10)" />
        ))}
      </svg>
    </motion.div>
  )
}

// ─── Stats data ───────────────────────────────────────────────────────────────
const STATS = [
  { value: '55+',    label: 'Verified Products' },
  { value: '10',     label: 'Vehicle Platforms' },
  { value: '4,200+', label: 'Builds Configured' },
]

interface Props { introComplete: boolean }

export default function CinematicHero({ introComplete }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced    = useReducedMotion()
  const [chaosLive, setChaosLive] = useState(false)

  useEffect(() => {
    if (!introComplete) return
    if (reduced) { setChaosLive(true); return }
    const t = setTimeout(() => setChaosLive(true), 3200)
    return () => clearTimeout(t)
  }, [introComplete, reduced])

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '10%'])

  const show = introComplete

  const fadeUp = (delay = 0) => ({
    initial:    reduced ? false : { opacity: 0, y: 14, filter: 'blur(8px)' },
    animate:    show ? { opacity: 1, y: 0, filter: 'blur(0px)' } : (reduced ? {} : { opacity: 0, y: 14, filter: 'blur(8px)' }),
    transition: { duration: reduced ? 0 : 1.0, ease: [0.2, 0.7, 0.2, 1] as const, delay: reduced ? 0 : delay },
  })

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      style={{
        position:       'relative',
        height:         '100vh',
        minHeight:      600,
        overflow:       'hidden',
        background:     '#050811',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        paddingBottom:  'var(--status-h)',
      }}
      aria-label="Hero"
    >

      {/* ══════════════════════════════════════════════════════════════════
          BACKGROUND — cinematic centered atmosphere
      ══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', inset: '-4%',
          y: bgY, willChange: 'transform',
        }}
      >
        {/* Base — deep navy */}
        <div style={{ position: 'absolute', inset: 0, background: '#050811' }} />

        {/* Center orange radial glow — headline illumination */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 58% 48% at 50% 42%,
              rgba(255,85,31,0.16)  0%,
              rgba(200,55,0,0.07)   48%,
              transparent           75%)
          `,
        }} />

        {/* Inner warm core — tighter, more focused */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 28% 24% at 50% 38%,
              rgba(255,110,30,0.09) 0%,
              transparent           70%)
          `,
        }} />

        {/* Cyan tech accent — upper right */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 40% 48% at 90% 18%,
              rgba(102,255,255,0.05) 0%,
              rgba(40,140,255,0.02)  55%,
              transparent            80%)
          `,
        }} />

        {/* Navy-indigo depth — lower left */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 46% 55% at 8% 88%,
              rgba(20,30,80,0.32) 0%,
              transparent         65%)
          `,
        }} />

        {/* Top/bottom vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            linear-gradient(to bottom,
              rgba(5,8,17,0.65)  0%,
              transparent        22%,
              transparent        70%,
              rgba(5,8,17,0.80)  100%)
          `,
        }} />

        {/* Side vignettes — keep edges dark */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            linear-gradient(to right,
              rgba(5,8,17,0.55)  0%,
              transparent        18%,
              transparent        82%,
              rgba(5,8,17,0.55)  100%)
          `,
        }} />

        {/* Blueprint grid — full width, cyan-tinted */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: [
            'linear-gradient(rgba(102,255,255,0.016) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(102,255,255,0.016) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '120px 120px',
          opacity: 0.60,
          maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
        }} />

        {/* CRT scanlines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.026) 2px,rgba(0,0,0,0.026) 4px)',
        }} />

        {/* Grain texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.07,
          animation: 'grainShift 0.9s steps(6) infinite',
          mixBlendMode: 'overlay',
          zIndex: 9999,
        }} />
      </motion.div>

      {/* ── GEOMETRIC TECH SHAPES ─────────────────────────────────────────── */}
      <TechShapes show={show} />

      {/* ── EMBERS (full-width, low opacity to not compete with headline) ─── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 3 }}>
        {EMBERS.map(p => (
          <motion.div
            key={p.id}
            animate={{
              y:       [0, -p.rise, -p.rise * 1.2],
              x:       [0, p.driftX * 0.3, p.driftX],
              opacity: [0, p.op, p.op * 0.5, 0],
              scale:   [0.1, 1, 0.55, 0],
            }}
            transition={{ duration: p.dur, delay: p.dly, repeat: Infinity, ease: [0.12, 0, 0.88, 1] }}
            style={{
              position: 'absolute',
              left: p.left + '%', top: p.top + '%',
              width: p.size, height: p.size, borderRadius: '50%',
              background: 'rgba(255,90,18,0.9)',
              boxShadow: `0 0 ${p.size * 2.8}px rgba(255,78,16,0.65)`,
            }}
          />
        ))}
      </div>

      {/* ── SCANNING LINE ─────────────────────────────────────────────────── */}
      <motion.div
        animate={{ top: ['0%', '108%'] }}
        transition={{ duration: 11, repeat: Infinity, repeatDelay: 18, ease: 'linear' }}
        style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          pointerEvents: 'none', zIndex: 4,
          background: 'linear-gradient(90deg,transparent,rgba(102,255,255,0.04) 20%,rgba(255,85,31,0.08) 50%,rgba(102,255,255,0.04) 80%,transparent)',
        }}
      />

      {/* ── CORNER BRACKETS ───────────────────────────────────────────────── */}
      {([
        { top: 20,    left: 20,   borderTop:    '1px solid rgba(243,237,226,0.22)', borderLeft:   '1px solid rgba(243,237,226,0.22)' },
        { top: 20,    right: 20,  borderTop:    '1px solid rgba(102,255,255,0.16)', borderRight:  '1px solid rgba(102,255,255,0.16)' },
        { bottom: 54, left: 20,   borderBottom: '1px solid rgba(243,237,226,0.22)', borderLeft:   '1px solid rgba(243,237,226,0.22)' },
        { bottom: 54, right: 20,  borderBottom: '1px solid rgba(102,255,255,0.16)', borderRight:  '1px solid rgba(102,255,255,0.16)' },
      ] as React.CSSProperties[]).map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.65, delay: 2.6 + i * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ position: 'absolute', width: 24, height: 24, pointerEvents: 'none', zIndex: 10, ...s }}
        />
      ))}

      {/* ── LEFT HUD TICKS ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9, delay: 1.6 }}
        style={{
          position: 'absolute', left: 22, top: 0, bottom: 38,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly',
          paddingTop: 70, paddingBottom: 55,
          pointerEvents: 'none', zIndex: 10,
        }}
      >
        {[44, 43, 42, 41, 40].map(lat => (
          <div key={lat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 1, background: 'rgba(243,237,226,0.16)', flexShrink: 0 }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              letterSpacing: '0.25em', color: 'var(--ink-faint)',
              textTransform: 'uppercase',
            }}>
              N {lat}°
            </span>
          </div>
        ))}
      </motion.div>

      {/* ── TOP-RIGHT HUD ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9, delay: 1.7 }}
        style={{
          position: 'absolute', top: 22, right: 22,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
          pointerEvents: 'none', zIndex: 10,
          fontFamily: 'var(--font-mono)', fontSize: '9px',
          letterSpacing: '0.25em', color: 'var(--ink-faint)',
        }}
      >
        <span>44°N · 110°W</span>
        <span>95.8° HDG</span>
        <span style={{ color: 'rgba(102,255,255,0.32)' }}>SYS · ONLINE</span>
      </motion.div>

      {/* ── BOTTOM-RIGHT HUD ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9, delay: 1.8 }}
        style={{
          position: 'absolute', right: 24, bottom: 44,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6,
          pointerEvents: 'none', zIndex: 10,
        }}
        className="hero-hud-br"
      >
        {[
          { label: 'ELEVATION', value: '11,420 FT', orange: false },
          { label: 'HEADING',   value: '284° W',    orange: false },
          { label: 'STATUS',    value: 'ARMED',      orange: true  },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              letterSpacing: '0.25em', color: 'var(--ink-faint)',
              textTransform: 'uppercase',
            }}>
              {row.label}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              letterSpacing: '0.06em',
              color: row.orange ? 'var(--orange)' : 'var(--ink-dim)',
              textShadow: row.orange ? '0 0 10px rgba(255,85,31,0.5)' : 'none',
            }}>
              {row.value}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════
          HERO CONTENT — centered, headline as focal point
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className="hero-text-panel"
        style={{
          position:       'relative',
          zIndex:         10,
          width:          '100%',
          maxWidth:       '900px',
          margin:         '0 auto',
          padding:        '0 clamp(20px, 5vw, 60px)',
          textAlign:      'center',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          pointerEvents:  'none',
        }}
      >

        {/* EYEBROW */}
        <motion.div {...fadeUp(0.6)} style={{ marginBottom: 20, pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <div style={{
              width: 24, height: 1,
              background: 'linear-gradient(to right, rgba(102,255,255,0.12), rgba(102,255,255,0.55))',
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily:    'var(--font-tactical)',
              fontSize:      '11px',
              fontWeight:    700,
              letterSpacing: '0.44em',
              color:         'var(--orange)',
              textTransform: 'uppercase',
            }}>
              BUILD. EQUIP. EXPLORE.
            </span>
            <div style={{
              width: 24, height: 1,
              background: 'linear-gradient(to left, rgba(102,255,255,0.12), rgba(102,255,255,0.55))',
              flexShrink: 0,
            }} />
          </div>
        </motion.div>

        {/* HEADLINE — primary focal point */}
        <div style={{ marginBottom: 28, pointerEvents: 'auto', willChange: 'filter, transform, opacity' }}>
          <h1 style={{
            fontFamily:    'var(--font-display)',
            fontSize:      'clamp(76px, 11vw, 160px)',
            lineHeight:    0.86,
            letterSpacing: '0.01em',
            fontWeight:    700,
            margin:        0,
            textTransform: 'uppercase',
          }}>
            <motion.span
              initial={{ opacity: 0, y: 24, filter: 'blur(16px)' }}
              animate={show
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 24, filter: 'blur(16px)' }
              }
              transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1], delay: 0.9 }}
              style={{
                display:    'block',
                color:      'var(--ink)',
                textShadow: '0 2px 60px rgba(0,0,0,0.95)',
              }}
            >
              CONTROL
            </motion.span>
            <motion.span
              className={`l2${chaosLive ? ' chaos-live' : ''}`}
              initial={{ opacity: 0, y: 24, filter: 'blur(16px)' }}
              animate={chaosLive
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : show
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 24, filter: 'blur(16px)' }
              }
              transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1], delay: 1.2 }}
              style={{
                display:    'block',
                color:      'var(--orange)',
                textShadow: chaosLive
                  ? undefined
                  : '0 0 48px rgba(255,85,31,0.50), 0 0 100px rgba(255,85,31,0.16), 0 2px 60px rgba(0,0,0,0.92)',
              }}
            >
              THE CHAOS
            </motion.span>
          </h1>
        </div>

        {/* SUBHEADLINE */}
        <motion.div {...fadeUp(1.8)} style={{ marginBottom: 40, pointerEvents: 'auto' }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'clamp(14px, 1.6vw, 16px)',
            fontWeight: 300,
            color:      'var(--ink-dim)',
            margin:     '0 auto',
            lineHeight: 1.75,
            maxWidth:   '600px',
          }}>
            Mission-based build planning, premium gear systems, installer discovery, and
            modern overland technology for those who create their own path.
          </p>
        </motion.div>

        {/* CTA BUTTONS */}
        <motion.div
          {...fadeUp(2.2)}
          style={{
            display:        'flex',
            gap:            14,
            flexWrap:       'wrap',
            justifyContent: 'center',
            pointerEvents:  'auto',
            marginBottom:   52,
          }}
        >
          <Link href="/build" data-action="hero-start-build">
            <BtnColorful
              variant="primary"
              size="lg"
              arrow
              style={{ fontSize: '13px', letterSpacing: '0.26em', padding: '20px 44px' }}
            >
              START YOUR BUILD
            </BtnColorful>
          </Link>

          <Link href="/builds" data-action="hero-explore-builds">
            <motion.button
              whileHover={{
                borderColor: 'rgba(102,255,255,0.28)',
                color:       'rgba(243,237,226,0.80)',
                background:  'rgba(102,255,255,0.04)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              style={{
                fontFamily:    'var(--font-tactical)',
                fontWeight:    700,
                fontSize:      '13px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                padding:       '20px 36px',
                background:    'rgba(243,237,226,0.02)',
                border:        '1px solid rgba(243,237,226,0.11)',
                color:         'rgba(243,237,226,0.50)',
                cursor:        'pointer',
                borderRadius:  3,
                display:       'inline-flex',
                alignItems:    'center',
                gap:           9,
                backdropFilter:'blur(12px)',
                transition:    'all 0.15s',
              }}
            >
              EXPLORE BUILDS
              <span style={{ fontSize: '0.85em', opacity: 0.8 }}>→</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* STATS STRIP — centered with dividers */}
        <motion.div
          {...fadeUp(2.6)}
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            flexWrap:       'wrap',
            gap:            0,
            pointerEvents:  'auto',
          }}
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && (
                <div style={{
                  width: 1, height: 38, alignSelf: 'center',
                  background: 'rgba(255,255,255,0.08)',
                  margin: '0 clamp(20px, 3vw, 40px)',
                  flexShrink: 0,
                }} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <span style={{
                  fontFamily:    'var(--font-display)',
                  fontSize:      'clamp(1.15rem, 2.2vw, 1.6rem)',
                  letterSpacing: '0.04em',
                  color:         'var(--orange)',
                  lineHeight:    1,
                }}>
                  {stat.value}
                </span>
                <span style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '0.54rem',
                  letterSpacing: '0.20em',
                  color:         'var(--ink-faint)',
                  textTransform: 'uppercase',
                  whiteSpace:    'nowrap',
                }}>
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── RESPONSIVE ────────────────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 860px) {
          .hero-section {
            align-items: center !important;
          }
          .hero-text-panel {
            padding: 0 clamp(18px, 5vw, 40px) !important;
          }
          .hero-hud-br { display: none !important; }
        }
        @media (max-width: 540px) {
          .hero-text-panel {
            padding: 0 16px !important;
          }
        }
      `}</style>
    </section>
  )
}
