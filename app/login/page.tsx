'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'signin' | 'create'

// ─── Data ─────────────────────────────────────────────────────────────────────

const BENEFITS = [
  { id: 'builds',     label: 'Save Builds',            desc: 'Never lose your configuration' },
  { id: 'garage',     label: 'Create Your Garage',      desc: 'Multi-vehicle management' },
  { id: 'products',   label: 'Save Products',           desc: 'Gear wishlist & tracker' },
  { id: 'history',    label: 'Track Build History',     desc: 'Version control for your rig' },
  { id: 'community',  label: 'Community Builds',        desc: 'Join & showcase your setup' },
  { id: 'featured',   label: 'Build of the Month',      desc: 'Compete & get featured' },
  { id: 'pro',        label: 'Access Pro Features',     desc: 'Export, priority matching' },
  { id: 'installers', label: 'Connect With Installers', desc: 'Verified local shops' },
]

const VEHICLE_MAKES = ['Toyota', 'Ford', 'Jeep', 'Ram', 'Chevrolet', 'GMC', 'Land Rover', 'Other']

// ─── Shared field styles ──────────────────────────────────────────────────────

function getInputStyle(focused: boolean): React.CSSProperties {
  return {
    width: '100%',
    background: focused ? 'rgba(255,85,31,0.05)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${focused ? 'rgba(255,85,31,0.52)' : 'rgba(255,255,255,0.10)'}`,
    borderRadius: '4px',
    color: '#fff',
    fontFamily: 'var(--font-rajdhani)',
    fontSize: '15px',
    padding: '12px 14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.22s, background 0.22s, box-shadow 0.22s',
    boxShadow: focused ? '0 0 0 3px rgba(255,85,31,0.08)' : 'none',
  }
}

const fieldLabelBase: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  marginBottom: '7px',
  transition: 'color 0.22s',
}

const selectFieldStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '4px',
  color: 'rgba(255,255,255,0.7)',
  fontFamily: 'var(--font-rajdhani)',
  fontSize: '14px',
  padding: '11px 12px',
  outline: 'none',
  boxSizing: 'border-box',
}

// ─── AuthInput ────────────────────────────────────────────────────────────────

function AuthInput({
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
      <label style={{ ...fieldLabelBase, color: focused ? 'rgba(255,85,31,0.78)' : 'rgba(255,255,255,0.32)' }}>
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

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.14em' }}>
        OR
      </span>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
    </div>
  )
}

// ─── SocialBtn ────────────────────────────────────────────────────────────────

function SocialBtn({ provider }: { provider: 'google' | 'apple' }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        width: '100%', padding: '11px',
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.09)'}`,
        borderRadius: '4px',
        color: hovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.62)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.18s',
      }}
    >
      {provider === 'google' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M15.68 8.18c0-.57-.05-1.12-.14-1.64H8v3.1h4.3a3.67 3.67 0 0 1-1.6 2.41v2h2.6C14.82 12.64 15.68 10.58 15.68 8.18z" fill="#4285F4"/>
          <path d="M8 16c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01A5.03 5.03 0 0 1 8 13.02c-2.34 0-4.32-1.58-5.03-3.7H.3v2.07C1.62 14.18 4.6 16 8 16z" fill="#34A853"/>
          <path d="M2.97 9.32A5 5 0 0 1 2.71 8c0-.46.08-.91.26-1.32V4.6H.3A8 8 0 0 0 0 8c0 1.29.3 2.51.3 3.4l2.67-2.08z" fill="#FBBC05"/>
          <path d="M8 3.18c1.32 0 2.5.45 3.44 1.34l2.58-2.58C12.47.72 10.66 0 8 0A8 8 0 0 0 .3 4.6L2.97 6.68C3.68 4.56 5.66 3.18 8 3.18z" fill="#EA4335"/>
        </svg>
      ) : (
        <svg width="14" height="17" viewBox="0 0 14 17" fill="currentColor">
          <path d="M13.18 11.8c-.3.64-.44.93-.82 1.5-.54.8-1.3 1.78-2.24 1.8-.84.02-1.06-.55-2.2-.54-1.14 0-1.38.56-2.22.54-.94-.02-1.66-.9-2.2-1.7C1.68 11.1 1.2 8.3 2.14 6.46c.66-1.3 1.96-2.08 3.16-2.08 1.18 0 1.92.55 2.9.55.94 0 1.52-.56 2.87-.56 1.06 0 2.2.58 3 1.58-2.64 1.44-2.22 5.22.11 5.85zM9.62 3.7c.52-.62.92-1.5.78-2.4-.78.06-1.7.54-2.24 1.18-.48.6-.92 1.48-.76 2.34.84.02 1.7-.5 2.22-1.12z"/>
        </svg>
      )}
      Continue with {provider === 'google' ? 'Google' : 'Apple'}
    </button>
  )
}

