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
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      {/* Left: Category Sidebar — independently scrollable */}
      <CategorySidebar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Center: Vehicle Preview (fixed top) + Product List (scrollable) */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,          // ← KEY: allows flex child to shrink & scroll
        minWidth: 0,
        overflow: 'hidden',
      }}>
        {/* Vehicle preview — fixed height, doesn't scroll */}
        <div style={{ flexShrink: 0 }}>
          <VehiclePreview />
        </div>

        {/* Product list — takes remaining height and scrolls */}
        <div style={{
          flex: 1,
          minHeight: 0,        // ← KEY: flex child needs this to scroll
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderTop: '1px solid #1e1e1e',
        }}>
          <ProductList activeCategory={activeCategory} />
        </div>
      </div>

      {/* Right: Build Summary — independently scrollable */}
      <BuildSummary />
    </div>
  )
}
