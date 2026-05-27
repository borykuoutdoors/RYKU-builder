'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'

// ─── SSR-safe deterministic pseudo-random ───────────────────────────────────
function lcg(s: number) {
  return ((1664525 * s + 1013904223) & 0x7fffffff) / 0x7fffffff
}

// Ember particles — bottom 50% of frame, rising toward sky
const EMBERS = Array.from({ length: 36 }, (_, i) => ({
  id:     i,
  left:   Math.round(lcg(i * 13 + 1) * 1000) / 10,
  top:    48 + Math.round(lcg(i * 13 + 2) * 480) / 10,
  size:   parseFloat((1.4 + lcg(i * 13 + 3) * 3.0).toFixed(1)),
  op:     parseFloat((0.38 + lcg(i * 13 + 4) * 0.58).toFixed(2)),
  dur:    parseFloat((5.5 + lcg(i * 13 + 5) * 9.5).toFixed(1)),
  dly:    parseFloat((lcg(i * 13 + 6) * 8.5).toFixed(1)),
  driftX: Math.round((lcg(i * 13 + 7) - 0.5) * 100),
  rise:   Math.round(55 + lcg(i * 13 + 8) * 130),
  warm:   Math.round(lcg(i * 13 + 9) * 45),
}))

// Fog wisps — simulates valley mist between mountains/trees
const FOG = [
  { id: 0, top: 28, dur: 26, dly: 0,  dirMul:  1 },
  { id: 1, top: 36, dur: 20, dly: 5,  dirMul: -1 },
  { id: 2, top: 42, dur: 32, dly: 11, dirMul:  1 },
  { id: 3, top: 48, dur: 18, dly: 3,  dirMul: -1 },
]

