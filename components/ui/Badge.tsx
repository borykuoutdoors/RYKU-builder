import React from 'react'

interface BadgeProps {
  variant: 'easy' | 'med' | 'hard' | 'popular' | 'budget' | 'cyan'
  children: React.ReactNode
}

/** Maps the prop variant to the CSS class defined in globals.css */
const VARIANT_CLASS: Record<BadgeProps['variant'], string> = {
  easy:    'badge-easy',
  med:     'badge-med',
  hard:    'badge-hard',
  popular: 'badge-pop',
  budget:  'badge-budget',
  cyan:    'badge-cyan',
}

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`badge ${VARIANT_CLASS[variant]}`}>
      {children}
    </span>
  )
}
