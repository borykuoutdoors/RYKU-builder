'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import ShineBorder from '@/components/ui/ShineBorder'
import SectionEyebrow from '@/components/ui/SectionEyebrow'
import BtnColorful from '@/components/ui/BtnColorful'

// ─── Types ────────────────────────────────────────────────────────────────────

type Billing = 'monthly' | 'annual'

// ─── Plan data ────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id:        'explorer',
    name:      'EXPLORER',
    tagline:   'For users discovering the platform',
    price:     { monthly: 0,     annual: 0 },
    featured:  false,
    disabled:  false,
    badge:     null as null | { text: string; style: 'orange' | 'cyan' },
    ctaLabel:  'START BUILDING',
    ctaHref:   '/build' as string | null,
    ctaVariant:'secondary' as 'primary' | 'secondary',
    checkColor:'rgba(255,255,255,0.55)',
    accentBorder: 'rgba(255,85,31,0.14)',
    features: [
      'Up to 3 Builds',
      'Save 1 Build',
      'Basic Gear Search',
      'Basic Installer Search',
      'Community Access',
      'Standard Build Preview',
    ],
  },
  {
    id:        'pro',
    name:      'PRO BUILDER',
    tagline:   'The complete BŌRYKU experience',
    price:     { monthly: 12.99, annual: 10.39 },
    featured:  true,
    disabled:  false,
    badge:     { text: 'MOST POPULAR', style: 'orange' as 'orange' },
    ctaLabel:  'UPGRADE TO PRO',
    ctaHref:   '/login?mode=create' as string | null,
    ctaVariant:'primary' as 'primary' | 'secondary',
    checkColor:'#FF551F',
    accentBorder: 'rgba(255,85,31,0.3)',
    features: [
      'Unlimited Builds',
      'Unlimited Saved Builds',
      'Advanced Build Planner',
      'Premium Build Preview',
      'Advanced Compatibility',
      'Full Installer Access',
      'PDF Build Exports',
      'Build History',
      'Vehicle Garage',
      'Monthly Supply Drop Entries',
    ],
  },
  {
    id:        'elite',
    name:      'ELITE BUILDER',
    tagline:   'The ultimate BŌRYKU membership',
    price:     { monthly: null as number | null, annual: null as number | null },
    featured:  false,
    disabled:  true,
    badge:     { text: 'COMING SOON', style: 'cyan' as 'cyan' },
    ctaLabel:  'JOIN ELITE',
    ctaHref:   null as string | null,
    ctaVariant:'secondary' as 'primary' | 'secondary',
    checkColor:'rgba(102,255,255,0.6)',
    accentBorder: 'rgba(102,255,255,0.14)',
    features: [
      'Everything in Pro Builder',
      'Exclusive Product Drops',
      'Partner Discounts',
      'Priority Support',
      'Early Feature Access',
      'VIP Giveaways',
      'Featured Builder Opportunities',
    ],
  },
]

const TRUST = [
  { label: 'Cancel anytime' },
  { label: 'Secure Stripe payments' },
  { label: 'No hidden fees' },
  { label: '7-day free trial' },
]

const FAQ = [
  {
    q: 'Can I cancel my Pro subscription anytime?',
    a: 'Yes. Cancel anytime from your account settings. You keep Pro access until the end of your current billing period — no questions asked.',
  },
  {
    q: 'Is there a free trial for Pro Builder?',
    a: 'New Pro subscribers get a 7-day free trial. No charge until the trial ends. Cancel before then and you pay nothing.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'All major credit and debit cards, Apple Pay, and Google Pay — processed securely via Stripe.',
  },
  {
    q: 'Can I upgrade or downgrade my plan?',
    a: 'Yes. Switch plans anytime from your account settings. Changes apply at the start of your next billing cycle with prorated adjustments.',
  },
]

// ─── Benefits data ───────────────────────────────────────────────────────────

const FREE_BENEFITS = [
  { icon: '🗂️', label: 'Save Builds',             desc: 'Save and revisit your configurations anytime' },
  { icon: '🚙', label: 'Create Your Garage',        desc: 'Manage multiple vehicle profiles' },
  { icon: '📌', label: 'Save Products',             desc: 'Gear wishlist and build tracker' },
  { icon: '📋', label: 'Track Build History',       desc: 'Version control for your rig' },
  { icon: '👥', label: 'Community Builds',          desc: 'Browse and showcase your setup' },
  { icon: '🔧', label: 'Installer Network Access',  desc: 'Find certified shops near you' },
]

