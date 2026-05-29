'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { installers as ALL_INSTALLERS } from '@/lib/catalog'
import SectionEyebrow from '@/components/ui/SectionEyebrow'
import AnimatedSearchBar from '@/components/ui/AnimatedSearchBar'
import BtnColorful from '@/components/ui/BtnColorful'
import InstallerCard from '@/components/installers/InstallerCard'
import InstallerMapPanel from '@/components/installers/InstallerMapPanel'
import QuoteModal from '@/components/installers/QuoteModal'
import type { Installer } from '@/types/installer'

// ── Filter constants ──────────────────────────────────────────────────────────
const ALL_SERVICES = [
  'Suspension Install', 'Roof Rack Install', 'Lighting Install',
  'RTT Install', 'Recovery Gear', 'Armor / Bumper Install',
  'Electrical Systems', 'Fabrication', 'Full Build Shops',
] as const

const RATING_OPTIONS = [
  { label: 'Any', value: 0 },
  { label: '3.0+', value: 3 },
  { label: '4.0+', value: 4 },
  { label: '4.5+', value: 4.5 },
]

// ── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 4, padding: '6px 14px',
    }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <div>
        <div className="font-bebas" style={{ fontSize: 18, color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {label}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function InstallersPage() {
  // ── Filters
  const [query,            setQuery]            = useState('')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [minRating,        setMinRating]        = useState(0)
  const [maxDistance,      setMaxDistance]      = useState(100)
  const [filtersOpen,      setFiltersOpen]      = useState(false)

  // ── Map / layout
  const [selectedId,    setSelectedId]    = useState<string | null>(null)
  const [mapExpanded,   setMapExpanded]   = useState(false)
  const [mobileView,    setMobileView]    = useState<'list' | 'map'>('list')

  // ── Quote modal
  const [quoteInstaller, setQuoteInstaller] = useState<Installer | null>(null)

  // ── Scroll selected card into view
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!selectedId || !listRef.current) return
    const el = listRef.current.querySelector(`[data-installer-id="${selectedId}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedId])

  // ── Filtered results
  const filtered = useMemo(() => {
    return ALL_INSTALLERS.filter(inst => {
      if (query.trim()) {
        const q = query.toLowerCase()
        if (!inst.name.toLowerCase().includes(q) &&
            !inst.city.toLowerCase().includes(q) &&
            !inst.state.toLowerCase().includes(q)) return false
      }
      if (minRating > 0 && inst.rating < minRating) return false
      if (inst.distance !== undefined && inst.distance > maxDistance) return false
      if (selectedServices.length > 0) {
        const match = selectedServices.some(s => inst.services.includes(s))
        if (!match) return false
      }
      return true
    })
  }, [query, minRating, maxDistance, selectedServices])

  // Reset selectedId if it leaves filtered results
  useEffect(() => {
    if (selectedId && !filtered.find(i => i.id === selectedId)) {
      setSelectedId(null)
    }
  }, [filtered, selectedId])

  function toggleService(s: string) {
    setSelectedServices(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
  }

  function handleSelectInstaller(id: string) {
    setSelectedId(prev => prev === id ? null : id)
    // On mobile, switch to map view when selecting from list
    if (mobileView === 'list') setMobileView('map')
  }

  function handleMapSelect(id: string) {
    setSelectedId(prev => prev === id ? null : id)
  }

  const activeFilterCount =
    selectedServices.length + (minRating > 0 ? 1 : 0) + (maxDistance < 100 ? 1 : 0)

  const selectedInstaller = filtered.find(i => i.id === selectedId) ?? null

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div style={{
        padding: '44px 24px 36px',
        textAlign: 'center',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,85,31,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,85,31,0.012) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,85,31,0.065) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <SectionEyebrow>INSTALLER NETWORK</SectionEyebrow>
          <h1 className="font-bebas" style={{ fontSize: 'clamp(38px,5.5vw,68px)', letterSpacing: '0.05em', color: '#fff', margin: '8px 0 6px' }}>
            FIND CERTIFIED SHOPS
          </h1>
          <p className="font-rajdhani" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, margin: '0 0 24px' }}>
            Vetted overland and off-road specialists across the RYKU network
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <StatPill icon="🔧" value="2,400+" label="Certified Shops" />
            <StatPill icon="⭐" value="4.8"    label="Avg Rating" />
            <StatPill icon="📍" value="48"     label="States Covered" />
            <StatPill icon="⚡" value="24hr"   label="Avg Response" />
          </div>
        </div>
      </div>

      {/* ── Mobile view toggle ───────────────────────────────────────────────── */}
      <div style={{
        display: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        flexShrink: 0,
      }} className="installers-mobile-tabs">
        {(['list', 'map'] as const).map(view => (
          <button
            key={view}
            onClick={() => setMobileView(view)}
            style={{
              flex: 1, padding: '12px',
              background: mobileView === view ? 'rgba(255,85,31,0.1)' : 'transparent',
              border: 'none', borderBottom: `2px solid ${mobileView === view ? '#FF551F' : 'transparent'}`,
              color: mobileView === view ? '#FF551F' : 'rgba(255,255,255,0.38)',
              fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.16em',
              textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.18s',
            }}
          >
            {view === 'list' ? `LIST (${filtered.length})` : 'MAP'}
          </button>
        ))}
      </div>

      {/* ── Main split panel ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 540, maxHeight: 'calc(100vh - var(--nav-h) - 220px)' }}>

        {/* ── Left: search + filters + results ──────────────────────────────── */}
        <motion.div
          animate={{ width: mapExpanded ? 0 : 380, opacity: mapExpanded ? 0 : 1 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          style={{
            overflow: 'hidden', flexShrink: 0,
            borderRight: '1px solid rgba(255,85,31,0.1)',
            display: 'flex', flexDirection: 'column',
            background: 'rgba(5,8,17,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          className="installers-left-panel"
        >
          <div style={{ width: 380, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

            {/* Search bar */}
            <div style={{ padding: '14px 14px 0', flexShrink: 0 }}>
              <AnimatedSearchBar
                placeholder="Search shops, cities, states…"
                value={query}
                onChange={setQuery}
                size="sm"
                aria-label="Search installers"
                data-search-scope="installers"
              />
            </div>

            {/* Filters accordion */}
            <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
              <button
                onClick={() => setFiltersOpen(p => !p)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                    FILTERS
                  </span>
                  {activeFilterCount > 0 && (
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.08em',
                      background: 'rgba(255,85,31,0.85)', color: '#fff',
                      borderRadius: 10, padding: '1px 6px', lineHeight: 1.5,
                    }}>
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <motion.span
                  animate={{ rotate: filtersOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                >
                  ▼
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {filtersOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 16 }}>

                      {/* Distance slider */}
                      <div>
                        <div style={{
                          fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.38)',
                          letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8,
                          display: 'flex', justifyContent: 'space-between',
                        }}>
                          <span>MAX DISTANCE</span>
                          <span style={{ color: 'rgba(255,85,31,0.85)' }}>{maxDistance} MI</span>
                        </div>
                        <input type="range" min={10} max={100} step={5} value={maxDistance}
                          onChange={e => setMaxDistance(Number(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--orange)', cursor: 'pointer', height: 3 }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.22)', marginTop: 4 }}>
                          <span>10 MI</span><span>100 MI</span>
                        </div>
                      </div>

                      {/* Min rating */}
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.38)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
                          MIN RATING
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {RATING_OPTIONS.map(opt => (
                            <button key={opt.value} onClick={() => setMinRating(opt.value)} style={{
                              flex: 1, padding: '5px 2px', borderRadius: 3,
                              background: minRating === opt.value ? 'rgba(255,85,31,0.75)' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${minRating === opt.value ? 'rgba(255,85,31,0.6)' : 'rgba(255,255,255,0.08)'}`,
                              color: minRating === opt.value ? '#fff' : 'rgba(255,255,255,0.42)',
                              fontFamily: 'var(--font-mono)', fontSize: '10px',
                              letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.15s',
                            }}>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Service types */}
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.38)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
                          SERVICES
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {ALL_SERVICES.map(svc => {
                            const active = selectedServices.includes(svc)
                            return (
                              <label key={svc} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                                <input type="checkbox" checked={active} onChange={() => toggleService(svc)}
                                  style={{ accentColor: 'var(--orange)', width: 13, height: 13, cursor: 'pointer', flexShrink: 0 }}
                                />
                                <span style={{
                                  fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.04em',
                                  color: active ? 'rgba(255,85,31,0.9)' : 'rgba(255,255,255,0.48)',
                                  transition: 'color 0.15s',
                                }}>
                                  {svc}
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      </div>

                      {/* Clear filters */}
                      {activeFilterCount > 0 && (
                        <button
                          onClick={() => { setSelectedServices([]); setMinRating(0); setMaxDistance(100) }}
                          style={{
                            background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 3, color: 'rgba(255,255,255,0.35)',
                            fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em',
                            textTransform: 'uppercase', cursor: 'pointer', padding: '7px',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { Object.assign(e.currentTarget.style, { color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }) }}
                          onMouseLeave={e => { Object.assign(e.currentTarget.style, { color: 'rgba(255,255,255,0.35)', borderColor: 'rgba(255,255,255,0.1)' }) }}
                        >
                          CLEAR ALL FILTERS
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results count */}
            <div style={{ padding: '8px 14px', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {filtered.length === ALL_INSTALLERS.length
                  ? `${ALL_INSTALLERS.length} SHOPS IN NETWORK`
                  : `${filtered.length} OF ${ALL_INSTALLERS.length} SHOPS MATCH`
                }
              </span>
            </div>

            {/* Scrollable installer list */}
            <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '0 10px 16px' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                    NO SHOPS MATCH
                  </div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
                    Try expanding your filters or search radius
                  </p>
                </div>
              ) : (
                filtered.map(inst => (
                  <InstallerCard
                    key={inst.id}
                    installer={inst}
                    selected={selectedId === inst.id}
                    onSelect={() => handleSelectInstaller(inst.id)}
                    onQuote={() => setQuoteInstaller(inst)}
                  />
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Right: interactive map ─────────────────────────────────────────── */}
        <div style={{
          flex: 1, position: 'relative', minWidth: 0,
          display: mobileView === 'list' ? undefined : undefined,
        }}
        className="installers-map-panel"
        >
          <InstallerMapPanel
            installers={filtered}
            selectedId={selectedId}
            onSelect={handleMapSelect}
            expanded={mapExpanded}
            onToggleExpand={() => setMapExpanded(p => !p)}
          />

          {/* Selected installer overlay bar (shows when map is expanded) */}
          <AnimatePresence>
            {mapExpanded && selectedInstaller && (
              <motion.div
                key="sel-bar"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute', bottom: 16, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 'min(480px, calc(100% - 48px))',
                  background: 'rgba(4,16,30,0.95)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,85,31,0.35)',
                  borderRadius: 6,
                  padding: '14px 18px',
                  zIndex: 50,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                }}
              >
                <div>
                  <div className="font-bebas" style={{ fontSize: 17, color: '#fff', letterSpacing: '0.05em', marginBottom: 2 }}>
                    {selectedInstaller.name.toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,85,31,0.8)' }}>
                      {selectedInstaller.city}, {selectedInstaller.state}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#FFC857' }}>
                      ★ {selectedInstaller.rating}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
                      {selectedInstaller.leadTime}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <BtnColorful
                    variant="primary"
                    onClick={() => setQuoteInstaller(selectedInstaller)}
                    style={{ padding: '8px 16px', fontSize: '0.65rem' }}
                  >
                    REQUEST QUOTE
                  </BtnColorful>
                  <button
                    onClick={() => setSelectedId(null)}
                    style={{
                      width: 32, height: 32, background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3,
                      color: 'rgba(255,255,255,0.38)', cursor: 'pointer', fontSize: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.14s',
                    }}
                    onMouseEnter={e => { Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.1)', color: '#fff' }) }}
                    onMouseLeave={e => { Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.38)' }) }}
                    aria-label="Deselect installer"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Footer note ──────────────────────────────────────────────────────── */}
      <div style={{
        textAlign: 'center', padding: '20px 24px',
        borderTop: '1px solid rgba(255,255,255,0.04)', flexShrink: 0,
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Powered by RYKU Network · Google Places &amp; Mapbox integration pending
        </span>
      </div>

      {/* ── Quote modal ───────────────────────────────────────────────────────── */}
      <QuoteModal installer={quoteInstaller} onClose={() => setQuoteInstaller(null)} />

      {/* ── Responsive CSS ────────────────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 760px) {
          .installers-mobile-tabs { display: flex !important; }
          .installers-left-panel  { display: ${mobileView === 'list' ? 'flex' : 'none'} !important; width: 100% !important; }
          .installers-map-panel   { display: ${mobileView === 'map'  ? 'block' : 'none'} !important; }
        }
        .installers-left-panel { min-width: 0; }
      `}</style>
    </div>
  )
}
