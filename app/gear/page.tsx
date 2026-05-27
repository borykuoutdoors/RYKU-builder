'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS, CATEGORIES } from '@/data/products'
import { VEHICLES } from '@/data/vehicles'
import type { Product } from '@/types/product'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

// ─── Difficulty helpers ───────────────────────────────────────────────────────

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

// ─── Inline GearProductCard ───────────────────────────────────────────────────

function GearProductCard({ product }: { product: Product }) {
  return (
    <div
      style={{
        background: 'var(--carbon)',
        border: '1px solid rgba(255,85,31,0.14)',
        borderRadius: '6px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        height: '100%',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--orange)'
        el.style.transform = 'translateY(-3px)'
        el.style.boxShadow = '0 8px 28px rgba(255,85,31,0.1)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'rgba(255,85,31,0.14)'
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Emoji + popular badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '40px', lineHeight: 1 }}>{product.emoji}</span>
        {product.pop && (
          <span
            className="font-mono"
            style={{
              fontSize: '10px',
              color: 'var(--cyan)',
              border: '1px solid var(--cyan)',
              borderRadius: '3px',
              padding: '2px 6px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            POPULAR
          </span>
        )}
      </div>

      {/* Brand */}
      <div
        className="font-mono"
        style={{
          fontSize: '11px',
          color: 'var(--orange)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        {product.brand}
      </div>

      {/* Name */}
      <div
        className="font-bebas"
        style={{ fontSize: '20px', color: '#fff', letterSpacing: '0.05em', lineHeight: 1.1 }}
      >
        {product.name}
      </div>

      {/* Price */}
      <div
        className="font-bebas"
        style={{ fontSize: '26px', color: '#fff', letterSpacing: '0.03em' }}
      >
        ${product.price.toLocaleString()}
        <span
          className="font-mono"
          style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', marginLeft: '8px' }}
        >
          + ${product.labor.toLocaleString()} LABOR
        </span>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <span
          className="font-mono"
          style={{
            fontSize: '10px',
            padding: '2px 7px',
            borderRadius: '3px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            border: `1px solid ${DIFF_COLOR[product.diff]}`,
            color: DIFF_COLOR[product.diff],
          }}
        >
          {DIFF_LABEL[product.diff]}
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: '10px',
            padding: '2px 7px',
            borderRadius: '3px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            border: '1px solid rgba(102,255,255,0.3)',
            color: 'rgba(102,255,255,0.75)',
          }}
        >
          {product.category}
        </span>
      </div>

      {/* Short note / description */}
      <div
        className="font-rajdhani"
        style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.48)',
          lineHeight: 1.5,
          flexGrow: 1,
        }}
      >
        {product.note}
      </div>

      {/* CTA */}
      <Link
        href={`/gear/${product.id}`}
        className="btn btn-ghost"
        style={{ marginTop: '4px', textAlign: 'center', fontSize: '13px' }}
        data-product-id={product.id}
      >
        VIEW DETAILS
      </Link>
    </div>
  )
}

// ─── Sort options ─────────────────────────────────────────────────────────────

type SortKey = 'price-asc' | 'price-desc' | 'alpha'

function sortProducts(products: Product[], sort: SortKey): Product[] {
  return [...products].sort((a, b) => {
    if (sort === 'price-asc')  return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    return a.name.localeCompare(b.name)
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const cardVariants = {
  hidden:  { opacity: 0, y: 18, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.18 } },
}

export default function GearPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [sort, setSort] = useState<SortKey>('price-asc')

  const filtered = useMemo(() => {
    let list = PRODUCTS

    if (selectedVehicle !== 'all') {
      list = list.filter((p) => p.compat.includes(selectedVehicle))
    }
    if (selectedCategory !== 'ALL') {
      list = list.filter((p) => p.category === selectedCategory)
    }

    return sortProducts(list, sort)
  }, [selectedVehicle, selectedCategory, sort])

  const allCategories = ['ALL', ...CATEGORIES.map((c) => c.id)]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--dark)',
        backgroundImage: 'var(--bg-grid)',
        backgroundSize: 'var(--bg-grid-size)',
      }}
    >
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: '1px solid rgba(255,85,31,0.12)',
          padding: '48px 24px 40px',
          textAlign: 'center',
        }}
      >
        <SectionEyebrow>GEAR CATALOG</SectionEyebrow>
        <h1
          className="font-bebas"
          style={{ fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.05em', color: '#fff', margin: '8px 0' }}
        >
          PREMIUM OVERLAND GEAR
        </h1>
        <p
          className="font-rajdhani"
          style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', margin: 0 }}
        >
          {PRODUCTS.length} products across {CATEGORIES.length} categories — curated for the mission
        </p>
      </div>

      {/* ── Filter Bar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--carbon)',
          borderBottom: '1px solid rgba(255,85,31,0.12)',
          padding: '16px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          position: 'sticky',
          top: 'var(--nav-h)',
          zIndex: 20,
        }}
      >
        {/* Vehicle filter */}
        <select
          className="font-mono"
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
          data-filter="vehicle"
          style={{
            background: '#111',
            border: '1px solid rgba(255,85,31,0.3)',
            color: 'rgba(255,255,255,0.7)',
            padding: '7px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            letterSpacing: '0.08em',
            cursor: 'pointer',
          }}
        >
          <option value="all">ALL VEHICLES</option>
          {VEHICLES.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name.toUpperCase()}
            </option>
          ))}
        </select>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {allCategories.map((cat) => {
            const active = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                data-filter="category"
                data-value={cat}
                className="font-mono"
                style={{
                  background: active ? 'var(--orange)' : 'transparent',
                  border: `1px solid ${active ? 'var(--orange)' : 'rgba(255,85,31,0.25)'}`,
                  color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                  padding: '5px 10px',
                  borderRadius: '3px',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat === 'ALL' ? 'ALL' : CATEGORIES.find((c) => c.id === cat)?.emoji + ' ' + cat}
              </button>
            )
          })}
        </div>

        {/* Sort */}
        <select
          className="font-mono"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          data-filter="sort"
          style={{
            background: '#111',
            border: '1px solid rgba(255,85,31,0.3)',
            color: 'rgba(255,255,255,0.7)',
            padding: '7px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            marginLeft: 'auto',
          }}
        >
          <option value="price-asc">PRICE: LOW → HIGH</option>
          <option value="price-desc">PRICE: HIGH → LOW</option>
          <option value="alpha">ALPHABETICAL</option>
        </select>
      </div>

      {/* ── Product Grid ───────────────────────────────────────────────────── */}
      <div style={{ padding: '32px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        {filtered.length === 0 ? (
          /* Empty state */
          <div
            style={{
              textAlign: 'center',
              padding: '80px 24px',
              color: 'rgba(255,255,255,0.38)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <div
              className="font-bebas"
              style={{ fontSize: '28px', letterSpacing: '0.06em', marginBottom: '8px', color: 'rgba(255,255,255,0.6)' }}
            >
              NO COMPATIBLE PRODUCTS FOUND
            </div>
            <div className="font-rajdhani" style={{ fontSize: '15px' }}>
              Try a different vehicle or category.
            </div>
          </div>
        ) : (
          <>
            {/* Result count */}
            <div
              className="font-mono"
              style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.1em',
                marginBottom: '20px',
                textTransform: 'uppercase',
              }}
            >
              SHOWING {filtered.length} PRODUCTS
            </div>

            <AnimatePresence mode="popLayout">
              <motion.div
                key={`${selectedVehicle}-${selectedCategory}-${sort}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px',
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
                  >
                    <GearProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}
