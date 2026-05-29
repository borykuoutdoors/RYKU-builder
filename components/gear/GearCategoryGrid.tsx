'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { gearCategories } from '@/lib/catalog'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

const cardVariants = {
  hidden:   { opacity: 0, y: 24 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
}

export default function GearCategoryGrid() {
  return (
    <motion.div
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {gearCategories.map((cat) => (
        <motion.div key={cat.id} variants={cardVariants}>
          <Link
            href={`/gear?cat=${encodeURIComponent(cat.label)}`}
            style={{ textDecoration: 'none' }}
            data-category={cat.id}
          >
            <div
              style={{
                background: 'var(--carbon)',
                border: '1px solid rgba(255,85,31,0.14)',
                borderRadius: '4px',
                padding: '24px 20px',
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
              <div style={{ fontSize: '48px', lineHeight: 1 }}>{cat.icon}</div>

              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '1rem',
                color: 'var(--text)', letterSpacing: '0.06em',
              }}>
                {cat.label.toUpperCase()}
              </div>

              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                color: 'var(--orange)', letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                {cat.sku}
              </div>

              <div style={{
                fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                color: 'var(--text-3)', lineHeight: 1.5,
              }}>
                {cat.hint}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
