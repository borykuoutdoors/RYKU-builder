'use client'

import { useRef, useEffect, useState } from 'react'
import { useBuildStore } from '@/store/buildStore'
import { getBuildWarnings, groupByCategory, formatCurrency } from '@/lib/buildUtils'
import QuoteModal from '@/components/modals/QuoteModal'

export default function BuildSummary() {
  const vehicle     = useBuildStore(s => s.vehicle)
  const year        = useBuildStore(s => s.year)
  const trim        = useBuildStore(s => s.trim)
  const budget      = useBuildStore(s => s.budget)
  const items       = useBuildStore(s => s.items)
  const buildName   = useBuildStore(s => s.buildName)
  const setBuildName = useBuildStore(s => s.setBuildName)
  const removeItem  = useBuildStore(s => s.removeItem)
  const gearTotal   = useBuildStore(s => s.gearTotal)
  const laborTotal  = useBuildStore(s => s.laborTotal)
  const buildTotal  = useBuildStore(s => s.buildTotal)
  const budgetPercent = useBuildStore(s => s.budgetPercent)
  const isOverBudget  = useBuildStore(s => s.isOverBudget)
  const mission       = useBuildStore(s => s.mission)

  const [quoteOpen, setQuoteOpen] = useState(false)
  const [toastMsg, setToastMsg]   = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const warnings = getBuildWarnings(items, mission)
  const grouped  = groupByCategory(items)
  const gear     = gearTotal()
  const labor    = laborTotal()
  const total    = buildTotal()
  const pct      = budgetPercent()
  const over     = isOverBudget()
  const remaining = budget - total

  // data-pid remove buttons via event delegation
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    function handleClick(e: MouseEvent) {
      const btn = (e.target as HTMLElement).closest('[data-pid]') as HTMLElement | null
      if (!btn) return
      const pid = btn.getAttribute('data-pid')
      if (pid) removeItem(pid)
    }
    el.addEventListener('click', handleClick)
    return () => el.removeEventListener('click', handleClick)
  }, [removeItem])

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2500)
  }

  const hasItems = Object.keys(items).length > 0

  return (
    <>
      <div className="build-summary-panel" style={{
        width: 280,
        minWidth: 280,
        background: '#0a0a0a',
        borderLeft: '1px solid #1e1e1e',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <style>{`
          @media (max-width: 767px) {
            .build-summary-panel {
              width: 100% !important;
              min-width: 0 !important;
              height: auto !important;
              overflow: visible !important;
              border-left: none !important;
              border-top: 1px solid #1e1e1e;
            }
            .build-summary-panel > div[style*="flex: 1"] {
              overflow-y: visible !important;
              max-height: none !important;
            }
          }
        `}</style>
        {/* Header: build name input */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e1e1e', flexShrink: 0 }}>
          <input
            type="text"
            value={buildName}
            onChange={e => setBuildName(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid #333',
              color: '#fff',
              fontSize: 16,
              fontFamily: '"Bebas Neue", sans-serif',
              letterSpacing: '0.08em',
              width: '100%',
              outline: 'none',
              paddingBottom: 4,
            }}
            placeholder="MY BUILD"
          />
          {vehicle && (
            <div style={{ fontSize: 10, color: '#555', marginTop: 6, fontFamily: 'monospace' }}>
              {year} {vehicle.name} — {trim}
            </div>
          )}
        </div>

        {/* Item list */}
        <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {!hasItems ? (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: 120, color: '#2a2a2a', fontSize: 12,
              fontFamily: 'monospace', letterSpacing: '0.08em', textAlign: 'center',
            }}>
              YOUR BUILD IS EMPTY
            </div>
          ) : (
            Object.entries(grouped).map(([cat, products]) => (
              <div key={cat} style={{ marginBottom: 6 }}>
                <div style={{
                  padding: '4px 16px', fontSize: 9, color: '#444',
                  fontFamily: 'monospace', letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>
                  {cat}
                </div>
                {products.map(p => (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center',
                    padding: '6px 16px', gap: 8,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: '#ddd', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: 10, color: '#f97316', fontFamily: 'monospace' }}>
                        {formatCurrency(p.price)}
                      </div>
                    </div>
                    <button
                      data-pid={p.id}
                      style={{
                        background: 'transparent', border: 'none',
                        color: '#555', cursor: 'pointer', fontSize: 14,
                        padding: '2px 4px', borderRadius: 3,
                        transition: 'color 0.15s',
                        flexShrink: 0,
                      }}
                      title={`Remove ${p.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Totals */}
        <div style={{
          borderTop: '1px solid #1e1e1e',
          padding: '12px 16px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'monospace', fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
              <span>GEAR SUBTOTAL</span>
              <span>{formatCurrency(gear)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
              <span>EST. LABOR</span>
              <span>{formatCurrency(labor)}</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              color: '#fff', fontWeight: 700, fontSize: 14,
              paddingTop: 6, borderTop: '1px solid #1e1e1e', marginTop: 2,
            }}>
              <span>TOTAL BUILD COST</span>
              <span style={{ color: over ? '#ef4444' : '#fff' }}>{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Budget bar */}
          <div style={{ marginTop: 12 }}>
            <div style={{
              height: 4, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: over ? '#ef4444' : '#f97316',
                transition: 'width 0.3s, background 0.3s',
                borderRadius: 2,
              }} />
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: 5, fontSize: 10, fontFamily: 'monospace',
            }}>
              <span style={{ color: '#444' }}>BUDGET {formatCurrency(budget)}</span>
              <span style={{ color: remaining >= 0 ? '#22c55e' : '#ef4444', fontWeight: 700 }}>
                {remaining >= 0 ? `+${formatCurrency(remaining)}` : formatCurrency(remaining)}
              </span>
            </div>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {warnings.map((w, i) => (
                <div key={i} style={{
                  fontSize: 10, color: '#f59e0b', background: '#1a1200',
                  border: '1px solid #78350f', borderRadius: 4, padding: '5px 8px',
                  lineHeight: 1.4,
                }}>
                  ⚠ {w}
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <button
              onClick={() => setQuoteOpen(true)}
              style={{
                background: '#f97316', color: '#000',
                border: 'none', borderRadius: 4,
                padding: '9px 0', fontSize: 12, fontWeight: 700,
                fontFamily: 'monospace', letterSpacing: '0.08em',
                cursor: 'pointer', width: '100%',
              }}
            >
              GENERATE QUOTE
            </button>
            <button
              onClick={() => showToast('Build saved!')}
              style={{
                background: '#141414', color: '#aaa',
                border: '1px solid #2a2a2a', borderRadius: 4,
                padding: '8px 0', fontSize: 12, fontWeight: 700,
                fontFamily: 'monospace', letterSpacing: '0.08em',
                cursor: 'pointer', width: '100%',
              }}
            >
              SAVE BUILD
            </button>
            <a
              href="/installers"
              style={{
                display: 'block', textAlign: 'center',
                background: '#141414', color: '#aaa',
                border: '1px solid #2a2a2a', borderRadius: 4,
                padding: '8px 0', fontSize: 12, fontWeight: 700,
                fontFamily: 'monospace', letterSpacing: '0.08em',
                textDecoration: 'none',
              }}
            >
              SEND TO INSTALLER
            </a>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: '#22c55e', color: '#000',
          padding: '10px 20px', borderRadius: 6, fontSize: 13,
          fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.06em',
          zIndex: 9999, pointerEvents: 'none',
        }}>
          {toastMsg}
        </div>
      )}

      {/* Quote Modal */}
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  )
}
