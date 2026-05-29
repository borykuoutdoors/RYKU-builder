'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import CinematicHero from '@/components/hero/CinematicHero'
import ShineBorder from '@/components/ui/ShineBorder'
import BtnColorful from '@/components/ui/BtnColorful'

/* ─── Section wrapper ───────────────────────────────────────────────────── */
function Section({
  id,
  className = '',
  children,
  glow,
}: {
  id?: string
  className?: string
  children: React.ReactNode
  glow?: React.CSSProperties
}) {
  return (
    <section id={id} className={`relative py-20 px-6 ${className}`}>
      <div className="section-sep" />
      {glow && <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...glow }} />}
      <div className="max-w-[1200px] mx-auto relative">{children}</div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   2 — Why BŌRYKU
   ══════════════════════════════════════════════════════════════════════════ */

const WHY_CARDS = [
  {
    id:        'build',
    icon:      '⚙',
    eyebrow:   'BUILD PLANNER',
    title:     'BUILD YOUR RIG',
    desc:      'Plan your complete vehicle setup with compatibility checks, mission-based recommendations, budget tracking, and build management.',
    cta:       'START BUILDING',
    href:      '/build',
    featured:  false,
    badge:     null as null | string,
    accentBorder: 'rgba(255,85,31,0.14)',
  },
  {
    id:        'installers',
    icon:      '🧭',
    eyebrow:   'INSTALLER NETWORK',
    title:     'FIND INSTALLERS',
    desc:      'Connect with certified installers, request quotes, compare shops, and get your build completed professionally.',
    cta:       'FIND INSTALLERS',
    href:      '/installers',
    featured:  false,
    badge:     null as null | string,
    accentBorder: 'rgba(255,85,31,0.14)',
  },
  {
    id:        'pro',
    icon:      '👑',
    eyebrow:   'PRO BUILDER',
    title:     'GO PRO',
    desc:      'Unlock unlimited builds, cloud sync, priority support, premium tools, installer advantages, and exclusive member benefits.',
    cta:       'VIEW PRICING',
    href:      '/pricing',
    featured:  true,
    badge:     'MOST POPULAR',
    accentBorder: 'rgba(255,85,31,0.3)',
  },
]

function WhyCard({ card, index }: { card: typeof WHY_CARDS[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  const cardInner = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: card.featured
          ? 'linear-gradient(160deg, #130a05 0%, #1c1008 50%, var(--carbon) 100%)'
          : 'var(--carbon)',
        border: card.featured ? 'none' : `1px solid ${card.accentBorder}`,
        borderRadius: '6px',
        padding: card.featured ? '36px 32px 32px' : '32px',
        display: 'flex',
        flexDirection: 'column' as const,
        height: '100%',
        position: 'relative' as const,
        overflow: 'hidden' as const,
        transition: 'transform 0.24s ease, box-shadow 0.24s ease',
        transform: hovered && !card.featured ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered && !card.featured
          ? `0 14px 40px rgba(0,0,0,0.45), 0 0 0 1px ${card.accentBorder}`
          : hovered && card.featured
          ? '0 20px 60px rgba(255,85,31,0.12)'
          : 'none',
      }}
    >
      {/* Pro ambient glow bloom */}
      {card.featured && (
        <div style={{
          position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
          width: 380, height: 240, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,85,31,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          transition: 'opacity 0.24s ease',
          opacity: hovered ? 1.4 : 1,
        }} />
      )}

      {/* Eyebrow */}
      <div style={{ marginBottom: '22px', position: 'relative' }}>
        <span className="font-mono" style={{
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase' as const,
          color: card.featured ? 'var(--orange)' : 'rgba(255,255,255,0.38)',
        }}>
          {card.eyebrow}
        </span>
      </div>

      {/* Icon + Title */}
      <div style={{ marginBottom: '16px', position: 'relative' }}>
        <div style={{ fontSize: '32px', lineHeight: 1, marginBottom: '12px' }}>
          {card.icon}
        </div>
        <h3 className="font-bebas" style={{
          fontSize: 'clamp(28px, 3vw, 38px)',
          letterSpacing: '0.04em',
          lineHeight: 1,
          color: card.featured ? '#fff' : '#fff',
        }}>
          {card.title}
        </h3>
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        marginBottom: '20px',
        background: card.featured
          ? 'linear-gradient(to right, rgba(255,85,31,0.28), rgba(255,200,87,0.12), transparent)'
          : 'rgba(255,255,255,0.07)',
        position: 'relative',
      }} />

      {/* Description */}
      <p className="font-rajdhani" style={{
        fontSize: '15px',
        color: card.featured ? 'rgba(255,255,255,0.62)' : 'rgba(255,255,255,0.52)',
        lineHeight: 1.65,
        flex: 1,
        marginBottom: '28px',
        position: 'relative',
      }}>
        {card.desc}
      </p>

      {/* CTA */}
      <div style={{ position: 'relative' }}>
        <Link href={card.href} style={{ textDecoration: 'none', display: 'block' }}>
          <BtnColorful
            variant={card.featured ? 'primary' : 'secondary'}
            style={{ width: '100%', justifyContent: 'center' }}
            data-card={card.id}
            data-cta="homepage-why"
          >
            {card.cta} →
          </BtnColorful>
        </Link>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.52, delay: 0.08 + index * 0.13, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}
    >
      {/* Badge pill above Pro card */}
      {card.badge ? (
        <div style={{ textAlign: 'center', marginBottom: '10px', minHeight: '22px' }}>
          <span className="font-mono" style={{
            display: 'inline-block',
            fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
            padding: '4px 14px', borderRadius: '20px',
            background: 'linear-gradient(to right, #FF551F, #FFC857)',
            color: '#0d0704',
            boxShadow: '0 2px 14px rgba(255,85,31,0.35)',
          }}>
            {card.badge}
          </span>
        </div>
      ) : (
        <div style={{ minHeight: '22px', marginBottom: '10px' }} />
      )}

      {card.featured ? (
        <ShineBorder variant="featured" borderRadius={6} style={{ flex: 1 }}>
          {cardInner}
        </ShineBorder>
      ) : (
        <div style={{ flex: 1 }}>{cardInner}</div>
      )}
    </motion.div>
  )
}

