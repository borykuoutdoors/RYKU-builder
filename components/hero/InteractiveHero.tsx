'use client'

import { useRef, useCallback, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion'

/* ─── Deterministic dust particles (SSR-safe) ───────────────────────────── */
function lcg(s: number) { return (((1664525 * s + 1013904223) & 0x7fffffff)) / 0x7fffffff }
const DUST = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x:    Math.round(lcg(i * 11 + 1) * 100),
  y:    Math.round(lcg(i * 11 + 2) * 100),
  r:    Math.round(2 + lcg(i * 11 + 3) * 4),
  op:   parseFloat((0.15 + lcg(i * 11 + 4) * 0.25).toFixed(2)),
  dur:  parseFloat((6  + lcg(i * 11 + 5) * 10).toFixed(1)),
  dly:  parseFloat((-lcg(i * 11 + 6) * 8).toFixed(1)),
  driftY: Math.round(-(20 + lcg(i * 11 + 7) * 40)),
  driftX: Math.round((lcg(i * 11 + 8) - 0.5) * 30),
  cyan: lcg(i * 11 + 9) > 0.7,
}))

/* ─── Spring config ─────────────────────────────────────────────────────── */
const SPRING = { stiffness: 82, damping: 26, mass: 0.9 }
const SPRING_FAST = { stiffness: 140, damping: 32, mass: 0.6 }

