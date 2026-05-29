'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BtnColorful from '@/components/ui/BtnColorful'
import type { Installer } from '@/types/installer'

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  const full = Math.round(rating)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ color: '#FFC857', fontSize: 13, letterSpacing: 1 }}>
        {'★'.repeat(Math.min(full, 5))}{'☆'.repeat(Math.max(0, 5 - full))}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)' }}>
        {rating.toFixed(1)} · {reviews} reviews
      </span>
    </div>
  )
}

// ── Tier badge ────────────────────────────────────────────────────────────────
function TierBadge({ tier }: { tier: Installer['tier'] }) {
  const cfg = {
    elite:      { label: 'ELITE',      bg: 'rgba(255,200,87,0.12)', border: 'rgba(255,200,87,0.45)', color: '#FFC857' },
    certified:  { label: 'CERTIFIED',  bg: 'rgba(255,85,31,0.1)',   border: 'rgba(255,85,31,0.4)',   color: '#FF551F' },
    standard:   { label: 'STANDARD',   bg: 'rgba(255,255,255,0.04)',border: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' },
  }[tier]
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.14em',
      textTransform: 'uppercase', padding: '3px 8px', borderRadius: 2,
      background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
      flexShrink: 0,
    }}>
      {cfg.label}
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  installer:  Installer
  selected?:  boolean
  onSelect?:  () => void
  onQuote?:   () => void
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function InstallerCard({ installer, selected, onSelect, onQuote }: Props) {
  const [expanded, setExpanded] = useState(false)

  const borderColor    = selected ? 'rgba(255,85,31,0.55)' : 'rgba(255,85,31,0.14)'
  const leftBorder     = selected ? '#FF551F' : 'rgba(255,85,31,0.18)'
  const bgColor        = selected ? 'rgba(255,85,31,0.055)' : 'var(--carbon)'

  return (
    <div
      data-installer-id={installer.id}
      onClick={onSelect}
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderLeft: `3px solid ${leftBorder}`,
        borderRadius: 4,
        padding: '15px 16px',
        cursor: 'pointer',
        transition: 'background 0.18s, border-color 0.18s, box-shadow 0.18s',
        boxShadow: selected ? '0 0 24px rgba(255,85,31,0.1)' : 'none',
        marginBottom: 10,
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
        <div>
          <div className="font-bebas" style={{ fontSize: '15px', letterSpacing: '0.05em', color: '#fff', lineHeight: 1.1 }}>
            {installer.name.toUpperCase()}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,85,31,0.8)' }}>
              📍 {installer.city}, {installer.state}
            </span>
            {installer.distance !== undefined && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.32)' }}>
                {installer.distance} MI AWAY
              </span>
            )}
          </div>
        </div>
        <TierBadge tier={installer.tier} />
      </div>

      {/* ── Rating ──────────────────────────────────────────────────────────── */}
      <Stars rating={installer.rating} reviews={installer.reviews} />

      {/* ── Services tags ───────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 10 }}>
        <AnimatePresence initial={false}>
          {installer.services.slice(0, expanded ? 999 : 3).map(s => (
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.08em',
                textTransform: 'uppercase', padding: '2px 7px', borderRadius: 2,
                border: '1px solid rgba(255,85,31,0.3)', color: 'rgba(255,85,31,0.75)',
                background: 'rgba(255,85,31,0.05)',
              }}
            >
              {s}
            </motion.span>
          ))}
        </AnimatePresence>
        {!expanded && installer.services.length > 3 && (
          <button
            onClick={e => { e.stopPropagation(); setExpanded(true) }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.08em',
              textTransform: 'uppercase', padding: '2px 7px', borderRadius: 2,
              border: '1px solid rgba(102,255,255,0.25)', color: 'rgba(102,255,255,0.6)',
              background: 'rgba(102,255,255,0.04)', cursor: 'pointer',
            }}
          >
            +{installer.services.length - 3} MORE
          </button>
        )}
      </div>

      {/* ── Lead time + verified ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
          ⏱ {installer.leadTime}
        </span>
        {installer.verified && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(102,255,255,0.85)',
            border: '1px solid rgba(102,255,255,0.28)', borderRadius: 2, padding: '1px 6px',
          }}>
            ✓ RYKU VERIFIED
          </span>
        )}
      </div>

      {/* ── CTAs ─────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 7, marginTop: 12 }}>
        <BtnColorful
          variant="primary"
          onClick={e => { e.stopPropagation(); onQuote?.() }}
          style={{ flex: 1, justifyContent: 'center', padding: '8px 10px', fontSize: '0.62rem' }}
        >
          REQUEST QUOTE
        </BtnColorful>
        {installer.phone && (
          <a
            href={`tel:${installer.phone}`}
            onClick={e => e.stopPropagation()}
            style={{ textDecoration: 'none' }}
          >
            <button style={{
              height: '100%', padding: '8px 12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3, color: 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-mono)', fontSize: '10px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }) }}
            onMouseLeave={e => { Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.1)' }) }}
            >
              CALL
            </button>
          </a>
        )}
      </div>
    </div>
  )
}
