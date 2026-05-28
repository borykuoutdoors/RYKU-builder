'use client'

import { useBuildStore } from '@/store/buildStore'

// ─── Gear category ranker ─────────────────────────────────────────────────────

interface RankedCategory {
  id:    string
  label: string
  icon:  string
  score: number
  pct:   number
  picks: Array<{ name: string; brand: string; price: number }>
}

const BASE_CATEGORIES = [
  {
    id: 'suspension', label: 'Suspension & Lift',  icon: '⚙️',
    base: 0.6,
    overland: 0.8, offroad: 1.0, expedition: 0.8, adventure: 0.6,
    daily: 0.2,    camping: 0.3, tactical: 0.5,  touring: 0.2,
    picks: [
      { name: 'Stage 2 Lift System', brand: 'ICON Vehicle Dynamics', price: 2800 },
      { name: 'Old Man Emu 2" Lift',  brand: 'ARB',                   price: 1650 },
      { name: 'Fox 2.0 Performance',  brand: 'Fox',                   price: 1400 },
    ],
  },
  {
    id: 'roof-rack', label: 'Roof Rack Systems',   icon: '🏗️',
    base: 0.5,
    overland: 0.9, expedition: 1.0, camping: 0.8, adventure: 0.7,
    offroad: 0.4,  daily: 0.3,     tactical: 0.5, touring: 0.6,
    picks: [
      { name: 'Slimline II Platform', brand: 'Front Runner', price: 950 },
      { name: 'Alu-Cab Rack',         brand: 'Alu-Cab',      price: 1200 },
      { name: 'Rhino-Rack Pioneer',   brand: 'Rhino-Rack',   price: 760 },
    ],
  },
  {
    id: 'rtt', label: 'Rooftop Tent',  icon: '⛺',
    base: 0.3,
    camping: 1.0, overland: 0.9, expedition: 0.8, adventure: 0.7,
    offroad: 0.3, daily: 0.0,    tactical: 0.2,  touring: 0.5,
    picks: [
      { name: 'Skycamp 3.0',          brand: 'iKamper',      price: 3400 },
      { name: 'Rooftop Tent 2.0',     brand: 'Roofnest',     price: 2800 },
      { name: 'Ruggedized RTT',       brand: 'Tepui',        price: 1950 },
    ],
  },
  {
    id: 'lighting', label: 'Auxiliary Lighting', icon: '💡',
    base: 0.5,
    offroad: 1.0, tactical: 0.9, overland: 0.8, expedition: 0.7,
    adventure: 0.6, camping: 0.6, daily: 0.4,   touring: 0.5,
    picks: [
      { name: 'Dual LED Spot/Flood',  brand: 'Baja Designs', price: 890 },
      { name: 'Radiance Scene Light', brand: 'Rigid Industries', price: 640 },
      { name: 'SAE Driving/Fog',      brand: 'KC HiLiTES',   price: 480 },
    ],
  },
  {
    id: 'recovery', label: 'Recovery Gear',  icon: '🪝',
    base: 0.4,
    offroad: 1.0, expedition: 0.9, overland: 0.8, adventure: 0.7,
    camping: 0.5, tactical: 0.6,  daily: 0.1,    touring: 0.2,
    picks: [
      { name: 'Zeon 10-S Winch',      brand: 'WARN',         price: 1800 },
      { name: 'TRED PRO Boards',      brand: 'MAXTRAX',      price: 380 },
      { name: 'Recovery Kit Pro',     brand: 'ARB',          price: 290 },
    ],
  },
  {
    id: 'armor', label: 'Armor & Protection', icon: '🛡️',
    base: 0.3,
    offroad: 1.0, tactical: 0.9, overland: 0.7, expedition: 0.6,
    adventure: 0.5, camping: 0.2, daily: 0.1,   touring: 0.1,
    picks: [
      { name: 'Steel Bumper w/ Winch', brand: 'ARB', price: 2100 },
      { name: 'Rock Sliders',          brand: 'Shrockworks', price: 750 },
      { name: 'Skid Plate System',     brand: 'SteelCraft',  price: 480 },
    ],
  },
  {
    id: 'power', label: 'Power & Electrical', icon: '⚡',
    base: 0.4,
    expedition: 1.0, overland: 0.8, camping: 0.9, touring: 0.7,
    offroad: 0.4,    tactical: 0.5, adventure: 0.6, daily: 0.3,
    picks: [
      { name: 'Lithium Portable 1000W', brand: 'Goal Zero', price: 1100 },
      { name: 'Dual Battery System',    brand: 'Redarc',    price: 780 },
      { name: 'Solar Panel 100W',       brand: 'Renogy',    price: 180 },
    ],
  },
  {
    id: 'wheels', label: 'Wheels & Tires', icon: '🔩',
    base: 0.5,
    offroad: 1.0, overland: 0.8, expedition: 0.7, adventure: 0.7,
    tactical: 0.6, camping: 0.5, daily: 0.4,     touring: 0.4,
    picks: [
      { name: '17" Beadlock Wheel', brand: 'Method Race', price: 320 },
      { name: 'KO2 All-Terrain',    brand: 'BF Goodrich', price: 285 },
      { name: 'Wildpeak AT3W',      brand: 'Falken',      price: 240 },
    ],
  },
  {
    id: 'nav', label: 'Navigation & Comms', icon: '🧭',
    base: 0.3,
    expedition: 1.0, touring: 0.8, overland: 0.7, tactical: 0.6,
    adventure: 0.5,  camping: 0.4, offroad: 0.4,  daily: 0.2,
    picks: [
      { name: 'inReach Mini 2',     brand: 'Garmin',       price: 350 },
      { name: 'TREAD XL',          brand: 'Garmin',       price: 499 },
      { name: 'SPOT Gen4',         brand: 'SPOT',         price: 150 },
    ],
  },
]

