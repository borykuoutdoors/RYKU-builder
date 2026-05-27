'use client'

import { useRef, useCallback, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'

/* ─── Deterministic dust particles (SSR-safe) ───────────────────────────── */
function lcg(s: number) { return (((1664525 * s + 1013904223) & 0x7fffffff)) / 0x7fffffff }
const DUST = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x:      Math.round(lcg(i * 11 + 1) * 100),
  y:      Math.round(lcg(i * 11 + 2) * 100),
  r:      Math.round(2 + lcg(i * 11 + 3) * 3),
  op:     parseFloat((0.07 + lcg(i * 11 + 4) * 0.14).toFixed(2)),
  dur:    parseFloat((9 + lcg(i * 11 + 5) * 14).toFixed(1)),
  dly:    parseFloat((-lcg(i * 11 + 6) * 10).toFixed(1)),
  driftY: Math.round(-(12 + lcg(i * 11 + 7) * 32)),
  driftX: Math.round((lcg(i * 11 + 8) - 0.5) * 24),
  cyan:   lcg(i * 11 + 9) > 0.72,
}))

const SPRING      = { stiffness: 68, damping: 22, mass: 1.0 }
const SPRING_FAST = { stiffness: 115, damping: 27, mass: 0.7 }

/* ─── Glassmorphism tactical card ───────────────────────────────────────── */
function TactCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'rgba(6,5,4,0.86)',
      backdropFilter: 'blur(26px)',
      WebkitBackdropFilter: 'blur(26px)',
      border: '1px solid rgba(255,85,31,0.24)',
      borderRadius: 8,
      padding: '14px 18px',
      fontFamily: 'var(--font-mono)',
      color: '#fff',
      minWidth: 170,
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 10, height: 10, borderTop: '1.5px solid rgba(255,85,31,0.6)', borderLeft: '1.5px solid rgba(255,85,31,0.6)' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderBottom: '1.5px solid rgba(255,85,31,0.3)', borderRight: '1.5px solid rgba(255,85,31,0.3)' }} />
      {children}
    </div>
  )
}

/* ─── Pulsing status dot ────────────────────────────────────────────────── */
function StatusDot({ color = 'var(--orange)' }: { color?: string }) {
  return (
    <motion.span
      animate={{ opacity: [1, 0.25, 1] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }}
    />
  )
}

