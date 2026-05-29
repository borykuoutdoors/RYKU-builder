'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import ShineBorder from '@/components/ui/ShineBorder'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

// ─── Plan config ─────────────────────────────────────────────────────────────

type PlanId = 'explorer' | 'pro' | 'elite'

interface PlanConfig {
  id: PlanId
  name: string
  price: string
  priceSub: string | null
  tagline: string
  accentColor: string
  borderColor: string
  bg: string
  ctaLabel: string
  benefits: { icon: string; label: string; desc: string }[]
}

const PLAN_CONFIG: Record<PlanId, PlanConfig> = {
  explorer: {
    id:        'explorer' as PlanId,
    name:      'EXPLORER',
    price:     'FREE',
    priceSub:  null,
    tagline:   'Everything you need to get started',
    accentColor:'rgba(255,255,255,0.55)',
    borderColor:'rgba(255,255,255,0.10)',
    bg:        'rgba(8,10,20,0.80)',
    ctaLabel:  'CREATE FREE ACCOUNT',
    benefits: [
      { icon: '🗂️', label: 'Save Builds',              desc: 'Save and revisit your configurations' },
      { icon: '🚙', label: 'Create Your Garage',        desc: 'Manage multiple vehicle profiles' },
      { icon: '📌', label: 'Save Products',             desc: 'Gear wishlist and build tracker' },
      { icon: '📋', label: 'Track Build History',       desc: 'Version control for your rig' },
      { icon: '👥', label: 'Community Access',          desc: 'Browse and showcase your setup' },
      { icon: '🔧', label: 'Installer Network Access',  desc: 'Find certified shops near you' },
    ],
  },
  pro: {
    id:        'pro' as PlanId,
    name:      'PRO BUILDER',
    price:     '$12.99',
    priceSub:  '/month',
    tagline:   'The complete BŌRYKU experience',
    accentColor:'#FF551F',
    borderColor:'rgba(255,85,31,0.30)',
    bg:        'linear-gradient(160deg, #130a05 0%, #1c1008 50%, rgba(8,10,20,0.95) 100%)',
    ctaLabel:  'UPGRADE TO PRO',
    benefits: [
      { icon: '♾️', label: 'Unlimited Builds',            desc: 'No limits on saved configurations' },
      { icon: '☁️', label: 'Unlimited Saved Loadouts',    desc: 'Sync across all your devices' },
      { icon: '⚡', label: 'Advanced AI Recommendations', desc: 'Smart gear suggestions for your rig' },
      { icon: '🏪', label: 'Installer Quote Requests',    desc: 'Get shop responses within 24 hours' },
      { icon: '📄', label: 'Build Exports',               desc: 'PDF and shareable build sheets' },
      { icon: '🛡️', label: 'Priority Support',            desc: 'Direct access to the BŌRYKU team' },
      { icon: '🔮', label: 'Premium Features',            desc: 'First access as new features launch' },
    ],
  },
  elite: {
    id:        'elite' as PlanId,
    name:      'ELITE BUILDER',
    price:     'TBA',
    priceSub:  null,
    tagline:   'The ultimate BŌRYKU membership — coming soon',
    accentColor:'#66FFFF',
    borderColor:'rgba(102,255,255,0.20)',
    bg:        'rgba(4,8,18,0.92)',
    ctaLabel:  'JOIN WAITLIST',
    benefits: [
      { icon: '⭐', label: 'Everything in Pro Builder',      desc: 'All Pro features included' },
      { icon: '📦', label: 'Exclusive Product Drops',        desc: 'Member-only gear and deals' },
      { icon: '💰', label: 'Partner Discounts',              desc: 'Exclusive rates on top brands' },
      { icon: '⚡', label: 'Priority Support',               desc: 'Dedicated account manager' },
      { icon: '🚀', label: 'Early Feature Access',           desc: 'Beta programs and previews' },
      { icon: '🏆', label: 'VIP Giveaways',                  desc: 'Elite-only gear and experiences' },
      { icon: '🌟', label: 'Featured Builder Opportunities', desc: 'Community spotlights and partnerships' },
    ],
  },
}

// ─── Input style ─────────────────────────────────────────────────────────────

