'use client'

import { motion } from 'framer-motion'
import React from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface BtnColorfulProps {
  /** Primary = full #FF551F→#FFC857 gradient fill. Secondary = gradient border + dark bg. */
  variant?: 'primary' | 'secondary'
  /** lg matches .btn-lg sizing; default is standard .btn sizing */
  size?: 'default' | 'lg'
  /** Renders a small → arrow after the label */
  arrow?: boolean
  children?: React.ReactNode
  disabled?: boolean
  style?: React.CSSProperties
  className?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  onFocus?: React.FocusEventHandler<HTMLButtonElement>
  onBlur?: React.FocusEventHandler<HTMLButtonElement>
  tabIndex?: number
  id?: string
  form?: string
  'aria-label'?: string
  'aria-expanded'?: boolean | 'true' | 'false'
  'aria-controls'?: string
  'data-action'?: string
  'data-plan'?: string
  'data-cta'?: string
  [key: string]: unknown
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function BtnColorful({
  variant = 'primary',
  size    = 'default',
  arrow   = false,
  children,
  disabled,
  style,
  type,
  onClick,
  onFocus,
  onBlur,
  tabIndex,
  id,
  form,
  className,
  ...dataProps
}: BtnColorfulProps) {
  const isPrimary = variant === 'primary'
  const isLg      = size === 'lg'

  const padding = isPrimary
    ? (isLg ? '16px 44px' : '12px 28px')
    : (isLg ? '14px 40px' : '11px 24px')

  const hoverAnim = disabled ? {} : {
    scale:      1.03,
    filter:     `brightness(${isPrimary ? 1.10 : 1.14})`,
  }

  // collect only data-* and aria-* passthrough props
  const passthroughProps: Record<string, unknown> = {}
  for (const key of Object.keys(dataProps)) {
    if (key.startsWith('data-') || key.startsWith('aria-')) {
      passthroughProps[key] = dataProps[key]
    }
  }

  return (
    <motion.button
      whileHover={hoverAnim}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.2, 0.7, 0.2, 1] }}
      disabled={disabled}
      type={type}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      tabIndex={tabIndex}
      id={id}
      form={form}
      className={className}
      style={{
        position:      'relative',
        display:       'inline-flex',
        alignItems:    'center',
        justifyContent:'center',
        gap:           8,
        fontFamily:    'var(--font-tactical)',
        fontWeight:    700,
        fontSize:      isLg ? '1rem' : '0.8125rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        padding,
        borderRadius:  3,
        border:        isPrimary ? 'none' : '1px solid rgba(255,85,31,0.38)',
        cursor:        disabled ? 'not-allowed' : 'pointer',
        overflow:      'hidden',
        whiteSpace:    'nowrap',
        outline:       'none',
        background:    isPrimary
          ? 'linear-gradient(to right, #FF551F, #FFC857)'
          : 'rgba(6,4,3,0.90)',
        color:         isPrimary ? '#0d0704' : '#FF6B35',
        boxShadow:     isPrimary
          ? '0 4px 28px rgba(255,85,31,0.44), 0 0 0 1px rgba(255,180,60,0.18), inset 0 1px 0 rgba(255,255,255,0.22)'
          : '0 2px 18px rgba(255,85,31,0.18), 0 0 0 1px rgba(255,85,31,0.30)',
        opacity:       disabled ? 0.5 : 1,
        ...style,
      }}
      {...passthroughProps}
    >

      {/* Glass shimmer — top highlight */}
      <span
        aria-hidden="true"
        style={{
          position:   'absolute',
          top: 0, left: 0, right: 0,
          height:     '52%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.00) 100%)',
          pointerEvents: 'none',
          borderRadius: 'inherit',
        }}
      />

      {/* Ambient bloom — warm amber glow behind text (primary only) */}
      {isPrimary && (
        <span
          aria-hidden="true"
          style={{
            position:   'absolute',
            bottom:    '-50%', left: '5%', right: '5%',
            height:    '80%',
            background: 'radial-gradient(ellipse at center, rgba(255,200,87,0.26) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Inner gradient tint (secondary only) */}
      {!isPrimary && (
        <span
          aria-hidden="true"
          style={{
            position:   'absolute',
            inset:       0,
            background: 'linear-gradient(to right, rgba(255,85,31,0.05), rgba(255,200,87,0.03))',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Label + optional arrow */}
      <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 9 }}>
        {children}
        {arrow && (
          <span aria-hidden="true" style={{ fontSize: '0.82em', lineHeight: 1, letterSpacing: 0 }}>
            →
          </span>
        )}
      </span>
    </motion.button>
  )
}
