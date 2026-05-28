'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

// SSR-safe deterministic particles
function lcg(s: number) {
  return ((1664525 * s + 1013904223) & 0x7fffffff) / 0x7fffffff
}
const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  id:    i,
  left:  Math.round(lcg(i * 7 + 1) * 100),
  top:   Math.round(lcg(i * 7 + 2) * 100),
  size:  parseFloat((1.2 + lcg(i * 7 + 3) * 2.2).toFixed(1)),
  op:    parseFloat((0.05 + lcg(i * 7 + 4) * 0.12).toFixed(2)),
  dur:   parseFloat((10 + lcg(i * 7 + 5) * 14).toFixed(1)),
  dly:   parseFloat((lcg(i * 7 + 6) * 8).toFixed(1)),
  drift: Math.round(-(20 + lcg(i * 7 + 7) * 42)),
}))

const BAR_DURATION = 2.2   // seconds for bar fill
const COMPLETE_MS  = 2850  // ms before onComplete fires

interface Props { onComplete: () => void }

export default function LoadingScreen({ onComplete }: Props) {
  useEffect(() => {
    const t = setTimeout(onComplete, COMPLETE_MS)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <motion.div
      key="loading-screen"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.80, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#030201',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Subtle tactical grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,85,31,0.013) 1px, transparent 1px), linear-gradient(90deg, rgba(255,85,31,0.013) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Ambient center glow — breathing */}
      <motion.div
        animate={{ scale: [1, 1.22, 1], opacity: [0.10, 0.20, 0.10] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: 580, height: 580,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,85,31,0.14) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* Rising sparks */}
      {SPARKS.map(p => (
        <motion.div
          key={p.id}
          animate={{ y: [0, p.drift, 0], opacity: [p.op, p.op * 0.08, p.op] }}
          transition={{ duration: p.dur, delay: p.dly, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: p.left + '%', top: p.top + '%',
            width: p.size, height: p.size,
            borderRadius: '50%', background: 'rgba(255,85,31,0.88)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── Logo ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        style={{ position: 'relative', marginBottom: 60 }}
      >
        {/* Outer diffuse halo */}
        <motion.div
          animate={{ scale: [1, 1.20, 1], opacity: [0.25, 0.52, 0.25] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: -40,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,85,31,0.30) 0%, rgba(255,85,31,0.06) 52%, transparent 72%)',
            filter: 'blur(14px)', pointerEvents: 'none',
          }}
        />
        {/* Inner crisp ring */}
        <motion.div
          animate={{ scale: [1, 1.10, 1], opacity: [0.42, 0.68, 0.42] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: -14,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,85,31,0.18) 0%, transparent 68%)',
            pointerEvents: 'none',
          }}
        />
        {/* Float animation on logo */}
        <motion.div
          animate={{ y: [0, -11, 0] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ryku-logo-icon.png"
            alt="BŌRYKU"
            style={{ width: 152, height: 152, display: 'block', objectFit: 'contain' }}
          />
        </motion.div>
      </motion.div>

      {/* ── Loading bar ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.42, duration: 0.55 }}
        style={{ width: 208, marginBottom: 22 }}
      >
        <div style={{
          position: 'relative', height: 1, overflow: 'hidden',
          background: 'rgba(255,255,255,0.055)', borderRadius: 1,
        }}>
          {/* Fill */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: BAR_DURATION, delay: 0.42, ease: [0.4, 0, 0.20, 1] }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, rgba(255,85,31,0.50) 0%, rgba(255,145,55,0.88) 50%, rgba(255,85,31,0.50) 100%)',
              transformOrigin: 'left center',
              boxShadow: '0 0 10px rgba(255,85,31,0.48)',
            }}
          />
          {/* Leading dot */}
          <motion.div
            initial={{ left: '0%' }}
            animate={{ left: '100%' }}
            transition={{ duration: BAR_DURATION, delay: 0.42, ease: [0.4, 0, 0.20, 1] }}
            style={{
              position: 'absolute', top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 3, height: 3, borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 0 8px rgba(255,135,40,1), 0 0 3px #fff',
            }}
          />
        </div>
      </motion.div>

      {/* ── Platform label ───────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 0.28, y: 0 }}
        transition={{ delay: 0.52, duration: 0.80 }}
        style={{
          fontFamily: 'var(--font-mono)', fontSize: 9,
          letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.28)', margin: 0, marginBottom: 14,
        }}
      >
        PRECISION OVERLAND BUILD PLATFORM
      </motion.p>

      {/* ── Status dot + text ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.82, duration: 0.60 }}
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <motion.span
          animate={{ opacity: [1, 0.10, 1] }}
          transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--orange)', display: 'block' }}
        />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 8,
          letterSpacing: '0.20em', color: 'rgba(255,85,31,0.40)',
          textTransform: 'uppercase',
        }}>
          SYSTEM INITIALIZING
        </span>
      </motion.div>
    </motion.div>
  )
}
