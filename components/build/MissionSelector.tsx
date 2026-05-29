'use client'

import { useState } from 'react'
import { useBuildStore } from '@/store/buildStore'
import { buildPurposes } from '@/lib/catalog'

// ─── Component ───────────────────────────────────────────────────────────────

export default function MissionSelector() {
  const setPurposes  = useBuildStore(s => s.setPurposes)
  const setStep      = useBuildStore(s => s.setStep)
  const storePurposes = useBuildStore(s => s.purposes)

  const [selected, setSelected] = useState<string[]>(storePurposes)

  const canConfirm = selected.length > 0

  function toggleSelected(id: string) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  function handleConfirm() {
    if (!canConfirm) return
    setPurposes(selected)
    setStep(3)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Eyebrow */}
      <div>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>STEP 02 / 05</p>
        <h2
          style={{
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            letterSpacing: '0.04em',
            color: 'var(--text)',
          }}
        >
          SELECT YOUR PURPOSE
        </h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginTop: '4px' }}>
          Select all that apply. RYKU intelligence ranks gear loadouts from your full mission profile.
        </p>
      </div>

      {/* Purpose grid (3 columns) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}
        className="purpose-grid"
      >
        {buildPurposes.map(p => {
          const isSelected = selected.includes(p.id)
          return (
            <div
              key={p.id}
              className="mission-card"
              onClick={() => toggleSelected(p.id)}
              style={{
                borderColor: isSelected ? 'var(--orange)' : undefined,
                background: isSelected ? 'var(--orange-dim)' : undefined,
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              {/* SELECTED badge */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.5rem',
                    letterSpacing: '0.12em',
                    color: 'var(--orange)',
                    border: '1px solid rgba(255,85,31,0.4)',
                    background: 'rgba(255,85,31,0.08)',
                    padding: '2px 6px',
                    borderRadius: '2px',
                  }}
                >
                  SELECTED
                </div>
              )}

              {/* Icon */}
              <div style={{ fontSize: '2rem', lineHeight: 1, marginBottom: '10px' }}>
                {p.icon}
              </div>

              {/* Label */}
              <div
                style={{
                  fontFamily: 'var(--font-bebas), sans-serif',
                  fontSize: '1.25rem',
                  letterSpacing: '0.08em',
                  color: isSelected ? 'var(--orange)' : 'var(--text)',
                  marginBottom: '6px',
                }}
              >
                {p.label}
              </div>

              {/* Sub */}
              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-3)',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {p.sub}
              </p>
            </div>
          )
        })}
      </div>

      {/* Confirm button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn btn-primary btn-lg"
          disabled={!canConfirm}
          onClick={handleConfirm}
          style={{
            opacity: canConfirm ? 1 : 0.35,
            cursor: canConfirm ? 'pointer' : 'not-allowed',
          }}
        >
          CONFIRM PURPOSE
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: '4px' }}>
            <path d="M2 7h10M8 3l4 4-4 4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 720px) {
          .purpose-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .purpose-grid { grid-template-columns: repeat(1, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