const PRO_BENEFITS = [
  { icon: '♾️', label: 'Unlimited Saved Loadouts',  desc: 'No limits on saved configurations' },
  { icon: '☁️', label: 'Cloud Sync Across Devices', desc: 'Access your builds anywhere' },
  { icon: '⚡', label: 'Priority Installer Quotes', desc: 'Get shop responses within 24 hours' },
  { icon: '📦', label: 'Monthly Supply Drops',       desc: 'Exclusive member-only gear drops' },
  { icon: '🎯', label: 'Early Access To New Gear',   desc: 'First look at new catalog additions' },
  { icon: '📊', label: 'Build Cost Analytics',       desc: 'Track and optimize every dollar' },
  { icon: '⭐', label: 'Featured Community Profile', desc: 'Get spotlighted in the builder community' },
  { icon: '🛡️', label: 'Priority Support',           desc: 'Direct access to the RYKU team' },
  { icon: '🔮', label: 'Future Premium Features',    desc: 'First access as new features launch' },
]

// ─── BenefitItem ──────────────────────────────────────────────────────────────

function BenefitItem({ icon, label, desc, pro }: { icon: string; label: string; desc: string; pro: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <div style={{
        width: 36, height: 36, borderRadius: '6px', flexShrink: 0,
        background: pro ? 'rgba(255,85,31,0.08)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${pro ? 'rgba(255,85,31,0.22)' : 'rgba(255,255,255,0.08)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '16px',
      }}>
        {icon}
      </div>
      <div>
        <div className="font-mono" style={{
          fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase',
          color: pro ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.65)',
          marginBottom: '2px',
        }}>
          {label}
        </div>
        <div className="font-rajdhani" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.32)', lineHeight: 1.4 }}>
          {desc}
        </div>
      </div>
    </div>
  )
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: 0.1 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
          width: '100%', padding: '18px 0',
          background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span className="font-rajdhani" style={{ fontSize: '15px', color: open ? '#fff' : 'rgba(255,255,255,0.68)', fontWeight: 600, transition: 'color 0.18s' }}>
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: '20px', color: open ? 'var(--orange)' : 'rgba(255,255,255,0.28)', flexShrink: 0, lineHeight: 1, display: 'inline-block' }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p className="font-rajdhani" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.7, paddingBottom: '18px', margin: 0 }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── FeatureRow ───────────────────────────────────────────────────────────────

