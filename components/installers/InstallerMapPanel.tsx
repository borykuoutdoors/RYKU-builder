'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Installer } from '@/types/installer'

// ── Map coordinate math ───────────────────────────────────────────────────────
// Continental US bounding box
const LAT_MAX = 49.4, LAT_MIN = 24.4   // north → south
const LNG_MIN = -125,  LNG_MAX = -66.9 // west  → east
const LNG_RANGE = LNG_MAX - LNG_MIN    // ~58.1
const LAT_RANGE = LAT_MAX - LAT_MIN    // ~25.0

function toXY(lat: number, lng: number) {
  return {
    x: (lng - LNG_MIN) / LNG_RANGE * 100,
    y: (LAT_MAX - lat)  / LAT_RANGE * 100,
  }
}

// ── State labels ──────────────────────────────────────────────────────────────
const STATE_LABELS = [
  { a: 'WA', x: 4,  y: 9  }, { a: 'OR', x: 4,  y: 17 }, { a: 'CA', x: 9,  y: 47 },
  { a: 'NV', x: 16, y: 38 }, { a: 'ID', x: 20, y: 20 }, { a: 'MT', x: 28, y: 12 },
  { a: 'AZ', x: 21, y: 62 }, { a: 'UT', x: 23, y: 36 }, { a: 'CO', x: 34, y: 43 },
  { a: 'WY', x: 30, y: 26 }, { a: 'NM', x: 30, y: 66 }, { a: 'TX', x: 47, y: 73 },
  { a: 'OK', x: 46, y: 62 }, { a: 'KS', x: 48, y: 51 }, { a: 'NE', x: 46, y: 40 },
  { a: 'SD', x: 44, y: 29 }, { a: 'ND', x: 42, y: 17 }, { a: 'MN', x: 52, y: 22 },
  { a: 'IA', x: 53, y: 38 }, { a: 'MO', x: 55, y: 49 }, { a: 'AR', x: 55, y: 61 },
  { a: 'LA', x: 54, y: 74 }, { a: 'WI', x: 57, y: 28 }, { a: 'IL', x: 59, y: 40 },
  { a: 'MI', x: 63, y: 27 }, { a: 'IN', x: 62, y: 40 }, { a: 'OH', x: 66, y: 37 },
  { a: 'KY', x: 64, y: 49 }, { a: 'TN', x: 63, y: 57 }, { a: 'GA', x: 67, y: 65 },
  { a: 'FL', x: 66, y: 83 }, { a: 'NC', x: 71, y: 54 }, { a: 'VA', x: 73, y: 47 },
  { a: 'PA', x: 71, y: 35 }, { a: 'NY', x: 73, y: 27 }, { a: 'ME', x: 79, y: 13 },
]

// ── Props ─────────────────────────────────────────────────────────────────────
export interface InstallerMapPanelProps {
  installers:     Installer[]
  selectedId:     string | null
  onSelect:       (id: string) => void
  expanded:       boolean
  onToggleExpand: () => void
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function InstallerMapPanel({
  installers, selectedId, onSelect, expanded, onToggleExpand,
}: InstallerMapPanelProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)

  // Compute nearest-neighbor network lines (deduplicated pairs)
  const networkLines = useMemo<[Installer, Installer][]>(() => {
    const seen = new Set<string>()
    const result: [Installer, Installer][] = []
    installers.forEach((a, i) => {
      const sorted = installers
        .map((b, j) => ({ b, j, d: Math.hypot(a.lat - b.lat, a.lng - b.lng) }))
        .filter(({ j }) => j !== i)
        .sort((x, y) => x.d - y.d)
        .slice(0, 2)
      sorted.forEach(({ b, j }) => {
        const key = `${Math.min(i, j)}-${Math.max(i, j)}`
        if (!seen.has(key)) { seen.add(key); result.push([a, b]) }
      })
    })
    return result
  }, [installers])

  const gridSize = 60 * zoom
  const subSize  = 15 * zoom

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>

