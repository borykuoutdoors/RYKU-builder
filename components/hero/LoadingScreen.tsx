'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── SSR-safe deterministic particles ────────────────────────────────────────
function lcg(s: number) {
  return ((1664525 * s + 1013904223) & 0x7fffffff) / 0x7fffffff
}
const SPARKS = Array.from({ length: 20 }, (_, i) => ({
  id:    i,
  left:  Math.round(lcg(i * 7 + 1) * 100),
  top:   Math.round(lcg(i * 7 + 2) * 100),
  size:  parseFloat((0.9 + lcg(i * 7 + 3) * 2.0).toFixed(1)),
  op:    parseFloat((0.04 + lcg(i * 7 + 4) * 0.10).toFixed(2)),
  dur:   parseFloat((12 + lcg(i * 7 + 5) * 14).toFixed(1)),
  dly:   parseFloat((lcg(i * 7 + 6) * 9).toFixed(1)),
  drift: Math.round(-(22 + lcg(i * 7 + 7) * 48)),
}))

// ─── Hex bolt positions (6 bolts around the outer ring) ──────────────────────
const HEX_BOLTS = Array.from({ length: 6 }, (_, i) => {
  const angle = (i * 60 - 90) * (Math.PI / 180)
  const r = 99  // radius from center of the 214px button
  return {
    x: 107 + r * Math.cos(angle),
    y: 107 + r * Math.sin(angle),
  }
})

// ─── Conic bezel tick marks (every 10°, skipping at bolts) ──────────────────
const TICKS = Array.from({ length: 36 }, (_, i) => {
  const deg = i * 10
  const isBolt = [0, 60, 120, 180, 240, 300].some(b => Math.abs(deg - b) < 12)
  return { deg, isBolt, major: deg % 30 === 0 }
})

const BTN  = 214   // outer ring diameter (px)
const DOME = 162   // inner dome diameter (px)

interface Props { onComplete: () => void }