function WhySection() {
  return (
    <Section id="why">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', marginBottom: '56px' }}
      >
        <p className="eyebrow" style={{ marginBottom: '12px' }}>THE PLATFORM</p>
        <h2 className="font-bebas" style={{
          fontSize: 'clamp(2.4rem, 5vw, 4rem)',
          letterSpacing: '0.04em',
          lineHeight: 0.95,
          color: '#fff',
          marginBottom: '16px',
        }}>
          WHY B<span style={{ fontFamily: 'inherit' }}>Ō</span>RYKU?
        </h2>
        <p className="font-rajdhani" style={{
          fontSize: '16px',
          color: 'rgba(255,255,255,0.38)',
          maxWidth: '480px',
          margin: '0 auto',
          lineHeight: 1.65,
        }}>
          Everything you need to plan, build, and manage your vehicle from one platform.
        </p>
      </motion.div>

      {/* Card grid */}
      <div
        className="why-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          alignItems: 'start',
          maxWidth: '1120px',
          margin: '0 auto',
        }}
      >
        {WHY_CARDS.map((card, i) => (
          <WhyCard key={card.id} card={card} index={i} />
        ))}
      </div>

      <style>{`
        @media (max-width: 860px) {
          .why-grid {
            grid-template-columns: 1fr !important;
            max-width: 480px;
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
    </Section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   3 — Contact preview section
   ══════════════════════════════════════════════════════════════════════════ */
const CONTACT_CARDS = [
  {
    type:  'General',
    icon:  '✉️',
    info:  'hello@boryku.com',
    desc:  'Platform questions, feedback, and general inquiries.',
  },
  {
    type:  'Build Consultation',
    icon:  '🗂️',
    info:  'builds@boryku.com',
    desc:  'Get expert guidance on your overland build configuration.',
  },
  {
    type:  'Installer Partnership',
    icon:  '🔧',
    info:  'installers@boryku.com',
    desc:  'Join the RYKU certified installer network.',
  },
  {
    type:  'Brand Partnership',
    icon:  '🤝',
    info:  'brands@boryku.com',
    desc:  'List your products on the BŌRYKU platform.',
  },
]

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

function SectionHeader({
  eyebrow,
  title,
  center = false,
}: {
  eyebrow: string
  title: string
  center?: boolean
}) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="font-bebas text-[clamp(2.2rem,4vw,3.5rem)] text-[var(--text)] leading-none tracking-wide">
        {title}
      </h2>
    </div>
  )
}

function ContactSection() {
  return (
    <Section id="contact">
      <SectionHeader eyebrow="CONTACT" title="GET IN TOUCH" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {CONTACT_CARDS.map((c, i) => (
          <motion.div
            key={c.type}
            className="card p-5 flex flex-col gap-3"
            variants={fadeUp}
            custom={i * 0.08}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <span className="text-xl" role="img" aria-label={c.type}>{c.icon}</span>
            <div>
              <h3 className="font-bebas text-[1rem] tracking-wider text-[var(--text)] mb-0.5">
                {c.type}
              </h3>
              <p className="font-mono text-[0.7rem] tracking-wide text-[var(--orange)] mb-2">
                {c.info}
              </p>
              <p className="font-rajdhani text-[0.8rem] text-[var(--text-3)] leading-snug">
                {c.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Link href="/contact" className="btn btn-outline" data-cta="contact-section">
          OPEN CONTACT FORM
        </Link>
      </div>
    </Section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <>
      <CinematicHero />
      <WhySection />
      <ContactSection />
    </>
  )
}
