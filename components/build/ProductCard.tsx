'use client'

import { motion } from 'framer-motion'
import type { Product } from '@/types/product'

interface Props {
  product: Product
  isAdded: boolean
  isOverBudget: boolean
  onToggle: (product: Product) => void
}

const diffColor: Record<Product['diff'], string> = {
  easy: '#22c55e',
  med:  '#f97316',
  hard: '#ef4444',
}

const diffLabel: Record<Product['diff'], string> = {
  easy: 'EASY',
  med:  'MED',
  hard: 'HARD',
}

export default function ProductCard({ product, isAdded, isOverBudget, onToggle }: Props) {
  const { id, emoji, brand, name, note, diff, labor, price, pop } = product

  return (
    <motion.div
      className={`product-card${isAdded ? ' added' : ''}`}
      data-pid={id}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: isAdded ? '#1a1a0e' : '#0f0f0f',
        border: `1px solid ${isAdded ? '#f97316' : '#2a2a2a'}`,
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* ── Top: emoji icon ─────────────────────────────── */}
      <div style={{ position: 'relative', background: '#141414', padding: '20px 0', textAlign: 'center' }}>
        <span style={{ fontSize: 40 }}>{emoji}</span>
        {pop && (
          <span style={{
            position: 'absolute', top: 8, right: 8,
            background: '#f97316', color: '#000',
            fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
            padding: '2px 6px', borderRadius: 3,
          }}>
            POPULAR
          </span>
        )}
      </div>

      {/* ── Body ────────────────────────────────────────── */}
      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          fontFamily: 'monospace', fontSize: 10, color: '#f97316',
          textTransform: 'uppercase', letterSpacing: '0.1em', fontVariant: 'small-caps',
        }}>
          {brand}
        </div>

        <div style={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 18, color: '#fff', lineHeight: 1.1, letterSpacing: '0.04em',
        }}>
          {name}
        </div>

        {note && (
          <div style={{ fontSize: 10, color: '#666', lineHeight: 1.4, marginTop: 2 }}>
            {note}
          </div>
        )}

        {/* Badges row */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
          {/* Difficulty badge */}
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
            padding: '2px 7px', borderRadius: 3,
            background: diffColor[diff] + '22',
            color: diffColor[diff],
            border: `1px solid ${diffColor[diff]}44`,
          }}>
            {diffLabel[diff]}
          </span>

          {/* Labor badge */}
          {labor > 0 && (
            <span style={{
              fontSize: 9, fontWeight: 600, letterSpacing: '0.04em',
              padding: '2px 7px', borderRadius: 3,
              background: '#1f1f1f', color: '#aaa',
              border: '1px solid #333',
            }}>
              ${labor.toLocaleString()} install est.
            </span>
          )}

          {/* Over budget warning badge */}
          {isOverBudget && !isAdded && (
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
              padding: '2px 7px', borderRadius: 3,
              background: '#ef444422', color: '#ef4444',
              border: '1px solid #ef444444',
            }}>
              OVER BUDGET
            </span>
          )}
        </div>
      </div>

      {/* ── Footer: price + action ───────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderTop: '1px solid #1e1e1e',
      }}>
        <span style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 20, color: '#fff', fontWeight: 700,
        }}>
          ${price.toLocaleString()}
        </span>

        <button
          data-pid={id}
          onClick={() => onToggle(product)}
          style={{
            fontFamily: 'monospace',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            padding: '6px 12px', borderRadius: 4, cursor: 'pointer',
            border: 'none',
            background: isAdded ? '#2a0a0a' : '#f97316',
            color:      isAdded ? '#ef4444' : '#000',
            transition: 'opacity 0.15s',
          }}
        >
          {isAdded ? '✕ REMOVE' : '+ ADD'}
        </button>
      </div>
    </motion.div>
  )
}
