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
  easy: 'EASY INSTALL',
  med:  'MODERATE',
  hard: 'PRO INSTALL',
}

// Category-based gradient fallbacks when no image is available
const categoryGradient: Record<string, string> = {
  'Suspension':        'linear-gradient(135deg, #1a1200 0%, #0f0f0f 100%)',
  'Roof Racks':        'linear-gradient(135deg, #0d1a2a 0%, #0f0f0f 100%)',
  'Rooftop Tents':     'linear-gradient(135deg, #0d1a0d 0%, #0f0f0f 100%)',
  'Lighting':          'linear-gradient(135deg, #1a1400 0%, #0f0f0f 100%)',
  'Wheels & Tires':    'linear-gradient(135deg, #1a0a00 0%, #0f0f0f 100%)',
  'Recovery':          'linear-gradient(135deg, #1a0000 0%, #0f0f0f 100%)',
  'Storage & Cargo':   'linear-gradient(135deg, #1a1200 0%, #0f0f0f 100%)',
  'Power & Comms':     'linear-gradient(135deg, #001a1a 0%, #0f0f0f 100%)',
  'Camping Gear':      'linear-gradient(135deg, #0a1a0a 0%, #0f0f0f 100%)',
  'Armor & Protection':'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
}

export default function ProductCard({ product, isAdded, isOverBudget, onToggle }: Props) {
  const { id, emoji, brand, name, category, note, diff, labor, price, pop, img } = product

  const fallbackGradient = categoryGradient[category] ?? 'linear-gradient(135deg, #141414 0%, #0f0f0f 100%)'

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
        border: `1px solid ${isAdded ? 'rgba(249,115,22,0.6)' : '#2a2a2a'}`,
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* ── Product image area ────────────────────────────── */}
      <div style={{
        position: 'relative',
        height: 160,
        background: fallbackGradient,
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Product image */}
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={`${brand} ${name}`}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.65,
              transition: 'opacity 0.3s',
            }}
          />
        )}

        {/* Dark overlay for brand cohesion */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: img
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)'
            : undefined,
        }} />

        {/* Fallback emoji when no image */}
        {!img && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: 48, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}>
              {emoji}
            </span>
          </div>
        )}

        {/* Category label — bottom left */}
        <div style={{
          position: 'absolute',
          bottom: 8,
          left: 10,
          fontFamily: 'monospace',
          fontSize: 9,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
          background: 'rgba(0,0,0,0.5)',
          padding: '2px 6px',
          borderRadius: 3,
        }}>
          {category}
        </div>

        {/* POPULAR badge — top right */}
        {pop && (
          <div style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: '#f97316',
            color: '#000',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '3px 7px',
            borderRadius: 3,
          }}>
            ★ POPULAR
          </div>
        )}

        {/* ADDED indicator — top left */}
        {isAdded && (
          <div style={{
            position: 'absolute',
            top: 8,
            left: 8,
            background: 'rgba(249,115,22,0.9)',
            color: '#000',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.06em',
            padding: '3px 7px',
            borderRadius: 3,
          }}>
            ✓ ADDED
          </div>
        )}
      </div>

      {/* ── Product info ─────────────────────────────────── */}
      <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Brand */}
        <div style={{
          fontFamily: 'monospace',
          fontSize: 9,
          color: '#f97316',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {brand}
        </div>

        {/* Product name */}
        <div style={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 16,
          color: '#fff',
          lineHeight: 1.1,
          letterSpacing: '0.04em',
        }}>
          {name}
        </div>

        {/* Note */}
        {note && (
          <div style={{
            fontSize: 10,
            color: '#555',
            lineHeight: 1.35,
            marginTop: 2,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
          }}>
            {note}
          </div>
        )}

        {/* Badges */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 6 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
            padding: '2px 6px', borderRadius: 3,
            background: diffColor[diff] + '22',
            color: diffColor[diff],
            border: `1px solid ${diffColor[diff]}44`,
          }}>
            {diffLabel[diff]}
          </span>

          {labor > 0 && (
            <span style={{
              fontSize: 9, fontWeight: 600, letterSpacing: '0.04em',
              padding: '2px 6px', borderRadius: 3,
              background: '#1a1a1a', color: '#888',
              border: '1px solid #2a2a2a',
            }}>
              ${labor.toLocaleString()} labor
            </span>
          )}

          {isOverBudget && !isAdded && (
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
              padding: '2px 6px', borderRadius: 3,
              background: '#ef444422', color: '#ef4444',
              border: '1px solid #ef444444',
            }}>
              OVER BUDGET
            </span>
          )}
        </div>
      </div>

      {/* ── Footer: price + action ─────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        borderTop: '1px solid #1e1e1e',
        flexShrink: 0,
      }}>
        <div>
          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 18,
            color: '#fff',
            fontWeight: 700,
            lineHeight: 1,
          }}>
            ${price.toLocaleString()}
          </div>
          {labor > 0 && (
            <div style={{
              fontFamily: 'monospace',
              fontSize: 9,
              color: '#555',
              marginTop: 2,
            }}>
              +${labor.toLocaleString()} install
            </div>
          )}
        </div>

        <button
          data-pid={id}
          onClick={() => onToggle(product)}
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '7px 14px',
            borderRadius: 4,
            cursor: 'pointer',
            border: isAdded ? '1px solid #ef444466' : 'none',
            background: isAdded ? 'rgba(239,68,68,0.1)' : '#f97316',
            color: isAdded ? '#ef4444' : '#000',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          {isAdded ? '✕ REMOVE' : '+ ADD'}
        </button>
      </div>
    </motion.div>
  )
}
