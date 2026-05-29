'use client'

import { useState } from 'react'
import { useBuildStore } from '@/store/buildStore'

const PRESETS = [
  { id: 'p5',  label: '$5K',   display: '$5,000',  value: 5000,  sub: 'ENTRY BUILD'   },
  { id: 'p10', label: '$10K',  display: '$10,000', value: 10000, sub: 'CAPABLE RIG'   },
  { id: 'p20', label: '$20K',  display: '$20,000', value: 20000, sub: 'SERIOUS SETUP' },
  { id: 'p50', label: '$50K',  display: '$50,000', value: 50000, sub: 'FULL SEND'     },
  { id: 'cst', label: 'CUSTOM', display: 'CUSTOM', value: null,  sub: 'SET YOUR OWN' },
] as const

type PresetId = typeof PRESETS[number]['id']

function budgetToPresetId(budget: number): PresetId | null {
  if (!budget) return null
  const match = PRESETS.find(p => p.value === budget)
  return match ? match.id : 'cst'
}

export default function BudgetSelector() {
  const setBudget   = useBuildStore(s => s.setBudget)
  const setStep     = useBuildStore(s => s.setStep)
  const storeBudget = useBuildStore(s => s.budget)

  const [selectedId, setSelectedId] = useState<PresetId | null>(
    storeBudget ? budgetToPresetId(storeBudget) : null
  )
  const [customRaw, setCustomRaw] = useState(
    storeBudget && budgetToPresetId(storeBudget) === 'cst' ? String(storeBudget) : ''
  )

  const customNum = Number(customRaw.replace(/\D/g, ''))
  const canConfirm = selectedId !== null && (selectedId !== 'cst' || customNum > 0)

  function handleConfirm() {
    if (!canConfirm) return
    const budget = selectedId === 'cst'
      ? customNum
      : (PRESETS.find(p => p.id === selectedId)!.value as number)
    setBudget(budget)
    setStep(4)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Eyebrow + heading */}
      <div style={{ textAlign: 'center' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>STEP 03 / 05</p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          letterSpacing: '0.04em',
          color: 'var(--text)',
          lineHeight: 1.1,
        }}>
          SET YOUR BUDGET
        </h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginTop: '6px' }}>
          We will only show gear and installs that fit within your build budget.
        </p>
      </div>

      {/* Preset grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: '8px',
      }}>
        {PRESETS.map(preset => {
          const isActive = selectedId === preset.id
          return (
            <button
              key={preset.id}
              onClick={() => setSelectedId(preset.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '14px 8px',
                borderRadius: '4px',
                border: isActive
                  ? '1px solid var(--orange)'
                  : '1px solid rgba(255,255,255,0.08)',
                background: isActive
                  ? 'rgba(255,85,31,0.08)'
                  : 'rgba(8,10,20,0.60)',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.15s ease',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: preset.id === 'cst' ? '1.1rem' : '1.35rem',
                letterSpacing: '0.04em',
                color: isActive ? 'var(--orange)' : 'var(--text)',
                lineHeight: 1,
                transition: 'color 0.15s ease',
              }}>
                {preset.label}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.48rem',
                letterSpacing: '0.15em',
                color: isActive ? 'rgba(255,85,31,0.65)' : 'var(--text-3)',
                transition: 'color 0.15s ease',
              }}>
                {preset.sub}
              </span>
            </button>
          )
        })}
      </div>

      {/* Custom input */}
      {selectedId === 'cst' && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '260px' }}>
            <span style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              color: 'var(--orange)',
              pointerEvents: 'none',
              zIndex: 1,
            }}>
              $
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter amount"
              value={customRaw ? Number(customRaw).toLocaleString('en-US') : ''}
              onChange={e => {
                const digits = e.target.value.replace(/\D/g, '')
                setCustomRaw(digits)
              }}
              autoFocus
              style={{
                width: '100%',
                paddingLeft: '28px',
                paddingRight: '16px',
                paddingTop: '11px',
                paddingBottom: '11px',
                background: 'rgba(8,10,20,0.85)',
                border: '1px solid rgba(255,85,31,0.35)',
                borderRadius: '3px',
                color: 'var(--text)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                letterSpacing: '0.04em',
                outline: 'none',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,85,31,0.65)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,85,31,0.35)' }}
            />
          </div>
        </div>
      )}

      {/* Confirm button */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          className="btn btn-primary btn-lg"
          disabled={!canConfirm}
          onClick={handleConfirm}
          style={{
            opacity: canConfirm ? 1 : 0.35,
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            minWidth: '200px',
          }}
        >
          SET BUDGET
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: '6px' }}>
            <path d="M2 7h10M8 3l4 4-4 4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
