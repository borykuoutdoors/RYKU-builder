'use client'

const BRANDS = [
  'ARB',
  'Front Runner',
  'WARN',
  'iKamper',
  'Fox',
  'ICON',
  'Baja Designs',
  'Rigid Industries',
  'MAXTRAX',
  'Method',
  'Falken',
  'BF Goodrich',
  'Roofnest',
  'DECKED',
  'Goal Zero',
  'Garmin',
]

export default function BrandMarquee() {
  return (
    <div
      style={{
        overflow: 'hidden',
        borderTop: '1px solid var(--orange)',
        borderBottom: '1px solid var(--orange)',
        background: 'var(--carbon)',
        padding: '14px 0',
        position: 'relative',
      }}
    >
      {/* CSS fade masks on edges */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, var(--carbon) 0%, transparent 6%, transparent 94%, var(--carbon) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Scrolling track — hover pauses via CSS class */}
      <div className="marquee-track animate-marquee" aria-label="Partner brands">
        {/* First copy */}
        {BRANDS.map((brand) => (
          <span
            key={`a-${brand}`}
            className="font-mono uppercase"
            style={{
              display: 'inline-block',
              paddingLeft: '40px',
              paddingRight: '40px',
              color: 'rgba(255,255,255,0.32)',
              letterSpacing: '0.12em',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            {brand}
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {BRANDS.map((brand) => (
          <span
            key={`b-${brand}`}
            aria-hidden="true"
            className="font-mono uppercase"
            style={{
              display: 'inline-block',
              paddingLeft: '40px',
              paddingRight: '40px',
              color: 'rgba(255,255,255,0.32)',
              letterSpacing: '0.12em',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            {brand}
          </span>
        ))}
      </div>

      <style>{`
        .marquee-track {
          display: inline-flex;
          animation: marquee 28s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
