import React from 'react'

interface Props {
  children: React.ReactNode
  className?: string
}

export default function SectionEyebrow({ children, className = '' }: Props) {
  return (
    <span
      className={`eyebrow${className ? ` ${className}` : ''}`}
      style={{ display: 'block', marginBottom: '12px' }}
    >
      {children}
    </span>
  )
}