type MissionKey = 'overland' | 'offroad' | 'expedition' | 'adventure' | 'camping' | 'daily' | 'tactical' | 'touring'

function rankCategories(mission: string | null, budget: number): RankedCategory[] {
  const key = (mission?.toLowerCase() ?? 'overland') as MissionKey
  return BASE_CATEGORIES
    .map(c => {
      let score = c.base
      const missionScore = c[key] as number | undefined
      if (missionScore != null) score += missionScore
      // Budget bonus for premium categories
      if (budget >= 15000 && ['suspension', 'armor', 'power'].includes(c.id)) score += 0.3
      if (budget <= 5000  && ['rtt', 'armor'].includes(c.id))                  score -= 0.4
      return {
        id:    c.id,
        label: c.label,
        icon:  c.icon,
        score,
        pct:   Math.round(Math.min(100, (Math.max(0, score) / 2.2) * 100)),
        picks: c.picks,
      }
    })
    .filter(c => c.score > 0.4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RecommendationsStep() {
  const mission = useBuildStore(s => s.mission)
  const budget  = useBuildStore(s => s.budget)
  const setStep = useBuildStore(s => s.setStep)

  const ranked = rankCategories(mission, budget)
  const missionLabel = mission
    ? mission.charAt(0).toUpperCase() + mission.slice(1)
    : 'Overland'
  const budgetFmt = budget >= 99999
    ? 'Unlimited'
    : '$' + budget.toLocaleString('en-US')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Eyebrow */}
      <div>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>STEP 04 / 05</p>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          letterSpacing: '0.04em', color: 'var(--text)',
        }}>
          RECOMMENDED LOADOUT
        </h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginTop: '4px' }}>
          Based on your <strong style={{ color: 'var(--orange)' }}>{missionLabel}</strong> mission profile
          and a <strong style={{ color: 'var(--orange)' }}>{budgetFmt}</strong> budget.
        </p>
      </div>

      {/* Category cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '12px',
      }}>
        {ranked.map((cat, idx) => (
          <div
            key={cat.id}
            style={{
              background: 'var(--carbon)',
              border: '1px solid rgba(255,85,31,0.12)',
              borderRadius: '4px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              position: 'relative',
            }}
          >
            {/* Priority badge */}
            {idx < 2 && (
              <span style={{
                position: 'absolute', top: 12, right: 12,
                fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                letterSpacing: '0.15em', color: '#4ade80',
                border: '1px solid rgba(74,222,128,0.3)',
                background: 'rgba(74,222,128,0.06)',
                padding: '2px 6px', borderRadius: '2px',
              }}>
                {idx === 0 ? 'TOP PICK' : 'PRIORITY'}
              </span>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                letterSpacing: '0.06em', color: 'var(--text)',
              }}>
                {cat.label}
              </span>
            </div>

            {/* Match bar */}
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', marginBottom: '5px',
                fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
                letterSpacing: '0.1em', color: 'var(--text-3)',
              }}>
                <span>MISSION MATCH</span>
                <span style={{ color: 'var(--orange)' }}>{cat.pct}%</span>
              </div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${cat.pct}%`,
                  background: cat.pct >= 80 ? 'var(--orange)' : cat.pct >= 50 ? 'rgba(255,85,31,0.6)' : 'rgba(255,85,31,0.3)',
                  borderRadius: '2px',
                  transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
                }} />
              </div>
            </div>

            {/* Product picks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {cat.picks.map(p => (
                <div key={p.name} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  paddingBottom: '5px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.78rem',
                      color: 'var(--text-2)', lineHeight: 1.3,
                    }}>{p.name}</div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                      letterSpacing: '0.1em', color: 'var(--text-3)',
                    }}>{p.brand}</div>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                    color: 'var(--orange)', flexShrink: 0, marginLeft: '8px',
                  }}>
                    ${p.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setStep(3)}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-3)',
            fontFamily: 'var(--font-tactical)', fontWeight: 600,
            fontSize: '0.75rem', letterSpacing: '0.14em',
            padding: '10px 20px', cursor: 'pointer', borderRadius: '2px',
            textTransform: 'uppercase',
          }}
        >
          ← BACK
        </button>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setStep(6)}
            className="btn btn-ghost btn-sm"
          >
            CONFIGURE MANUALLY
          </button>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => setStep(5)}
          >
            REVIEW BUILD
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: '4px' }}>
              <path d="M2 7h10M8 3l4 4-4 4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
