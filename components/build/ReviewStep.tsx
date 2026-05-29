'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBuildStore } from '@/store/buildStore'

function formatCurrency(n: number): string {
  return '$' + n.toLocaleString('en-US')
}

export default function ReviewStep() {
  const router      = useRouter()
  const vehicle     = useBuildStore(s => s.vehicle)
  const year        = useBuildStore(s => s.year)
  const trim        = useBuildStore(s => s.trim)
  const purposes    = useBuildStore(s => s.purposes)
  const budget      = useBuildStore(s => s.budget)
  const items       = useBuildStore(s => s.items)
  const buildName   = useBuildStore(s => s.buildName)
  const summaryNote = useBuildStore(s => s.summaryNote)
  const setSummaryNote = useBuildStore(s => s.setSummaryNote)
  const setCompleted   = useBuildStore(s => s.setCompleted)
  const setStep        = useBuildStore(s => s.setStep)
  const gearTotal   = useBuildStore(s => s.gearTotal)
  const laborTotal  = useBuildStore(s => s.laborTotal)
  const buildTotal  = useBuildStore(s => s.buildTotal)

  const [saving, setSaving] = useState(false)

  const itemCount = Object.keys(items).length
  const gear  = gearTotal()
  const labor = laborTotal()
  const total = buildTotal()
  const remaining = budget - total
  const isOverBudget = remaining < 0

  const budgetFmt    = budget >= 99999 ? 'Unlimited' : formatCurrency(budget)
  const purposeCount = purposes.length
  const purposeLabel = purposeCount > 0
    ? `${purposeCount} Purpose${purposeCount !== 1 ? 's' : ''} Selected`
    : '—'

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      setCompleted(true)
      router.push('/my-build')
    }, 900)
  }

  const REVIEW_CARDS = [
    {
      label: 'OPERATOR VEHICLE',
      value: vehicle ? `${year} ${vehicle.name}` : 'Not selected',
      sub:   vehicle ? trim : '',
      icon:  vehicle?.emoji ?? '🚗',
      ok:    !!vehicle,
    },
    {
      label: 'MISSION PROFILE',
      value: purposeLabel,
      sub:   purposeCount > 0
        ? purposes.slice(0, 2).map(id => id.replace('p_', '')).join(' · ').toUpperCase() + (purposeCount > 2 ? ` +${purposeCount - 2}` : '')
        : 'No purposes selected',
      icon:  '🎯',
      ok:    purposeCount > 0,
    },
    {
      label: 'BUILD BUDGET',
      value: budgetFmt,
      sub:   isOverBudget
        ? `OVER by ${formatCurrency(Math.abs(remaining))}`
        : `${formatCurrency(remaining)} remaining`,
      icon:  '💰',
      ok:    !isOverBudget,
    },
    {
      label: 'GEAR SELECTED',
      value: `${itemCount} Items`,
      sub:   itemCount > 0
        ? `Gear: ${formatCurrency(gear)} · Labor: ${formatCurrency(labor)}`
        : 'No gear added yet',
      icon:  '⚙️',
      ok:    itemCount > 0,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Eyebrow */}
      <div>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>STEP 05 / 05</p>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          letterSpacing: '0.04em', color: 'var(--text)',
        }}>
          MISSION REVIEW
        </h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginTop: '4px' }}>
          Confirm your configuration before engaging the build protocol.
        </p>
      </div>

      {/* Build name */}
      <div style={{
        background: 'rgba(255,85,31,0.04)',
        border: '1px solid rgba(255,85,31,0.18)',
        borderRadius: '4px',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: '14px',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.18em', color: 'var(--text-3)' }}>
          BUILD DESIGNATION
        </span>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '1.5rem',
          letterSpacing: '0.06em', color: 'var(--text)',
        }}>
          {buildName}
        </span>
        <div style={{
          marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%',
          background: vehicle ? 'var(--green)' : 'rgba(255,85,31,0.5)',
          boxShadow: vehicle ? '0 0 8px rgba(155,191,106,0.7)' : 'none',
        }} />
      </div>

      {/* Review cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '12px',
      }}>
        {REVIEW_CARDS.map(card => (
          <div
            key={card.label}
            style={{
              background: 'var(--carbon)',
              border: `1px solid ${card.ok ? 'rgba(155,191,106,0.2)' : 'rgba(255,85,31,0.15)'}`,
              borderRadius: '4px',
              padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
                letterSpacing: '0.14em', color: 'var(--text-3)', textTransform: 'uppercase',
              }}>
                {card.label}
              </span>
              <span style={{ fontSize: '1.1rem' }}>{card.icon}</span>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '1.1rem',
              letterSpacing: '0.04em',
              color: card.ok ? 'var(--text)' : 'var(--orange)',
            }}>
              {card.value}
            </div>
            {card.sub && (
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
                letterSpacing: '0.1em', color: isOverBudget && card.label === 'BUILD BUDGET'
                  ? '#f87171' : 'var(--text-3)',
              }}>
                {card.sub}
              </div>
            )}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px',
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: card.ok ? 'var(--green)' : 'rgba(255,85,31,0.5)',
              }} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                letterSpacing: '0.1em', color: card.ok ? 'var(--green)' : 'rgba(255,85,31,0.6)',
              }}>
                {card.ok ? 'CONFIRMED' : 'PENDING'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total cost summary */}
      {itemCount > 0 && (
        <div style={{
          background: 'rgba(10,10,10,0.5)',
          border: '1px solid rgba(255,85,31,0.10)',
          borderRadius: '3px',
          padding: '16px 20px',
          display: 'flex', gap: '24px', flexWrap: 'wrap',
        }}>
          {[
            { label: 'GEAR SUBTOTAL',     value: formatCurrency(gear),  color: 'var(--text-2)' },
            { label: 'EST. LABOR',        value: formatCurrency(labor), color: 'var(--text-2)' },
            { label: 'TOTAL BUILD COST',  value: formatCurrency(total), color: isOverBudget ? '#f87171' : 'var(--orange)', large: true },
          ].map(row => (
            <div key={row.label} style={{ flex: '1 1 120px' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                letterSpacing: '0.15em', color: 'var(--text-3)', marginBottom: '4px',
              }}>
                {row.label}
              </div>
              <div style={{
                fontFamily: row.large ? 'var(--font-display)' : 'var(--font-mono)',
                fontSize: row.large ? '1.4rem' : '0.875rem',
                letterSpacing: row.large ? '0.04em' : '0.08em',
                color: row.color,
              }}>
                {row.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Operator notes */}
      <div>
        <label style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
          letterSpacing: '0.15em', color: 'var(--text-3)', textTransform: 'uppercase',
          display: 'block', marginBottom: '8px',
        }}>
          OPERATOR NOTES (OPTIONAL)
        </label>
        <textarea
          value={summaryNote}
          onChange={e => setSummaryNote(e.target.value)}
          rows={3}
          placeholder="Add any notes about your build vision, timeline, or special requirements..."
          style={{
            width: '100%', resize: 'vertical',
            background: 'var(--surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '3px',
            padding: '12px 14px',
            fontFamily: 'var(--font-body)', fontSize: '0.875rem',
            color: 'var(--text)', outline: 'none',
            lineHeight: 1.6, boxSizing: 'border-box',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,85,31,0.4)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
        />
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setStep(4)}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-3)',
            fontFamily: 'var(--font-tactical)', fontWeight: 600,
            fontSize: '0.75rem', letterSpacing: '0.14em',
            padding: '10px 20px', cursor: 'pointer', borderRadius: '2px',
            textTransform: 'uppercase',
          }}
        >
          ← BACK
        </button>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Secondary: save directly without finding installers */}
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleSave}
            disabled={!vehicle || saving}
            style={{
              opacity: vehicle ? 1 : 0.35,
              cursor: vehicle ? 'pointer' : 'not-allowed',
            }}
          >
            {saving ? 'SAVING...' : 'SAVE BUILD'}
          </button>

          {/* Primary: move to Find Installers step */}
          <button
            className="btn btn-primary btn-lg"
            onClick={() => setStep(7)}
            disabled={!vehicle}
            style={{
              opacity: vehicle ? 1 : 0.4,
              cursor: vehicle ? 'pointer' : 'not-allowed',
              minWidth: '200px', justifyContent: 'center',
            }}
          >
            FIND INSTALLERS
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: '6px' }}>
              <path d="M2 7h10M8 3l4 4-4 4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
