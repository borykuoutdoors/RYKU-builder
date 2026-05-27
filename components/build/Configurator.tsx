'use client'

import { useState } from 'react'
import CategorySidebar from './CategorySidebar'
import ProductList from './ProductList'
import BuildSummary from './BuildSummary'
import VehiclePreview from './VehiclePreview'
import { CATEGORIES } from '@/data/products'

export default function Configurator() {
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0].id)

  return (
    <div
      className="planner-layout"
      style={{
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Left: Category Sidebar */}
      <CategorySidebar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Center: Vehicle Preview (top) + Product List (bottom, scrollable) */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
      }}>
        {/* Top half: Vehicle preview */}
        <div style={{ flexShrink: 0 }}>
          <VehiclePreview />
        </div>

        {/* Bottom half: scrollable product list */}
        <div style={{ flex: 1, overflow: 'hidden', borderTop: '1px solid #1e1e1e' }}>
          <ProductList activeCategory={activeCategory} />
        </div>
      </div>

      {/* Right: Build Summary (sticky) */}
      <BuildSummary />
    </div>
  )
}
