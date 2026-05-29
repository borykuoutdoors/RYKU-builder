'use client'

import { useState, useRef, useEffect } from 'react'
import SectionEyebrow from '@/components/ui/SectionEyebrow'
import BtnColorful from '@/components/ui/BtnColorful'

// ─── Subject options ─────────────────────────────────────────────────────────

const SUBJECTS = [
  'General Inquiry',
  'Build Consultation',
  'Installer Partnership',
  'Brand Partnership',
  'PRO Membership',
] as const

type SubjectType = typeof SUBJECTS[number]

// ─── Contact info cards ───────────────────────────────────────────────────────

const CONTACT_CARDS = [
  {
    icon: '📬',
    label: 'General',
    email: 'hello@boryku.com',
    desc: 'Questions, feedback, and general inquiries.',
  },
  {
    icon: '🔩',
    label: 'Build Consultation',
    email: 'builds@boryku.com',
    desc: 'Get expert help planning your overland build.',
  },
  {
    icon: '🏪',
    label: 'Installer Partnership',
    email: 'installers@boryku.com',
    desc: 'Join the RYKU certified installer network.',
  },
  {
    icon: '🤝',
    label: 'Brand Partnership',
    email: 'brands@boryku.com',
    desc: 'List your gear or explore co-marketing.',
  },
]

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  name: string
  email: string
  subject: SubjectType
  message: string
}

const DEFAULT_FORM: FormState = {
  name: '',
  email: '',
  subject: 'General Inquiry',
  message: '',
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(8,10,20,0.88)',
  border: '1px solid rgba(255,85,31,0.25)',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: 'var(--font-rajdhani)',
  fontSize: '15px',
  padding: '11px 14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.18s',
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // Wire up submit via addEventListener — no inline onSubmit handler
  useEffect(() => {
    const formEl = formRef.current
    if (!formEl) return

    const handleSubmit = (e: Event) => {
      e.preventDefault()
      if (isLoading) return
      setIsLoading(true)
      // Simulate async submission
      setTimeout(() => {
        setIsLoading(false)
        setSubmitted(true)
        setForm(DEFAULT_FORM)
      }, 1200)
    }

    formEl.addEventListener('submit', handleSubmit)
    return () => formEl.removeEventListener('submit', handleSubmit)
  }, [isLoading])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div
      style={{
        minHeight: '100vh',
      }}
    >
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: '48px 24px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,85,31,0.014) 1px,transparent 1px),linear-gradient(90deg,rgba(255,85,31,0.014) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,85,31,0.055) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <SectionEyebrow>CONTACT</SectionEyebrow>
          <h1
            className="font-bebas"
            style={{
              fontSize: 'clamp(40px, 6vw, 72px)',
              letterSpacing: '0.05em',
              color: '#fff',
              margin: '8px 0',
            }}
          >
            GET IN TOUCH
          </h1>
          <p
            className="font-rajdhani"
            style={{ color: 'rgba(255,255,255,0.48)', fontSize: '16px', margin: 0 }}
          >
            We respond within 24 hours on business days
          </p>
        </div>
      </div>

      {/* ── Two-column body ───────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '48px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'start',
        }}
      >
        {/* ── LEFT: Contact form ──────────────────────────────────────────── */}
        <div>
          {submitted ? (
            /* Success state */
            <div
              style={{
                background: 'rgba(8,10,20,0.72)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,85,31,0.35)',
                borderRadius: '6px',
                padding: '40px 28px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div style={{ fontSize: '48px' }}>✅</div>
              <div
                className="font-bebas"
                style={{ fontSize: '28px', color: '#fff', letterSpacing: '0.06em' }}
              >
                MESSAGE SENT
              </div>
              <div
                className="font-rajdhani"
                style={{ fontSize: '15px', color: 'rgba(255,255,255,0.52)', maxWidth: '320px' }}
              >
                Thanks for reaching out. We&apos;ll get back to you within 24 hours.
              </div>
              <button
                className="btn btn-ghost"
                style={{ marginTop: '8px' }}
                onClick={() => setSubmitted(false)}
                data-action="send-another"
              >
                SEND ANOTHER MESSAGE
              </button>
            </div>
          ) : (
            <form ref={formRef} noValidate data-form="contact">
              <div
                style={{
                  background: 'rgba(8,10,20,0.72)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,85,31,0.14)',
                  borderRadius: '6px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                }}
              >
                <div
                  className="font-bebas"
                  style={{ fontSize: '22px', color: '#fff', letterSpacing: '0.06em', marginBottom: '4px' }}
                >
                  SEND A MESSAGE
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="contact-name" style={labelStyle}>NAME</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    data-input="name"
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--orange)' }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,85,31,0.25)' }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" style={labelStyle}>EMAIL</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    data-input="email"
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--orange)' }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,85,31,0.25)' }}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="contact-subject" style={labelStyle}>SUBJECT</label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    data-input="subject"
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--orange)' }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,85,31,0.25)' }}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" style={labelStyle}>MESSAGE</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what&apos;s on your mind..."
                    required
                    rows={5}
                    data-input="message"
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--orange)' }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,85,31,0.25)' }}
                  />
                </div>

                {/* Submit */}
                <BtnColorful
                  type="submit"
                  variant="secondary"
                  arrow
                  style={{ width: '100%' }}
                  disabled={isLoading}
                  data-action="submit-contact"
                >
                  {isLoading ? 'SENDING...' : 'SEND MESSAGE'}
                </BtnColorful>
              </div>
            </form>
          )}
        </div>

        {/* ── RIGHT: Contact info cards ───────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {CONTACT_CARDS.map((card) => (
            <div
              key={card.label}
              style={{
                background: 'rgba(8,10,20,0.72)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,85,31,0.12)',
                borderRadius: '6px',
                padding: '18px 20px',
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
                transition: 'border-color 0.18s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,85,31,0.35)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,85,31,0.12)'
              }}
            >
              <span style={{ fontSize: '28px', lineHeight: 1, flexShrink: 0 }}>{card.icon}</span>
              <div>
                <div
                  className="font-bebas"
                  style={{ fontSize: '17px', color: '#fff', letterSpacing: '0.06em', marginBottom: '3px' }}
                >
                  {card.label}
                </div>
                <a
                  href={`mailto:${card.email}`}
                  className="font-mono"
                  style={{
                    fontSize: '12px',
                    color: 'var(--orange)',
                    textDecoration: 'none',
                    letterSpacing: '0.04em',
                  }}
                >
                  {card.email}
                </a>
                <div
                  className="font-rajdhani"
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.4)',
                    marginTop: '4px',
                    lineHeight: 1.4,
                  }}
                >
                  {card.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
