'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS, CATEGORIES } from '@/data/products'
import { VEHICLES } from '@/data/vehicles'
import type { Product } from '@/types/product'
import { useBuildStore } from '@/store/buildStore'
import SectionEyebrow from '@/components/ui/SectionEyebrow'
import AnimatedSearchBar from '@/components/ui/AnimatedSearchBar'
import ShineBorder from '@/components/ui/ShineBorder'

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = 'price-asc' | 'price-desc' | 'alpha' | 'popular'

type PricePreset = 'all' | 'u500' | '500-1500' | '1500-5000' | 'o5000'

const PRICE_PRESETS: { id: PricePreset; label: string; min: number; max: number | null }[] = [
  { id: 'all',      label: 'All Prices',      min: 0,    max: null },
  { id: 'u500',     label: 'Under $500',       min: 0,    max: 500  },
  { id: '500-1500', label: '$500 – $1,500',    min: 500,  max: 1500 },
  { id: '1500-5000',label: '$1,500 – $5,000',  min: 1500, max: 5000 },
  { id: 'o5000',    label: '$5,000+',          min: 5000, max: null },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DIFF_LABEL: Record<string, string> = {
  easy: 'EASY INSTALL',
  med:  'MOD INSTALL',
  hard: 'PRO INSTALL',
}
const DIFF_COLOR: Record<string, string> = {
  easy: '#22c55e',
  med:  'var(--orange)',
  hard: '#ef4444',
}

function sortProducts(list: Product[], sort: SortKey): Product[] {
  return [...list].sort((a, b) => {
    if (sort === 'price-asc')  return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'popular')    return (b.pop ? 1 : 0) - (a.pop ? 1 : 0)
    return a.name.localeCompare(b.name)
  })
}

// ─── ProductCard ──────────────────────────────────────────────────────────────

interface CardProps {
  product:     Product
  featured?:   boolean
  inBuild:     boolean
  saved:       boolean
  inCompare:   boolean
  compareCount: number
  onBuild:     () => void
  onSave:      () => void
  onCompare:   () => void
}

