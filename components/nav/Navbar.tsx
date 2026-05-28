'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useBuildStore } from '@/store/buildStore'
import ShopModal from '@/components/modals/ShopModal'

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

  const isHomepage = pathname === '/'

  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [shopOpen,     setShopOpen]     = useState(false)
  // Homepage: hidden until 70% of the cinematic scroll section
  // Other pages: always visible immediately
  const [navVisible,   setNavVisible]   = useState(!isHomepage)

  // Track scroll position to toggle .scrolled class
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // On homepage: hidden during loading screen, revealed via ryku:intro-complete event.
  // On other pages: always visible immediately.
  useEffect(() => {
    if (!isHomepage) {
      setNavVisible(true)
      return
    }
    const handler = () => setNavVisible(true)
    window.addEventListener('ryku:intro-complete', handler)
    return () => window.removeEventListener('ryku:intro-complete', handler)
  }, [isHomepage])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      {/* ── Main nav bar ───────────────────────────────────────────── */}
      <motion.nav
        className={`nav${scrolled ? ' scrolled' : ''}`}
        // On homepage: driven by scroll reveal (initial=false → animate is the starting state)
        // On other pages: classic slide-in from top on mount
        initial={isHomepage ? false : { y: -58, opacity: 0 }}
        animate={{
          y:       navVisible ? 0 : -72,
          opacity: navVisible ? 1 : 0,
        }}
        transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        style={{ pointerEvents: navVisible ? 'auto' : 'none' }}
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
          <Link href="/" aria-label="BŌRYKU home" style={{ display: 'flex', alignItems: 'center', gap: 12, lineHeight: 1, textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              {/* Flame icon — transparent PNG, no card, no blend mode */}
              <div style={{ filter: 'drop-shadow(0 0 10px rgba(255,85,31,0.50))', flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/ryku-logo-icon.png"
                  alt=""
                  aria-hidden="true"
                  style={{
                    display: 'block',
                    width: 38,
                    height: 38,
                    objectFit: 'contain',
                  }}
                />
              </div>
              {/* Wordmark */}
              <span style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '1.75rem',
                letterSpacing: '0.08em',
                color: '#fff',
                lineHeight: 1,
                textShadow: '0 1px 24px rgba(0,0,0,0.5)',
              }}>
                B<span style={{ color: 'var(--orange)' }}>Ō</span>RYKU
              </span>
            </motion.div>
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
                <span key={href}>
                  <Link
                    href={href}
                    style={{
                      fontFamily: 'var(--font-rajdhani)',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      letterSpacing: '0.18em',
                      color: isActive ? 'var(--orange)' : 'rgba(255,255,255,0.72)',
                      padding: '6px 10px',
                      transition: 'color 0.2s',
                      textShadow: '0 1px 12px rgba(0,0,0,0.6)',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = '#fff' }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.72)' }}
                  >
                    {isActive ? `[ ${label} ]` : label}
                  </Link>
                  {/* SHOP button — inserted immediately after GEAR */}
                  {label === 'GEAR' && (
                    <button
                      onClick={() => setShopOpen(true)}
                      data-action="nav-shop"
                      style={{
                        fontFamily: 'var(--font-rajdhani)',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        letterSpacing: '0.18em',
                        color: 'var(--orange)',
                        padding: '6px 10px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid transparent',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        transition: 'color 0.2s',
                        verticalAlign: 'middle',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--orange)' }}
                    >
                      SHOP
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 7,
                        letterSpacing: '0.1em',
                        background: 'var(--orange)',
                        color: '#000',
                        padding: '1px 4px',
                        borderRadius: 2,
                        fontWeight: 700,
                        lineHeight: 1.4,
                      }}>
                        SOON
                      </span>
                    </button>
                  )}
                </span>
              )
            })}
          </nav>

          {/* ── Right-side controls ───────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

            {/* MY BUILD pill — shown only when a vehicle is selected */}
            {vehicle && (
              <Link href="/my-build" aria-label="View your build" style={{ textDecoration: 'none' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="nav-build-badge"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5625rem',
                    letterSpacing: '0.14em',
                    color: 'var(--green)',
                    border: '1px solid rgba(155,191,106,0.3)',
                    background: 'rgba(155,191,106,0.07)',
                    padding: '5px 11px',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    borderRadius: 2,
                    cursor: 'pointer',
                  }}
                  whileHover={{ background: 'rgba(155,191,106,0.14)', borderColor: 'rgba(155,191,106,0.5)' }}
                  transition={{ duration: 0.15 }}
                >
                  <span style={{
                    display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
                    background: 'var(--green)',
                    boxShadow: '0 0 6px rgba(155,191,106,0.7)',
                    flexShrink: 0,
                  }} />
                  MY BUILD
                </motion.div>
              </Link>
            )}

            {/* Auth buttons — always visible */}
            <motion.div
              className="nav-auth-btns"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Link href="/login" aria-label="Log in to your account" data-action="nav-login">
                <motion.button
                  whileHover={{ color: '#fff' }}
                  transition={{ duration: 0.15 }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.52)',
                    fontFamily: 'var(--font-rajdhani)',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    letterSpacing: '0.16em',
                    padding: '7px 12px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    textShadow: '0 1px 12px rgba(0,0,0,0.6)',
                  }}
                >
                  LOG IN
                </motion.button>
              </Link>

              <Link href="/signup" aria-label="Create a free account" data-action="nav-signup">
                <motion.button
                  whileHover={{ color: '#fff' }}
                  transition={{ duration: 0.15 }}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,85,31,0.45)',
                    color: 'var(--orange)',
                    fontFamily: 'var(--font-rajdhani)',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    letterSpacing: '0.16em',
                    padding: '7px 14px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    borderRadius: 2,
                    whiteSpace: 'nowrap',
                  }}
                >
                  SIGN UP
                </motion.button>
              </Link>
            </motion.div>

            {/* START BUILD button */}
            <Link href="/build" aria-label="Start your build" className="nav-start-build">
              <button
                className="btn btn-primary"
                style={{ fontSize: '0.72rem', padding: '9px 18px' }}
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
                <span key={href}>
                  <Link
                    href={href}
                    style={{
                      display: 'block',
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
                  {label === 'GEAR' && (
                    <button
                      onClick={() => { setShopOpen(true); setMobileOpen(false) }}
                      data-action="mobile-shop"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--border-subtle)',
                        fontFamily: 'var(--font-rajdhani)',
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        letterSpacing: '0.2em',
                        color: 'var(--orange)',
                        padding: '12px 0',
                        cursor: 'pointer',
                        textAlign: 'left',
                        textTransform: 'uppercase',
                      }}
                    >
                      SHOP
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 8,
                        letterSpacing: '0.1em',
                        background: 'var(--orange)',
                        color: '#000',
                        padding: '1px 5px',
                        borderRadius: 2,
                        fontWeight: 700,
                      }}>
                        SOON
                      </span>
                    </button>
                  )}
                </span>
              )
            })}

            {/* Auth row */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <Link href="/login" style={{ flex: 1 }} data-action="mobile-login">
                <button
                  style={{
                    width: '100%', background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.6)',
                    fontFamily: 'var(--font-rajdhani)', fontWeight: 700,
                    fontSize: '0.875rem', letterSpacing: '0.16em',
                    padding: '11px 0', cursor: 'pointer', textTransform: 'uppercase', borderRadius: 2,
                  }}
                >
                  LOG IN
                </button>
              </Link>
              <Link href="/signup" style={{ flex: 1 }} data-action="mobile-signup">
                <button
                  style={{
                    width: '100%', background: 'rgba(255,85,31,0.08)',
                    border: '1px solid rgba(255,85,31,0.4)',
                    color: 'var(--orange)',
                    fontFamily: 'var(--font-rajdhani)', fontWeight: 700,
                    fontSize: '0.875rem', letterSpacing: '0.16em',
                    padding: '11px 0', cursor: 'pointer', textTransform: 'uppercase', borderRadius: 2,
                  }}
                >
                  SIGN UP
                </button>
              </Link>
            </div>

            <Link href="/build" style={{ marginTop: '8px' }}>
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

      {/* ── Shop coming-soon modal ─────────────────────────────────── */}
      <ShopModal isOpen={shopOpen} onClose={() => setShopOpen(false)} />

      {/* ── Responsive styles injected as a style tag ─────────────── */}
      <style>{`
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (min-width: 861px) {
          .mobile-menu { display: none !important; }
        }
        /* Hide START BUILD text label on medium screens to give auth buttons room */
        @media (max-width: 1020px) and (min-width: 861px) {
          .nav-start-build .btn-primary { padding: 9px 14px !important; font-size: 0.68rem !important; }
          .nav-auth-btns button { padding: 7px 10px !important; font-size: 0.68rem !important; }
        }
        /* Hide build badge on very tight screens */
        @media (max-width: 920px) and (min-width: 861px) {
          .nav-build-badge { display: none !important; }
        }
      `}</style>
    </>
  )
}
