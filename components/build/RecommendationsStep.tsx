'use client'

import { useBuildStore } from '@/store/buildStore'
import { rankRecommendations, budgetToTierId } from '@/lib/rank'

export default function RecommendationsStep() {
  const purposes = useBuildStore(s => s.purposes)
  const budget   = useBuildStore(s => s.budget)
  const setStep  = useBuildStore(s => s.setStep)

  const purposeIds   = purposes.length > 0 ? purposes : ['p_over']
  const budgetTierId = budgetToTierId(budget)
  const ranked       = rankRecommendations(purposeIds, budgetTierId)

  const n = purposeIds.length
  const profileLabel = `${n} mission profile${n !== 1 ? 's' : ''}`
  const budgetFmt = budget >= 99999
    ? 'Unlimited'
    : '$' + budget.toLocaleString('en-US')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Eyebrow + heading */}
      <div>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>STEP 04 / 05</p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          letterSpacing: '0.04em',
          color: 'var(--text)',
          lineHeight: 1.1,
        }}>
          RECON
        </h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginTop: '4px' }}>
          Review your recommended loadout or take full control of the build.
        </p>
      </div>

      {/* Recommended setup sub-header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5625rem',
          letterSpacing: '0.15em',
          color: 'var(--text-3)',
          textTransform: 'uppercase',
        }}>
          RECOMMENDED SETUP
        </div>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'rgba(255,255,255,0.04)',
        }} />
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5rem',
          letterSpacing: '0.12em',
          color: 'var(--text-3)',
        }}>
          {profileLabel} · <span style={{ color: 'var(--orange)' }}>{budgetFmt}</span>
        </div>
      </div>

      {/* Category cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '12px',
      }}>
        {ranked.map((cat, idx) => (
          <div
            key={cat.id}
            style={{
              background: 'rgba(8,10,20,0.72)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,85,31,0.10)',
              borderRadius: '4px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              position: 'relative',
            }}
          >
            {idx < 2 && (
              <span style={{
                position: 'absolute', top: 12, right: 12,
                fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                letterSpacing: '0.15em', color: '#4ade80',
                border: '1px solid rgba(74,222,128,0.3)',
                background: 'rgba(74,222,128,0.06)',
                padding: '2px 6px', borderRadius: '2px',
              }}>
                {idx === 0 ? 'TOP PICK' : 'PRIORITY'}
              </span>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                letterSpacing: '0.06em', color: 'var(--text)',
              }}>
                {cat.label}
              </span>
            </div>

            {/* Match bar */}
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', marginBottom: '5px',
                fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
                letterSpacing: '0.1em', color: 'var(--text-3)',
              }}>
                <span>MISSION MATCH</span>
                <span style={{ color: 'var(--orange)' }}>{cat.matchPct}%</span>
              </div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${cat.matchPct}%`,
                  background: cat.matchPct >= 80 ? 'var(--orange)' : cat.matchPct >= 50 ? 'rgba(255,85,31,0.6)' : 'rgba(255,85,31,0.3)',
                  borderRadius: '2px',
                  transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
                }} />
              </div>
            </div>

            {/* Product picks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {cat.picks.map(p => (
                <div key={p.name} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  paddingBottom: '5px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.78rem',
                      color: 'var(--text-2)', lineHeight: 1.3,
                    }}>{p.name}</div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                      letterSpacing: '0.1em', color: 'var(--text-3)',
                    }}>{p.brand}</div>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                    color: 'var(--orange)', flexShrink: 0, marginLeft: '8px',
                  }}>
                    ${p.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '8px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <button
          onClick={() => setStep(3)}
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
          {/* Secondary: use the recommended setup to proceed to review */}
          <button
            onClick={() => setStep(5)}
            className="btn btn-ghost btn-sm"
          >
            RECOMMENDED SETUP
          </button>

          {/* Primary: take full manual control */}
          <button
            className="btn btn-primary btn-lg"
            onClick={() => setStep(6)}
          >
            CONFIGURE MANUALLY
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: '6px' }}>
              <path d="M2 7h10M8 3l4 4-4 4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
