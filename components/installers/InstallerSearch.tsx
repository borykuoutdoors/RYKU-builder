'use client'

import { useState, useRef, useEffect } from 'react'
import { installers as CATALOG_INSTALLERS } from '@/lib/catalog'
import type { Installer } from '@/types/installer'
import InstallerCard from './InstallerCard'
import LoadingBar from '@/components/ui/LoadingBar'
import BtnColorful from '@/components/ui/BtnColorful'

const SERVICES = ['Off-Road', 'Suspension', 'Overland', 'Lighting', 'Recovery', 'Armor'] as const
type ServiceType = typeof SERVICES[number]

export default function InstallerSearch() {
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([])
  const [distance, setDistance] = useState(25)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<Installer[] | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const zipInputRef = useRef<HTMLInputElement>(null)

  function toggleService(service: ServiceType) {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    )
  }

  function runSearch() {
    setIsLoading(true)
    setHasSearched(true)

    setTimeout(() => {
      let filtered: Installer[] = CATALOG_INSTALLERS

      if (selectedServices.length > 0) {
        filtered = filtered.filter((inst) =>
          selectedServices.some((svc) =>
            inst.specialty.some(
              (s) =>
                s.toLowerCase().includes(svc.toLowerCase()) ||
                svc.toLowerCase().includes(s.toLowerCase())
            )
          )
        )
      }

      setResults(filtered)
      setIsLoading(false)
    }, 900)
  }

  // Allow Enter key to trigger search from ZIP input
  useEffect(() => {
    const el = zipInputRef.current
    if (!el) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') runSearch()
    }
    el.addEventListener('keydown', handler)
    return () => el.removeEventListener('keydown', handler)
  })

  return (
    <div>
      {/* ── Search Panel ─────────────────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--carbon)',
          border: '1px solid rgba(255,85,31,0.14)',
          borderRadius: '6px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Country input */}
        <div>
          <label
            className="font-mono"
            htmlFor="country-input"
            style={{
              display: 'block',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.1em',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            COUNTRY
          </label>
          <input
            id="country-input"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="United States"
            data-input="country"
            style={{
              width: '100%',
              background: '#111',
              border: '1px solid rgba(255,85,31,0.3)',
              borderRadius: '4px',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              padding: '12px 16px',
              outline: 'none',
              letterSpacing: '0.08em',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--orange)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,85,31,0.3)' }}
          />
        </div>

        {/* City input */}
        <div>
          <label
            className="font-mono"
            htmlFor="city-input"
            style={{
              display: 'block',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.1em',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            CITY
          </label>
          <input
            id="city-input"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Denver"
            data-input="city"
            style={{
              width: '100%',
              background: '#111',
              border: '1px solid rgba(255,85,31,0.3)',
              borderRadius: '4px',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              padding: '12px 16px',
              outline: 'none',
              letterSpacing: '0.08em',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--orange)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,85,31,0.3)' }}
          />
        </div>

        {/* ZIP input */}
        <div>
          <label
            className="font-mono"
            htmlFor="zip-input"
            style={{
              display: 'block',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.1em',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            ZIP CODE
          </label>
          <input
            id="zip-input"
            ref={zipInputRef}
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="80202"
            data-input="zip"
            style={{
              width: '100%',
              background: '#111',
              border: '1px solid rgba(255,85,31,0.3)',
              borderRadius: '4px',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: '18px',
              padding: '12px 16px',
              outline: 'none',
              letterSpacing: '0.15em',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--orange)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,85,31,0.3)'
            }}
          />
        </div>

        {/* Service checkboxes */}
        <div>
          <div
            className="font-mono"
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            SERVICE TYPES
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {SERVICES.map((svc) => {
              const active = selectedServices.includes(svc)
              return (
                <label
                  key={svc}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleService(svc)}
                    data-service={svc}
                    style={{ accentColor: 'var(--orange)', width: '14px', height: '14px', cursor: 'pointer' }}
                  />
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '12px',
                      color: active ? 'var(--orange)' : 'rgba(255,255,255,0.52)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      transition: 'color 0.15s',
                    }}
                  >
                    {svc}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Distance slider */}
        <div>
          <div
            className="font-mono"
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>SEARCH RADIUS</span>
            <span style={{ color: 'var(--orange)' }}>{distance} MI</span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            data-input="distance"
            style={{
              width: '100%',
              accentColor: 'var(--orange)',
              cursor: 'pointer',
              height: '4px',
            }}
          />
          <div
            className="font-mono"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.25)',
              marginTop: '4px',
            }}
          >
            <span>5 MI</span>
            <span>100 MI</span>
          </div>
        </div>

        {/* Search button */}
        <BtnColorful
          variant="secondary"
          arrow
          style={{ width: '100%' }}
          onClick={runSearch}
          data-action="find-installers"
          disabled={isLoading}
        >
          {isLoading ? 'SEARCHING...' : 'FIND INSTALLERS'}
        </BtnColorful>
      </div>

      {/* Loading bar */}
      <div style={{ marginTop: '4px' }}>
        <LoadingBar isLoading={isLoading} />
      </div>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      {hasSearched && !isLoading && results !== null && (
        <div style={{ marginTop: '32px' }}>
          <div
            className="font-mono"
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            {results.length > 0
              ? `${results.length} INSTALLERS FOUND${zip ? ` NEAR ${zip}` : city ? ` IN ${city.toUpperCase()}` : country ? ` IN ${country.toUpperCase()}` : ''}`
              : 'NO INSTALLERS FOUND — TRY ADJUSTING FILTERS'}
          </div>

          {results.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '16px',
              }}
            >
              {results.map((installer) => (
                <InstallerCard key={installer.id} installer={installer} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
