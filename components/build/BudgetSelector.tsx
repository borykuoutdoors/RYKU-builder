'use client'

import { useEffect, useRef, useState } from 'react'
import { useBuildStore } from '@/store/buildStore'

// ─── Preset config ────────────────────────────────────────────────────────────

interface Preset {
  label: string
  value: number
}

const PRESETS: Preset[] = [
  { label: '$5K',       value: 5000  },
  { label: '$10K',      value: 10000 },
  { label: '$15K',      value: 15000 },
  { label: '$20K',      value: 20000 },
  { label: '$30K',      value: 30000 },
  { label: 'UNLIMITED', value: 99999 },
]

const SLIDER_MIN = 1000
const SLIDER_MAX = 50000

function formatBudget(val: number): string {
  if (val >= 99999) return 'UNLIMITED'
  return '$' + val.toLocaleString('en-US')
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BudgetSelector() {
  const setBudget    = useBuildStore(s => s.setBudget)
  const setStep      = useBuildStore(s => s.setStep)
  const storeBudget  = useBuildStore(s => s.budget)

  const [budget, setBudgetLocal] = useState<number>(storeBudget)
  // Text input value (empty string while user is typing)
  const [inputVal, setInputVal]  = useState<string>(
    storeBudget >= 99999 ? '' : String(storeBudget)
  )

  const presetsRef = useRef<HTMLDivElement>(null)

  // Sync slider with budget
  const sliderValue = budget >= 99999 ? SLIDER_MAX : Math.min(Math.max(budget, SLIDER_MIN), SLIDER_MAX)

  // Wire up data-preset click delegation
  useEffect(() => {
    const container = presetsRef.current
    if (!container) return

    function handleClick(e: Event) {
      const target = (e.target as HTMLElement).closest('[data-preset]') as HTMLElement | null
      if (!target) return

      const raw = target.getAttribute('data-preset')
      if (!raw) return

      const val = Number(raw)
      setBudgetLocal(val)
      setInputVal(val >= 99999 ? '' : String(val))
    }

    container.addEventListener('click', handleClick)
    return () => container.removeEventListener('click', handleClick)
  }, [])

  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value)
    setBudgetLocal(val)
    setInputVal(String(val))
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setInputVal(raw)
    if (raw === '') return
    const val = Math.min(Number(raw), 99999)
    setBudgetLocal(val)
  }

  function handleInputBlur() {
    if (inputVal === '') {
      setInputVal(budget >= 99999 ? '' : String(budget))
      return
    }
    const val = Math.max(SLIDER_MIN, Math.min(Number(inputVal), 99999))
    setBudgetLocal(val)
    setInputVal(val >= 99999 ? '' : String(val))
  }

  function handleConfirm() {
    setBudget(budget)
    setStep(4)
  }

  const isUnlimited = budget >= 99999

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Eyebrow */}
      <div>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>STEP 03 / 04</p>
        <h2
          style={{
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            letterSpacing: '0.04em',
            color: 'var(--text)',
          }}
        >
          SET YOUR BUDGET
        </h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginTop: '4px' }}>
          We will only show gear and installs that fit within your build budget.
        </p>
      </div>

      {/* Large budget display */}
      <div style={{ textAlign: 'center', padding: '28px 0' }}>
        <div
          style={{
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            letterSpacing: '0.04em',
            color: 'var(--orange)',
            lineHeight: 1,
            textShadow: '0 0 40px rgba(255,85,31,0.2)',
            transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {formatBudget(budget)}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '0.625rem',
            letterSpacing: '0.2em',
            color: 'var(--text-3)',
            marginTop: '8px',
            textTransform: 'uppercase',
          }}
        >
          {isUnlimited ? 'NO BUDGET LIMIT — FULL CATALOG' : 'TOTAL BUILD BUDGET (GEAR + INSTALL)'}
        </div>
      </div>

      {/* Preset buttons */}
      <div ref={presetsRef}>
        <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>
          QUICK SELECT
        </label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '8px',
          }}
          className="preset-grid"
        >
          {PRESETS.map(p => {
            const isActive = budget === p.value
            return (
              <button
                key={p.label}
                data-preset={String(p.value)}
                style={{
                  fontFamily: 'var(--font-rajdhani), sans-serif',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  letterSpacing: '0.08em',
                  padding: '12px 8px',
                  borderRadius: '3px',
                  border: isActive
                    ? '1px solid var(--orange)'
                    : '1px solid rgba(255,255,255,0.08)',
                  background: isActive
                    ? 'rgba(255,85,31,0.12)'
                    : 'var(--carbon)',
                  color: isActive ? 'var(--orange)' : 'var(--text-2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                  textTransform: 'uppercase',
                }}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Manual input + slider */}
      {!isUnlimited && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Text input */}
          <div>
            <label className="form-label">CUSTOM AMOUNT</label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-3)',
                  fontFamily: 'var(--font-rajdhani), sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  pointerEvents: 'none',
                }}
              >
                $
              </span>
              <input
                type="text"
                className="form-input"
                value={inputVal}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="15000"
                style={{ paddingLeft: '28px' }}
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Range slider */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.1em',
                  color: 'var(--text-3)',
                }}
              >
                $1,000
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.1em',
                  color: 'var(--text-3)',
                }}
              >
                $50,000
              </span>
            </div>
            <input
              type="range"
              min={SLIDER_MIN}
              max={SLIDER_MAX}
              step={500}
              value={sliderValue}
              onChange={handleSliderChange}
              style={{
                width: '100%',
                accentColor: 'var(--orange)',
                cursor: 'pointer',
                height: '4px',
              }}
            />
          </div>
        </div>
      )}

      {/* Budget breakdown hint */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          padding: '14px 16px',
          background: 'rgba(10,10,10,0.5)',
          border: '1px solid rgba(255,85,31,0.10)',
          borderRadius: '3px',
        }}
      >
        {[
          { label: 'GEAR BUDGET', note: '~60-70%' },
          { label: 'INSTALL BUDGET', note: '~30-40%' },
        ].map(item => (
          <div key={item.label} style={{ flex: 1, textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.5625rem',
                letterSpacing: '0.15em',
                color: 'var(--text-3)',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-rajdhani), sans-serif',
                fontWeight: 700,
                fontSize: '0.875rem',
                color: 'var(--text-2)',
              }}
            >
              {item.note}
            </div>
          </div>
        ))}
      </div>

      {/* Confirm button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleConfirm}
        >
          SET BUDGET
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: '4px' }}>
            <path d="M2 7h10M8 3l4 4-4 4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 700px) {
          .preset-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 400px) {
          .preset-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