function ProductCard({
  product, featured, inBuild, saved, inCompare, compareCount, onBuild, onSave, onCompare,
}: CardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:           'rgba(8,10,20,0.72)',
        backdropFilter:       'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border:         featured ? 'none' : `1px solid ${hovered ? 'var(--orange)' : 'rgba(255,85,31,0.14)'}`,
        borderRadius:   6,
        padding:        '20px',
        display:        'flex',
        flexDirection:  'column',
        gap:            '10px',
        height:         '100%',
        transform:      !featured && hovered ? 'translateY(-3px)' : 'none',
        boxShadow:      hovered ? '0 8px 28px rgba(255,85,31,0.1)' : 'none',
        transition:     'border-color 0.18s, transform 0.18s, box-shadow 0.18s',
        position:       'relative',
      }}
    >
      {/* Top row: emoji + badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <span style={{ fontSize: 40, lineHeight: 1 }}>{product.emoji}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
          {product.pop && (
            <span className="font-mono" style={{
              fontSize: 10, color: 'var(--cyan)', border: '1px solid var(--cyan)',
              borderRadius: 3, padding: '2px 6px', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              POPULAR
            </span>
          )}
          {inBuild && (
            <span className="font-mono" style={{
              fontSize: 10, color: '#22c55e', border: '1px solid #22c55e',
              borderRadius: 3, padding: '2px 6px', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              IN BUILD
            </span>
          )}
        </div>
      </div>

      {/* Brand */}
      <div className="font-mono" style={{
        fontSize: 11, color: 'var(--orange)', letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        {product.brand}
      </div>

      {/* Name — links to detail page */}
      <Link href={`/gear/${product.id}`} style={{ textDecoration: 'none' }}>
        <div className="font-bebas" style={{
          fontSize: 20, color: '#fff', letterSpacing: '0.05em', lineHeight: 1.1,
          cursor: 'pointer',
          textDecoration: hovered ? 'underline' : 'none',
          textUnderlineOffset: 3,
        }}>
          {product.name}
        </div>
      </Link>

      {/* Price */}
      <div className="font-bebas" style={{ fontSize: 26, color: '#fff', letterSpacing: '0.03em' }}>
        ${product.price.toLocaleString()}
        <span className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', marginLeft: 8 }}>
          + ${product.labor.toLocaleString()} LABOR
        </span>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span className="font-mono" style={{
          fontSize: 10, padding: '2px 7px', borderRadius: 3,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          border: `1px solid ${DIFF_COLOR[product.diff]}`,
          color: DIFF_COLOR[product.diff],
        }}>
          {DIFF_LABEL[product.diff]}
        </span>
        <span className="font-mono" style={{
          fontSize: 10, padding: '2px 7px', borderRadius: 3,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          border: '1px solid rgba(102,255,255,0.3)',
          color: 'rgba(102,255,255,0.75)',
        }}>
          {product.category}
        </span>
      </div>

      {/* Note */}
      <div className="font-rajdhani" style={{
        fontSize: 13, color: 'rgba(255,255,255,0.48)', lineHeight: 1.5, flexGrow: 1,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {product.note}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        {/* Add to Build */}
        <button
          onClick={onBuild}
          className="font-mono"
          style={{
            flex: 1,
            background: inBuild ? 'rgba(34,197,94,0.12)' : 'rgba(255,85,31,0.10)',
            border: `1px solid ${inBuild ? '#22c55e' : 'rgba(255,85,31,0.35)'}`,
            color: inBuild ? '#22c55e' : 'rgba(255,255,255,0.8)',
            padding: '7px 10px',
            borderRadius: 4,
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.18s',
            whiteSpace: 'nowrap',
          }}
        >
          {inBuild ? '✓ IN BUILD' : '+ ADD TO BUILD'}
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          title={saved ? 'Remove from saved' : 'Save product'}
          style={{
            width: 34,
            background: saved ? 'rgba(255,85,31,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${saved ? 'rgba(255,85,31,0.5)' : 'rgba(255,255,255,0.10)'}`,
            color: saved ? 'var(--orange)' : 'rgba(255,255,255,0.4)',
            borderRadius: 4,
            fontSize: 15,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.18s',
            flexShrink: 0,
          }}
        >
          {saved ? '♥' : '♡'}
        </button>

        {/* Compare */}
        <button
          onClick={onCompare}
          disabled={!inCompare && compareCount >= 3}
          title={inCompare ? 'Remove from compare' : compareCount >= 3 ? 'Max 3 items' : 'Add to compare'}
          className="font-mono"
          style={{
            width: 34,
            background: inCompare ? 'rgba(102,255,255,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${inCompare ? 'rgba(102,255,255,0.5)' : 'rgba(255,255,255,0.10)'}`,
            color: inCompare ? 'var(--cyan)' : !inCompare && compareCount >= 3 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)',
            borderRadius: 4,
            fontSize: 14,
            cursor: !inCompare && compareCount >= 3 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.18s',
            flexShrink: 0,
            opacity: !inCompare && compareCount >= 3 ? 0.4 : 1,
          }}
        >
          {inCompare ? '✕' : '⊕'}
        </button>
      </div>
    </div>
  )
}

// ─── Compare Modal ────────────────────────────────────────────────────────────

function CompareModal({
  products, onClose,
}: { products: Product[]; onClose: () => void }) {
  const rows: { label: string; key: (p: Product) => string }[] = [
    { label: 'Price',     key: p => '$' + p.price.toLocaleString() },
    { label: 'Labor',     key: p => '$' + p.labor.toLocaleString() },
    { label: 'Category',  key: p => p.category },
    { label: 'Difficulty',key: p => DIFF_LABEL[p.diff] },
    { label: 'Vehicles',  key: p => p.compat.join(', ') || '—' },
    { label: 'Mission',   key: p => p.mission.join(', ') || '—' },
  ]

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)', zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(8,10,20,0.97)',
          border: '1px solid rgba(255,85,31,0.25)',
          borderRadius: 8,
          padding: '28px 32px',
          maxWidth: 900,
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <SectionEyebrow>PRODUCT COMPARE</SectionEyebrow>
            <div className="font-bebas" style={{ fontSize: 28, color: '#fff', letterSpacing: '0.06em' }}>
              SIDE-BY-SIDE COMPARISON
            </div>
          </div>
          <button
            onClick={onClose}
            className="font-mono"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.5)',
              padding: '6px 14px',
              borderRadius: 4,
              fontSize: 11,
              letterSpacing: '0.1em',
              cursor: 'pointer',
            }}
          >
            CLOSE ✕
          </button>
        </div>

        {/* Product headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `160px repeat(${products.length}, 1fr)`,
          gap: 12,
          marginBottom: 20,
        }}>
          <div />
          {products.map(p => (
            <div key={p.id} style={{
              background: 'rgba(255,85,31,0.06)',
              border: '1px solid rgba(255,85,31,0.15)',
              borderRadius: 6,
              padding: '16px 14px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{p.emoji}</div>
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--orange)', letterSpacing: '0.1em', marginBottom: 4 }}>
                {p.brand}
              </div>
              <div className="font-bebas" style={{ fontSize: 17, color: '#fff', letterSpacing: '0.05em', lineHeight: 1.2 }}>
                {p.name}
              </div>
              <div className="font-bebas" style={{ fontSize: 22, color: '#fff', marginTop: 8 }}>
                ${p.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison rows */}
        {rows.map((row, ri) => (
          <div key={row.label} style={{
            display: 'grid',
            gridTemplateColumns: `160px repeat(${products.length}, 1fr)`,
            gap: 12,
            marginBottom: 8,
          }}>
            <div className="font-mono" style={{
              fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em',
              textTransform: 'uppercase', display: 'flex', alignItems: 'center',
            }}>
              {row.label}
            </div>
            {products.map(p => (
              <div key={p.id} style={{
                background: ri % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent',
                borderRadius: 4,
                padding: '10px 14px',
              }}>
                <div className="font-rajdhani" style={{
                  fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4,
                }}>
                  {row.key(p)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const cardVariants = {
  hidden:  { opacity: 0, y: 18, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1], delay: i * 0.03 },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
}

export default function GearPage() {
  // ── Filter state ────────────────────────────────────────────────────────────
  const [searchTerm,      setSearchTerm]      = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState('all')
  const [activeCategory,  setActiveCategory]  = useState('ALL')
  const [selectedBrands,  setSelectedBrands]  = useState<Set<string>>(new Set())
  const [pricePreset,     setPricePreset]      = useState<PricePreset>('all')
  const [sort,            setSort]             = useState<SortKey>('price-asc')

  // ── UI state ────────────────────────────────────────────────────────────────
  const [savedIds,         setSavedIds]         = useState<Set<string>>(new Set())
  const [compareList,      setCompareList]       = useState<string[]>([])
  const [showCompareModal, setShowCompareModal]  = useState(false)
  const [sidebarOpen,      setSidebarOpen]       = useState(false)

  // ── Build store ─────────────────────────────────────────────────────────────
  const buildItems  = useBuildStore(s => s.items)
  const toggleItem  = useBuildStore(s => s.toggleItem)

  // ── Price range from preset ─────────────────────────────────────────────────
  const priceRange = useMemo(() =>
    PRICE_PRESETS.find(p => p.id === pricePreset)!,
    [pricePreset]
  )

  // ── Filtered & sorted products ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = PRODUCTS

    if (selectedVehicle !== 'all') {
      list = list.filter(p => p.compat.includes(selectedVehicle))
    }
    if (activeCategory !== 'ALL') {
      list = list.filter(p => p.category === activeCategory)
    }
    if (selectedBrands.size > 0) {
      list = list.filter(p => selectedBrands.has(p.brand))
    }
    if (priceRange.min > 0) {
      list = list.filter(p => p.price >= priceRange.min)
    }
    if (priceRange.max !== null) {
      list = list.filter(p => p.price <= priceRange.max!)
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.note ?? '').toLowerCase().includes(q)
      )
    }

    return sortProducts(list, sort)
  }, [selectedVehicle, activeCategory, selectedBrands, priceRange, sort, searchTerm])

  // ── Category counts (ignores category filter, based on vehicle+search+price) ─
  const categoryCounts = useMemo(() => {
    let base = PRODUCTS
    if (selectedVehicle !== 'all') base = base.filter(p => p.compat.includes(selectedVehicle))
    if (priceRange.min > 0)        base = base.filter(p => p.price >= priceRange.min)
    if (priceRange.max !== null)   base = base.filter(p => p.price <= priceRange.max!)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      base = base.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }
    const counts: Record<string, number> = { ALL: base.length }
    for (const cat of CATEGORIES) counts[cat.id] = base.filter(p => p.category === cat.id).length
    return counts
  }, [selectedVehicle, priceRange, searchTerm])

  // ── Available brands (based on vehicle + category + search, ignores brand filter)
  const availableBrands = useMemo(() => {
    let base = PRODUCTS
    if (selectedVehicle !== 'all') base = base.filter(p => p.compat.includes(selectedVehicle))
    if (activeCategory !== 'ALL')  base = base.filter(p => p.category === activeCategory)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      base = base.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    }
    return Array.from(new Set(base.map(p => p.brand))).sort()
  }, [selectedVehicle, activeCategory, searchTerm])

  // ── Active filter chips list ─────────────────────────────────────────────────
  const activeChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = []
    if (selectedVehicle !== 'all') {
      const v = VEHICLES.find(v => v.id === selectedVehicle)
      chips.push({ label: v?.name ?? selectedVehicle, onRemove: () => setSelectedVehicle('all') })
    }
    if (activeCategory !== 'ALL') {
      chips.push({ label: activeCategory, onRemove: () => setActiveCategory('ALL') })
    }
    Array.from(selectedBrands).forEach(b => {
      chips.push({
        label: b,
        onRemove: () => setSelectedBrands(prev => { const s = new Set(prev); s.delete(b); return s }),
      })
    })
    if (pricePreset !== 'all') {
      chips.push({ label: priceRange.label, onRemove: () => setPricePreset('all') })
    }
    return chips
  }, [selectedVehicle, activeCategory, selectedBrands, pricePreset, priceRange])

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const toggleBrand = useCallback((brand: string) => {
    setSelectedBrands(prev => {
      const s = new Set(prev)
      s.has(brand) ? s.delete(brand) : s.add(brand)
      return s
    })
  }, [])

  const toggleSave = useCallback((id: string) => {
    setSavedIds(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }, [])

  const toggleCompare = useCallback((id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 3)  return prev
      return [...prev, id]
    })
  }, [])

  const clearAllFilters = () => {
    setSelectedVehicle('all')
    setActiveCategory('ALL')
    setSelectedBrands(new Set())
    setPricePreset('all')
    setSearchTerm('')
  }

  const hasFilters = selectedVehicle !== 'all' || activeCategory !== 'ALL' ||
    selectedBrands.size > 0 || pricePreset !== 'all' || searchTerm.trim() !== ''

  const compareProducts = compareList.map(id => PRODUCTS.find(p => p.id === id)!).filter(Boolean)

  // ── Sidebar content ──────────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Categories */}
      <div>
        <div className="font-mono" style={{
          fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em',
          textTransform: 'uppercase', marginBottom: 10,
        }}>
          CATEGORIES
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* ALL */}
          <button
            onClick={() => setActiveCategory('ALL')}
            className="font-rajdhani"
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: activeCategory === 'ALL' ? 'rgba(255,85,31,0.12)' : 'transparent',
              border:     activeCategory === 'ALL' ? '1px solid rgba(255,85,31,0.3)' : '1px solid transparent',
              borderRadius: 4,
              padding: '7px 10px',
              color: activeCategory === 'ALL' ? '#fff' : 'rgba(255,255,255,0.55)',
              fontSize: 14,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
              width: '100%',
            }}
          >
            <span>All Gear</span>
            <span className="font-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
              {categoryCounts['ALL'] ?? 0}
            </span>
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="font-rajdhani"
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: activeCategory === cat.id ? 'rgba(255,85,31,0.12)' : 'transparent',
                border:     activeCategory === cat.id ? '1px solid rgba(255,85,31,0.3)' : '1px solid transparent',
                borderRadius: 4,
                padding: '7px 10px',
                color: activeCategory === cat.id ? '#fff' : 'rgba(255,255,255,0.55)',
                fontSize: 14,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
                width: '100%',
                opacity: (categoryCounts[cat.id] ?? 0) === 0 ? 0.35 : 1,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 13 }}>{cat.emoji}</span>
                <span>{cat.label}</span>
              </span>
              <span className="font-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                {categoryCounts[cat.id] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      {availableBrands.length > 0 && (
        <div>
          <div className="font-mono" style={{
            fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em',
            textTransform: 'uppercase', marginBottom: 10,
          }}>
            BRANDS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 220, overflowY: 'auto' }}>
            {availableBrands.map(brand => (
              <label key={brand} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                cursor: 'pointer', padding: '2px 0',
              }}>
                <input
                  type="checkbox"
                  checked={selectedBrands.has(brand)}
                  onChange={() => toggleBrand(brand)}
                  style={{ accentColor: 'var(--orange)', width: 13, height: 13, cursor: 'pointer' }}
                />
                <span className="font-rajdhani" style={{
                  fontSize: 13, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.02em',
                }}>
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <div className="font-mono" style={{
          fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em',
          textTransform: 'uppercase', marginBottom: 10,
        }}>
          PRICE RANGE
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {PRICE_PRESETS.map(preset => (
            <label key={preset.id} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              cursor: 'pointer', padding: '2px 0',
            }}>
              <input
                type="radio"
                name="price-preset"
                checked={pricePreset === preset.id}
                onChange={() => setPricePreset(preset.id)}
                style={{ accentColor: 'var(--orange)', cursor: 'pointer' }}
              />
              <span className="font-rajdhani" style={{
                fontSize: 13, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.02em',
              }}>
                {preset.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={clearAllFilters}
          className="font-mono"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.5)',
            padding: '8px 14px',
            borderRadius: 4,
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.18s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.borderColor = 'rgba(255,85,31,0.4)'
            el.style.color = 'var(--orange)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.borderColor = 'rgba(255,255,255,0.12)'
            el.style.color = 'rgba(255,255,255,0.5)'
          }}
        >
          ✕ CLEAR ALL FILTERS
        </button>
      )}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div style={{
        padding: '48px 24px 40px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: [
            'linear-gradient(rgba(255,85,31,0.014) 1px,transparent 1px)',
            'linear-gradient(90deg,rgba(255,85,31,0.014) 1px,transparent 1px)',
          ].join(','),
          backgroundSize: '60px 60px',
        }} />
        <div style={{
          position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,85,31,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <SectionEyebrow>GEAR CATALOG</SectionEyebrow>
          <h1 className="font-bebas" style={{
            fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.05em',
            color: '#fff', margin: '8px 0',
          }}>
            THIRD-PARTY OVERLAND GEAR
          </h1>
          <p className="font-rajdhani" style={{
            color: 'rgba(255,255,255,0.5)', fontSize: 16, margin: 0,
          }}>
            {PRODUCTS.length} products · {CATEGORIES.length} categories · compatibility-verified for your rig
          </p>
          <div style={{ maxWidth: 520, margin: '28px auto 0' }}>
            <AnimatedSearchBar
              placeholder="Search gear, brands, categories…"
              value={searchTerm}
              onChange={setSearchTerm}
              aria-label="Search gear catalog"
              data-search-scope="gear"
            />
          </div>
        </div>
      </div>

      {/* ── Sticky Filter Bar ─────────────────────────────────────────────────── */}
      <div style={{
        background:           'rgba(5,8,17,0.92)',
        borderBottom:         '1px solid rgba(255,255,255,0.04)',
        backdropFilter:       'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding:              '12px 24px',
        position:             'sticky',
        top:                  'var(--nav-h)',
        zIndex:               20,
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10,
        }}>
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="font-mono"
            style={{
              display: 'none', // shown via media-query workaround below
              background: 'rgba(255,85,31,0.10)',
              border: '1px solid rgba(255,85,31,0.3)',
              color: 'rgba(255,255,255,0.7)',
              padding: '6px 12px',
              borderRadius: 4,
              fontSize: 11,
              letterSpacing: '0.08em',
              cursor: 'pointer',
            }}
            data-mobile-filter-toggle="true"
          >
            ⚙ FILTERS {hasFilters ? `(${activeChips.length})` : ''}
          </button>

          {/* Vehicle */}
          <select
            className="font-mono"
            value={selectedVehicle}
            onChange={e => setSelectedVehicle(e.target.value)}
            data-filter="vehicle"
            style={{
              background: 'rgba(8,10,20,0.88)',
              border: '1px solid rgba(255,85,31,0.3)',
              color: 'rgba(255,255,255,0.7)',
              padding: '7px 12px',
              borderRadius: 4,
              fontSize: 12,
              letterSpacing: '0.08em',
              cursor: 'pointer',
            }}
          >
            <option value="all">ALL VEHICLES</option>
            {VEHICLES.map(v => (
              <option key={v.id} value={v.id}>{v.name.toUpperCase()}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            className="font-mono"
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            data-filter="sort"
            style={{
              background: 'rgba(8,10,20,0.88)',
              border: '1px solid rgba(255,85,31,0.3)',
              color: 'rgba(255,255,255,0.7)',
              padding: '7px 12px',
              borderRadius: 4,
              fontSize: 12,
              letterSpacing: '0.08em',
              cursor: 'pointer',
            }}
          >
            <option value="price-asc">PRICE: LOW → HIGH</option>
            <option value="price-desc">PRICE: HIGH → LOW</option>
            <option value="alpha">ALPHABETICAL</option>
            <option value="popular">POPULAR FIRST</option>
          </select>

          {/* Active filter chips */}
          {activeChips.map(chip => (
            <button
              key={chip.label}
              onClick={chip.onRemove}
              className="font-mono"
              style={{
                background: 'rgba(255,85,31,0.12)',
                border: '1px solid rgba(255,85,31,0.35)',
                color: 'var(--orange)',
                padding: '4px 10px',
                borderRadius: 3,
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              {chip.label} <span style={{ opacity: 0.7 }}>✕</span>
            </button>
          ))}

          {/* Result count (pushed right) */}
          <div className="font-mono" style={{
            marginLeft: 'auto',
            fontSize: 11,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            {filtered.length} PRODUCTS
          </div>
        </div>
      </div>

      {/* ── Body: Sidebar + Grid ─────────────────────────────────────────────── */}
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        padding: '24px 24px 80px',
        display: 'flex', gap: 24, alignItems: 'flex-start',
      }}>

        {/* ── Sidebar (desktop) ────────────────────────────────────────────── */}
        <div style={{
          width: 220, flexShrink: 0,
          position: 'sticky',
          top: 'calc(var(--nav-h) + 57px)',
          maxHeight: 'calc(100vh - var(--nav-h) - 80px)',
          overflowY: 'auto',
        }}>
          <SidebarContent />
        </div>

        {/* ── Product Grid ─────────────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: 'rgba(255,255,255,0.38)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div className="font-bebas" style={{
                fontSize: 28, letterSpacing: '0.06em', marginBottom: 8, color: 'rgba(255,255,255,0.6)',
              }}>
                NO PRODUCTS FOUND
              </div>
              <div className="font-rajdhani" style={{ fontSize: 15, marginBottom: 20 }}>
                Try adjusting your filters or search term.
              </div>
              {hasFilters && (
                <button
                  onClick={clearAllFilters}
                  className="btn btn-ghost"
                  style={{ fontSize: 13 }}
                >
                  CLEAR ALL FILTERS
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`${selectedVehicle}-${activeCategory}-${sort}-${pricePreset}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 16,
                }}
              >
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    style={{ height: '100%' }}
                  >
                    {product.pop ? (
                      <ShineBorder variant="featured" borderRadius={6} style={{ height: '100%' }}>
                        <ProductCard
                          product={product}
                          featured
                          inBuild={!!buildItems[product.id]}
                          saved={savedIds.has(product.id)}
                          inCompare={compareList.includes(product.id)}
                          compareCount={compareList.length}
                          onBuild={() => toggleItem(product)}
                          onSave={() => toggleSave(product.id)}
                          onCompare={() => toggleCompare(product.id)}
                        />
                      </ShineBorder>
                    ) : (
                      <ProductCard
                        product={product}
                        inBuild={!!buildItems[product.id]}
                        saved={savedIds.has(product.id)}
                        inCompare={compareList.includes(product.id)}
                        compareCount={compareList.length}
                        onBuild={() => toggleItem(product)}
                        onSave={() => toggleSave(product.id)}
                        onCompare={() => toggleCompare(product.id)}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* ── Mobile Sidebar Drawer ────────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="sidebar-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 90,
              }}
            />
            <motion.div
              key="sidebar-drawer"
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              style={{
                position: 'fixed', top: 0, left: 0, bottom: 0,
                width: 280,
                background: 'rgba(5,8,17,0.98)',
                borderRight: '1px solid rgba(255,85,31,0.15)',
                zIndex: 100,
                padding: '24px 20px',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div className="font-bebas" style={{ fontSize: 20, color: '#fff', letterSpacing: '0.08em' }}>
                  FILTERS
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    background: 'transparent', border: 'none',
                    color: 'rgba(255,255,255,0.5)', fontSize: 18, cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Compare Bar ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            key="compare-bar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            exit={{   y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0,
              background: 'rgba(8,10,20,0.97)',
              borderTop: '1px solid rgba(255,85,31,0.25)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              padding: '14px 24px',
              zIndex: 50,
              display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            }}
          >
            <div className="font-mono" style={{
              fontSize: 10, color: 'var(--cyan)', letterSpacing: '0.14em', textTransform: 'uppercase',
              flexShrink: 0,
            }}>
              COMPARE ({compareList.length}/3)
            </div>

            {compareProducts.map(p => (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'rgba(255,85,31,0.07)',
                border: '1px solid rgba(255,85,31,0.2)',
                borderRadius: 4,
                padding: '5px 10px',
              }}>
                <span style={{ fontSize: 14 }}>{p.emoji}</span>
                <span className="font-rajdhani" style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                  {p.name}
                </span>
                <button
                  onClick={() => toggleCompare(p.id)}
                  style={{
                    background: 'transparent', border: 'none',
                    color: 'rgba(255,255,255,0.4)', fontSize: 12,
                    cursor: 'pointer', padding: 0, lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}

            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => setCompareList([])}
                className="font-mono"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.45)',
                  padding: '7px 14px',
                  borderRadius: 4,
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                }}
              >
                CLEAR
              </button>
              <button
                onClick={() => setShowCompareModal(true)}
                disabled={compareList.length < 2}
                className="font-mono"
                style={{
                  background: compareList.length >= 2 ? 'var(--orange)' : 'rgba(255,85,31,0.2)',
                  border: '1px solid var(--orange)',
                  color: compareList.length >= 2 ? '#fff' : 'rgba(255,255,255,0.3)',
                  padding: '7px 18px',
                  borderRadius: 4,
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  cursor: compareList.length >= 2 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.18s',
                }}
              >
                COMPARE NOW →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Compare Modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCompareModal && compareProducts.length >= 2 && (
          <motion.div
            key="compare-modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <CompareModal
              products={compareProducts}
              onClose={() => setShowCompareModal(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
