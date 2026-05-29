'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

// ─── SSR-safe deterministic pseudo-random ────────────────────────────────────
function lcg(s: number) {
  return ((1664525 * s + 1013904223) & 0x7fffffff) / 0x7fffffff
}

// Embers drift in the left/dark zone only
const EMBERS = Array.from({ length: 10 }, (_, i) => ({
  id:     i,
  left:   Math.round(lcg(i * 11 + 1) * 40),
  top:    35 + Math.round(lcg(i * 11 + 2) * 500) / 10,
  size:   parseFloat((0.9 + lcg(i * 11 + 3) * 1.8).toFixed(1)),
  op:     parseFloat((0.22 + lcg(i * 11 + 4) * 0.38).toFixed(2)),
  dur:    parseFloat((5 + lcg(i * 11 + 5) * 9).toFixed(1)),
  dly:    parseFloat((lcg(i * 11 + 6) * 8).toFixed(1)),
  driftX: Math.round((lcg(i * 11 + 7) - 0.5) * 48),
  rise:   Math.round(40 + lcg(i * 11 + 8) * 90),
}))

// ─── Splatter blob positions (boundary between dark and orange) ───────────────
const BLOBS = [
  { cx: '35%', cy: '22%', rx: '8%',  ry: '14%', op: 0.94 },
  { cx: '41%', cy: '64%', rx: '6%',  ry: '10%', op: 0.90 },
  { cx: '33%', cy: '48%', rx: '4%',  ry: '7%',  op: 0.96 },
  { cx: '44%', cy: '35%', rx: '3.5%',ry: '6%',  op: 0.82 },
  { cx: '38%', cy: '78%', rx: '5%',  ry: '8%',  op: 0.88 },
  { cx: '46%', cy: '55%', rx: '3%',  ry: '5%',  op: 0.78 },
  { cx: '30%', cy: '33%', rx: '3%',  ry: '4%',  op: 0.92 },
  { cx: '42%', cy: '88%', rx: '4%',  ry: '6%',  op: 0.85 },
  { cx: '48%', cy: '18%', rx: '2.5%',ry: '4%',  op: 0.72 },
  { cx: '36%', cy: '90%', rx: '3.5%',ry: '5%',  op: 0.80 },
  { cx: '50%', cy: '42%', rx: '2%',  ry: '3.5%',op: 0.65 },
  { cx: '29%', cy: '62%', rx: '2.5%',ry: '4%',  op: 0.88 },
]

interface Props { introComplete: boolean }

