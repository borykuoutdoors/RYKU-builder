'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import ShineBorder from '@/components/ui/ShineBorder'
import BtnColorful from '@/components/ui/BtnColorful'

// ─── Types ────────────────────────────────────────────────────────────────────

export type UpgradeTrigger =
  | 'default'
  | 'save-build'
  | 'pdf-export'
  | 'build-history'
  | 'garage'
  | 'installer-access'
  | 'supply-drop'

export interface UpgradeModalProps {
  isOpen:    boolean
  onClose:   () => void
  trigger?:  UpgradeTrigger
  onUpgrade?: () => void
}

// ─── Trigger copy ─────────────────────────────────────────────────────────────

const TRIGGER_COPY: Record<UpgradeTrigger, { eyebrow: string; headline: string; sub: string; highlightFeature?: string }> = {
  'default':           { eyebrow: 'RYKU PRO',        headline: 'UPGRADE YOUR BUILD',       sub: 'Unlock the full BŌRYKU platform experience.',                          highlightFeature: 'Unlimited Builds' },
  'save-build':        { eyebrow: 'BUILD STORAGE',   headline: 'SAVE UNLIMITED BUILDS',    sub: 'Your free plan saves 1 build. Pro stores as many as you need.',         highlightFeature: 'Unlimited Saved Builds' },
  'pdf-export':        { eyebrow: 'PDF EXPORT',      headline: 'EXPORT YOUR BUILD SHEET',  sub: 'Pro subscribers can export full PDF build sheets with specs and costs.', highlightFeature: 'PDF Build Exports' },
  'build-history':     { eyebrow: 'BUILD HISTORY',   headline: 'TRACK EVERY REVISION',     sub: 'Pro keeps a full version history of every change to your rigs.',        highlightFeature: 'Build History' },
  'garage':            { eyebrow: 'VEHICLE GARAGE',  headline: 'MANAGE MULTIPLE RIGS',     sub: 'Create a full garage with separate builds for every vehicle you own.',   highlightFeature: 'Vehicle Garage' },
  'installer-access':  { eyebrow: 'INSTALLER MATCH', headline: 'UNLOCK FULL ACCESS',       sub: 'Pro gives you full installer access and priority matching.',             highlightFeature: 'Full Installer Access' },
  'supply-drop':       { eyebrow: 'SUPPLY DROP',     headline: 'JOIN MONTHLY GIVEAWAYS',   sub: 'Pro members get entries in our monthly Supply Drop gear giveaway.',      highlightFeature: 'Monthly Supply Drop Entries' },
}

// ─── Pro features (compact list) ─────────────────────────────────────────────

const PRO_FEATURES = [
  'Unlimited Builds & Saves',
  'PDF Build Exports',
  'Vehicle Garage (multi-rig)',
  'Build History & Versioning',
  'Full Installer Access',
  'Advanced Build Planner',
  'Monthly Supply Drop Entries',
]

// ─── UpgradeModal ─────────────────────────────────────────────────────────────

