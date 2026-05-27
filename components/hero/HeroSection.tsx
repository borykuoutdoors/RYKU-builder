'use client'

import Link from 'next/link'
import { useRef, useMemo } from 'react'
import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion'
import HeroStats from './HeroStats'

/* ─── Particle data (26 items, seeded for SSR consistency) ─────────────── */
function generateParticles(count: number) {
  // Deterministic pseudo-random using a simple LCG so server + client match
  let seed = 42
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff
    return seed / 0x7fffffff
  }

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top:    `${rand() * 90 + 5}%`,
    left:   `${rand() * 90 + 5}%`,
    size:   rand() > 0.5 ? 3 : 2,
    color:  rand() > 0.45 ? 'var(--orange)' : 'var(--cyan)',
    delay:  rand() * 4,
    duration: 3 + rand() * 3,
  }))
}

const PARTICLES = generateParticles(26)

/* ─── Animation variants ────────────────────────────────────────────────── */
const lineVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(12px)' },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

/* ─── HeroSection ───────────────────────────────────────────────────────── */
export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)

  // Parallax: background moves up at half scroll speed
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])

  return (
    <section
      ref={containerRef}
      className="hero grid-overlay relative"
      style={{ minHeight: 'calc(100dvh - var(--nav-h) - var(--status-h))' }}
      aria-label="Hero"
    >
      {/* ── Parallax background layer ────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
        aria-hidden="true"
      >
        {/* Atmospheric radial gradients */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 10% 90%, rgba(255,85,31,0.06) 0%, transparent 70%),
              radial-gradient(ellipse 50% 45% at 88% 8%,  rgba(102,255,255,0.06) 0%, transparent 70%)
            `,
          }}
        />

        {/* 26 Floating particles */}
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              top:      p.top,
              left:     p.left,
              width:    p.size,
              height:   p.size,
              background: p.color,
              opacity:  0.55,
              animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </motion.div>

      {/* ── Vertical scan line ───────────────────────────────────────── */}
      <div
        className="scan-line"
        style={{ right: '18%', left: 'auto' }}
        aria-hidden="true"
      />

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-16 flex flex-col items-start justify-center">

        {/* Eyebrow */}
        <motion.p
          className="eyebrow mb-5"
          variants={fadeUp}
          custom={0.05}
          initial="hidden"
          animate="visible"
        >
          OVERLAND BUILD INTELLIGENCE
        </motion.p>

        {/* Hero title — 3 lines */}
        <h1 className="hero-title mb-0 leading-[0.88]">
          <motion.span
            className="block text-[var(--text)]"
            variants={lineVariants}
            custom={0.15}
            initial="hidden"
            animate="visible"
          >
            CONTROL
          </motion.span>

          <motion.span
            className="block"
            style={{ color: 'var(--orange)' }}
            variants={lineVariants}
            custom={0.3}
            initial="hidden"
            animate="visible"
          >
            THE
          </motion.span>

          <motion.span
            className="block text-[var(--text)]"
            variants={lineVariants}
            custom={0.45}
            initial="hidden"
            animate="visible"
          >
            CHAOS
          </motion.span>
        </h1>

        {/* Subtitle */}
        <motion.p
          className="mt-7 text-[var(--text-2)] font-rajdhani text-[1.0625rem] leading-[1.65]"
          style={{ maxWidth: 520 }}
          variants={fadeUp}
          custom={0.62}
          initial="hidden"
          animate="visible"
        >
          Configure your ultimate overland rig. Compatibility-verified gear.
          Real installer network. One tactical platform.
        </motion.p>

        {/* CTA buttons — 3.8rem gap from title */}
        <motion.div
          className="flex flex-wrap gap-4 mt-[3.8rem]"
          variants={fadeUp}
          custom={0.76}
          initial="hidden"
          animate="visible"
        >
          <Link href="/build" className="btn btn-primary btn-lg">
            START BUILD
          </Link>
          <button className="btn btn-outline btn-lg" data-action="explore-builds">
            EXPLORE BUILDS
          </button>
        </motion.div>

        {/* Stats bar — 3.8rem below buttons */}
        <motion.div
          className="w-full mt-[3.8rem]"
          variants={fadeUp}
          custom={0.92}
          initial="hidden"
          animate="visible"
        >
          <HeroStats />
        </motion.div>
      </div>
    </section>
  )
}
