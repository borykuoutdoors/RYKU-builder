'use client'

import { useState } from 'react'
import { useBuildStore } from '@/store/buildStore'
import { budgetTiers } from '@/lib/catalog'
import { budgetToTierId } from '@/lib/rank'

// ─── Tier → numeric budget map ───────────────────────────────────────────────

const TIER_TO_BUDGET: Record<string, number> = {
  b_entry:   2500,
  b_mid:     5000,
  b_serious: 10000,
  b_full:    20000,
  b_pro:     99999,
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BudgetSelector() {
  const setBudget   = useBuildStore(s => s.setBudget)
  const setStep     = useBuildStore(s => s.setStep)
  const storeBudget = useBuildStore(s => s.budget)

  const [selectedTierId, setSelectedTierId] = useState<string | null>(
    budgetToTierId(storeBudget)
  )

  const canConfirm = selectedTierId !== null

  function handleConfirm() {
    if (!selectedTierId) return
    const num = TIER_TO_BUDGET[selectedTierId] ?? 15000
    setBudget(num)
    setStep(4)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Eyebrow */}
      <div>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>STEP 03 / 05</p>
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

      {/* Budget tier radio rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {budgetTiers.map(tier => {
          const isActive = selectedTierId === tier.id
          return (
            <div
              key={tier.id}
              className="opt"
              onClick={() => setSelectedTierId(tier.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                borderRadius: '3px',
                border: isActive
                  ? '1px solid var(--orange)'
                  : '1px solid rgba(255,255,255,0.08)',
                background: isActive
                  ? 'rgba(255,85,31,0.06)'
                  : 'var(--carbon)',
                borderLeft: isActive
                  ? '2px solid var(--orange)'
                  : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-bebas), sans-serif',
                    fontSize: '1.2rem',
                    letterSpacing: '0.06em',
                    color: isActive ? 'var(--orange)' : 'var(--text)',
                    fontWeight: 700,
                  }}
                >
                  {tier.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.625rem',
                    letterSpacing: '0.12em',
                    color: 'var(--text-3)',
                    marginTop: '3px',
                  }}
                >
                  {tier.sub}
                </div>
              </div>

              {/* Radio dot */}
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: isActive
                    ? '2px solid var(--orange)'
                    : '2px solid rgba(255,255,255,0.2)',
                  background: isActive ? 'var(--orange)' : 'transparent',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              />
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
          SET BUDGET
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: '4px' }}>
            <path d="M2 7h10M8 3l4 4-4 4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