export default function LoadingScreen({ onComplete }: Props) {
  const [phase,     setPhase]     = useState<'idle' | 'firing' | 'armed' | 'exiting'>('idle')
  const [ledsGreen, setLedsGreen] = useState(false)
  const [shaking,   setShaking]   = useState(false)
  const [flashOn,   setFlashOn]   = useState(false)
  const firedRef = useRef(false)

  function handlePress() {
    if (phase !== 'idle' || firedRef.current) return
    firedRef.current = true

    // t=0: shake + LEDs start (pre-armed = red already shown)
    setPhase('firing')
    setShaking(true)

    // t=180: armed — LEDs red → green
    setTimeout(() => setLedsGreen(true), 180)

    // t=380: flash overlay on
    setTimeout(() => setFlashOn(true), 380)

    // t=520: hero starts revealing, intro begins exit
    setTimeout(() => {
      setPhase('exiting')
      onComplete()
    }, 520)

    // t=700: shake ends
    setTimeout(() => setShaking(false), 700)

    // t=1200: flash off
    setTimeout(() => setFlashOn(false), 1200)
  }

  // Keyboard: Enter or Space fires
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') handlePress()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const firing  = phase === 'firing' || phase === 'armed' || phase === 'exiting'
  const statusText = ledsGreen ? 'SYSTEM ONLINE · EXPEDITION READY' : 'AWAITING IGNITION'

  return (
    <motion.div
      key="loading-screen"
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
      transition={{ duration: 1.48, ease: [0.2, 0.7, 0.2, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'var(--bg)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >

      {/* ── Blueprint grid ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: [
          'linear-gradient(rgba(243,237,226,0.025) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(243,237,226,0.025) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '120px 120px',
        opacity: 0.55,
      }} />

      {/* ── Atmospheric grain ──────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
        opacity: 0.09,
        animation: 'grainShift 0.9s steps(6) infinite',
        mixBlendMode: 'overlay',
      }} />

      {/* ── Ambient breathing glow ─────────────────────────────────── */}
      <motion.div
        animate={{ scale: [1, 1.22, 1], opacity: [0.06, 0.18, 0.06] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', width: 680, height: 680,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(107,122,85,0.14) 0%, rgba(255,85,31,0.06) 50%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Intro corner brackets (54px spec) ──────────────────────── */}
      {([
        { top: 28, left: 28,    borderTop: '1px solid rgba(243,237,226,0.28)', borderLeft: '1px solid rgba(243,237,226,0.28)' },
        { top: 28, right: 28,   borderTop: '1px solid rgba(243,237,226,0.28)', borderRight: '1px solid rgba(243,237,226,0.28)' },
        { bottom: 28, left: 28, borderBottom: '1px solid rgba(243,237,226,0.28)', borderLeft: '1px solid rgba(243,237,226,0.28)' },
        { bottom: 28, right: 28,borderBottom: '1px solid rgba(243,237,226,0.28)', borderRight: '1px solid rgba(243,237,226,0.28)' },
      ] as React.CSSProperties[]).map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: 54, height: 54, pointerEvents: 'none', ...s }} />
      ))}

      {/* ── Chrome telemetry top ───────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 36, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', padding: '0 88px',
        fontFamily: 'var(--font-mono)', fontSize: '9px',
        letterSpacing: '0.25em', color: 'var(--ink-faint)',
        textTransform: 'uppercase', pointerEvents: 'none',
      }}>
        <span>BŌRYKU // OS v4.2</span>
        <span>LAT 44.4280 · LON −110.5885</span>
      </div>

      {/* ── Flash overlay ──────────────────────────────────────────── */}
      <AnimatePresence>
        {flashOn && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0.30] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
              background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,85,31,0.55) 0%, rgba(255,85,31,0.12) 55%, transparent 80%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Ambient sparks ─────────────────────────────────────────── */}
      {SPARKS.map(p => (
        <motion.div
          key={p.id}
          animate={{ y: [0, p.drift, 0], opacity: [p.op, p.op * 0.08, p.op] }}
          transition={{ duration: p.dur, delay: p.dly, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: p.left + '%', top: p.top + '%',
            width: p.size, height: p.size,
            borderRadius: '50%', background: 'rgba(107,122,85,0.88)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── Screen shake wrapper ────────────────────────────────────── */}
      <motion.div
        animate={shaking
          ? { x: [0, -3, 4, -2, 3, -2, 1, -1, 2, -1, 0], y: [0, -1, 2, -2, 1, 0, -1, 0] }
          : { x: 0, y: 0 }
        }
        transition={{ duration: 0.68, ease: [0.36, 0.07, 0.19, 0.97] }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >

        {/* ══════════════════════════════════════════════════════════════
            IGNITION BUTTON — military-green outer ring + 6 hex bolts
            + conic bezel ticks + LED indicators
        ══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.20 }}
          style={{ position: 'relative', width: BTN, height: BTN, marginBottom: 28 }}
        >

          {/* Idle breathing ring glow */}
          <motion.div
            animate={firing
              ? { opacity: 0 }
              : { opacity: [0.12, 0.32, 0.12], scale: [1, 1.08, 1] }
            }
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: -28, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(107,122,85,0.22) 0%, transparent 70%)',
              filter: 'blur(16px)', pointerEvents: 'none',
              animation: firing ? undefined : 'ringBreathe 4s ease-in-out infinite',
            }}
          />

          {/* Ignition glow burst */}
          {firing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: [0, 0.52, 0.22], scale: [0.85, 1.25, 1.08] }}
              transition={{ duration: 0.60, ease: 'easeOut' }}
              style={{
                position: 'absolute', inset: -40, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,85,31,0.28) 0%, rgba(107,122,85,0.18) 45%, transparent 70%)',
                filter: 'blur(20px)', pointerEvents: 'none',
              }}
            />
          )}

          {/* ── Outer ring — military green ─────────────────────────── */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: `
              radial-gradient(circle at 40% 30%,
                rgba(107,122,85,0.22) 0%,
                rgba(50,58,40,0.18)   40%,
                transparent 70%
              )
            `,
            border: '2px solid rgba(107,122,85,0.55)',
            boxShadow: [
              'inset 0 2px 8px rgba(0,0,0,0.70)',
              'inset 0 -1px 3px rgba(107,122,85,0.10)',
              '0 0 0 1px rgba(0,0,0,0.80)',
              '0 12px 56px rgba(0,0,0,0.78)',
              '0 0 32px rgba(107,122,85,0.10)',
            ].join(', '),
          }} />

          {/* ── Conic bezel tick marks ──────────────────────────────── */}
          <svg
            width={BTN} height={BTN}
            viewBox={`0 0 ${BTN} ${BTN}`}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            aria-hidden="true"
          >
            {TICKS.filter(t => !t.isBolt).map(({ deg, major }) => {
              const rad = (deg - 90) * (Math.PI / 180)
              const r1 = 100
              const r2 = major ? 94 : 97
              return (
                <line
                  key={deg}
                  x1={107 + r1 * Math.cos(rad)}
                  y1={107 + r1 * Math.sin(rad)}
                  x2={107 + r2 * Math.cos(rad)}
                  y2={107 + r2 * Math.sin(rad)}
                  stroke={major ? 'rgba(107,122,85,0.70)' : 'rgba(107,122,85,0.35)'}
                  strokeWidth={major ? 1.5 : 0.8}
                />
              )
            })}
            {/* Spinning tick ring overlay */}
            <circle
              cx={BTN / 2} cy={BTN / 2} r={105}
              fill="none"
              stroke="rgba(107,122,85,0.08)"
              strokeWidth={1}
            />
          </svg>

          {/* ── 6 hex bolt positions ────────────────────────────────── */}
          {HEX_BOLTS.map((bolt, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: bolt.x - 5,
                top:  bolt.y - 5,
                width: 10, height: 10,
                borderRadius: 2,
                background: 'rgba(30,28,22,1)',
                border: '1px solid rgba(107,122,85,0.45)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8)',
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}

          {/* ── Inner dome — the clickable button ───────────────────── */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <motion.button
              onClick={handlePress}
              disabled={phase !== 'idle'}
              whileHover={phase === 'idle' ? {
                boxShadow: 'inset 0 2px 0 rgba(255,255,255,.16), inset 0 -28px 40px rgba(0,0,0,.78), inset 0 0 60px rgba(107,122,85,.10), 0 0 50px rgba(255,85,31,.35), 0 0 0 2px #0a0807',
                scale: 1.02,
              } : undefined}
              whileTap={phase === 'idle' ? { scale: 0.93 } : undefined}
              transition={{ type: 'spring', stiffness: 640, damping: 26 }}
              animate={firing ? {
                boxShadow: 'inset 0 2px 0 rgba(255,255,255,.16), inset 0 -28px 40px rgba(0,0,0,.78), inset 0 28px 36px rgba(255,255,255,.06), inset 0 0 0 1px rgba(107,122,85,.35), inset 0 0 0 6px rgba(0,0,0,.55), inset 0 0 60px rgba(107,122,85,.10), 0 24px 50px rgba(0,0,0,.78), 0 0 0 2px #0a0807, 0 0 30px rgba(255,85,31,.10)',
              } : {
                boxShadow: 'inset 0 2px 0 rgba(255,255,255,.16), inset 0 -28px 40px rgba(0,0,0,.78), inset 0 28px 36px rgba(255,255,255,.06), inset 0 0 0 1px rgba(107,122,85,.35), inset 0 0 0 6px rgba(0,0,0,.55), inset 0 0 60px rgba(107,122,85,.10), 0 24px 50px rgba(0,0,0,.78), 0 0 0 2px #0a0807, 0 0 30px rgba(255,85,31,.10)',
              }}
              style={{
                width: DOME, height: DOME,
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at 33% 24%, #201510 0%, #0d0906 52%, #050302 100%)',
                cursor: phase === 'idle' ? 'pointer' : 'default',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 4, outline: 'none', userSelect: 'none',
                position: 'relative', overflow: 'hidden',
                border: 'none',
              }}
              aria-label="Begin the mission"
            >
              {/* Specular rim highlight */}
              <div style={{
                position: 'absolute', top: 16, left: '20%', right: '20%', height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(255,200,140,0.08), transparent)',
                borderRadius: 1, pointerEvents: 'none',
              }} />

              {/* Scanline sweep on fire */}
              {firing && (
                <motion.div
                  initial={{ top: '0%', opacity: 0 }}
                  animate={{ top: ['0%', '100%'], opacity: [0, 0.6, 0] }}
                  transition={{ duration: 1.2, ease: 'linear', delay: 0.1 }}
                  style={{
                    position: 'absolute', left: 0, right: 0, height: 2,
                    background: 'linear-gradient(90deg, transparent, rgba(255,85,31,0.5), transparent)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Active orange tint on fire */}
              {firing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,85,31,0.12) 0%, transparent 72%)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* "BEGIN" — Stardos Stencil 30px, spec: ignition-begin */}
              <span style={{
                fontFamily: 'var(--font-stencil)',
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: '0.22em',
                color: '#ffffff',
                lineHeight: 1,
                textShadow: firing ? '0 0 18px rgba(255,85,31,0.60)' : '0 1px 6px rgba(0,0,0,0.90)',
                transition: 'text-shadow 0.35s ease',
              }}>
                BEGIN
              </span>
              {/* "THE MISSION" microcopy — Chakra Petch 11px */}
              <span style={{
                fontFamily: 'var(--font-tactical)',
                fontSize: 11,
                letterSpacing: '0.28em',
                color: firing ? 'rgba(255,135,55,1)' : 'rgba(107,122,85,0.72)',
                lineHeight: 1,
                textShadow: firing ? '0 0 12px rgba(255,85,31,0.45)' : 'none',
                transition: 'color 0.35s ease',
              }}>
                THE MISSION
              </span>
            </motion.button>
          </div>

          {/* ── 4 LED indicators ────────────────────────────────────── */}
          <div style={{
            position: 'absolute', bottom: 12, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: 8,
          }}>
            {[0, 1, 2, 3].map(i => (
              <motion.div
                key={i}
                animate={ledsGreen
                  ? {
                    background: 'var(--green)',
                    boxShadow: '0 0 8px rgba(155,191,106,1), 0 0 18px rgba(155,191,106,.6)',
                  }
                  : {
                    background: 'var(--red)',
                    boxShadow: '0 0 6px rgba(255,59,46,.95), 0 0 14px rgba(255,59,46,.55)',
                  }
                }
                transition={{ delay: 0.06 * i, duration: 0.40, ease: 'easeOut' }}
                style={{ width: 5, height: 5, borderRadius: '50%' }}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Status / hint text ───────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={statusText}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.26 }}
            style={{
              height: 22, marginBottom: 28,
              display: 'flex', alignItems: 'center', gap: 9,
            }}
          >
            <motion.span
              animate={ledsGreen
                ? { opacity: [1, 0.35, 1], background: 'var(--green)' }
                : { opacity: [0.4, 1.0, 0.4], background: 'var(--red)' }
              }
              transition={{ duration: ledsGreen ? 1.6 : 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                display: 'block', width: 4, height: 4, borderRadius: '50%',
              }}
            />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              letterSpacing: '0.26em', textTransform: 'uppercase',
              color: ledsGreen ? 'rgba(155,191,106,0.68)' : 'rgba(255,59,46,0.45)',
              transition: 'color 0.30s ease',
            }}>
              {statusText}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom platform label ─────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.20 }}
          transition={{ delay: 0.60, duration: 0.85 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'var(--ink-faint)', margin: 0,
          }}
        >
          PRECISION OVERLAND BUILD PLATFORM
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
