'use client'

import { useEffect, useRef } from 'react'
import { useBuildStore } from '@/store/buildStore'
import { CATEGORIES, PRODUCTS } from '@/data/products'

interface Props {
  activeCategory: string
  onCategoryChange: (cat: string) => void
}

export default function CategorySidebar({ activeCategory, onCategoryChange }: Props) {
  const vehicle = useBuildStore(s => s.vehicle)
  const mission = useBuildStore(s => s.mission)
  const containerRef = useRef<HTMLDivElement>(null)

  // Count compatible products per category
  const compatCounts = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat.id] = PRODUCTS.filter(p => {
      const vehicleOk = vehicle ? p.compat.includes(vehicle.id) : true
      const missionOk = mission ? p.mission.includes(mission) : true
      return p.category === cat.id && vehicleOk && missionOk
    }).length
    return acc
  }, {})

  // data-* driven click handling via useEffect
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function handleClick(e: MouseEvent) {
      const btn = (e.target as HTMLElement).closest('[data-cat]') as HTMLElement | null
      if (!btn) return
      const cat = btn.getAttribute('data-cat')
      if (cat) onCategoryChange(cat)
    }

    container.addEventListener('click', handleClick)
    return () => container.removeEventListener('click', handleClick)
  }, [onCategoryChange])

  return (
    <div
      ref={containerRef}
      style={{
        width: 200,
        minWidth: 200,
        background: '#0a0a0a',
        borderRight: '1px solid #1e1e1e',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: '8px 6px',
      }}
    >
      {CATEGORIES.map(cat => {
        const isActive = cat.id === activeCategory
        const count = compatCounts[cat.id] ?? 0

        return (
          <button
            key={cat.id}
            data-cat={cat.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 10px',
              background: isActive ? '#1a1200' : 'transparent',
              border: 'none',
              borderLeft: `3px solid ${isActive ? '#f97316' : 'transparent'}`,
              borderRadius: 4,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background 0.15s, border-color 0.15s',
            }}
          >
            <span style={{ fontSize: 16 }}>{cat.emoji}</span>
            <span style={{
              flex: 1,
              fontSize: 12,
              fontWeight: 600,
              color: isActive ? '#f97316' : '#aaa',
              letterSpacing: '0.04em',
              lineHeight: 1.2,
            }}>
              {cat.label}
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              color: isActive ? '#f97316' : '#444',
              background: isActive ? '#f9731622' : '#1a1a1a',
              padding: '1px 6px',
              borderRadius: 10,
              minWidth: 20,
              textAlign: 'center',
            }}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
