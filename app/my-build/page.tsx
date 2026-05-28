'use client'

import Link from 'next/link'
import { useBuildStore } from '@/store/buildStore'

function formatCurrency(n: number) {
  return '$' + n.toLocaleString('en-US')
}

const MISSION_TIMELINE: Record<string, Array<{ label: string; desc: string }>> = {
  overland: [
    { label: 'SUSPENSION LIFT', desc: 'Foundation for clearance and capability' },
    { label: 'ROOF RACK',       desc: 'Expand payload with roof platform' },
    { label: 'RECOVERY GEAR',   desc: 'Winch, traction boards, strap kit' },
    { label: 'POWER SYSTEM',    desc: 'Dual battery or lithium station' },
  ],
  offroad: [
    { label: 'ARMOR & SKIDS',   desc: 'Protect underbody on technical terrain' },
    { label: 'SUSPENSION',      desc: 'Long-travel for rough obstacles' },
    { label: 'TIRES & WHEELS',  desc: 'Aggressive tread for traction' },
    { label: 'LIGHTING',        desc: 'Night-running LED spots' },
  ],
  camping: [
    { label: 'ROOFTOP TENT',    desc: 'Sleep elevated at any campsite' },
    { label: 'POWER STATION',   desc: 'Run appliances off-grid' },
    { label: 'ROOF RACK',       desc: 'Carry camp gear overhead' },
    { label: 'RECOVERY',        desc: 'Get unstuck on forest roads' },
  ],
  expedition: [
    { label: 'COMMS & NAV',     desc: 'Satellite communicator + GPS nav' },
    { label: 'POWER SYSTEM',    desc: 'Solar + dual battery redundancy' },
    { label: 'SUSPENSION',      desc: 'Long-range comfort and clearance' },
    { label: 'RECOVERY',        desc: 'Full kit for remote self-rescue' },
  ],
  default: [
    { label: 'SELECT VEHICLE',  desc: 'Choose your platform to begin' },
    { label: 'SET MISSION',     desc: 'Define your primary use case' },
    { label: 'SET BUDGET',      desc: 'Establish your build ceiling' },
    { label: 'EXPLORE LOADOUT', desc: 'Browse recommended gear categories' },
  ],
}

