'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import ShineBorder from '@/components/ui/ShineBorder'
import SectionEyebrow from '@/components/ui/SectionEyebrow'
import {
  COMMUNITY_BUILDS,
  FEATURED_BUILDERS,
  LEADERBOARD,
  CATEGORY_FILTERS,
  type CategoryFilter,
  type CommunityBuild,
  type FeaturedBuilder,
  type LeaderboardEntry,
  formatLikes,
  formatBuildValue,
  TIER_CONFIG,
} from '@/lib/communityData'
import { useGarageStore } from '@/store/garageStore'
import { useBuildStore } from '@/store/buildStore'

// ─── Category → mission mapping ────────────────────────────────────────────

const CAT_TO_MISSION: Record<string, string> = {
  OVERLAND:      'overland',
  EXPEDITION:    'expedition',
  CAMPING:       'camping',
  TACTICAL:      'offroad',
  RECOVERY:      'offroad',
  'DAILY DRIVER':'daily',
  'WORK TRUCK':  'utility',
}

const CAT_TO_PURPOSE: Record<string, string> = {
  OVERLAND:      'p_over',
  EXPEDITION:    'p_travel',
  CAMPING:       'p_camp',
  TACTICAL:      'p_offroad',
  RECOVERY:      'p_offroad',
  'DAILY DRIVER':'p_daily',
  'WORK TRUCK':  'p_work',
}

// ─── Community stats ────────────────────────────────────────────────────────

const STATS = [
  { label: 'ACTIVE BUILDERS', value: '4,821' },
  { label: 'BUILDS SHARED',   value: '12,006' },
  { label: 'TOTAL GEAR VALUE', value: '$84M+' },
  { label: 'INSTALLS MATCHED', value: '1,240' },
]

// ─── Build of the Month card ─────────────────────────────────────────────────

