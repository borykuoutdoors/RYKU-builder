'use client'

import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { PRODUCTS, CATEGORIES } from '@/data/products'
import { VEHICLES } from '@/data/vehicles'
import { useBuildStore } from '@/store/buildStore'
import { useGarageStore } from '@/store/garageStore'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const DIFF_LABEL: Record<string, string> = {
  easy: 'EASY INSTALL',
  med:  'MODERATE INSTALL',
  hard: 'PRO INSTALL',
}
const DIFF_COLOR: Record<string, string> = {
  easy: '#22c55e',
  med:  'var(--orange)',
  hard: '#ef4444',
}

export default function GearDetailPage() {
  const { id } = useParams<{ id: string }>()
  const product = PRODUCTS.find(p => p.id === id)

  if (!product) notFound()

  const buildItems    = useBuildStore(s => s.items)
  const toggleItem    = useBuildStore(s => s.toggleItem)
  const savedProducts = useGarageStore(s => s.savedProducts)
  const saveProduct   = useGarageStore(s => s.saveProduct)
  const unsaveProduct = useGarageStore(s => s.unsaveProduct)
  const saved         = savedProducts.some(p => p.id === product.id)
  const inBuild = !!buildItems[product.id]

  const compatVehicles = VEHICLES.filter(v => product.compat.includes(v.id))
  const related = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const category = CATEGORIES.find(c => c.id === product.category)

  return (
    <div style={{ minHeight: '100vh', maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
        <Link href="/gear" className="font-mono" style={{
          fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em',
          textTransform: 'uppercase', textDecoration: 'none',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--orange)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          GEAR
        </Link>
        <span className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>/</span>
        <span className="font-mono" style={{
          fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          {product.category}
        </span>
        <span className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>/</span>
        <span className="font-mono" style={{
          fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          {product.name}
        </span>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
        gap: 40,
        marginBottom: 64,
      }}>
        {/* Left: image / emoji block */}
        <div style={{
          background:           'rgba(8,10,20,0.72)',
          backdropFilter:       'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border:               '1px solid rgba(255,85,31,0.12)',
          borderRadius:         8,
          display:              'flex',
          alignItems:           'center',
          justifyContent:       'center',
          minHeight:            280,
          position:             'relative',
          overflow:             'hidden',
        }}>
          {/* Grid decoration */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: [
              'linear-gradient(rgba(255,85,31,0.018) 1px,transparent 1px)',
              'linear-gradient(90deg,rgba(255,85,31,0.018) 1px,transparent 1px)',
            ].join(','),
            backgroundSize: '48px 48px',
          }} />
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div style={{ fontSize: 96, lineHeight: 1, marginBottom: 16 }}>{product.emoji}</div>
            {product.pop && (
              <span className="font-mono" style={{
                fontSize: 10, color: 'var(--cyan)', border: '1px solid var(--cyan)',
                borderRadius: 3, padding: '3px 10px', letterSpacing: '0.14em', textTransform: 'uppercase',
              }}>
                POPULAR PICK
              </span>
            )}
          </div>
        </div>

        {/* Right: product info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Eyebrow: brand + category */}
          <div>
            <SectionEyebrow>{category?.emoji} {product.category}</SectionEyebrow>
            <div className="font-mono" style={{
              fontSize: 12, color: 'var(--orange)', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              {product.brand}
            </div>
          </div>

          {/* Name */}
          <h1 className="font-bebas" style={{
            fontSize: 'clamp(32px, 4vw, 52px)', color: '#fff',
            letterSpacing: '0.04em', lineHeight: 1, margin: 0,
          }}>
            {product.name}
          </h1>

          {/* Price block */}
          <div style={{
            background: 'rgba(255,85,31,0.06)',
            border: '1px solid rgba(255,85,31,0.15)',
            borderRadius: 6,
            padding: '16px 20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
              <div className="font-bebas" style={{ fontSize: 44, color: '#fff', letterSpacing: '0.03em' }}>
                ${product.price.toLocaleString()}
              </div>
              <div className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)' }}>
                PRODUCT PRICE
              </div>
            </div>
            <div className="font-mono" style={{
              fontSize: 12, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em',
            }}>
              + ${product.labor.toLocaleString()} estimated install labor
            </div>
            <div className="font-bebas" style={{
              fontSize: 20, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em', marginTop: 8,
            }}>
              TOTAL: ${(product.price + product.labor).toLocaleString()}
            </div>
          </div>

          {/* Difficulty + Category badges */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="font-mono" style={{
              fontSize: 11, padding: '5px 12px', borderRadius: 4,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              border: `1px solid ${DIFF_COLOR[product.diff]}`,
              color: DIFF_COLOR[product.diff],
            }}>
              {DIFF_LABEL[product.diff]}
            </span>
            <span className="font-mono" style={{
              fontSize: 11, padding: '5px 12px', borderRadius: 4,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              border: '1px solid rgba(102,255,255,0.3)',
              color: 'rgba(102,255,255,0.75)',
            }}>
              {product.category}
            </span>
          </div>

          {/* Note */}
          <p className="font-rajdhani" style={{
            fontSize: 16, color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.6, margin: 0,
          }}>
            {product.note}
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => toggleItem(product)}
              className="font-mono"
              style={{
                flex: 1,
                background: inBuild ? 'rgba(34,197,94,0.12)' : 'var(--orange)',
                border: `1px solid ${inBuild ? '#22c55e' : 'var(--orange)'}`,
                color: inBuild ? '#22c55e' : '#fff',
                padding: '12px 20px',
                borderRadius: 4,
                fontSize: 13,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.18s',
                minWidth: 160,
              }}
            >
              {inBuild ? '✓ IN YOUR BUILD' : '+ ADD TO BUILD'}
            </button>
            <button
              onClick={() => saved ? unsaveProduct(product.id) : saveProduct(product)}
              className="font-mono"
              style={{
                background: saved ? 'rgba(255,85,31,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${saved ? 'rgba(255,85,31,0.5)' : 'rgba(255,255,255,0.15)'}`,
                color: saved ? 'var(--orange)' : 'rgba(255,255,255,0.5)',
                padding: '12px 20px',
                borderRadius: 4,
                fontSize: 13,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.18s',
                flexShrink: 0,
              }}
            >
              {saved ? '♥ SAVED' : '♡ SAVE'}
            </button>
          </div>

          {inBuild && (
            <Link href="/build" className="font-mono" style={{
              fontSize: 11, color: '#22c55e', letterSpacing: '0.1em',
              textDecoration: 'none', textTransform: 'uppercase',
            }}>
              → VIEW IN BUILD PLANNER
            </Link>
          )}
        </div>
      </div>

      {/* ── Compatible Vehicles ───────────────────────────────────────────────── */}
      {compatVehicles.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <div className="font-mono" style={{
            fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em',
            textTransform: 'uppercase', marginBottom: 14,
          }}>
            COMPATIBLE VEHICLES
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {compatVehicles.map(v => (
              <div key={v.id} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'rgba(255,85,31,0.06)',
                border: '1px solid rgba(255,85,31,0.15)',
                borderRadius: 4,
                padding: '7px 14px',
              }}>
                <span style={{ fontSize: 16 }}>{v.emoji}</span>
                <span className="font-rajdhani" style={{
                  fontSize: 14, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.03em',
                }}>
                  {v.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Mission Tags ────────────────────────────────────────────────────────── */}
      {product.mission.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <div className="font-mono" style={{
            fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em',
            textTransform: 'uppercase', marginBottom: 14,
          }}>
            MISSION TYPES
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {product.mission.map(m => (
              <span key={m} className="font-mono" style={{
                fontSize: 11, color: 'var(--cyan)',
                border: '1px solid rgba(102,255,255,0.25)',
                borderRadius: 3, padding: '4px 10px',
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Related Products ────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <SectionEyebrow>MORE IN {product.category.toUpperCase()}</SectionEyebrow>
            <h2 className="font-bebas" style={{
              fontSize: 32, color: '#fff', letterSpacing: '0.05em', margin: 0,
            }}>
              RELATED GEAR
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 14,
          }}>
            {related.map(p => (
              <Link key={p.id} href={`/gear/${p.id}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    background:           'rgba(8,10,20,0.72)',
                    border:               '1px solid rgba(255,85,31,0.12)',
                    borderRadius:         6,
                    padding:              '16px',
                    transition:           'border-color 0.18s, transform 0.18s',
                    cursor:               'pointer',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'var(--orange)'
                    el.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'rgba(255,85,31,0.12)'
                    el.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span style={{ fontSize: 28 }}>{p.emoji}</span>
                    {p.pop && (
                      <span className="font-mono" style={{
                        fontSize: 9, color: 'var(--cyan)', border: '1px solid var(--cyan)',
                        borderRadius: 2, padding: '1px 5px', letterSpacing: '0.08em',
                      }}>
                        POPULAR
                      </span>
                    )}
                  </div>
                  <div className="font-mono" style={{
                    fontSize: 10, color: 'var(--orange)', letterSpacing: '0.1em',
                    textTransform: 'uppercase', marginBottom: 4,
                  }}>
                    {p.brand}
                  </div>
                  <div className="font-bebas" style={{
                    fontSize: 17, color: '#fff', letterSpacing: '0.05em', marginBottom: 6,
                  }}>
                    {p.name}
                  </div>
                  <div className="font-bebas" style={{ fontSize: 20, color: '#fff' }}>
                    ${p.price.toLocaleString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link href={`/gear?category=${encodeURIComponent(product.category)}`} className="btn btn-ghost" style={{ fontSize: 13 }}>
              VIEW ALL {product.category.toUpperCase()}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
