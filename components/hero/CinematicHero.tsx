'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

// ─── SSR-safe deterministic pseudo-random ───────────────────────────────────
function lcg(s: number) {
  return ((1664525 * s + 1013904223) & 0x7fffffff) / 0x7fffffff
}

const EMBERS = Array.from({ length: 24 }, (_, i) => ({
  id:     i,
  left:   Math.round(lcg(i * 13 + 1) * 1000) / 10,
  top:    46 + Math.round(lcg(i * 13 + 2) * 480) / 10,
  size:   parseFloat((1.2 + lcg(i * 13 + 3) * 2.8).toFixed(1)),
  op:     parseFloat((0.36 + lcg(i * 13 + 4) * 0.55).toFixed(2)),
  dur:    parseFloat((5 + lcg(i * 13 + 5) * 9.5).toFixed(1)),
  dly:    parseFloat((lcg(i * 13 + 6) * 8.5).toFixed(1)),
  driftX: Math.round((lcg(i * 13 + 7) - 0.5) * 82),
  rise:   Math.round(52 + lcg(i * 13 + 8) * 112),
}))

const FOG = [
  { id: 0, top: 30, dur: 28, dly: 0,  dir:  1 },
  { id: 1, top: 38, dur: 22, dly: 6,  dir: -1 },
  { id: 2, top: 46, dur: 34, dly: 13, dir:  1 },
  { id: 3, top: 54, dur: 19, dly: 4,  dir: -1 },
]

interface Props {
  introComplete: boolean
}

