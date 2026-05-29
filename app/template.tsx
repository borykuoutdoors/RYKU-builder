'use client'

import { motion, useReducedMotion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, filter: 'blur(14px) saturate(.7)' }}
      animate={reduced ? {} : { opacity: 1, filter: 'blur(0px) saturate(1)' }}
      exit={reduced ? {} : { opacity: 0, filter: 'blur(14px) saturate(.7)' }}
      transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}
