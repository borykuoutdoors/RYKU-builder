'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useBuildStore } from '@/store/buildStore'
import { installers as ALL_INSTALLERS } from '@/lib/catalog'
import InstallerCard from '@/components/installers/InstallerCard'
import InstallerMapPanel from '@/components/installers/InstallerMapPanel'
import QuoteModal from '@/components/installers/QuoteModal'
import type { Installer } from '@/types/installer'

// ── Map product category → installer service ──────────────────────────────────

const CAT_TO_SERVICE: Record<string, string> = {
  'Suspension':         'Suspension Install',
  'Roof Racks':         'Roof Rack Install',
  'Lighting':           'Lighting Install',
  'Rooftop Tents':      'RTT Install',
  'Wheels & Tires':     'Suspension Install',
  'Armor & Protection': 'Armor / Bumper Install',
  'Recovery':           'Recovery Gear',
  'Electrical':         'Electrical Systems',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function InstallerStep() {
  const router       = useRouter()
  const setStep      = useBuildStore(s => s.setStep)
  const setCompleted = useBuildStore(s => s.setCompleted)
  const items        = useBuildStore(s => s.items)
  const vehicle      = useBuildStore(s => s.vehicle)
  const year         = useBuildStore(s => s.year)
  const trim         = useBuildStore(s => s.trim)
  const buildName    = useBuildStore(s => s.buildName)
  const totalCost    = useBuildStore(s => s.buildTotal())
  const itemCount    = Object.keys(items).length

  const vehicleName = vehicle
    ? [year, vehicle.name, trim].filter(Boolean).join(' ')
    : ''

  // ── Derive needed services from selected build items ─────────────────────
  const neededServices = useMemo(() => {
    const set = new Set<string>()
    Object.values(items).forEach(p => {
      const svc = CAT_TO_SERVICE[p.category]
      if (svc) set.add(svc)
    })
    return Array.from(set)
  }, [items])

  // ── Local state ───────────────────────────────────────────────────────────
  const [query,          setQuery]          = useState('')
  const [selectedId,     setSelectedId]     = useState<string | null>(null)
  const [quoteInstaller, setQuoteInstaller] = useState<Installer | null>(null)
  const [mapExpanded,    setMapExpanded]    = useState(false)
  const [mobileView,     setMobileView]     = useState<'list' | 'map'>('list')
  const [saving,         setSaving]         = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  // ── Filter by search query ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!query.trim()) return ALL_INSTALLERS
    const q = query.toLowerCase()
    return ALL_INSTALLERS.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.city.toLowerCase().includes(q) ||
      i.state.toLowerCase().includes(q)
    )
  }, [query])

  // ── Sort: installers that match build services float to the top ───────────
  const sorted = useMemo(() => {
    if (neededServices.length === 0) return filtered
    return [...filtered].sort((a, b) => {
      const aMatches = neededServices.filter(s => a.services.includes(s)).length
      const bMatches = neededServices.filter(s => b.services.includes(s)).length
      return bMatches - aMatches
    })
  }, [filtered, neededServices])

  // Keep selectedId valid after filter changes
  useEffect(() => {
    if (selectedId && !sorted.find(i => i.id === selectedId)) {
      setSelectedId(null)
    }
  }, [sorted, selectedId])

  // Scroll selected card into view when list changes
  useEffect(() => {
    if (!selectedId || !listRef.current) return
    const el = listRef.current.querySelector(`[data-installer-id="${selectedId}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedId])

  function handleSaveBuild() {
    setSaving(true)
    setTimeout(() => {
      setCompleted(true)
      router.push('/my-build')
    }, 900)
  }

  const selectedInstaller = sorted.find(i => i.id === selectedId) ?? null

  const buildContext = {
    vehicleName,
    buildName,
    neededServices,
    total: totalCost,
    itemCount,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Header: build context + navigation ─────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        padding: '10px 16px',
        borderBottom: '1px solid rgba(255,85,31,0.10)',
        background: 'rgba(8,10,18,0.80)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>

        {/* Build services context banner */}
        {neededServices.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            padding: '10px 14px',
            background: 'rgba(255,85,31,0.04)',
            border: '1px solid rgba(255,85,31,0.12)',
            borderRadius: '4px',
            marginBottom: '10px',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%', flexShrink: 0, marginTop: 3,
              background: '#FF551F', boxShadow: '0 0 6px rgba(255,85,31,0.7)',
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                letterSpacing: '0.15em', color: 'var(--text-3)',
                textTransform: 'uppercase', marginBottom: '6px',
              }}>
                YOUR BUILD REQUIRES INSTALLATION
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {neededServices.map(svc => (
                  <span key={svc} style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.48rem',
                    letterSpacing: '0.1em', padding: '2px 7px', borderRadius: '2px',
                    border: '1px solid rgba(255,85,31,0.3)',
                    color: 'rgba(255,85,31,0.8)',
                    background: 'rgba(255,85,31,0.06)',
                    textTransform: 'uppercase',
                  }}>
                    {svc}
                  </span>
                ))}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.47rem',
                letterSpacing: '0.1em', color: 'var(--text-3)', marginTop: '4px',
              }}>
                Showing shops that match your build first
              </div>
            </div>
            {vehicleName && (
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                  letterSpacing: '0.08em', color: 'var(--text-2)', marginBottom: '2px',
                }}>
                  {vehicleName.toUpperCase()}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                  letterSpacing: '0.08em', color: 'var(--orange)',
                }}>
                  ${totalCost.toLocaleString()} BUILD
                </div>
              </div>
            )}
          </div>
        )}

        {/* Nav row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setStep(5)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-3)',
              fontFamily: 'var(--font-tactical)', fontWeight: 600,
              fontSize: '0.75rem', letterSpacing: '0.14em',
              padding: '8px 16px', cursor: 'pointer', borderRadius: '2px',
              textTransform: 'uppercase',
            }}
          >
            ← REVIEW
          </button>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={handleSaveBuild}
              disabled={saving}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.38)',
                fontFamily: 'var(--font-tactical)', fontWeight: 600,
                fontSize: '0.7rem', letterSpacing: '0.14em',
                padding: '8px 14px', cursor: 'pointer', borderRadius: '2px',
                textTransform: 'uppercase', opacity: saving ? 0.5 : 1,
              }}
            >
              {saving ? 'SAVING...' : 'SKIP & SAVE'}
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSaveBuild}
              disabled={saving}
              style={{ fontSize: '0.75rem', padding: '8px 20px' }}
            >
              {saving ? (
                <span style={{
                  display: 'inline-block', width: 10, height: 10, border: '2px solid #000',
                  borderTopColor: 'transparent', borderRadius: '50%',
                  animation: 'isp-spin 0.7s linear infinite',
                }} />
              ) : '⚡'} SAVE BUILD
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile view toggle ──────────────────────────────────────────────── */}
      <div
        className="isp-mobile-tabs"
        style={{ display: 'none', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        {(['list', 'map'] as const).map(view => (
          <button
            key={view}
            onClick={() => setMobileView(view)}
            style={{
              flex: 1, padding: '10px',
              background: mobileView === view ? 'rgba(255,85,31,0.1)' : 'transparent',
              border: 'none',
              borderBottom: `2px solid ${mobileView === view ? '#FF551F' : 'transparent'}`,
              color: mobileView === view ? '#FF551F' : 'rgba(255,255,255,0.38)',
              fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.16em',
              textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.18s',
            }}
          >
            {view === 'list' ? `SHOPS (${sorted.length})` : 'MAP'}
          </button>
        ))}
      </div>

      {/* ── Main split: list + map ──────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* Left: installer list */}
        <motion.div
          animate={{ width: mapExpanded ? 0 : 340, opacity: mapExpanded ? 0 : 1 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="isp-list-panel"
          style={{
            overflow: 'hidden', flexShrink: 0,
            borderRight: '1px solid rgba(255,85,31,0.10)',
            display: 'flex', flexDirection: 'column',
            background: 'rgba(5,8,17,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ width: 340, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

            {/* Search input */}
            <div style={{ padding: '12px 12px 6px', flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.25)', fontSize: 13, pointerEvents: 'none',
                }}>
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search shops, cities…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  style={{
                    width: '100%', paddingLeft: 32, paddingRight: 12,
                    paddingTop: 8, paddingBottom: 8,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 4, color: '#fff',
                    fontFamily: 'var(--font-mono)', fontSize: '12px',
                    outline: 'none', boxSizing: 'border-box',
                    letterSpacing: '0.04em', transition: 'border-color 0.15s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,85,31,0.4)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
                />
              </div>
            </div>

            {/* Result count */}
            <div style={{ padding: '4px 12px 8px', flexShrink: 0 }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                {sorted.length === ALL_INSTALLERS.length
                  ? `${sorted.length} SHOPS`
                  : `${sorted.length} SHOPS MATCH`
                }
                {neededServices.length > 0 && ' · SORTED BY BUILD FIT'}
              </span>
            </div>

            {/* Installer cards */}
            <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '0 8px 16px' }}>
              {sorted.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '11px',
                    color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em',
                    textTransform: 'uppercase', marginBottom: 8,
                  }}>
                    NO SHOPS MATCH
                  </div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.18)' }}>
                    Try a different search
                  </p>
                </div>
              ) : (
                sorted.map(inst => {
                  const matchCount = neededServices.filter(s => inst.services.includes(s)).length
                  return (
                    <div key={inst.id}>
                      {matchCount > 0 && neededServices.length > 0 && (
                        <div style={{
                          fontFamily: 'var(--font-mono)', fontSize: '8px',
                          letterSpacing: '0.12em', color: '#4ade80',
                          padding: '0 4px 3px', textTransform: 'uppercase',
                        }}>
                          ✓ {matchCount}/{neededServices.length} BUILD SERVICES
                        </div>
                      )}
                      <InstallerCard
                        installer={inst}
                        selected={selectedId === inst.id}
                        onSelect={() => setSelectedId(prev => prev === inst.id ? null : inst.id)}
                        onQuote={() => setQuoteInstaller(inst)}
                      />
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </motion.div>

        {/* Right: map */}
        <div
          className="isp-map-panel"
          style={{ flex: 1, position: 'relative', minWidth: 0 }}
        >
          <InstallerMapPanel
            installers={sorted}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId(prev => prev === id ? null : id)}
            expanded={mapExpanded}
            onToggleExpand={() => setMapExpanded(p => !p)}
          />

          {/* Selected installer overlay (map-expanded mode) */}
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
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,85,31,0.35)',
                  borderRadius: 6, padding: '14px 18px', zIndex: 50,
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
                    {selectedInstaller.leadTime && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                        {selectedInstaller.leadTime}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => setQuoteInstaller(selectedInstaller)}
                    style={{ fontSize: '0.65rem', padding: '8px 16px' }}
                  >
                    REQUEST QUOTE
                  </button>
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

      {/* Quote modal — pre-populated with build context */}
      <QuoteModal
        installer={quoteInstaller}
        onClose={() => setQuoteInstaller(null)}
        buildContext={buildContext}
      />

      <style>{`
        @keyframes isp-spin { to { transform: rotate(360deg); } }
        @media (max-width: 760px) {
          .isp-mobile-tabs  { display: flex !important; }
          .isp-list-panel   { display: ${mobileView === 'list' ? 'flex' : 'none'} !important; width: 100% !important; }
          .isp-map-panel    { display: ${mobileView === 'map'  ? 'block' : 'none'} !important; }
        }
      `}</style>
    </div>
  )
}
