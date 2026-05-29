'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import CinematicHero from '@/components/hero/CinematicHero'

/* ─── Animation helpers ─────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

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
      {/* Atmospheric separator — replaces hard border-t */}
      <div className="section-sep" />
      {/* Optional per-section ambient glow */}
      {glow && <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...glow }} />}
      <div className="max-w-[1200px] mx-auto relative">{children}</div>
    </section>
  )
}

/* ─── Eyebrow + Section title ───────────────────────────────────────────── */
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
      <h2
        className="font-bebas text-[clamp(2.2rem,4vw,3.5rem)] text-[var(--text)] leading-none tracking-wide"
      >
        {title}
      </h2>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   2 — Features strip
   ══════════════════════════════════════════════════════════════════════════ */
const FEATURES = [
  {
    icon: '🗂️',
    title: 'BUILD PLANNER',
    desc:  'Configure your rig step by step with live compatibility checks.',
  },
  {
    icon: '🖥️',
    title: 'LIVE PREVIEW',
    desc:  'SVG vehicle visualization updates in real time as you add gear.',
  },
  {
    icon: '⚙️',
    title: 'GEAR SYSTEMS',
    desc:  '55+ compatibility-verified products across every overland category.',
  },
  {
    icon: '🔧',
    title: 'INSTALLER NETWORK',
    desc:  'Connect directly with certified shops in the RYKU partner network.',
  },
  {
    icon: '☁️',
    title: 'SAVED LOADOUTS',
    desc:  'Cloud-synced builds accessible anywhere. PRO members only.',
    pro: true,
  },
  {
    icon: '📦',
    title: 'SUPPLY DROPS',
    desc:  'Monthly PRO member giveaways featuring premium overland gear.',
    pro: true,
  },
]

function FeaturesStrip() {
  return (
    <Section id="features">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            className="card card-interactive p-6 flex flex-col gap-3"
            variants={fadeUp}
            custom={i * 0.07}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl" role="img" aria-label={f.title}>{f.icon}</span>
              {f.pro && (
                <span className="badge badge-cyan">PRO</span>
              )}
            </div>
            <h3 className="font-bebas text-[1.3rem] tracking-wider text-[var(--text)]">
              {f.title}
            </h3>
            <p className="font-rajdhani text-[0.875rem] text-[var(--text-2)] leading-snug">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
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
        <Link
          href="/contact"
          className="btn btn-outline"
          data-cta="contact-section"
        >
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
      <FeaturesStrip />
      <ContactSection />
    </>
  )
}