// ─── CinematicHero ──────────────────────────────────────────────────────────
export default function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Spring-smoothed camera — inertia on image transforms only
  const cam = useSpring(scrollYProgress, { stiffness: 36, damping: 22, restDelta: 0.001 })

  // ── CAMERA PUSH (image scale + pan) ─────────────────────────────
  // inset: -20% gives 40% extra image area to move within
  const imgScale = useTransform(cam,             [0, 0.74], [1.04, 1.86])
  const imgX     = useTransform(cam,             [0, 0.74], ['0%', '-5%'])
  const imgY     = useTransform(cam,             [0, 0.74], ['0%', '3.5%'])

  // ── ATMOSPHERE ──────────────────────────────────────────────────
  const vigOpacity  = useTransform(cam,             [0, 0.68], [0.16, 0.80])
  const glowOpacity = useTransform(cam,             [0.06, 0.68], [0.10, 0.48])
  const scanOpacity = useTransform(scrollYProgress, [0.30, 0.74], [0, 0.058])

  // ── INITIAL BLACKOUT ────────────────────────────────────────────
  const blackOpacity = useTransform(scrollYProgress, [0, 0.055], [0.95, 0])

  // ── SCROLL HINT ─────────────────────────────────────────────────
  const hintOpacity  = useTransform(scrollYProgress, [0, 0.07], [1, 0])

  // ── EYEBROW TAG ─────────────────────────────────────────────────
  const eyeOp = useTransform(scrollYProgress, [0.25, 0.40], [0, 1])
  const eyeY  = useTransform(cam,             [0.25, 0.40], [22, 0])

  // ── "CONTROL THE CHAOS" ─────────────────────────────────────────
  const titleOp    = useTransform(scrollYProgress, [0.34, 0.54], [0, 1])
  const titleBlur  = useTransform(scrollYProgress, [0.34, 0.54], ['blur(28px)', 'blur(0px)'])
  const titleY     = useTransform(cam,             [0.34, 0.54], [34, 0])
  const titleScale = useTransform(cam,             [0.34, 0.60], [0.91, 1.0])

  // ── SUBTITLE ────────────────────────────────────────────────────
  const subOp = useTransform(scrollYProgress, [0.47, 0.62], [0, 1])
  const subY  = useTransform(cam,             [0.47, 0.62], [20, 0])

  // ── CTAs ────────────────────────────────────────────────────────
  const ctaOp = useTransform(scrollYProgress, [0.56, 0.70], [0, 1])
  const ctaY  = useTransform(cam,             [0.56, 0.70], [18, 0])

  // ── GLASSMORPHISM CONFIGURATOR ──────────────────────────────────
  const cfgOp   = useTransform(scrollYProgress, [0.72, 0.90], [0, 1])
  const cfgY    = useTransform(cam,             [0.72, 0.90], [76, 0])
  const cfgBlur = useTransform(scrollYProgress, [0.72, 0.88], ['blur(22px)', 'blur(0px)'])

  // ── STATS COUNTER ───────────────────────────────────────────────
  const statsOp = useTransform(scrollYProgress, [0.82, 0.96], [0, 1])
  const statsY  = useTransform(cam,             [0.82, 0.96], [18, 0])

  return (
    <div ref={containerRef} style={{ position: 'relative', height: '420vh' }}>

      {/* ══════════════════════════════════════════════════════════
          STICKY CINEMATIC VIEWPORT
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        background: '#050302',
      }}>

        {/* ── CAMERA: BACKGROUND IMAGE ──────────────────────── */}
        <motion.div
          style={{
            position: 'absolute',
            inset: '-20%',
            scale: imgScale,
            x: imgX,
            y: imgY,
            willChange: 'transform',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-vehicle.jpg"
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 54%',
              display: 'block',
            }}
          />
        </motion.div>

        {/* ── ATMOSPHERIC DEPTH HAZE ────────────────────────── */}
        {/* Simulates aerial perspective — mountains fade into sky */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(170,195,215,0.06) 0%, transparent 32%)',
          pointerEvents: 'none',
        }} />

        {/* ── FOG / VALLEY MIST ─────────────────────────────── */}
        {FOG.map(f => (
          <motion.div
            key={f.id}
            animate={{
              x: [`${-14 * f.dirMul}%`, `${14 * f.dirMul}%`, `${-14 * f.dirMul}%`],
              opacity: [0.04, 0.11, 0.04],
            }}
            transition={{ duration: f.dur, delay: f.dly, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: f.top + '%',
              left: '-18%',
              width: '136%',
              height: '9%',
              background: 'linear-gradient(to bottom, transparent, rgba(210,228,238,0.16), transparent)',
              filter: 'blur(26px)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* ── CAMPFIRE GLOW ─────────────────────────────────── */}
        {/* Warm orange radial emanating from vehicle/camp position */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse 35% 24% at 50% 68%, rgba(255,85,31,0.30) 0%, rgba(255,130,22,0.07) 52%, transparent 72%)',
            opacity: glowOpacity,
          }}
        />

        {/* Campfire flicker — organic brightness variation */}
        <motion.div
          animate={{
            opacity: [0.13, 0.29, 0.07, 0.23, 0.13],
            scale:   [1.00, 1.14, 0.90, 1.07, 1.00],
          }}
          transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse 13% 9% at 50% 71%, rgba(255,145,42,0.30) 0%, transparent 70%)',
          }}
        />

        {/* ── VIGNETTE ──────────────────────────────────────── */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse 68% 62% at 50% 50%, transparent 0%, rgba(0,0,0,0.40) 54%, rgba(0,0,0,0.92) 100%)',
            opacity: vigOpacity,
          }}
        />

        {/* Top fade — darkens sky to blend with navbar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '30%', pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.80) 0%, transparent 100%)',
        }} />

        {/* Bottom fade — grounds the scene */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '44%', pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(0,0,0,0.94) 0%, transparent 100%)',
        }} />

        {/* ── SCANLINES ─────────────────────────────────────── */}
        <motion.div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.10) 2px,rgba(0,0,0,0.10) 4px)',
            opacity: scanOpacity,
          }}
        />

        {/* Animated horizontal scan sweep */}
        <motion.div
          animate={{ top: ['0%', '108%'] }}
          transition={{ duration: 7.5, repeat: Infinity, repeatDelay: 11, ease: 'linear' }}
          style={{
            position: 'absolute', left: 0, right: 0, height: 2, pointerEvents: 'none',
            background: 'linear-gradient(90deg,transparent,rgba(255,85,31,0.11) 26%,rgba(255,85,31,0.20) 50%,rgba(255,85,31,0.11) 74%,transparent)',
          }}
        />

        {/* ── EMBER PARTICLES ───────────────────────────────── */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {EMBERS.map(p => (
            <motion.div
              key={p.id}
              animate={{
                y:       [0, -p.rise, -p.rise * 1.28],
                x:       [0, p.driftX * 0.38, p.driftX],
                opacity: [0, p.op, p.op * 0.62, 0],
                scale:   [0.12, 1, 0.60, 0],
              }}
              transition={{
                duration: p.dur,
                delay: p.dly,
                repeat: Infinity,
                ease: [0.12, 0, 0.88, 1],
              }}
              style={{
                position: 'absolute',
                left: p.left + '%',
                top: p.top + '%',
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: `rgba(255,${90 + p.warm * 2},18,0.92)`,
                boxShadow: `0 0 ${p.size * 2.8}px rgba(255,78,16,0.70)`,
              }}
            />
          ))}
        </div>

        {/* ── TACTICAL CORNER BRACKETS ──────────────────────── */}
        {([
          { top: 20, left: 20,  borderTop:    '1px solid rgba(255,85,31,0.25)', borderLeft:  '1px solid rgba(255,85,31,0.25)' },
          { top: 20, right: 20, borderTop:    '1px solid rgba(255,85,31,0.25)', borderRight: '1px solid rgba(255,85,31,0.25)' },
          { bottom: 20, left: 20,  borderBottom: '1px solid rgba(255,85,31,0.25)', borderLeft:  '1px solid rgba(255,85,31,0.25)' },
          { bottom: 20, right: 20, borderBottom: '1px solid rgba(255,85,31,0.25)', borderRight: '1px solid rgba(255,85,31,0.25)' },
        ] as React.CSSProperties[]).map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: 30, height: 30, pointerEvents: 'none', ...s }} />
        ))}

        {/* Crosshair reticle — centers on vehicle as camera pushes in */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none',
            opacity: useTransform(scrollYProgress, [0.18, 0.40, 0.70], [0, 0.22, 0]),
          }}
        >
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="16" stroke="rgba(255,85,31,0.5)" strokeWidth="0.75" />
            <line x1="28" y1="4" x2="28" y2="18" stroke="rgba(255,85,31,0.5)" strokeWidth="0.75" />
            <line x1="28" y1="38" x2="28" y2="52" stroke="rgba(255,85,31,0.5)" strokeWidth="0.75" />
            <line x1="4" y1="28" x2="18" y2="28" stroke="rgba(255,85,31,0.5)" strokeWidth="0.75" />
            <line x1="38" y1="28" x2="52" y2="28" stroke="rgba(255,85,31,0.5)" strokeWidth="0.75" />
            <circle cx="28" cy="28" r="1.5" fill="rgba(255,85,31,0.6)" />
          </svg>
        </motion.div>

        {/* ── INITIAL BLACKOUT ──────────────────────────────── */}
        <motion.div
          style={{
            position: 'absolute', inset: 0, background: '#000',
            opacity: blackOpacity, pointerEvents: 'none',
          }}
        />

        {/* ══════════════════════════════════════════════════
            TEXT CONTENT — bottom-left cinematic layout
        ══════════════════════════════════════════════════ */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(28px,5vw,72px)',
          pointerEvents: 'none',
        }}>

          {/* EYEBROW */}
          <motion.div
            style={{ opacity: eyeOp, y: eyeY, marginBottom: 18, pointerEvents: 'auto' }}
          >
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

          {/* "CONTROL THE CHAOS" — blur → sharp reveal */}
          <motion.div
            style={{
              opacity: titleOp,
              y: titleY,
              scale: titleScale,
              filter: titleBlur,
              transformOrigin: 'left bottom',
              marginBottom: 22,
              willChange: 'filter, transform, opacity',
              pointerEvents: 'auto',
            }}
          >
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
          <motion.div
            style={{ opacity: subOp, y: subY, marginBottom: 30, pointerEvents: 'auto' }}
          >
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
          <motion.div
            style={{
              opacity: ctaOp,
              y: ctaY,
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              pointerEvents: 'auto',
            }}
          >
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
                  fontFamily: 'var(--font-rajdhani)',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  letterSpacing: '0.18em',
                  padding: '11px 22px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  color: 'rgba(255,255,255,0.60)',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  borderRadius: 2,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  transition: 'all 0.2s',
                }}
                data-action="hero-view-builds"
              >
                VIEW BUILDS
              </button>
            </Link>
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════════════
            GLASSMORPHISM CONFIGURATOR PANEL — right side
        ══════════════════════════════════════════════════ */}
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
          <motion.div
            style={{
              opacity: cfgOp,
              y: cfgY,
              filter: cfgBlur,
              willChange: 'filter, transform, opacity',
              pointerEvents: 'auto',
            }}
          >
            <div style={{
              background: 'rgba(4,3,2,0.72)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(255,85,31,0.20)',
              borderRadius: 6,
              overflow: 'hidden',
              boxShadow: '0 8px 60px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.03) inset',
            }}>

              {/* Panel header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '14px 18px 13px',
                borderBottom: '1px solid rgba(255,85,31,0.10)',
                background: 'rgba(255,85,31,0.04)',
              }}>
                <motion.span
                  animate={{ opacity: [1, 0.15, 1] }}
                  transition={{ duration: 1.25, repeat: Infinity }}
                  style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: 'var(--orange)', flexShrink: 0,
                  }}
                />
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 8,
                  letterSpacing: '0.26em',
                  color: 'rgba(255,85,31,0.75)',
                  textTransform: 'uppercase',
                  flex: 1,
                }}>
                  BUILD CONFIGURATOR
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 7,
                  letterSpacing: '0.12em',
                  color: 'rgba(255,255,255,0.16)',
                }}>
                  v2.4
                </span>
              </div>

              <div style={{ padding: '16px 18px 18px' }}>

                {/* Section label */}
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 7,
                  letterSpacing: '0.22em',
                  color: 'rgba(255,255,255,0.22)',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}>
                  SELECT PLATFORM
                </div>

                {/* Vehicle options */}
                {[
                  { name: 'TOYOTA 4RUNNER', gen: '5TH GEN · TRD PRO', active: true },
                  { name: 'TOYOTA TACOMA',  gen: '3RD GEN · TRD',      active: false },
                  { name: 'FORD BRONCO',    gen: '6TH GEN · WILDTRAK', active: false },
                  { name: 'JEEP WRANGLER',  gen: 'JL · RUBICON',       active: false },
                ].map((v) => (
                  <div
                    key={v.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '9px 12px',
                      marginBottom: 5,
                      border: `1px solid ${v.active ? 'rgba(255,85,31,0.30)' : 'rgba(255,255,255,0.04)'}`,
                      background: v.active ? 'rgba(255,85,31,0.07)' : 'rgba(255,255,255,0.015)',
                      borderRadius: 3,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-rajdhani)',
                        fontWeight: 700,
                        fontSize: '0.74rem',
                        letterSpacing: '0.12em',
                        color: v.active ? 'var(--orange)' : 'rgba(255,255,255,0.28)',
                        marginBottom: 2,
                      }}>
                        {v.name}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 7,
                        letterSpacing: '0.12em',
                        color: v.active ? 'rgba(255,85,31,0.45)' : 'rgba(255,255,255,0.14)',
                      }}>
                        {v.gen}
                      </div>
                    </div>
                    {v.active && (
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 7,
                        letterSpacing: '0.10em',
                        color: 'rgba(255,85,31,0.70)',
                        background: 'rgba(255,85,31,0.08)',
                        border: '1px solid rgba(255,85,31,0.18)',
                        padding: '2px 6px',
                        borderRadius: 2,
                      }}>
                        SELECTED
                      </div>
                    )}
                  </div>
                ))}

                {/* Divider */}
                <div style={{
                  height: 1,
                  background: 'linear-gradient(90deg,transparent,rgba(255,85,31,0.16) 30%,rgba(255,85,31,0.16) 70%,transparent)',
                  margin: '14px 0',
                }} />

                {/* Stats grid */}
                <div style={{ display: 'flex', gap: 0, marginBottom: 16 }}>
                  {[
                    ['55+', 'PRODUCTS'],
                    ['12',  'CATEGORIES'],
                    ['4',   'PLATFORMS'],
                  ].map(([num, label], i) => (
                    <div
                      key={label}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '8px 4px',
                        borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      }}
                    >
                      <div style={{
                        fontFamily: 'var(--font-bebas)',
                        fontSize: 20,
                        color: '#fff',
                        lineHeight: 1,
                        letterSpacing: '0.04em',
                      }}>
                        {num}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 6,
                        letterSpacing: '0.14em',
                        color: 'rgba(255,255,255,0.20)',
                        marginTop: 3,
                      }}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
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

        {/* ══════════════════════════════════════════════════
            STATS ROW — bottom right
        ══════════════════════════════════════════════════ */}
        <div style={{
          position: 'absolute',
          bottom: 'clamp(28px,4.5vw,56px)',
          right: 'clamp(24px,4vw,64px)',
          zIndex: 10,
        }}>
          <motion.div style={{ opacity: statsOp, y: statsY }}>
            <div style={{ display: 'flex', gap: 28, alignItems: 'flex-end' }}>
              {[
                ['347', 'ACTIVE BUILDS'],
                ['55+', 'GEAR PRODUCTS'],
                ['18',  'INSTALLERS'],
              ].map(([n, l]) => (
                <div key={l} style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: 'clamp(17px,2vw,26px)',
                    color: 'rgba(255,255,255,0.82)',
                    lineHeight: 1,
                    letterSpacing: '0.04em',
                  }}>
                    {n}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 6.5,
                    letterSpacing: '0.17em',
                    color: 'rgba(255,255,255,0.20)',
                    marginTop: 3,
                    textTransform: 'uppercase',
                  }}>
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── SCROLL HINT ─────────────────────────────────── */}
        <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, pointerEvents: 'none' }}>
          <motion.div
            style={{
              opacity: hintOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 7.5,
              letterSpacing: '0.30em',
              color: 'rgba(255,255,255,0.20)',
              textTransform: 'uppercase',
            }}>
              SCROLL TO ENTER
            </span>
            <motion.div
              animate={{ opacity: [0.22, 0.65, 0.22], y: [0, 8, 0] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 1,
                height: 38,
                background: 'linear-gradient(to bottom, rgba(255,85,31,0.65), transparent)',
              }}
            />
          </motion.div>
        </div>

      </div>

      {/* ── RESPONSIVE RULES ────────────────────────────────────── */}
      <style>{`
        @media (max-width: 860px) {
          .cinematic-config-panel { display: none !important; }
        }
        @media (max-width: 640px) {
          .cinematic-config-panel { display: none !important; }
        }
      `}</style>

    </div>
  )
}
