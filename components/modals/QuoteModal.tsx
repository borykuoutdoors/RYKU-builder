'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useBuildStore } from '@/store/buildStore'
import { groupByCategory, formatCurrency, generateQuoteText } from '@/lib/buildUtils'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function QuoteModal({ isOpen, onClose }: Props) {
  const vehicle   = useBuildStore(s => s.vehicle)
  const year      = useBuildStore(s => s.year)
  const trim      = useBuildStore(s => s.trim)
  const budget    = useBuildStore(s => s.budget)
  const items     = useBuildStore(s => s.items)
  const buildName = useBuildStore(s => s.buildName)
  const gearTotal  = useBuildStore(s => s.gearTotal)
  const laborTotal = useBuildStore(s => s.laborTotal)
  const buildTotal = useBuildStore(s => s.buildTotal)

  const gear    = gearTotal()
  const labor   = laborTotal()
  const total   = buildTotal()
  const grouped = groupByCategory(items)

  function handleDownload() {
    const text = generateQuoteText(vehicle, year, trim, buildName, items, gear, labor, budget)
    const blob = new Blob([text], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${buildName.replace(/\s+/g, '-').toLowerCase()}-quote.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        /* Backdrop */
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
        >
          {/* Modal card */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.93 }}
            transition={{ duration: 0.22 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0f0f0f',
              border: '1px solid #2a2a2a',
              borderRadius: 10,
              width: '100%',
              maxWidth: 600,
              maxHeight: '85vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #1e1e1e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <h2 style={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: 28, color: '#fff', letterSpacing: '0.06em', margin: 0,
              }}>
                BUILD QUOTE
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: 'transparent', border: 'none',
                  color: '#555', fontSize: 20, cursor: 'pointer',
                  lineHeight: 1, padding: 4,
                }}
              >
                ✕
              </button>
            </div>

            {/* Build details */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #1e1e1e',
              flexShrink: 0,
              display: 'flex', gap: 24,
              fontFamily: 'monospace', fontSize: 11, color: '#666',
            }}>
              <div>
                <div style={{ color: '#333', marginBottom: 2 }}>VEHICLE</div>
                <div style={{ color: '#aaa' }}>
                  {vehicle ? `${year} ${vehicle.name}` : '—'}
                  {trim ? ` ${trim}` : ''}
                </div>
              </div>
              <div>
                <div style={{ color: '#333', marginBottom: 2 }}>BUILD</div>
                <div style={{ color: '#aaa' }}>{buildName}</div>
              </div>
              <div>
                <div style={{ color: '#333', marginBottom: 2 }}>BUDGET</div>
                <div style={{ color: '#aaa' }}>{formatCurrency(budget)}</div>
              </div>
            </div>

            {/* Line items (scrollable) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px' }}>
              {Object.entries(grouped).map(([cat, products]) => (
                <div key={cat} style={{ marginBottom: 16 }}>
                  <div style={{
                    fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.12em',
                    color: '#f97316', textTransform: 'uppercase',
                    paddingBottom: 6, borderBottom: '1px solid #1a1a1a', marginBottom: 8,
                  }}>
                    {cat}
                  </div>
                  {products.map(p => (
                    <div key={p.id} style={{
                      display: 'flex', alignItems: 'flex-start',
                      justifyContent: 'space-between', gap: 16,
                      padding: '6px 0', borderBottom: '1px solid #111',
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: '#ddd', lineHeight: 1.3 }}>
                          {p.brand} {p.name}
                        </div>
                        {p.labor > 0 && (
                          <div style={{ fontSize: 10, color: '#555', marginTop: 2, fontFamily: 'monospace' }}>
                            Est. labor: {formatCurrency(p.labor)}
                          </div>
                        )}
                      </div>
                      <div style={{
                        fontFamily: 'monospace', fontSize: 13, color: '#fff',
                        fontWeight: 700, whiteSpace: 'nowrap',
                      }}>
                        {formatCurrency(p.price)}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {Object.keys(items).length === 0 && (
                <div style={{
                  textAlign: 'center', color: '#333',
                  fontFamily: 'monospace', fontSize: 12, padding: '40px 0',
                }}>
                  NO ITEMS IN BUILD
                </div>
              )}
            </div>

            {/* Totals */}
            <div style={{
              padding: '14px 24px',
              borderTop: '1px solid #1e1e1e',
              flexShrink: 0,
              background: '#0a0a0a',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontFamily: 'monospace' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#555' }}>
                  <span>GEAR SUBTOTAL</span>
                  <span>{formatCurrency(gear)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#555' }}>
                  <span>EST. LABOR</span>
                  <span>{formatCurrency(labor)}</span>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 15, color: '#fff', fontWeight: 700,
                  paddingTop: 8, marginTop: 4, borderTop: '1px solid #1e1e1e',
                }}>
                  <span>TOTAL BUILD COST</span>
                  <span style={{ color: total > budget ? '#ef4444' : '#f97316' }}>
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Footer actions */}
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    flex: 1, background: '#141414', color: '#aaa',
                    border: '1px solid #2a2a2a', borderRadius: 4,
                    padding: '9px 0', fontSize: 11, fontWeight: 700,
                    fontFamily: 'monospace', letterSpacing: '0.06em', cursor: 'pointer',
                  }}
                >
                  PRINT
                </button>
                <button
                  onClick={handleDownload}
                  style={{
                    flex: 1, background: '#141414', color: '#aaa',
                    border: '1px solid #2a2a2a', borderRadius: 4,
                    padding: '9px 0', fontSize: 11, fontWeight: 700,
                    fontFamily: 'monospace', letterSpacing: '0.06em', cursor: 'pointer',
                  }}
                >
                  DOWNLOAD TXT
                </button>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1, background: '#f97316', color: '#000',
                    border: 'none', borderRadius: 4,
                    padding: '9px 0', fontSize: 11, fontWeight: 700,
                    fontFamily: 'monospace', letterSpacing: '0.06em', cursor: 'pointer',
                  }}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
