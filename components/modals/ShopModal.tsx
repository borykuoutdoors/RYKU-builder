'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── SSR-safe ambient particles ───────────────────────────────────────── */
function lcg(s: number) { return (((1664525 * s + 1013904223) & 0x7fffffff)) / 0x7fffffff }
const EMBERS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x:      Math.round(lcg(i * 13 + 1) * 100),
  y:      Math.round(lcg(i * 13 + 2) * 100),
  r:      Math.round(2 + lcg(i * 13 + 3) * 3),
  op:     parseFloat((0.05 + lcg(i * 13 + 4) * 0.13).toFixed(2)),
  dur:    parseFloat((8 + lcg(i * 13 + 5) * 14).toFixed(1)),
  dly:    parseFloat((-lcg(i * 13 + 6) * 9).toFixed(1)),
  driftY: Math.round(-(14 + lcg(i * 13 + 7) * 38)),
  driftX: Math.round((lcg(i * 13 + 8) - 0.5) * 20),
}))

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function ShopModal({ isOpen, onClose }: Props) {
  /* Lock body scroll while open */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else        document.body.style.overflow = ''
    return ()  => { document.body.style.overflow = '' }
  }, [isOpen])

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="shop-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: 'easeOut' }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: '#030201',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          {/* ── Grid overlay ───────────────────────────────────────── */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(rgba(255,85,31,0.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,85,31,0.016) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }} />

          {/* ── Scanlines ──────────────────────────────────────────── */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.055) 2px,rgba(0,0,0,0.055) 4px)',
          }} />

          {/* ── Ember particles ────────────────────────────────────── */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {EMBERS.map(p => (
              <motion.div
                key={p.id}
                animate={{ y: [0, p.driftY, 0], x: [0, p.driftX, 0], opacity: [p.op, p.op * 0.15, p.op] }}
                transition={{ duration: p.dur, delay: p.dly, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', left: p.x + '%', top: p.y + '%', width: p.r, height: p.r, borderRadius: '50%', background: 'rgba(255,85,31,0.78)' }}
              />
            ))}
          </div>

          {/* ── Pulsing ambient glow ───────────────────────────────── */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(ellipse at 50% 52%, rgba(255,85,31,0.18) 0%, rgba(255,85,31,0.05) 42%, transparent 68%)',
            }}
          />

          {/* ── Outer corner brackets ─────────────────────────────── */}
          {([
            { top: 28, left: 28, borderTop: '2px solid rgba(255,85,31,0.5)', borderLeft: '2px solid rgba(255,85,31,0.5)' },
            { top: 28, right: 28, borderTop: '2px solid rgba(255,85,31,0.5)', borderRight: '2px solid rgba(255,85,31,0.5)' },
            { bottom: 28, left: 28, borderBottom: '2px solid rgba(255,85,31,0.5)', borderLeft: '2px solid rgba(255,85,31,0.5)' },
            { bottom: 28, right: 28, borderBottom: '2px solid rgba(255,85,31,0.5)', borderRight: '2px solid rgba(255,85,31,0.5)' },
          ] as React.CSSProperties[]).map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 + i * 0.05, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'absolute', width: 38, height: 38, pointerEvents: 'none', ...s }}
            />
          ))}

          {/* ── Animated scan line sweep ───────────────────────────── */}
          <motion.div
            initial={{ top: '0%' }}
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 5, delay: 0.5, ease: 'linear', repeat: Infinity, repeatDelay: 5 }}
            style={{
              position: 'absolute', left: 0, right: 0, height: 2, pointerEvents: 'none',
              background: 'linear-gradient(90deg,transparent,rgba(255,85,31,0.28) 25%,rgba(255,85,31,0.46) 50%,rgba(255,85,31,0.28) 75%,transparent)',
            }}
          />

          {/* ── Close button — top right ───────────────────────────── */}
          <motion.button
            onClick={e => { e.stopPropagation(); onClose() }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileHover={{ color: '#fff', borderColor: 'rgba(255,85,31,0.7)', background: 'rgba(255,85,31,0.1)' }}
            style={{
              position: 'absolute', top: 28, right: 28, zIndex: 1,
              width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent',
              border: '1px solid rgba(255,85,31,0.3)',
              color: 'rgba(255,255,255,0.45)',
              cursor: 'pointer', fontSize: 15,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: 4,
              transition: 'color 0.15s, border-color 0.15s, background 0.15s',
            }}
            aria-label="Close shop preview"
          >
            ✕
          </motion.button>

          {/* ── Center content ─────────────────────────────────────── */}
          <motion.div
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 clamp(20px,5vw,48px)', cursor: 'default' }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 44 }}
            >
              <span style={{ display: 'inline-block', width: 44, height: 1, background: 'linear-gradient(to right, transparent, rgba(255,85,31,0.5))' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,85,31,0.65)', textTransform: 'uppercase' }}>BŌRYKU STORE</span>
              <span style={{ display: 'inline-block', width: 44, height: 1, background: 'linear-gradient(to left, transparent, rgba(255,85,31,0.5))' }} />
            </motion.div>

            {/* "COMING" */}
            <div style={{ overflow: 'hidden', lineHeight: 1 }}>
              <motion.div
                initial={{ y: 130, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.22, duration: 0.88, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.h1
                  animate={{ y: [0, -16, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                  style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: 'clamp(86px, 18vw, 228px)',
                    lineHeight: 0.88,
                    letterSpacing: '0.06em',
                    color: '#fff',
                    margin: 0,
                    textShadow: '0 4px 80px rgba(0,0,0,0.9)',
                  }}
                >
                  COMING
                </motion.h1>
              </motion.div>
            </div>

            {/* "SOON" */}
            <div style={{ overflow: 'hidden', lineHeight: 1 }}>
              <motion.div
                initial={{ y: 130, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.38, duration: 0.88, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.h1
                  animate={{ y: [0, -16, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
                  style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: 'clamp(86px, 18vw, 228px)',
                    lineHeight: 0.88,
                    letterSpacing: '0.06em',
                    color: 'var(--orange)',
                    margin: 0,
                    textShadow: '0 0 130px rgba(255,85,31,0.7), 0 4px 80px rgba(0,0,0,0.9)',
                  }}
                >
                  SOON
                </motion.h1>
              </motion.div>
            </div>

            {/* Horizontal divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.68, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(255,85,31,0.5) 28%, rgba(255,85,31,0.5) 72%, transparent)',
                margin: 'clamp(24px,4vh,44px) 0 clamp(20px,3.5vh,38px)',
                transformOrigin: 'center',
              }}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.78, duration: 0.7 }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(9px,1.3vw,12px)',
                letterSpacing: '0.26em',
                color: 'rgba(255,255,255,0.32)',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              THE BŌRYKU STORE IS BEING ARMED
            </motion.p>

            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.96, duration: 0.7 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginTop: 18 }}
            >
              <motion.span
                animate={{ opacity: [1, 0.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'var(--orange)' }}
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,85,31,0.5)', textTransform: 'uppercase' }}>
                TACTICAL GEAR · APPAREL · ACCESSORIES
              </span>
            </motion.div>

            {/* Dismiss hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1.0 }}
              style={{
                marginTop: 'clamp(40px,7vh,72px)',
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.22em',
                color: 'rgba(255,255,255,0.13)',
                textTransform: 'uppercase',
              }}
            >
              CLICK ANYWHERE · ESC TO CLOSE
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
