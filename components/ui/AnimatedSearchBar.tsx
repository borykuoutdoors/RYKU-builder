'use client'

import { useState, useRef, useCallback, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Types ─────────────────────────────────────────────────────────────────── */

export interface AnimatedSearchBarProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  /** Called when user presses Enter */
  onSearch?: (value: string) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: React.CSSProperties
  autoFocus?: boolean
  /** Semantic label for screen readers */
  'aria-label'?: string
  /** data-* attribute passthrough for analytics */
  'data-search-scope'?: string
}

/* ─── Sizing scale ───────────────────────────────────────────────────────────── */

const SIZES = {
  sm: { height: 40, fontSize: '0.70rem', iconSize: 14, padL: 38, padR: 38 },
  md: { height: 48, fontSize: '0.76rem', iconSize: 15, padL: 44, padR: 44 },
  lg: { height: 56, fontSize: '0.82rem', iconSize: 17, padL: 50, padR: 50 },
} as const

/* ─── Global keyframes (injected once per document) ─────────────────────────── */

const STYLE_ID = 'ryku-search-bar-styles'

function injectStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const el = document.createElement('style')
  el.id = STYLE_ID
  el.textContent = `
    @keyframes ryku-search-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes ryku-search-pulse {
      0%, 100% { opacity: 0.65; }
      50%       { opacity: 1.00; }
    }
    .ryku-search-input::placeholder {
      color: rgba(243, 237, 226, 0.22);
      letter-spacing: 0.04em;
    }
    .ryku-search-input::-webkit-search-cancel-button,
    .ryku-search-input::-webkit-search-decoration {
      display: none;
      -webkit-appearance: none;
    }
    .ryku-search-clear:hover {
      background: rgba(255,85,31,0.22) !important;
      color: #FF551F !important;
      border-color: rgba(255,85,31,0.55) !important;
    }
  `
  document.head.appendChild(el)
}

/* ═════════════════════════════════════════════════════════════════════════════
   Component
   ═════════════════════════════════════════════════════════════════════════════ */

