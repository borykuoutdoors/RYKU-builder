'use client'

import SectionEyebrow from '@/components/ui/SectionEyebrow'
import InstallerSearch from '@/components/installers/InstallerSearch'

export default function InstallersPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--dark)',
        backgroundImage: 'var(--bg-grid)',
        backgroundSize: 'var(--bg-grid-size)',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: '1px solid rgba(255,85,31,0.12)',
          padding: '48px 24px 40px',
          textAlign: 'center',
        }}
      >
        <SectionEyebrow>INSTALLER NETWORK</SectionEyebrow>
        <h1
          className="font-bebas"
          style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            letterSpacing: '0.05em',
            color: '#fff',
            margin: '8px 0',
          }}
        >
          FIND CERTIFIED SHOPS
        </h1>
        <p
          className="font-rajdhani"
          style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', margin: 0 }}
        >
          Vetted overland and off-road specialists across the RYKU network
        </p>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Search (full width) */}
        <InstallerSearch />

        {/* Map placeholder */}
        <div
          style={{
            marginTop: '40px',
            background: 'var(--carbon)',
            border: '1px solid rgba(102,255,255,0.12)',
            borderRadius: '6px',
            padding: '40px 32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '40px' }}>🗺️</div>
          <div
            className="font-bebas"
            style={{ fontSize: '22px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em' }}
          >
            MAP VIEW COMING SOON
          </div>
          <div
            className="font-rajdhani"
            style={{ fontSize: '14px', color: 'rgba(255,255,255,0.32)', maxWidth: '380px' }}
          >
            Google Places integration is in progress. Interactive map view with live shop data will
            be available once{' '}
            <span className="font-mono" style={{ color: 'var(--cyan)', fontSize: '12px' }}>
              GOOGLE_PLACES_API_KEY
            </span>{' '}
            is configured.
          </div>
        </div>

        {/* Footer note */}
        <div
          className="font-mono"
          style={{
            textAlign: 'center',
            marginTop: '32px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.22)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Powered by RYKU Network
        </div>
      </div>
    </div>
  )
}