export default function CinematicHero({ introComplete }: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  // Subtle parallax — reduced because background is less over-zoomed
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  const show = introComplete

  const fadeUp = (delay = 0, yOffset = 18) => ({
    initial:    { opacity: 0, y: yOffset },
    animate:    show ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset },
    transition: { duration: 0.78, ease: [0.16, 1, 0.3, 1] as const, delay },
  })

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 600,
        overflow: 'hidden',
        background: '#030201',
      }}
      aria-label="Hero"
    >

      {/* ── BACKGROUND IMAGE ────────────────────────────────────────
          inset reduced from -10% → -4% so more of the environment
          is visible (zoomed-out feel, more truck + mountains in frame)
      ──────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ scale: 1.04, opacity: 0 }}
        animate={show ? { scale: 1, opacity: 1 } : { scale: 1.04, opacity: 0 }}
        transition={{ duration: 1.50, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', inset: '-4%',
          y: bgY, willChange: 'transform',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-vehicle.jpg"
          alt=""
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 48%',
            display: 'block',
          }}
        />
      </motion.div>

      {/* ── FOG WISPS ─────────────────────────────────────────────── */}
      {FOG.map(f => (
        <motion.div
          key={f.id}
          animate={{
            x:       [`${-13 * f.dir}%`, `${13 * f.dir}%`, `${-13 * f.dir}%`],
            opacity: [0.04, 0.09, 0.04],
          }}
          transition={{ duration: f.dur, delay: f.dly, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: f.top + '%', left: '-16%',
            width: '132%', height: '9%',
            background: 'linear-gradient(to bottom, transparent, rgba(210,225,238,0.12), transparent)',
            filter: 'blur(24px)', pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── CAMPFIRE GLOW ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 34% 22% at 50% 68%, rgba(255,85,31,0.20) 0%, rgba(255,130,22,0.04) 52%, transparent 70%)',
        opacity: show ? 1 : 0, transition: 'opacity 1.2s ease 0.5s',
      }} />
      <motion.div
        animate={{ opacity: [0.09, 0.22, 0.06, 0.17, 0.09], scale: [1, 1.12, 0.92, 1.06, 1] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 13% 9% at 50% 71%, rgba(255,145,42,0.20) 0%, transparent 70%)',
        }}
      />

      {/* ── VIGNETTE + DIRECTIONAL SHADOWS ───────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 72% 66% at 50% 50%, transparent 0%, rgba(0,0,0,0.28) 52%, rgba(0,0,0,0.88) 100%)',
      }} />
      {/* Top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '26%', pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)',
      }} />
      {/* Bottom — reduced height since text floats above the bumper now */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '32%', pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%)',
      }} />
      {/* Left — boosts text legibility without hiding the truck body */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: '38%', pointerEvents: 'none',
        background: 'linear-gradient(to right, rgba(0,0,0,0.48) 0%, transparent 100%)',
      }} />

      {/* ── SCANLINES ────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.038) 2px,rgba(0,0,0,0.038) 4px)',
        opacity: show ? 1 : 0, transition: 'opacity 1s ease 0.8s',
      }} />
      <motion.div
        animate={{ top: ['0%', '108%'] }}
        transition={{ duration: 10, repeat: Infinity, repeatDelay: 16, ease: 'linear' }}
        style={{
          position: 'absolute', left: 0, right: 0, height: 2, pointerEvents: 'none',
          background: 'linear-gradient(90deg,transparent,rgba(255,85,31,0.07) 28%,rgba(255,85,31,0.13) 50%,rgba(255,85,31,0.07) 72%,transparent)',
        }}
      />

      {/* ── EMBERS ───────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {EMBERS.map(p => (
          <motion.div
            key={p.id}
            animate={{
              y:       [0, -p.rise, -p.rise * 1.25],
              x:       [0, p.driftX * 0.4, p.driftX],
              opacity: [0, p.op, p.op * 0.6, 0],
              scale:   [0.12, 1, 0.6, 0],
            }}
            transition={{ duration: p.dur, delay: p.dly, repeat: Infinity, ease: [0.12, 0, 0.88, 1] }}
            style={{
              position: 'absolute', left: p.left + '%', top: p.top + '%',
              width: p.size, height: p.size, borderRadius: '50%',
              background: 'rgba(255,90,18,0.92)',
              boxShadow: `0 0 ${p.size * 2.8}px rgba(255,78,16,0.68)`,
            }}
          />
        ))}
      </div>

      {/* ── CORNER BRACKETS ──────────────────────────────────────── */}
      {([
        { top: 20, left: 20,     borderTop:    '1px solid rgba(255,85,31,0.18)', borderLeft:   '1px solid rgba(255,85,31,0.18)' },
        { top: 20, right: 20,    borderTop:    '1px solid rgba(255,85,31,0.18)', borderRight:  '1px solid rgba(255,85,31,0.18)' },
        { bottom: 20, left: 20,  borderBottom: '1px solid rgba(255,85,31,0.18)', borderLeft:   '1px solid rgba(255,85,31,0.18)' },
        { bottom: 20, right: 20, borderBottom: '1px solid rgba(255,85,31,0.18)', borderRight:  '1px solid rgba(255,85,31,0.18)' },
      ] as React.CSSProperties[]).map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.70 }}
          animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.70 }}
          transition={{ duration: 0.70, delay: 0.12 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', width: 26, height: 26, pointerEvents: 'none', ...s }}
        />
      ))}

      {/* ══════════════════════════════════════════════════════════════
          HERO TEXT — left side, floated UP off the bumper/wheel zone.
          bottom: 14% keeps the block clear of the lower truck detail.
          max-width constrains text to ~42vw so the 4Runner owns
          the center-right of the frame.
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="hero-text-panel"
        style={{
          position: 'absolute',
          bottom: '14%',
          left: 0,
          padding: 'clamp(24px,4.5vw,64px)',
          paddingRight: 0,
          paddingBottom: 0,
          maxWidth: 'clamp(300px,42vw,500px)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >

        {/* EYEBROW */}
        <motion.div {...fadeUp(0.30)} style={{ marginBottom: 18, pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 1, background: 'rgba(255,85,31,0.62)', flexShrink: 0 }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 'clamp(7px,0.82vw,10px)',
              letterSpacing: '0.34em', color: 'rgba(255,85,31,0.85)',
              textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              BŌRYKU EXPEDITION SYSTEMS
            </span>
          </div>
        </motion.div>

        {/* TITLE — blur-sharp cinematic reveal */}
        <motion.div
          initial={{ opacity: 0, y: 26, filter: 'blur(16px)' }}
          animate={show
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : { opacity: 0, y: 26, filter: 'blur(16px)' }
          }
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
          style={{ marginBottom: 20, pointerEvents: 'auto', willChange: 'filter, transform, opacity' }}
        >
          <h1 style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(42px,7vw,102px)',
            lineHeight: 0.90, letterSpacing: '0.04em',
            margin: 0,
          }}>
            <span style={{ display: 'block', color: '#fff', textShadow: '0 2px 60px rgba(0,0,0,0.80)' }}>
              CONTROL
            </span>
            <span style={{
              display: 'block', color: 'var(--orange)',
              textShadow: '0 0 38px rgba(255,85,31,0.52), 0 0 80px rgba(255,85,31,0.16), 0 2px 60px rgba(0,0,0,0.80)',
            }}>
              THE CHAOS
            </span>
          </h1>
        </motion.div>

        {/* SUBTITLE */}
        <motion.div {...fadeUp(0.52)} style={{ marginBottom: 28, pointerEvents: 'auto' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(7.5px,0.92vw,11px)',
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.34)', margin: 0, lineHeight: 1.95,
          }}>
            BUILD YOUR OVERLAND RIG · SPEC YOUR KIT
            <br />
            FIND YOUR INSTALLER · OWN THE TERRAIN
          </p>
        </motion.div>

        {/* CTA BUTTONS */}
        <motion.div
          {...fadeUp(0.62)}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', pointerEvents: 'auto' }}
        >
          <Link href="/build">
            <motion.button
              whileHover={{ boxShadow: '0 0 30px rgba(255,85,31,0.42), 0 0 8px rgba(255,85,31,0.22)', scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.16 }}
              className="btn btn-primary"
              style={{ fontSize: '0.72rem', padding: '12px 28px' }}
              data-action="hero-start-build"
            >
              START YOUR BUILD
            </motion.button>
          </Link>
          <Link href="/builds">
            <motion.button
              whileHover={{ borderColor: 'rgba(255,255,255,0.26)', color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.04)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.16 }}
              style={{
                fontFamily: 'var(--font-rajdhani)', fontWeight: 700,
                fontSize: '0.72rem', letterSpacing: '0.18em',
                padding: '12px 22px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.13)',
                color: 'rgba(255,255,255,0.50)',
                cursor: 'pointer', textTransform: 'uppercase', borderRadius: 2,
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                transition: 'all 0.16s',
              }}
              data-action="hero-explore-builds"
            >
              EXPLORE BUILDS
            </motion.button>
          </Link>
        </motion.div>

        {/* STATS ROW */}
        <motion.div
          {...fadeUp(0.72)}
          style={{ display: 'flex', gap: 22, marginTop: 28, pointerEvents: 'none' }}
        >
          {[['347','ACTIVE BUILDS'],['55+','GEAR PRODUCTS'],['18','INSTALLERS']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(17px,2.1vw,26px)', color: 'rgba(255,255,255,0.76)', lineHeight: 1, letterSpacing: '0.04em' }}>{n}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 6.5, letterSpacing: '0.17em', color: 'rgba(255,255,255,0.19)', marginTop: 3, textTransform: 'uppercase' }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── RESPONSIVE ───────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 860px) {
          .hero-text-panel {
            bottom: 8% !important;
            max-width: 92% !important;
            padding-right: clamp(24px,4.5vw,64px) !important;
          }
        }
      `}</style>
    </section>
  )
}
