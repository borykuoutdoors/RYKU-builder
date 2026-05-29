'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useBuildStore } from '@/store/buildStore'
import StepBar from './StepBar'
import VehicleSelector from './VehicleSelector'
import MissionSelector from './MissionSelector'
import BudgetSelector from './BudgetSelector'
import RecommendationsStep from './RecommendationsStep'
import ReviewStep from './ReviewStep'
import Configurator from './Configurator'
import InstallerStep from './InstallerStep'

export default function BuildPlanner() {
  const step    = useBuildStore(s => s.step)
  const setStep = useBuildStore(s => s.setStep)
  const reduced = useReducedMotion()

  const slideVariants = {
    initial: reduced ? {} : { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit:    reduced ? {} : { opacity: 0, x: -60 },
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <StepBar />

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ height: '100%', overflow: 'auto' }}
            >
              <VehicleSelector />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ height: '100%', overflow: 'auto' }}
            >
              <MissionSelector />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ height: '100%', overflow: 'auto' }}
            >
              <BudgetSelector />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-4"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ height: '100%', overflow: 'auto' }}
            >
              <RecommendationsStep />
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step-5"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ height: '100%', overflow: 'auto' }}
            >
              <ReviewStep />
            </motion.div>
          )}

          {step === 7 && (
            <motion.div
              key="step-7"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ height: '100%', minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <InstallerStep />
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="step-6"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ height: '100%', minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* Configurator back bar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '10px 0 12px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '8px',
                flexShrink: 0,
              }}>
                <button
                  onClick={() => setStep(4)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-3)',
                    fontFamily: 'var(--font-tactical)', fontWeight: 600,
                    fontSize: '0.75rem', letterSpacing: '0.14em',
                    padding: '8px 16px', cursor: 'pointer', borderRadius: '2px',
                    textTransform: 'uppercase',
                  }}
                >
                  ← RECOMMENDATIONS
                </button>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
                  letterSpacing: '0.18em', color: 'var(--text-3)',
                }}>
                  MANUAL CONFIGURATION MODE
                </span>
                <button
                  onClick={() => setStep(5)}
                  className="btn btn-primary"
                  style={{ marginLeft: 'auto', fontSize: '0.75rem', padding: '8px 18px' }}
                >
                  REVIEW BUILD →
                </button>
              </div>
              <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <Configurator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
