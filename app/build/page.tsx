import BuildPlanner from '@/components/build/BuildPlanner'

export default function BuildPage() {
  return (
    <>
      {/* Desktop: fixed viewport height so columns scroll independently */}
      <div
        className="build-page-desktop"
        style={{ height: 'calc(100dvh - var(--nav-h) - var(--status-h))', overflow: 'hidden' }}
      >
        <BuildPlanner />
      </div>

      {/* Mobile: natural document scroll (injected via globals.css media query) */}
      <style>{`
        @media (max-width: 767px) {
          .build-page-desktop {
            height: auto !important;
            overflow: visible !important;
            min-height: calc(100dvh - var(--nav-h) - var(--status-h));
          }
        }
      `}</style>
    </>
  )
}
