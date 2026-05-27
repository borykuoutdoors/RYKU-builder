'use client'

import { useRef, useEffect } from 'react'
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

/* ─── Constants ─────────────────────────────────────────────────────────── */

const STATS = [
  { value: 55, suffix: '+', label: 'Verified Products' },
  { value: 10, suffix: '',  label: 'Vehicle Platforms' },
  { value: 4200, suffix: '+', label: 'Builds Configured' },
  { value: 6, suffix: '',   label: 'Installer Partners' },
]

const FEATURES = [
  { icon: '⚙️', title: 'COMPATIBILITY ENGINE', desc: 'Every product verified against your exact vehicle, trim, and drivetrain.' },
  { icon: '🎯', title: 'MISSION MATCHING',     desc: 'Overland. Tactical. Expedition. Get gear matched to how you actually drive.' },
  { icon: '🔩', title: 'INSTALLER NETWORK',    desc: 'Connect with RYKU-certified shops. Get a real quote, not a forum guess.' },
  { icon: '📊', title: 'BUILD INTELLIGENCE',   desc: 'Smart warnings, budget tracking, and conflict detection in real time.' },
  { icon: '📄', title: 'INSTANT QUOTE',        desc: 'Export a PDF build sheet to share with any installer or keep as reference.' },
  { icon: '🛡️', title: 'NO GUESSWORK',         desc: 'We killed the spreadsheet. One platform. Every decision, handled.' },
]

/* ─── Animation variants ────────────────────────────────────────────────── */

const fadeUp = {
  hidden:  { opacity: 0, y: 48 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 },
  }),
}

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.9, ease: 'easeOut', delay: i * 0.06 },
  }),
}

const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 },
  }),
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

/* ─── Parallax section ──────────────────────────────────────────────────── */

