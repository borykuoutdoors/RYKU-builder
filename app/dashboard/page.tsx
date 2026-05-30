'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useBuildStore } from '@/store/buildStore'
import ShineBorder from '@/components/ui/ShineBorder'
import BtnColorful from '@/components/ui/BtnColorful'

// ─── Mock saved builds ────────────────────────────────────────────────────────

const MOCK_SAVED_BUILDS = [
  {
    id: 'sb-1',
    name: 'WEEKEND WARRIOR',
    vehicle: 'Toyota 4Runner',
    mission: 'overland',
    total: 8420,
    items: 5,
  },
  {
    id: 'sb-2',
    name: 'ROCK CRAWLER SETUP',
    vehicle: 'Jeep Gladiator',
    mission: 'offroad',
    total: 12800,
    items: 7,
  },
]

// ─── Mock saved products ──────────────────────────────────────────────────────

const MOCK_SAVED_GEAR = [
  { id: 'g1', emoji: '🔩', brand: 'ICON Vehicle Dynamics', name: 'Stage 2 System', price: 2800 },
  { id: 'g2', emoji: '⛺', brand: 'iKamper',               name: 'Skycamp 3.0',    price: 3400 },
  { id: 'g3', emoji: '🪝', brand: 'WARN',                  name: 'Zeon 10-S Platinum Winch', price: 1800 },
]

// ─── PRO feature list ─────────────────────────────────────────────────────────

const PRO_FEATURES = [
  'Unlimited saved builds',
  'Export PDF build sheets',
  'Priority installer matching',
  'Exclusive brand discounts',
  'Early access to new gear',
]

// ─── Tab type ─────────────────────────────────────────────────────────────────

