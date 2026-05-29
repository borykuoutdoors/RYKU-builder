'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import BtnColorful from '@/components/ui/BtnColorful'

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_COLUMNS = [
  {
    heading: 'PLATFORM',
    links: [
      { label: 'Home',       href: '/' },
      { label: 'Builds',     href: '/builds' },
      { label: 'Gear',       href: '/gear' },
      { label: 'Installers', href: '/installers' },
      { label: 'Pricing',    href: '/pricing' },
      { label: 'Dashboard',  href: '/dashboard' },
    ],
  },
  {
    heading: 'RESOURCES',
    links: [
      { label: 'Build Planner',        href: '/build' },
      { label: 'Compatibility Center', href: '/build' },
      { label: 'FAQs',                 href: '/contact' },
      { label: 'Support',              href: '/contact' },
      { label: 'Guides',               href: '/builds' },
    ],
  },
  {
    heading: 'COMMUNITY',
    links: [
      { label: 'Community Builds',    href: '/builds' },
      { label: 'Build of the Month',  href: '/builds' },
      { label: 'Featured Builders',   href: '/builds' },
      { label: 'Monthly Supply Drop', href: '/pricing' },
      { label: 'Partner Program',     href: '/about' },
    ],
  },
  {
    heading: 'COMPANY',
    links: [
      { label: 'About BŌRYKU',    href: '/about' },
      { label: 'Contact',          href: '/contact' },
      { label: 'Privacy Policy',   href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
]

const SOCIAL = [
  {
    id: 'instagram', label: 'Instagram', href: '#',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: 'youtube', label: 'YouTube', href: '#',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: 'x', label: 'X', href: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    id: 'facebook', label: 'Facebook', href: '#',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function SocialIcon({ label, href, icon }: { label: string; href: string; icon: React.ReactNode }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={href}
      aria-label={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 36, height: 36,
        background: hov ? 'rgba(255,85,31,0.1)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hov ? 'rgba(255,85,31,0.42)' : 'rgba(255,255,255,0.09)'}`,
        borderRadius: '4px',
        color: hov ? '#FF551F' : 'rgba(255,255,255,0.42)',
        transition: 'all 0.18s',
        textDecoration: 'none',
        boxShadow: hov ? '0 0 12px rgba(255,85,31,0.18)' : 'none',
      }}
    >
      {icon}
    </a>
  )
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const [hov, setHov] = useState(false)
  return (
    <Link
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'block',
        fontFamily: 'var(--font-tactical)',
        fontSize: '14px',
        color: hov ? 'rgba(255,85,31,0.85)' : 'rgba(255,255,255,0.46)',
        textDecoration: 'none',
        transform: hov ? 'translateX(3px)' : 'translateX(0)',
        transition: 'color 0.18s, transform 0.18s',
        lineHeight: 1.4,
      }}
    >
      {label}
    </Link>
  )
}

function NewsletterForm() {
  const [email,     setEmail]     = useState('')
  const [focused,   setFocused]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) return
    setSubmitted(true)
    // TODO: wire to Supabase / Mailchimp
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 18px',
          background: 'rgba(34,197,94,0.07)',
          border: '1px solid rgba(34,197,94,0.24)',
          borderRadius: '4px',
        }}
      >
        <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: 'rgba(34,197,94,0.14)', border: '1px solid rgba(34,197,94,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#22c55e', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2px' }}>MISSION JOINED</div>
          <div style={{ fontFamily: 'var(--font-tactical)', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>You&apos;re on the list. Stay ready.</div>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            background: focused ? 'rgba(255,85,31,0.05)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${focused ? 'rgba(255,85,31,0.48)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '4px',
            color: '#fff',
            fontFamily: 'var(--font-tactical)',
            fontSize: '15px',
            padding: '11px 14px',
            outline: 'none',
            transition: 'border-color 0.22s, background 0.22s, box-shadow 0.22s',
            boxShadow: focused ? '0 0 0 3px rgba(255,85,31,0.08)' : 'none',
            minWidth: 0,
          }}
        />
        <BtnColorful
          type="submit"
          variant="primary"
          style={{ flexShrink: 0, padding: '11px 18px', fontSize: '0.72rem', letterSpacing: '0.14em', whiteSpace: 'nowrap' }}
        >
          JOIN THE MISSION
        </BtnColorful>
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
        NO SPAM · UNSUBSCRIBE ANYTIME · FREE FOREVER
      </p>
    </form>
  )
}