/* ─── Main component ────────────────────────────────────────────────────── */
export default function InteractiveHero() {
  const sectionRef  = useRef<HTMLElement>(null)
  const [ready, setReady]       = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setReady(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx     = useSpring(mx, SPRING)
  const sy     = useSpring(my, SPRING)
  const sxFast = useSpring(mx, SPRING_FAST)
  const syFast = useSpring(my, SPRING_FAST)

  // Background image — slowest, widest range
  const bgX = useTransform(sx, [-0.5, 0.5], [22, -22])
  const bgY = useTransform(sy, [-0.5, 0.5], [14, -14])

  // Ambient spotlight follows cursor
  const glowLeft = useTransform(sx, [-0.5, 0.5], ['8%', '92%'])
  const glowTop  = useTransform(sy, [-0.5, 0.5], ['8%', '92%'])

  // Text — barely moves (feels anchored)
  const txtX = useTransform(sx, [-0.5, 0.5], [4, -4])
  const txtY = useTransform(sy, [-0.5, 0.5], [2, -2])

  // HUD — subtle counter-drift
  const hudX = useTransform(sx, [-0.5, 0.5], [5, -5])
  const hudY = useTransform(sy, [-0.5, 0.5], [3, -3])

  // Cards — fastest, opposite direction (depth pop)
  const c1X = useTransform(sxFast, [-0.5, 0.5], [-30, 30])
  const c1Y = useTransform(syFast, [-0.5, 0.5], [-20, 20])
  const c2X = useTransform(sxFast, [-0.5, 0.5], [24, -24])
  const c2Y = useTransform(syFast, [-0.5, 0.5], [16, -16])
  const c3X = useTransform(sxFast, [-0.5, 0.5], [-18, 18])
  const c3Y = useTransform(syFast, [-0.5, 0.5], [11, -11])

  // Campfire glow follows mouse
  const fireX = useTransform(sx, [-0.5, 0.5], ['46%', '56%'])

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (isMobile) return
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [mx, my, isMobile])

  const onMouseLeave = useCallback(() => {
    mx.set(0); my.set(0)
  }, [mx, my])

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ position: 'relative', height: '100vh', minHeight: 640, overflow: 'hidden' }}
    >

      {/* ── L0: Dark cinematic base ──────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#0a0603' }} />

      {/* ── L1: Hero background image with parallax ──────────────────── */}
      <motion.div
        style={{ position: 'absolute', inset: '-10%', zIndex: 1, x: bgX, y: bgY, willChange: 'transform' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-vehicle.jpg"
          alt=""
          aria-hidden="true"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 38%', display: 'block' }}
        />
      </motion.div>

      {/* ── L2: Cinematic gradient overlays ──────────────────────────── */}
      {/* Left → right: dark for text, reveals image on right */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(108deg, rgba(3,2,1,0.95) 0%, rgba(3,2,1,0.82) 26%, rgba(3,2,1,0.48) 50%, rgba(3,2,1,0.20) 66%, rgba(3,2,1,0.38) 100%)',
      }} />
      {/* Top & bottom vignettes */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 22%, transparent 64%, rgba(0,0,0,0.96) 100%)',
      }} />
      {/* Warm orange atmosphere (fire light) */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 72% 65%, rgba(255,85,31,0.09) 0%, transparent 52%)',
      }} />

      {/* ── L3: Campfire / orange warmth glow ────────────────────────── */}
      <motion.div
        style={{
          position: 'absolute', zIndex: 3, pointerEvents: 'none',
          bottom: '6%', left: fireX,
          transform: 'translateX(-50%)',
          width: '52%', height: '50%',
          background: 'radial-gradient(ellipse, rgba(255,85,31,0.18) 0%, rgba(255,100,0,0.07) 42%, transparent 68%)',
          filter: 'blur(24px)',
        }}
      />

      {/* ── L4: Subtle grid overlay ───────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,85,31,0.013) 1px,transparent 1px),linear-gradient(90deg,rgba(255,85,31,0.013) 1px,transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      {/* ── L5: Mouse-reactive spotlight ─────────────────────────────── */}
      <motion.div
        style={{
          position: 'absolute', zIndex: 4, pointerEvents: 'none',
          left: glowLeft, top: glowTop,
          width: 900, height: 900,
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(255,85,31,0.075) 0%, rgba(255,85,31,0.025) 38%, transparent 64%)',
          borderRadius: '50%',
        }}
      />

      {/* ── L6: Dust / ember particles ───────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', overflow: 'hidden' }}>
        {DUST.map(p => (
          <motion.div
            key={p.id}
            animate={{ y: [0, p.driftY, 0], x: [0, p.driftX, 0], opacity: [p.op, p.op * 0.2, p.op] }}
            transition={{ duration: p.dur, delay: p.dly, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', left: p.x + '%', top: p.y + '%', width: p.r, height: p.r, borderRadius: '50%', background: p.cyan ? 'rgba(102,255,255,0.6)' : 'rgba(255,85,31,0.72)' }}
          />
        ))}
      </div>

      {/* ── L7: Scanlines ────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.038) 2px,rgba(0,0,0,0.038) 4px)',
      }} />

      {/* ── L8: HUD corners, scan line, GPS, status ──────────────────── */}
      <motion.div style={{ position: 'absolute', inset: 0, zIndex: 7, pointerEvents: 'none', x: hudX, y: hudY }}>
        {([
          { top: 24, left: 24, borderTop: '1.5px solid rgba(255,85,31,0.5)', borderLeft: '1.5px solid rgba(255,85,31,0.5)' },
          { top: 24, right: 24, borderTop: '1.5px solid rgba(255,85,31,0.5)', borderRight: '1.5px solid rgba(255,85,31,0.5)' },
          { bottom: 64, left: 24, borderBottom: '1.5px solid rgba(255,85,31,0.5)', borderLeft: '1.5px solid rgba(255,85,31,0.5)' },
          { bottom: 64, right: 24, borderBottom: '1.5px solid rgba(255,85,31,0.5)', borderRight: '1.5px solid rgba(255,85,31,0.5)' },
        ] as React.CSSProperties[]).map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 2.8 + i * 0.1, duration: 0.6 }}
            style={{ position: 'absolute', width: 26, height: 26, ...s }}
          />
        ))}

        {/* Animated scan line */}
        <motion.div
          initial={{ top: '0%' }}
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 4, delay: 3, ease: 'linear', repeat: Infinity, repeatDelay: 7 }}
          style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,rgba(255,85,31,0.3) 25%,rgba(255,85,31,0.45) 50%,rgba(255,85,31,0.3) 75%,transparent)' }}
        />

        {/* GPS — bottom left */}
        <motion.div
          initial={{ opacity: 0, x: -8 }} animate={ready ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 3.0, duration: 0.7 }}
          style={{ position: 'absolute', bottom: 76, left: 40, lineHeight: 1.9 }}
          className="hud-hide-mobile"
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em' }}>36.7°N / 118.4°W</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,85,31,0.5)', letterSpacing: '0.1em' }}>ELEV 8,412 FT</div>
        </motion.div>

        {/* Status — top right */}
        <motion.div
          initial={{ opacity: 0, x: 8 }} animate={ready ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 3.2, duration: 0.7 }}
          style={{ position: 'absolute', top: 32, right: 72, textAlign: 'right', lineHeight: 2 }}
          className="hud-hide-mobile"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,85,31,0.7)', letterSpacing: '0.12em' }}>
            <StatusDot /> SYSTEMS ARMED
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>BUILD PLATFORM v1.0</div>
        </motion.div>

        {/* Tactical tags — bottom right */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 3.4, duration: 0.7 }}
          style={{ position: 'absolute', bottom: 76, right: 40, textAlign: 'right', lineHeight: 2 }}
          className="hud-hide-mobile"
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(102,255,255,0.45)', letterSpacing: '0.1em' }}>ROOFTOP TENT ✓</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(102,255,255,0.45)', letterSpacing: '0.1em' }}>RECOVERY KIT ✓</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(102,255,255,0.45)', letterSpacing: '0.1em' }}>COMMS ACTIVE ✓</div>
        </motion.div>
      </motion.div>

      {/* ── L9: Text content — centered left ─────────────────────────── */}
      {/* Outer: full-size, flex-centered, pointer-events:none so mouse events pass through to section */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 9, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
        <motion.div
          style={{ padding: '0 clamp(24px,5vw,88px)', x: txtX, y: txtY, pointerEvents: 'auto' }}
          className="hero-text-block"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}
          >
            <span style={{ display: 'inline-block', width: 28, height: 1, background: 'rgba(255,85,31,0.65)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--orange)', textTransform: 'uppercase' }}>RYKU BUILD PLATFORM v1.0</span>
          </motion.div>

          {/* Headline */}
          <div style={{ overflow: 'hidden', marginBottom: 4 }}>
            <motion.h1
              initial={{ y: 80, opacity: 0 }} animate={ready ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.18, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(78px,12vw,162px)', lineHeight: 0.86, letterSpacing: '0.02em', color: '#fff', margin: 0, textShadow: '0 4px 60px rgba(0,0,0,0.85)' }}
            >
              CONTROL
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: 28 }}>
            <motion.h1
              initial={{ y: 80, opacity: 0 }} animate={ready ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(78px,12vw,162px)', lineHeight: 0.86, letterSpacing: '0.02em', color: 'var(--orange)', margin: 0, textShadow: '0 0 100px rgba(255,85,31,0.6)' }}
            >
              THE CHAOS
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: 'var(--font-rajdhani)', fontSize: 'clamp(15px,1.8vw,20px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, maxWidth: 480, margin: 0 }}
          >
            Build the ultimate overland machine with AI-powered compatibility.
            Select vehicle. Choose mission. Configure with precision.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.72, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 40, alignItems: 'center' }}
          >
            <div style={{ position: 'relative' }}>
              <motion.div
                animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                style={{ position: 'absolute', inset: -4, border: '1px solid rgba(255,85,31,0.45)', clipPath: 'polygon(9px 0%,100% 0%,calc(100% - 9px) 100%,0% 100%)', pointerEvents: 'none' }}
              />
              <Link href="/build" className="btn btn-primary btn-lg" data-action="hero-cta-primary">
                START YOUR BUILD
              </Link>
            </div>
            <Link href="/builds" className="btn btn-ghost btn-lg" data-action="hero-cta-secondary">
              EXPLORE BUILDS
            </Link>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 1.0, duration: 0.8 }}
            style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(255,85,31,0.12)' }}
          >
            {['FREE TO USE', 'NO ACCOUNT REQUIRED', '55+ PRODUCTS'].map(label => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── L10: Floating tactical cards — desktop right side ────────── */}

      {/* Card 1: Mission Status — upper right */}
      <motion.div
        style={{ x: c1X, y: c1Y, position: 'absolute', top: '18%', right: 'clamp(40px,6vw,96px)', zIndex: 10 }}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={ready ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 1.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="float-card-hide-mobile"
      >
        <TactCard>
          <div style={{ fontSize: 8, letterSpacing: '0.14em', color: 'rgba(255,85,31,0.65)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            <StatusDot /> MISSION ACTIVE
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.06em', marginBottom: 4 }}>EXPEDITION</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.06em' }}>ALPINE OVERLAND</div>
          <div style={{ marginTop: 10, height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 1, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }} animate={ready ? { width: '78%' } : {}}
              transition={{ delay: 1.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: '100%', background: 'var(--orange)', borderRadius: 1 }}
            />
          </div>
          <div style={{ fontSize: 8, color: 'rgba(255,85,31,0.45)', marginTop: 4, letterSpacing: '0.1em' }}>78% CONFIGURED</div>
        </TactCard>
      </motion.div>

      {/* Card 2: Systems Check — center right */}
      <motion.div
        style={{ x: c2X, y: c2Y, position: 'absolute', top: '40%', right: 'clamp(110px,12vw,200px)', zIndex: 10 }}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={ready ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 1.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="float-card-hide-mobile"
      >
        <TactCard style={{ minWidth: 158 }}>
          <div style={{ fontSize: 8, letterSpacing: '0.14em', color: 'rgba(255,85,31,0.55)', marginBottom: 9 }}>SYSTEMS CHECK</div>
          {[['SUSPENSION', true], ['RECOVERY RIG', true], ['COMMS', true], ['ROOF TENT', false]].map(([label, ok]) => (
            <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
              <span style={{ fontSize: 9, color: ok ? '#4ade80' : 'rgba(255,255,255,0.25)' }}>{ok ? '✓' : '○'}</span>
              <span style={{ fontSize: 9, color: ok ? 'rgba(255,255,255,0.62)' : 'rgba(255,255,255,0.22)', letterSpacing: '0.08em' }}>{label as string}</span>
            </div>
          ))}
        </TactCard>
      </motion.div>

      {/* Card 3: Active Build — lower right */}
      <motion.div
        style={{ x: c3X, y: c3Y, position: 'absolute', top: '60%', right: 'clamp(40px,6vw,96px)', zIndex: 10 }}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={ready ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 1.65, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="float-card-hide-mobile"
      >
        <TactCard style={{ minWidth: 180 }}>
          <div style={{ fontSize: 8, letterSpacing: '0.14em', color: 'rgba(255,85,31,0.55)', marginBottom: 6 }}>ACTIVE BUILD</div>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 28, color: '#fff', lineHeight: 1, letterSpacing: '0.04em' }}>$38,200</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 3, letterSpacing: '0.06em' }}>TOYOTA 4RUNNER · 14 ITEMS</div>
          <div style={{ marginTop: 10, height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 1, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }} animate={ready ? { width: '82%' } : {}}
              transition={{ delay: 2.0, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: '100%', background: 'linear-gradient(90deg, var(--orange), #ff8c4a)', borderRadius: 1 }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>
            <span>BUDGET</span>
            <span style={{ color: '#4ade80' }}>+$8,400 REMAINING</span>
          </div>
        </TactCard>
      </motion.div>

      {/* ── Scroll indicator ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.8, duration: 0.8 }}
        style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none' }}
      >
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ repeat: Infinity, duration: 1.7, ease: 'easeInOut' }}
          style={{ width: 20, height: 32, border: '1.5px solid rgba(255,85,31,0.3)', borderRadius: 10, display: 'flex', justifyContent: 'center', paddingTop: 6 }}
        >
          <div style={{ width: 3, height: 7, background: 'var(--orange)', borderRadius: 2, opacity: 0.65 }} />
        </motion.div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>SCROLL</span>
      </motion.div>

      {/* Bottom page-transition fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 140, background: 'linear-gradient(to bottom, transparent, #0A0A0A)', pointerEvents: 'none', zIndex: 8 }} />

      {/* Responsive CSS */}
      <style>{`
        .hero-text-block { max-width: 620px; }
        .float-card-hide-mobile { display: block; }
        .hud-hide-mobile { display: block; }

        @media (max-width: 900px) {
          .float-card-hide-mobile { display: none !important; }
        }
        @media (max-width: 640px) {
          .hud-hide-mobile { display: none !important; }
          .hero-text-block { max-width: 100% !important; }
        }
      `}</style>
    </section>
  )
}