export default function CinematicHero({ introComplete }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  // THE CHAOS pulse fires at t=4520ms after introComplete (spec: §ANIMATIONS)
  const [chaosLive, setChaosLive] = useState(false)

  useEffect(() => {
    if (!introComplete) return
    const t = setTimeout(() => setChaosLive(true), 4520)
    return () => clearTimeout(t)
  }, [introComplete])

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])

  const show = introComplete

  // Spec: fadeUp entries — opacity:0, y:14px, blur:8px → settled
  const fadeUp = (delay = 0) => ({
    initial:    { opacity: 0, y: 14, filter: 'blur(8px)' },
    animate:    show ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 14, filter: 'blur(8px)' },
    transition: { duration: 1.0, ease: [0.2, 0.7, 0.2, 1] as const, delay },
  })

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 600,
        overflow: 'hidden',
        background: '#050505',
      }}
      aria-label="Hero"
    >

      {/* ══════════════════════════════════════════════════════════════════════
          BACKGROUND — orange workshop atmosphere (pure CSS).
          Replace the <img> below with hero-robot.png once asset is provided.
      ══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', inset: '-4%',
          y: bgY, willChange: 'transform',
        }}
      >
        {/* Base dark */}
        <div style={{ position: 'absolute', inset: 0, background: '#050505' }} />

        {/* Orange ambient — radiates from right-center */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 68% 92% at 80% 50%,
              rgba(255,106,10,1.0)  0%,
              rgba(220,70,0,0.88)   22%,
              rgba(160,42,0,0.65)   42%,
              rgba(70,16,0,0.28)    62%,
              transparent           80%)
          `,
        }} />

        {/* Hot inner glow — brighter workshop core */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 38% 44% at 76% 52%,
              rgba(255,150,40,0.55) 0%,
              rgba(255,88,10,0.28)  50%,
              transparent           80%)
          `,
        }} />

        {/* Top/bottom darkening within the orange zone */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            linear-gradient(to bottom,
              rgba(0,0,0,0.58) 0%,
              transparent      28%,
              transparent      68%,
              rgba(0,0,0,0.72) 100%)
          `,
        }} />

        {/* Dark left panel — hard dark edge */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            linear-gradient(to right,
              #050505    0%,
              #050505    18%,
              rgba(5,5,5,0.95)  24%,
              rgba(5,5,5,0.60)  32%,
              transparent       46%)
          `,
        }} />

        {/* Paint splatter blobs — SVG for precision irregular shapes */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {BLOBS.map((b, i) => (
            <ellipse
              key={i}
              cx={b.cx} cy={b.cy}
              rx={b.rx} ry={b.ry}
              fill={`rgba(5,5,5,${b.op})`}
            />
          ))}
        </svg>

        {/* Blueprint grid — 120px lines, opacity .55 per spec */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: [
            'linear-gradient(rgba(243,237,226,0.028) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(243,237,226,0.028) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '120px 120px',
          opacity: 0.55,
          maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
        }} />

        {/* CRT scanlines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.032) 2px,rgba(0,0,0,0.032) 4px)',
        }} />

        {/* Grain texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.09,
          animation: 'grainShift 0.9s steps(6) infinite',
          mixBlendMode: 'overlay',
          zIndex: 9999,
        }} />
      </motion.div>

      {/* ── ROBOT CHARACTER — replace src when asset available ─────── */}
      {/*
        <motion.img
          src="/hero-robot.png"
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0, x: 40 }}
          animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{
            position: 'absolute', bottom: 0, right: '4%',
            width: 'clamp(320px, 42vw, 680px)',
            height: 'auto', objectFit: 'contain', objectPosition: 'bottom',
            zIndex: 8, pointerEvents: 'none',
            filter: 'drop-shadow(0 0 40px rgba(255,100,20,0.4))',
          }}
        />
      */}

      {/* ── EMBERS (dark zone) ──────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 3 }}>
        {EMBERS.map(p => (
          <motion.div
            key={p.id}
            animate={{
              y:       [0, -p.rise, -p.rise * 1.2],
              x:       [0, p.driftX * 0.3, p.driftX],
              opacity: [0, p.op, p.op * 0.5, 0],
              scale:   [0.1, 1, 0.55, 0],
            }}
            transition={{ duration: p.dur, delay: p.dly, repeat: Infinity, ease: [0.12, 0, 0.88, 1] }}
            style={{
              position: 'absolute',
              left: p.left + '%', top: p.top + '%',
              width: p.size, height: p.size, borderRadius: '50%',
              background: 'rgba(255,90,18,0.9)',
              boxShadow: `0 0 ${p.size * 2.8}px rgba(255,78,16,0.65)`,
            }}
          />
        ))}
      </div>

      {/* ── SCANNING LINE ───────────────────────────────────────────── */}
      <motion.div
        animate={{ top: ['0%', '108%'] }}
        transition={{ duration: 11, repeat: Infinity, repeatDelay: 18, ease: 'linear' }}
        style={{
          position: 'absolute', left: 0, right: 0, height: 2, pointerEvents: 'none', zIndex: 4,
          background: 'linear-gradient(90deg,transparent,rgba(255,85,31,0.06) 26%,rgba(255,85,31,0.12) 50%,rgba(255,85,31,0.06) 74%,transparent)',
        }}
      />

      {/* ── CORNER BRACKETS — spec: .stage__corner 24px, 1px solid --line-strong ─ */}
      {([
        { top: 20, left: 20,      borderTop:    '1px solid rgba(243,237,226,0.28)', borderLeft:   '1px solid rgba(243,237,226,0.28)' },
        { top: 20, right: 20,     borderTop:    '1px solid rgba(243,237,226,0.28)', borderRight:  '1px solid rgba(243,237,226,0.28)' },
        { bottom: 54, left: 20,   borderBottom: '1px solid rgba(243,237,226,0.28)', borderLeft:   '1px solid rgba(243,237,226,0.28)' },
        { bottom: 54, right: 20,  borderBottom: '1px solid rgba(243,237,226,0.28)', borderRight:  '1px solid rgba(243,237,226,0.28)' },
      ] as React.CSSProperties[]).map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.65, delay: 2.6 + i * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ position: 'absolute', width: 24, height: 24, pointerEvents: 'none', zIndex: 10, ...s }}
        />
      ))}

      {/* ── LEFT HUD TICKS — spec: N44°→N40°, mono 9px, .25em tracking ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9, delay: 1.6 }}
        style={{
          position: 'absolute', left: 22, top: 0, bottom: 38,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly',
          paddingTop: 70, paddingBottom: 55,
          pointerEvents: 'none', zIndex: 10,
        }}
      >
        {[44, 43, 42, 41, 40].map(lat => (
          <div key={lat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 1, background: 'rgba(243,237,226,0.22)', flexShrink: 0 }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              letterSpacing: '0.25em', color: 'var(--ink-faint)',
              textTransform: 'uppercase',
            }}>
              N {lat}°
            </span>
          </div>
        ))}
      </motion.div>

      {/* ── TOP-RIGHT HUD ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9, delay: 1.7 }}
        style={{
          position: 'absolute', top: 22, right: 22,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
          pointerEvents: 'none', zIndex: 10,
          fontFamily: 'var(--font-mono)', fontSize: '9px',
          letterSpacing: '0.25em', color: 'var(--ink-faint)',
        }}
      >
        <span>44°N · 110°W</span>
        <span>95.8° HDG</span>
      </motion.div>

      {/* ── BOTTOM-RIGHT HUD — ELEVATION / HEADING / STATUS ─────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9, delay: 1.8 }}
        style={{
          position: 'absolute', right: 24, bottom: 44,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6,
          pointerEvents: 'none', zIndex: 10,
        }}
      >
        {[
          { label: 'ELEVATION', value: '11,420 FT', orange: false },
          { label: 'HEADING',   value: '284° W',    orange: false },
          { label: 'STATUS',    value: 'ARMED',     orange: true  },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              letterSpacing: '0.25em', color: 'var(--ink-faint)',
              textTransform: 'uppercase',
            }}>
              {row.label}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              letterSpacing: '0.06em',
              color: row.orange ? 'var(--orange)' : 'var(--ink-dim)',
              textShadow: row.orange ? '0 0 10px rgba(255,85,31,0.5)' : 'none',
            }}>
              {row.value}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO CONTENT — vertically centered, left padding per spec
          spec: paddingLeft clamp(96px,9vw,188px), col max-width 780px, translateY(-3vh)
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="hero-text-panel"
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(calc(-50% - 3vh))',
          left: 0,
          paddingLeft: 'clamp(96px, 9vw, 188px)',
          paddingRight: '5vw',
          maxWidth: 'clamp(420px, 50vw, 780px)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >

        {/* EYEBROW — spec: .hero__meta, 13px tactical, 700, .42em tracking */}
        <motion.div {...fadeUp(1.8)} style={{ marginBottom: 22, pointerEvents: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-tactical)',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.42em',
            color: 'var(--orange)',
            textTransform: 'uppercase',
          }}>
            BUILD. EQUIP. EXPLORE.
          </span>
        </motion.div>

        {/* TITLE — spec: clamp(64px,7.6vw,132px), weight 700, tracking .005em */}
        <div style={{ marginBottom: 24, pointerEvents: 'auto', willChange: 'filter, transform, opacity' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(64px, 7.6vw, 132px)',
            lineHeight: 0.88,
            letterSpacing: '0.005em',
            fontWeight: 700,
            margin: 0,
            textTransform: 'uppercase',
          }}>
            {/* .l1 "Control" — blurUp 1.4s, delay 2.1s from introComplete */}
            <motion.span
              className="l1"
              initial={{ opacity: 0, y: 20, filter: 'blur(14px)' }}
              animate={show
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 20, filter: 'blur(14px)' }
              }
              transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1], delay: 2.1 }}
              style={{
                display: 'block',
                color: 'var(--ink)',
                textShadow: '0 2px 52px rgba(0,0,0,0.92)',
              }}
            >
              CONTROL
            </motion.span>
            {/* .l2 "The Chaos" — blurUp 1.4s, delay 2.5s; chaos-live class at t=4520ms */}
            <motion.span
              className={`l2${chaosLive ? ' chaos-live' : ''}`}
              initial={{ opacity: 0, y: 20, filter: 'blur(14px)' }}
              animate={chaosLive
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : show
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 20, filter: 'blur(14px)' }
              }
              transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1], delay: 2.5 }}
              style={{
                display: 'block',
                color: 'var(--orange)',
                textShadow: chaosLive
                  ? undefined  /* chaosPulse keyframe takes over */
                  : '0 0 36px rgba(255,85,31,0.55), 0 0 80px rgba(255,85,31,0.18), 0 2px 52px rgba(0,0,0,0.9)',
              }}
            >
              THE CHAOS
            </motion.span>
          </h1>
        </div>

        {/* BODY TEXT — spec: .hero__sub, 16px body, weight 300, ink-dim */}
        <motion.div {...fadeUp(3.8)} style={{ marginBottom: 32, pointerEvents: 'auto' }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            fontWeight: 300,
            color: 'var(--ink-dim)',
            margin: 0,
            lineHeight: 1.65,
            maxWidth: '38ch',
          }}>
            The all-in-one platform for building, customizing, and outfitting your vehicle for any expedition.
          </p>
        </motion.div>

        {/* CTA BUTTONS — spec: btn-hero 13.5px, display font, 600, .3em tracking */}
        <motion.div
          {...fadeUp(4.2)}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', pointerEvents: 'auto' }}
        >
          <Link href="/build">
            <motion.button
              whileHover={{
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,.35), 0 18px 50px rgba(255,85,31,.55), 0 0 60px rgba(255,85,31,.35)',
                scale: 1.02,
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '13.5px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                padding: '19px 30px',
                background: 'var(--orange)',
                color: '#0a0604',
                border: 'none',
                borderRadius: 2,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25), 0 12px 30px rgba(255,85,31,.36), 0 0 0 1px rgba(255,85,31,.4)',
                transition: 'box-shadow 0.15s, transform 0.15s',
              }}
              data-action="hero-start-build"
            >
              START YOUR BUILD
              <span style={{ display: 'inline-block', transition: 'width 0.35s', fontSize: '0.9em' }}>→</span>
            </motion.button>
          </Link>

          <Link href="/builds">
            <motion.button
              whileHover={{
                borderColor: 'rgba(243,237,226,0.28)',
                color: 'rgba(243,237,226,0.78)',
                background: 'rgba(243,237,226,0.04)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '13.5px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                padding: '19px 24px',
                background: 'rgba(243,237,226,0.02)',
                border: '1px solid rgba(243,237,226,0.14)',
                color: 'var(--ink-dim)',
                cursor: 'pointer',
                borderRadius: 2,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                backdropFilter: 'blur(12px)',
                transition: 'all 0.15s',
              }}
              data-action="hero-explore-builds"
            >
              EXPLORE BUILDS
              <span style={{ display: 'inline-block', fontSize: '0.9em' }}>→</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* ── RESPONSIVE ──────────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .hero-text-panel {
            top: auto !important;
            bottom: 12% !important;
            transform: none !important;
            max-width: 92% !important;
            padding-right: clamp(20px, 4vw, 48px) !important;
          }
        }
      `}</style>
    </section>
  )
}
