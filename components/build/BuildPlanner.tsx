'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useBuildStore } from '@/store/buildStore'
import StepBar from './StepBar'
import VehicleSelector from './VehicleSelector'
import MissionSelector from './MissionSelector'
import BudgetSelector from './BudgetSelector'
import Configurator from './Configurator'

const slideVariants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -60 },
}

export default function BuildPlanner() {
  const step = useBuildStore(s => s.step)

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
              style={{ height: '100%', minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <Configurator />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
