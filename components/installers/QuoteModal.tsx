'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BtnColorful from '@/components/ui/BtnColorful'
import type { Installer } from '@/types/installer'

// ── Services the user can request ─────────────────────────────────────────────
const QUOTE_SERVICES = [
  'Suspension Install', 'Roof Rack Install', 'Lighting Install',
  'RTT Install', 'Recovery Gear', 'Armor / Bumper Install',
  'Electrical Systems', 'Fabrication', 'Full Build Shop',
]

// ── Input helper ──────────────────────────────────────────────────────────────
function QInput({
  label, value, onChange, placeholder, type = 'text', required,
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; required?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{
        display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px',
        color: focused ? 'rgba(255,85,31,0.85)' : 'rgba(255,255,255,0.38)',
        letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6,
        transition: 'color 0.15s',
      }}>
        {label}{required && <span style={{ color: 'rgba(255,85,31,0.7)', marginLeft: 3 }}>*</span>}
      </label>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${focused ? 'rgba(255,85,31,0.6)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 4, color: '#fff',
          fontFamily: 'var(--font-mono)', fontSize: '13px',
          padding: '10px 14px', outline: 'none', letterSpacing: '0.04em',
          boxSizing: 'border-box',
          boxShadow: focused ? '0 0 0 3px rgba(255,85,31,0.1)' : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      />
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  installer: Installer | null
  onClose: () => void
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function QuoteModal({ installer, onClose }: Props) {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [services, setServices] = useState<string[]>([])
  const [notes,    setNotes]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [sent,     setSent]     = useState(false)

  // Pre-select installer's services when opened
  useEffect(() => {
    if (installer) setServices(installer.services.slice())
  }, [installer?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Escape key
  useEffect(() => {
    if (!installer) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [installer]) // eslint-disable-line react-hooks/exhaustive-deps

  // Body scroll lock
  useEffect(() => {
    if (installer) document.body.style.overflow = 'hidden'
    else           document.body.style.overflow = ''
    return ()   => { document.body.style.overflow = '' }
  }, [installer])

  function toggleService(s: string) {
    setServices(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
  }

  function close() {
    onClose()
    setTimeout(() => {
      setSent(false); setName(''); setEmail('')
      setPhone(''); setServices([]); setNotes('')
    }, 350)
  }

  const canSubmit = name.trim() && email.trim() && !loading

  return (
    <AnimatePresence>
      {installer && (
        <motion.div
          key="quote-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 600,
            background: 'rgba(2,4,8,0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          <motion.div
            key="quote-card"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 580,
              maxHeight: '88vh', overflowY: 'auto',
              background: 'linear-gradient(160deg, #080c0f 0%, #0f1114 100%)',
              border: '1px solid rgba(255,85,31,0.22)',
              borderRadius: 8,
              padding: '36px 32px 32px',
              position: 'relative',
            }}
          >
            {/* Orange bloom */}
            <div style={{
              position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
              width: 280, height: 140, borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(255,85,31,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* Close button */}
            <button onClick={close} style={{
              position: 'absolute', top: 16, right: 16,
              width: 32, height: 32,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%', color: 'rgba(255,255,255,0.38)',
              cursor: 'pointer', fontSize: 13, display: 'flex',
              alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
              zIndex: 1,
            }}
            onMouseEnter={e => { Object.assign(e.currentTarget.style, { background: 'rgba(255,85,31,0.12)', color: '#fff', borderColor: 'rgba(255,85,31,0.4)' }) }}
            onMouseLeave={e => { Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.38)', borderColor: 'rgba(255,255,255,0.1)' }) }}
            aria-label="Close">✕</button>

            <AnimatePresence mode="wait">
              {sent ? (
                /* ── Success state ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ textAlign: 'center', padding: '32px 0 16px', position: 'relative', zIndex: 1 }}
                >
                  {/* Checkmark */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                    style={{
                      width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
                      background: 'rgba(155,191,106,0.12)',
                      border: '2px solid rgba(155,191,106,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
                      <motion.path
                        d="M2 11l7.5 7.5L26 2"
                        stroke="#9BBF6A" strokeWidth="3.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
                      />
                    </svg>
                  </motion.div>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,85,31,0.6)', letterSpacing: '0.22em', marginBottom: 10 }}>
                    QUOTE REQUEST SENT
                  </div>
                  <h3 className="font-bebas" style={{ fontSize: 28, color: '#fff', letterSpacing: '0.06em', marginBottom: 12 }}>
                    WE&apos;LL BE IN TOUCH
                  </h3>
                  <p className="font-rajdhani" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.65, marginBottom: 28, maxWidth: 360, margin: '0 auto 28px' }}>
                    Your quote request has been sent to <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{installer.name}</strong>.
                    Expect a response within 24–48 hours. Check your email for confirmation.
                  </p>
                  <BtnColorful variant="secondary" onClick={close} style={{ minWidth: 160 }}>
                    CLOSE
                  </BtnColorful>
                </motion.div>
              ) : (
                /* ── Form state ── */
                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  {/* Header */}
                  <div style={{ position: 'relative', zIndex: 1, marginBottom: 24 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,85,31,0.6)', letterSpacing: '0.22em', marginBottom: 6 }}>
                      REQUEST A QUOTE
                    </div>
                    <h2 className="font-bebas" style={{ fontSize: 28, color: '#fff', letterSpacing: '0.06em', marginBottom: 4 }}>
                      {installer.name.toUpperCase()}
                    </h2>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,85,31,0.8)' }}>
                        📍 {installer.city}, {installer.state}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#FFC857' }}>
                        ★ {installer.rating} ({installer.reviews} reviews)
                      </span>
                      {installer.verified && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(102,255,255,0.85)', border: '1px solid rgba(102,255,255,0.3)', borderRadius: 2, padding: '1px 6px' }}>
                          RYKU VERIFIED
                        </span>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Name + email */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <QInput label="Your Name" value={name} onChange={setName} placeholder="John Muir" required />
                      <QInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" required />
                    </div>

                    <QInput label="Phone (optional)" type="tel" value={phone} onChange={setPhone} placeholder="(555) 000-0000" />

                    {/* Services */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.38)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10 }}>
                        SERVICES NEEDED
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                        {QUOTE_SERVICES.map(s => {
                          const active = services.includes(s)
                          return (
                            <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                              <input
                                type="checkbox" checked={active} onChange={() => toggleService(s)}
                                style={{ accentColor: 'var(--orange)', width: 13, height: 13, flexShrink: 0, cursor: 'pointer' }}
                              />
                              <span style={{
                                fontFamily: 'var(--font-mono)', fontSize: '11px',
                                color: active ? 'rgba(255,85,31,0.9)' : 'rgba(255,255,255,0.45)',
                                letterSpacing: '0.04em', transition: 'color 0.15s',
                              }}>
                                {s}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.38)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6 }}>
                        ADDITIONAL NOTES
                      </label>
                      <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Describe your vehicle, build goals, or any special requirements..."
                        rows={3}
                        style={{
                          width: '100%', background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4,
                          color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '13px',
                          padding: '10px 14px', outline: 'none', resize: 'vertical',
                          boxSizing: 'border-box', letterSpacing: '0.03em',
                          transition: 'border-color 0.15s',
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,85,31,0.55)' }}
                        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                      />
                    </div>

                    {/* Submit */}
                    <BtnColorful
                      type="submit"
                      variant="primary"
                      disabled={!canSubmit}
                      arrow
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {loading ? 'SENDING REQUEST…' : 'SEND QUOTE REQUEST'}
                    </BtnColorful>

                    <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                      RESPONSE WITHIN 24–48 HOURS · NO OBLIGATION · FREE ESTIMATE
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
