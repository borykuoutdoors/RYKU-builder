'use client'

import { useRef, useEffect, useState } from 'react'
import { useBuildStore } from '@/store/buildStore'
import { PRODUCTS } from '@/data/products'
import ProductCard from './ProductCard'
import type { Product } from '@/types/product'

type SortMode = 'default' | 'price-asc' | 'price-desc' | 'easiest'

const diffOrder: Record<Product['diff'], number> = { easy: 0, med: 1, hard: 2 }

interface Props {
  activeCategory: string
}

export default function ProductList({ activeCategory }: Props) {
  const vehicle  = useBuildStore(s => s.vehicle)
  const mission  = useBuildStore(s => s.mission)
  const items    = useBuildStore(s => s.items)
  const budget   = useBuildStore(s => s.budget)
  const toggleItem = useBuildStore(s => s.toggleItem)
  const gearTotal  = useBuildStore(s => s.gearTotal)
  const laborTotal = useBuildStore(s => s.laborTotal)

  const [sortMode, setSortMode] = useState<SortMode>('default')
  const sortRef = useRef<HTMLSelectElement>(null)

  // Listen for sort changes via data-sort attribute
  useEffect(() => {
    const el = sortRef.current
    if (!el) return
    function handleChange() {
      const val = el!.getAttribute('data-sort') || el!.value
      setSortMode((val as SortMode) || 'default')
    }
    el.addEventListener('change', handleChange)
    return () => el.removeEventListener('change', handleChange)
  }, [])

  // Filter products by category + vehicle + mission
  const filtered = PRODUCTS.filter(p => {
    if (p.category !== activeCategory) return false
    if (vehicle && !p.compat.includes(vehicle.id)) return false
    if (mission && !p.mission.includes(mission)) return false
    return true
  })

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortMode === 'price-asc')  return a.price - b.price
    if (sortMode === 'price-desc') return b.price - a.price
    if (sortMode === 'easiest')    return diffOrder[a.diff] - diffOrder[b.diff]
    return 0 // default: original order
  })

  const currentBuildTotal = gearTotal() + laborTotal()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Sort toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', borderBottom: '1px solid #1e1e1e',
        background: '#0a0a0a', flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: '#555', letterSpacing: '0.06em', fontFamily: 'monospace' }}>
          {sorted.length} ITEM{sorted.length !== 1 ? 'S' : ''}
        </span>
        <select
          ref={sortRef}
          data-sort={sortMode}
          value={sortMode}
          onChange={e => {
            e.currentTarget.setAttribute('data-sort', e.currentTarget.value)
            setSortMode(e.currentTarget.value as SortMode)
          }}
          style={{
            background: '#141414', color: '#aaa', border: '1px solid #2a2a2a',
            borderRadius: 4, padding: '4px 8px', fontSize: 11, cursor: 'pointer',
            fontFamily: 'monospace', letterSpacing: '0.04em',
          }}
        >
          <option value="default">Default</option>
          <option value="price-asc">Price Low→High</option>
          <option value="price-desc">Price High→Low</option>
          <option value="easiest">Easiest Install</option>
        </select>
      </div>

      {/* Product grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {sorted.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: 200, color: '#333', fontSize: 13, fontFamily: 'monospace', letterSpacing: '0.06em',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <div>NO COMPATIBLE PRODUCTS</div>
            <div style={{ fontSize: 11, marginTop: 6, color: '#222' }}>
              Try adjusting your vehicle or mission
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
          }}>
            {sorted.map(product => {
              const isAdded = !!items[product.id]
              const wouldExceed = !isAdded && (currentBuildTotal + product.price + product.labor) > budget
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAdded={isAdded}
                  isOverBudget={wouldExceed}
                  onToggle={toggleItem}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