export default function MyBuildPage() {
  const vehicle    = useBuildStore(s => s.vehicle)
  const year       = useBuildStore(s => s.year)
  const trim       = useBuildStore(s => s.trim)
  const mission    = useBuildStore(s => s.mission)
  const budget     = useBuildStore(s => s.budget)
  const items      = useBuildStore(s => s.items)
  const buildName  = useBuildStore(s => s.buildName)
  const summaryNote = useBuildStore(s => s.summaryNote)
  const completed  = useBuildStore(s => s.completed)
  const gearTotal  = useBuildStore(s => s.gearTotal)
  const laborTotal = useBuildStore(s => s.laborTotal)
  const buildTotal = useBuildStore(s => s.buildTotal)
  const clearBuild = useBuildStore(s => s.clearBuild)
  const setStep    = useBuildStore(s => s.setStep)

  const gear    = gearTotal()
  const labor   = laborTotal()
  const total   = buildTotal()
  const remaining = budget - total
  const isOver  = remaining < 0
  const pct     = budget > 0 ? Math.min((total / budget) * 100, 100) : 0
  const itemArr = Object.values(items)

  const missionKey = (mission ?? 'default') as keyof typeof MISSION_TIMELINE
  const timeline   = MISSION_TIMELINE[missionKey] ?? MISSION_TIMELINE.default
  const missionLabel = mission ? mission.charAt(0).toUpperCase() + mission.slice(1) : null

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (!vehicle) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🛻</div>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5625rem',
          letterSpacing: '0.2em',
          color: 'var(--orange)',
          marginBottom: '12px',
        }}>
          NO ACTIVE BUILD
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
          letterSpacing: '0.04em',
          color: 'var(--text)',
          marginBottom: '14px',
        }}>
          YOUR BUILD AWAITS
        </h1>
        <p style={{
          color: 'var(--text-3)',
          fontSize: '0.9375rem',
          lineHeight: 1.6,
          maxWidth: '400px',
          marginBottom: '32px',
        }}>
          No vehicle configured yet. Start the build configurator to spec your
          rig and get personalized gear recommendations.
        </p>
        <Link href="/build">
          <button className="btn btn-primary btn-lg">
            ⚡ START YOUR BUILD
          </button>
        </Link>
      </div>
    )
  }

  // ── Dashboard ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', padding: '88px 0 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
            letterSpacing: '0.2em', color: 'var(--orange)', marginBottom: '6px',
          }}>
            {completed ? 'BUILD PROTOCOL ENGAGED' : 'BUILD IN PROGRESS'}
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            letterSpacing: '0.04em',
            color: 'var(--text)',
            lineHeight: 1,
          }}>
            {buildName}
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginTop: '6px' }}>
            {year} {vehicle.emoji} {vehicle.name} · {trim}
            {missionLabel && <> · <span style={{ color: 'var(--orange)' }}>{missionLabel}</span></>}
          </p>
        </div>

        {/* ── 4-stat strip ────────────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '10px',
          marginBottom: '28px',
        }}>
          {[
            { label: 'TOTAL BUDGET',  value: budget >= 99999 ? 'UNLIMITED' : formatCurrency(budget), color: 'var(--text)' },
            { label: 'BUILD COST',    value: formatCurrency(total), color: isOver ? '#f87171' : 'var(--orange)' },
            { label: 'REMAINING',     value: isOver ? `−${formatCurrency(Math.abs(remaining))}` : formatCurrency(remaining), color: isOver ? '#f87171' : 'var(--green)' },
            { label: 'GEAR ITEMS',    value: String(itemArr.length), color: 'var(--text)' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--carbon)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '4px',
              padding: '16px 20px',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                letterSpacing: '0.15em', color: 'var(--text-3)', marginBottom: '6px',
              }}>
                {stat.label}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '1.4rem',
                letterSpacing: '0.04em', color: stat.color,
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── Budget progress bar ─────────────────────────────────────────── */}
        {budget < 99999 && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
              letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: '6px',
            }}>
              <span>BUDGET UTILIZATION</span>
              <span style={{ color: isOver ? '#f87171' : 'var(--orange)' }}>{Math.round(pct)}%</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${pct}%`,
                background: isOver ? '#f87171' : pct >= 80 ? 'var(--orange)' : 'var(--green)',
                borderRadius: '2px',
                transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
              }} />
            </div>
          </div>
        )}

        {/* ── Two-column layout ───────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
        }}
          className="build-cols"
        >

          {/* LEFT col ──────────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Progress card */}
            <div style={{
              background: 'var(--carbon)',
              border: '1px solid rgba(255,85,31,0.12)',
              borderRadius: '4px',
              padding: '20px',
            }}>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: '1rem',
                letterSpacing: '0.08em', color: 'var(--text)', marginBottom: '16px',
              }}>
                BUILD PROGRESS
              </h3>
              {[
                { label: 'Vehicle',     done: !!vehicle },
                { label: 'Mission',     done: !!mission },
                { label: 'Budget',      done: budget > 0 },
                { label: 'Gear Items',  done: itemArr.length > 0 },
                { label: 'Review',      done: completed },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                    background: item.done ? 'var(--green)' : 'rgba(255,85,31,0.35)',
                    boxShadow: item.done ? '0 0 6px rgba(155,191,106,0.5)' : 'none',
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
                    letterSpacing: '0.12em', color: item.done ? 'var(--text-2)' : 'var(--text-3)',
                    flex: 1,
                  }}>
                    {item.label.toUpperCase()}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                    letterSpacing: '0.1em',
                    color: item.done ? 'var(--green)' : 'rgba(255,85,31,0.5)',
                  }}>
                    {item.done ? 'DONE' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>

            {/* Mission timeline */}
            <div style={{
              background: 'var(--carbon)',
              border: '1px solid rgba(255,85,31,0.12)',
              borderRadius: '4px',
              padding: '20px',
            }}>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: '1rem',
                letterSpacing: '0.08em', color: 'var(--text)', marginBottom: '16px',
              }}>
                {missionLabel ? `${missionLabel.toUpperCase()} LOADOUT SEQUENCE` : 'RECOMMENDED SEQUENCE'}
              </h3>
              {timeline.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '14px', padding: '8px 0',
                  borderBottom: i < timeline.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                    letterSpacing: '0.1em', color: 'var(--orange)',
                    flexShrink: 0, marginTop: '2px', width: '16px', textAlign: 'right',
                  }}>
                    0{i + 1}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-tactical)', fontWeight: 600,
                      fontSize: '0.8125rem', letterSpacing: '0.06em',
                      color: 'var(--text)', marginBottom: '2px',
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
                      letterSpacing: '0.06em', color: 'var(--text-3)',
                    }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT col ─────────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Vehicle render slot */}
            <div style={{
              background: 'var(--carbon)',
              border: '1px solid rgba(255,85,31,0.12)',
              borderRadius: '4px',
              padding: '24px',
              textAlign: 'center',
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}>
              <div style={{ fontSize: '4rem', lineHeight: 1, filter: 'drop-shadow(0 0 20px rgba(255,85,31,0.3))' }}>
                {vehicle.emoji}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '1.25rem',
                letterSpacing: '0.08em', color: 'var(--text)',
              }}>
                {year} {vehicle.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
                letterSpacing: '0.14em', color: 'var(--text-3)',
              }}>
                {trim}
              </div>
            </div>

            {/* Gear list */}
            <div style={{
              background: 'var(--carbon)',
              border: '1px solid rgba(255,85,31,0.12)',
              borderRadius: '4px',
              padding: '20px',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '16px',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: '1rem',
                  letterSpacing: '0.08em', color: 'var(--text)',
                }}>
                  GEAR LIST
                </h3>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                  letterSpacing: '0.12em', color: 'var(--text-3)',
                }}>
                  {itemArr.length} ITEMS
                </span>
              </div>

              {itemArr.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '24px 0',
                  color: 'var(--text-3)', fontSize: '0.8125rem',
                }}>
                  No gear added yet.{' '}
                  <Link href="/build" style={{ color: 'var(--orange)' }}>
                    Configure manually →
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {itemArr.map(item => (
                    <div key={item.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                      padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}>
                      <div>
                        <div style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                          color: 'var(--text-2)',
                        }}>
                          {item.name}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                          letterSpacing: '0.1em', color: 'var(--text-3)',
                        }}>
                          {item.brand} · {item.category}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
                        <div style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.6875rem',
                          color: 'var(--orange)',
                        }}>
                          {formatCurrency(item.price)}
                        </div>
                        {item.labor > 0 && (
                          <div style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                            letterSpacing: '0.08em', color: 'var(--text-3)',
                          }}>
                            +{formatCurrency(item.labor)} labor
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Totals */}
                  <div style={{ display: 'flex', gap: '16px', paddingTop: '12px', flexWrap: 'wrap' }}>
                    {[
                      { label: 'GEAR',  val: formatCurrency(gear) },
                      { label: 'LABOR', val: formatCurrency(labor) },
                      { label: 'TOTAL', val: formatCurrency(total), highlight: true },
                    ].map(row => (
                      <div key={row.label} style={{ flex: '1 1 80px' }}>
                        <div style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.45rem',
                          letterSpacing: '0.15em', color: 'var(--text-3)', marginBottom: '2px',
                        }}>
                          {row.label}
                        </div>
                        <div style={{
                          fontFamily: row.highlight ? 'var(--font-display)' : 'var(--font-mono)',
                          fontSize: row.highlight ? '1.1rem' : '0.75rem',
                          color: row.highlight ? (isOver ? '#f87171' : 'var(--orange)') : 'var(--text-2)',
                        }}>
                          {row.val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Operator notes */}
            {summaryNote && (
              <div style={{
                background: 'rgba(10,10,10,0.5)',
                border: '1px solid rgba(255,85,31,0.10)',
                borderRadius: '3px',
                padding: '16px 20px',
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                  letterSpacing: '0.15em', color: 'var(--text-3)', marginBottom: '8px',
                }}>
                  OPERATOR NOTES
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
                  {summaryNote}
                </p>
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/build" style={{ flex: '1 1 140px' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setStep(4)}
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem' }}
                >
                  CONTINUE BUILD
                </button>
              </Link>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  if (confirm('Reset your entire build? This cannot be undone.')) {
                    clearBuild()
                  }
                }}
                style={{ flex: '1 1 120px', fontSize: '0.75rem' }}
              >
                RESET BUILD
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .build-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
