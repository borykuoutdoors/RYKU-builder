'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import HeroSection from '@/components/hero/HeroSection'
import { MISSIONS } from '@/data/missions'
import { CATEGORIES } from '@/data/products'

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
}: {
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={`relative py-20 px-6 ${className}`}
    >
      <div className="max-w-[1200px] mx-auto">{children}</div>
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
    <Section id="features" className="border-t border-[var(--border)]">
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
   3 — Missions section
   ══════════════════════════════════════════════════════════════════════════ */
function MissionsSection() {
  return (
    <Section
      id="missions"
      className="border-t border-[var(--border)] bg-[var(--carbon)] bg-opacity-40"
    >
      <SectionHeader eyebrow="MISSION PROFILES" title="CHOOSE YOUR MISSION" center />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {MISSIONS.map((m, i) => (
          <motion.div
            key={m.id}
            className="mission-card"
            data-mission={m.id}
            variants={fadeUp}
            custom={i * 0.06}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <div className="text-3xl mb-3" role="img" aria-label={m.name}>
              {m.icon}
            </div>
            <h3 className="font-bebas text-[1.1rem] tracking-wider text-[var(--text)] mb-1">
              {m.name}
            </h3>
            <p className="font-rajdhani text-[0.8rem] text-[var(--text-3)] leading-snug">
              {m.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   4 — Gear section
   ══════════════════════════════════════════════════════════════════════════ */
const BRANDS = [
  'ARB', 'FRONT RUNNER', 'WARN', 'iKAMPER', 'FOX', 'ICON',
  'BAJA DESIGNS', 'RIGID INDUSTRIES', 'MAXTRAX', 'METHOD', 'FALKEN',
  'BF GOODRICH', 'ROOFNEST', 'DECKED', 'GOAL ZERO', 'GARMIN',
]

// Only show the 6 gear-focused categories from CATEGORIES
const GEAR_CATS = ['Suspension', 'Roof Racks', 'Rooftop Tents', 'Lighting', 'Recovery', 'Wheels & Tires']

function GearSection() {
  const gearCategories = CATEGORIES.filter(c => GEAR_CATS.includes(c.id))
  // duplicate for seamless marquee
  const marqueeItems = [...BRANDS, ...BRANDS]

  return (
    <Section id="gear" className="border-t border-[var(--border)]">
      <SectionHeader eyebrow="GEAR SYSTEMS" title="PREMIUM OVERLAND GEAR" />

      {/* Brand marquee */}
      <div
        className="overflow-hidden mb-12 py-4 border-y border-[var(--border-subtle)]"
        aria-label="Partner brands"
      >
        <div className="marquee-track gap-0">
          {marqueeItems.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="font-mono text-[0.6875rem] tracking-[0.22em] text-[var(--text-3)] uppercase px-8 shrink-0 border-r border-[var(--border-subtle)] last:border-r-0"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Gear category cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {gearCategories.map((cat, i) => (
          <motion.div
            key={cat.id}
            variants={fadeUp}
            custom={i * 0.07}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <Link
              href="/gear"
              className="card card-interactive p-6 flex flex-col gap-2 group block"
              data-category={cat.id}
            >
              <span className="text-2xl" role="img" aria-label={cat.label}>{cat.emoji}</span>
              <h3 className="font-bebas text-[1.2rem] tracking-wider text-[var(--text)] group-hover:text-[var(--orange)] transition-colors">
                {cat.label}
              </h3>
              <span
                className="font-mono text-[0.625rem] tracking-[0.14em] uppercase"
                style={{ color: 'var(--text-3)' }}
              >
                VIEW PRODUCTS →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   5 — About / CTA / Plans section
   ══════════════════════════════════════════════════════════════════════════ */
const PLANS = [
  {
    tier: 'FREE',
    price: '$0',
    period: 'forever',
    color: 'var(--text-2)',
    borderColor: 'rgba(255,255,255,0.08)',
    features: [
      'Build planner (1 active build)',
      '55+ compatible products',
      'Vehicle platform selector',
      'Mission profile selection',
      'Installer network directory',
    ],
  },
  {
    tier: 'PRO',
    price: '$9',
    period: '/ month',
    color: 'var(--orange)',
    borderColor: 'rgba(255,85,31,0.35)',
    highlight: true,
    features: [
      'Unlimited saved loadouts',
      'Cloud sync across devices',
      'Priority installer quotes',
      'Monthly supply drops',
      'Early access to new gear',
      'Build cost analytics',
    ],
  },
]

function AboutSection() {
  return (
    <Section
      id="about"
      className="border-t border-[var(--border)] bg-[var(--carbon)] bg-opacity-30"
    >
      <div className="text-center mb-16">
        <p className="eyebrow mb-3">JOIN THE NETWORK</p>
        <h2 className="font-bebas text-[clamp(2.4rem,5vw,4rem)] text-[var(--text)] leading-none tracking-wide mb-6">
          JOIN THE RYKU NETWORK
        </h2>
        <p className="font-rajdhani text-[var(--text-2)] text-[1.0625rem] max-w-[540px] mx-auto">
          The BŌRYKU platform connects builders, installers, and brands into
          one intelligent overland ecosystem. Pick your tier, start your build.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[760px] mx-auto mb-12">
        {PLANS.map((plan) => (
          <div
            key={plan.tier}
            className="relative rounded-sm p-7 flex flex-col gap-5"
            style={{
              background:   plan.highlight ? 'rgba(255,85,31,0.04)' : 'var(--carbon)',
              border:       `1px solid ${plan.borderColor}`,
            }}
          >
            {plan.highlight && (
              <span
                className="badge badge-med absolute top-4 right-4"
                style={{ fontSize: '0.6rem' }}
              >
                RECOMMENDED
              </span>
            )}

            {/* Tier */}
            <div>
              <p
                className="font-mono text-[0.625rem] tracking-[0.2em] uppercase mb-1"
                style={{ color: plan.color }}
              >
                {plan.tier}
              </p>
              <div className="flex items-baseline gap-1">
                <span
                  className="font-bebas text-[2.8rem] leading-none"
                  style={{ color: plan.highlight ? 'var(--orange)' : 'var(--text)' }}
                >
                  {plan.price}
                </span>
                <span className="font-mono text-[0.7rem] text-[var(--text-3)]">
                  {plan.period}
                </span>
              </div>
            </div>

            {/* Feature list */}
            <ul className="flex flex-col gap-2">
              {plan.features.map((feat) => (
                <li
                  key={feat}
                  className="font-rajdhani text-[0.9rem] text-[var(--text-2)] flex items-start gap-2"
                >
                  <span style={{ color: plan.color }} aria-hidden="true">▸</span>
                  {feat}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-auto pt-2">
              {plan.highlight ? (
                <Link
                  href="/build"
                  className="btn btn-primary w-full justify-center"
                  data-plan="pro"
                >
                  START BUILD
                </Link>
              ) : (
                <Link
                  href="/build"
                  className="btn btn-ghost w-full justify-center"
                  data-plan="free"
                >
                  START FREE
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        <Link href="/build" className="btn btn-primary btn-lg" data-cta="hero-bottom">
          START BUILD
        </Link>
      </div>
    </Section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   6 — Contact preview section
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
    <Section id="contact" className="border-t border-[var(--border)]">
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
      <HeroSection />
      <FeaturesStrip />
      <MissionsSection />
      <GearSection />
      <AboutSection />
      <ContactSection />
    </>
  )
}
