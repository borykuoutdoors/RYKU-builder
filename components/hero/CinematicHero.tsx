'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'

// ─── SSR-safe deterministic pseudo-random ───────────────────────────────────
function lcg(s: number) {
  return ((1664525 * s + 1013904223) & 0x7fffffff) / 0x7fffffff
}

const EMBERS = Array.from({ length: 28 }, (_, i) => ({
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
  { id: 0, top: 29, dur: 26, dly: 0,  dir:  1 },
  { id: 1, top: 37, dur: 20, dly: 5,  dir: -1 },
  { id: 2, top: 44, dur: 31, dly: 11, dir:  1 },
  { id: 3, top: 51, dur: 18, dly: 3,  dir: -1 },
]

// ─── Component ──────────────────────────────────────────────────────────────
export default function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Spring-smoothed camera — used for position/scale transforms
  const cam = useSpring(scrollYProgress, { stiffness: 38, damping: 22, restDelta: 0.001 })

  // ═══════════════════════════════════════════════════════════════
  //  LOGO CINEMATIC SHRINK
  //  700×700px base element. Shrinks to 0.090 ≈ 63px (truck door).
  //  Moves slightly left + down to land on the truck door logo.
  // ═══════════════════════════════════════════════════════════════
  const logoScale  = useTransform(cam,             [0, 0.62], [1,    0.090])
  const logoX      = useTransform(cam,             [0, 0.62], [0,    -38])   // left toward door
  const logoY      = useTransform(cam,             [0, 0.62], [0,     44])   // down toward door
  // Fade logo out at end — truck's real door logo "takes over"
  const logoOp     = useTransform(scrollYProgress, [0.58, 0.76], [1, 0])
  // Glow behind logo reduces as logo shrinks
  const glowOp     = useTransform(cam,             [0, 0.62], [1, 0])

  // ═══════════════════════════════════════════════════════════════
  //  BACKGROUND REVEAL
  //  Environment starts hidden, fades in as logo shrinks.
  //  Isolation overlay keeps logo crisp against pure dark initially.
  // ═══════════════════════════════════════════════════════════════
  const bgOp       = useTransform(scrollYProgress, [0.04, 0.66], [0, 1])
  const bgScale    = useTransform(cam,             [0, 0.80],    [1.04, 1.18])
  // Dark overlay fades away as environment reveals
  const isoOp      = useTransform(scrollYProgress, [0, 0.06, 0.66], [0.94, 0.86, 0])

  // ═══════════════════════════════════════════════════════════════
  //  ATMOSPHERE
  // ═══════════════════════════════════════════════════════════════
  const vigOp      = useTransform(cam,             [0.06, 0.74], [0.06, 0.82])
  const fireGlow   = useTransform(cam,             [0.08, 0.72], [0.06, 0.46])
  const scanOp     = useTransform(scrollYProgress, [0.52, 0.82], [0, 0.058])

  // ═══════════════════════════════════════════════════════════════
  //  TEXT + UI REVEALS  (staggered after logo lands)
  // ═══════════════════════════════════════════════════════════════
  const eyeOp    = useTransform(scrollYProgress, [0.64, 0.77], [0, 1])
  const eyeY     = useTransform(cam,             [0.64, 0.77], [18, 0])

  const titleOp  = useTransform(scrollYProgress, [0.70, 0.83], [0, 1])
  const titleBlur= useTransform(scrollYProgress, [0.70, 0.83], ['blur(24px)', 'blur(0px)'])
  const titleY   = useTransform(cam,             [0.70, 0.83], [26, 0])
  const titleSc  = useTransform(cam,             [0.70, 0.86], [0.93, 1.0])

  const subOp    = useTransform(scrollYProgress, [0.78, 0.90], [0, 1])
  const subY     = useTransform(cam,             [0.78, 0.90], [16, 0])

  const ctaOp    = useTransform(scrollYProgress, [0.84, 0.93], [0, 1])
  const ctaY     = useTransform(cam,             [0.84, 0.93], [14, 0])

  const cfgOp    = useTransform(scrollYProgress, [0.86, 0.96], [0, 1])
  const cfgY     = useTransform(cam,             [0.86, 0.96], [52, 0])
  const cfgBlur  = useTransform(scrollYProgress, [0.86, 0.95], ['blur(18px)', 'blur(0px)'])

  const statsOp  = useTransform(scrollYProgress, [0.90, 0.98], [0, 1])
  const statsY   = useTransform(cam,             [0.90, 0.98], [14, 0])

  // ═══════════════════════════════════════════════════════════════
  //  INITIAL STATES
  // ═══════════════════════════════════════════════════════════════
  const blackOp  = useTransform(scrollYProgress, [0, 0.038], [1, 0])
  const hintOp   = useTransform(scrollYProgress, [0, 0.07],  [1, 0])

  return (
    <div ref={containerRef} style={{ position: 'relative', height: '450vh' }}>

      {/* ══════════════════════════════════════════════════════════
          STICKY CINEMATIC VIEWPORT
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        background: '#030201',
      }}>

        {/* ── BACKGROUND IMAGE ──────────────────────────────── */}
        <motion.div style={{
          position: 'absolute',
          inset: '-18%',
          scale: bgScale,
          opacity: bgOp,
          willChange: 'transform',
        }}>
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

        {/* ── ISOLATION OVERLAY ─────────────────────────────── */}
        {/* Keeps logo visually crisp against pure dark while bg is hidden */}
        <motion.div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: '#030201',
          opacity: isoOp,
        }} />

        {/* ── FOG WISPS ─────────────────────────────────────── */}
        {FOG.map(f => (
          <motion.div
            key={f.id}
            animate={{
              x:       [`${-13 * f.dir}%`, `${13 * f.dir}%`, `${-13 * f.dir}%`],
              opacity: [0.04, 0.10, 0.04],
            }}
            transition={{ duration: f.dur, delay: f.dly, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: f.top + '%', left: '-16%',
              width: '132%', height: '9%',
              background: 'linear-gradient(to bottom, transparent, rgba(210,225,238,0.14), transparent)',
              filter: 'blur(24px)', pointerEvents: 'none',
            }}
          />
        ))}

        {/* ── CAMPFIRE GLOW ─────────────────────────────────── */}
        <motion.div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 34% 24% at 50% 68%, rgba(255,85,31,0.30) 0%, rgba(255,130,22,0.07) 54%, transparent 72%)',
          opacity: fireGlow,
        }} />
        <motion.div
          animate={{ opacity: [0.12, 0.28, 0.07, 0.22, 0.12], scale: [1, 1.12, 0.91, 1.06, 1] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 13% 9% at 50% 71%, rgba(255,145,42,0.28) 0%, transparent 70%)',
          }}
        />

        {/* ── VIGNETTE ──────────────────────────────────────── */}
        <motion.div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 68% 62% at 50% 50%, transparent 0%, rgba(0,0,0,0.40) 54%, rgba(0,0,0,0.92) 100%)',
          opacity: vigOp,
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '30%', pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.80) 0%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '44%', pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(0,0,0,0.94) 0%, transparent 100%)',
        }} />

        {/* ── SCANLINES ─────────────────────────────────────── */}
        <motion.div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.10) 2px,rgba(0,0,0,0.10) 4px)',
          opacity: scanOp,
        }} />
        <motion.div
          animate={{ top: ['0%', '108%'] }}
          transition={{ duration: 7.5, repeat: Infinity, repeatDelay: 12, ease: 'linear' }}
          style={{
            position: 'absolute', left: 0, right: 0, height: 2, pointerEvents: 'none',
            background: 'linear-gradient(90deg,transparent,rgba(255,85,31,0.10) 26%,rgba(255,85,31,0.18) 50%,rgba(255,85,31,0.10) 74%,transparent)',
          }}
        />

        {/* ── EMBERS ────────────────────────────────────────── */}
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

        {/* ── CORNER BRACKETS ───────────────────────────────── */}
        {([
          { top: 20, left: 20,  borderTop:    '1px solid rgba(255,85,31,0.22)', borderLeft:  '1px solid rgba(255,85,31,0.22)' },
          { top: 20, right: 20, borderTop:    '1px solid rgba(255,85,31,0.22)', borderRight: '1px solid rgba(255,85,31,0.22)' },
          { bottom: 20, left: 20,  borderBottom: '1px solid rgba(255,85,31,0.22)', borderLeft:  '1px solid rgba(255,85,31,0.22)' },
          { bottom: 20, right: 20, borderBottom: '1px solid rgba(255,85,31,0.22)', borderRight: '1px solid rgba(255,85,31,0.22)' },
        ] as React.CSSProperties[]).map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: 28, height: 28, pointerEvents: 'none', ...s }} />
        ))}

        {/* ══════════════════════════════════════════════════════════
            LOGO — THE CINEMATIC SHRINK
            Starts 700×700px (fullscreen-dominating), shrinks to 63px,
            drifts slightly left+down to land on the truck door logo.
            Fades out at final position — truck's real logo takes over.
        ══════════════════════════════════════════════════════════ */}
        {/* Static centering wrapper — never animated */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 20, pointerEvents: 'none',
        }}>
          {/* Animated wrapper — x/y/scale/opacity */}
          <motion.div style={{
            x: logoX,
            y: logoY,
            scale: logoScale,
            opacity: logoOp,
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
          }}>
            {/* Outer bloom — large diffuse glow, fades with logo */}
            <motion.div style={{
              position: 'absolute',
              inset: '-42%',
              background: 'radial-gradient(circle, rgba(255,85,31,0.52) 0%, rgba(255,85,31,0.18) 36%, rgba(255,85,31,0.04) 62%, transparent 78%)',
              filter: 'blur(28px)',
              opacity: glowOp,
              pointerEvents: 'none',
            }} />

            {/* Inner pulse — organic breathing effect */}
            <motion.div
              animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.88, 0.55] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', inset: '-18%',
                background: 'radial-gradient(circle, rgba(255,100,20,0.20) 0%, transparent 65%)',
                pointerEvents: 'none',
              }}
            />

            {/* Logo image — screen blend removes the dark charcoal background */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ryku-logo-icon.jpg"
              alt="BŌRYKU"
              style={{
                display: 'block',
                width: 700,
                height: 700,
                objectFit: 'contain',
                mixBlendMode: 'screen',
              }}
            />
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            TEXT CONTENT  —  reveals after logo lands
        ══════════════════════════════════════════════════════════ */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: 'clamp(28px,5vw,72px)',
          pointerEvents: 'none',
        }}>

          {/* EYEBROW */}
          <motion.div style={{ opacity: eyeOp, y: eyeY, marginBottom: 18, pointerEvents: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 36, height: 1, background: 'rgba(255,85,31,0.65)', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(7px,0.92vw,10px)',
                letterSpacing: '0.36em',
                color: 'rgba(255,85,31,0.90)',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                BŌRYKU EXPEDITION SYSTEMS
              </span>
              <div style={{ width: 36, height: 1, background: 'rgba(255,85,31,0.65)', flexShrink: 0 }} />
            </div>
          </motion.div>

          {/* "CONTROL THE CHAOS" — blur-sharp reveal */}
          <motion.div style={{
            opacity: titleOp,
            y: titleY,
            scale: titleSc,
            filter: titleBlur,
            transformOrigin: 'left bottom',
            marginBottom: 22,
            willChange: 'filter, transform, opacity',
            pointerEvents: 'auto',
          }}>
            <h1 style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(50px,9.2vw,142px)',
              lineHeight: 0.88,
              letterSpacing: '0.04em',
              margin: 0,
              color: '#fff',
              textShadow: '0 2px 80px rgba(0,0,0,0.88)',
            }}>
              CONTROL
              <br />
              <span style={{
                color: 'var(--orange)',
                textShadow: '0 0 48px rgba(255,85,31,0.58), 0 0 110px rgba(255,85,31,0.20), 0 2px 80px rgba(0,0,0,0.88)',
              }}>
                THE CHAOS
              </span>
            </h1>
          </motion.div>

          {/* SUBTITLE */}
          <motion.div style={{ opacity: subOp, y: subY, marginBottom: 30, pointerEvents: 'auto' }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(8px,1.08vw,11px)',
              letterSpacing: '0.24em',
              color: 'rgba(255,255,255,0.40)',
              textTransform: 'uppercase',
              margin: 0,
              lineHeight: 1.9,
            }}>
              BUILD YOUR OVERLAND RIG · SPEC YOUR KIT
              <br />
              FIND YOUR INSTALLER · OWN THE TERRAIN
            </p>
          </motion.div>

          {/* CTA BUTTONS */}
          <motion.div style={{
            opacity: ctaOp, y: ctaY,
            display: 'flex', gap: 12, flexWrap: 'wrap',
            pointerEvents: 'auto',
          }}>
            <Link href="/build">
              <button
                className="btn btn-primary"
                style={{ fontSize: '0.72rem', padding: '11px 28px' }}
                data-action="hero-start-build"
              >
                START BUILD
              </button>
            </Link>
            <Link href="/builds">
              <button
                style={{
                  fontFamily: 'var(--font-rajdhani)', fontWeight: 700,
                  fontSize: '0.72rem', letterSpacing: '0.18em',
                  padding: '11px 22px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  color: 'rgba(255,255,255,0.60)',
                  cursor: 'pointer', textTransform: 'uppercase', borderRadius: 2,
                  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                  transition: 'all 0.2s',
                }}
                data-action="hero-view-builds"
              >
                VIEW BUILDS
              </button>
            </Link>
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            GLASSMORPHISM CONFIGURATOR PANEL
        ══════════════════════════════════════════════════════════ */}
        <div
          className="cinematic-config-panel"
          style={{
            position: 'absolute',
            right: 'clamp(24px,4vw,64px)',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 'clamp(268px,22vw,350px)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <motion.div style={{
            opacity: cfgOp, y: cfgY, filter: cfgBlur,
            willChange: 'filter, transform, opacity',
            pointerEvents: 'auto',
          }}>
            <div style={{
              background: 'rgba(4,3,2,0.72)',
              backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(255,85,31,0.20)',
              borderRadius: 6, overflow: 'hidden',
              boxShadow: '0 8px 60px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.03) inset',
            }}>

              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '14px 18px 13px',
                borderBottom: '1px solid rgba(255,85,31,0.10)',
                background: 'rgba(255,85,31,0.04)',
              }}>
                <motion.span
                  animate={{ opacity: [1, 0.15, 1] }}
                  transition={{ duration: 1.25, repeat: Infinity }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.26em', color: 'rgba(255,85,31,0.75)', textTransform: 'uppercase', flex: 1 }}>
                  BUILD CONFIGURATOR
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.16)' }}>
                  v2.4
                </span>
              </div>

              <div style={{ padding: '16px 18px 18px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', marginBottom: 10 }}>
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
                    padding: '9px 12px', marginBottom: 5,
                    border: `1px solid ${v.active ? 'rgba(255,85,31,0.30)' : 'rgba(255,255,255,0.04)'}`,
                    background: v.active ? 'rgba(255,85,31,0.07)' : 'rgba(255,255,255,0.015)',
                    borderRadius: 3, cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-rajdhani)', fontWeight: 700, fontSize: '0.74rem', letterSpacing: '0.12em', color: v.active ? 'var(--orange)' : 'rgba(255,255,255,0.28)', marginBottom: 2 }}>
                        {v.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.12em', color: v.active ? 'rgba(255,85,31,0.45)' : 'rgba(255,255,255,0.14)' }}>
                        {v.gen}
                      </div>
                    </div>
                    {v.active && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.10em', color: 'rgba(255,85,31,0.70)', background: 'rgba(255,85,31,0.08)', border: '1px solid rgba(255,85,31,0.18)', padding: '2px 6px', borderRadius: 2 }}>
                        SELECTED
                      </div>
                    )}
                  </div>
                ))}

                <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,85,31,0.16) 30%,rgba(255,85,31,0.16) 70%,transparent)', margin: '14px 0' }} />

                <div style={{ display: 'flex', gap: 0, marginBottom: 16 }}>
                  {[['55+','PRODUCTS'],['12','CATEGORIES'],['4','PLATFORMS']].map(([num, label], i) => (
                    <div key={label} style={{ flex: 1, textAlign: 'center', padding: '8px 4px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 20, color: '#fff', lineHeight: 1, letterSpacing: '0.04em' }}>{num}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 6, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.20)', marginTop: 3 }}>{label}</div>
                    </div>
                  ))}
                </div>

                <Link href="/build" style={{ display: 'block' }}>
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.70rem', padding: '11px 0' }}
                    data-action="config-panel-cta"
                  >
                    CONFIGURE YOUR BUILD →
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── STATS ROW ─────────────────────────────────────── */}
        <div style={{
          position: 'absolute',
          bottom: 'clamp(28px,4.5vw,56px)',
          right: 'clamp(24px,4vw,64px)',
          zIndex: 10,
        }}>
          <motion.div style={{ opacity: statsOp, y: statsY }}>
            <div style={{ display: 'flex', gap: 28, alignItems: 'flex-end' }}>
              {[['347','ACTIVE BUILDS'],['55+','GEAR PRODUCTS'],['18','INSTALLERS']].map(([n, l]) => (
                <div key={l} style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(17px,2vw,26px)', color: 'rgba(255,255,255,0.82)', lineHeight: 1, letterSpacing: '0.04em' }}>{n}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 6.5, letterSpacing: '0.17em', color: 'rgba(255,255,255,0.20)', marginTop: 3, textTransform: 'uppercase' }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── SCROLL HINT ───────────────────────────────────── */}
        <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, pointerEvents: 'none' }}>
          <motion.div style={{ opacity: hintOp, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7.5, letterSpacing: '0.30em', color: 'rgba(255,255,255,0.20)', textTransform: 'uppercase' }}>
              SCROLL TO ENTER
            </span>
            <motion.div
              animate={{ opacity: [0.22, 0.65, 0.22], y: [0, 8, 0] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 1, height: 38, background: 'linear-gradient(to bottom, rgba(255,85,31,0.65), transparent)' }}
            />
          </motion.div>
        </div>

        {/* ── INITIAL BLACK FADE ────────────────────────────── */}
        <motion.div style={{
          position: 'absolute', inset: 0, background: '#000',
          opacity: blackOp, pointerEvents: 'none',
        }} />

      </div>

      {/* ── RESPONSIVE ────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 860px) {
          .cinematic-config-panel { display: none !important; }
        }
      `}</style>

    </div>
  )
}
