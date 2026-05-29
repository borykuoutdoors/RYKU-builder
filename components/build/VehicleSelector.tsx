'use client'

import { useEffect, useRef, useState } from 'react'
import { useBuildStore } from '@/store/buildStore'
import { VEHICLES } from '@/data/vehicles'
import type { Vehicle } from '@/types/vehicle'

// ─── Component ───────────────────────────────────────────────────────────────

export default function VehicleSelector() {
  const setVehicle  = useBuildStore(s => s.setVehicle)
  const setStep     = useBuildStore(s => s.setStep)
  const storeVehicle = useBuildStore(s => s.vehicle)

  const [selectedId, setSelectedId]   = useState<string | null>(storeVehicle?.id ?? null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(storeVehicle ?? null)
  const [year, setYear]               = useState<string>('')
  const [trim, setTrim]               = useState<string>('')
  const [drive, setDrive]             = useState<string>('')

  const gridRef = useRef<HTMLDivElement>(null)

  // Generate year options (last 10 years)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => String(currentYear - i))

  const canConfirm = selectedVehicle !== null && year !== '' && trim !== '' && drive !== ''

  // Wire up data-vid click delegation
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    function handleClick(e: Event) {
      const target = (e.target as HTMLElement).closest('[data-vid]') as HTMLElement | null
      if (!target) return

      const vid = target.getAttribute('data-vid')
      if (!vid) return

      const found = VEHICLES.find(v => v.id === vid) ?? null
      setSelectedId(vid)
      setSelectedVehicle(found)
      // Reset dependent selections
      setYear('')
      setTrim('')
      setDrive('')
    }

    grid.addEventListener('click', handleClick)
    return () => grid.removeEventListener('click', handleClick)
  }, [])

  function handleConfirm() {
    if (!selectedVehicle || !year || !trim || !drive) return
    setVehicle(selectedVehicle, year, trim, drive)
    setStep(2)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Eyebrow */}
      <div>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>STEP 01 / 05</p>
        <h2
          style={{
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            letterSpacing: '0.04em',
            color: 'var(--text)',
          }}
        >
          SELECT YOUR VEHICLE
        </h2>
      </div>

      {/* Vehicle grid (5 columns, 2 rows) */}
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '10px',
        }}
        className="vehicle-grid"
      >
        {VEHICLES.map(v => {
          const isSelected = selectedId === v.id
          return (
            <div
              key={v.id}
              data-vid={v.id}
              className="vehicle-card"
              style={{
                borderColor: isSelected ? 'var(--orange)' : undefined,
                background: isSelected ? 'var(--orange-dim)' : undefined,
                position: 'relative',
              }}
            >
              {/* Checkmark badge */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'var(--orange)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                    <path
                      d="M1 3.5l2 2L7 1"
                      stroke="#000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              <div style={{ fontSize: '1.75rem', lineHeight: 1, marginBottom: '8px' }}>
                {v.emoji}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-rajdhani), sans-serif',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  color: isSelected ? 'var(--orange)' : 'var(--text)',
                  letterSpacing: '0.04em',
                  lineHeight: 1.2,
                  marginBottom: '3px',
                }}
              >
                {v.name}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.1em',
                  color: 'var(--text-3)',
                  textTransform: 'uppercase',
                }}
              >
                {v.sub}
              </div>
            </div>
          )
        })}
      </div>

      {/* Dropdowns — only show when vehicle is selected */}
      {selectedVehicle && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            padding: '20px',
            background: 'rgba(10,10,10,0.5)',
            border: '1px solid rgba(255,85,31,0.12)',
            borderRadius: '4px',
          }}
        >
          {/* Year */}
          <div>
            <label className="form-label">MODEL YEAR</label>
            <select
              className="form-input form-select"
              value={year}
              onChange={e => setYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Trim */}
          <div>
            <label className="form-label">TRIM LEVEL</label>
            <select
              className="form-input form-select"
              value={trim}
              onChange={e => setTrim(e.target.value)}
            >
              <option value="">Select Trim</option>
              {selectedVehicle.trims.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Drive Type */}
          <div>
            <label className="form-label">DRIVE TYPE</label>
            <select
              className="form-input form-select"
              value={drive}
              onChange={e => setDrive(e.target.value)}
            >
              <option value="">Select Drive</option>
              {selectedVehicle.drives.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Confirm button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn btn-primary btn-lg"
          disabled={!canConfirm}
          onClick={handleConfirm}
          style={{
            opacity: canConfirm ? 1 : 0.35,
            cursor: canConfirm ? 'pointer' : 'not-allowed',
          }}
        >
          CONFIRM VEHICLE
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: '4px' }}>
            <path d="M2 7h10M8 3l4 4-4 4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Responsive grid style for small screens */}
      <style>{`
        @media (max-width: 900px) {
          .vehicle-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .vehicle-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
