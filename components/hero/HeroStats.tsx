'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'

/* ─── Stat data ─────────────────────────────────────────────────────────── */
const STATS = [
  { value: 4200, suffix: '+', label: 'BUILDS CONFIGURED' },
  { value: 55,   suffix: '+', label: 'COMPATIBLE PRODUCTS' },
  { value: 6,    suffix: '',  label: 'INSTALLER PARTNERS' },
  { value: 10,   suffix: '',  label: 'VEHICLE PLATFORMS' },
]

/* ─── Single animated counter ───────────────────────────────────────────── */
function AnimatedCount({ target, suffix }: { target: number; suffix: string }) {
  const count  = useMotionValue(0)
  const ref    = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, target, {
      duration: 1.6,
      ease: 'easeOut',
    })
    return controls.stop
  }, [inView, count, target])

  // Round to integer for display
  const display = useTransform(count, (v) => `${Math.round(v).toLocaleString()}${suffix}`)

  return (
    <span ref={ref} className="font-mono text-[clamp(1.6rem,3.2vw,2.2rem)] text-[var(--text)] leading-none">
      <motion.span>{display}</motion.span>
    </span>
  )
}

/* ─── HeroStats ─────────────────────────────────────────────────────────── */
export default function HeroStats() {
  return (
    <div
      className="glass rounded-sm"
      style={{ border: '1px solid rgba(255,85,31,0.22)' }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {STATS.map((stat, i) => (
          <div key={stat.label} className="relative flex flex-col items-center justify-center gap-2 px-6 py-5 text-center">
            {/* vertical divider (after each item except the last in each row) */}
            {i < STATS.length - 1 && (
              <span
                className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-[rgba(255,85,31,0.15)] hidden sm:block"
                aria-hidden="true"
              />
            )}
            {/* bottom divider for 2-col mobile layout */}
            {i < 2 && (
              <span
                className="absolute bottom-0 left-6 right-6 h-px bg-[rgba(255,85,31,0.10)] sm:hidden"
                aria-hidden="true"
              />
            )}

            <AnimatedCount target={stat.value} suffix={stat.suffix} />

            <span
              className="font-mono text-[0.6rem] tracking-[0.18em] uppercase"
              style={{ color: 'var(--text-3)' }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
