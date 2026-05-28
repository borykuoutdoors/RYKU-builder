'use client'

import { useEffect, useRef, useState } from 'react'
import { useBuildStore } from '@/store/buildStore'
import { MISSIONS } from '@/data/missions'
import type { MissionId } from '@/types/mission'

// ─── Component ───────────────────────────────────────────────────────────────

export default function MissionSelector() {
  const setMission   = useBuildStore(s => s.setMission)
  const setStep      = useBuildStore(s => s.setStep)
  const storeMission = useBuildStore(s => s.mission)

  const [selectedId, setSelectedId] = useState<string | null>(storeMission)

  const gridRef = useRef<HTMLDivElement>(null)

  const canConfirm = selectedId !== null

  // Wire up data-mid click delegation — no inline onclick
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    function handleClick(e: Event) {
      const target = (e.target as HTMLElement).closest('[data-mid]') as HTMLElement | null
      if (!target) return

      const mid = target.getAttribute('data-mid')
      if (!mid) return

      setSelectedId(mid)
    }

    grid.addEventListener('click', handleClick)
    return () => grid.removeEventListener('click', handleClick)
  }, [])

  function handleConfirm() {
    if (!selectedId) return
    setMission(selectedId as MissionId)
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
          SELECT YOUR MISSION
        </h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginTop: '4px' }}>
          Your mission profile determines which gear loadouts we recommend.
        </p>
      </div>

      {/* Mission grid (4 columns × 2 rows) */}
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
        }}
        className="mission-grid"
      >
        {MISSIONS.map(m => {
          const isSelected = selectedId === m.id
          return (
            <div
              key={m.id}
              data-mid={m.id}
              className="mission-card"
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
                {m.icon}
              </div>

              {/* Name */}
              <div
                style={{
                  fontFamily: 'var(--font-bebas), sans-serif',
                  fontSize: '1.25rem',
                  letterSpacing: '0.08em',
                  color: isSelected ? 'var(--orange)' : 'var(--text)',
                  marginBottom: '6px',
                }}
              >
                {m.name}
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-3)',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {m.description}
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
          CONFIRM MISSION
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: '4px' }}>
            <path d="M2 7h10M8 3l4 4-4 4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .mission-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .mission-grid { grid-template-columns: repeat(1, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
