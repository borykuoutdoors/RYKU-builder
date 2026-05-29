'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import SectionEyebrow from '@/components/ui/SectionEyebrow'
import { buildsGallery, buildFilterChips } from '@/lib/catalog'
import BtnColorful from '@/components/ui/BtnColorful'
import AnimatedSearchBar from '@/components/ui/AnimatedSearchBar'

export default function BuildsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = useMemo(() => {
    let list = activeFilter === 'all'
      ? buildsGallery
      : buildsGallery.filter(b => b.filter === activeFilter)

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      list = list.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.owner.toLowerCase().includes(q) ||
        b.tag.toLowerCase().includes(q) ||
        b.region.toLowerCase().includes(q)
      )
    }

    return list
  }, [activeFilter, searchTerm])

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>

      {/* HEADER */}
      <section style={{
        padding: '80px 24px 48px',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,85,31,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,85,31,.022) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <SectionEyebrow>COMMUNITY BUILDS</SectionEyebrow>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginTop: 12 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4rem)',
              letterSpacing: '0.04em', lineHeight: 0.9,
            }}>
              FEATURED<br /><span style={{ color: 'var(--orange)' }}>BUILDS</span>
            </h1>
            <Link href="/build"><BtnColorful arrow>START YOUR BUILD</BtnColorful></Link>
          </div>

          <div style={{ maxWidth: 520, marginTop: 32 }}>
            <AnimatedSearchBar
              placeholder="Search builds, vehicles, or builders…"
              value={searchTerm}
              onChange={setSearchTerm}
              aria-label="Search community builds"
              data-search-scope="builds"
            />
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '16px 24px',
        position: 'sticky',
        top: 'var(--nav-h)',
        background: 'rgba(10,10,10,0.94)',
        backdropFilter: 'blur(16px)',
        zIndex: 50,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            letterSpacing: '0.18em', color: 'var(--text-3)', textTransform: 'uppercase',
            marginRight: 4,
          }}>
            FILTER:
          </span>
          {buildFilterChips.map(chip => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                padding: '5px 12px', borderRadius: '2px', cursor: 'pointer',
                border: `1px solid ${activeFilter === chip.id ? 'var(--orange)' : 'var(--border)'}`,
                background: activeFilter === chip.id ? 'var(--orange)' : 'var(--carbon)',
                color: activeFilter === chip.id ? '#000' : 'var(--text-2)',
                transition: 'all 0.15s',
              }}
            >
              {chip.label}
            </button>
          ))}
          <span style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
            letterSpacing: '0.12em', color: 'var(--text-3)',
          }}>
            {filtered.length} BUILD{filtered.length !== 1 ? 'S' : ''}
          </span>
        </div>
      </div>

      {/* BUILD GRID */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20,
        }}>
          {filtered.map((build, i) => (
            <motion.div
              key={build.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: 'var(--carbon)',
                border: '1px solid rgba(255,85,31,0.12)',
                borderRadius: '4px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
              }}
              whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(255,85,31,0.12)' }}
            >
              {/* Card header */}
              <div style={{
                background: 'linear-gradient(135deg, #111 0%, rgba(255,85,31,0.06) 100%)',
                padding: '24px 20px 18px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
              }}>
                {/* Index badge */}
                <span style={{
                  position: 'absolute', top: 16, right: 16,
                  fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                  letterSpacing: '0.15em', color: 'var(--text-3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '2px 6px', borderRadius: '2px',
                }}>
                  #{build.index}
                </span>

                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                  letterSpacing: '0.2em', color: 'var(--orange)',
                  textTransform: 'uppercase', marginBottom: 8,
                }}>
                  {build.tag} · {build.region}
                </div>

                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.35rem',
                  letterSpacing: '0.06em', color: 'var(--text)',
                  lineHeight: 1.15, marginBottom: 6,
                }}>
                  {build.title}
                </div>

                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.575rem',
                  letterSpacing: '0.14em', color: 'var(--text-3)',
                  textTransform: 'uppercase',
                }}>
                  {build.owner}
                </div>
              </div>

              {/* Specs list */}
              <div style={{ padding: '16px 20px' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                  letterSpacing: '0.16em', color: 'var(--text-3)',
                  textTransform: 'uppercase', marginBottom: 10,
                }}>
                  BUILD HIGHLIGHTS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {build.specs.map(spec => (
                    <div key={spec} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                      color: 'var(--text-2)',
                    }}>
                      <span style={{ color: 'var(--orange)', opacity: 0.7, fontSize: '0.6rem' }}>▸</span>
                      {spec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: '12px 20px',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                  letterSpacing: '0.1em', color: 'var(--text-3)', textTransform: 'uppercase',
                  border: '1px solid rgba(255,85,31,0.2)',
                  padding: '2px 7px', borderRadius: '2px',
                }}>
                  {build.filter.toUpperCase()}
                </span>
                <button style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'var(--orange)', background: 'transparent', border: 'none',
                  cursor: 'pointer', opacity: 0.8,
                }}>
                  VIEW BUILD →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-3)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.06em', marginBottom: 8 }}>
              NO BUILDS FOUND
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              Try a different filter.
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
