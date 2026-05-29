'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthTrigger = 'default' | 'save-build' | 'pro' | 'community' | 'dashboard'

export interface AuthModalProps {
  isOpen:   boolean
  onClose:  () => void
  trigger?: AuthTrigger
  /** Called with 'signin' | 'create' on successful mock auth */
  onSuccess?: (mode: 'signin' | 'create') => void
}

type Mode = 'signin' | 'create'

// ─── Trigger-specific messaging ───────────────────────────────────────────────

const TRIGGER_COPY: Record<AuthTrigger, { eyebrow: string; headline: string; sub: string }> = {
  'default':    { eyebrow: 'SECURE ACCESS',        headline: 'SIGN IN TO BŌRYKU',       sub: 'Access your builds, garage, and more.' },
  'save-build': { eyebrow: 'SAVE YOUR BUILD',       headline: 'CREATE A FREE ACCOUNT',   sub: 'Sign in to save your build and sync across devices.' },
  'pro':        { eyebrow: 'RYKU PRO ACCESS',       headline: 'UNLOCK PRO FEATURES',     sub: 'Sign in to manage your Pro membership.' },
  'community':  { eyebrow: 'COMMUNITY ACCESS',      headline: 'JOIN THE NETWORK',        sub: 'Sign in to access community builds and discussions.' },
  'dashboard':  { eyebrow: 'CONTROL PANEL',         headline: 'SIGN IN TO ACCESS',       sub: 'Your dashboard, builds, and gear are waiting.' },
}

// ─── Compact benefits ─────────────────────────────────────────────────────────

const COMPACT_BENEFITS = [
  'Save unlimited builds',
  'Create your vehicle garage',
  'Track gear & build history',
  'Join community builds',
  'Access Pro features',
]

// ─── Shared input styles ──────────────────────────────────────────────────────

function getInputStyle(focused: boolean): React.CSSProperties {
  return {
    width: '100%',
    background: focused ? 'rgba(255,85,31,0.05)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${focused ? 'rgba(255,85,31,0.52)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '4px',
    color: '#fff',
    fontFamily: 'var(--font-rajdhani)',
    fontSize: '15px',
    padding: '11px 14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
    boxShadow: focused ? '0 0 0 3px rgba(255,85,31,0.08)' : 'none',
  }
}

// ─── Inline field component ───────────────────────────────────────────────────

function Field({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
  autoComplete,
}: {
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  autoComplete?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: focused ? 'rgba(255,85,31,0.75)' : 'rgba(255,255,255,0.3)',
        letterSpacing: '0.13em',
        textTransform: 'uppercase',
        marginBottom: '7px',
        transition: 'color 0.2s',
      }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={getInputStyle(focused)}
      />
    </div>
  )
}

// ─── Social button ────────────────────────────────────────────────────────────

function SocialBtn({ provider }: { provider: 'google' | 'apple' }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
        flex: 1, padding: '10px 12px',
        background: hovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.09)'}`,
        borderRadius: '4px',
        color: hovered ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.58)',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.17s',
        whiteSpace: 'nowrap',
      }}
    >
      {provider === 'google' ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M15.68 8.18c0-.57-.05-1.12-.14-1.64H8v3.1h4.3a3.67 3.67 0 0 1-1.6 2.41v2h2.6C14.82 12.64 15.68 10.58 15.68 8.18z" fill="#4285F4"/>
          <path d="M8 16c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01A5.03 5.03 0 0 1 8 13.02c-2.34 0-4.32-1.58-5.03-3.7H.3v2.07C1.62 14.18 4.6 16 8 16z" fill="#34A853"/>
          <path d="M2.97 9.32A5 5 0 0 1 2.71 8c0-.46.08-.91.26-1.32V4.6H.3A8 8 0 0 0 0 8l2.67 3.4 .3-2.08z" fill="#FBBC05"/>
          <path d="M8 3.18c1.32 0 2.5.45 3.44 1.34l2.58-2.58C12.47.72 10.66 0 8 0A8 8 0 0 0 .3 4.6L2.97 6.68C3.68 4.56 5.66 3.18 8 3.18z" fill="#EA4335"/>
        </svg>
      ) : (
        <svg width="12" height="14" viewBox="0 0 14 17" fill="currentColor">
          <path d="M13.18 11.8c-.3.64-.44.93-.82 1.5-.54.8-1.3 1.78-2.24 1.8-.84.02-1.06-.55-2.2-.54-1.14 0-1.38.56-2.22.54-.94-.02-1.66-.9-2.2-1.7C1.68 11.1 1.2 8.3 2.14 6.46c.66-1.3 1.96-2.08 3.16-2.08 1.18 0 1.92.55 2.9.55.94 0 1.52-.56 2.87-.56 1.06 0 2.2.58 3 1.58-2.64 1.44-2.22 5.22.11 5.85zM9.62 3.7c.52-.62.92-1.5.78-2.4-.78.06-1.7.54-2.24 1.18-.48.6-.92 1.48-.76 2.34.84.02 1.7-.5 2.22-1.12z"/>
        </svg>
      )}
      {provider === 'google' ? 'Google' : 'Apple'}
    </button>
  )
}

