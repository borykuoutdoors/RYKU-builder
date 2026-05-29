'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const PLATFORMS = [
  { value: 'tacoma',  label: 'Toyota Tacoma' },
  { value: '4runner', label: 'Toyota 4Runner' },
  { value: 'tundra',  label: 'Toyota Tundra' },
  { value: 'bronco',  label: 'Ford Bronco' },
  { value: 'wrangler',label: 'Jeep Wrangler' },
  { value: 'gladiator',label: 'Jeep Gladiator' },
  { value: 'f150',    label: 'Ford F-150' },
  { value: 'ram1500', label: 'Ram 1500' },
  { value: 'colorado',label: 'Chevy Colorado' },
  { value: 'other',   label: 'Other' },
]

export default function SignupPage() {
  const router = useRouter()

  const [callsign,   setCallsign]   = useState('')
  const [surname,    setSurname]    = useState('')
  const [channel,    setChannel]    = useState('')
  const [cipher,     setCipher]     = useState('')
  const [platform,   setPlatform]   = useState('')
  const [opCode,     setOpCode]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')

  const canSubmit = callsign && channel && cipher && cipher.length >= 8 && opCode

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setError('')
    setSubmitting(true)
    setTimeout(() => {
      router.push('/build')
    }, 1400)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px 40px',
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            letterSpacing: '0.2em',
            color: 'var(--orange)',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            OPERATOR REGISTRATION
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            letterSpacing: '0.04em',
            color: 'var(--text)',
            lineHeight: 1,
            marginBottom: '8px',
          }}>
            JOIN THE<br />
            <span style={{ color: 'var(--orange)' }}>BŌRYKU</span> NETWORK
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Create your operator profile and start building.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Callsign + Surname row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">CALLSIGN *</label>
              <input
                type="text"
                className="form-input"
                placeholder="ALPHA"
                value={callsign}
                onChange={e => setCallsign(e.target.value.toUpperCase())}
                autoComplete="username"
                maxLength={20}
                required
              />
            </div>
            <div>
              <label className="form-label">SURNAME</label>
              <input
                type="text"
                className="form-input"
                placeholder="Optional"
                value={surname}
                onChange={e => setSurname(e.target.value)}
                autoComplete="family-name"
              />
            </div>
          </div>

          {/* Channel (email) */}
          <div>
            <label className="form-label">CHANNEL (EMAIL) *</label>
            <input
              type="email"
              className="form-input"
              placeholder="operator@domain.com"
              value={channel}
              onChange={e => setChannel(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Cipher (password) */}
          <div>
            <label className="form-label">CIPHER (PASSWORD) *</label>
            <input
              type="password"
              className="form-input"
              placeholder="Min. 8 characters"
              value={cipher}
              onChange={e => setCipher(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
            {cipher.length > 0 && cipher.length < 8 && (
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
                letterSpacing: '0.1em', color: '#f87171', marginTop: '4px',
              }}>
                CIPHER MUST BE AT LEAST 8 CHARACTERS
              </p>
            )}
          </div>

          {/* Platform select */}
          <div>
            <label className="form-label">PRIMARY PLATFORM</label>
            <select
              className="form-input form-select"
              value={platform}
              onChange={e => setPlatform(e.target.value)}
            >
              <option value="">Select Vehicle</option>
              {PLATFORMS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Operator Code checkbox */}
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            cursor: 'pointer',
            padding: '14px 16px',
            background: opCode ? 'rgba(255,85,31,0.04)' : 'rgba(10,10,10,0.5)',
            border: `1px solid ${opCode ? 'rgba(255,85,31,0.25)' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: '3px',
            transition: 'all 0.2s',
          }}>
            <input
              type="checkbox"
              checked={opCode}
              onChange={e => setOpCode(e.target.checked)}
              style={{ marginTop: '2px', accentColor: 'var(--orange)', flexShrink: 0 }}
            />
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
                letterSpacing: '0.14em', color: 'var(--text-2)', marginBottom: '3px',
              }}>
                OPERATOR CODE OF CONDUCT *
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.5 }}>
                I agree to the{' '}
                <span style={{ color: 'var(--orange)', textDecoration: 'underline', cursor: 'pointer' }}>
                  Operator Terms
                </span>
                {' '}and{' '}
                <span style={{ color: 'var(--orange)', textDecoration: 'underline', cursor: 'pointer' }}>
                  Privacy Policy
                </span>
                . I understand that BŌRYKU is a build planning tool.
              </div>
            </div>
          </label>

          {error && (
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
              letterSpacing: '0.1em', color: '#f87171', textAlign: 'center',
            }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={!canSubmit || submitting}
            style={{
              width: '100%',
              justifyContent: 'center',
              opacity: canSubmit ? 1 : 0.4,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            {submitting ? (
              <>
                <span style={{
                  display: 'inline-block', width: 10, height: 10,
                  border: '2px solid #000', borderTopColor: 'transparent',
                  borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                }} />
                ACTIVATING...
              </>
            ) : (
              <>⚡ ACTIVATE OPERATOR</>
            )}
          </button>

          {/* Login link */}
          <p style={{
            textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-3)',
          }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--orange)', textDecoration: 'none' }}>
              LOG IN
            </Link>
          </p>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
