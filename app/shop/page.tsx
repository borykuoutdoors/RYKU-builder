import Link from 'next/link'

export default function ShopPage() {
  return (
    <main
      style={{
        minHeight: 'calc(100dvh - var(--nav-h) - var(--status-h))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Tactical grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: [
          'linear-gradient(rgba(255,85,31,0.018) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(255,85,31,0.018) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '62px 62px',
      }} />

      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,85,31,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Corner brackets */}
      {[
        { top: 32, left: 32,  borderTop: '1px solid', borderLeft: '1px solid' },
        { top: 32, right: 32, borderTop: '1px solid', borderRight: '1px solid' },
        { bottom: 32, left: 32,  borderBottom: '1px solid', borderLeft: '1px solid' },
        { bottom: 32, right: 32, borderBottom: '1px solid', borderRight: '1px solid' },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 24, height: 24,
            borderColor: 'rgba(255,85,31,0.22)',
            borderStyle: 'solid',
            borderWidth: 0,
            pointerEvents: 'none',
            ...s,
          }}
        />
      ))}

      {/* Content */}
      <div style={{ position: 'relative', textAlign: 'center', maxWidth: 560 }}>
        {/* Status dot + eyebrow */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, marginBottom: 28,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--cyan)',
            boxShadow: '0 0 10px rgba(102,255,255,0.80)',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--cyan)',
          }}>
            COMING SOON
          </span>
        </div>

        {/* Main heading */}
        <h1 style={{
          fontFamily: 'var(--font-bebas)',
          fontSize: 'clamp(3.5rem, 8vw, 6rem)',
          letterSpacing: '0.04em',
          color: 'var(--text)',
          lineHeight: 0.92,
          marginBottom: 24,
        }}>
          BŌRYKU SHOP
        </h1>

        {/* Subheading */}
        <p style={{
          fontFamily: 'var(--font-rajdhani)',
          fontSize: '1.0625rem',
          color: 'var(--text-2)',
          lineHeight: 1.6,
          marginBottom: 40,
          maxWidth: 460,
          margin: '0 auto 40px',
        }}>
          Official BŌRYKU-branded products — apparel, accessories, and original gear
          designed in-house. Third-party overland equipment lives in the Gear catalog.
        </p>

        {/* Divider line */}
        <div style={{
          width: 48, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,85,31,0.6), transparent)',
          margin: '0 auto 40px',
        }} />

        {/* Feature list */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: 48,
          textAlign: 'left',
        }}>
          {[
            { icon: '🎽', text: 'BŌRYKU apparel & hats' },
            { icon: '🚚', text: 'Free shipping over $75' },
            { icon: '⚡',  text: 'Exclusive original designs' },
            { icon: '🔒', text: 'Secure official BŌRYKU store' },
          ].map(({ icon, text }) => (
            <div
              key={text}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,85,31,0.04)',
                border: '1px solid rgba(255,85,31,0.10)',
                borderRadius: 4,
                padding: '10px 14px',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{icon}</span>
              <span style={{
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '0.875rem',
                color: 'var(--text-2)',
                letterSpacing: '0.03em',
              }}>
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/gear" className="btn btn-ghost">
            BROWSE GEAR CATALOG
          </Link>
          <Link href="/build" className="btn btn-ghost">
            START A BUILD
          </Link>
        </div>

        {/* Mono bottom label */}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5625rem',
          letterSpacing: '0.22em',
          color: 'rgba(255,255,255,0.18)',
          textTransform: 'uppercase',
          marginTop: 48,
        }}>
          BŌRYKU ORIGINAL — OFFICIAL MERCHANDISE LOADING
        </p>
      </div>
    </main>
  )
}
