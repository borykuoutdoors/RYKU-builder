'use client'

import { useEffect, useState } from 'react'

function pad2(n: number) { return String(n).padStart(2, '0') }

function LiveClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    function tick() {
      const d = new Date()
      setTime(`${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <span>{time}</span>
}

export default function StatusBar() {
  const [feedTime, setFeedTime] = useState('')
  useEffect(() => {
    const d = new Date()
    setFeedTime(`${pad2(d.getHours())}:${pad2(d.getMinutes())}`)
  }, [])

  return (
    <div
      className="status-bar"
      role="status"
      aria-label="System status"
      style={{ gap: 0 }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.5625rem',
        letterSpacing: '0.12em',
        color: 'var(--text-3)',
        overflow: 'hidden',
      }}>

        {/* ── Left: branding + coords ─────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <span>
            <span style={{ color: 'var(--orange)' }}>BŌRYKU</span>
            {' // OS v4.2 · Lat 44.4280 · Lon −110.5885'}
          </span>
        </div>

        {/* ── Center: expedition feed ─────────────────── */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          overflow: 'hidden',
        }}>
          <span
            style={{
              display: 'inline-block',
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--orange)',
              flexShrink: 0,
              animation: 'statusPulse 2s ease-in-out infinite',
            }}
          />
          <span style={{ whiteSpace: 'nowrap' }}>
            Expedition Feed · Live · {feedTime}
          </span>
        </div>

        {/* ── Right: live clock ───────────────────────── */}
        <div style={{ flexShrink: 0 }}>
          <LiveClock />
        </div>
      </div>

      <style>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.25; }
        }
      `}</style>
    </div>
  )
}