function FeatureRow({ text, checkColor, featured, elite }: { text: string; checkColor: string; featured: boolean; elite: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
      <div style={{
        width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1,
        background: featured ? 'rgba(255,85,31,0.12)' : elite ? 'rgba(102,255,255,0.07)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${featured ? 'rgba(255,85,31,0.28)' : elite ? 'rgba(102,255,255,0.2)' : 'rgba(255,255,255,0.12)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
          <path d="M1 2.5l1.8 1.8L6 .7" stroke={checkColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="font-rajdhani" style={{
        fontSize: '14px',
        color: featured ? 'rgba(255,255,255,0.78)' : elite ? 'rgba(255,255,255,0.52)' : 'rgba(255,255,255,0.6)',
        lineHeight: 1.35,
      }}>
        {text}
      </span>
    </div>
  )
}

// ─── PricingCard ──────────────────────────────────────────────────────────────

function PricingCard({ plan, billing, index }: { plan: typeof PLANS[0]; billing: Billing; index: number }) {
  const [hovered, setHovered] = useState(false)
  const isFeatured = plan.featured
  const isElite    = plan.id === 'elite'
  const isFree     = plan.price.monthly === 0

  const priceNum = plan.price[billing]
  const priceStr = priceNum === null
    ? '—'
    : priceNum === 0
    ? 'FREE'
    : `$${priceNum.toFixed(2)}`

  const cardInner = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isFeatured
          ? 'linear-gradient(160deg, #130a05 0%, #1c1008 50%, var(--carbon) 100%)'
          : 'var(--carbon)',
        border: isFeatured ? 'none' : `1px solid ${plan.accentBorder}`,
        borderRadius: '6px',
        padding: isFeatured ? '32px 28px 28px' : '28px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.24s ease, box-shadow 0.24s ease',
        transform: hovered && !isFeatured ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered && !isFeatured ? `0 14px 40px rgba(0,0,0,0.45), 0 0 0 1px ${plan.accentBorder}` : 'none',
      }}
    >
      {/* Pro glow bloom */}
      {isFeatured && (
        <div style={{
          position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
          width: 340, height: 220, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,85,31,0.11) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Plan name */}
      <div style={{ marginBottom: '18px' }}>
        <span className="font-mono" style={{
          fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: isFeatured ? 'var(--orange)' : isElite ? 'rgba(102,255,255,0.6)' : 'rgba(255,255,255,0.38)',
        }}>
          {plan.name}
        </span>
      </div>

      {/* Price */}
      <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'flex-end', gap: '6px', flexWrap: 'wrap' }}>
        <span className="font-bebas" style={{
          fontSize: isFree ? '44px' : '52px',
          letterSpacing: '0.02em',
          lineHeight: 1,
          color: priceNum === null ? 'rgba(255,255,255,0.3)' : '#fff',
        }}>
          {priceStr}
        </span>
        {priceNum !== null && priceNum > 0 && (
          <span className="font-mono" style={{
            fontSize: '11px', color: 'rgba(255,255,255,0.32)', letterSpacing: '0.07em',
            paddingBottom: '6px',
          }}>
            /mo{billing === 'annual' ? ' · billed annually' : ''}
          </span>
        )}
      </div>

      {/* Savings badge */}
      {billing === 'annual' && priceNum !== null && priceNum > 0 && (
        <div style={{ marginBottom: '4px' }}>
          <span className="font-mono" style={{ fontSize: '9px', color: '#22c55e', letterSpacing: '0.1em' }}>
            SAVE 20% VS MONTHLY
          </span>
        </div>
      )}

      {/* Tagline */}
      <p className="font-rajdhani" style={{
        fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, margin: '6px 0 20px',
      }}>
        {plan.tagline}
      </p>

      {/* Divider */}
      <div style={{
        height: 1, marginBottom: '20px',
        background: isFeatured
          ? 'linear-gradient(to right, rgba(255,85,31,0.22), rgba(255,200,87,0.12), transparent)'
          : 'rgba(255,255,255,0.07)',
      }} />

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, marginBottom: '24px' }}>
        {plan.features.map(f => (
          <FeatureRow key={f} text={f} checkColor={plan.checkColor} featured={isFeatured} elite={isElite} />
        ))}
      </div>

      {/* CTA */}
      {plan.ctaHref ? (
        <Link href={plan.ctaHref} style={{ textDecoration: 'none', display: 'block' }}>
          <BtnColorful
            variant={plan.ctaVariant}
            style={{ width: '100%', justifyContent: 'center' }}
            data-plan={plan.id}
            data-cta="pricing-page"
          >
            {plan.ctaLabel}
          </BtnColorful>
        </Link>
      ) : (
        <BtnColorful
          variant={plan.ctaVariant}
          disabled={plan.disabled}
          style={{ width: '100%', justifyContent: 'center', opacity: plan.disabled ? 0.38 : 1, cursor: plan.disabled ? 'not-allowed' : 'pointer' }}
          data-plan={plan.id}
          data-cta="pricing-page"
        >
          {plan.ctaLabel}
        </BtnColorful>
      )}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.13, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}
    >
      {/* Badge pill floating above card */}
      {plan.badge && (
        <div style={{ textAlign: 'center', marginBottom: '10px', minHeight: '22px' }}>
          <span className="font-mono" style={{
            display: 'inline-block',
            fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
            padding: '4px 14px', borderRadius: '20px',
            background: plan.badge.style === 'orange'
              ? 'linear-gradient(to right, #FF551F, #FFC857)'
              : 'rgba(102,255,255,0.08)',
            border: plan.badge.style === 'orange'
              ? 'none'
              : '1px solid rgba(102,255,255,0.28)',
            color: plan.badge.style === 'orange' ? '#0d0704' : 'rgba(102,255,255,0.85)',
            boxShadow: plan.badge.style === 'orange' ? '0 2px 14px rgba(255,85,31,0.35)' : 'none',
          }}>
            {plan.badge.text}
          </span>
        </div>
      )}

      {/* No badge spacer for Explorer */}
      {!plan.badge && <div style={{ minHeight: '22px', marginBottom: '10px' }} />}

      {/* Card — Pro gets ShineBorder */}
      {isFeatured ? (
        <ShineBorder variant="featured" borderRadius={6} style={{ flex: 1 }}>
          {cardInner}
        </ShineBorder>
      ) : (
        <div style={{ flex: 1 }}>{cardInner}</div>
      )}
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>('monthly')

  return (
    <div style={{
      minHeight: '100vh',
      paddingBottom: '100px',
    }}>

      {/* ── Page header ───────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        padding: 'clamp(88px,10vh,108px) 24px 60px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 640, height: 420, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,85,31,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <SectionEyebrow>MEMBERSHIP TIERS</SectionEyebrow>

          <h1 className="font-bebas" style={{
            fontSize: 'clamp(52px, 7.5vw, 96px)',
            letterSpacing: '0.04em',
            color: '#fff',
            lineHeight: 0.95,
            margin: '8px 0 18px',
          }}>
            BUILD WITHOUT<br />
            <span style={{ color: 'var(--orange)' }}>LIMITS</span>
          </h1>

          <p className="font-rajdhani" style={{
            fontSize: '16px', color: 'rgba(255,255,255,0.42)',
            margin: '0 auto 36px', maxWidth: '440px', lineHeight: 1.65,
          }}>
            Choose the plan that fits your mission. Start free — upgrade when you&apos;re ready.
          </p>

          {/* Billing toggle */}
          <div style={{
            display: 'inline-flex',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            padding: '4px',
          }}>
            {(['monthly', 'annual'] as Billing[]).map(b => {
              const active = billing === b
              return (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className="font-mono"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '4px',
                    border: 'none',
                    background: active ? 'rgba(255,85,31,0.82)' : 'transparent',
                    color: active ? '#fff' : 'rgba(255,255,255,0.38)',
                    fontSize: '11px', letterSpacing: '0.13em', textTransform: 'uppercase',
                    cursor: 'pointer', transition: 'all 0.18s',
                    display: 'flex', alignItems: 'center', gap: '7px',
                  }}
                >
                  {b === 'monthly' ? 'MONTHLY' : 'ANNUAL'}
                  {b === 'annual' && (
                    <span style={{
                      fontSize: '9px',
                      background: active ? 'rgba(255,255,255,0.18)' : 'rgba(34,197,94,0.14)',
                      border: active ? 'none' : '1px solid rgba(34,197,94,0.28)',
                      color: active ? 'rgba(255,255,255,0.88)' : '#22c55e',
                      padding: '1px 5px', borderRadius: '3px', letterSpacing: '0.06em',
                    }}>
                      −20%
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Cards ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '60px 24px 0' }}>
        <div
          className="pricing-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            alignItems: 'start',
          }}
        >
          {PLANS.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} billing={billing} index={i} />
          ))}
        </div>
      </div>

      {/* ── Trust indicators ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px 32px',
          maxWidth: '800px', margin: '48px auto 0', padding: '0 24px',
        }}
      >
        {TRUST.map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(34,197,94,0.14)', border: '1px solid rgba(34,197,94,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="6" height="5" viewBox="0 0 7 5" fill="none">
                <path d="M1 2.5l1.8 1.8L6 .7" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.32)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {item.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Stripe/pay line */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        style={{ textAlign: 'center', marginTop: '14px' }}
      >
        <span className="font-mono" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.16)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Powered by <span style={{ color: 'rgba(99,91,255,0.5)' }}>Stripe</span> · Apple Pay · Google Pay · All Major Cards
        </span>
      </motion.div>

      {/* ── Account Benefits ──────────────────────────────────────── */}
      <div style={{ maxWidth: '1120px', margin: '88px auto 0', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <SectionEyebrow>WHAT&apos;S INCLUDED</SectionEyebrow>
          <h2 className="font-bebas" style={{
            fontSize: 'clamp(32px, 4vw, 56px)',
            letterSpacing: '0.05em', color: '#fff', margin: '8px 0 12px',
          }}>
            EVERY ACCOUNT. EVERY BENEFIT.
          </h2>
          <p className="font-rajdhani" style={{
            fontSize: '15px', color: 'rgba(255,255,255,0.36)',
            margin: '0 auto', maxWidth: '480px', lineHeight: 1.65,
          }}>
            Whether you&apos;re starting free or going Pro, BŌRYKU is built to move with your mission.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '16px' }} className="benefits-grid">

          {/* Explorer / Free card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'rgba(8,10,20,0.70)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '6px',
              padding: '32px 28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>
                EXPLORER
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
                FREE
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {FREE_BENEFITS.map(b => (
                <BenefitItem key={b.label} icon={b.icon} label={b.label} desc={b.desc} pro={false} />
              ))}
            </div>
          </motion.div>

          {/* Pro Builder card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.82, ease: [0.16, 1, 0.3, 1] }}
          >
            <ShineBorder variant="featured" borderRadius={6} style={{ height: '100%' }}>
              <div style={{
                background: 'linear-gradient(160deg, #130a05 0%, #1c1008 50%, rgba(8,10,20,0.95) 100%)',
                borderRadius: '6px',
                padding: '32px 28px',
                height: '100%',
                boxSizing: 'border-box',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 320, height: 200, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,85,31,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', position: 'relative' }}>
                  <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--orange)', whiteSpace: 'nowrap' }}>
                    PRO BUILDER
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(255,85,31,0.28), transparent)' }} />
                  <span className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,85,31,0.6)', whiteSpace: 'nowrap' }}>
                    $12.99 / mo
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                  {PRO_BENEFITS.map(b => (
                    <BenefitItem key={b.label} icon={b.icon} label={b.label} desc={b.desc} pro={true} />
                  ))}
                </div>
              </div>
            </ShineBorder>
          </motion.div>

        </div>
      </div>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '680px', margin: '88px auto 0', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <SectionEyebrow>COMMON QUESTIONS</SectionEyebrow>
          <h2 className="font-bebas" style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            letterSpacing: '0.05em', color: '#fff', margin: '8px 0 0',
          }}>
            FREQUENTLY ASKED
          </h2>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {FAQ.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </div>

      {/* ── Responsive ────────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 860px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
            max-width: 480px;
            margin-left: auto;
            margin-right: auto;
          }
          .benefits-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