// ─── BenefitRow ───────────────────────────────────────────────────────────────

function BenefitRow({ benefit, index }: { benefit: typeof BENEFITS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.42, delay: 0.44 + index * 0.055, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(255,85,31,0.1)',
        border: '1px solid rgba(255,85,31,0.28)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
          <path d="M1 3l2 2 4-4" stroke="#FF551F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.72)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {benefit.label}
        </div>
        <div style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '12px', color: 'rgba(255,255,255,0.28)', lineHeight: 1.4 }}>
          {benefit.desc}
        </div>
      </div>
    </motion.div>
  )
}

// ─── AuthFormInner (uses useSearchParams — must live inside Suspense) ─────────

function AuthFormInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [mode, setMode]                     = useState<Mode>(searchParams.get('mode') === 'create' ? 'create' : 'signin')
  const [loading, setLoading]               = useState(false)
  const [success, setSuccess]               = useState(false)
  const [email, setEmail]                   = useState('')
  const [password, setPassword]             = useState('')
  const [fullName, setFullName]             = useState('')
  const [confirmPw, setConfirmPw]           = useState('')
  const [vehicleMake, setVehicleMake]       = useState('')
  const [vehicleModel, setVehicleModel]     = useState('')
  const [vehicleYear, setVehicleYear]       = useState('')
  const [showVehicle, setShowVehicle]       = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // TODO: replace with Supabase Auth call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => router.push('/build'), 1500)
    }, 1700)
  }

  // ── Success state ────────────────────────────────────────────────────────────
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', padding: '32px 0 20px' }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.08, duration: 0.48, type: 'spring', stiffness: 280, damping: 22 }}
          style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'rgba(255,85,31,0.1)',
            border: '1px solid rgba(255,85,31,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 28px rgba(255,85,31,0.18)',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <motion.path
              d="M4 13l6 6L22 5"
              stroke="#FF551F"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.28, duration: 0.5, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>

        <div className="font-bebas" style={{ fontSize: '26px', color: '#fff', letterSpacing: '0.08em', marginBottom: '8px' }}>
          {mode === 'create' ? 'WELCOME TO BŌRYKU' : 'WELCOME BACK'}
        </div>
        <div className="font-rajdhani" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
          {mode === 'create' ? 'Your account is ready.' : 'Session initiated.'}<br />
          Redirecting to the build planner…
        </div>

        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.4, duration: 1.3, ease: 'easeInOut' }}
          style={{
            height: 2, borderRadius: 2, marginTop: 24,
            background: 'linear-gradient(to right, #FF551F, #FFC857)',
          }}
        />
      </motion.div>
    )
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Mode toggle */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        marginBottom: '24px',
        position: 'relative',
      }}>
        {(['signin', 'create'] as Mode[]).map(m => {
          const active = mode === m
          return (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className="font-bebas"
              style={{
                flex: 1,
                padding: '12px 0',
                background: 'transparent',
                border: 'none',
                color: active ? '#fff' : 'rgba(255,255,255,0.3)',
                fontSize: '14px',
                letterSpacing: '0.12em',
                cursor: 'pointer',
                transition: 'color 0.2s',
                position: 'relative',
              }}
            >
              {m === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
              {active && (
                <motion.div
                  layoutId="auth-mode-indicator"
                  style={{
                    position: 'absolute',
                    bottom: -1, left: 0, right: 0,
                    height: 2,
                    background: 'linear-gradient(to right, #FF551F, #FFC857)',
                    borderRadius: 1,
                  }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Full name — create only */}
        <AnimatePresence initial={false}>
          {mode === 'create' && (
            <motion.div
              key="fullname"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <AuthInput
                label="Full Name"
                placeholder="Your full name"
                value={fullName}
                onChange={setFullName}
                required
                autoComplete="name"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AuthInput
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          required
          autoComplete="email"
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder={mode === 'create' ? 'Create a strong password' : 'Your password'}
          value={password}
          onChange={setPassword}
          required
          autoComplete={mode === 'create' ? 'new-password' : 'current-password'}
        />

        {/* Confirm password — create only */}
        <AnimatePresence initial={false}>
          {mode === 'create' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.26, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <AuthInput
                label="Confirm Password"
                type="password"
                placeholder="Repeat your password"
                value={confirmPw}
                onChange={setConfirmPw}
                required
                autoComplete="new-password"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vehicle section — create only */}
        <AnimatePresence initial={false}>
          {mode === 'create' && (
            <motion.div
              key="vehicle-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.26, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <button
                type="button"
                onClick={() => setShowVehicle(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: showVehicle ? 'rgba(255,85,31,0.05)' : 'transparent',
                  border: `1px dashed ${showVehicle ? 'rgba(255,85,31,0.38)' : 'rgba(255,85,31,0.2)'}`,
                  borderRadius: '4px',
                  padding: '9px 14px',
                  color: showVehicle ? 'rgba(255,85,31,0.82)' : 'rgba(255,85,31,0.48)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.18s',
                }}
              >
                <span>{showVehicle ? '▾' : '▸'}</span>
                Add My Vehicle (Optional)
              </button>

              <AnimatePresence>
                {showVehicle && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}
                  >
                    <div>
                      <label style={{ ...fieldLabelBase, color: 'rgba(255,255,255,0.25)' }}>Make</label>
                      <select value={vehicleMake} onChange={e => setVehicleMake(e.target.value)} style={selectFieldStyle}>
                        <option value="">Select</option>
                        {VEHICLE_MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ ...fieldLabelBase, color: 'rgba(255,255,255,0.25)' }}>Model</label>
                      <input
                        type="text" placeholder="e.g. Tacoma"
                        value={vehicleModel} onChange={e => setVehicleModel(e.target.value)}
                        style={{ ...selectFieldStyle, color: '#fff' }}
                      />
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={{ ...fieldLabelBase, color: 'rgba(255,255,255,0.25)' }}>Year</label>
                      <input
                        type="text" placeholder="e.g. 2023" maxLength={4}
                        value={vehicleYear} onChange={e => setVehicleYear(e.target.value)}
                        style={{ ...selectFieldStyle, color: '#fff' }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Forgot password — sign in only */}
        <AnimatePresence initial={false}>
          {mode === 'signin' && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ textAlign: 'right', marginTop: '-4px' }}
            >
              <Link
                href="/forgot-password"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,85,31,0.48)', letterSpacing: '0.1em', textDecoration: 'none', transition: 'color 0.16s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FF551F')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,85,31,0.48)')}
              >
                FORGOT PASSWORD?
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary CTA */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.015, boxShadow: '0 6px 32px rgba(255,85,31,0.38)' } : {}}
          whileTap={!loading ? { scale: 0.985 } : {}}
          transition={{ duration: 0.14 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            width: '100%', padding: '13px 20px', marginTop: '2px',
            background: loading ? 'rgba(255,85,31,0.55)' : 'linear-gradient(135deg, #FF551F 0%, #c73b10 100%)',
            border: 'none', borderRadius: '4px',
            color: '#fff',
            fontFamily: 'var(--font-bebas)',
            fontSize: '15px', letterSpacing: '0.12em', textTransform: 'uppercase',
            cursor: loading ? 'wait' : 'pointer',
            boxShadow: '0 4px 20px rgba(255,85,31,0.22)',
            transition: 'background 0.2s',
          }}
        >
          {loading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                style={{
                  display: 'inline-block', width: 12, height: 12,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                }}
              />
              AUTHENTICATING...
            </>
          ) : mode === 'signin' ? 'LOG IN TO BŌRYKU' : 'CREATE FREE ACCOUNT'}
        </motion.button>

        <Divider />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SocialBtn provider="google" />
          <SocialBtn provider="apple" />
        </div>

        {/* Switch mode */}
        <p style={{ textAlign: 'center', fontFamily: 'var(--font-rajdhani)', fontSize: '13px', color: 'rgba(255,255,255,0.27)', margin: '2px 0 0' }}>
          {mode === 'signin' ? (
            <>
              New here?{' '}
              <button type="button" onClick={() => setMode('create')} style={{ background: 'none', border: 'none', color: '#FF551F', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0 }}>
                Create an account →
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('signin')} style={{ background: 'none', border: 'none', color: '#FF551F', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0 }}>
                Sign in →
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#040404' }}>

      {/* ── LEFT: Benefits panel ──────────────────────────────────────── */}
      <motion.div
        className="auth-left"
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{
          flex: '0 0 48%',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(150deg, #0d0704 0%, #070503 60%, #040404 100%)',
          padding: 'clamp(80px,8vh,104px) clamp(36px,5vw,60px) 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '36px',
        }}
      >
        {/* Grid texture */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'var(--bg-grid)', backgroundSize: 'var(--bg-grid-size)', opacity: 0.35 }} />

        {/* Orange glow — bottom-left */}
        <div style={{ position: 'absolute', bottom: -120, left: -120, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,85,31,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Gold accent — top-right */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,200,87,0.055) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Right-edge separator */}
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, rgba(255,85,31,0.18) 30%, rgba(255,85,31,0.1) 70%, transparent)', pointerEvents: 'none' }} />

        {/* ── Logo + headline ───────────────────────────────────────── */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,85,31,0.55)', letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: '14px' }}>
              OPERATOR ACCESS
            </div>

            <h2 style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(38px, 3.8vw, 56px)',
              letterSpacing: '0.04em',
              color: '#fff',
              lineHeight: 1.04,
              margin: '0 0 14px',
            }}>
              YOUR BUILD.<br />
              YOUR MISSION.
            </h2>

            <p style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '15px', color: 'rgba(255,255,255,0.36)', lineHeight: 1.65, margin: 0, maxWidth: '300px' }}>
              Join the BŌRYKU network. Plan, track, and share your overland build with a platform built for the mission.
            </p>
          </motion.div>
        </div>

        {/* ── Benefits list ─────────────────────────────────────────── */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '16px' }}>
            ACCOUNT BENEFITS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {BENEFITS.map((b, i) => (
              <BenefitRow key={b.id} benefit={b} index={i} />
            ))}
          </div>
        </div>

        {/* ── Free forever status ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <motion.div
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.65)', flexShrink: 0 }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.27)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Free forever · No credit card required
          </span>
        </motion.div>
      </motion.div>

      {/* ── RIGHT: Auth form ──────────────────────────────────────────── */}
      <motion.div
        className="auth-right"
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(80px,10vh,104px) clamp(20px,5vw,48px) 40px',
          background: '#060504',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top scan line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(255,85,31,0.28) 50%, transparent)', pointerEvents: 'none' }} />

        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,85,31,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>

          {/* Glassmorphism card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'rgba(14,9,5,0.84)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,85,31,0.13)',
              borderRadius: '8px',
              padding: 'clamp(28px,4vw,40px)',
              boxShadow: '0 28px 72px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.024)',
            }}
          >
            {/* Card eyebrow */}
            <div style={{ textAlign: 'center', marginBottom: '6px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,85,31,0.48)', letterSpacing: '0.24em', textTransform: 'uppercase' }}>
                BŌRYKU // SECURE ACCESS
              </div>
            </div>

            <Suspense fallback={
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em' }}>
                INITIALIZING...
              </div>
            }>
              <AuthFormInner />
            </Suspense>
          </motion.div>

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            style={{ textAlign: 'center', fontFamily: 'var(--font-rajdhani)', fontSize: '12px', color: 'rgba(255,255,255,0.17)', marginTop: '16px', lineHeight: 1.6 }}
          >
            By continuing you agree to our{' '}
            <Link href="/terms" style={{ color: 'rgba(255,85,31,0.42)', textDecoration: 'none' }}>Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" style={{ color: 'rgba(255,85,31,0.42)', textDecoration: 'none' }}>Privacy Policy</Link>.
          </motion.p>
        </div>
      </motion.div>

      {/* ── Responsive + misc ─────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .auth-left  { display: none !important; }
          .auth-right { padding: 90px 20px 40px !important; }
        }
        select option { background: #0f0a06; color: rgba(255,255,255,0.8); }
        input::placeholder { color: rgba(255,255,255,0.22); }
      `}</style>
    </div>
  )
}
