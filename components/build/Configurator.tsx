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
    <>
      {/* Desktop: three independent scrolling columns inside the fixed-height container.
          Mobile: stacked single-column layout; outer page scrolls naturally. */}
      <style>{`
        .cfg-layout {
          display: flex;
          height: 100%;
          min-height: 0;
          overflow: hidden;
        }
        .cfg-center {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          min-width: 0;
          overflow: hidden;
        }
        .cfg-product-wrapper {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-top: 1px solid #1e1e1e;
        }
        @media (max-width: 767px) {
          .cfg-layout {
            flex-direction: column;
            height: auto !important;
            overflow: visible !important;
          }
          .cfg-center {
            overflow: visible !important;
            height: auto !important;
            min-height: 0;
          }
          .cfg-product-wrapper {
            overflow: visible !important;
            height: auto !important;
            flex: none;
            min-height: 300px;
          }
        }
      `}</style>

      <div className="cfg-layout">
        {/* Left: Category Sidebar — independently scrollable */}
        <CategorySidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Center: Vehicle Preview (fixed top) + Product List (scrollable) */}
        <div className="cfg-center">
          {/* Vehicle preview — fixed height, doesn't scroll */}
          <div style={{ flexShrink: 0 }}>
            <VehiclePreview />
          </div>

          {/* Product list — takes remaining height and scrolls */}
          <div className="cfg-product-wrapper">
            <ProductList activeCategory={activeCategory} />
          </div>
        </div>

        {/* Right: Build Summary — independently scrollable */}
        <BuildSummary />
      </div>
    </>
  )
}