export default function AnimatedSearchBar({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  size = 'md',
  className,
  style,
  autoFocus,
  'aria-label': ariaLabel,
  'data-search-scope': searchScope,
}: AnimatedSearchBarProps) {
  // Inject global styles on first render (client only)
  if (typeof window !== 'undefined') injectStyles()

  const [focused,  setFocused]  = useState(false)
  const [hovered,  setHovered]  = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const uid      = useId()

  const { height, fontSize, iconSize, padL, padR } = SIZES[size]
  const hasValue  = value.length > 0
  const isActive  = focused || hovered

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch?.(value)
    if (e.key === 'Escape') { onChange(''); inputRef.current?.blur() }
  }, [value, onChange, onSearch])

  const clear = useCallback(() => {
    onChange('')
    inputRef.current?.focus()
  }, [onChange])

  /* ── Border color for non-focused state ─────────────────────────────────── */
  const staticBorderColor = hovered
    ? 'rgba(255,85,31,0.42)'
    : 'rgba(255,255,255,0.08)'

  return (
    <div
      className={className}
      style={{ position: 'relative', width: '100%', ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* ── Layer 0: Diffuse ambient glow ─────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: focused ? 1 : hovered ? 0.45 : 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position:      'absolute',
          inset:         '-6px',
          borderRadius:  14,
          background:    'radial-gradient(ellipse at 50% 120%, rgba(255,85,31,0.22) 0%, rgba(255,200,87,0.08) 45%, rgba(102,255,255,0.04) 70%, transparent 90%)',
          filter:        'blur(10px)',
          pointerEvents: 'none',
          zIndex:        0,
        }}
      />

      {/* ── Layer 1: Rotating gradient border (focused only) ──────────────── */}
      <AnimatePresence>
        {focused && (
          <motion.div
            key="grad-ring"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.20 }}
            aria-hidden="true"
            style={{
              position:      'absolute',
              inset:         -1,
              borderRadius:  9,
              overflow:      'hidden',
              pointerEvents: 'none',
              zIndex:        1,
            }}
          >
            <div style={{
              position:   'absolute',
              top: '-50%', left: '-50%',
              width:      '200%',
              height:     '200%',
              background: 'conic-gradient(from 0deg, #FF551F 0%, #FFC857 28%, #66FFFF 52%, #FFC857 72%, #FF551F 100%)',
              animation:  'ryku-search-spin 3.6s linear infinite',
              opacity:    0.90,
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Layer 1 alt: Static border (hover/idle) ───────────────────────── */}
      {!focused && (
        <div
          aria-hidden="true"
          style={{
            position:       'absolute',
            inset:          0,
            borderRadius:   8,
            border:         `1px solid ${staticBorderColor}`,
            pointerEvents:  'none',
            zIndex:         1,
            transition:     'border-color 0.22s',
          }}
        />
      )}

      {/* ── Layer 2: Glassmorphism input shell ────────────────────────────── */}
      <div
        style={{
          position:             'relative',
          zIndex:               2,
          margin:               focused ? '1px' : '0px',
          borderRadius:         focused ? '7px' : '8px',
          background:           focused
            ? 'rgba(5,7,14,0.96)'
            : hovered
            ? 'rgba(7,9,16,0.90)'
            : 'rgba(7,9,16,0.82)',
          backdropFilter:       'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          transition:           'background 0.22s',
          overflow:             'hidden',
          display:              'flex',
          alignItems:           'center',
        }}
      >

        {/* Cyan status dot (left edge — focused only) */}
        <AnimatePresence>
          {focused && (
            <motion.span
              key="dot"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.18 }}
              aria-hidden="true"
              style={{
                position:     'absolute',
                left:         10,
                top:          '50%',
                marginTop:    -2,
                width:        4,
                height:       4,
                borderRadius: '50%',
                background:   '#66FFFF',
                boxShadow:    '0 0 8px rgba(102,255,255,0.85)',
                animation:    'ryku-search-pulse 1.8s ease-in-out infinite',
                flexShrink:   0,
              }}
            />
          )}
        </AnimatePresence>

        {/* Search icon */}
        <div
          aria-hidden="true"
          style={{
            position:      'absolute',
            left:          padL - iconSize - 8,
            top:           '50%',
            transform:     'translateY(-50%)',
            pointerEvents: 'none',
            zIndex:        1,
            color:         (focused || hasValue) ? '#FF551F' : isActive ? 'rgba(255,85,31,0.50)' : 'rgba(243,237,226,0.22)',
            transition:    'color 0.20s',
            display:       'flex',
            alignItems:    'center',
          }}
        >
          <svg
            width={iconSize} height={iconSize}
            viewBox="0 0 20 20" fill="none"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="9" cy="9" r="5.6" stroke="currentColor" strokeWidth="1.6" />
            <line x1="13.6" y1="13.6" x2="17.5" y2="17.5" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          id={uid}
          className="ryku-search-input"
          type="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label={ariaLabel ?? placeholder}
          data-search-scope={searchScope}
          style={{
            flex:           1,
            height:         height,
            background:     'transparent',
            border:         'none',
            padding:        `0 ${padR}px 0 ${padL}px`,
            fontFamily:     'var(--font-mono)',
            fontSize:       fontSize,
            letterSpacing:  '0.05em',
            color:          '#F3EDE2',
            outline:        'none',
            WebkitAppearance: 'none',
            boxSizing:      'border-box',
            minWidth:       0,
          }}
        />

        {/* Clear button */}
        <AnimatePresence>
          {hasValue && (
            <motion.button
              key="clear"
              initial={{ opacity: 0, scale: 0.65, x: 6 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.65, x: 6 }}
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
              onClick={clear}
              type="button"
              aria-label="Clear search"
              className="ryku-search-clear"
              style={{
                flexShrink:     0,
                marginRight:    10,
                background:     'rgba(255,85,31,0.08)',
                border:         '1px solid rgba(255,85,31,0.22)',
                borderRadius:   4,
                color:          'rgba(255,85,31,0.60)',
                cursor:         'pointer',
                padding:        '3px 6px',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                lineHeight:     1,
                transition:     'all 0.14s',
                zIndex:         2,
              }}
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" strokeLinecap="round">
                <line x1="1" y1="1" x2="8" y2="8" stroke="currentColor" strokeWidth="1.5" />
                <line x1="8" y1="1" x2="1" y2="8" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Top shimmer line (focused) */}
        <AnimatePresence>
          {focused && (
            <motion.div
              key="shimmer"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.35 }}
              aria-hidden="true"
              style={{
                position:       'absolute',
                top:            0, left: '8%', right: '8%',
                height:         1,
                background:     'linear-gradient(to right, transparent, rgba(255,85,31,0.40) 25%, rgba(255,200,87,0.30) 55%, rgba(102,255,255,0.22) 80%, transparent)',
                pointerEvents:  'none',
                transformOrigin:'center',
              }}
            />
          )}
        </AnimatePresence>

        {/* Bottom shimmer line (focused) */}
        <AnimatePresence>
          {focused && (
            <motion.div
              key="shimmer-b"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              aria-hidden="true"
              style={{
                position:      'absolute',
                bottom:        0, left: '20%', right: '20%',
                height:        1,
                background:    'linear-gradient(to right, transparent, rgba(255,85,31,0.18) 50%, transparent)',
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
