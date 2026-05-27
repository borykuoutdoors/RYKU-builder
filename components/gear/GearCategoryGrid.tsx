'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CATEGORIES, PRODUCTS } from '@/data/products'

const DESCRIPTIONS: Record<string, string> = {
  'Suspension':         'Lift kits, shocks & control arms for any terrain.',
  'Roof Racks':         'Low-profile platforms built for max payload.',
  'Rooftop Tents':      'Hardshell & softshell RTTs from the top brands.',
  'Lighting':           'LED bars, pods & rock lights for zero dead zones.',
  'Wheels & Tires':     'All-terrain and mud-terrain setups that hold.',
  'Recovery':           'Winches, boards & kits when the trail bites back.',
  'Storage & Cargo':    'Drawer systems, cases & cargo organizers.',
  'Power & Comms':      'Power stations, solar, radios & GPS comms.',
  'Camping Gear':       'Fridges, awnings, kitchens & camp essentials.',
  'Armor & Protection': 'Skids, sliders & bumpers for the hard hits.',
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
}

// Show only the 6 primary categories in the grid
const GRID_CATEGORIES = CATEGORIES.filter((c) =>
  ['Suspension', 'Roof Racks', 'Rooftop Tents', 'Lighting', 'Recovery', 'Wheels & Tires'].includes(c.id)
)

export default function GearCategoryGrid() {
  return (
    <motion.div
      className="grid grid-cols-2 gap-4 md:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {GRID_CATEGORIES.map((cat) => {
        const count = PRODUCTS.filter((p) => p.category === cat.id).length
        const desc = DESCRIPTIONS[cat.id] ?? ''

        return (
          <motion.div key={cat.id} variants={cardVariants}>
            <Link
              href={`/gear?cat=${encodeURIComponent(cat.id)}`}
              style={{ textDecoration: 'none' }}
              data-category={cat.id}
            >
              <div
                className="gear-category-card group"
                style={{
                  background: 'var(--carbon)',
                  border: '1px solid rgba(255,85,31,0.14)',
                  borderRadius: '6px',
                  padding: '28px 24px',
                  cursor: 'pointer',
                  transition: 'border-color 0.22s, transform 0.22s, box-shadow 0.22s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'var(--orange)'
                  el.style.transform = 'translateY(-4px)'
                  el.style.boxShadow = '0 8px 32px rgba(255,85,31,0.12)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'rgba(255,85,31,0.14)'
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Emoji */}
                <div style={{ fontSize: '64px', lineHeight: 1 }}>{cat.emoji}</div>

                {/* Name */}
                <div
                  className="font-bebas"
                  style={{ fontSize: '22px', color: '#fff', letterSpacing: '0.06em' }}
                >
                  {cat.label}
                </div>

                {/* Count */}
                <div
                  className="font-mono"
                  style={{ fontSize: '11px', color: 'var(--orange)', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                  {count} products available
                </div>

                {/* Description */}
                <div
                  className="font-rajdhani"
                  style={{ fontSize: '14px', color: 'rgba(255,255,255,0.52)', lineHeight: 1.5 }}
                >
                  {desc}
                </div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