export default function UpgradeModal({ isOpen, onClose, trigger = 'default', onUpgrade }: UpgradeModalProps) {
  const copy = TRIGGER_COPY[trigger]
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  const price = billing === 'monthly' ? '$12.99' : '$10.39'
  const priceSub = billing === 'monthly' ? '/month' : '/month · billed annually'

  /* Body scroll lock */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else        document.body.style.overflow = ''
    return ()  => { document.body.style.overflow = '' }
  }, [isOpen])

  /* Escape */
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
          key="upgrade-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.26, ease: 'easeOut' }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 400,
            background: 'rgba(2,1,0,0.88)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          {/* Grid overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,85,31,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,85,31,0.012) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

          {/* Scan sweep */}
          <motion.div
            initial={{ top: '0%' }}
            animate={{ top: ['0%', '102%'] }}
            transition={{ duration: 7, delay: 0.3, ease: 'linear', repeat: Infinity, repeatDelay: 9 }}
            style={{ position: 'absolute', left: 0, right: 0, height: 1, pointerEvents: 'none', background: 'linear-gradient(90deg, transparent, rgba(255,85,31,0.18) 50%, transparent)' }}
          />

          {/* Card */}
          <motion.div
            key="upgrade-card"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', width: '100%', maxWidth: '500px' }}
          >
            <ShineBorder variant="premium" borderRadius={8} style={{ width: '100%' }}>
              <div style={{
                background: 'linear-gradient(160deg, #130a05 0%, #1a0e08 50%, #1e1e1e 100%)',
                borderRadius: '7px',
                padding: '36px 32px 32px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Orange bloom */}
                <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 320, height: 200, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,85,31,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

                {/* Close button */}
                <button
                  onClick={onClose}
                  style={{
                    position: 'absolute', top: 16, right: 16,
                    width: 32, height: 32,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    color: 'rgba(255,255,255,0.38)',
                    cursor: 'pointer', fontSize: '13px',
                    transition: 'all 0.16s',
                    zIndex: 1,
                  }}
                  onMouseEnter={e => { const t = e.currentTarget; t.style.background = 'rgba(255,85,31,0.1)'; t.style.color = '#fff'; t.style.borderColor = 'rgba(255,85,31,0.4)' }}
                  onMouseLeave={e => { const t = e.currentTarget; t.style.background = 'rgba(255,255,255,0.04)'; t.style.color = 'rgba(255,255,255,0.38)'; t.style.borderColor = 'rgba(255,255,255,0.1)' }}
                  aria-label="Close"
                >
                  ✕
                </button>

                {/* Eyebrow */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,85,31,0.6)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    {copy.eyebrow}
                  </div>
                  <h2 className="font-bebas" style={{ fontSize: '30px', letterSpacing: '0.08em', color: '#fff', margin: '0 0 6px', lineHeight: 1.05 }}>
                    {copy.headline}
                  </h2>
                  <p className="font-rajdhani" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.6, margin: '0 0 24px' }}>
                    {copy.sub}
                  </p>
                </motion.div>

                {/* Price + toggle */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.18, duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'relative', zIndex: 1,
                    background: 'rgba(255,85,31,0.06)',
                    border: '1px solid rgba(255,85,31,0.16)',
                    borderRadius: '6px',
                    padding: '16px 18px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px' }}>
                      <span className="font-bebas" style={{ fontSize: '38px', color: '#fff', letterSpacing: '0.02em', lineHeight: 1 }}>
                        {price}
                      </span>
                      <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.32)', letterSpacing: '0.07em', paddingBottom: '5px' }}>
                        {priceSub}
                      </span>
                    </div>
                    {billing === 'annual' && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#22c55e', letterSpacing: '0.1em', marginTop: '2px' }}>
                        SAVE 20% VS MONTHLY
                      </div>
                    )}
                  </div>

                  {/* Billing toggle */}
                  <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '3px' }}>
                    {(['monthly', 'annual'] as const).map(b => {
                      const active = billing === b
                      return (
                        <button
                          key={b}
                          onClick={() => setBilling(b)}
                          className="font-mono"
                          style={{
                            padding: '5px 10px', borderRadius: '3px', border: 'none',
                            background: active ? 'rgba(255,85,31,0.75)' : 'transparent',
                            color: active ? '#fff' : 'rgba(255,255,255,0.35)',
                            fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.16s',
                          }}
                        >
                          {b === 'monthly' ? 'MO' : 'YR'}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.24, duration: 0.36 }}
                  style={{ position: 'relative', zIndex: 1, marginBottom: '24px' }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
                    PRO INCLUDES
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {PRO_FEATURES.map(f => {
                      const isHighlight = copy.highlightFeature && f.toLowerCase().includes(copy.highlightFeature.toLowerCase().split(' ')[0].toLowerCase())
                      return (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <div style={{
                            width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                            background: isHighlight ? 'rgba(255,85,31,0.18)' : 'rgba(255,85,31,0.1)',
                            border: `1px solid ${isHighlight ? 'rgba(255,85,31,0.45)' : 'rgba(255,85,31,0.25)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <svg width="6" height="4" viewBox="0 0 7 5" fill="none">
                              <path d="M1 2.5l1.8 1.8L6 .7" stroke={isHighlight ? '#FF551F' : 'rgba(255,85,31,0.65)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span className="font-rajdhani" style={{ fontSize: '12px', color: isHighlight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)', lineHeight: 1.3, fontWeight: isHighlight ? 600 : 400 }}>
                            {f}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                  style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}
                >
                  <Link href="/pricing" onClick={() => { onUpgrade?.(); onClose() }} style={{ textDecoration: 'none', display: 'block' }}>
                    <BtnColorful
                      variant="primary"
                      arrow
                      style={{ width: '100%', justifyContent: 'center' }}
                      data-action="upgrade-pro"
                      data-trigger={trigger}
                    >
                      UPGRADE TO PRO
                    </BtnColorful>
                  </Link>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link href="/pricing" onClick={onClose} style={{ textDecoration: 'none', flex: 1 }}>
                      <BtnColorful variant="secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.7rem' }}>
                        VIEW ALL PLANS
                      </BtnColorful>
                    </Link>
                    <button
                      onClick={onClose}
                      className="font-mono"
                      style={{
                        flex: 1, padding: '11px',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '3px',
                        color: 'rgba(255,255,255,0.28)',
                        fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
                        cursor: 'pointer', transition: 'all 0.16s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.28)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                    >
                      MAYBE LATER
                    </button>
                  </div>

                  {/* Trial note */}
                  <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                    7-DAY FREE TRIAL · NO CREDIT CARD · CANCEL ANYTIME
                  </p>
                </motion.div>
              </div>
            </ShineBorder>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