function ParallaxSection({ children, speed = 0.3 }: { children: React.ReactNode; speed?: number }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 60}px`, `${speed * 60}px`])
  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}

/* ─── Scanline overlay ──────────────────────────────────────────────────── */

function Scanlines() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
    }} />
  )
}

/* ─── Grid background ───────────────────────────────────────────────────── */

function GridBg({ opacity = 0.022 }: { opacity?: number }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: `linear-gradient(rgba(255,85,31,${opacity}) 1px, transparent 1px), linear-gradient(90deg, rgba(255,85,31,${opacity}) 1px, transparent 1px)`,
      backgroundSize: '40px 40px',
    }} />
  )
}

/* ─── Orange glow ───────────────────────────────────────────────────────── */

function OrangeGlow({ x = '0%', y = '80%', size = 600, opacity = 0.07 }: {
  x?: string; y?: string; size?: number; opacity?: number
}) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: size, height: size,
      background: `radial-gradient(circle, rgba(255,85,31,${opacity}) 0%, transparent 70%)`,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    }} />
  )
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function HomePage() {
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY     = useTransform(heroScroll, [0, 1], ['0%', '28%'])
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0])

  return (
    <div style={{ background: '#0A0A0A', color: '#E8E8E8', overflowX: 'hidden' }}>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 1 — HERO  (100vh fullscreen)
      ════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <GridBg opacity={0.028} />
        <Scanlines />

        {/* Radial ambient glows */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 50% at 50% 60%, rgba(255,85,31,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 40% at 20% 80%, rgba(255,85,31,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Parallax content wrapper */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, position: 'relative', zIndex: 2, padding: '0 24px', maxWidth: '1000px' }}
        >
          {/* Eyebrow */}
          <motion.div
            variants={fadeIn} initial="hidden" animate="visible" custom={0}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
          >
            <span style={{ display: 'inline-block', width: 28, height: 1, background: 'var(--orange)', opacity: 0.5 }} />
            RYKU BUILD PLATFORM v1.0
            <span style={{ display: 'inline-block', width: 28, height: 1, background: 'var(--orange)', opacity: 0.5 }} />
          </motion.div>

          {/* Main headline — split for cinematic stagger */}
          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              variants={fadeUp} initial="hidden" animate="visible" custom={1}
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(72px, 13vw, 160px)',
                lineHeight: 0.88,
                letterSpacing: '0.03em',
                color: '#fff',
                margin: 0,
              }}
            >
              CONTROL
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              variants={fadeUp} initial="hidden" animate="visible" custom={1.8}
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(72px, 13vw, 160px)',
                lineHeight: 0.88,
                letterSpacing: '0.03em',
                color: 'var(--orange)',
                margin: 0,
              }}
            >
              THE CHAOS
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            style={{
              fontFamily: 'var(--font-rajdhani)',
              fontSize: 'clamp(16px, 2.2vw, 22px)',
              color: 'rgba(255,255,255,0.45)',
              maxWidth: '560px',
              margin: '28px auto 40px',
              lineHeight: 1.55,
            }}
          >
            The precision overland build platform. Select your vehicle. Choose your mission.
            Configure your rig with compatibility-verified gear and real installer connections.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3.8}
            style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link href="/build" className="btn btn-primary btn-lg" data-action="hero-cta-primary">
              START YOUR BUILD
            </Link>
            <Link href="/builds" className="btn btn-ghost btn-lg" data-action="hero-cta-secondary">
              EXPLORE BUILDS
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeIn} initial="hidden" animate="visible" custom={5}
          style={{ position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            style={{ width: 20, height: 32, border: '1.5px solid rgba(255,85,31,0.35)', borderRadius: 10, display: 'flex', justifyContent: 'center', paddingTop: 6 }}
          >
            <div style={{ width: 3, height: 6, background: 'var(--orange)', borderRadius: 2, opacity: 0.7 }} />
          </motion.div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>SCROLL</span>
        </motion.div>

        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '140px', background: 'linear-gradient(to bottom, transparent, #0A0A0A)', pointerEvents: 'none' }} />
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 2 — STATEMENT  (Apple-style large copy reveal)
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px, 12vw, 140px) 24px', position: 'relative', overflow: 'hidden' }}>
        <OrangeGlow x="100%" y="50%" size={700} opacity={0.06} />

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
          {/* Overland/tactical statement — word-by-word reveal */}
          {[
            { text: 'Overland builds are', color: 'rgba(255,255,255,0.35)' },
            { text: 'complicated.', color: 'rgba(255,255,255,0.65)' },
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
                fontSize: 'clamp(44px, 7vw, 96px)',
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
            style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(15px, 1.8vw, 19px)', lineHeight: 1.7, maxWidth: '600px', marginTop: '36px', fontFamily: 'var(--font-rajdhani)' }}
          >
            We call it <span style={{ color: 'rgba(102,255,255,0.8)', fontFamily: 'var(--font-mono)', fontSize: '0.9em' }}>Build Intelligence</span> — not AI, not automation.
            A precision system that filters 55+ products down to exactly what fits
            your rig, your mission, and your budget. Built by overlanders, for overlanders.
          </motion.p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 3 — STATS  (large counter reveal)
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 24px', borderTop: '1px solid rgba(255,85,31,0.08)', borderBottom: '1px solid rgba(255,85,31,0.08)', position: 'relative' }}>
        <GridBg opacity={0.015} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', position: 'relative' }}>
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
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginTop: '8px' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 4 — VEHICLES  (horizontal scroll marquee)
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) 0', overflow: 'hidden', position: 'relative' }}>
        <OrangeGlow x="10%" y="50%" size={500} opacity={0.05} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', marginBottom: '48px' }}>
          <motion.div
            variants={fadeUp} initial="hidden"
            whileInView="visible" viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '16px' }}
          >
            — 10 PLATFORMS SUPPORTED
          </motion.div>
          <motion.h2
            variants={fadeUp} initial="hidden"
            whileInView="visible" viewport={{ once: true }}
            custom={1}
            style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.04em', lineHeight: 0.95, margin: 0 }}
          >
            SELECT YOUR<br />
            <span style={{ color: 'var(--orange)' }}>VEHICLE</span>
          </motion.h2>
        </div>

        {/* Infinite marquee of vehicle cards */}
        <div style={{ position: 'relative' }}>
          {/* Left/right fade */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to right, #0A0A0A, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to left, #0A0A0A, transparent)', zIndex: 2, pointerEvents: 'none' }} />

          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
            style={{ display: 'flex', gap: '16px', width: 'max-content', padding: '8px 0' }}
          >
            {[...VEHICLES, ...VEHICLES].map((v, i) => (
              <Link
                key={i}
                href="/build"
                data-vid={v.id}
                style={{ textDecoration: 'none' }}
              >
                <motion.div
                  whileHover={{ scale: 1.04, borderColor: 'rgba(255,85,31,0.5)' }}
                  transition={{ duration: 0.2 }}
                  style={{
                    width: 200,
                    background: '#111',
                    border: '1px solid rgba(255,85,31,0.1)',
                    borderRadius: 8,
                    padding: '20px 18px',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>{v.emoji}</div>
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '18px', color: '#fff', letterSpacing: '0.06em', lineHeight: 1.1, marginBottom: '4px' }}>{v.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.32)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{v.sub}</div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>

        <div style={{ maxWidth: '1100px', margin: '40px auto 0', padding: '0 24px' }}>
          <motion.div
            variants={fadeUp} initial="hidden"
            whileInView="visible" viewport={{ once: true }}
          >
            <Link href="/build" className="btn btn-ghost" data-action="vehicles-see-all">
              VIEW ALL VEHICLES →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 5 — BUILD FLOW  (Tesla-style split panels)
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px, 10vw, 140px) 24px', borderTop: '1px solid rgba(255,85,31,0.08)', position: 'relative', overflow: 'hidden' }}>
        <GridBg opacity={0.018} />
        <OrangeGlow x="90%" y="50%" size={600} opacity={0.06} />

        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div
            variants={fadeUp} initial="hidden"
            whileInView="visible" viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '60px', textAlign: 'center' }}
          >
            — HOW IT WORKS
          </motion.div>

          {/* 4-step build flow */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2px', position: 'relative' }}>
            {[
              { step: '01', title: 'SELECT VEHICLE', desc: '10 platforms. Pick your year, trim, and drivetrain to filter gear that actually fits.', icon: '🚙' },
              { step: '02', title: 'CHOOSE MISSION', desc: 'Overland. Tactical. Expedition. Your mission shapes every gear recommendation.', icon: '🎯' },
              { step: '03', title: 'SET BUDGET',     desc: 'Hard cap or unlimited. The platform tracks every dollar in real time as you build.', icon: '💰' },
              { step: '04', title: 'CONFIGURE',      desc: '55+ verified products. Add gear, get warnings, generate a quote, contact an installer.', icon: '⚙️' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                variants={scaleIn} initial="hidden"
                whileInView="visible" viewport={{ once: true, margin: '-5%' }}
                custom={i}
                style={{
                  background: '#0f0f0f',
                  border: '1px solid rgba(255,85,31,0.1)',
                  padding: 'clamp(24px, 3vw, 36px)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Step number watermark */}
                <div style={{
                  position: 'absolute', top: '-12px', right: '16px',
                  fontFamily: 'var(--font-bebas)', fontSize: '88px',
                  color: 'rgba(255,85,31,0.06)', lineHeight: 1, userSelect: 'none',
                }}>
                  {s.step}
                </div>
                <div style={{ fontSize: '28px', marginBottom: '16px' }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--orange)', marginBottom: '10px', textTransform: 'uppercase' }}>STEP {s.step}</div>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '22px', letterSpacing: '0.06em', color: '#fff', marginBottom: '10px' }}>{s.title}</div>
                <div style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{s.desc}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp} initial="hidden"
            whileInView="visible" viewport={{ once: true }}
            style={{ textAlign: 'center', marginTop: '48px' }}
          >
            <Link href="/build" className="btn btn-primary btn-lg" data-action="how-it-works-cta">
              BEGIN CONFIGURATION →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 6 — MISSIONS  (full-width dark grid)
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) 24px', position: 'relative', overflow: 'hidden' }}>
        <OrangeGlow x="50%" y="0%" size={800} opacity={0.05} />

        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '48px' }}>
            <div>
              <motion.div
                variants={fadeUp} initial="hidden"
                whileInView="visible" viewport={{ once: true }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '14px' }}
              >
                — 8 MISSION PROFILES
              </motion.div>
              <motion.h2
                variants={fadeUp} initial="hidden"
                whileInView="visible" viewport={{ once: true }} custom={1}
                style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.04em', lineHeight: 0.95, margin: 0 }}
              >
                WHAT IS YOUR<br />
                <span style={{ color: 'var(--orange)' }}>MISSION?</span>
              </motion.h2>
            </div>
            <motion.div
              variants={fadeUp} initial="hidden"
              whileInView="visible" viewport={{ once: true }}
            >
              <Link href="/build" className="btn btn-ghost" data-action="missions-cta">BUILD FOR YOUR MISSION →</Link>
            </motion.div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {MISSIONS.map((m, i) => (
              <motion.div
                key={m.id}
                variants={scaleIn} initial="hidden"
                whileInView="visible" viewport={{ once: true, margin: '-5%' }}
                custom={i}
                whileHover={{ scale: 1.03, borderColor: 'rgba(255,85,31,0.4)' }}
                transition={{ duration: 0.22 }}
                style={{
                  background: '#0f0f0f',
                  border: '1px solid rgba(255,85,31,0.1)',
                  borderRadius: 6,
                  padding: '24px',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{m.icon}</div>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '20px', letterSpacing: '0.06em', color: '#fff', marginBottom: '6px' }}>{m.name.toUpperCase()}</div>
                <div style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '13px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>{m.description}</div>
                {/* Subtle orange corner accent */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: 3, height: '100%', background: 'rgba(255,85,31,0)', transition: 'background 0.2s' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 7 — GEAR CATEGORIES  (staggered cards)
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) 24px', borderTop: '1px solid rgba(255,85,31,0.08)', position: 'relative', background: '#0d0d0d' }}>
        <GridBg opacity={0.015} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '48px' }}>
            <div>
              <motion.div
                variants={fadeUp} initial="hidden"
                whileInView="visible" viewport={{ once: true }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '14px' }}
              >
                — 55+ VERIFIED PRODUCTS
              </motion.div>
              <motion.h2
                variants={fadeUp} initial="hidden"
                whileInView="visible" viewport={{ once: true }} custom={1}
                style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.04em', lineHeight: 0.95, margin: 0 }}
              >
                GEAR THAT<br />
                <span style={{ color: 'var(--orange)' }}>ACTUALLY FITS</span>
              </motion.h2>
            </div>
            <motion.div
              variants={fadeUp} initial="hidden"
              whileInView="visible" viewport={{ once: true }}
            >
              <Link href="/gear" className="btn btn-ghost" data-action="gear-browse">BROWSE GEAR →</Link>
            </motion.div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                variants={scaleIn} initial="hidden"
                whileInView="visible" viewport={{ once: true, margin: '-5%' }}
                custom={i}
                whileHover={{ scale: 1.04, borderColor: 'rgba(255,85,31,0.45)' }}
                transition={{ duration: 0.22 }}
                style={{
                  background: '#111',
                  border: '1px solid rgba(255,85,31,0.1)',
                  borderRadius: 6,
                  padding: '20px',
                  cursor: 'default',
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: '26px', marginBottom: '10px' }}>{cat.emoji}</div>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '17px', letterSpacing: '0.06em', color: '#fff' }}>{cat.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,85,31,0.5)', marginTop: '5px', letterSpacing: '0.1em' }}>
                  VIEW PRODUCTS →
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 8 — FEATURES  (6-card grid)
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px, 10vw, 140px) 24px', position: 'relative', overflow: 'hidden' }}>
        <OrangeGlow x="50%" y="100%" size={700} opacity={0.07} />

        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <motion.div
              variants={fadeUp} initial="hidden"
              whileInView="visible" viewport={{ once: true }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '14px' }}
            >
              — PLATFORM CAPABILITIES
            </motion.div>
            <motion.h2
              variants={fadeUp} initial="hidden"
              whileInView="visible" viewport={{ once: true }} custom={1}
              style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.04em', lineHeight: 0.95 }}
            >
              BUILT FOR<br />
              <span style={{ color: 'var(--orange)' }}>SERIOUS BUILDERS</span>
            </motion.h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1px', background: 'rgba(255,85,31,0.08)' }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeIn} initial="hidden"
                whileInView="visible" viewport={{ once: true, margin: '-5%' }}
                custom={i}
                style={{
                  background: '#0A0A0A',
                  padding: 'clamp(28px, 3vw, 40px)',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '16px' }}>{f.icon}</div>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '18px', letterSpacing: '0.1em', color: '#fff', marginBottom: '10px' }}>{f.title}</div>
                <div style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 9 — FINAL CTA  (Tesla-style fullscreen)
      ════════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        textAlign: 'center',
        padding: '80px 24px',
      }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,85,31,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <GridBg opacity={0.025} />
        <Scanlines />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '820px' }}>
          <motion.div
            variants={fadeIn} initial="hidden"
            whileInView="visible" viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '24px' }}
          >
            — READY TO BUILD
          </motion.div>

          <motion.h2
            variants={fadeUp} initial="hidden"
            whileInView="visible" viewport={{ once: true }}
            style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(64px, 11vw, 140px)',
              lineHeight: 0.9,
              letterSpacing: '0.03em',
              color: '#fff',
              marginBottom: '0',
            }}
          >
            CONFIGURE YOUR
          </motion.h2>
          <motion.h2
            variants={fadeUp} initial="hidden"
            whileInView="visible" viewport={{ once: true }} custom={1}
            style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(64px, 11vw, 140px)',
              lineHeight: 0.9,
              letterSpacing: '0.03em',
              color: 'var(--orange)',
              marginBottom: '0',
            }}
          >
            ULTIMATE RIG
          </motion.h2>

          <motion.p
            variants={fadeUp} initial="hidden"
            whileInView="visible" viewport={{ once: true }} custom={2}
            style={{ fontFamily: 'var(--font-rajdhani)', fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.4)', margin: '32px auto', maxWidth: '500px', lineHeight: 1.55 }}
          >
            10 vehicles. 55+ products. 8 missions. Real installers. Zero guesswork.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden"
            whileInView="visible" viewport={{ once: true }} custom={3}
            style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link href="/build" className="btn btn-primary btn-lg" data-action="final-cta">
              START BUILD — IT&apos;S FREE
            </Link>
            <Link href="/about" className="btn btn-ghost btn-lg" data-action="final-about">
              LEARN MORE
            </Link>
          </motion.div>

          {/* Stat strip */}
          <motion.div
            variants={fadeIn} initial="hidden"
            whileInView="visible" viewport={{ once: true }} custom={4}
            style={{
              display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap',
              marginTop: '60px', paddingTop: '40px',
              borderTop: '1px solid rgba(255,85,31,0.15)',
            }}
          >
            {['FREE TO USE', 'NO ACCOUNT REQUIRED', 'INSTANT QUOTE EXPORT'].map((label) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--orange)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  )
}
