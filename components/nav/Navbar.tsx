'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useBuildStore } from '@/store/buildStore'

const NAV_LINKS = [
  { label: 'HOME',       href: '/' },
  { label: 'BUILDS',     href: '/builds' },
  { label: 'GEAR',       href: '/gear' },
  { label: 'INSTALLERS', href: '/installers' },
  { label: 'ABOUT',      href: '/about' },
  { label: 'CONTACT',    href: '/contact' },
]

export default function Navbar() {
  const pathname   = usePathname()
  const vehicle    = useBuildStore(s => s.vehicle)
  const buildName  = useBuildStore(s => s.buildName)

  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)

  // Track scroll position to toggle .scrolled class
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      {/* ── Main nav bar ───────────────────────────────────────────── */}
      <motion.nav
        className={`nav${scrolled ? ' scrolled' : ''}`}
        initial={{ y: -58, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        role="navigation"
        aria-label="Primary navigation"
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          padding: '0 24px',
          maxWidth: '1440px',
          margin: '0 auto',
        }}>

          {/* ── Logo ─────────────────────────────────────────────── */}
          <Link href="/" aria-label="BŌRYKU home" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: '1.75rem',
              letterSpacing: '0.08em',
              color: 'var(--text)',
            }}>
              B<span style={{ color: 'var(--orange)' }}>Ō</span>RYKU
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.3em',
              color: 'var(--text-3)',
              marginTop: '-2px',
            }}>
              RYKU
            </span>
          </Link>

          {/* ── Desktop nav links ─────────────────────────────────── */}
          <nav
            aria-label="Site links"
            style={{
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
            }}
            className="desktop-nav"
          >
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontFamily: 'var(--font-rajdhani)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    letterSpacing: '0.18em',
                    color: isActive ? 'var(--orange)' : 'var(--text-2)',
                    padding: '6px 12px',
                    transition: 'color 0.2s',
                    borderBottom: isActive ? '1px solid var(--orange)' : '1px solid transparent',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)' }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-2)' }}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* ── Right-side controls ───────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

            {/* Build badge — shown only when a vehicle is selected */}
            {vehicle && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.16em',
                  color: 'var(--cyan)',
                  border: '1px solid rgba(102,255,255,0.25)',
                  background: 'rgba(102,255,255,0.06)',
                  padding: '4px 10px',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {buildName || vehicle.name}
              </motion.div>
            )}

            {/* START BUILD button */}
            <Link href="/build" aria-label="Start your build">
              <button
                className="btn btn-primary"
                style={{ fontSize: '0.75rem', padding: '9px 20px' }}
                data-action="start-build"
              >
                START BUILD
              </button>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="hamburger-btn"
              data-action="toggle-mobile-menu"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(v => !v)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                display: 'none',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  style={{
                    display: 'block',
                    width: '22px',
                    height: '2px',
                    background: mobileOpen
                      ? i === 1 ? 'transparent' : 'var(--orange)'
                      : 'var(--text-2)',
                    transform: mobileOpen
                      ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                      : i === 2 ? 'rotate(-45deg) translate(5px, -5px)'
                      : 'none'
                      : 'none',
                    transition: 'all 0.25s ease',
                    transformOrigin: 'center',
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile slide-down menu ──────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mobile-menu"
            style={{
              position: 'fixed',
              top: 'var(--nav-h)',
              left: 0,
              right: 0,
              background: 'rgba(5,5,5,0.97)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border)',
              zIndex: 99,
              padding: '16px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontFamily: 'var(--font-rajdhani)',
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    letterSpacing: '0.2em',
                    color: isActive ? 'var(--orange)' : 'var(--text-2)',
                    padding: '12px 0',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  {label}
                </Link>
              )
            })}
            <Link href="/build" style={{ marginTop: '16px' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                data-action="start-build-mobile"
              >
                START BUILD
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Responsive styles injected as a style tag ─────────────── */}
      <style>{`
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (min-width: 861px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </>
  )
}
