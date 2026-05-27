'use client'

import { useBuildStore } from '@/store/buildStore'

export default function StatusBar() {
  const vehicle  = useBuildStore(s => s.vehicle)
  const mission  = useBuildStore(s => s.mission)
  const budget   = useBuildStore(s => s.budget)
  const items    = useBuildStore(s => s.items)

  const vehicleName  = vehicle?.name  ?? '—'
  const missionName  = mission        ?? '—'
  const budgetDisplay = budget > 0
    ? budget.toLocaleString('en-US')
    : '—'
  const itemCount = Object.keys(items).length

  return (
    <div
      className="status-bar"
      role="status"
      aria-label="Build status"
      style={{ gap: '0' }}
    >
      {/* Scrolling ticker content */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6125rem',
        letterSpacing: '0.12em',
        color: 'var(--text-3)',
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        whiteSpace: 'nowrap',
        width: '100%',
        overflow: 'hidden',
      }}>

        {/* Pulsing status dot */}
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <span
            style={{
              color: 'var(--orange)',
              animation: 'statusPulse 2s ease-in-out infinite',
              display: 'inline-block',
            }}
          >
            ●
          </span>
          <span style={{ color: 'var(--text-3)' }}>SYSTEMS ONLINE</span>
        </span>

        <Divider />

        {/* Vehicle */}
        <span style={{ flexShrink: 0 }}>
          VEHICLE:{' '}
          <span style={{ color: vehicle ? 'var(--text)' : 'var(--text-3)' }}>
            {vehicleName}
          </span>
        </span>

        <Divider />

        {/* Mission */}
        <span style={{ flexShrink: 0 }}>
          MISSION:{' '}
          <span style={{ color: mission ? 'var(--text)' : 'var(--text-3)' }}>
            {missionName}
          </span>
        </span>

        <Divider />

        {/* Budget */}
        <span style={{ flexShrink: 0 }}>
          BUDGET:{' '}
          <span style={{ color: budget > 0 ? 'var(--text)' : 'var(--text-3)' }}>
            {budget > 0 ? `$${budgetDisplay}` : '—'}
          </span>
        </span>

        <Divider />

        {/* Item count */}
        <span style={{ flexShrink: 0 }}>
          BUILD:{' '}
          <span style={{ color: itemCount > 0 ? 'var(--text)' : 'var(--text-3)' }}>
            {itemCount}
          </span>
          {' '}ITEMS
        </span>

        <Divider />

        {/* Branding */}
        <span style={{ flexShrink: 0 }}>
          <span style={{ color: 'var(--orange)' }}>BŌRYKU</span>
          <span style={{ color: 'var(--text-3)' }}> v1.0 // RYKU CONNECTED</span>
        </span>
      </div>

      {/* Pulse keyframe */}
      <style>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.25; }
        }
      `}</style>
    </div>
  )
}

/** Thin vertical separator */
function Divider() {
  return (
    <span style={{
      display: 'inline-block',
      width: '1px',
      height: '10px',
      background: 'rgba(255,255,255,0.10)',
      flexShrink: 0,
    }} />
  )
}