function BotmCard({ build, onCopyToGarage, onUseAsStart }: {
  build:           CommunityBuild
  onCopyToGarage:  (b: CommunityBuild) => void
  onUseAsStart:    (b: CommunityBuild) => void
}) {
  const [liked,   setLiked]   = useState(false)
  const [copied,  setCopied]  = useState(false)

  return (
    <ShineBorder variant="featured" borderRadius={8} borderWidth={1}>
      <div style={{
        background:    'linear-gradient(135deg, rgba(8,10,20,0.96) 0%, rgba(20,10,6,0.96) 60%, rgba(8,10,20,0.96) 100%)',
        borderRadius:  7,
        padding:       '32px 36px',
        position:      'relative',
        overflow:      'hidden',
      }}>
        {/* Glow bloom — JUSTIFIED: Build of the Month featured slot */}
        <div style={{
          position:   'absolute',
          top: '-40%', left: '20%',
          width: '60%', height: '200%',
          background: 'radial-gradient(ellipse, rgba(255,85,31,0.09) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              {/* BOTM badge */}
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.18em',
                background: 'linear-gradient(to right, rgba(255,85,31,0.20), rgba(255,200,87,0.20))',
                border: '1px solid rgba(255,200,87,0.35)',
                color: '#FFC857',
                padding: '3px 10px', borderRadius: 2,
              }}>
                ★ BUILD OF THE MONTH
              </span>
              {/* Tier */}
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.14em',
                background: TIER_CONFIG[build.builderTier].bg,
                border: `1px solid ${TIER_CONFIG[build.builderTier].border}`,
                color: TIER_CONFIG[build.builderTier].color,
                padding: '3px 8px', borderRadius: 2,
              }}>
                {build.builderTier}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: '2.6rem' }}>{build.vehicleEmoji}</span>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', letterSpacing: '0.05em', color: 'var(--text)', margin: 0 }}>
                  {build.buildName}
                </h2>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.14em', color: 'var(--text-3)', marginTop: 4 }}>
                  {build.vehicleName}
                </p>
              </div>
            </div>
          </div>

          {/* Build value */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.18em', color: 'var(--text-3)', marginBottom: 4 }}>
              BUILD VALUE
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.04em', color: '#FFC857' }}>
              {formatBuildValue(build.buildValue)}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24, position: 'relative', zIndex: 1 }}>
          {build.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.14em',
              background: 'rgba(255,85,31,0.07)', border: '1px solid rgba(255,85,31,0.15)',
              color: 'var(--text-3)', padding: '4px 10px', borderRadius: 2,
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Stats + builder */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20,
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { icon: '♥', value: formatLikes(build.likes + (liked ? 1 : 0)), label: 'LIKES' },
              { icon: '💬', value: build.comments,  label: 'REPLIES' },
              { icon: '👁', value: formatLikes(build.views),  label: 'VIEWS' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.04em', color: 'var(--text)' }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.14em', color: 'var(--text-3)', marginTop: 2 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {/* Installed By badge */}
            {build.installedBy && (
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.10em',
                color: 'rgba(102,255,255,0.6)', border: '1px solid rgba(102,255,255,0.18)',
                background: 'rgba(102,255,255,0.04)',
                padding: '4px 10px', borderRadius: 2,
                textTransform: 'uppercase', flexShrink: 0,
              }}>
                🔧 {build.installedBy.shopName} · {build.installedBy.location}
              </div>
            )}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.10em', color: 'var(--text-2)' }}>
                {build.isVerified ? '✓ ' : ''}{build.builderName}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.10em', color: 'var(--text-3)' }}>
                @{build.builderHandle}
              </div>
            </div>
            <button
              onClick={() => setLiked(v => !v)}
              style={{
                background: liked ? 'rgba(255,85,31,0.12)' : 'transparent',
                border: `1px solid ${liked ? 'rgba(255,85,31,0.40)' : 'rgba(255,255,255,0.10)'}`,
                color: liked ? '#FF551F' : 'var(--text-3)',
                fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em',
                padding: '8px 14px', cursor: 'pointer', borderRadius: 2,
                transition: 'all 0.18s ease',
              }}
            >
              {liked ? '♥ LIKED' : '♡ LIKE'}
            </button>
            <button
              onClick={() => { onCopyToGarage(build); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
              style={{
                background: copied ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${copied ? '#22c55e' : 'rgba(255,255,255,0.14)'}`,
                color: copied ? '#22c55e' : 'var(--text-3)',
                fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.10em',
                padding: '8px 12px', cursor: 'pointer', borderRadius: 2,
                transition: 'all 0.18s',
              }}
            >
              {copied ? '✓ SAVED' : '📋 COPY TO GARAGE'}
            </button>
            <button
              onClick={() => onUseAsStart(build)}
              style={{
                background: 'rgba(102,255,255,0.07)',
                border: '1px solid rgba(102,255,255,0.22)',
                color: 'rgba(102,255,255,0.8)',
                fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.10em',
                padding: '8px 12px', cursor: 'pointer', borderRadius: 2,
              }}
            >
              ▶ USE AS STARTING POINT
            </button>
            <button style={{
              background: 'rgba(255,85,31,0.10)',
              border: '1px solid rgba(255,85,31,0.28)',
              color: 'var(--orange)',
              fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em',
              padding: '8px 14px', cursor: 'pointer', borderRadius: 2,
            }}>
              VIEW BUILD
            </button>
          </div>
        </div>
      </div>
    </ShineBorder>
  )
}

// ─── Build card ──────────────────────────────────────────────────────────────

function BuildCard({ build, onCopyToGarage, onUseAsStart }: {
  build:          CommunityBuild
  onCopyToGarage: (b: CommunityBuild) => void
  onUseAsStart:   (b: CommunityBuild) => void
}) {
  const [liked,  setLiked]  = useState(false)
  const [copied, setCopied] = useState(false)
  const tier = TIER_CONFIG[build.builderTier]

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.20, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background:   'var(--carbon)',
        border:       '1px solid rgba(255,255,255,0.06)',
        borderRadius: 6,
        overflow:     'hidden',
        display:      'flex',
        flexDirection:'column',
        transition:   'border-color 0.20s ease, box-shadow 0.20s ease',
        cursor:       'pointer',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(255,85,31,0.20)'
        el.style.boxShadow   = '0 6px 24px rgba(0,0,0,0.30)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(255,255,255,0.06)'
        el.style.boxShadow   = 'none'
      }}
    >
      {/* Vehicle display area */}
      <div style={{
        background:  'linear-gradient(135deg, rgba(255,85,31,0.04) 0%, rgba(8,10,20,0.8) 100%)',
        padding:     '24px 20px 16px',
        display:     'flex',
        alignItems:  'center',
        gap:         12,
        borderBottom:'1px solid rgba(255,255,255,0.04)',
      }}>
        <span style={{ fontSize: '2rem', flexShrink: 0 }}>{build.vehicleEmoji}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '1.1rem',
            letterSpacing: '0.06em', color: 'var(--text)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {build.buildName}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
            letterSpacing: '0.12em', color: 'var(--text-3)', marginTop: 3,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {build.vehicleName}
          </div>
        </div>
        {/* Category badge */}
        <span style={{
          marginLeft: 'auto', flexShrink: 0,
          fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.14em',
          background: 'rgba(255,85,31,0.07)', border: '1px solid rgba(255,85,31,0.14)',
          color: 'rgba(255,85,31,0.7)', padding: '3px 7px', borderRadius: 2,
        }}>
          {build.category}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Tags */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {build.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.10em',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              color: 'var(--text-3)', padding: '3px 7px', borderRadius: 2,
            }}>
              {tag}
            </span>
          ))}
          {build.tags.length > 3 && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.10em',
              color: 'var(--text-3)',
            }}>
              +{build.tags.length - 3}
            </span>
          )}
        </div>

        {/* Build value */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.15em', color: 'var(--text-3)', marginBottom: 2 }}>
              BUILD VALUE
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.04em', color: 'var(--orange)' }}>
              {formatBuildValue(build.buildValue)}
            </div>
          </div>
          {/* Builder */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end', marginBottom: 2 }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.10em',
                background: tier.bg, border: `1px solid ${tier.border}`,
                color: tier.color, padding: '2px 6px', borderRadius: 2,
              }}>
                {build.builderTier}
              </span>
              {build.isVerified && (
                <span style={{ color: '#66FFFF', fontSize: '0.6rem' }}>✓</span>
              )}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.08em', color: 'var(--text-3)' }}>
              @{build.builderHandle}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: '10px 20px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {/* Installed By */}
        {build.installedBy && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.43rem', letterSpacing: '0.10em',
            color: 'rgba(102,255,255,0.55)', textTransform: 'uppercase',
          }}>
            🔧 INSTALLED BY {build.installedBy.shopName} · {build.installedBy.location}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 14 }}>
            {[
              { icon: '♥', val: formatLikes(build.likes + (liked ? 1 : 0)) },
              { icon: '💬', val: build.comments },
              { icon: '👁', val: formatLikes(build.views) },
            ].map((s, i) => (
              <span key={i} style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                letterSpacing: '0.10em', color: 'var(--text-3)',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                {s.icon} {s.val}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            <button
              onClick={e => { e.stopPropagation(); setLiked(v => !v) }}
              style={{
                background: 'transparent', border: 'none',
                color: liked ? '#FF551F' : 'var(--text-3)',
                fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                letterSpacing: '0.10em', cursor: 'pointer', padding: '4px 6px',
                transition: 'color 0.15s',
              }}
            >
              {liked ? '♥' : '♡'}
            </button>
            <button
              onClick={e => { e.stopPropagation(); onCopyToGarage(build); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
              style={{
                background: copied ? 'rgba(34,197,94,0.10)' : 'transparent',
                border: `1px solid ${copied ? '#22c55e' : 'rgba(255,255,255,0.10)'}`,
                color: copied ? '#22c55e' : 'var(--text-3)',
                fontFamily: 'var(--font-mono)', fontSize: '0.43rem', letterSpacing: '0.08em',
                padding: '4px 8px', cursor: 'pointer', borderRadius: 2, transition: 'all 0.15s',
              }}
            >
              {copied ? '✓' : '📋'}
            </button>
            <button
              onClick={e => { e.stopPropagation(); onUseAsStart(build) }}
              style={{
                background: 'rgba(102,255,255,0.06)',
                border: '1px solid rgba(102,255,255,0.18)',
                color: 'rgba(102,255,255,0.7)',
                fontFamily: 'var(--font-mono)', fontSize: '0.43rem', letterSpacing: '0.08em',
                padding: '4px 8px', cursor: 'pointer', borderRadius: 2,
              }}
              title="Use as starting point"
            >
              ▶ START
            </button>
            <button style={{
              background: 'transparent', border: '1px solid rgba(255,85,31,0.20)',
              color: 'rgba(255,85,31,0.7)',
              fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.12em',
              padding: '4px 10px', cursor: 'pointer', borderRadius: 2,
            }}>
              VIEW
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Featured builder card ───────────────────────────────────────────────────

function BuilderCard({ builder }: { builder: FeaturedBuilder }) {
  const tier = TIER_CONFIG[builder.tier]

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'var(--carbon)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 6, padding: '20px',
        display: 'flex', alignItems: 'center', gap: 14,
        cursor: 'pointer', transition: 'border-color 0.18s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,85,31,0.18)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)' }}
    >
      {/* Avatar */}
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: 'rgba(255,85,31,0.08)',
        border: `1px solid ${tier.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.3rem', flexShrink: 0,
      }}>
        {builder.emoji}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{
            fontFamily: 'var(--font-tactical)', fontWeight: 600, fontSize: '0.8rem',
            letterSpacing: '0.08em', color: 'var(--text)',
          }}>
            {builder.name}
          </span>
          {builder.isVerified && (
            <span style={{ color: '#66FFFF', fontSize: '0.6rem' }}>✓</span>
          )}
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.12em',
            background: tier.bg, border: `1px solid ${tier.border}`,
            color: tier.color, padding: '2px 6px', borderRadius: 2,
          }}>
            {builder.tier}
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: 6 }}>
          @{builder.handle}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.10em', color: 'rgba(255,85,31,0.6)' }}>
          {builder.specialty}
        </div>
      </div>

      {/* Stats */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.04em', color: 'var(--text)' }}>
          {builder.buildCount}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.12em', color: 'var(--text-3)' }}>
          BUILDS
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.08em', color: 'var(--text-3)', marginTop: 4 }}>
          {formatLikes(builder.totalLikes)} ♥
        </div>
      </div>
    </motion.div>
  )
}

