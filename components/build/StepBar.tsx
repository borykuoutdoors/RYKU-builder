'use client'

import { useBuildStore } from '@/store/buildStore'
import type { BuildStep } from '@/store/buildStore'

// ─── Step config ─────────────────────────────────────────────────────────────

interface Step {
  num: BuildStep
  label: string
}

const STEPS: Step[] = [
  { num: 1, label: 'VEHICLE'   },
  { num: 2, label: 'MISSION'   },
  { num: 3, label: 'BUDGET'    },
  { num: 4, label: 'CONFIGURE' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function StepBar() {
  const currentStep = useBuildStore(s => s.step)
  const setStep     = useBuildStore(s => s.setStep)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,85,31,0.10)',
        background: 'rgba(10,10,10,0.6)',
        backdropFilter: 'blur(12px)',
        gap: 0,
      }}
    >
      {STEPS.map((step, idx) => {
        const isDone    = currentStep > step.num
        const isActive  = currentStep === step.num
        const isClickable = isDone || isActive

        // Dot style
        let dotBg      = 'var(--carbon)'
        let dotBorder  = 'rgba(255,255,255,0.08)'
        let dotColor   = '#3a3a3a'

        if (isDone) {
          dotBg     = 'rgba(74,222,128,0.10)'
          dotBorder = '#4ade80'
          dotColor  = '#4ade80'
        } else if (isActive) {
          dotBg     = 'rgba(255,85,31,0.12)'
          dotBorder = '#FF551F'
          dotColor  = '#FF551F'
        }

        return (
          <div key={step.num} style={{ display: 'flex', alignItems: 'center' }}>
            {/* Connector line before (skip for first) */}
            {idx > 0 && (
              <div
                style={{
                  width: '40px',
                  height: '1px',
                  background: isDone
                    ? 'rgba(74,222,128,0.4)'
                    : isActive
                    ? 'rgba(255,85,31,0.25)'
                    : 'rgba(255,255,255,0.06)',
                  transition: 'background 0.3s',
                }}
              />
            )}

            {/* Step item */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: isClickable ? 'pointer' : 'default',
              }}
              onClick={isClickable ? () => setStep(step.num) : undefined}
            >
              {/* Dot */}
              <div
                className="step-dot"
                style={{
                  background: dotBg,
                  borderColor: dotBorder,
                  color: dotColor,
                  transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                {isDone ? (
                  // Checkmark SVG
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4l2.5 2.5L9 1"
                      stroke="#4ade80"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono), monospace' }}>
                    {step.num}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: isDone ? '#4ade80' : isActive ? '#FF551F' : '#3a3a3a',
                  transition: 'color 0.3s',
                  whiteSpace: 'nowrap',
                }}
              >
                {step.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
