'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useBuildStore } from '@/store/buildStore'
import ShopModal from '@/components/modals/ShopModal'
import BtnColorful from '@/components/ui/BtnColorful'

/* ─── Nav links ─────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'HOME',       href: '/' },
  { label: 'BUILDS',     href: '/builds' },
  { label: 'GEAR',       href: '/gear' },
  { label: 'INSTALLERS', href: '/installers' },
  { label: 'PRICING',    href: '/pricing' },
  { label: 'ABOUT',      href: '/about' },
  { label: 'CONTACT',    href: '/contact' },
]

/* ─── Premium menu toggle icon ──────────────────────────────────────────── */
function MenuToggleIcon({ open, hovered }: { open: boolean; hovered: boolean }) {
  const showRing = open || hovered

  return (
    <div style={{
      width: 40, height: 40,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', flexShrink: 0,
    }}>
      {/* Aiming reticle ring */}
      <motion.div
        aria-hidden="true"
        animate={{
          opacity:  showRing ? 1 : 0,
          scale:    showRing ? 1 : 0.62,
        }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position:     'absolute',
          inset:        0,
          borderRadius: '50%',
          border:       `1px solid ${open ? 'rgba(255,85,31,0.58)' : 'rgba(255,85,31,0.35)'}`,
          background:   open ? 'rgba(255,85,31,0.07)' : 'transparent',
          transition:   'border-color 0.22s, background 0.22s',
          pointerEvents:'none',
        }}
      />

      {/* SVG morph — asymmetric hamburger → precise X */}
      <svg
        width="20" height="12"
        viewBox="0 0 20 12"
        fill="none"
        aria-hidden="true"
        style={{
          filter:     open ? 'drop-shadow(0 0 5px rgba(255,85,31,0.62))' : 'none',
          transition: 'filter 0.26s',
          flexShrink: 0,
        }}
      >
        {/* Line 1 — top (full) → first arm of X */}
        <motion.line
          x1={0} y1={1} x2={20} y2={1}
          animate={open
            ? { x1: 1, y1: 1, x2: 19, y2: 11, stroke: '#FF551F' }
            : { x1: 0, y1: 1, x2: 20, y2: 1,  stroke: 'rgba(255,255,255,0.80)' }
          }
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Line 2 — middle, offset-shorter (asymmetric = premium) → fades */}
        <motion.line
          x1={3} y1={6} x2={20} y2={6}
          animate={open
            ? { x1: 10, y1: 6, x2: 10, y2: 6, opacity: 0, stroke: '#FF551F' }
            : { x1: 3,  y1: 6, x2: 20, y2: 6, opacity: 1, stroke: 'rgba(255,255,255,0.80)' }
          }
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Line 3 — bottom, shorter still (stepped) → second arm of X */}
        <motion.line
          x1={0} y1={11} x2={14} y2={11}
          animate={open
            ? { x1: 19, y1: 1, x2: 1, y2: 11, stroke: '#FF551F' }
            : { x1: 0,  y1: 11, x2: 14, y2: 11, stroke: 'rgba(255,255,255,0.80)' }
          }
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Center pulse dot — active system indicator */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.20, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
            style={{
              position:     'absolute',
              width:         4,
              height:        4,
              borderRadius: '50%',
              background:   '#FF551F',
              boxShadow:    '0 0 8px rgba(255,85,31,0.85)',
              pointerEvents:'none',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Active-link underline indicator ──────────────────────────────────── */
function NavLink({
  href,
  label,
  isActive,
  isShop,
  onShopClick,
}: {
  href?: string
  label: string
  isActive: boolean
  isShop?: boolean
  onShopClick?: () => void
}) {
  const [hovered, setHovered] = useState(false)

  const textColor = isActive
    ? '#FF551F'
    : hovered
    ? '#fff'
    : 'rgba(255,255,255,0.60)'

  const sharedStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
    fontFamily: 'var(--font-mono)',
    fontWeight: 400,
    fontSize: '0.68rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    padding: '6px 14px',
    color: textColor,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.18s',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    lineHeight: 1.2,
  }

  const indicator = (
    <motion.span
      style={{
        position: 'absolute',
        bottom: 2,
        left: '50%',
        translateX: '-50%',
        height: 1,
        background: isActive
          ? 'linear-gradient(to right, #FF551F, #FFC857)'
          : 'rgba(255,85,31,0.6)',
        borderRadius: 1,
        pointerEvents: 'none',
      }}
      initial={false}
      animate={{ width: isActive ? '60%' : hovered ? '40%' : 0, opacity: isActive || hovered ? 1 : 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    />
  )

  if (isShop) {
    return (
      <button
        onClick={onShopClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={sharedStyle}
        data-action="nav-shop"
      >
        {label}
        <span style={{
          marginLeft: 4,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.48rem',
          letterSpacing: '0.10em',
          background: 'rgba(255,85,31,0.18)',
          color: '#FF551F',
          border: '1px solid rgba(255,85,31,0.35)',
          padding: '1px 4px',
          borderRadius: 2,
          lineHeight: 1.4,
          verticalAlign: 'middle',
        }}>
          SOON
        </span>
        {indicator}
      </button>
    )
  }

  return (
    <Link
      href={href!}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={sharedStyle}
    >
      {label}
      {indicator}
    </Link>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main Navbar
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Navbar() {
  const pathname  = usePathname()
  const vehicle   = useBuildStore(s => s.vehicle)

  const isHomepage = pathname === '/'

  const [scrolled,         setScrolled]         = useState(false)
  const [mobileOpen,       setMobileOpen]       = useState(false)
  const [shopOpen,         setShopOpen]         = useState(false)
  const [hamburgerHovered, setHamburgerHovered] = useState(false)

  /* scroll → scrolled state */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* close mobile menu on navigation */
  useEffect(() => { setMobileOpen(false) }, [pathname])

  /* ── Border & bg driven by scrolled state ──────────────────────────── */
  const navBg          = scrolled ? 'rgba(4,4,4,0.90)'         : 'transparent'
  const navBorder      = scrolled ? 'rgba(255,255,255,0.07)'   : 'transparent'
  const navBlur        = scrolled ? 'blur(28px)'               : 'blur(0px)'

  return (
    <>
      {/* ── Main nav ──────────────────────────────────────────────────── */}
      <motion.nav
        role="navigation"
        aria-label="Primary navigation"
        initial={{ opacity: 0, y: isHomepage ? 0 : -68 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1], delay: isHomepage ? 0.1 : 0 }}
        style={{
          position:         'fixed',
          top: 0, left: 0, right: 0,
          height:           'var(--nav-h)',
          zIndex:           30,
          background:       navBg,
          borderBottom:     `1px solid ${navBorder}`,
          backdropFilter:   navBlur,
          WebkitBackdropFilter: navBlur,
          transition:       'background 0.38s ease, border-color 0.38s ease, backdrop-filter 0.38s ease',
        }}
      >
        {/* ── Inner: 3-column grid — logo | links | actions ────────── */}
        <div style={{
          display:       'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems:    'center',
          height:        '100%',
          padding:       '0 28px',
          maxWidth:      '1440px',
          margin:        '0 auto',
          gap:           16,
        }}>

          {/* COL 1 — Logo ─────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link
              href="/"
              aria-label="BŌRYKU home"
              style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', lineHeight: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <div style={{
                  filter: `drop-shadow(0 0 ${scrolled ? 18 : 10}px rgba(255,85,31,${scrolled ? 0.60 : 0.45}))`,
                  transition: 'filter 0.4s ease',
                  flexShrink: 0,
                }}>
                  <Image
                    src="/brand/mark.png"
                    alt=""
                    aria-hidden="true"
                    width={44}
                    height={44}
                    priority
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </motion.div>
            </Link>
          </div>

          {/* COL 2 — Center nav links ─────────────────────────────── */}
          <nav
            className="desktop-nav"
            aria-label="Site links"
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        6,
            }}
          >
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
              return (
                <NavLink
                  key={href}
                  href={href}
                  label={label}
                  isActive={isActive}
                />
              )
            })}
            {/* SHOP — after GEAR */}
            <NavLink
              label="SHOP"
              isActive={false}
              isShop
              onShopClick={() => setShopOpen(true)}
            />
          </nav>

          {/* COL 3 — Right actions ────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>

            {/* MY BUILD badge — visible when vehicle selected */}
            <AnimatePresence>
              {vehicle && (
                <motion.div
                  key="build-badge"
                  initial={{ opacity: 0, scale: 0.82, x: 8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.82, x: 8 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="nav-build-badge"
                >
                  <Link href="/my-build" aria-label="View your build" style={{ textDecoration: 'none' }}>
                    <motion.div
                      whileHover={{
                        background: 'rgba(255,85,31,0.16)',
                        borderColor: 'rgba(255,85,31,0.80)',
                        boxShadow:   '0 0 20px rgba(255,85,31,0.36)',
                      }}
                      transition={{ duration: 0.15 }}
                      style={{
                        display:     'inline-flex',
                        alignItems:  'center',
                        gap:         6,
                        fontFamily:  'var(--font-mono)',
                        fontSize:    '0.5rem',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color:       '#fff',
                        border:      '1px solid rgba(255,85,31,0.50)',
                        background:  'rgba(255,85,31,0.08)',
                        padding:     '5px 12px',
                        borderRadius: 20,
                        whiteSpace:  'nowrap',
                        cursor:      'pointer',
                        boxShadow:   '0 0 12px rgba(255,85,31,0.22)',
                      }}
                    >
                      <span style={{
                        display:      'inline-block',
                        width: 5, height: 5,
                        borderRadius: '50%',
                        background:   '#FF551F',
                        boxShadow:    '0 0 7px rgba(255,85,31,0.9)',
                        flexShrink:   0,
                      }} />
                      MY BUILD
                    </motion.div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop auth row — hidden on mobile */}
            <div className="nav-auth-row desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link href="/login" aria-label="Log in" data-action="nav-login" style={{ textDecoration: 'none' }}>
                <BtnColorful
                  variant="secondary"
                  style={{ padding: '8px 16px', fontSize: '0.62rem', letterSpacing: '0.16em', whiteSpace: 'nowrap' }}
                >
                  LOG IN TO BŌRYKU
                </BtnColorful>
              </Link>
            </div>

            {/* Hamburger — mobile only */}
            <button
              className="hamburger-btn"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              data-action="toggle-mobile-menu"
              onClick={() => setMobileOpen(v => !v)}
              onMouseEnter={() => setHamburgerHovered(true)}
              onMouseLeave={() => setHamburgerHovered(false)}
              style={{
                background: 'none',
                border:     'none',
                cursor:     'pointer',
                padding:    '4px',
                display:    'none',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
              }}
            >
              <MenuToggleIcon open={mobileOpen} hovered={hamburgerHovered} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile slide-down menu ───────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mobile-menu"
            style={{
              position:       'fixed',
              top:            'var(--nav-h)',
              left: 0, right: 0,
              zIndex:         29,
              background:     'rgba(4,4,4,0.97)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              borderBottom:   '1px solid rgba(255,85,31,0.12)',
              padding:        '8px 0 24px',
            }}
          >
            {/* Scan-line accent */}
            <div style={{
              position:   'absolute',
              top: 0, left: 0, right: 0,
              height:     1,
              background: 'linear-gradient(to right, transparent, rgba(255,85,31,0.5) 40%, rgba(255,200,87,0.4) 60%, transparent)',
              pointerEvents: 'none',
            }} />

            {/* Nav links with stagger */}
            <div style={{ padding: '4px 0' }}>
              {NAV_LINKS.map(({ label, href }, i) => {
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, delay: i * 0.045, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={href}
                      style={{
                        display:       'flex',
                        alignItems:    'center',
                        justifyContent:'space-between',
                        padding:       '13px 28px',
                        fontFamily:    'var(--font-mono)',
                        fontSize:      '0.72rem',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color:         isActive ? '#FF551F' : 'rgba(255,255,255,0.70)',
                        textDecoration:'none',
                        borderBottom:  '1px solid rgba(255,255,255,0.04)',
                        transition:    'color 0.15s, background 0.15s',
                        background:    isActive ? 'rgba(255,85,31,0.04)' : 'transparent',
                      }}
                    >
                      <span>{label}</span>
                      {isActive && (
                        <span style={{
                          width: 4, height: 4, borderRadius: '50%',
                          background: '#FF551F',
                          boxShadow: '0 0 8px rgba(255,85,31,0.8)',
                          flexShrink: 0,
                        }} />
                      )}
                    </Link>
                  </motion.div>
                )
              })}

              {/* SHOP row */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22, delay: NAV_LINKS.length * 0.045, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  onClick={() => { setShopOpen(true); setMobileOpen(false) }}
                  data-action="mobile-shop"
                  style={{
                    display:       'flex',
                    alignItems:    'center',
                    justifyContent:'space-between',
                    width:         '100%',
                    padding:       '13px 28px',
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '0.72rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color:         '#FF551F',
                    background:    'transparent',
                    border:        'none',
                    borderBottom:  '1px solid rgba(255,255,255,0.04)',
                    cursor:        'pointer',
                    textAlign:     'left',
                  }}
                >
                  <span>SHOP</span>
                  <span style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '0.48rem',
                    letterSpacing: '0.10em',
                    background:    'rgba(255,85,31,0.18)',
                    color:         '#FF551F',
                    border:        '1px solid rgba(255,85,31,0.35)',
                    padding:       '2px 5px',
                    borderRadius:  2,
                  }}>
                    SOON
                  </span>
                </button>
              </motion.div>
            </div>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, delay: (NAV_LINKS.length + 1) * 0.045, ease: [0.16, 1, 0.3, 1] }}
              style={{
                padding:  '16px 24px 0',
                display:  'flex',
                flexDirection: 'column',
                gap:      8,
              }}
            >
              <Link href="/login" data-action="mobile-login" style={{ textDecoration: 'none', display: 'block' }}>
                <BtnColorful
                  variant="secondary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 20px' }}
                >
                  LOG IN TO BŌRYKU
                </BtnColorful>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Shop modal ──────────────────────────────────────────────────── */}
      <ShopModal isOpen={shopOpen} onClose={() => setShopOpen(false)} />

      {/* ── Responsive breakpoints ──────────────────────────────────────── */}
      <style>{`
        /* ≤860 → hamburger, hide center nav and auth row */
        @media (max-width: 860px) {
          .desktop-nav   { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        /* ≥861 → always show desktop nav, always hide mobile menu */
        @media (min-width: 861px) {
          .mobile-menu   { display: none !important; }
          .hamburger-btn { display: none !important; }
        }
        /* 861–1060: tighten CTAs */
        @media (max-width: 1060px) and (min-width: 861px) {
          .nav-auth-row a { font-size: 0.58rem !important; }
          .nav-build-badge { display: none !important; }
        }
      `}</style>
    </>
  )
}
