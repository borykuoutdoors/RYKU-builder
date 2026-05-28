'use client'

import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(14px) saturate(.7)' }}
      animate={{ opacity: 1, filter: 'blur(0px) saturate(1)' }}
      exit={{ opacity: 0, filter: 'blur(14px) saturate(.7)' }}
      transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}
