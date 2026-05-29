import type { Installer } from '@/types/installer'

interface Props {
  installer: Installer
}

function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  const full = Math.round(rating)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ color: 'var(--orange)', fontSize: '14px', letterSpacing: '1px' }}>
        {'★'.repeat(Math.min(full, 5))}
        {'☆'.repeat(Math.max(0, 5 - full))}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-3)' }}>
        {rating.toFixed(1)} · {reviews} reviews
      </span>
    </div>
  )
}

export default function InstallerCard({ installer }: Props) {
  return (
    <div
      style={{
        background: 'var(--carbon)',
        border: '1px solid rgba(255,85,31,0.14)',
        borderRadius: '4px',
        padding: '20px',
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
      {/* Name + lead time */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '1rem',
          letterSpacing: '0.06em', color: 'var(--text)', lineHeight: 1.2,
        }}>
          {installer.name.toUpperCase()}
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
          letterSpacing: '0.12em', color: 'var(--text-3)',
          border: '1px solid rgba(255,255,255,0.12)',
          padding: '2px 7px', borderRadius: '2px',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {installer.leadTime}
        </span>
      </div>

      {/* Location */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
        letterSpacing: '0.12em', color: 'var(--orange)',
        textTransform: 'uppercase',
      }}>
        📍 {installer.city}, {installer.state}
      </div>

      {/* Rating */}
      <Stars rating={installer.rating} reviews={installer.reviews} />

      {/* Specialties */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {installer.specialty.map(s => (
          <span key={s} style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '2px 8px', borderRadius: '2px',
            border: '1px solid rgba(255,85,31,0.35)',
            color: 'rgba(255,85,31,0.8)',
          }}>
            {s}
          </span>
        ))}
      </div>

      {/* CTA */}
      <button
        className="btn btn-ghost"
        style={{ marginTop: 4, width: '100%', fontSize: '0.7rem' }}
        data-action="save-installer"
        data-installer-id={installer.id}
      >
        REQUEST QUOTE
      </button>
    </div>
  )
}