type Tab = 'BUILDS' | 'GEAR' | 'ACCOUNT'

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('BUILDS')

  const {
    vehicle,
    mission,
    items,
    buildName,
    gearTotal,
    laborTotal,
    buildTotal,
  } = useBuildStore()

  const itemCount = Object.keys(items).length

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: '1px solid rgba(255,85,31,0.12)',
          padding: '48px 24px 32px',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div
                className="font-mono"
                style={{
                  fontSize: '11px',
                  color: 'var(--orange)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                BŌRYKU — CONTROL PANEL
              </div>
              <h1
                className="font-bebas"
                style={{
                  fontSize: 'clamp(40px, 6vw, 72px)',
                  letterSpacing: '0.05em',
                  color: '#fff',
                  margin: 0,
                }}
              >
                YOUR DASHBOARD
              </h1>
            </div>

            {/* Login / Create Account CTA */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/login"
                className="btn btn-ghost"
                style={{ fontSize: '13px', padding: '10px 22px' }}
                data-action="login"
              >
                LOG IN
              </Link>
              <Link
                href="/login?mode=signup"
                className="btn btn-primary"
                style={{ fontSize: '13px', padding: '10px 22px' }}
                data-action="create-account"
              >
                ⊕ CREATE ACCOUNT
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {/* ── Tab Bar ──────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            gap: '0',
            borderBottom: '1px solid rgba(255,85,31,0.16)',
            marginBottom: '32px',
          }}
        >
          {(['BUILDS', 'GEAR', 'ACCOUNT'] as Tab[]).map((tab) => {
            const active = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                data-tab={tab}
                className="font-bebas"
                style={{
                  padding: '12px 28px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: active ? '2px solid var(--orange)' : '2px solid transparent',
                  color: active ? 'var(--orange)' : 'rgba(255,255,255,0.38)',
                  fontSize: '18px',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'color 0.18s',
                  marginBottom: '-1px',
                }}
              >
                {tab === 'BUILDS' ? 'MY BUILDS' : tab === 'GEAR' ? 'SAVED GEAR' : 'ACCOUNT'}
              </button>
            )
          })}
        </div>

        {/* ── Guest banner ─────────────────────────────────────────────────────── */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255,85,31,0.08) 0%, rgba(255,85,31,0.03) 100%)',
            border: '1px solid rgba(255,85,31,0.2)',
            borderRadius: '6px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🔒</span>
            <div>
              <div className="font-bebas" style={{ fontSize: '16px', color: '#fff', letterSpacing: '0.06em' }}>
                SIGN IN TO SAVE YOUR BUILDS
              </div>
              <div className="font-rajdhani" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)' }}>
                Create a free account to save builds, sync gear, and connect with installers.
              </div>
            </div>
          </div>
          <Link
            href="/login?mode=signup"
            className="btn btn-primary"
            style={{ fontSize: '12px', padding: '8px 18px', whiteSpace: 'nowrap' }}
            data-action="signup-banner"
          >
            GET STARTED FREE
          </Link>
        </div>

        {/* ── MY BUILDS TAB ────────────────────────────────────────────── */}
        {activeTab === 'BUILDS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Active build */}
            <div>
              <div
                className="font-mono"
                style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.38)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                ACTIVE BUILD
              </div>
              <div
                style={{
                  background: 'var(--carbon)',
                  border: '1px solid rgba(255,85,31,0.3)',
                  borderRadius: '6px',
                  padding: '24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '20px',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    className="font-bebas"
                    style={{ fontSize: '28px', color: '#fff', letterSpacing: '0.06em' }}
                  >
                    {buildName || 'NO ACTIVE BUILD'}
                  </div>
                  {vehicle ? (
                    <div
                      className="font-mono"
                      style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}
                    >
                      {vehicle.emoji} {vehicle.name.toUpperCase()}
                      {mission && ` · ${mission.toUpperCase()}`}
                    </div>
                  ) : (
                    <div
                      className="font-mono"
                      style={{ fontSize: '12px', color: 'rgba(255,255,255,0.32)' }}
                    >
                      No vehicle selected
                    </div>
                  )}
                  {itemCount > 0 && (
                    <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
                      <span
                        className="font-mono"
                        style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}
                      >
                        {itemCount} ITEMS
                      </span>
                      <span
                        className="font-mono"
                        style={{ fontSize: '11px', color: 'var(--orange)' }}
                      >
                        GEAR ${gearTotal().toLocaleString()}
                      </span>
                      <span
                        className="font-mono"
                        style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}
                      >
                        LABOR ${laborTotal().toLocaleString()}
                      </span>
                      <span
                        className="font-mono"
                        style={{ fontSize: '11px', color: '#fff', fontWeight: 600 }}
                      >
                        TOTAL ${buildTotal().toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                <Link
                  href="/build"
                  className="btn btn-primary"
                  style={{ whiteSpace: 'nowrap' }}
                  data-action="continue-build"
                >
                  CONTINUE BUILD
                </Link>
              </div>
            </div>

            {/* Saved builds */}
            <div>
              <div
                className="font-mono"
                style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.38)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                SAVED BUILDS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {MOCK_SAVED_BUILDS.map((build) => (
                  <div
                    key={build.id}
                    style={{
                      background: 'var(--carbon)',
                      border: '1px solid rgba(255,85,31,0.12)',
                      borderRadius: '6px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div
                      className="font-bebas"
                      style={{ fontSize: '20px', color: '#fff', letterSpacing: '0.06em' }}
                    >
                      {build.name}
                    </div>
                    <div
                      className="font-mono"
                      style={{ fontSize: '11px', color: 'rgba(255,255,255,0.42)', letterSpacing: '0.06em' }}
                    >
                      {build.vehicle.toUpperCase()} · {build.mission.toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        className="font-mono"
                        style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}
                      >
                        {build.items} items
                      </span>
                      <span
                        className="font-bebas"
                        style={{ fontSize: '18px', color: 'var(--orange)' }}
                      >
                        ${build.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SAVED GEAR TAB ───────────────────────────────────────────── */}
        {activeTab === 'GEAR' && (
          <div>
            <div
              className="font-mono"
              style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.38)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              SAVED PRODUCTS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {MOCK_SAVED_GEAR.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--carbon)',
                    border: '1px solid rgba(255,85,31,0.12)',
                    borderRadius: '6px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <span style={{ fontSize: '32px', lineHeight: 1 }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      className="font-mono"
                      style={{ fontSize: '11px', color: 'var(--orange)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                    >
                      {item.brand}
                    </div>
                    <div
                      className="font-bebas"
                      style={{ fontSize: '18px', color: '#fff', letterSpacing: '0.05em' }}
                    >
                      {item.name}
                    </div>
                  </div>
                  <div
                    className="font-bebas"
                    style={{ fontSize: '22px', color: '#fff' }}
                  >
                    ${item.price.toLocaleString()}
                  </div>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: '12px' }}
                    data-action="remove-saved-gear"
                    data-product-id={item.id}
                  >
                    REMOVE
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ACCOUNT TAB ──────────────────────────────────────────────── */}
        {activeTab === 'ACCOUNT' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Profile card */}
            <div
              style={{
                background: 'var(--carbon)',
                border: '1px solid rgba(255,85,31,0.14)',
                borderRadius: '6px',
                padding: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--orange) 0%, #c03b10 100%)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                }}
              >
                🏕️
              </div>

              <div style={{ flex: 1 }}>
                <div
                  className="font-bebas"
                  style={{ fontSize: '26px', color: '#fff', letterSpacing: '0.06em' }}
                >
                  OVERLANDER_01
                </div>
                <div
                  className="font-mono"
                  style={{ fontSize: '12px', color: 'rgba(255,255,255,0.42)', letterSpacing: '0.04em' }}
                >
                  user@boryku.com
                </div>
              </div>

              {/* Plan badge */}
              <span
                className="font-mono"
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '3px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                FREE
              </span>
            </div>

            {/* PRO upgrade card */}
            <ShineBorder variant="premium" borderRadius={6}>
              <div
                style={{
                  background: 'linear-gradient(160deg, #130a05 0%, #1a0e08 50%, var(--carbon) 100%)',
                  borderRadius: '5px',
                  padding: '28px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Ambient bloom */}
                <div style={{ position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)', width: 280, height: 180, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,85,31,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '6px', position: 'relative', zIndex: 1 }}>
                  <div className="font-bebas" style={{ fontSize: '26px', color: 'var(--orange)', letterSpacing: '0.08em', lineHeight: 1.05 }}>
                    UPGRADE TO RYKU PRO
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <span className="font-bebas" style={{ fontSize: '22px', color: '#fff', letterSpacing: '0.02em' }}>$12.99</span>
                    <span className="font-mono" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em' }}>/mo</span>
                  </div>
                </div>

                <div className="font-rajdhani" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.42)', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                  Unlock the full BŌRYKU platform experience
                </div>

                {/* Features — 2-col compact */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '22px', position: 'relative', zIndex: 1 }}>
                  {PRO_FEATURES.map(feature => (
                    <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0, background: 'rgba(255,85,31,0.1)', border: '1px solid rgba(255,85,31,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="6" height="4" viewBox="0 0 7 5" fill="none">
                          <path d="M1 2.5l1.8 1.8L6 .7" stroke="#FF551F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="font-rajdhani" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.62)' }}>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div style={{ display: 'flex', gap: '10px', position: 'relative', zIndex: 1 }}>
                  <Link href="/subscribe?plan=pro" style={{ textDecoration: 'none', flex: 1 }}>
                    <BtnColorful
                      variant="primary"
                      arrow
                      style={{ width: '100%', justifyContent: 'center' }}
                      data-action="upgrade-pro"
                    >
                      UPGRADE TO PRO
                    </BtnColorful>
                  </Link>
                  <Link href="/pricing" style={{ textDecoration: 'none', flexShrink: 0 }}>
                    <BtnColorful variant="secondary" style={{ padding: '11px 18px' }} data-action="view-pricing">
                      VIEW PLANS
                    </BtnColorful>
                  </Link>
                </div>

                {/* Trial note */}
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', margin: '12px 0 0', position: 'relative', zIndex: 1 }}>
                  7-DAY FREE TRIAL · CANCEL ANYTIME
                </p>
              </div>
            </ShineBorder>

          </div>
        )}
      </div>
    </div>
  )
}