// ─── Modal inner form ─────────────────────────────────────────────────────────

function ModalForm({ trigger, onSuccess, onClose }: { trigger: AuthTrigger; onSuccess?: (m: Mode) => void; onClose: () => void }) {
  const copy = TRIGGER_COPY[trigger]

  const defaultMode: Mode = trigger === 'save-build' ? 'create' : 'signin'
  const [mode, setMode]         = useState<Mode>(defaultMode)
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // TODO: replace with Supabase Auth call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      onSuccess?.(mode)
      setTimeout(onClose, 1600)
    }, 1700)
  }

  // ── Success ──────────────────────────────────────────────────────────────────
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', padding: '28px 0 16px' }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.07, duration: 0.44, type: 'spring', stiffness: 300, damping: 22 }}
          style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(255,85,31,0.1)', border: '1px solid rgba(255,85,31,0.32)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 0 24px rgba(255,85,31,0.16)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <motion.path d="M3 11l5 5L19 4" stroke="#FF551F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.26, duration: 0.48, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>
        <div className="font-bebas" style={{ fontSize: '22px', color: '#fff', letterSpacing: '0.08em', marginBottom: '6px' }}>
          {mode === 'create' ? 'WELCOME TO BŌRYKU' : 'WELCOME BACK'}
        </div>
        <div className="font-rajdhani" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
          {mode === 'create' ? 'Account ready.' : 'Session initiated.'} Closing…
        </div>
        <motion.div
          initial={{ width: '0%' }} animate={{ width: '100%' }}
          transition={{ delay: 0.36, duration: 1.4, ease: 'easeInOut' }}
          style={{ height: 2, borderRadius: 2, marginTop: 20, background: 'linear-gradient(to right, #FF551F, #FFC857)' }}
        />
      </motion.div>
    )
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Eyebrow + headline */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,85,31,0.52)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '6px' }}>
          {copy.eyebrow}
        </div>
        <div className="font-bebas" style={{ fontSize: '22px', color: '#fff', letterSpacing: '0.08em', lineHeight: 1.1, marginBottom: '4px' }}>
          {copy.headline}
        </div>
        <div className="font-rajdhani" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.36)', lineHeight: 1.5 }}>
          {copy.sub}
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '18px', position: 'relative' }}>
        {(['signin', 'create'] as Mode[]).map(m => {
          const active = mode === m
          return (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className="font-bebas"
              style={{
                flex: 1, padding: '10px 0',
                background: 'transparent', border: 'none',
                color: active ? '#fff' : 'rgba(255,255,255,0.3)',
                fontSize: '13px', letterSpacing: '0.12em',
                cursor: 'pointer', transition: 'color 0.2s', position: 'relative',
              }}
            >
              {m === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
              {active && (
                <motion.div
                  layoutId="modal-auth-tab"
                  style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, #FF551F, #FFC857)', borderRadius: 1 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Full name — create only */}
        <AnimatePresence initial={false}>
          {mode === 'create' && (
            <motion.div key="modal-fullname"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: 'hidden' }}
            >
              <Field label="Full Name" placeholder="Your full name" value={fullName} onChange={setFullName} required autoComplete="name" />
            </motion.div>
          )}
        </AnimatePresence>

        <Field label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={setEmail} required autoComplete="email" />
        <Field
          label="Password" type="password"
          placeholder={mode === 'create' ? 'Create a strong password' : 'Your password'}
          value={password} onChange={setPassword} required
          autoComplete={mode === 'create' ? 'new-password' : 'current-password'}
        />

        {/* Confirm password — create only */}
        <AnimatePresence initial={false}>
          {mode === 'create' && (
            <motion.div key="modal-confirm"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.24, delay: 0.04, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: 'hidden' }}
            >
              <Field label="Confirm Password" type="password" placeholder="Repeat password" value={confirmPw} onChange={setConfirmPw} required autoComplete="new-password" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Forgot password */}
        <AnimatePresence initial={false}>
          {mode === 'signin' && (
            <motion.div key="modal-forgot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
              style={{ textAlign: 'right', marginTop: '-4px' }}
            >
              <Link href="/forgot-password" onClick={onClose}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,85,31,0.48)', letterSpacing: '0.1em', textDecoration: 'none', transition: 'color 0.16s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FF551F')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,85,31,0.48)')}
              >
                FORGOT PASSWORD?
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.015, boxShadow: '0 5px 28px rgba(255,85,31,0.35)' } : {}}
          whileTap={!loading ? { scale: 0.985 } : {}}
          transition={{ duration: 0.13 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            width: '100%', padding: '12px 18px', marginTop: '2px',
            background: loading ? 'rgba(255,85,31,0.5)' : 'linear-gradient(135deg, #FF551F 0%, #c73b10 100%)',
            border: 'none', borderRadius: '4px',
            color: '#fff', fontFamily: 'var(--font-bebas)', fontSize: '14px', letterSpacing: '0.12em', textTransform: 'uppercase',
            cursor: loading ? 'wait' : 'pointer',
            boxShadow: '0 4px 18px rgba(255,85,31,0.22)',
            transition: 'background 0.2s',
          }}
        >
          {loading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block', width: 11, height: 11, border: '2px solid rgba(255,255,255,0.28)', borderTopColor: '#fff', borderRadius: '50%' }}
              />
              AUTHENTICATING...
            </>
          ) : mode === 'signin' ? 'LOG IN TO BŌRYKU' : 'CREATE FREE ACCOUNT'}
        </motion.button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.14em' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
        </div>

        {/* Social row */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <SocialBtn provider="google" />
          <SocialBtn provider="apple" />
        </div>

        {/* Switch mode */}
        <p style={{ textAlign: 'center', fontFamily: 'var(--font-rajdhani)', fontSize: '13px', color: 'rgba(255,255,255,0.25)', margin: '2px 0 0' }}>
          {mode === 'signin' ? (
            <>
              New here?{' '}
              <button type="button" onClick={() => setMode('create')} style={{ background: 'none', border: 'none', color: '#FF551F', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0 }}>
                Create account →
              </button>
            </>
          ) : (
            <>
              Have an account?{' '}
              <button type="button" onClick={() => setMode('signin')} style={{ background: 'none', border: 'none', color: '#FF551F', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0 }}>
                Sign in →
              </button>
            </>
          )}
        </p>

        {/* Full-page link */}
        <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.16)', letterSpacing: '0.1em', margin: '0' }}>
          <Link href="/login" onClick={onClose} style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '1px' }}>
            VIEW FULL SIGN-IN PAGE
          </Link>
        </p>
      </form>
    </div>
  )
}