function inputStyle(focused: boolean): React.CSSProperties {
  return {
    width: '100%', boxSizing: 'border-box',
    background: focused ? 'rgba(255,85,31,0.05)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${focused ? 'rgba(255,85,31,0.52)' : 'rgba(255,255,255,0.10)'}`,
    borderRadius: 4,
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    padding: '12px 14px',
    outline: 'none',
    transition: 'border-color 0.20s, background 0.20s, box-shadow 0.20s',
    boxShadow: focused ? '0 0 0 3px rgba(255,85,31,0.08)' : 'none',
  }
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.38)', marginBottom: 7,
}

// ─── Field ───────────────────────────────────────────────────────────────────

function Field({
  label, type = 'text', placeholder, value, onChange, autoFocus,
}: {
  label: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; autoFocus?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyle(focused)}
      />
    </div>
  )
}

// ─── Fake card input ──────────────────────────────────────────────────────────

function CardField({ label, placeholder, half }: { label: string; placeholder: string; half?: boolean }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ flex: half ? '1 1 0' : undefined }}>
      <label style={labelStyle}>{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyle(focused)}
      />
    </div>
  )
}

// ─── Plan benefits list ───────────────────────────────────────────────────────

function BenefitList({ plan }: { plan: typeof PLAN_CONFIG['explorer'] }) {
  const isPro = plan.id === 'pro'
  const isElite = plan.id === 'elite'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {plan.benefits.map(b => (
        <div key={b.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 5, flexShrink: 0,
            background: isPro ? 'rgba(255,85,31,0.08)' : isElite ? 'rgba(102,255,255,0.06)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isPro ? 'rgba(255,85,31,0.20)' : isElite ? 'rgba(102,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}>
            {b.icon}
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase',
              color: isPro ? 'rgba(255,255,255,0.80)' : isElite ? 'rgba(102,255,255,0.75)' : 'rgba(255,255,255,0.62)',
              marginBottom: 2,
            }}>
              {b.label}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.28)', lineHeight: 1.4 }}>
              {b.desc}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Plan selector pills ──────────────────────────────────────────────────────

function PlanPills({ active, onChange }: { active: PlanId; onChange: (p: PlanId) => void }) {
  const PILLS: { id: PlanId; label: string }[] = [
    { id: 'explorer', label: 'EXPLORER' },
    { id: 'pro',      label: 'PRO BUILDER' },
    { id: 'elite',    label: 'ELITE' },
  ]
  return (
    <div style={{
      display: 'inline-flex',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 6, padding: 4, gap: 4,
    }}>
      {PILLS.map(p => {
        const isActive = active === p.id
        return (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
              padding: '8px 16px', borderRadius: 3, border: 'none', cursor: 'pointer',
              background: isActive ? 'rgba(255,85,31,0.80)' : 'transparent',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.35)',
              transition: 'all 0.18s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {p.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Auth form (Explorer + Pro) ────────────────────────────────────────────────

type AuthMode = 'create' | 'signin'

function AuthForm({ plan, onSuccess }: { plan: typeof PLAN_CONFIG['explorer']; onSuccess: () => void }) {
  const [mode, setMode]         = useState<AuthMode>('create')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); onSuccess() }, 1200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Mode toggle */}
      <div style={{
        display: 'flex',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 4, overflow: 'hidden',
      }}>
        {(['create', 'signin'] as AuthMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1, padding: '10px',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
              background: mode === m ? 'rgba(255,85,31,0.10)' : 'transparent',
              color: mode === m ? 'var(--orange)' : 'rgba(255,255,255,0.30)',
              border: 'none',
              borderBottom: `2px solid ${mode === m ? 'rgba(255,85,31,0.50)' : 'transparent'}`,
              cursor: 'pointer', transition: 'all 0.16s',
            }}
          >
            {m === 'create' ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AnimatePresence mode="wait" initial={false}>
          {mode === 'create' && (
            <motion.div
              key="create-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.20, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <Field label="Full Name" placeholder="Your name" value={name} onChange={setName} />
            </motion.div>
          )}
        </AnimatePresence>

        <Field label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
        <Field label="Password" type="password" placeholder="Min. 8 characters" value={password} onChange={setPassword} />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !email || !password}
          style={{
            marginTop: 4,
            width: '100%', padding: '14px',
            fontFamily: 'var(--font-tactical)', fontWeight: 700,
            fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase',
            background: (!email || !password)
              ? 'rgba(255,85,31,0.25)'
              : 'linear-gradient(to right, #FF551F, #FFC857)',
            border: 'none', borderRadius: 3, cursor: (!email || !password) ? 'not-allowed' : 'pointer',
            color: (!email || !password) ? 'rgba(255,255,255,0.30)' : '#0d0704',
            transition: 'all 0.20s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {loading ? (
            <>
              <span style={{ width: 14, height: 14, border: '2px solid rgba(13,7,4,0.30)', borderTopColor: '#0d0704', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
              ACTIVATING...
            </>
          ) : plan.ctaLabel}
        </button>
      </form>

      {/* Legal */}
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.18)', textAlign: 'center', lineHeight: 1.6 }}>
        By continuing you agree to BŌRYKU&apos;s{' '}
        <span style={{ color: 'rgba(255,85,31,0.5)', cursor: 'pointer' }}>Terms of Service</span>{' '}
        and{' '}
        <span style={{ color: 'rgba(255,85,31,0.5)', cursor: 'pointer' }}>Privacy Policy</span>.
      </p>
    </div>
  )
}

// ─── Pro payment form ─────────────────────────────────────────────────────────

function ProPaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode]         = useState<AuthMode>('create')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [step, setStep]         = useState<'account' | 'payment'>('account')

  function handleAccountNext(e: React.FormEvent) {
    e.preventDefault()
    if (email && password) setStep('payment')
  }

  function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); onSuccess() }, 1600)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24 }}>
        {[
          { num: 1, label: 'ACCOUNT', key: 'account' },
          { num: 2, label: 'PAYMENT', key: 'payment' },
        ].map((s, i) => {
          const isDone   = (step === 'payment' && s.key === 'account')
          const isActive = step === s.key
          return (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: isDone ? 'rgba(155,191,106,0.12)' : isActive ? 'rgba(255,85,31,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isDone ? '#9BBF6A' : isActive ? '#FF551F' : 'rgba(255,255,255,0.10)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.22s',
                }}>
                  {isDone ? (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5l2 2L8 1" stroke="#9BBF6A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: isActive ? '#FF551F' : 'rgba(255,255,255,0.28)' }}>{s.num}</span>
                  )}
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: isDone ? '#9BBF6A' : isActive ? 'var(--orange)' : 'rgba(255,255,255,0.25)',
                  transition: 'color 0.22s',
                }}>
                  {s.label}
                </span>
              </div>
              {i === 0 && (
                <div style={{ flex: 1, height: 1, margin: '0 10px', background: isDone ? 'rgba(155,191,106,0.30)' : 'rgba(255,255,255,0.06)' }} />
              )}
            </div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === 'account' && (
          <motion.div
            key="account-step"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Mode toggle */}
            <div style={{
              display: 'flex', marginBottom: 20,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 4, overflow: 'hidden',
            }}>
              {(['create', 'signin'] as AuthMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    flex: 1, padding: '10px',
                    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                    background: mode === m ? 'rgba(255,85,31,0.10)' : 'transparent',
                    color: mode === m ? 'var(--orange)' : 'rgba(255,255,255,0.30)',
                    border: 'none',
                    borderBottom: `2px solid ${mode === m ? 'rgba(255,85,31,0.50)' : 'transparent'}`,
                    cursor: 'pointer', transition: 'all 0.16s',
                  }}
                >
                  {m === 'create' ? 'CREATE ACCOUNT' : 'SIGN IN'}
                </button>
              ))}
            </div>

            <form onSubmit={handleAccountNext} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <AnimatePresence mode="wait" initial={false}>
                {mode === 'create' && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <Field label="Full Name" placeholder="Your name" value={name} onChange={setName} />
                  </motion.div>
                )}
              </AnimatePresence>
              <Field label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
              <Field label="Password" type="password" placeholder="Min. 8 characters" value={password} onChange={setPassword} />
              <button
                type="submit"
                disabled={!email || !password}
                style={{
                  marginTop: 4, width: '100%', padding: '13px',
                  fontFamily: 'var(--font-tactical)', fontWeight: 700,
                  fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                  background: (!email || !password) ? 'rgba(255,255,255,0.06)' : 'rgba(255,85,31,0.10)',
                  border: `1px solid ${(!email || !password) ? 'rgba(255,255,255,0.08)' : 'rgba(255,85,31,0.30)'}`,
                  color: (!email || !password) ? 'rgba(255,255,255,0.25)' : 'var(--orange)',
                  borderRadius: 3, cursor: (!email || !password) ? 'not-allowed' : 'pointer', transition: 'all 0.18s',
                }}
              >
                NEXT: PAYMENT →
              </button>
            </form>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div
            key="payment-step"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Stripe placeholder notice */}
              <div style={{
                background: 'rgba(255,85,31,0.05)',
                border: '1px solid rgba(255,85,31,0.15)',
                borderRadius: 4, padding: '12px 14px',
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>🔒</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,85,31,0.75)', marginBottom: 3 }}>
                    SECURE STRIPE CHECKOUT
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.30)', lineHeight: 1.5 }}>
                    Payment processing via Stripe. Your card details are encrypted and never stored on our servers.
                  </div>
                </div>
              </div>

              <CardField label="Cardholder Name" placeholder="Name on card" />
              <CardField label="Card Number" placeholder="1234 5678 9012 3456" />
              <div style={{ display: 'flex', gap: 10 }}>
                <CardField label="Expiry" placeholder="MM / YY" half />
                <CardField label="CVC" placeholder="123" half />
              </div>

              {/* Order summary */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 4, padding: '12px 14px',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.28)', marginBottom: 10 }}>
                  ORDER SUMMARY
                </div>
                {[
                  { label: 'Pro Builder Plan',         value: '$12.99/mo' },
                  { label: '7-Day Free Trial',         value: 'INCLUDED' },
                  { label: 'First Charge',             value: 'After trial' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{r.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.60)' }}>{r.value}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-tactical)', fontWeight: 700, fontSize: 12, letterSpacing: '0.10em', color: 'var(--text)' }}>DUE TODAY</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.04em', color: 'var(--green)' }}>$0.00</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setStep('account')}
                  style={{
                    padding: '13px 18px',
                    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
                    background: 'transparent', border: '1px solid rgba(255,255,255,0.10)',
                    color: 'rgba(255,255,255,0.35)', borderRadius: 3, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  ← BACK
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1, padding: '13px',
                    fontFamily: 'var(--font-tactical)', fontWeight: 700,
                    fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                    background: 'linear-gradient(to right, #FF551F, #FFC857)',
                    border: 'none', borderRadius: 3, cursor: loading ? 'wait' : 'pointer',
                    color: '#0d0704',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'opacity 0.18s',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ width: 14, height: 14, border: '2px solid rgba(13,7,4,0.30)', borderTopColor: '#0d0704', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                      ACTIVATING...
                    </>
                  ) : (
                    <>START FREE TRIAL →</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.18)', textAlign: 'center', lineHeight: 1.6, marginTop: 16 }}>
        7-day free trial · Cancel anytime · No charge until trial ends
      </p>
    </div>
  )
}

