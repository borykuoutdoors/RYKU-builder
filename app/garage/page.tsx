'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionEyebrow from '@/components/ui/SectionEyebrow'
import {
  GARAGE_VEHICLES,
  GARAGE_BUILDS,
  STATUS_CONFIG,
  type GarageVehicle,
  type GarageBuild,
  type BuildStatus,
  formatCurrency,
  formatMileage,
  getVehicleBuilds,
  getVehicleTotalValue,
} from '@/lib/garageData'

// ─── Progress bar ────────────────────────────────────────────────────────────

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{
      height: 3, borderRadius: 2,
      background: 'rgba(255,255,255,0.06)',
      overflow: 'hidden', position: 'relative',
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(pct, 100)}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{ height: '100%', borderRadius: 2, background: color }}
      />
    </div>
  )
}

// ─── Build row ───────────────────────────────────────────────────────────────

function BuildRow({ build }: { build: GarageBuild }) {
  const st = STATUS_CONFIG[build.status]
  const isOverBudget = build.spent > build.budget
  const pct = build.completionPct
  const progressColor = build.status === 'COMPLETED' ? '#66FFFF'
    : isOverBudget ? '#f87171' : 'var(--green)'

  return (
    <div style={{
      padding: '16px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      display: 'flex', flexDirection: 'column', gap: 10,
      transition: 'background 0.15s',
      cursor: 'pointer',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '0.95rem', letterSpacing: '0.06em',
            color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {build.name}
          </span>
          {/* Status pill */}
          <span style={{
            flexShrink: 0,
            fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.14em',
            background: st.bg, border: `1px solid ${st.dotColor}30`,
            color: st.color, padding: '3px 8px', borderRadius: 2,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: st.dotColor, display: 'inline-block', flexShrink: 0 }} />
            {st.label}
          </span>
        </div>
        {/* Actions */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button style={{
            background: 'transparent', border: '1px solid rgba(255,85,31,0.20)',
            color: 'rgba(255,85,31,0.7)',
            fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.12em',
            padding: '5px 10px', cursor: 'pointer', borderRadius: 2,
            transition: 'all 0.15s',
          }}>
            OPEN
          </button>
        </div>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <ProgressBar pct={pct} color={progressColor} />
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.10em',
          color: progressColor, flexShrink: 0, minWidth: 28, textAlign: 'right',
        }}>
          {pct}%
        </span>
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'ITEMS',    value: build.itemCount },
          { label: 'BUDGET',   value: formatCurrency(build.budget) },
          { label: 'SPENT',    value: formatCurrency(build.spent), accent: isOverBudget ? '#f87171' : undefined },
          { label: 'UPDATED',  value: build.lastUpdated },
        ].map(m => (
          <div key={m.label}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: 1 }}>
              {m.label}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.06em', color: m.accent ?? 'var(--text-2)' }}>
              {m.value}
            </div>
          </div>
        ))}
        {/* Categories */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: 4 }}>
            CATEGORIES
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {build.categories.slice(0, 3).map(cat => (
              <span key={cat} style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.08em',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                color: 'var(--text-3)', padding: '2px 6px', borderRadius: 2,
              }}>
                {cat}
              </span>
            ))}
            {build.categories.length > 3 && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', color: 'var(--text-3)' }}>
                +{build.categories.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Vehicle card ────────────────────────────────────────────────────────────

function VehicleCard({ vehicle }: { vehicle: GarageVehicle }) {
  const [expanded, setExpanded] = useState(true)
  const builds = getVehicleBuilds(vehicle.id)
  const totalValue = getVehicleTotalValue(vehicle.id)
  const activeBuilds = builds.filter(b => b.status === 'ACTIVE').length
  const completedBuilds = builds.filter(b => b.status === 'COMPLETED').length
  const avgCompletion = builds.length > 0
    ? Math.round(builds.reduce((s, b) => s + b.completionPct, 0) / builds.length)
    : 0

  return (
    <div style={{
      background: 'rgba(8,10,20,0.70)', backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 8, overflow: 'hidden',
    }}>
      {/* Vehicle header */}
      <div style={{
        padding: '24px 28px',
        borderBottom: expanded ? '1px solid rgba(255,255,255,0.06)' : 'none',
        display: 'flex', alignItems: 'center', gap: 20,
        background: 'rgba(255,255,255,0.01)',
      }}>
        {/* Emoji */}
        <div style={{
          width: 60, height: 60, borderRadius: 6,
          background: 'rgba(255,85,31,0.06)',
          border: '1px solid rgba(255,85,31,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', flexShrink: 0,
        }}>
          {vehicle.emoji}
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            letterSpacing: '0.06em', color: 'var(--text)', margin: 0, marginBottom: 4,
          }}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {[
              { label: 'TRIM',    value: vehicle.trim },
              { label: 'COLOR',   value: vehicle.color },
              { label: 'MILEAGE', value: formatMileage(vehicle.mileage) },
            ].map(m => (
              <div key={m.label} style={{ display: 'flex', gap: 5, alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.14em', color: 'var(--text-3)' }}>
                  {m.label}:
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.08em', color: 'var(--text-2)' }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0 }}>
          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: 'TOTAL VALUE',  value: formatCurrency(totalValue),   accent: 'var(--orange)' },
              { label: 'ACTIVE',       value: activeBuilds,                 accent: 'var(--green)' },
              { label: 'COMPLETE',     value: completedBuilds,              accent: '#66FFFF' },
              { label: 'AVG COMPLETE', value: `${avgCompletion}%`,          accent: 'var(--text-2)' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                  letterSpacing: '0.04em', color: s.accent,
                }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.14em', color: 'var(--text-3)', marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.10)',
                color: 'var(--text-3)',
                fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.12em',
                padding: '7px 12px', cursor: 'pointer', borderRadius: 2,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,85,31,0.28)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-2)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.10)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-3)' }}
            >
              EDIT
            </button>
            <button
              style={{
                background: 'rgba(255,85,31,0.08)', border: '1px solid rgba(255,85,31,0.22)',
                color: 'var(--orange)',
                fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.12em',
                padding: '7px 12px', cursor: 'pointer', borderRadius: 2,
                transition: 'all 0.15s',
              }}
            >
              + CREATE BUILD
            </button>
            <button
              onClick={() => setExpanded(v => !v)}
              style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-3)',
                fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
                padding: '7px 12px', cursor: 'pointer', borderRadius: 2,
                transition: 'all 0.15s',
              }}
            >
              {expanded ? '▲' : '▼'}
            </button>
          </div>
        </div>
      </div>

      {/* Builds section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="builds"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {builds.length > 0 ? (
              <div>
                {/* Builds header */}
                <div style={{
                  padding: '10px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.01)',
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.18em', color: 'var(--text-3)' }}>
                    BUILDS · {builds.length}
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {(['ACTIVE', 'COMPLETED', 'DRAFT'] as BuildStatus[]).map(st => {
                      const count = builds.filter(b => b.status === st).length
                      const conf = STATUS_CONFIG[st]
                      return count > 0 ? (
                        <span key={st} style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.10em',
                          background: conf.bg, border: `1px solid ${conf.dotColor}30`,
                          color: conf.color, padding: '2px 7px', borderRadius: 2,
                        }}>
                          {count} {st}
                        </span>
                      ) : null
                    })}
                  </div>
                </div>
                {builds.map(build => (
                  <BuildRow key={build.id} build={build} />
                ))}
              </div>
            ) : (
              <div style={{
                padding: '32px 28px', textAlign: 'center',
                fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
                letterSpacing: '0.16em', color: 'var(--text-3)',
              }}>
                NO BUILDS YET — CREATE YOUR FIRST
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Garage stats bar ────────────────────────────────────────────────────────

const GARAGE_STATS = [
  { label: 'VEHICLES',        value: GARAGE_VEHICLES.length },
  { label: 'TOTAL BUILDS',    value: GARAGE_BUILDS.length },
  { label: 'ACTIVE BUILDS',   value: GARAGE_BUILDS.filter(b => b.status === 'ACTIVE').length },
  {
    label: 'TOTAL INVESTED',
    value: formatCurrency(GARAGE_BUILDS.reduce((s, b) => s + b.spent, 0)),
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GaragePage() {
  return (
    <div style={{
      paddingTop: 'var(--page-top)',
      paddingBottom: 64,
      minHeight: '100dvh',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--pad-x)' }}>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 40 }}>
          <SectionEyebrow>MY ACCOUNT</SectionEyebrow>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                letterSpacing: '0.04em', color: 'var(--text)', marginBottom: 8,
              }}>
                MY GARAGE
              </h1>
              <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>
                Your vehicles and build projects, all in one place.
              </p>
            </div>
            <button style={{
              background: 'rgba(255,85,31,0.10)',
              border: '1px solid rgba(255,85,31,0.30)',
              color: 'var(--orange)',
              fontFamily: 'var(--font-tactical)', fontWeight: 700,
              fontSize: '0.75rem', letterSpacing: '0.16em',
              padding: '12px 24px', cursor: 'pointer', borderRadius: 3,
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(255,85,31,0.16)'
              el.style.boxShadow = '0 0 20px rgba(255,85,31,0.15)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(255,85,31,0.10)'
              el.style.boxShadow = 'none'
            }}
            >
              + ADD VEHICLE
            </button>
          </div>

          {/* Stats bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1, marginTop: 32,
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 6, overflow: 'hidden',
            background: 'rgba(255,255,255,0.06)',
          }}>
            {GARAGE_STATS.map((s, i) => (
              <div key={s.label} style={{
                background: 'rgba(8,10,20,0.86)', backdropFilter: 'blur(12px)',
                padding: '18px 24px',
                borderRight: i < GARAGE_STATS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.6rem',
                  letterSpacing: '0.04em', color: 'var(--text)', marginBottom: 4,
                }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.16em', color: 'var(--text-3)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Vehicle cards ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {GARAGE_VEHICLES.map((vehicle, i) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.30, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            >
              <VehicleCard vehicle={vehicle} />
            </motion.div>
          ))}

          {/* Add vehicle CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.30, ease: [0.16, 1, 0.3, 1], delay: GARAGE_VEHICLES.length * 0.08 }}
          >
            <div
              style={{
                border: '1px dashed rgba(255,85,31,0.20)',
                borderRadius: 8, padding: '36px 28px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 14, cursor: 'pointer',
                transition: 'all 0.20s ease',
                background: 'transparent',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(255,85,31,0.03)'
                el.style.borderColor = 'rgba(255,85,31,0.35)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'transparent'
                el.style.borderColor = 'rgba(255,85,31,0.20)'
              }}
            >
              <span style={{ fontSize: '1.6rem', opacity: 0.5 }}>🚗</span>
              <div>
                <div style={{
                  fontFamily: 'var(--font-tactical)', fontWeight: 700,
                  fontSize: '0.875rem', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: 3,
                }}>
                  ADD A VEHICLE
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.18)' }}>
                  YEAR · MAKE · MODEL · TRIM
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 860px) {
          .garage-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .vehicle-actions { flex-wrap: wrap; gap: 12px; }
        }
        @media (max-width: 600px) {
          .vehicle-meta-row { flex-direction: column; gap: 8px; }
        }
      `}</style>
    </div>
  )
}
