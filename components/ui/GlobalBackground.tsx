'use client'

// Fixed atmospheric layer behind the entire site.
// z-index: -1 so all content renders on top.
export default function GlobalBackground() {
  return (
    <div aria-hidden="true" className="global-bg">
      {/* Deep navy base */}
      <div className="gb-base" />

      {/* Primary warm glow — large, slow-breathing, center-body */}
      <div className="gb-warm" />

      {/* Tighter focal warmth — mid-center */}
      <div className="gb-warm2" />

      {/* Cyan tech accent — upper-right corner */}
      <div className="gb-cyan" />

      {/* Deep navy depth anchors — corners */}
      <div className="gb-depth" />

      {/* Blueprint grid */}
      <div className="gb-grid" />

      {/* CRT scanlines */}
      <div className="gb-scan" />

      {/* Film grain */}
      <div className="gb-grain" />
    </div>
  )
}