// ─── Elite waitlist form ──────────────────────────────────────────────────────

function EliteWaitlistForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail]   = useState('')
  const [done, setDone]     = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true) }, 1000)
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.30, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', padding: '32px 0' }}
      >
        <div style={{ fontSize: '2.8rem', marginBottom: 16 }}>⭐</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.06em', color: '#66FFFF', marginBottom: 8 }}>
          YOU&apos;RE ON THE LIST
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.32)', lineHeight: 1.7 }}>
          We&apos;ll notify you at {email} when Elite Builder launches.
          <br />Expect early access and exclusive founding member benefits.
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Coming soon notice */}
      <div style={{
        background: 'rgba(102,255,255,0.04)',
        border: '1px solid rgba(102,255,255,0.14)',
        borderRadius: 4, padding: '16px',
        textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.08em', color: '#66FFFF', marginBottom: 6 }}>
          COMING SOON
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>
          Elite Builder is in final development. Founding members get early access and exclusive rates locked for life.
        </div>
      </div>

      <Field label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={setEmail} autoFocus />

      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 4, padding: '12px 14px',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.28)', marginBottom: 8 }}>
          FOUNDING MEMBER PERKS
        </div>
        {[
          'Early access before public launch',
          'Founding member pricing — locked for life',
          'Direct input on Elite features roadmap',
          'Exclusive founding member badge',
        ].map(p => (
          <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ color: '#66FFFF', fontSize: 10, flexShrink: 0 }}>✓</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.42)' }}>{p}</span>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading || !email}
        style={{
          width: '100%', padding: '14px',
          fontFamily: 'var(--font-tactical)', fontWeight: 700,
          fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase',
          background: !email ? 'rgba(102,255,255,0.06)' : 'rgba(102,255,255,0.10)',
          border: `1px solid ${!email ? 'rgba(102,255,255,0.10)' : 'rgba(102,255,255,0.28)'}`,
          color: !email ? 'rgba(102,255,255,0.28)' : '#66FFFF',
          borderRadius: 3, cursor: (!email || loading) ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.18s',
        }}
      >
        {loading ? (
          <>
            <span style={{ width: 14, height: 14, border: '2px solid rgba(102,255,255,0.20)', borderTopColor: '#66FFFF', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
            ADDING TO LIST...
          </>
        ) : 'JOIN WAITLIST'}
      </button>

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.18)', textAlign: 'center', lineHeight: 1.6 }}>
        No spam, ever. Unsubscribe anytime.
      </p>
    </form>
  )
}

