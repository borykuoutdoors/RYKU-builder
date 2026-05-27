'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import SectionEyebrow from '@/components/ui/SectionEyebrow'
import { PRODUCTS, CATEGORIES } from '@/data/products'
import { VEHICLES } from '@/data/vehicles'
import { MISSIONS } from '@/data/missions'
import { formatCurrency } from '@/lib/buildUtils'

// Mock community builds
const FEATURED_BUILDS = [
  {
    id: 'b1',
    name: 'DESERT RUNNER',
    vehicle: '2023 Toyota Tacoma TRD Pro',
    mission: 'overland',
    owner: '@dust_witch',
    location: 'Moab, UT',
    parts: ['ICON Stage 2 System', 'Front Runner Slimline II', 'iKamper Skycamp 3.0', 'Rigid Industries E-Series 20"', 'WARN Zeon 10-S'],
    total: 14820,
    rating: 4.9,
    saves: 312,
    views: 8400,
    tags: ['overland', 'tacoma', 'desert'],
    emoji: '🏜️',
  },
  {
    id: 'b2',
    name: 'IRON FORTRESS',
    vehicle: '2022 Jeep Wrangler Rubicon',
    mission: 'offroad',
    owner: '@rock_doc',
    location: 'Sedona, AZ',
    parts: ['Rancho RS9000XL', 'Smittybilt Scout Rack', 'Baja Designs Squadron Pro', 'BF Goodrich KO2', 'Smittybilt X2O Winch'],
    total: 9660,
    rating: 4.8,
    saves: 284,
    views: 7100,
    tags: ['offroad', 'wrangler', 'rock'],
    emoji: '🪨',
  },
  {
    id: 'b3',
    name: 'ARCTIC EXPEDITION',
    vehicle: '2021 Toyota 4Runner TRD Pro',
    mission: 'expedition',
    owner: '@snowpack_labs',
    location: 'Anchorage, AK',
    parts: ['Old Man Emu BP-51', 'Sherpa Crestone', 'James Baroud Space', 'Falken Wildpeak AT3W', 'Goal Zero Yeti 3000X'],
    total: 12680,
    rating: 5.0,
    saves: 441,
    views: 11200,
    tags: ['expedition', '4runner', 'cold'],
    emoji: '🏔️',
  },
  {
    id: 'b4',
    name: 'OPERATOR PACKAGE',
    vehicle: '2024 Ford F-150 Raptor',
    mission: 'tactical',
    owner: '@grid_six',
    location: 'Colorado Springs, CO',
    parts: ['Fox 2.5 Performance Elite', 'Rhino-Rack Pioneer', 'Rigid Industries Radiance SR20', 'Nitto Ridge Grappler', 'DECKED Drawer System'],
    total: 8860,
    rating: 4.7,
    saves: 198,
    views: 5800,
    tags: ['tactical', 'f150', 'utility'],
    emoji: '🎯',
  },
  {
    id: 'b5',
    name: 'CAMP COMMAND',
    vehicle: '2023 Jeep Gladiator Rubicon',
    mission: 'camping',
    owner: '@base_camp_co',
    location: 'Flagstaff, AZ',
    parts: ['Yakima OutPost HD', 'Tepui Kukenam Sky', 'ARB Elements Fridge', 'OVS 270° Awning', 'Garmin inReach Mini 2'],
    total: 6080,
    rating: 4.8,
    saves: 267,
    views: 7900,
    tags: ['camping', 'gladiator', 'comfort'],
    emoji: '⛺',
  },
  {
    id: 'b6',
    name: 'TRAIL SUPPORT',
    vehicle: '2022 Toyota Tundra TRD Pro',
    mission: 'recovery',
    owner: '@pull_out_pete',
    location: 'Salt Lake City, UT',
    parts: ['Bilstein 5100 Series', 'Front Runner Pioneer', 'WARN Zeon 10-S', 'MAXTRAX MKII', 'ARB Deluxe Recovery Kit'],
    total: 6060,
    rating: 4.6,
    saves: 189,
    views: 4600,
    tags: ['recovery', 'tundra', 'winch'],
    emoji: '🪝',
  },
]

const SORT_OPTIONS = ['Most Popular', 'Highest Rated', 'Most Saved', 'Budget: Low to High', 'Budget: High to Low']
const FILTER_MISSIONS = ['All', ...MISSIONS.map(m => m.name)]

export default function BuildsPage() {
  const [activeMission, setActiveMission] = useState('All')
  const [activeSort, setActiveSort] = useState('Most Popular')

  const filtered = FEATURED_BUILDS.filter(b =>
    activeMission === 'All' || b.tags.some(t => activeMission.toLowerCase().includes(t))
  )

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>

      {/* HEADER */}
      <section style={{ padding: '80px 24px 48px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,85,31,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,85,31,.022) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <SectionEyebrow>COMMUNITY BUILDS</SectionEyebrow>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginTop: 12 }}>
            <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(2.5rem,5vw,4rem)', letterSpacing: '0.04em', lineHeight: 0.9 }}>
              FEATURED<br /><span style={{ color: 'var(--orange)' }}>BUILDS</span>
            </h1>
            <Link href="/build" className="btn btn-primary">+ Start Your Build</Link>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '16px 24px', position: 'sticky', top: 'var(--nav-h)', background: 'rgba(10,10,10,0.94)', backdropFilter: 'blur(16px)', zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em', color: 'var(--text-3)', textTransform: 'uppercase' }}>Mission:</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FILTER_MISSIONS.slice(0, 5).map(m => (
              <button
                key={m}
                data-mission={m}
                onClick={() => setActiveMission(m)}
                className="btn btn-sm"
                style={{
                  background: activeMission === m ? 'var(--orange)' : 'var(--carbon)',
                  color: activeMission === m ? '#000' : 'var(--text-2)',
                  border: `1px solid ${activeMission === m ? 'var(--orange)' : 'var(--border)'}`,
                  clipPath: 'none',
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em', color: 'var(--text-3)', textTransform: 'uppercase' }}>Sort:</span>
            <select
              data-filter="sort"
              value={activeSort}
              onChange={e => setActiveSort(e.target.value)}
              className="form-input form-select"
              style={{ width: 'auto', fontSize: '0.75rem', padding: '6px 32px 6px 12px' }}
            >
              {SORT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* BUILD GRID */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {filtered.map((build, i) => (
            <motion.div
              key={build.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="card card-interactive"
              style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
            >
              {/* Card header */}
              <div style={{ background: 'linear-gradient(135deg, var(--carbon) 0%, #111 100%)', padding: '28px 24px 20px', borderBottom: '1px solid var(--border)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 32 }}>{build.emoji}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: 6 }}>
                  {build.tags[1]?.toUpperCase()} · {build.mission.toUpperCase()}
                </div>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.75rem', letterSpacing: '0.06em', marginBottom: 4 }}>{build.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-2)' }}>{build.vehicle}</div>
              </div>

              {/* Parts list */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>KEY MODS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {build.parts.slice(0, 4).map(p => (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-2)' }}>
                      <span style={{ color: 'var(--orange)', opacity: 0.6 }}>›</span> {p}
                    </div>
                  ))}
                  {build.parts.length > 4 && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-3)' }}>+{build.parts.length - 4} more</div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--orange)' }}>{formatCurrency(build.total)}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)' }}>
                    ★ {build.rating} · {build.saves} saves
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-3)' }}>{build.owner}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)' }}>{build.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-3)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem', letterSpacing: '0.06em', marginBottom: 8 }}>NO BUILDS FOUND</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>Try a different mission filter.</div>
          </div>
        )}
      </section>
    </div>
  )
}
