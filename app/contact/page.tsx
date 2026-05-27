'use client'

import { useState } from 'react'
import SectionEyebrow from '@/components/ui/SectionEyebrow'

const SUBJECTS = [
  'General Inquiry',
  'Build Consultation',
  'Installer Partnership',
  'Brand / Gear Partnership',
  'PRO Membership',
]

const CONTACT_CARDS = [
  { emoji: '📡', label: 'General', email: 'hello@boryku.com', desc: 'Questions, feedback, anything' },
  { emoji: '🔧', label: 'Build Consultation', email: 'builds@boryku.com', desc: 'Expert build configuration help' },
  { emoji: '🔩', label: 'Installer Partnership', email: 'installers@boryku.com', desc: 'Join the RYKU installer network' },
  { emoji: '📦', label: 'Brand Partnership', email: 'brands@boryku.com', desc: 'List your products on the platform' },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>

      {/* Header */}
      <section style={{ padding: '80px 24px 60px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,85,31,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,85,31,.022) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <SectionEyebrow>CONTACT</SectionEyebrow>
          <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(2.5rem,5vw,4rem)', letterSpacing: '0.04em', lineHeight: 0.9, marginTop: 12 }}>
            GET IN<br /><span style={{ color: 'var(--orange)' }}>TOUCH</span>
          </h1>
        </div>
      </section>

      {/* Main */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'start' }}>

        {/* Form */}
        <div style={{ background: 'var(--carbon)', border: '1px solid var(--border)', borderRadius: 4, padding: 40 }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>✓</div>
              <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', letterSpacing: '0.06em', color: '#4ade80', marginBottom: 12 }}>MESSAGE SENT</h2>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-2)' }}>We&apos;ll respond within 24–48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem', letterSpacing: '0.08em', marginBottom: 28 }}>SEND A MESSAGE</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    data-field="name"
                    type="text"
                    required
                    className="form-input"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    data-field="email"
                    type="email"
                    required
                    className="form-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Subject</label>
                <select
                  data-field="subject"
                  className="form-input form-select"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                >
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label className="form-label">Message</label>
                <textarea
                  data-field="message"
                  required
                  className="form-input"
                  placeholder="Tell us what you need..."
                  rows={6}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  style={{ resize: 'vertical', minHeight: 120 }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* Contact cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {CONTACT_CARDS.map(c => (
            <div key={c.label} style={{ background: 'var(--carbon)', border: '1px solid var(--border)', borderRadius: 4, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{c.emoji}</span>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1rem', letterSpacing: '0.08em' }}>{c.label}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--orange)', marginBottom: 4 }}>{c.email}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-3)' }}>{c.desc}</div>
            </div>
          ))}

          <div style={{ background: 'var(--carbon)', border: '1px solid var(--border)', borderRadius: 4, padding: 20, marginTop: 8 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>RESPONSE TIME</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-2)' }}>General: 24–48 hours</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-2)' }}>Partnerships: 2–5 business days</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-2)' }}>Build consultation: 1–2 business days</div>
          </div>
        </div>
      </section>
    </div>
  )
}
