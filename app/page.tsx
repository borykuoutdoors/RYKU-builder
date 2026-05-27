'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion'
import { VEHICLES } from '@/data/vehicles'
import { MISSIONS } from '@/data/missions'
import { CATEGORIES } from '@/data/products'
import InteractiveHero from '@/components/hero/InteractiveHero'

/* ─── Hero image (user-provided) ────────────────────────────────────────── */
// Place your overland vehicle photo at: /public/hero-vehicle.jpg
const HERO_IMG  = '/hero-vehicle.jpg'
const HERO_IMG2 = '/hero-vehicle.jpg'   // mid-page callout – swap if desired

/* ─── Constants ─────────────────────────────────────────────────────────── */

const STATS = [
  { value: 55,   suffix: '+', label: 'Verified Products' },
  { value: 10,   suffix: '',  label: 'Vehicle Platforms' },
  { value: 4200, suffix: '+', label: 'Builds Configured' },
  { value: 6,    suffix: '',  label: 'Installer Partners' },
]

const FEATURES = [
  { icon: '⚙️', title: 'COMPATIBILITY ENGINE', desc: 'Every product verified against your exact vehicle, trim, and drivetrain.' },
  { icon: '🎯', title: 'MISSION MATCHING',     desc: 'Overland. Tactical. Expedition. Get gear matched to how you actually drive.' },
  { icon: '🔩', title: 'INSTALLER NETWORK',    desc: 'Connect with RYKU-certified shops. Get a real quote, not a forum guess.' },
  { icon: '📊', title: 'BUILD INTELLIGENCE',   desc: 'Smart warnings, budget tracking, and conflict detection in real time.' },
  { icon: '📄', title: 'INSTANT QUOTE',        desc: 'Export a PDF build sheet to share with any installer or keep as reference.' },
  { icon: '🛡️', title: 'NO GUESSWORK',         desc: 'We killed the spreadsheet. One platform. Every decision, handled.' },
]

const FEATURED_BUILDS = [
  { name: 'MOJAVE OVERLAND',   vehicle: 'Toyota 4Runner',    value: '$38,200', tags: ['Expedition', 'Weekend'],  emoji: '🏜️' },
  { name: 'ALPINE ASSAULT',    vehicle: 'Jeep Wrangler JLU', value: '$24,800', tags: ['Tactical', 'Recovery'],   emoji: '🏔️' },
  { name: 'COASTAL COMMAND',   vehicle: 'Land Rover Defender',value: '$51,400', tags: ['Luxury', 'Overland'],   emoji: '🌊' },
]

/* ─── Deterministic particle positions (SSR-safe) ───────────────────────── */

function lcg(seed: number): number {
  return (((1664525 * seed + 1013904223) & 0x7fffffff)) / 0x7fffffff
}

const SMOKE = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x:       Math.round(lcg(i * 17 + 1) * 100),
  y:       Math.round(lcg(i * 17 + 2) * 100),
  size:    Math.round(50 + lcg(i * 17 + 3) * 100),
  opacity: parseFloat((0.03 + lcg(i * 17 + 4) * 0.09).toFixed(3)),
  dur:     parseFloat((12 + lcg(i * 17 + 5) * 14).toFixed(1)),
  delay:   parseFloat((-lcg(i * 17 + 6) * 10).toFixed(1)),
  floatY:  Math.round(15 + lcg(i * 17 + 7) * 28),
}))

/* ─── Animation variants ────────────────────────────────────────────────── */

const fadeUp = {
  hidden:  { opacity: 0, y: 52 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number,number,number,number], delay: i * 0.08 },
  }),
}

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.9, ease: 'easeOut', delay: i * 0.07 },
  }),
}

const scaleIn = {
  hidden:  { opacity: 0, scale: 0.90 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number,number,number,number], delay: i * 0.07 },
  }),
}

/* ─── Loading screen ────────────────────────────────────────────────────── */

function LoadingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.95, ease: 'easeOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(56px, 9vw, 88px)', color: '#fff', letterSpacing: '0.12em' }}
      >
        BŌ<span style={{ color: 'var(--orange)' }}>RYK</span>U
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.28em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginTop: '12px' }}
      >
        PRECISION OVERLAND BUILD PLATFORM
      </motion.div>

      {/* Progress bar */}
      <div style={{ marginTop: '44px', width: '240px', height: '1px', background: 'rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden' }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2.0, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          style={{ position: 'absolute', inset: 0, background: 'var(--orange)', transformOrigin: 'left' }}
        />
      </div>

      {/* Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0, 1] }}
        transition={{ delay: 1.0, duration: 1.4 }}
        style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.22em', color: 'rgba(255,85,31,0.5)', textTransform: 'uppercase' }}
      >
        INITIALIZING...
      </motion.div>
    </motion.div>
  )
}

/* ─── HUD Overlay ───────────────────────────────────────────────────────── */

function HudOverlay() {
  const br: React.CSSProperties = { position: 'absolute', width: 28, height: 28 }

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>

      {/* Corner brackets */}
      {[
        { top: 24, left: 24,  borderTop: '1.5px solid rgba(255,85,31,0.5)', borderLeft:  '1.5px solid rgba(255,85,31,0.5)', delay: 2.8 },
        { top: 24, right: 24, borderTop: '1.5px solid rgba(255,85,31,0.5)', borderRight: '1.5px solid rgba(255,85,31,0.5)', delay: 2.9 },
        { bottom: 64, left: 24,  borderBottom: '1.5px solid rgba(255,85,31,0.5)', borderLeft:  '1.5px solid rgba(255,85,31,0.5)', delay: 3.0 },
        { bottom: 64, right: 24, borderBottom: '1.5px solid rgba(255,85,31,0.5)', borderRight: '1.5px solid rgba(255,85,31,0.5)', delay: 3.1 },
      ].map((props, i) => {
        const { delay, ...rest } = props
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay, duration: 0.6 }}
            style={{ ...br, ...rest }}
          />
        )
      })}

      {/* GPS — bottom left */}
      <motion.div
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3.2, duration: 0.7 }}
        style={{ position: 'absolute', bottom: 78, left: 40, fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', lineHeight: 1.9 }}
        className="hud-text-hide-mobile"
      >
        <div style={{ color: 'rgba(255,255,255,0.28)' }}>36.7°N / 118.4°W</div>
        <div style={{ color: 'rgba(255,85,31,0.5)' }}>ELEV 8,412 FT</div>
      </motion.div>

      {/* Status — top right */}
      <motion.div
        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3.3, duration: 0.7 }}
        style={{ position: 'absolute', top: 32, right: 72, fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textAlign: 'right', lineHeight: 2 }}
        className="hud-text-hide-mobile"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', color: 'rgba(255,85,31,0.7)' }}>
          <motion.span
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--orange)', display: 'inline-block', flexShrink: 0 }}
          />
          SYSTEMS ARMED
        </div>
        <div style={{ color: 'rgba(255,255,255,0.2)' }}>BUILD PLATFORM v1.0</div>
      </motion.div>

      {/* Tactical tags — bottom right */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.6, duration: 0.7 }}
        style={{ position: 'absolute', bottom: 78, right: 40, fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(102,255,255,0.45)', textAlign: 'right', lineHeight: 2 }}
        className="hud-text-hide-mobile"
      >
        <div>ROOFTOP TENT ✓</div>
        <div>RECOVERY KIT ✓</div>
        <div>COMMS ACTIVE ✓</div>
      </motion.div>

      {/* Animated scan line */}
      <motion.div
        initial={{ top: '-2px', opacity: 0 }}
        animate={{ top: ['0%', '100%'], opacity: [0, 0.4, 0.4, 0] }}
        transition={{ duration: 4, delay: 2.5, ease: 'linear', repeat: Infinity, repeatDelay: 6 }}
        style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,85,31,0.3) 25%, rgba(255,85,31,0.5) 50%, rgba(255,85,31,0.3) 75%, transparent 100%)',
        }}
      />
    </div>
  )
}