// ─── Inner page (needs useSearchParams) ──────────────────────────────────────

function SubscribeInner() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const rawPlan      = searchParams.get('plan') ?? 'explorer'
  const initialPlan  = (rawPlan in PLAN_CONFIG ? rawPlan : 'explorer') as PlanId

  const [activePlan, setActivePlan] = useState<PlanId>(initialPlan)
  const plan = PLAN_CONFIG[activePlan]
  const isPro   = activePlan === 'pro'
  const isElite = activePlan === 'elite'

  function handleSuccess() {
    router.push('/builds')
  }

  // Derive the right-panel content
  const rightPanel = isElite
    ? <EliteWaitlistForm onSuccess={handleSuccess} />
    : isPro
    ? <ProPaymentForm onSuccess={handleSuccess} />
    : <AuthForm plan={plan} onSuccess={handleSuccess} />

  return (
    <div style={{
      minHeight: '100dvh',
      paddingTop: 'var(--page-top)',
      paddingBottom: 72,
    }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 var(--pad-x)' }}>

        {/* ── Header ──────────────────────────────────────────────── */}
        <div style={{ marginBottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <Link
            href="/pricing"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.28)', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,85,31,0.70)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.28)' }}
          >
            ← BACK TO PRICING
          </Link>

          <SectionEyebrow>MEMBERSHIP ACTIVATION</SectionEyebrow>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            letterSpacing: '0.04em', color: 'var(--text)', margin: 0,
          }}>
            {isElite ? 'JOIN THE WAITLIST' : 'ACTIVATE YOUR PLAN'}
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', maxWidth: 480, margin: 0 }}>
            {isElite
              ? 'Be first in line when Elite Builder launches. Founding members get exclusive rates locked for life.'
              : 'Select your plan, create your account, and access the full BŌRYKU platform.'}
          </p>

          {/* Plan pills */}
          <div style={{ marginTop: 8 }}>
            <PlanPills active={activePlan} onChange={setActivePlan} />
          </div>
        </div>

        {/* ── 2-col layout ────────────────────────────────────────── */}
        <div className="subscribe-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          alignItems: 'start',
        }}>

          {/* LEFT — Plan summary ──────────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePlan + '-left'}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {isPro ? (
                <ShineBorder variant="featured" borderRadius={8}>
                  <PlanSummaryCard plan={plan} isPro={isPro} isElite={isElite} />
                </ShineBorder>
              ) : isElite ? (
                <div style={{
                  background: plan.bg,
                  border: `1px solid ${plan.borderColor}`,
                  borderRadius: 8,
                  overflow: 'hidden',
                }}>
                  <PlanSummaryCard plan={plan} isPro={isPro} isElite={isElite} />
                </div>
              ) : (
                <div style={{
                  background: plan.bg,
                  backdropFilter: 'blur(16px)',
                  border: `1px solid ${plan.borderColor}`,
                  borderRadius: 8,
                  overflow: 'hidden',
                }}>
                  <PlanSummaryCard plan={plan} isPro={isPro} isElite={isElite} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* RIGHT — Action panel ─────────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePlan + '-right'}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: 'rgba(8,10,20,0.80)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8,
                padding: '32px 28px',
              }}
            >
              {/* Panel header */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--text-3)', marginBottom: 4 }}>
                  {isElite ? 'NOTIFY ME AT LAUNCH' : isPro ? 'ACCOUNT & PAYMENT' : 'CREATE YOUR ACCOUNT'}
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.4rem',
                  letterSpacing: '0.05em', color: 'var(--text)', margin: 0,
                }}>
                  {isElite ? 'JOIN THE WAITLIST' : isPro ? 'UPGRADE TO PRO' : 'START FOR FREE'}
                </h2>
              </div>

              {rightPanel}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Trust bar ────────────────────────────────────────────── */}
        {!isElite && (
          <div style={{
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '14px 28px',
            marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.05)',
          }}>
            {[
              { icon: '🔒', label: 'Encrypted & Secure' },
              { icon: '💳', label: 'Stripe Payments' },
              { icon: '↩️', label: 'Cancel Anytime' },
              { icon: '🎁', label: '7-Day Free Trial' },
            ].map(t => (
              <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 12 }}>{t.icon}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 800px) {
          .subscribe-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

// ─── Plan summary card (extracted to keep JSX manageable) ────────────────────

function PlanSummaryCard({
  plan, isPro, isElite,
}: {
  plan: typeof PLAN_CONFIG['explorer']
  isPro: boolean; isElite: boolean
}) {
  return (
    <div style={{
      background: plan.bg,
      padding: '32px 28px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Pro glow */}
      {isPro && (
        <div style={{
          position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
          width: 300, height: 200, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,85,31,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Plan name & price */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: isPro ? 'var(--orange)' : isElite ? '#66FFFF' : 'rgba(255,255,255,0.38)',
          }}>
            SELECTED PLAN
          </span>
          <div style={{ flex: 1, height: 1, background: isPro ? 'linear-gradient(to right, rgba(255,85,31,0.25), transparent)' : 'rgba(255,255,255,0.06)' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            letterSpacing: '0.04em', color: 'var(--text)', lineHeight: 1,
          }}>
            {plan.price}
          </span>
          {plan.priceSub && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.32)' }}>
              {plan.priceSub}
            </span>
          )}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', color: isPro ? 'rgba(255,85,31,0.75)' : isElite ? 'rgba(102,255,255,0.60)' : 'rgba(255,255,255,0.40)', marginTop: 6, textTransform: 'uppercase' }}>
          {plan.name}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, marginTop: 6 }}>
          {plan.tagline}
        </p>
      </div>

      {/* Divider */}
      <div style={{
        height: 1, marginBottom: 24,
        background: isPro
          ? 'linear-gradient(to right, rgba(255,85,31,0.22), rgba(255,200,87,0.10), transparent)'
          : isElite
          ? 'linear-gradient(to right, rgba(102,255,255,0.15), transparent)'
          : 'rgba(255,255,255,0.07)',
        position: 'relative', zIndex: 1,
      }} />

      {/* Benefits */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <BenefitList plan={plan} />
      </div>
    </div>
  )
}

// ─── Page (Suspense wrapper for useSearchParams) ──────────────────────────────

export default function SubscribePage() {
  return (
    <Suspense fallback={
      <div style={{ paddingTop: 'var(--page-top)', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--text-3)' }}>
        LOADING...
      </div>
    }>
      <SubscribeInner />
    </Suspense>
  )
}
