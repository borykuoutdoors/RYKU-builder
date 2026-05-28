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

  // Subtle parallax on background as page scrolls
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])

  const show = introComplete

  // Reusable fade-up entrance helper
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

      {/* ── BACKGROUND IMAGE — subtle zoom-in on reveal ───────────── */}
      <motion.div
        initial={{ scale: 1.06, opacity: 0 }}
        animate={show ? { scale: 1, opacity: 1 } : { scale: 1.06, opacity: 0 }}
        transition={{ duration: 1.50, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', inset: '-10%',
          y: bgY, willChange: 'transform',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-vehicle.jpg"
          alt=""
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 52%',
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
        background: 'radial-gradient(ellipse 34% 22% at 50% 68%, rgba(255,85,31,0.22) 0%, rgba(255,130,22,0.05) 52%, transparent 70%)',
        opacity: show ? 1 : 0, transition: 'opacity 1.2s ease 0.5s',
      }} />
      <motion.div
        animate={{ opacity: [0.10, 0.24, 0.07, 0.19, 0.10], scale: [1, 1.12, 0.91, 1.06, 1] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 13% 9% at 50% 71%, rgba(255,145,42,0.22) 0%, transparent 70%)',
        }}
      />

      {/* ── VIGNETTE + DIRECTIONAL SHADOWS ───────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 64% at 50% 50%, transparent 0%, rgba(0,0,0,0.32) 52%, rgba(0,0,0,0.90) 100%)',
      }} />
      {/* Top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '28%', pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.80) 0%, transparent 100%)',
      }} />
      {/* Bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '42%', pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(0,0,0,0.94) 0%, transparent 100%)',
      }} />
      {/* Left — boosts text legibility */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: '40%', pointerEvents: 'none',
        background: 'linear-gradient(to right, rgba(0,0,0,0.52) 0%, transparent 100%)',
      }} />

      {/* ── SCANLINES ────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.040) 2px,rgba(0,0,0,0.040) 4px)',
        opacity: show ? 1 : 0, transition: 'opacity 1s ease 0.8s',
      }} />
      {/* Slow scan sweep */}
      <motion.div
        animate={{ top: ['0%', '108%'] }}
        transition={{ duration: 10, repeat: Infinity, repeatDelay: 16, ease: 'linear' }}
        style={{
          position: 'absolute', left: 0, right: 0, height: 2, pointerEvents: 'none',
          background: 'linear-gradient(90deg,transparent,rgba(255,85,31,0.08) 28%,rgba(255,85,31,0.14) 50%,rgba(255,85,31,0.08) 72%,transparent)',
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
        { top: 20, left: 20,      borderTop:    '1px solid rgba(255,85,31,0.20)', borderLeft:   '1px solid rgba(255,85,31,0.20)' },
        { top: 20, right: 20,     borderTop:    '1px solid rgba(255,85,31,0.20)', borderRight:  '1px solid rgba(255,85,31,0.20)' },
        { bottom: 20, left: 20,   borderBottom: '1px solid rgba(255,85,31,0.20)', borderLeft:   '1px solid rgba(255,85,31,0.20)' },
        { bottom: 20, right: 20,  borderBottom: '1px solid rgba(255,85,31,0.20)', borderRight:  '1px solid rgba(255,85,31,0.20)' },
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
          LEFT-SIDE TEXT CONTENT
          Text anchored to lower-left. maxWidth keeps it clear of the
          truck which dominates the center/right of the image.
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="hero-text-panel"
        style={{
          position: 'absolute',
          bottom: 0, left: 0,
          padding: 'clamp(24px,4.5vw,68px)',
          paddingRight: 0,
          maxWidth: 'clamp(330px,46vw,540px)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >

        {/* EYEBROW */}
        <motion.div {...fadeUp(0.30)} style={{ marginBottom: 20, pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 1, background: 'rgba(255,85,31,0.65)', flexShrink: 0 }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 'clamp(7px,0.85vw,10px)',
              letterSpacing: '0.34em', color: 'rgba(255,85,31,0.88)',
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
          style={{ marginBottom: 22, pointerEvents: 'auto', willChange: 'filter, transform, opacity' }}
        >
          <h1 style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(44px,7.5vw,108px)',
            lineHeight: 0.90, letterSpacing: '0.04em',
            margin: 0,
          }}>
            <span style={{ display: 'block', color: '#fff', textShadow: '0 2px 60px rgba(0,0,0,0.80)' }}>
              CONTROL
            </span>
            <span style={{
              display: 'block',
              color: 'var(--orange)',
              textShadow: '0 0 38px rgba(255,85,31,0.52), 0 0 80px rgba(255,85,31,0.16), 0 2px 60px rgba(0,0,0,0.80)',
            }}>
              THE CHAOS
            </span>
          </h1>
        </motion.div>

        {/* SUBTITLE */}
        <motion.div {...fadeUp(0.52)} style={{ marginBottom: 30, pointerEvents: 'auto' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(8px,0.95vw,11px)',
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.36)', margin: 0, lineHeight: 1.95,
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
              style={{ fontSize: '0.72rem', padding: '12px 30px' }}
              data-action="hero-start-build"
            >
              START YOUR BUILD
            </motion.button>
          </Link>
          <Link href="/builds">
            <motion.button
              whileHover={{
                borderColor: 'rgba(255,255,255,0.26)',
                color: 'rgba(255,255,255,0.75)',
                background: 'rgba(255,255,255,0.04)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.16 }}
              style={{
                fontFamily: 'var(--font-rajdhani)', fontWeight: 700,
                fontSize: '0.72rem', letterSpacing: '0.18em',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.13)',
                color: 'rgba(255,255,255,0.52)',
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
          style={{
            display: 'flex', gap: 24,
            marginTop: 32, paddingBottom: 'clamp(22px,4vw,52px)',
            pointerEvents: 'none',
          }}
        >
          {[['347','ACTIVE BUILDS'],['55+','GEAR PRODUCTS'],['18','INSTALLERS']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(18px,2.2vw,28px)', color: 'rgba(255,255,255,0.78)', lineHeight: 1, letterSpacing: '0.04em' }}>{n}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 6.5, letterSpacing: '0.17em', color: 'rgba(255,255,255,0.19)', marginTop: 3, textTransform: 'uppercase' }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          RIGHT-SIDE GLASSMORPHISM CONFIGURATOR
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="cinematic-config-panel"
        style={{
          position: 'absolute',
          right: 'clamp(22px,3.5vw,56px)',
          top: '50%', transform: 'translateY(-50%)',
          width: 'clamp(256px,20vw,318px)',
          zIndex: 10, pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 22, filter: 'blur(10px)' }}
          animate={show ? { opacity: 1, x: 0, filter: 'blur(0px)' } : { opacity: 0, x: 22, filter: 'blur(10px)' }}
          transition={{ duration: 0.90, ease: [0.16, 1, 0.3, 1], delay: 0.44 }}
          style={{ pointerEvents: 'auto', willChange: 'filter, transform, opacity' }}
        >
          <div style={{
            background: 'rgba(4,3,2,0.68)',
            backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,85,31,0.17)',
            borderRadius: 6, overflow: 'hidden',
            boxShadow: '0 8px 60px rgba(0,0,0,0.50), 0 1px 0 rgba(255,255,255,0.03) inset',
          }}>

            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '13px 16px 12px',
              borderBottom: '1px solid rgba(255,85,31,0.09)',
              background: 'rgba(255,85,31,0.03)',
            }}>
              <motion.span
                animate={{ opacity: [1, 0.15, 1] }}
                transition={{ duration: 1.25, repeat: Infinity }}
                style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 }}
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.24em', color: 'rgba(255,85,31,0.70)', textTransform: 'uppercase', flex: 1 }}>
                BUILD CONFIGURATOR
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.15)' }}>
                v2.4
              </span>
            </div>

            <div style={{ padding: '14px 16px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.20)', textTransform: 'uppercase', marginBottom: 9 }}>
                SELECT PLATFORM
              </div>

              {[
                { name: 'TOYOTA 4RUNNER', gen: '5TH GEN · TRD PRO', active: true  },
                { name: 'TOYOTA TACOMA',  gen: '3RD GEN · TRD',      active: false },
                { name: 'FORD BRONCO',    gen: '6TH GEN · WILDTRAK', active: false },
                { name: 'JEEP WRANGLER',  gen: 'JL · RUBICON',       active: false },
              ].map(v => (
                <div key={v.name} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 10px', marginBottom: 4,
                  border: `1px solid ${v.active ? 'rgba(255,85,31,0.26)' : 'rgba(255,255,255,0.04)'}`,
                  background: v.active ? 'rgba(255,85,31,0.06)' : 'rgba(255,255,255,0.015)',
                  borderRadius: 3, cursor: 'pointer',
                }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-rajdhani)', fontWeight: 700, fontSize: '0.70rem', letterSpacing: '0.12em', color: v.active ? 'var(--orange)' : 'rgba(255,255,255,0.26)', marginBottom: 1 }}>
                      {v.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.10em', color: v.active ? 'rgba(255,85,31,0.42)' : 'rgba(255,255,255,0.13)' }}>
                      {v.gen}
                    </div>
                  </div>
                  {v.active && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.08em', color: 'rgba(255,85,31,0.66)', background: 'rgba(255,85,31,0.07)', border: '1px solid rgba(255,85,31,0.16)', padding: '2px 5px', borderRadius: 2 }}>
                      ACTIVE
                    </div>
                  )}
                </div>
              ))}

              <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,85,31,0.14) 30%,rgba(255,85,31,0.14) 70%,transparent)', margin: '12px 0' }} />

              <div style={{ display: 'flex', marginBottom: 14 }}>
                {[['55+','PRODUCTS'],['12','CATEGORIES'],['4','PLATFORMS']].map(([num, label], i) => (
                  <div key={label} style={{ flex: 1, textAlign: 'center', padding: '7px 4px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 18, color: '#fff', lineHeight: 1, letterSpacing: '0.04em' }}>{num}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 6, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.18)', marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>

              <Link href="/build" style={{ display: 'block' }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.68rem', padding: '10px 0' }}
                  data-action="config-panel-cta"
                >
                  CONFIGURE YOUR BUILD →
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── RESPONSIVE ───────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 860px) {
          .cinematic-config-panel { display: none !important; }
          .hero-text-panel {
            max-width: 100% !important;
            padding-right: clamp(24px,4.5vw,68px) !important;
          }
        }
      `}</style>
    </section>
  )
}