/* ─── Glassmorphism tactical card ───────────────────────────────────────── */
function TactCard({
  children, style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div style={{
      background: 'rgba(6,5,4,0.78)',
      backdropFilter: 'blur(22px)',
      WebkitBackdropFilter: 'blur(22px)',
      border: '1px solid rgba(255,85,31,0.22)',
      borderRadius: 8,
      padding: '12px 16px',
      fontFamily: 'var(--font-mono)',
      color: '#fff',
      minWidth: 170,
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}>
      {/* top-left accent corner */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 10, height: 10, borderTop: '1.5px solid rgba(255,85,31,0.55)', borderLeft: '1.5px solid rgba(255,85,31,0.55)' }} />
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
  const [hovering, setHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Disable 3D effects on mobile
  useEffect(() => {
    setReady(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  // Raw mouse position, -0.5 → +0.5
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  // Spring-smoothed
  const sx = useSpring(mx, SPRING)
  const sy = useSpring(my, SPRING)
  const sxFast = useSpring(mx, SPRING_FAST)
  const syFast = useSpring(my, SPRING_FAST)

  /* Layer transforms -------------------------------------------------- */

  // Background: slowest drift
  const bgX = useTransform(sx, [-0.5, 0.5], [12, -12])
  const bgY = useTransform(sy, [-0.5, 0.5], [8, -8])

  // Ambient spotlight follows mouse (stays in screen-space)
  const glowLeft = useTransform(sx, [-0.5, 0.5], ['15%', '85%'])
  const glowTop  = useTransform(sy, [-0.5, 0.5], ['15%', '85%'])

  // Vehicle stage: medium shift + 3D tilt
  const vehX    = useTransform(sx, [-0.5, 0.5], [14, -14])
  const vehY    = useTransform(sy, [-0.5, 0.5], [10, -10])
  const vehRotY = useTransform(sx, [-0.5, 0.5], [-7, 7])
  const vehRotX = useTransform(sy, [-0.5, 0.5], [5, -5])

  // Reflection glow beneath vehicle — stretches with tilt
  const reflW = useTransform(sx, [-0.5, 0.5], ['55%', '75%'])

  // Floating cards: fastest, opposite to background (depth pop)
  const c1X = useTransform(sxFast, [-0.5, 0.5], [-24, 24])
  const c1Y = useTransform(syFast, [-0.5, 0.5], [-16, 16])
  const c2X = useTransform(sxFast, [-0.5, 0.5], [20, -20])
  const c2Y = useTransform(syFast, [-0.5, 0.5], [14, -14])
  const c3X = useTransform(sxFast, [-0.5, 0.5], [-16, 16])
  const c3Y = useTransform(syFast, [-0.5, 0.5], [10, -10])

  // HUD corners: subtle counter-move
  const hudX = useTransform(sx, [-0.5, 0.5], [5, -5])
  const hudY = useTransform(sy, [-0.5, 0.5], [3, -3])

  // Text: very subtle (almost static, feels anchored)
  const txtX = useTransform(sx, [-0.5, 0.5], [4, -4])
  const txtY = useTransform(sy, [-0.5, 0.5], [3, -3])

  /* Handlers ---------------------------------------------------------- */
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (isMobile) return
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
    setHovering(true)
  }, [mx, my, isMobile])

  const onMouseLeave = useCallback(() => {
    mx.set(0); my.set(0)
    setHovering(false)
  }, [mx, my])

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 600,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        cursor: hovering ? 'none' : 'default',
      }}
    >
      {/* ── LAYER 0: Dark cinematic base ──────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'linear-gradient(160deg, #030201 0%, #0a0805 40%, #0c0a04 70%, #080808 100%)',
      }} />

      {/* ── LAYER 0: Grid overlay ─────────────────────────────────────── */}
      <motion.div
        style={{ x: bgX, y: bgY, position: 'absolute', inset: '-5%', zIndex: 1 }}
      >
        <div style={{
          width: '110%', height: '110%',
          backgroundImage: 'linear-gradient(rgba(255,85,31,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,85,31,0.018) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        }} />
      </motion.div>

      {/* ── LAYER 1: Mouse-reactive spotlight ─────────────────────────── */}
      <motion.div
        style={{
          position: 'absolute', zIndex: 2, pointerEvents: 'none',
          left: glowLeft, top: glowTop,
          width: 700, height: 700,
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(255,85,31,0.11) 0%, rgba(255,85,31,0.04) 35%, transparent 68%)',
          borderRadius: '50%',
        }}
      />

      {/* ── LAYER 2: Floating dust particles ──────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}>
        {DUST.map(p => (
          <motion.div
            key={p.id}
            animate={{ y: [0, p.driftY, 0], x: [0, p.driftX, 0], opacity: [p.op, p.op * 0.3, p.op] }}
            transition={{ duration: p.dur, delay: p.dly, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: p.x + '%', top: p.y + '%',
              width: p.r, height: p.r,
              borderRadius: '50%',
              background: p.cyan ? 'rgba(102,255,255,0.7)' : 'rgba(255,85,31,0.8)',
            }}
          />
        ))}
      </div>

      {/* ── LAYER 3: Scanlines ────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.045) 2px,rgba(0,0,0,0.045) 4px)',
      }} />

      {/* ── LAYER 4: HUD corners & scan line ──────────────────────────── */}
      <motion.div
        style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', x: hudX, y: hudY }}
      >
        {/* Corners */}
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
          transition={{ duration: 4, delay: 3, ease: 'linear', repeat: Infinity, repeatDelay: 6 }}
          style={{
            position: 'absolute', left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg,transparent 0%,rgba(255,85,31,0.28) 25%,rgba(255,85,31,0.42) 50%,rgba(255,85,31,0.28) 75%,transparent 100%)',
          }}
        />

        {/* GPS label — bottom left */}
        <motion.div
          initial={{ opacity: 0, x: -8 }} animate={ready ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 3.2, duration: 0.7 }}
          style={{ position: 'absolute', bottom: 76, left: 40, lineHeight: 1.9 }}
          className="hud-hide-mobile"
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em' }}>36.7°N / 118.4°W</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,85,31,0.5)', letterSpacing: '0.1em' }}>ELEV 8,412 FT</div>
        </motion.div>

        {/* Status — top right */}
        <motion.div
          initial={{ opacity: 0, x: 8 }} animate={ready ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 3.4, duration: 0.7 }}
          style={{ position: 'absolute', top: 32, right: 72, textAlign: 'right', lineHeight: 2 }}
          className="hud-hide-mobile"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,85,31,0.7)', letterSpacing: '0.12em' }}>
            <StatusDot />
            SYSTEMS ARMED
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>BUILD PLATFORM v1.0</div>
        </motion.div>
      </motion.div>

      {/* ── LAYER 5: Main content grid ────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 5,
        width: '100%', maxWidth: 1280,
        margin: '0 auto',
        padding: '0 clamp(20px,5vw,56px)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(24px,4vw,64px)',
        alignItems: 'center',
      }}
      className="hero-grid"
      >

        {/* ── LEFT: Text content ──────────────────────────────────────── */}
        <motion.div style={{ x: txtX, y: txtY, position: 'relative', zIndex: 2 }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}
          >
            <span style={{ display: 'inline-block', width: 28, height: 1, background: 'rgba(255,85,31,0.5)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--orange)', textTransform: 'uppercase' }}>RYKU BUILD PLATFORM v1.0</span>
          </motion.div>

          {/* Headline */}
          <div style={{ overflow: 'hidden', marginBottom: 4 }}>
            <motion.h1
              initial={{ y: 80, opacity: 0 }} animate={ready ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.18, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(68px,11vw,140px)', lineHeight: 0.86, letterSpacing: '0.02em', color: '#fff', margin: 0, textShadow: '0 4px 40px rgba(0,0,0,0.6)' }}
            >
              CONTROL
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: 4 }}>
            <motion.h1
              initial={{ y: 80, opacity: 0 }} animate={ready ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(68px,11vw,140px)', lineHeight: 0.86, letterSpacing: '0.02em', color: 'var(--orange)', margin: 0, textShadow: '0 4px 60px rgba(255,85,31,0.4)' }}
            >
              THE CHAOS
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: 'var(--font-rajdhani)', fontSize: 'clamp(15px,1.8vw,20px)', color: 'rgba(255,255,255,0.48)', lineHeight: 1.6, maxWidth: 460, marginTop: 24, marginBottom: 0 }}
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
              {/* Pulsing ring */}
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
            style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(255,85,31,0.1)' }}
          >
            {['FREE TO USE', 'NO ACCOUNT REQUIRED', '55+ PRODUCTS'].map(label => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Interactive 3D vehicle stage ─────────────────────── */}
        <div style={{ position: 'relative' }} className="hero-vehicle-col">

          {/* 3D perspective wrapper */}
          <div style={{ perspective: '1100px', perspectiveOrigin: '50% 50%' }}>
            <motion.div
              style={{
                x: vehX, y: vehY,
                rotateX: isMobile ? 0 : vehRotX,
                rotateY: isMobile ? 0 : vehRotY,
                transformStyle: 'preserve-3d',
                position: 'relative',
              }}
              transition={{ type: 'spring', stiffness: 80, damping: 26 }}
            >
              {/* Vehicle image */}
              <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-vehicle.jpg"
                  alt="BŌRYKU overland vehicle"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', display: 'block' }}
                />

                {/* Dark vignette overlay for depth */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%, rgba(0,0,0,0.55) 100%)', borderRadius: 12 }} />

                {/* Glint that moves with tilt — feels like light reflection */}
                <motion.div
                  style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 12,
                    background: useTransform(sx, [-0.5, 0.5], [
                      'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)',
                      'linear-gradient(225deg, rgba(255,255,255,0.06) 0%, transparent 50%)',
                    ]),
                  }}
                />

                {/* Orange campfire glow — bottom center */}
                <motion.div
                  style={{
                    position: 'absolute', bottom: -8, left: '30%', right: '30%', height: 60, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse, rgba(255,85,31,0.35) 0%, transparent 70%)',
                    x: useTransform(sx, [-0.5, 0.5], [-10, 10]),
                  }}
                />
              </div>

              {/* Ground reflection glow */}
              <motion.div
                style={{
                  position: 'absolute', bottom: -20,
                  left: useTransform(sx, [-0.5, 0.5], ['5%', '20%']),
                  width: reflW,
                  height: 36, pointerEvents: 'none',
                  background: 'radial-gradient(ellipse, rgba(255,85,31,0.22) 0%, transparent 70%)',
                  filter: 'blur(12px)',
                }}
              />
            </motion.div>
          </div>

          {/* ── FLOATING CARD 1: Mission Status (top-left, depth layer) ── */}
          <motion.div
            style={{ x: c1X, y: c1Y, position: 'absolute', top: '-8%', left: '-12%', zIndex: 10 }}
            initial={{ opacity: 0, scale: 0.88, y: -16 }}
            animate={ready ? { opacity: 1, scale: 1, y: 0 } : {}}
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

          {/* ── FLOATING CARD 2: Systems check (top-right) ─────────────── */}
          <motion.div
            style={{ x: c2X, y: c2Y, position: 'absolute', top: '-4%', right: '-10%', zIndex: 10 }}
            initial={{ opacity: 0, scale: 0.88, y: -16 }}
            animate={ready ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: 1.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="float-card-hide-mobile"
          >
            <TactCard style={{ minWidth: 158 }}>
              <div style={{ fontSize: 8, letterSpacing: '0.14em', color: 'rgba(255,85,31,0.55)', marginBottom: 9 }}>SYSTEMS CHECK</div>
              {[
                ['SUSPENSION',   true],
                ['RECOVERY RIG', true],
                ['COMMS',        true],
                ['ROOF TENT',    false],
              ].map(([label, ok]) => (
                <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                  <span style={{ fontSize: 9, color: ok ? '#4ade80' : 'rgba(255,255,255,0.25)' }}>{ok ? '✓' : '○'}</span>
                  <span style={{ fontSize: 9, color: ok ? 'rgba(255,255,255,0.62)' : 'rgba(255,255,255,0.22)', letterSpacing: '0.08em' }}>{label as string}</span>
                </div>
              ))}
            </TactCard>
          </motion.div>

          {/* ── FLOATING CARD 3: Build value (bottom-right) ─────────────── */}
          <motion.div
            style={{ x: c3X, y: c3Y, position: 'absolute', bottom: '-6%', right: '-8%', zIndex: 10 }}
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={ready ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: 1.65, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="float-card-hide-mobile"
          >
            <TactCard style={{ minWidth: 180 }}>
              <div style={{ fontSize: 8, letterSpacing: '0.14em', color: 'rgba(255,85,31,0.55)', marginBottom: 6 }}>ACTIVE BUILD</div>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 28, color: '#fff', lineHeight: 1, letterSpacing: '0.04em' }}>$38,200</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 3, letterSpacing: '0.06em' }}>TOYOTA 4RUNNER  ·  14 ITEMS</div>
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

          {/* Reticle / targeting crosshair on vehicle */}
          <AnimatePresence>
            {hovering && !isMobile && (
              <motion.div
                initial={{ opacity: 0, scale: 1.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 64, height: 64,
                  border: '1px solid rgba(255,85,31,0.45)',
                  borderRadius: '50%', pointerEvents: 'none', zIndex: 11,
                }}
              >
                {/* Crosshair lines */}
                <div style={{ position: 'absolute', top: '50%', left: -14, right: -14, height: 1, background: 'rgba(255,85,31,0.4)', transform: 'translateY(-50%)' }} />
                <div style={{ position: 'absolute', left: '50%', top: -14, bottom: -14, width: 1, background: 'rgba(255,85,31,0.4)', transform: 'translateX(-50%)' }} />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{ position: 'absolute', inset: -4, border: '1px dashed rgba(255,85,31,0.22)', borderRadius: '50%' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.8, duration: 0.8 }}
        style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
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

      {/* Bottom fade into page */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, transparent, #0A0A0A)', pointerEvents: 'none', zIndex: 6 }} />

      {/* Responsive CSS */}
      <style>{`
        .hero-grid {
          grid-template-columns: 1fr 1fr;
        }
        .float-card-hide-mobile { display: block; }
        .hud-hide-mobile { display: block; }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-vehicle-col { order: -1; }
          .float-card-hide-mobile { display: none !important; }
        }
        @media (max-width: 640px) {
          .hud-hide-mobile { display: none !important; }
        }
      `}</style>
    </section>
  )
}