// ─── Leaderboard row ─────────────────────────────────────────────────────────

function LeaderRow({ entry }: { entry: LeaderboardEntry }) {
  const tier = TIER_CONFIG[entry.tier]
  const isTop3 = entry.rank <= 3
  const rankColor = entry.rank === 1 ? '#FFC857' : entry.rank === 2 ? '#C0C0C0' : entry.rank === 3 ? '#CD7F32' : 'var(--text-3)'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '12px 20px',
      background: isTop3 ? 'rgba(255,85,31,0.03)' : 'transparent',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      transition: 'background 0.15s',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isTop3 ? 'rgba(255,85,31,0.03)' : 'transparent' }}
    >
      {/* Rank */}
      <div style={{
        width: 28, flexShrink: 0, textAlign: 'center',
        fontFamily: 'var(--font-display)', fontSize: isTop3 ? '1.1rem' : '0.875rem',
        letterSpacing: '0.04em', color: rankColor,
      }}>
        {entry.rank}
      </div>

      {/* Emoji */}
      <div style={{ fontSize: '1.1rem', flexShrink: 0 }}>{entry.emoji}</div>

      {/* Name + handle */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontFamily: 'var(--font-tactical)', fontWeight: 600, fontSize: '0.75rem',
            letterSpacing: '0.08em', color: 'var(--text)',
          }}>
            {entry.name}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.10em',
            background: tier.bg, border: `1px solid ${tier.border}`,
            color: tier.color, padding: '2px 5px', borderRadius: 2,
          }}>
            {entry.tier}
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.08em', color: 'var(--text-3)', marginTop: 1 }}>
          @{entry.handle}
        </div>
      </div>

      {/* Votes */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.04em', color: 'var(--text)' }}>
          {formatLikes(entry.votes)}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.10em', marginTop: 1,
          color: entry.delta > 0 ? 'var(--green)' : entry.delta < 0 ? '#f87171' : 'var(--text-3)',
        }}>
          {entry.delta > 0 ? `▲ ${entry.delta}` : entry.delta < 0 ? `▼ ${Math.abs(entry.delta)}` : '—'}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('ALL')
  const router       = useRouter()
  const addBuild     = useGarageStore(s => s.addBuild)
  const setPurposes  = useBuildStore(s => s.setPurposes)
  const setBuildName = useBuildStore(s => s.setBuildName)

  const handleCopyToGarage = useCallback((build: CommunityBuild) => {
    const now = new Date().toISOString().slice(0, 10)
    addBuild({
      id:           `comm_${build.id}_${Date.now()}`,
      name:         build.buildName,
      vehicleId:    'unknown',
      vehicleName:  build.vehicleName,
      vehicleEmoji: build.vehicleEmoji,
      year:         String(build.year),
      trim:         '',
      status:       'ACTIVE',
      budget:       build.buildValue,
      spent:        build.buildValue,
      items:        {},
      itemCount:    0,
      mission:      CAT_TO_MISSION[build.category] ?? null,
      purposes:     CAT_TO_PURPOSE[build.category] ? [CAT_TO_PURPOSE[build.category]] : [],
      summaryNote:  `Copied from community: ${build.builderName} (@${build.builderHandle})`,
      categories:   build.tags,
      completionPct:100,
      savedAt:      now,
      updatedAt:    now,
      source:       { type: 'community', originalId: build.id, originalName: build.buildName },
    })
  }, [addBuild])

  const handleUseAsStart = useCallback((build: CommunityBuild) => {
    const purposeId = CAT_TO_PURPOSE[build.category]
    if (purposeId) setPurposes([purposeId])
    setBuildName(build.buildName)
    router.push('/build')
  }, [setPurposes, setBuildName, router])

  const botmBuild = COMMUNITY_BUILDS.find(b => b.isBotm)!
  const filteredBuilds = COMMUNITY_BUILDS.filter(b =>
    !b.isBotm && (activeFilter === 'ALL' || b.category === activeFilter)
  )

  return (
    <div style={{
      paddingTop: 'var(--page-top)',
      paddingBottom: 64,
      minHeight: '100dvh',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--pad-x)' }}>

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <SectionEyebrow>THE PLATFORM</SectionEyebrow>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            letterSpacing: '0.04em', color: 'var(--text)', marginBottom: 10,
          }}>
            COMMUNITY
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', maxWidth: 480 }}>
            Builds from the field. Real operators, real rigs, real results. Get inspired, share yours, find your next upgrade.
          </p>

          {/* Stats bar */}
          <div style={{
            display: 'flex', gap: 32, marginTop: 28, paddingTop: 28,
            borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap',
          }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.04em', color: 'var(--text)' }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.16em', color: 'var(--text-3)', marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Build of the Month ─────────────────────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <BotmCard build={botmBuild} onCopyToGarage={handleCopyToGarage} onUseAsStart={handleUseAsStart} />
        </div>

        {/* ── Category filters ─────────────────────────────────────── */}
        <div style={{
          display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 28,
          paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {CATEGORY_FILTERS.map(cat => {
            const isActive = activeFilter === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.14em',
                  background: isActive ? 'rgba(255,85,31,0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(255,85,31,0.40)' : 'rgba(255,255,255,0.08)'}`,
                  color: isActive ? 'var(--orange)' : 'var(--text-3)',
                  padding: '7px 14px', cursor: 'pointer', borderRadius: 2,
                  transition: 'all 0.16s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* ── Build grid + sidebar ─────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: 32,
          alignItems: 'start',
        }}>
          {/* Build grid */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.20, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 14,
                }}
              >
                {filteredBuilds.length > 0 ? filteredBuilds.map(build => (
                  <BuildCard key={build.id} build={build} onCopyToGarage={handleCopyToGarage} onUseAsStart={handleUseAsStart} />
                )) : (
                  <div style={{
                    gridColumn: '1 / -1', padding: '48px 0', textAlign: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.16em', color: 'var(--text-3)',
                  }}>
                    NO BUILDS IN THIS CATEGORY YET
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right sidebar: Featured Builders + Leaderboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Featured Builders */}
            <div style={{
              background: 'rgba(8,10,20,0.70)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 6, overflow: 'hidden',
            }}>
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.18em', color: 'var(--text-3)' }}>
                  FEATURED BUILDERS
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.12em',
                  color: 'rgba(255,200,87,0.7)', background: 'rgba(255,200,87,0.07)',
                  border: '1px solid rgba(255,200,87,0.15)', padding: '2px 8px', borderRadius: 2,
                }}>
                  THIS MONTH
                </span>
              </div>
              <div style={{ padding: '8px 0' }}>
                {FEATURED_BUILDERS.map(builder => (
                  <BuilderCard key={builder.id} builder={builder} />
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div style={{
              background: 'rgba(8,10,20,0.70)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 6, overflow: 'hidden',
            }}>
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.18em', color: 'var(--text-3)' }}>
                  COMMUNITY LEADERBOARD
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.45rem', letterSpacing: '0.12em',
                  color: 'var(--text-3)',
                }}>
                  TOP 10
                </span>
              </div>
              <div>
                {LEADERBOARD.map(entry => (
                  <LeaderRow key={entry.rank} entry={entry} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .community-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 720px) {
          .community-layout { gap: 20px !important; }
        }
      `}</style>
    </div>
  )
}
