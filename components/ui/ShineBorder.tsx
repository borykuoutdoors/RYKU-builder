'use client'

import React from 'react'

/* ─── Style injection (singleton) ───────────────────────────────────────────── */

const STYLE_ID = 'ryku-shine-border-styles'

function injectStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const el = document.createElement('style')
  el.id = STYLE_ID
  el.textContent = `
    @keyframes ryku-shine-rotate {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    .ryku-shine-wrap {
      transition: transform 0.24s ease, box-shadow 0.30s ease;
    }
    .ryku-shine-wrap:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 32px rgba(255,85,31,0.13);
    }
    .ryku-shine-wrap.ryku-shine-premium:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 40px rgba(255,85,31,0.20), 0 0 48px rgba(255,85,31,0.08);
    }
    .ryku-shine-wrap.ryku-shine-featured:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 36px rgba(255,85,31,0.15), 0 0 32px rgba(102,255,255,0.05);
    }
  `
  document.head.appendChild(el)
}

/* ─── Variant configs ────────────────────────────────────────────────────────── */

/*
  Each gradient is a conic-gradient that creates a "traveling shine" arc.
  The arc covers ~30-38% of the circumference; the rest is a dim baseline.
  Animation speed: premium (11s) → featured (15s) → standard (20s) — all slow = premium.
*/

const CONFIGS = {
  standard: {
    gradient: [
      'conic-gradient(from 0deg,',
      '  rgba(255,85,31,0.07) 0deg,',
      '  rgba(255,85,31,0.07) 224deg,',
      '  rgba(255,85,31,0.82) 256deg,',
      '  rgba(255,200,87,0.55) 270deg,',
      '  rgba(255,85,31,0.22) 284deg,',
      '  rgba(255,85,31,0.07) 310deg,',
      '  rgba(255,85,31,0.07) 360deg',
      ')',
    ].join(''),
    duration:    '20s',
    idleColor:   'rgba(255,85,31,0.13)',
  },
  featured: {
    gradient: [
      'conic-gradient(from 0deg,',
      '  rgba(255,85,31,0.08) 0deg,',
      '  rgba(255,85,31,0.08) 212deg,',
      '  rgba(255,85,31,0.88) 246deg,',
      '  rgba(255,200,87,0.72) 261deg,',
      '  rgba(102,255,255,0.44) 274deg,',
      '  rgba(255,85,31,0.28) 288deg,',
      '  rgba(255,85,31,0.08) 314deg,',
      '  rgba(255,85,31,0.08) 360deg',
      ')',
    ].join(''),
    duration:    '15s',
    idleColor:   'rgba(255,85,31,0.18)',
  },
  premium: {
    gradient: [
      'conic-gradient(from 0deg,',
      '  rgba(255,200,87,0.07) 0deg,',
      '  rgba(255,200,87,0.07) 198deg,',
      '  rgba(255,200,87,0.68) 228deg,',
      '  rgba(255,85,31,0.96) 248deg,',
      '  rgba(255,200,87,0.82) 264deg,',
      '  rgba(102,255,255,0.52) 278deg,',
      '  rgba(255,85,31,0.32) 292deg,',
      '  rgba(255,200,87,0.07) 318deg,',
      '  rgba(255,200,87,0.07) 360deg',
      ')',
    ].join(''),
    duration:    '11s',
    idleColor:   'rgba(255,85,31,0.28)',
  },
} as const

/* ─── Types ──────────────────────────────────────────────────────────────────── */

export interface ShineBorderProps {
  children:      React.ReactNode
  variant?:      keyof typeof CONFIGS
  borderRadius?: number
  borderWidth?:  number
  className?:    string
  style?:        React.CSSProperties
}

/* ─── Component ──────────────────────────────────────────────────────────────── */

export default function ShineBorder({
  children,
  variant      = 'standard',
  borderRadius = 6,
  borderWidth  = 1,
  className,
  style,
}: ShineBorderProps) {
  if (typeof window !== 'undefined') injectStyles()

  const { gradient, duration, idleColor } = CONFIGS[variant]

  const wrapClass = [
    'ryku-shine-wrap',
    variant === 'premium'  ? 'ryku-shine-premium'  : '',
    variant === 'featured' ? 'ryku-shine-featured'  : '',
    className ?? '',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={wrapClass}
      style={{
        position:     'relative',
        borderRadius: borderRadius,
        padding:      borderWidth,
        overflow:     'hidden',
        // Subtle constant ring — visible in the non-shine arc portions
        boxShadow:    `inset 0 0 0 ${borderWidth}px ${idleColor}`,
        ...style,
      }}
    >
      {/* Rotating shine arc — absolute, 200% size, spins in place */}
      <div
        aria-hidden="true"
        style={{
          position:    'absolute',
          top:         '-50%',
          left:        '-50%',
          width:       '200%',
          height:      '200%',
          background:  gradient,
          animation:   `ryku-shine-rotate ${duration} linear infinite`,
          willChange:  'transform',
          zIndex:      0,
          pointerEvents: 'none',
        }}
      />

      {/* Content — sits above the rotating gradient; children supply their own background */}
      <div
        style={{
          position:     'relative',
          zIndex:       1,
          borderRadius: Math.max(0, borderRadius - borderWidth),
          overflow:     'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}
