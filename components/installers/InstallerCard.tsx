import type { Installer } from '@/types/installer'

interface Props {
  installer: Installer
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.round(rating)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ color: 'var(--orange)', fontSize: '16px', letterSpacing: '1px' }}>
        {'★'.repeat(Math.min(full, 5))}
        {'☆'.repeat(Math.max(0, 5 - full))}
      </span>
      <span
        className="font-mono"
        style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginLeft: '4px' }}
      >
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

export default function InstallerCard({ installer }: Props) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    installer.address
  )}`

  return (
    <div
      style={{
        background: 'var(--carbon)',
        border: '1px solid rgba(255,85,31,0.14)',
        borderRadius: '6px',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--orange)'
        el.style.transform = 'translateY(-3px)'
        el.style.boxShadow = '0 8px 28px rgba(255,85,31,0.1)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'rgba(255,85,31,0.14)'
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Header: name + rating */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div
          className="font-bebas"
          style={{
            fontSize: '20px',
            color: '#fff',
            letterSpacing: '0.06em',
            lineHeight: 1.1,
          }}
        >
          {installer.name}
        </div>
        {/* Distance badge */}
        <span
          className="font-mono"
          style={{
            fontSize: '11px',
            color: 'var(--cyan)',
            border: '1px solid rgba(102,255,255,0.35)',
            borderRadius: '3px',
            padding: '3px 8px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {installer.distance}
        </span>
      </div>

      {/* Star rating */}
      <StarRating rating={installer.rating} />

      {/* Tags */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {installer.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono"
            style={{
              fontSize: '10px',
              padding: '2px 8px',
              borderRadius: '3px',
              border: '1px solid rgba(255,85,31,0.4)',
              color: 'rgba(255,85,31,0.85)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Address */}
      <div
        className="font-mono"
        style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.04em',
          lineHeight: 1.5,
        }}
      >
        📍 {installer.address}
      </div>

      {/* Hours */}
      {installer.hours && (
        <div
          className="font-mono"
          style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.04em',
          }}
        >
          🕐 {installer.hours}
        </div>
      )}

      {/* Review count */}
      <div
        className="font-mono"
        style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)', letterSpacing: '0.06em' }}
      >
        {installer.reviewCount} reviews
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
          style={{ flex: 1, textAlign: 'center', fontSize: '12px' }}
          data-action="get-directions"
          data-installer-id={installer.id}
        >
          GET DIRECTIONS
        </a>
        <button
          className="btn btn-ghost"
          style={{ flex: 1, fontSize: '12px' }}
          data-action="save-installer"
          data-installer-id={installer.id}
        >
          SAVE
        </button>
      </div>
    </div>
  )
}