/* ─── Smoke / fog particles ─────────────────────────────────────────────── */

function SmokeParticles() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }}>
      {SMOKE.map(p => (
        <motion.div
          key={p.id}
          animate={{ y: [0, -p.floatY, 0], x: [0, p.floatY * 0.4, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: p.x + '%',
            top: p.y + '%',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,85,31,' + p.opacity + ') 0%, transparent 70%)',
            filter: 'blur(' + Math.round(p.size * 0.3) + 'px)',
          }}
        />
      ))}
    </div>
  )
}

/* ─── Animated counter ──────────────────────────────────────────────────── */

function AnimCounter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })
  const raw = useMotionValue(0)
  const spring = useSpring(raw, { stiffness: 60, damping: 18 })

  useEffect(() => {
    if (inView) raw.set(to)
  }, [inView, raw, to])

  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix
    })
  }, [spring, suffix])

  return <span ref={ref}>0{suffix}</span>
}

/* ─── Grid background ───────────────────────────────────────────────────── */

function GridBg({ opacity = 0.022 }: { opacity?: number }) {
  const v = opacity.toString()
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: 'linear-gradient(rgba(255,85,31,' + v + ') 1px, transparent 1px), linear-gradient(90deg, rgba(255,85,31,' + v + ') 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    }} />
  )
}

/* ─── Orange glow ───────────────────────────────────────────────────────── */

function OrangeGlow({ x = '0%', y = '80%', size = 600, opacity = 0.07 }: {
  x?: string; y?: string; size?: number; opacity?: number
}) {
  const v = opacity.toString()
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: size, height: size,
      background: 'radial-gradient(circle, rgba(255,85,31,' + v + ') 0%, transparent 70%)',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    }} />
  )
}

/* ─── Scanlines ─────────────────────────────────────────────────────────── */

function Scanlines() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
    }} />
  )
}

/* ─── Animated CTA Button ───────────────────────────────────────────────── */

function PulseCTA({ href, label, ghost, dataAction }: { href: string; label: string; ghost?: boolean; dataAction: string }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {!ghost && (
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute', inset: -4,
            background: 'transparent',
            border: '1px solid rgba(255,85,31,0.4)',
            clipPath: 'polygon(9px 0%, 100% 0%, calc(100% - 9px) 100%, 0% 100%)',
            pointerEvents: 'none',
          }}
        />
      )}
      <Link
        href={href}
        className={ghost ? 'btn btn-ghost btn-lg' : 'btn btn-primary btn-lg'}
        data-action={dataAction}
      >
        {label}
      </Link>
    </div>
  )
}

/* ─── Glassmorphism card ────────────────────────────────────────────────── */

function GlassCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className="glass"
      style={{
        borderRadius: 8,
        padding: '14px 18px',
        border: '1px solid rgba(255,85,31,0.18)',
        background: 'rgba(10,10,10,0.72)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function HomePage() {
  const [loaded, setLoaded] = useState(false)
  const handleLoadDone = useCallback(() => setLoaded(true), [])

  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })

  // Hero image: parallax + slow zoom in
  const heroImgY     = useTransform(heroScroll, [0, 1], ['0%', '18%'])
  const heroImgScale = useTransform(heroScroll, [0, 1], [1.0, 1.16])

  // Hero text: floats up faster than image (depth separation)
  const heroTextY   = useTransform(heroScroll, [0, 1], ['0%', '40%'])
  const heroOpacity = useTransform(heroScroll, [0, 0.65], [1, 0])

  return (
    <>
      <AnimatePresence>
        {!loaded && <LoadingScreen onDone={handleLoadDone} />}
      </AnimatePresence>

      {/* Global keyframes */}
      <style>{`
        @keyframes btn-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,85,31,0); }
          50% { box-shadow: 0 0 24px 4px rgba(255,85,31,0.25); }
        }
        .btn-primary { animation: btn-glow 3s ease-in-out infinite; }
        .hud-text-hide-mobile { display: block; }
        @media (max-width: 640px) {
          .hud-text-hide-mobile { display: none !important; }
          .hero-float-card { display: none !important; }
        }
        @media (min-width: 768px) {
          .callout-right-stats { display: flex !important; }
          .hero-float-card { display: block !important; }
        }
      `}</style>

      <div style={{ background: '#0A0A0A', color: '#E8E8E8', overflowX: 'hidden' }}>

        {/* ══════════════════════════════════════════════════════════════
            §1 — INTERACTIVE HERO  (mouse-tracked 3D depth parallax)
        ══════════════════════════════════════════════════════════════ */}
        <InteractiveHero />

        {/* ══════════════════════════════════════════════════════════════
            §2 — STATEMENT  (Apple-style large word reveal)
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ padding: 'clamp(80px, 12vw, 140px) clamp(20px, 5vw, 48px)', position: 'relative', overflow: 'hidden' }}>
          <OrangeGlow x="100%" y="50%" size={700} opacity={0.06} />

          <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
            {[
              { text: 'Overland builds are', color: 'rgba(255,255,255,0.32)' },
              { text: 'complicated.', color: 'rgba(255,255,255,0.62)' },
              { text: 'BŌRYKU', color: 'var(--orange)' },
              { text: 'is not.', color: '#fff' },
            ].map((chunk, i) => (
              <motion.span
                key={i}
                variants={fadeUp} initial="hidden"
                whileInView="visible" viewport={{ once: true, margin: '-10%' }}
                custom={i}
                style={{
                  display: 'inline',
                  fontFamily: 'var(--font-bebas)',
                  fontSize: 'clamp(42px, 7vw, 96px)',
                  letterSpacing: '0.04em',
                  lineHeight: 1.0,
                  color: chunk.color,
                  marginRight: '0.28em',
                }}
              >
                {chunk.text}
              </motion.span>
            ))}

            <motion.p
              variants={fadeUp} initial="hidden"
              whileInView="visible" viewport={{ once: true, margin: '-10%' }}
              custom={4}
              style={{ color: 'rgba(255,255,255,0.38)', fontSize: 'clamp(15px, 1.8vw, 19px)', lineHeight: 1.75, maxWidth: '600px', marginTop: '40px', fontFamily: 'var(--font-rajdhani)' }}
            >
              We call it <span style={{ color: 'rgba(102,255,255,0.8)', fontFamily: 'var(--font-mono)', fontSize: '0.9em' }}>Build Intelligence</span> — not AI, not automation.
              A precision system that filters 55+ products down to exactly what fits
              your rig, your mission, and your budget. Built by overlanders, for overlanders.
            </motion.p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            §3 — STATS
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ padding: 'clamp(56px, 8vw, 96px) clamp(20px, 5vw, 48px)', borderTop: '1px solid rgba(255,85,31,0.08)', borderBottom: '1px solid rgba(255,85,31,0.08)', position: 'relative' }}>
          <GridBg opacity={0.014} />
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px 48px', position: 'relative' }}>
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp} initial="hidden"
                whileInView="visible" viewport={{ once: true, margin: '-5%' }}
                custom={i}
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(52px, 7vw, 88px)', color: 'var(--orange)', lineHeight: 1, letterSpacing: '0.02em' }}>
                  <AnimCounter to={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.32)', textTransform: 'uppercase', marginTop: '8px' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            §4 — FEATURED BUILDS  (glassmorphism cards)
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 48px)', position: 'relative', overflow: 'hidden', background: '#0c0c0c' }}>
          <OrangeGlow x="50%" y="0%" size={900} opacity={0.04} />
          <GridBg opacity={0.013} />

          <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '48px' }}>
              <div>
                <motion.div
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '14px' }}
                >
                  — COMMUNITY BUILDS
                </motion.div>
                <motion.h2
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                  style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(38px, 6vw, 72px)', letterSpacing: '0.04em', lineHeight: 0.95, margin: 0 }}
                >
                  FEATURED<br /><span style={{ color: 'var(--orange)' }}>RIG BUILDS</span>
                </motion.h2>
              </div>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link href="/builds" className="btn btn-ghost" data-action="featured-builds-all">VIEW ALL BUILDS →</Link>
              </motion.div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {FEATURED_BUILDS.map((build, i) => (
                <motion.div
                  key={build.name}
                  variants={scaleIn} initial="hidden"
                  whileInView="visible" viewport={{ once: true, margin: '-5%' }}
                  custom={i}
                  whileHover={{ y: -4, borderColor: 'rgba(255,85,31,0.4)' }}
                  transition={{ duration: 0.22 }}
                  style={{
                    background: 'rgba(14,12,10,0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,85,31,0.15)',
                    borderRadius: 10,
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  {/* Image area */}
                  <div style={{ height: 160, background: 'linear-gradient(135deg, #0d0c09 0%, #0f0e0a 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '56px', opacity: 0.7 }}>{build.emoji}</div>
                    {/* Orange gradient overlay at bottom */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                    {/* Build value badge */}
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,85,31,0.9)', background: 'rgba(255,85,31,0.1)', border: '1px solid rgba(255,85,31,0.3)', borderRadius: 3, padding: '3px 8px' }}>
                        {build.value}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '20px 22px 22px' }}>
                    <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '22px', letterSpacing: '0.06em', color: '#fff', marginBottom: '4px' }}>{build.name}</div>
                    <div style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '14px' }}>{build.vehicle}</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {build.tags.map(tag => (
                        <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(102,255,255,0.55)', border: '1px solid rgba(102,255,255,0.18)', borderRadius: 2, padding: '2px 8px' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom orange accent line */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(255,85,31,0.5) 50%, transparent 100%)' }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            §5 — CINEMATIC CALLOUT  (full-bleed dark image)
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', height: 'clamp(340px, 50vw, 600px)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMG2}
              alt="Precision overland build"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%', opacity: 0.4 }}
            />
          </div>
          {/* Dark gradient bg (visible even without image) */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(145deg, #050400 0%, #0d0a02 50%, #08080a 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(135deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.40) 55%, rgba(0,0,0,0.82) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(ellipse 55% 80% at 0% 50%, rgba(255,85,31,0.11) 0%, transparent 60%)' }} />
          <GridBg opacity={0.012} />

          <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center', padding: 'clamp(28px, 6vw, 80px)' }}>
            <div style={{ maxWidth: '580px' }}>
              <motion.div
                variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '16px' }}
              >
                — PRECISION OVERLANDING
              </motion.div>
              <motion.h2
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(38px, 6vw, 80px)', lineHeight: 0.92, letterSpacing: '0.04em', color: '#fff', margin: '0 0 20px' }}
              >
                EVERY GEAR CHOICE.<br /><span style={{ color: 'var(--orange)' }}>VERIFIED.</span>
              </motion.h2>
              <motion.p
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                style={{ fontFamily: 'var(--font-rajdhani)', fontSize: 'clamp(14px, 1.7vw, 17px)', color: 'rgba(255,255,255,0.42)', lineHeight: 1.65, marginBottom: '28px' }}
              >
                We cross-reference 10 vehicle platforms, 8 mission profiles, and real install data
                so you never order a part that doesn&apos;t fit — or pay twice for labor.
              </motion.p>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
                <Link href="/build" className="btn btn-primary" data-action="callout-cta">START CONFIGURING →</Link>
              </motion.div>
            </div>

            {/* Right side stats */}
            <div className="callout-right-stats" style={{ marginLeft: 'auto', flexDirection: 'column', gap: 20, textAlign: 'right', display: 'none' }}>
              {[['55+', 'VERIFIED PRODUCTS'], ['10', 'VEHICLE PLATFORMS'], ['8', 'MISSION PROFILES']].map(([n, l]) => (
                <motion.div
                  key={l}
                  variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}
                >
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(36px, 4vw, 60px)', color: 'var(--orange)', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.28)' }}>{l}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            §6 — VEHICLES  (infinite marquee)
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ padding: 'clamp(80px, 10vw, 120px) 0', overflow: 'hidden', position: 'relative' }}>
          <OrangeGlow x="10%" y="50%" size={500} opacity={0.05} />

          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)', marginBottom: '48px' }}>
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '16px' }}
            >
              — 10 PLATFORMS SUPPORTED
            </motion.div>
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
              style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(38px, 6vw, 72px)', letterSpacing: '0.04em', lineHeight: 0.95, margin: 0 }}
            >
              SELECT YOUR<br /><span style={{ color: 'var(--orange)' }}>VEHICLE</span>
            </motion.h2>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to right, #0A0A0A, transparent)', zIndex: 2, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to left, #0A0A0A, transparent)', zIndex: 2, pointerEvents: 'none' }} />

            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
              style={{ display: 'flex', gap: '16px', width: 'max-content', padding: '8px 0' }}
            >
              {[...VEHICLES, ...VEHICLES].map((v, i) => (
                <Link key={i} href="/build" data-vid={v.id} style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ scale: 1.05, borderColor: 'rgba(255,85,31,0.5)', y: -4 }}
                    transition={{ duration: 0.2 }}
                    style={{ width: 196, background: '#111', border: '1px solid rgba(255,85,31,0.1)', borderRadius: 8, padding: '20px 18px', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <div style={{ fontSize: '36px', marginBottom: '12px' }}>{v.emoji}</div>
                    <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '18px', color: '#fff', letterSpacing: '0.06em', lineHeight: 1.1, marginBottom: '4px' }}>{v.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{v.sub}</div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>

          <div style={{ maxWidth: '1100px', margin: '40px auto 0', padding: '0 clamp(20px, 5vw, 48px)' }}>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Link href="/build" className="btn btn-ghost" data-action="vehicles-see-all">VIEW ALL VEHICLES →</Link>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            §7 — BUILD FLOW  (4-step grid)
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 48px)', borderTop: '1px solid rgba(255,85,31,0.08)', position: 'relative', overflow: 'hidden' }}>
          <GridBg opacity={0.016} />
          <OrangeGlow x="88%" y="50%" size={600} opacity={0.06} />

          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '60px', textAlign: 'center' }}
            >
              — HOW IT WORKS
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2px', position: 'relative' }}>
              {[
                { step: '01', title: 'SELECT VEHICLE', desc: '10 platforms. Pick your year, trim, and drivetrain to filter gear that actually fits.', icon: '🚙' },
                { step: '02', title: 'CHOOSE MISSION', desc: 'Overland. Tactical. Expedition. Your mission shapes every gear recommendation.', icon: '🎯' },
                { step: '03', title: 'SET BUDGET',     desc: 'Hard cap or unlimited. The platform tracks every dollar in real time as you build.', icon: '💰' },
                { step: '04', title: 'CONFIGURE',      desc: '55+ verified products. Add gear, get warnings, generate a quote, contact an installer.', icon: '⚙️' },
              ].map((s, i) => (
                <motion.div
                  key={s.step}
                  variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-5%' }} custom={i}
                  style={{ background: '#0f0f0f', border: '1px solid rgba(255,85,31,0.1)', padding: 'clamp(22px, 3vw, 36px)', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', top: '-12px', right: '14px', fontFamily: 'var(--font-bebas)', fontSize: '90px', color: 'rgba(255,85,31,0.055)', lineHeight: 1, userSelect: 'none' }}>
                    {s.step}
                  </div>
                  <div style={{ fontSize: '28px', marginBottom: '16px' }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--orange)', marginBottom: '10px', textTransform: 'uppercase' }}>STEP {s.step}</div>
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '22px', letterSpacing: '0.06em', color: '#fff', marginBottom: '10px' }}>{s.title}</div>
                  <div style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '14px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.65 }}>{s.desc}</div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link href="/build" className="btn btn-primary btn-lg" data-action="how-it-works-cta">BEGIN CONFIGURATION →</Link>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            §8 — MISSIONS
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 48px)', position: 'relative', overflow: 'hidden' }}>
          <OrangeGlow x="50%" y="0%" size={800} opacity={0.05} />

          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '48px' }}>
              <div>
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '14px' }}>
                  — 8 MISSION PROFILES
                </motion.div>
                <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                  style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(38px, 6vw, 72px)', letterSpacing: '0.04em', lineHeight: 0.95, margin: 0 }}>
                  WHAT IS YOUR<br /><span style={{ color: 'var(--orange)' }}>MISSION?</span>
                </motion.h2>
              </div>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link href="/build" className="btn btn-ghost" data-action="missions-cta">BUILD FOR YOUR MISSION →</Link>
              </motion.div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
              {MISSIONS.map((m, i) => (
                <motion.div
                  key={m.id}
                  variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-5%' }} custom={i}
                  whileHover={{ scale: 1.03, borderColor: 'rgba(255,85,31,0.42)', y: -3 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    background: 'rgba(12,10,8,0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,85,31,0.1)', borderRadius: 8, padding: '24px', cursor: 'default', position: 'relative',
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '12px' }}>{m.icon}</div>
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '20px', letterSpacing: '0.06em', color: '#fff', marginBottom: '6px' }}>{m.name.toUpperCase()}</div>
                  <div style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '13px', color: 'rgba(255,255,255,0.36)', lineHeight: 1.55 }}>{m.description}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            §9 — GEAR CATEGORIES
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 48px)', borderTop: '1px solid rgba(255,85,31,0.08)', position: 'relative', background: '#0d0d0d' }}>
          <GridBg opacity={0.013} />

          <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '48px' }}>
              <div>
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '14px' }}>
                  — 55+ VERIFIED PRODUCTS
                </motion.div>
                <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                  style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(38px, 6vw, 72px)', letterSpacing: '0.04em', lineHeight: 0.95, margin: 0 }}>
                  GEAR THAT<br /><span style={{ color: 'var(--orange)' }}>ACTUALLY FITS</span>
                </motion.h2>
              </div>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link href="/gear" className="btn btn-ghost" data-action="gear-browse">BROWSE GEAR →</Link>
              </motion.div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '10px' }}>
              {CATEGORIES.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-5%' }} custom={i}
                  whileHover={{ scale: 1.04, borderColor: 'rgba(255,85,31,0.48)', y: -3 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    background: 'rgba(15,12,10,0.88)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,85,31,0.1)', borderRadius: 8, padding: '20px', cursor: 'default',
                  }}
                >
                  <div style={{ fontSize: '26px', marginBottom: '10px' }}>{cat.emoji}</div>
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '16px', letterSpacing: '0.06em', color: '#fff' }}>{cat.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,85,31,0.48)', marginTop: '5px', letterSpacing: '0.1em' }}>VIEW PRODUCTS →</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            §10 — FEATURES  (6-card grid)
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 48px)', position: 'relative', overflow: 'hidden' }}>
          <OrangeGlow x="50%" y="100%" size={700} opacity={0.07} />

          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '14px' }}>
                — PLATFORM CAPABILITIES
              </motion.div>
              <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(38px, 6vw, 72px)', letterSpacing: '0.04em', lineHeight: 0.95 }}>
                BUILT FOR<br /><span style={{ color: 'var(--orange)' }}>SERIOUS BUILDERS</span>
              </motion.h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1px', background: 'rgba(255,85,31,0.07)' }}>
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-5%' }} custom={i}
                  whileHover={{ backgroundColor: '#0e0e0e' }}
                  style={{ background: '#0A0A0A', padding: 'clamp(26px, 3vw, 40px)' }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '16px' }}>{f.icon}</div>
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '18px', letterSpacing: '0.1em', color: '#fff', marginBottom: '10px' }}>{f.title}</div>
                  <div style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '14px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.65 }}>{f.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            §11 — FINAL CTA  (fullscreen)
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', textAlign: 'center', padding: '80px clamp(20px, 5vw, 48px)' }}>
          {/* Background image (dim) */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMG}
              alt=""
              aria-hidden
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', opacity: 0.18, filter: 'blur(2px)' }}
            />
          </div>
          {/* Gradient BG */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(165deg, #040302 0%, #0a0907 50%, #060606 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(ellipse 75% 65% at 50% 50%, rgba(255,85,31,0.11) 0%, transparent 65%)' }} />
          <GridBg opacity={0.022} />
          <Scanlines />

          {/* Corner brackets */}
          {[
            { top: 28, left: 28, borderTop: '1.5px solid rgba(255,85,31,0.35)', borderLeft: '1.5px solid rgba(255,85,31,0.35)' },
            { top: 28, right: 28, borderTop: '1.5px solid rgba(255,85,31,0.35)', borderRight: '1.5px solid rgba(255,85,31,0.35)' },
            { bottom: 28, left: 28, borderBottom: '1.5px solid rgba(255,85,31,0.35)', borderLeft: '1.5px solid rgba(255,85,31,0.35)' },
            { bottom: 28, right: 28, borderBottom: '1.5px solid rgba(255,85,31,0.35)', borderRight: '1.5px solid rgba(255,85,31,0.35)' },
          ].map((style, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.4 }}
              style={{ position: 'absolute', width: 24, height: 24, pointerEvents: 'none', zIndex: 2, ...style }}
            />
          ))}

          <div style={{ position: 'relative', zIndex: 3, maxWidth: '820px' }}>
            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '24px' }}>
              — READY TO BUILD
            </motion.div>

            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(60px, 11vw, 140px)', lineHeight: 0.88, letterSpacing: '0.03em', color: '#fff', marginBottom: 0 }}>
              CONFIGURE YOUR
            </motion.h2>
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
              style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(60px, 11vw, 140px)', lineHeight: 0.88, letterSpacing: '0.03em', color: 'var(--orange)', marginBottom: 0, textShadow: '0 4px 48px rgba(255,85,31,0.3)' }}>
              ULTIMATE RIG
            </motion.h2>

            <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
              style={{ fontFamily: 'var(--font-rajdhani)', fontSize: 'clamp(15px, 2vw, 20px)', color: 'rgba(255,255,255,0.38)', margin: '32px auto', maxWidth: '500px', lineHeight: 1.6 }}>
              10 vehicles. 55+ products. 8 missions. Real installers. Zero guesswork.
            </motion.p>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}
              style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
              <PulseCTA href="/build" label="START BUILD — IT'S FREE" dataAction="final-cta" />
              <PulseCTA href="/about" label="LEARN MORE" ghost dataAction="final-about" />
            </motion.div>

            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4}
              style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 4vw, 40px)', flexWrap: 'wrap', marginTop: '60px', paddingTop: '40px', borderTop: '1px solid rgba(255,85,31,0.14)' }}>
              {['FREE TO USE', 'NO ACCOUNT REQUIRED', 'INSTANT QUOTE EXPORT'].map((label) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

      </div>
    </>
  )
}
