'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

type Mode = 'login' | 'signup'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0f0f0f',
  border: '1px solid rgba(255,85,31,0.25)',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: 'var(--font-rajdhani)',
  fontSize: '15px',
  padding: '11px 14px',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  color: 'rgba(255,255,255,0.42)',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom: '6px',
}

// Inner component that reads search params (must be inside Suspense)
function LoginForm() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<Mode>('login')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') setMode('signup')
  }, [searchParams])

  if (submitted) {
    return (
      <div style={{
        background: 'var(--carbon)', border: '1px solid rgba(255,85,31,0.35)',
        borderRadius: '6px', padding: '40px 32px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <div className="font-bebas" style={{ fontSize: '28px', color: '#fff', letterSpacing: '0.06em', marginBottom: '8px' }}>
          {mode === 'signup' ? 'ACCOUNT CREATED' : 'WELCOME BACK'}
        </div>
        <div className="font-rajdhani" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.48)', marginBottom: '24px' }}>
          {mode === 'signup'
            ? 'Your BŌRYKU account is ready. Start building your ultimate rig.'
            : 'You are now logged in. Continue your build where you left off.'}
        </div>
        <Link href="/build" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          GO TO BUILD PLANNER
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Mode toggle */}
      <div style={{
        display: 'flex',
        background: '#0f0f0f',
        borderRadius: '4px',
        padding: '3px',
        marginBottom: '24px',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        {(['login', 'signup'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="font-bebas"
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '3px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              letterSpacing: '0.08em',
              background: mode === m ? 'var(--orange)' : 'transparent',
              color: mode === m ? '#000' : 'rgba(255,255,255,0.38)',
              transition: 'all 0.18s',
            }}
          >
            {m === 'login' ? 'LOG IN' : 'SIGN UP'}
          </button>
        ))}
      </div>

      <form
        onSubmit={e => { e.preventDefault(); setSubmitted(true) }}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        {mode === 'signup' && (
          <div>
            <label style={labelStyle}>NAME</label>
            <input
              type="text"
              placeholder="Your name"
              required
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--orange)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,85,31,0.25)')}
            />
          </div>
        )}

        <div>
          <label style={labelStyle}>EMAIL</label>
          <input
            type="email"
            placeholder="you@example.com"
            required
            style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--orange)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,85,31,0.25)')}
          />
        </div>

        <div>
          <label style={labelStyle}>PASSWORD</label>
          <input
            type="password"
            placeholder={mode === 'signup' ? 'Create a password' : 'Your password'}
            required
            style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--orange)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,85,31,0.25)')}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '13px', fontSize: '14px', marginTop: '4px' }}
        >
          {mode === 'login' ? 'LOG IN TO BŌRYKU' : 'CREATE FREE ACCOUNT'}
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>OR</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
      </div>

      <Link
        href="/build"
        className="btn btn-ghost"
        style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}
      >
        CONTINUE WITHOUT ACCOUNT →
      </Link>
    </>
  )
}

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--dark)',
      backgroundImage: 'var(--bg-grid)',
      backgroundSize: 'var(--bg-grid-size)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ maxWidth: '420px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <SectionEyebrow>BŌRYKU ACCOUNT</SectionEyebrow>
          <h1 className="font-bebas" style={{ fontSize: 'clamp(36px, 6vw, 56px)', letterSpacing: '0.05em', color: '#fff', margin: '8px 0 4px' }}>
            SIGN IN
          </h1>
          <p className="font-rajdhani" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>
            Free forever. No credit card required.
          </p>
        </div>

        <div style={{
          background: 'var(--carbon)',
          border: '1px solid rgba(255,85,31,0.14)',
          borderRadius: '6px',
          padding: '28px',
        }}>
          <Suspense fallback={
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
              LOADING...
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>

        <p className="font-rajdhani" style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '16px' }}>
          By creating an account you agree to our{' '}
          <span style={{ color: 'rgba(255,85,31,0.5)' }}>Terms of Service</span>{' '}and{' '}
          <span style={{ color: 'rgba(255,85,31,0.5)' }}>Privacy Policy</span>.
        </p>
      </div>
    </div>
  )
}