      {/* Dark tactical base */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#04101e',
        backgroundImage: [
          `linear-gradient(rgba(102,255,255,0.032) 1px, transparent 1px)`,
          `linear-gradient(90deg, rgba(102,255,255,0.032) 1px, transparent 1px)`,
          `linear-gradient(rgba(102,255,255,0.01) 1px, transparent 1px)`,
          `linear-gradient(90deg, rgba(102,255,255,0.01) 1px, transparent 1px)`,
        ].join(','),
        backgroundSize: `${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px, ${subSize}px ${subSize}px, ${subSize}px ${subSize}px`,
      }} />

      {/* Ambient depth glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 50% at 38% 50%, rgba(255,85,31,0.04) 0%, transparent 65%)',
      }} />

      {/* State abbreviation labels */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {STATE_LABELS.map(({ a, x, y }) => (
          <div key={a} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            transform: 'translate(-50%,-50%)',
            fontFamily: 'var(--font-mono)', fontSize: '7px',
            color: 'rgba(102,255,255,0.10)', letterSpacing: '0.05em',
            userSelect: 'none',
          }}>
            {a}
          </div>
        ))}
      </div>

      {/* SVG layer: network lines */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {networkLines.map(([a, b], idx) => {
          const pa = toXY(a.lat, a.lng)
          const pb = toXY(b.lat, b.lng)
          return (
            <line key={idx}
              x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
              stroke="rgba(102,255,255,0.09)"
              strokeWidth="0.25"
              strokeDasharray="0.7 1.8"
            />
          )
        })}
      </svg>

      {/* Installer pins */}
      {installers.map((inst) => {
        const { x, y } = toXY(inst.lat, inst.lng)
        const isSel  = inst.id === selectedId
        const isHov  = inst.id === hoveredId
        const scale  = isSel ? 1.35 : isHov ? 1.18 : 1
        const pinColor = inst.tier === 'elite' ? '#FFC857' : '#FF551F'
        const ringColor = inst.tier === 'elite'
          ? 'rgba(255,200,87,0.55)' : inst.tier === 'certified'
          ? 'rgba(255,85,31,0.45)' : 'rgba(255,255,255,0.14)'

        return (
          <div
            key={inst.id}
            onClick={() => onSelect(inst.id)}
            onMouseEnter={() => setHoveredId(inst.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              position: 'absolute',
              left: `${x}%`, top: `${y}%`,
              transform: `translate(-50%,-50%) scale(${scale})`,
              cursor: 'pointer',
              zIndex: isSel ? 22 : isHov ? 16 : 10,
              transition: 'transform 0.22s var(--ease)',
            }}
          >
            {/* Tier ring */}
            <div style={{
              position: 'absolute', inset: -3, borderRadius: '50%',
              border: `1.5px solid ${ringColor}`,
              pointerEvents: 'none',
            }} />

            {/* Pulse rings on selection */}
            {isSel && (
              <>
                <motion.div
                  animate={{ scale: [1, 3.2], opacity: [0.65, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                  style={{
                    position: 'absolute', inset: -4, borderRadius: '50%',
                    border: `1.5px solid ${pinColor}`, pointerEvents: 'none',
                  }}
                />
                <motion.div
                  animate={{ scale: [1, 2.2], opacity: [0.45, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
                  style={{
                    position: 'absolute', inset: -2, borderRadius: '50%',
                    border: `1px solid rgba(255,200,87,0.5)`, pointerEvents: 'none',
                  }}
                />
              </>
            )}

            {/* Pin body */}
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              background: isSel
                ? `linear-gradient(135deg, #FF551F 0%, #FFC857 100%)`
                : `${pinColor}cc`,
              border: `1.5px solid ${isSel ? '#FFC857' : pinColor + '80'}`,
              boxShadow: isSel
                ? `0 0 14px ${pinColor}cc, 0 0 32px ${pinColor}44`
                : isHov
                  ? `0 0 8px ${pinColor}88`
                  : '0 2px 6px rgba(0,0,0,0.75)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {inst.verified && (
                <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                  <path d="M1 2.5l1.7 1.7L6 .8" stroke="#fff" strokeWidth="1.4"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>

            {/* Hover tooltip */}
            <AnimatePresence>
              {isHov && !isSel && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.88 }}
                  transition={{ duration: 0.13, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 8px)',
                    left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(4,16,30,0.97)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,85,31,0.35)',
                    borderRadius: '4px',
                    padding: '7px 11px',
                    whiteSpace: 'nowrap',
                    zIndex: 100, pointerEvents: 'none',
                    minWidth: '140px',
                  }}
                >
                  {/* Arrow */}
                  <div style={{
                    position: 'absolute', bottom: -5, left: '50%',
                    width: 8, height: 8,
                    background: 'rgba(4,16,30,0.97)',
                    border: '1px solid rgba(255,85,31,0.35)',
                    borderTop: 'none', borderLeft: 'none',
                    transform: 'translateX(-50%) rotate(45deg)',
                  }} />
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: '#fff', letterSpacing: '0.05em' }}>
                    {inst.name.toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 3, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,85,31,0.85)' }}>
                      {inst.city}, {inst.state}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#FFC857' }}>
                      ★ {inst.rating}
                    </span>
                    {inst.verified && (
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '8px',
                        color: 'rgba(102,255,255,0.85)',
                        border: '1px solid rgba(102,255,255,0.3)',
                        borderRadius: 2, padding: '0 4px',
                      }}>
                        VERIFIED
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      {/* ── Top toolbar ──────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 12, left: 12, right: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 8, zIndex: 30, pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', gap: 7, pointerEvents: 'auto' }}>
          <div style={{
            background: 'rgba(4,16,30,0.9)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(102,255,255,0.22)', borderRadius: 4,
            padding: '5px 12px',
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            color: 'rgba(102,255,255,0.8)', letterSpacing: '0.18em',
          }}>
            RYKU INSTALLER NETWORK
          </div>
          <div style={{
            background: 'rgba(4,16,30,0.9)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,85,31,0.25)', borderRadius: 4,
            padding: '5px 10px',
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            color: 'rgba(255,85,31,0.9)', letterSpacing: '0.1em',
          }}>
            {installers.length} LOCATIONS
          </div>
        </div>

        {/* Compass rose */}
        <div style={{
          width: 34, height: 34, pointerEvents: 'none',
          background: 'rgba(4,16,30,0.78)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.09)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v14M3 10h14" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6"/>
            <path d="M10 3L8 8h4L10 3z" fill="#FF551F" opacity="0.85"/>
            <path d="M10 17L8 12h4L10 17z" fill="rgba(255,255,255,0.25)"/>
            <circle cx="10" cy="10" r="1.6" fill="rgba(255,255,255,0.35)"/>
            <text x="10" y="2.2" textAnchor="middle" fill="rgba(255,255,255,0.55)"
              fontSize="3.2" fontFamily="monospace">N</text>
          </svg>
        </div>
      </div>

      {/* ── Zoom controls ────────────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', bottom: 44, right: 12, zIndex: 30, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {([{ l: '+', fn: () => setZoom(z => Math.min(z + 0.5, 3)) },
           { l: '−', fn: () => setZoom(z => Math.max(z - 0.5, 1)) }] as const).map(({ l, fn }, i) => (
          <button key={l} onClick={fn} style={{
            width: 30, height: 30,
            background: 'rgba(4,16,30,0.92)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: i === 0 ? '4px 4px 0 0' : '0 0 4px 4px',
            color: 'rgba(255,255,255,0.6)', fontSize: 17, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1, transition: 'all 0.15s',
          }}
          onMouseEnter={e => { Object.assign(e.currentTarget.style, { background: 'rgba(255,85,31,0.22)', color: '#fff', borderColor: 'rgba(255,85,31,0.4)' }) }}
          onMouseLeave={e => { Object.assign(e.currentTarget.style, { background: 'rgba(4,16,30,0.92)', color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.1)' }) }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* ── Legend ───────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 12, left: 12, zIndex: 30,
        background: 'rgba(4,16,30,0.88)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4,
        padding: '5px 10px', display: 'flex', gap: 14, alignItems: 'center',
      }}>
        {[
          { color: '#FFC857',               label: 'ELITE' },
          { color: '#FF551F',               label: 'CERTIFIED' },
          { color: 'rgba(255,85,31,0.45)',  label: 'STANDARD' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,255,255,0.38)', letterSpacing: '0.1em' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Attribution ──────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 8, right: 50, zIndex: 20,
        fontFamily: 'var(--font-mono)', fontSize: '8px',
        color: 'rgba(255,255,255,0.11)', letterSpacing: '0.08em',
        pointerEvents: 'none',
      }}>
        MAPBOX · GOOGLE PLACES READY
      </div>

      {/* ── Expand / collapse toggle ─────────────────────────────────────────── */}
      <button
        onClick={onToggleExpand}
        title={expanded ? 'Show installer list' : 'Expand map'}
        style={{
          position: 'absolute', top: '50%', left: 0,
          transform: 'translateY(-50%)',
          width: 18, height: 56,
          background: 'rgba(4,16,30,0.95)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,85,31,0.35)', borderLeft: 'none',
          borderRadius: '0 4px 4px 0',
          color: 'rgba(255,85,31,0.75)',
          cursor: 'pointer', zIndex: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, transition: 'all 0.15s',
        }}
        onMouseEnter={e => { Object.assign(e.currentTarget.style, { background: 'rgba(255,85,31,0.18)', color: '#FF551F', borderColor: 'rgba(255,85,31,0.65)' }) }}
        onMouseLeave={e => { Object.assign(e.currentTarget.style, { background: 'rgba(4,16,30,0.95)', color: 'rgba(255,85,31,0.75)', borderColor: 'rgba(255,85,31,0.35)' }) }}
      >
        {expanded ? '›' : '‹'}
      </button>
    </div>
  )
}