// ─── AuthModal ────────────────────────────────────────────────────────────────

export default function AuthModal({ isOpen, onClose, trigger = 'default', onSuccess }: AuthModalProps) {
  /* Body scroll lock */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else        document.body.style.overflow = ''
    return ()  => { document.body.style.overflow = '' }
  }, [isOpen])

  /* Escape key */
  useEffect(() => {
    if (!isOpen) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="auth-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 400,
            background: 'rgba(2,1,1,0.88)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          {/* Scan line sweep */}
          <motion.div
            initial={{ top: '-2%' }}
            animate={{ top: ['0%', '102%'] }}
            transition={{ duration: 6, delay: 0.3, ease: 'linear', repeat: Infinity, repeatDelay: 8 }}
            style={{ position: 'absolute', left: 0, right: 0, height: 2, pointerEvents: 'none', background: 'linear-gradient(90deg, transparent, rgba(255,85,31,0.22) 50%, transparent)' }}
          />

          {/* Grid overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,85,31,0.014) 1px,transparent 1px),linear-gradient(90deg,rgba(255,85,31,0.014) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

          {/* Modal card */}
          <motion.div
            key="auth-modal-card"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '880px',
              borderRadius: '10px',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              boxShadow: '0 32px 96px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,85,31,0.12)',
            }}
          >
            {/* ── Left: compact benefits panel ─────────────────────── */}
            <div
              className="auth-modal-benefits"
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(150deg, #0d0704 0%, #070503 65%, #050403 100%)',
                padding: '40px 36px',
                display: 'flex',
                flexDirection: 'column',
                gap: '28px',
              }}
            >
              {/* Decorative glow */}
              <div style={{ position: 'absolute', bottom: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,85,31,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,200,87,0.055) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, rgba(255,85,31,0.16) 40%, rgba(255,85,31,0.1) 60%, transparent)', pointerEvents: 'none' }} />

              {/* Headline */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,85,31,0.52)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  BŌRYKU ACCOUNT
                </div>
                <h3 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(28px,3vw,38px)', letterSpacing: '0.05em', color: '#fff', lineHeight: 1.05, margin: '0 0 10px' }}>
                  YOUR BUILD.<br />
                  YOUR MISSION.
                </h3>
                <p style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '14px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, margin: 0 }}>
                  Free forever. Join the overland community.
                </p>
              </div>

              {/* Compact benefits */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '14px' }}>
                  WHAT YOU GET
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {COMPACT_BENEFITS.map((b, i) => (
                    <motion.div
                      key={b}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.36, delay: 0.22 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                      <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, background: 'rgba(255,85,31,0.1)', border: '1px solid rgba(255,85,31,0.26)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                          <path d="M1 2.5l1.8 1.8L6 .7" stroke="#FF551F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '13px', color: 'rgba(255,255,255,0.62)' }}>{b}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Free pill */}
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <motion.div
                  animate={{ opacity: [1, 0.25, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 7px rgba(34,197,94,0.6)', flexShrink: 0 }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Free forever · No credit card
                </span>
              </div>
            </div>

            {/* ── Right: form ───────────────────────────────────────── */}
            <div
              style={{
                background: 'rgba(10,6,4,0.97)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                padding: '40px 36px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top accent line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(255,85,31,0.25) 50%, transparent)', pointerEvents: 'none' }} />

              <ModalForm trigger={trigger} onSuccess={onSuccess} onClose={onClose} />
            </div>

            {/* ── Close button ──────────────────────────────────────── */}
            <motion.button
              onClick={onClose}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.24, duration: 0.32 }}
              whileHover={{ background: 'rgba(255,85,31,0.12)', borderColor: 'rgba(255,85,31,0.55)', color: '#fff' }}
              style={{
                position: 'absolute', top: 16, right: 16, zIndex: 10,
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.16s',
              }}
              aria-label="Close"
            >
              ✕
            </motion.button>
          </motion.div>

          {/* Responsive: stack on mobile */}
          <style>{`
            @media (max-width: 640px) {
              .auth-modal-benefits { display: none !important; }
            }
            input::placeholder { color: rgba(255,255,255,0.2); }
            select option { background: #0f0a06; color: rgba(255,255,255,0.8); }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