// ─── SiteFooter ───────────────────────────────────────────────────────────────

export default function SiteFooter() {
  const ref     = useRef<HTMLElement>(null)
  const inView  = useInView(ref, { once: true, margin: '-60px' })

  return (
    <footer
      ref={ref}
      style={{
        background: 'rgba(5,7,14,0.94)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        borderTop: '1px solid rgba(255,85,31,0.10)',
        paddingBottom: 'var(--status-h)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top gradient separator */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(to right, transparent 0%, rgba(255,85,31,0.45) 25%, rgba(255,200,87,0.35) 50%, rgba(255,85,31,0.45) 75%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(102,255,255,0.010) 1px,transparent 1px),linear-gradient(90deg,rgba(102,255,255,0.010) 1px,transparent 1px)',
        backgroundSize: '80px 80px',
        opacity: 0.6,
      }} />

      {/* Ambient top glow */}
      <div style={{
        position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 280, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,85,31,0.065) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Main grid ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(52px,7vh,80px) clamp(20px,4vw,48px) 0', position: 'relative', zIndex: 1 }}>
        <div
          className="footer-main"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.55fr',
            gap: 'clamp(40px,6vw,80px)',
            alignItems: 'start',
          }}
        >

          {/* ── LEFT: Brand + Social + Newsletter ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
          >
            {/* Brand block */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ filter: 'drop-shadow(0 0 12px rgba(255,85,31,0.44))' }}>
                  <Image src="/brand/mark.png" alt="BŌRYKU" width={30} height={30} style={{ objectFit: 'contain' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.08em', color: '#fff', lineHeight: 1 }}>
                  B<span style={{ color: '#FF551F' }}>Ō</span>RYKU
                </span>
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,85,31,0.55)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '12px' }}>
                CONTROL THE CHAOS
              </div>

              <p style={{ fontFamily: 'var(--font-tactical)', fontSize: '14px', color: 'rgba(255,255,255,0.34)', lineHeight: 1.65, maxWidth: '300px', margin: 0 }}>
                Mission-based vehicle planning, premium gear systems, installer discovery, and community-driven overland builds.
              </p>
            </div>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {SOCIAL.map(s => <SocialIcon key={s.id} label={s.label} href={s.href} icon={s.icon} />)}
            </div>

            {/* Newsletter block */}
            <div>
              {/* Section label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  NEWSLETTER
                </span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              </div>

              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '0.06em', color: '#fff', marginBottom: '6px' }}>
                JOIN THE MISSION
              </div>
              <p style={{ fontFamily: 'var(--font-tactical)', fontSize: '13px', color: 'rgba(255,255,255,0.34)', lineHeight: 1.6, margin: '0 0 16px' }}>
                Build inspiration, product launches, installer picks, community highlights, and exclusive BŌRYKU updates.
              </p>
              <NewsletterForm />
            </div>
          </motion.div>

          {/* ── RIGHT: Nav columns ────────────────────────────────── */}
          <div
            className="footer-columns"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'clamp(16px,3vw,28px)',
            }}
          >
            {NAV_COLUMNS.map((col, i) => (
              <motion.div
                key={col.heading}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.48, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'rgba(255,255,255,0.22)',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                }}>
                  {col.heading}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.links.map(link => (
                    <FooterLink key={link.label} href={link.href} label={link.label} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.45 }}
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            marginTop: '52px',
            padding: '20px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
            © 2026 BŌRYKU. All Rights Reserved.
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em', fontStyle: 'italic' }}>
            Built for those who refuse the ordinary.
          </span>
        </motion.div>
      </div>

      {/* ── Responsive ──────────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 920px) {
          .footer-main    { grid-template-columns: 1fr !important; gap: 44px !important; }
          .footer-columns { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .footer-columns { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
        }
        footer input::placeholder { color: rgba(255,255,255,0.22); }
      `}</style>
    </footer>
  )
}
