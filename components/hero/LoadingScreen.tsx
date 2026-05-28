'use client'

import { useState } from 'react'
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

// ─── Dimensions ──────────────────────────────────────────────────────────────
const BTN  = 214   // outer ring diameter (px)
const DOME = 170   // inner dome diameter (px)
const R    = BTN / 2 - 3  // SVG circle radius

// ─── Phase types ─────────────────────────────────────────────────────────────
type Phase = 'idle' | 'igniting' | 'done'

const STATUS_LABELS: Record<Phase, string> = {
  idle:     'AWAITING IGNITION',
  igniting: 'SYSTEM ONLINE',
  done:     'EXPEDITION READY',
}

interface Props { onComplete: () => void }

export default function LoadingScreen({ onComplete }: Props) {
  const [phase,      setPhase]      = useState<Phase>('idle')
  const [statusText, setStatusText] = useState(STATUS_LABELS.idle)
  const [shaking,    setShaking]    = useState(false)

  function handlePress() {
    if (phase !== 'idle') return

    setPhase('igniting')

    // Minimal screen shake on ignition
    setShaking(true)
    setTimeout(() => setShaking(false), 320)

    // Status text progression
    setTimeout(() => setStatusText(STATUS_LABELS.igniting), 220)
    setTimeout(() => setStatusText(STATUS_LABELS.done),     1150)

    // Trigger exit
    setTimeout(() => setPhase('done'),  1750)
    setTimeout(() => onComplete(),      2050)
  }

  const igniting = phase === 'igniting' || phase === 'done'
  const isGreen  = phase === 'done'

  return (
    <motion.div
      key="loading-screen"
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
      transition={{ duration: 0.90, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#030201',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >

      {/* ── Tactical grid ──────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: [
          'linear-gradient(rgba(255,85,31,0.011) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(255,85,31,0.011) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '62px 62px',
      }} />

      {/* ── Ambient center glow — breathing ────────────────────── */}
      <motion.div
        animate={{ scale: [1, 1.22, 1], opacity: [0.09, 0.20, 0.09] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', width: 680, height: 680,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,85,31,0.12) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Ignition flash ─────────────────────────────────────── */}
      <AnimatePresence>
        {igniting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.30, 0] }}
            transition={{ duration: 0.40, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(ellipse 62% 52% at 50% 50%, rgba(255,85,31,0.38) 0%, transparent 72%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Ambient sparks ─────────────────────────────────────── */}
      {SPARKS.map(p => (
        <motion.div
          key={p.id}
          animate={{ y: [0, p.drift, 0], opacity: [p.op, p.op * 0.08, p.op] }}
          transition={{ duration: p.dur, delay: p.dly, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: p.left + '%', top: p.top + '%',
            width: p.size, height: p.size,
            borderRadius: '50%', background: 'rgba(255,85,31,0.88)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── Subtle screen shake wrapping all content ───────────── */}
      <motion.div
        animate={shaking
          ? { x: [0, -3, 4, -2, 3, -1, 0], y: [0, -1, 2, -1, 0] }
          : { x: 0, y: 0 }
        }
        transition={{ duration: 0.30, ease: 'easeOut' }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >

        {/* ══════════════════════════════════════════════════════════
            PUSH BUTTON
        ══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.20 }}
          style={{ position: 'relative', width: BTN, height: BTN, marginBottom: 30 }}
        >

          {/* Idle breathing outer glow */}
          <motion.div
            animate={igniting
              ? { opacity: 0 }
              : { opacity: [0.10, 0.28, 0.10], scale: [1, 1.07, 1] }
            }
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: -28, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,85,31,0.20) 0%, transparent 70%)',
              filter: 'blur(14px)', pointerEvents: 'none',
            }}
          />

          {/* Ignition glow burst */}
          {igniting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: [0, 0.50, 0.25], scale: [0.85, 1.18, 1.05] }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              style={{
                position: 'absolute', inset: -36, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,95,20,0.32) 0%, transparent 65%)',
                filter: 'blur(18px)', pointerEvents: 'none',
              }}
            />
          )}

          {/* SVG charging arc — rotated so fill starts at 12 o'clock */}
          <svg
            width={BTN} height={BTN}
            viewBox={`0 0 ${BTN} ${BTN}`}
            style={{
              position: 'absolute', inset: 0,
              transform: 'rotate(-90deg)',
              pointerEvents: 'none',
            }}
          >
            <defs>
              <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="rgba(255,85,31,0.50)" />
                <stop offset="40%"  stopColor="rgba(255,155,45,1.00)" />
                <stop offset="75%"  stopColor="rgba(255,220,70,0.90)" />
                <stop offset="100%" stopColor="rgba(255,85,31,0.50)" />
              </linearGradient>
            </defs>
            {/* Dim track ring */}
            <circle
              cx={BTN / 2} cy={BTN / 2} r={R}
              fill="none"
              stroke="rgba(255,85,31,0.08)"
              strokeWidth={1.5}
            />
            {/* Charge arc */}
            <motion.circle
              cx={BTN / 2} cy={BTN / 2} r={R}
              fill="none"
              stroke="url(#arcGrad)"
              strokeWidth={2.8}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={igniting
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 1.55, ease: [0.38, 0, 0.20, 1] }}
            />
          </svg>

          {/* Metallic outer frame */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'radial-gradient(ellipse at 33% 24%, #201510 0%, #0d0906 52%, #050302 100%)',
            border: '1px solid rgba(255,85,31,0.22)',
            boxShadow: [
              'inset 0 3px 16px rgba(0,0,0,0.88)',
              'inset 0 -1px 3px rgba(255,200,100,0.04)',
              '0 0 0 1px rgba(0,0,0,0.75)',
              '0 8px 48px rgba(0,0,0,0.70)',
            ].join(', '),
          }} />

          {/* Cardinal accent marks at 12 / 3 / 6 / 9 o'clock */}
          {[
            { top: 5,              left: '50%',  transform: 'translateX(-50%)' },
            { right: 5,            top: '50%',   transform: 'translateY(-50%)' },
            { bottom: 5,           left: '50%',  transform: 'translateX(-50%)' },
            { left: 5,             top: '50%',   transform: 'translateY(-50%)' },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                position: 'absolute', width: 8, height: 1.5,
                background: 'rgba(255,85,31,0.38)', borderRadius: 1,
                ...s,
              }}
            />
          ))}

          {/* Inner dome — the clickable button */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <motion.button
              onClick={handlePress}
              disabled={phase !== 'idle'}
              whileTap={phase === 'idle' ? { scale: 0.91 } : undefined}
              transition={{ type: 'spring', stiffness: 640, damping: 26 }}
              animate={igniting ? {
                boxShadow: '0 0 52px rgba(255,85,31,0.32), inset 0 6px 24px rgba(0,0,0,0.68)',
              } : {
                boxShadow: 'inset 0 6px 24px rgba(0,0,0,0.75), inset 0 -2px 8px rgba(0,0,0,0.45), 0 2px 24px rgba(0,0,0,0.55)',
              }}
              style={{
                width: DOME, height: DOME,
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at 38% 28%, #2e1e10 0%, #160e08 48%, #060402 100%)',
                border: '1px solid rgba(255,85,31,0.18)',
                cursor: phase === 'idle' ? 'pointer' : 'default',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 2, outline: 'none', userSelect: 'none',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Specular rim highlight */}
              <div style={{
                position: 'absolute', top: 14, left: '18%', right: '18%', height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(255,200,140,0.09), transparent)',
                borderRadius: 1, pointerEvents: 'none',
              }} />

              {/* Active inner orange glow */}
              {igniting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,85,31,0.16) 0%, transparent 72%)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              <span style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 36, letterSpacing: '0.08em',
                color: '#e0d5cb', lineHeight: 1,
                textShadow: '0 1px 5px rgba(0,0,0,0.85)',
              }}>
                START
              </span>
              <span style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 19, letterSpacing: '0.22em',
                color: igniting ? 'rgba(255,135,55,1)' : 'rgba(255,85,31,0.76)',
                lineHeight: 1,
                textShadow: '0 0 16px rgba(255,85,31,0.48)',
                transition: 'color 0.35s ease',
              }}>
                JOURNEY
              </span>
            </motion.button>
          </div>

          {/* Indicator dots — bottom gap between dome and outer ring */}
          <div style={{
            position: 'absolute', bottom: 14, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: 7,
          }}>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={igniting
                  ? { background: '#4ade80', boxShadow: '0 0 7px rgba(74,222,128,0.88)' }
                  : { background: 'rgba(255,255,255,0.12)', boxShadow: 'none' }
                }
                transition={{ delay: 0.10 + i * 0.16, duration: 0.26, ease: 'easeOut' }}
                style={{ width: 5, height: 5, borderRadius: '50%' }}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Status text — animates between phase labels ─────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={statusText}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.26 }}
            style={{
              height: 22, marginBottom: 26,
              display: 'flex', alignItems: 'center', gap: 9,
            }}
          >
            <motion.span
              animate={igniting
                ? { opacity: [1, 0.25, 1], background: isGreen ? '#4ade80' : '#4ade80' }
                : { opacity: [0.42, 1.0, 0.42] }
              }
              transition={{ duration: 1.15, repeat: igniting ? 3 : Infinity, ease: 'easeInOut' }}
              style={{
                display: 'block', width: 4, height: 4, borderRadius: '50%',
                background: igniting ? '#4ade80' : 'rgba(255,85,31,0.55)',
              }}
            />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 8,
              letterSpacing: '0.26em', textTransform: 'uppercase',
              color: igniting ? 'rgba(74,222,128,0.68)' : 'rgba(255,85,31,0.45)',
              transition: 'color 0.30s ease',
            }}>
              {statusText}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom platform label ───────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.20 }}
          transition={{ delay: 0.60, duration: 0.85 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 8.5,
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.20)', margin: 0,
          }}
        >
          PRECISION OVERLAND BUILD PLATFORM
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
